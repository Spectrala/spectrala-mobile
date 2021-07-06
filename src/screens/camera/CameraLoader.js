import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { Camera } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import {
  updateFeed,
  selectCorners,
  selectAngle,
  selectReaderWidth,
  selectReaderLength,
  selectSecondCropBox,
} from "../../redux/reducers/video";
import * as jpeg from "jpeg-js";

export const CAMERA_VISIBILITY_OPTIONS = {
  full: "full",
  none: "none",
};

const getTextureDimensions = (scale) => {
  if (Platform.OS === "ios") {
    return {
      height: 1920 * scale,
      width: 1080 * scale,
    };
  } else {
    return {
      height: 1200 * scale,
      width: 1600 * scale,
    };
  }
};

const SCALE = 0.1;

const fullDims = getTextureDimensions(1);
const scaledDims = getTextureDimensions(SCALE);

/**
 * Get image tensors from the camera using tfjs-react-native:
 * https://js.tensorflow.org/api_react_native/latest/#cameraWithTensors
 *
 * A slightly outdated example implementation can be found here:
 * https://github.com/tafsiri/tfjs-expo-managed-example
 *
 * @returns camera view which feeds a stream to redux.
 */

const FLAG_PIXEL_OFFSET = -2;
const PADDING = 5;

export default function CameraLoader({ visibility, TensorCamera }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);

  const corners = useSelector(selectCorners, () => false);
  const boxAngle = useSelector(selectAngle);
  const width = useSelector(selectReaderWidth);
  const length = useSelector(selectReaderLength);

  const [previewImg, setPreviewImg] = useState(null);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const getPaddedRange = (coordinates, idx, padding, limit) => {
    const vals = coordinates.map((val) => val[idx]);
    const min = Math.min(...vals);
    const max = Math.max(...vals);
    return {
      min: Math.max(0, min - padding),
      max: Math.min(limit || Infinity, max + padding),
    };
  };

  const crudeSliceCrop = (img, coordinates, padding) => {
    const { width, height } = { width: img.shape[1], height: img.shape[0] };
    const yRng = getPaddedRange(coordinates, 0, padding, height);
    const xRng = getPaddedRange(coordinates, 1, padding, width);
    const sliceBegin = [yRng.min, xRng.min, 0];
    const sliceSize = [yRng.max - yRng.min, xRng.max - xRng.min, 3];
    return img.slice(sliceBegin, sliceSize);
  };

  async function tensorToImageUrl(imageTensor) {
    const [height, width] = imageTensor.shape;

    const buffer = await imageTensor.toInt().data();
    const frameData = new Uint8Array(width * height * 4);

    let offset = 0;
    for (let i = 0; i < frameData.length; i += 4) {
      frameData[i] = buffer[offset];
      frameData[i + 1] = buffer[offset + 1];
      frameData[i + 2] = buffer[offset + 2];
      frameData[i + 3] = 0xff;

      offset += 3;
    }

    const rawImageData = {
      data: frameData,
      width,
      height,
    };
    const jpegImageData = jpeg.encode(rawImageData, 75);
    const base64Encoding = tf.util.decodeString(jpegImageData.data, "base64");
    return base64Encoding;
  }

  const showTensor = async (tensor) => {
    
    const url = await tensorToImageUrl(tensor);//.mul(255));
    // console.log("data:image/jpeg;base64," + url);
    setPreviewImg(`data:image/jpeg;base64,${url}`);
  };

  const getRotatedFlaggedImage = (tensor) => {
    // Convert from 0-255 to 0-1
    const img = tensor.mul(1 / 255);

    // Shape is [yIndex, xIndex, 3 for rgb]
    const imgHeight = tensor.shape[0];
    const imgWidth = tensor.shape[1];

    // Array of indicies of corners of reader box
    const cornerIndicies = corners.map(({ x, y }) => [
      Math.round(y * imgHeight),
      Math.round(x * imgWidth),
    ]);

    // Add tensor holding "flags," or negative pixel values to later detect to find corners
    const sparseIndicies = cornerIndicies.map((arr) => [...arr, 0]);
    const sparseVals = Array(sparseIndicies.length).fill(FLAG_PIXEL_OFFSET);
    const flags = tf.sparseToDense(sparseIndicies, sparseVals, tensor.shape);
    const imgFlagged = img.add(flags);

    // Get a "crude" take on a cropped image, unaccounting for rotation
    const imgCrude = crudeSliceCrop(imgFlagged, cornerIndicies, PADDING);

    showTensor(imgCrude);

    // Pad the crude image. This allows enough room (in any case) for the rotation.
    const crudeHeight = imgCrude.shape[0];
    const crudeWidth = imgCrude.shape[1];
    const side = Math.max(crudeHeight, crudeWidth);
    const getPad = (x) => Math.round(Math.max(side - x, 0) / 2) + PADDING;
    const padHoriz = Array(2).fill(getPad(crudeWidth));
    const padVert = Array(2).fill(getPad(crudeHeight));
    // Pad and make tensor 4d because rotateWithOffset requires 4d.
    const imgPad = tf.pad(imgCrude, [padVert, padHoriz, [0, 0]]).expandDims();

    // Rotate the padded image such that the reader box is vertical
    // (axis with the dots going up and down)
    const rotateRadians = (boxAngle * Math.PI) / 180;
    const imgRotated = tf.image.rotateWithOffset(imgPad, rotateRadians);

    // Reduce to 3 dimensions for rest of operations
    const imgRotated3d = imgRotated.squeeze();

    return imgRotated3d;
  };

  const finishIt = async (imgRotated) => {
    // Find the flags previously put in the image and crop around them
    const maskFlags = imgRotated.less([0]).asType("bool");
    const flagCoordinates = await tf.whereAsync(maskFlags);
    const flagCoordArr = await flagCoordinates.slice([0, 1], [-1, 2]).array();
    const shapedImg = crudeSliceCrop(imgRotated, flagCoordArr, 0);
  };

  const handleCameraStream = (images, updatePreview, gl) => {
    const loop = async () => {
      const rotatedImg = tf.tidy(() => {
        const nextImageTensor = images.next().value;
        if (nextImageTensor) {
          return getRotatedFlaggedImage(nextImageTensor);
        }
        return null;
      });
      if (rotatedImg) {
        finishIt(rotatedImg);
      }
      requestAnimationFrame(loop);
    };
    loop();
  };

  return (
    <>
      {previewImg && (
        <Image
          style={styles.image}
          source={{
            uri: previewImg,
          }}
          resizeMode="contain"
        />
      )}
      {hasCameraPermission && (
        <TensorCamera
          style={styles.camera}
          type={cameraType}
          zoom={0}
          cameraTextureHeight={fullDims.height}
          cameraTextureWidth={fullDims.width}
          resizeHeight={scaledDims.height}
          resizeWidth={scaledDims.width}
          resizeDepth={3}
          onReady={handleCameraStream}
          autorender={true}
        />
      )}
    </>
  );
}

CameraLoader.propTypes = {
  TensorCamera: PropTypes.any.isRequired,
};

const styles = StyleSheet.create({
  camera: {
    // position: "absolute",
    // left: 0,
    // top: 0,
    width: "100%",
    aspectRatio: scaledDims.width / scaledDims.height,
  },
  image: {
    paddingHorizontal: 10,
    borderWidth: 2,
    borderColor: "black",
    width: "100%",
    height: 250,
  },
});
