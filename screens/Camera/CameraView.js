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
import { decode } from "base-64";

// getPixel('./bg.png', 10, 10); // [255, 255, 255, 0];

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
function Uint8ClampedArrayFromBase64(base64_string) {
  return Uint8ClampedArray.from(decode(base64_string), c => c.charCodeAt(0));
  // const byteCharacters = decode(base64data);
  // console.log(byteCharacters);
  // const byteNumbers = new Array(byteCharacters.length);
  // for (let i = 0; i < byteCharacters.length; i++) {
  //   byteNumbers[i] = byteCharacters.charCodeAt(i);
  // }
  // return new Uint8ClampedArray(byteNumbers);
  // Buffer(base64data).toString('base64')
}

/**
 * Mimics ImageData from a canvas context
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
 */
function ImageDataObjectFromPhoto(photo) {
  return {
    data: Uint8ClampedArrayFromBase64(photo.base64),
    height: photo.height,
    width: photo.width,
  };
}

export default function CameraView(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  let interval;
  let readyForNextFrame = false;

  const takeAndSendFrame = async () => {
    if (cameraRef && readyForNextFrame) {
      let photo = await cameraRef.takePictureAsync({
        base64: true,
        quality: PHOTO_QUALITY,
      });
      const imageData = ImageDataObjectFromPhoto(photo);

      console.log(imageData.data.length);
      // readyForNextFrame = true;
    }
  };

  const requestPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const setupCamera = () => {
    if (!interval) {
      readyForNextFrame = true;
      interval = setInterval(
        takeAndSendFrame,
        props.captureIntervalSeconds * 1000
      );
    }
  };

  useEffect(() => {
    requestPermission();
    return () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
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
