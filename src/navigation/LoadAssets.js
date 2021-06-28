import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as tf from "@tensorflow/tfjs";
import React, { useEffect, useState } from "react";
import { Camera } from "expo-camera";

export default function Loader() {
  const [tfReady, setTfReady] = useState(false);
  const [hasCameraPermission, setHasCameraPermission] = useState(false);
  const [localLoadingComplete, setLocalLoadingComplete] = useState(false);

  const loadingIsComplete = () =>
    tfReady && hasCameraPermission && localLoadingComplete;

  const loadLocalFonts = async () => {
    await Font.loadAsync({
      Heebo: require("../../assets/fonts/Heebo/static/Heebo-Regular.ttf"),
      "Heebo-SemiBold": {
        uri: require("../../assets/fonts/Heebo/static/Heebo-SemiBold.ttf"),
        display: Font.FontDisplay.FALLBACK,
      },
    });
    setLocalLoadingComplete(true);
  };

  const loadTensorflow = async () => {
    await tf.ready();
    setTfReady(true);
  };

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestPermissionsAsync();
    setHasCameraPermission(status === "granted");
  };

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    loadLocalFonts();
    loadTensorflow();
    requestCameraPermission();
  }, []);

  return loadingIsComplete();
}
