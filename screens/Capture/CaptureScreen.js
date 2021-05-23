import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { HomeStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import CaptureChart from "./CaptureChart";
import { TouchableOpacity } from "react-native-gesture-handler";
import ModeSwitcher from "./ModeSwitcher";
import CapturedList from "./CapturedList";
import { SafeAreaView } from "react-native";

const CHART_HEIGHT = 200;
const CHART_MARGIN = 16;
const MODE_BUTTON_HEIGHT = 24;
const CAPTURE_BUTTON_RADIUS = 38;

export default function CaptureScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <CaptureChart/>
      </View>
      <ModeSwitcher />
      <CapturedList />
      <View style={styles.captureContainer}>
        <TouchableOpacity style={styles.captureButton}></TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  chart: {
    width: "100%",
    height: CHART_HEIGHT,
  },
  modeContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignContent: "center",
  },
  modeButton: {
    justifyContent: "center",
    height: MODE_BUTTON_HEIGHT,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  captureContainer: {
    backgroundColor: "gray",
    height: 80,
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  captureButton: {
    borderRadius: CAPTURE_BUTTON_RADIUS,
    width: CAPTURE_BUTTON_RADIUS * 2,
    height: CAPTURE_BUTTON_RADIUS * 2,
    borderWidth: 3,
    top: -CAPTURE_BUTTON_RADIUS * 0.618,
    backgroundColor: "white",
  },
});
