import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Camera } from "expo-camera";
import * as tf from "@tensorflow/tfjs";
import { cameraWithTensors } from "@tensorflow/tfjs-react-native";

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

const TensorCamera = cameraWithTensors(Camera);

export default function CameraLoader() {
  const [tfReady, setTfReady] = useState(false);
  console.log("USE TF");

  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.front);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasCameraPermission(status === "granted");
  };

  const loadTensorflow = async () => {
    await tf.ready();
    setTfReady(true);
    console.log("TF IS READY");
  };

  useEffect(() => {
    requestCameraPermission();
    loadTensorflow();
  }, []);

  const handleTensor = async (tensor) => {
    // console.log(tensor);
    

    
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
    hasCameraPermission &&
    tfReady && (
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

  return (
    hasCameraPermission && (
      <View style={{ ...styles.camera, backgroundColor: "lime" }} />
    )
  );
}

const styles = StyleSheet.create({
  camera: {
    // position: "absolute",
    // left: 0,
    // top: 0,
    width: "100%",
    aspectRatio: dimensions.width / dimensions.height,
  },
});
