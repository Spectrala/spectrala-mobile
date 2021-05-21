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
  const TEST_CALIB_POINTS = [
    { id: 0, wavelength: 200, isLocked: false },
    { id: 1, wavelength: 280, isLocked: false },
    { id: 2, wavelength: 330, isLocked: false },
    { id: 3, wavelength: 402, isLocked: false },
  ];

  const MAX_POINTS = 5;

  const [calibrationPoints, setCalibrationPoints] = useState(TEST_CALIB_POINTS);

  const addNewPoint = () => {
    const id = Math.max(...calibrationPoints.map((x) => x.id)) + 1;
    setCalibrationPoints([
      ...calibrationPoints,
      { id: id, wavelength: "", isLocked: false },
    ]);
  };

  const addNewPointButton = () => {
    if (calibrationPoints.length < MAX_POINTS) {
      return (
        <Button
          title="Add point"
          color="black"
          style={styles.addPointButton}
          onPress={addNewPoint}
        />
      );
    }
  };

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
          wavelengths={calibrationPoints}
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
      <View>
        <WavelengthList
          wavelengths={calibrationPoints}
          setWavelengths={setCalibrationPoints}
        />
      </View>
      {addNewPointButton()}
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
    zIndex: 3, // works on ios
    elevation: 3, // works on android
  },
  addPointButton: {
    backgroundColor: "green",
  },
});
