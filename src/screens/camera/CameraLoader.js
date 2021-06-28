import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";

const TensorCamera = cameraWithTensors(Camera);

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

export default function CameraLoader() {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasCameraPermission(status === "granted");
  };

  useEffect(() => {
    requestCameraPermission();
  }, []);


  const handleTensor = (tensor) => {

    console.log(tensor);
  }
  const handleCameraStream = (images, updatePreview, gl) => {
    const loop = async () => {
      const nextImageTensor = images.next().value;
      if (nextImageTensor) {
        handleTensor(nextImageTensor)
      }
      requestAnimationFrame(loop);
    };
    loop();
  };

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

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
  },
  cameraContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    height: "60%",
    backgroundColor: "#fff",
  },
  camera: {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    aspectRatio: dimensions.width / dimensions.height,
    zIndex: 1,
    borderWidth: 1,
    borderColor: "black",
    borderRadius: 0,
  },
});
