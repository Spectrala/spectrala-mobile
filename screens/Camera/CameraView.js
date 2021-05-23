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
import { decode } from 'base-64';


// getPixel('./bg.png', 10, 10); // [255, 255, 255, 0];

/**
 * Taken from https://stackoverflow.com/a/64586990
 * @param {string} base64data image data, without 'data:image/png;base64,'
 */
function Uint8ClampedArrayFromBase64(base64data) {
  const byteCharacters = decode(base64data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Uint8ClampedArray(byteNumbers);
}


/**
 * Mimics ImageData from a canvas context
 * https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData
 */
function ImageDataObjectFromPhoto(photo) {
  console.log("photo", photo);

  return {
    data: Uint8ClampedArrayFromBase64(photo.base64),
    height: photo.height,
    width: photo.width,
  }
}



export default function CameraView(props) {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  let interval;

  const takeAndSendFrame = async () => {
    if (cameraRef) {
      let photo = await cameraRef.takePictureAsync({ base64: true });
      console.log("photo", ImageDataObjectFromPhoto(photo));
    }
  };

  const requestPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    requestPermission();
    if (!interval) {
      interval = setInterval(
        takeAndSendFrame,
        props.captureIntervalSeconds * 1000
      );
    }
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
