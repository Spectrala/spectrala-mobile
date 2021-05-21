import React, { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { HomeStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import CalibrationChart from "./CalibrationChart";
import CalibrationModePicker from "./CalibrationModePicker";
import TickContainer from "./TickContainer";
import WavelengthList from "./WavelengthList";
import { Svg, Line, Rect } from "react-native-svg";

const CHART_HEIGHT = 200;
const CHART_MARGIN = 16;
const TICK_HEIGHT = 40;
const TICK_MARGIN = 4;
const TICK_WIDTH = 60;

export default function CalibrationScreen({ navigation }) {
  const WAVELENGTHS = [
    { wavelength: 200 },
    { wavelength: 280 },
    { wavelength: 330 },
    { wavelength: 402 },
  ];

  const [wavelengths, setWavelengths] = useState(WAVELENGTHS);

  return (
    <View style={styles.container}>
      <View style={styles.chart}>
        <CalibrationChart margin={CHART_MARGIN} />
      </View>
      <View
        style={{
          ...styles.chart,
          ...styles.ticks,
        }}
      >
        <TickContainer
          chartHeight={CHART_HEIGHT}
          tickHeight={TICK_HEIGHT}
          tickMargin={TICK_MARGIN}
          tickWidth={TICK_WIDTH}
          chartMargin={CHART_MARGIN}
        />
      </View>
      <View style={styles.picker}>
        <CalibrationModePicker />
      </View>
      <WavelengthList
        wavelengths={wavelengths}
        setWavelengths={setWavelengths}
      />
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
    height: TICK_HEIGHT + CHART_HEIGHT,
    marginEnd: TICK_HEIGHT + CHART_HEIGHT,
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
  picker: {
    marginTop: TICK_HEIGHT,
  },
});
