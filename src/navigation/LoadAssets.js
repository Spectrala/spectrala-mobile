import { loadAsync as expoFontLoadAsync, FontDisplay } from "expo-font";
import { ready as tfReady } from "@tensorflow/tfjs";
import { useEffect, useState } from "react";

/**
 * Initializes asynchronous app elements
 * @returns boolean, true if all elements are loaded.
 */

export default function loadAssets() {
  const [tfIsReady, setTfReady] = useState(false);
  const [localLoadingComplete, setLocalLoadingComplete] = useState(false);

  const loadingIsComplete = () => tfIsReady && localLoadingComplete;
  // const loadingIsComplete = () => localLoadingComplete;

  const loadLocalFonts = async () => {
    await expoFontLoadAsync({
      Heebo: require("../../assets/fonts/Heebo/static/Heebo-Regular.ttf"),
      "Heebo-SemiBold": {
        uri: require("../../assets/fonts/Heebo/static/Heebo-SemiBold.ttf"),
        display: FontDisplay.FALLBACK,
      },
    });
    setLocalLoadingComplete(true);
  };

  const loadTensorflow = async () => {
    await tfReady();
    setTfReady(true);
  };

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    loadLocalFonts();
    loadTensorflow();
  }, []);

  return loadingIsComplete();
}
