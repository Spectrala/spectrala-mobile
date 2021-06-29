import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import * as tf from "@tensorflow/tfjs";
import React, { useEffect, useState } from "react";
import { Camera } from "expo-camera";

/**
 * Initializes asynchronous app elements
 * @returns boolean, true if all elements are loaded.
 */

export default function loadAssets() {
  // const [tfReady, setTfReady] = useState(false);
  const [localLoadingComplete, setLocalLoadingComplete] = useState(false);

  // const loadingIsComplete = () => tfReady && localLoadingComplete;
  const loadingIsComplete = () => localLoadingComplete;

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
    // console.log("TF IS READY");
  };

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    loadLocalFonts();
    // loadTensorflow();
  }, []);

  return loadingIsComplete();
}
