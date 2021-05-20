import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { HomeStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import CalibrationChart from "./CalibrationChart";
import CalibrationModePicker from "./CalibrationModePicker";
import TickContainer from "./TickContainer";
import { Svg, Line, Rect } from "react-native-svg";

const CHART_HEIGHT = 200;

export default function CalibrationScreen({ navigation }) {
  const calibrationLine = (wavelength) => {
    return (
      <Svg height="100%" width="100%">
        <Line
          x1={p1.x + CIRCLE_RADIUS}
          y1={p1.y + CIRCLE_RADIUS}
          x2={p2.x + CIRCLE_RADIUS}
          y2={p2.y + CIRCLE_RADIUS}
          stroke="black"
          strokeWidth="2"
        />
      </Svg>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <CalibrationChart />
      </View>
      <View style={{ ...styles.chart, ...styles.ticks }}>
        <TickContainer height={CHART_HEIGHT} />
      </View>
      <CalibrationModePicker />
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
  ticks: {
    position: "absolute",
    top: 0,
    left: 0,
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
