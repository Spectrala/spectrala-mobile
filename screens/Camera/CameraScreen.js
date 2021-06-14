import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { HomeStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import DraggablePointsContainer from "./DraggablePointsContainer";
import CameraView from "./CameraView";

// TODO: stop using expo in order to figure out the camera stuff
export default function CameraScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <CameraView captureIntervalSeconds={5} isActive={false} />
      <DraggablePointsContainer />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
  pointsContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
  },
  cameraView: {
    height: "100%",
    width: "100%",
    display: "flex",
  },
});
