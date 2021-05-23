import React, { useState, useCallback } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { HomeStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import CalibrationChart from "./CalibrationChart";
import CalibrationModePicker from "./CalibrationModePicker";
import TickContainer from "./TickContainer";
import WavelengthList from "./WavelengthList";
import { Svg, Line, Rect } from "react-native-svg";
import { useDispatch, useSelector } from "react-redux";
import * as CalibPt from "../../redux/reducers/calibration/calibration_point";
import {
  selectCalibrationPoints,
  modifyWavelength,
  removePoint,
  addOption,
  beginPlace,
  cancelPlace,
  editPlacement,
  setCalibrationPoints,
  setPreset,
} from "../../redux/reducers/calibration/calibration";
import { MAX_POINTS } from "../../redux/reducers/calibration/calibration_constants";

import { TouchableOpacity } from "react-native";

const CHART_HEIGHT = 200;
const CHART_MARGIN = 16;
const TICK_HEIGHT = 40;
const TICK_MARGIN = 4;
const TICK_WIDTH = 60;

export default function CalibrationScreen({ navigation }) {
  const calibrationPoints = useSelector(
    selectCalibrationPoints,
    (a, b) => false // TODO: fix hack
  );
  const dispatch = useDispatch();

  const addNewPointButton = () => {
    if (calibrationPoints.length < MAX_POINTS) {
      return (
        <Button
          title="Add point"
          color="black"
          style={styles.addPointButton}
          onPress={() => dispatch(addOption())}
        />
      );
    }
  };

  const [open, setOpen] = useState(false);
  const initialX = 100;
  const [activeX, setActiveX] = useState(initialX);

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
          activeWavelength={"399"}
          chartHeight={CHART_HEIGHT}
          tickHeight={TICK_HEIGHT}
          tickMargin={TICK_MARGIN}
          tickWidth={TICK_WIDTH}
          chartMargin={CHART_MARGIN}
          setActiveXPosition={setActiveX}
          activeXPosition={activeX}
          initialXPosition={initialX}
          previouslySetPoints={calibrationPoints.filter(CalibPt.hasBeenPlaced)}
        />
      </View>
      <View style={styles.picker}>
        <CalibrationModePicker open={open} setOpen={setOpen} />
      </View>

      <View>
        <WavelengthList
          calibrationPoints={calibrationPoints}
          setWavelengths={setCalibrationPoints}
          inputEnabled={!open}
          activeXPosition={activeX}
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
    zIndex: 30, // works on ios
    elevation: 30, // works on android
  },
  addPointButton: {
    backgroundColor: "green",
  },
});
