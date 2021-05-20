import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";

import { HomeStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import CalibrationChart from "./CalibrationChart";

export default function CaptureScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <CalibrationChart />
      </View>
      <Text style={styles.title}>We are gong to CALIBRATE right NOW</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  chart: {
    width: "100%",
    height: 200,
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
});
