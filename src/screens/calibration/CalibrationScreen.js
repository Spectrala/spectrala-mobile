import React, { useState } from "react";
import { Button, StyleSheet } from "react-native";
import { View, Card } from "react-native-ui-lib";
import CalibrationChart from "./CalibrationChart";
import CalibrationModePicker from "./CalibrationModePicker";
import WavelengthList from "./WavelengthList";
import { useDispatch, useSelector } from "react-redux";
import * as CalibPt from "../../redux/reducers/calibration/calibration_point";
import CameraView from "../camera/CameraView";
import {
  selectCalibrationPoints,
  addOption,
  setCalibrationPoints,
} from "../../redux/reducers/calibration/calibration";
import { MAX_POINTS } from "../../redux/reducers/calibration/calibration_constants";
import { Dimensions } from "react-native";

const CHART_HEIGHT = 200;
const CHART_MARGIN = 16;
const CHART_INSET = 30;
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

  const pointBeingPlaced = calibrationPoints.find((p) => p.isBeingPlaced);
  const pointIsBeingPlaced = !!pointBeingPlaced;
  const activeWavelength = pointIsBeingPlaced
    ? CalibPt.getWavelengthDescription(pointBeingPlaced)
    : "";

  const screenWidth = Dimensions.get("window").width;
  const calibrationWidth = screenWidth - 2 * CHART_INSET;
  const chartXFromCalibX = (calibX) => CHART_INSET + calibX * calibrationWidth;
  // TODO: beyond min behaves differently than beyond max.
  const calibXFromChartX = (chartX) =>
    Math.max(Math.min(1, (chartX - CHART_INSET) / calibrationWidth), 0);

  return (
    <View style={styles.container}>
      <Card style={styles.chart}>
        <CalibrationChart/>
      </Card>

      <View style={styles.picker}>
        <CalibrationModePicker open={open} setOpen={setOpen} />
      </View>

      <View>
        <WavelengthList
          calibrationPoints={calibrationPoints}
          setWavelengths={setCalibrationPoints}
          inputEnabled={!open}
          calibXFromChartX={calibXFromChartX}
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
    height: 300,
    marginBottom: 20,
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
    zIndex: 30, // works on ios
    elevation: 30, // works on android
  },
});
