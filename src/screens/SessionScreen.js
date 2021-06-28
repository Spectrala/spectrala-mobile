import React, { useCallback } from "react";
import { View } from "react-native-ui-lib";
import CameraScreen from "./camera/CameraScreen";
import CaptureScreen from "./capture/CaptureScreen";
import CalibrationScreen from "./calibration/CalibrationScreen";
import { StyleSheet } from "react-native";
import CameraView from "./camera/CameraView";

export default function SessionScreen({ route }) {
  const screenOptions = route.params?.screenOptions;

  const getBody = useCallback(() => {
    switch (screenOptions.name) {
      case "camera":
        return <CameraScreen />;
      case "calibration":
        return <CalibrationScreen />;
      case "capture":
        return <CaptureScreen />;
      default:
        console.error(`Received invalid screen option ${screenOptions.name}`);
        return null;
    }
  }, [screenOptions]);

  return (
    <View style={styles.container}>
      <View style={styles.cameraContainer}>
        <CameraView visibility={screenOptions.cameraVisibility} />
      </View>
      {getBody()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  cameraContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
});
