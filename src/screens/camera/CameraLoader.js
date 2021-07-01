import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
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

const dimensions = getTextureDimensions(SCALE);

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

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const handleTensor = async (tensor) => {
    const img = tensor.mul(1 / 255);
    const imgWidth = tensor.shape[0];
    const imgHeight = tensor.shape[1];

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
    const yVals = cornerIndicies.map((vec) => vec[0]);
    const xVals = cornerIndicies.map((vec) => vec[1]);
    const xRng = { min: Math.min(...xVals), max: Math.max(...xVals) };
    const yRng = { min: Math.min(...yVals), max: Math.max(...yVals) };
    const xRngP = {
      min: Math.max(0, xRng.min - PADDING),
      max: Math.min(imgWidth, xRng.max + PADDING),
    };
    const yRngP = {
      min: Math.max(0, yRng.min - PADDING),
      max: Math.min(imgHeight, yRng.max + PADDING),
    };
    const sliceBegin = [yRngP.min, xRngP.min, 0];
    const sliceSize = [yRngP.max - yRngP.min, xRngP.max - xRngP.min, 3];
    console.log(imgFlagged, sliceBegin, sliceSize);
    const imgCrude = imgFlagged.slice(sliceBegin, sliceSize);

    // tensor.print();
  };

  const handleCameraStream = (images, updatePreview, gl) => {
    const loop = async () => {
      const nextImageTensor = images.next().value;
      if (nextImageTensor) {
        handleTensor(nextImageTensor);
      }
      requestAnimationFrame(loop);
    };
    loop();
  };

  // console.log(dimensions);

  return (
    hasCameraPermission && (
      <TensorCamera
        style={styles.camera}
        type={cameraType}
        zoom={0}
        cameraTextureHeight={dimensions.height}
        cameraTextureWidth={dimensions.width}
        resizeHeight={dimensions.height}
        resizeWidth={dimensions.width}
        resizeDepth={3}
        onReady={handleCameraStream}
        autorender={true}
      />
    )
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
    aspectRatio: dimensions.width / dimensions.height,
  },
});
