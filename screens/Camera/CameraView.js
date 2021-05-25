import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AppState,
  Image,
} from "react-native";
import { Camera } from "expo-camera";
import { PropTypes } from "prop-types";
import * as jpeg from "jpeg-js";
import { extractPixelData } from "./CameraUtil";
import { useDispatch, useSelector } from "react-redux";
import { selectLineCoords, updateFeed } from "../../redux/reducers/video";
import { Buffer } from "buffer";

/**
 * Quality of photos taken from expo camera.
 * https://docs.expo.io/versions/latest/sdk/camera/
 * quality (number) -- Specify the quality of compression,
 * from 0 to 1. 0 means compress for small size, 1 means
 * compress for maximum quality.
 */
const PHOTO_QUALITY = 0;

/**
 * Taken from https://stackoverflow.com/a/64586990
 * @param {string} base64data image data, without 'data:image/png;base64,'
 */
// function uint8ClampedArrayFromBase64(base64_string) {
//   return Uint8ClampedArray.from(decode(base64_string), (c) => c.charCodeAt(0));
// }

function imageToClamped(rawImageData) {
  const { width, height, data } = jpeg.decode(rawImageData, {
    useTArray: true,
  });
  // Drop the alpha channel info for mobilenet
  const buffer = new Uint8Array(width * height * 3);
  let offset = 0; // offset into original data
  for (let i = 0; i < buffer.length; i += 3) {
    buffer[i] = data[offset];
    buffer[i + 1] = data[offset + 1];
    buffer[i + 2] = data[offset + 2];
    offset += 4;
  }
  return buffer;
}

function imageDataObjectFromRandom() {
  const width = 640;
  const height = 480;
  const totalEle = width * height * 4;
  const rands = Array.from({ length: totalEle }, () =>
    Math.floor(Math.random() * 255)
  );

  return {
    data: Uint8ClampedArray.from(rands),
    height: height,
    width: width,
  };
}

/**
 * Mimics ImageData from a canvas context
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
 */
function imageDataObjectFromPhoto(photo) {
  const buf = Buffer.from(photo.base64, "base64");

  return {
    data: imageToClamped(buf),
    height: photo.height,
    width: photo.width,
  };
}

export default function CameraView(props) {
  const calibCoords = useSelector(selectLineCoords);
  const dispatch = useDispatch();

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  const [interval, setLocalInterval] = useState(null);
  const [readyForNextFrame, setReadyForNextFrame] = useState(false);

  const sendFrame = async () => {
    if (
      !calibCoords ||
      calibCoords.lowX === null ||
      calibCoords.lowY === null ||
      calibCoords.highX === null ||
      calibCoords.highY === null
    ) {
      return;
    }
  };

  const takeAndSendFrame = async () => {
    if (cameraRef) {
      // let photo = await cameraRef.takePictureAsync({
      //   base64: true,
      //   quality: PHOTO_QUALITY,
      // });
      // const imgData = imageDataObjectFromPhoto(photo);
      // console.log(imgData);

      // Data is of different length each time. Must do jpeg decoding.
      // console.log(imageData.data.length);

      dispatch(
        updateFeed({
          value: extractPixelData(
            imageDataObjectFromRandom(),
            calibCoords.lowX,
            calibCoords.lowY,
            calibCoords.highX,
            calibCoords.highY
          ),
        })
      );

      setReadyForNextFrame(true);
    }
  };

  const requestPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const setupCamera = () => {
    if (!interval) {
      setReadyForNextFrame(true);
      setLocalInterval(
        setInterval(takeAndSendFrame, props.captureIntervalSeconds * 1000)
      );
    }
  };

  useEffect(() => {
    requestPermission();
    return () => {
      if (interval) {
        clearInterval(interval);
        setLocalInterval(null);
      }
    };
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }
  return (
    <View style={{ ...styles.container, opacity: props.isActive ? 1.0 : 0 }}>
      <Camera
        style={styles.camera}
        type={type}
        ref={(ref) => {
          setCameraRef(ref);
        }}
        onCameraReady={setupCamera}
      />
    </View>
  );
}

CameraView.propTypes = {
  captureIntervalSeconds: PropTypes.number.isRequired,
  onCaptureFrame: PropTypes.func.isRequired,
  isActive: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: "transparent",
    flexDirection: "row",
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: "flex-start",
    alignItems: "center",
    elevation: 30,
    zIndex: 30,
  },
  text: {
    fontSize: 18,
    color: "white",
  },
});
