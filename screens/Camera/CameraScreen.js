import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { HomeStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import DraggablePointsContainer from "./DraggablePointsContainer";

export default function CameraScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <DraggablePointsContainer style={styles.pointsContainer} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});
