import React, { useState, useEffect, useCallback } from "react";
import { Button, StyleSheet, Image } from "react-native";
import { View, Card } from "react-native-ui-lib";
import CalibrationChart from "./CalibrationChart";
import CalibrationModePicker from "./CalibrationModePicker";
import WavelengthList from "./WavelengthList";
import { useDispatch, useSelector } from "react-redux";
import * as CalibPt from "../../redux/reducers/calibration/calibration_point";
import {
  selectCalibrationPoints,
  addOption,
  setCalibrationPoints,
  selectActivePointPlacement,
} from "../../redux/reducers/calibration/calibration";
import { selectPreviewImg } from "../../redux/reducers/video";
import { MAX_POINTS } from "../../redux/reducers/calibration/calibration_constants";
import { Dimensions } from "react-native";
import CameraLoader from "../../components/CameraLoader";

const CHART_INSET = 60;

export default function CalibrationScreen({ navigation }) {
  const calibrationPoints = useSelector(
    selectCalibrationPoints,
    (a, b) => false // TODO: fix hack
  );
  const previewImage = useSelector(selectPreviewImg);
  const isActivelyPlacing = useSelector(selectActivePointPlacement);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(setCapturesFrames({ value: true }));
  // });

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
    <>
      <View style={{ ...styles.container, opacity: 0 }}>
        <CameraLoader collectsFrames={!isActivelyPlacing} />
      </View>

      <View style={styles.container}>
        <Card style={styles.previewImageCard}>
          <Image style={styles.previewImage} source={{ uri: previewImage }} />
        </Card>

        <Card style={styles.chart}>
          <CalibrationChart horizontalInset={ CHART_INSET}/>
        </Card>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    height: "100%",
  },
  chart: {
    width: "100%",
    height: 300,
    marginBottom: 20,
  },
  previewImageCard: {
    width: "100%",
    height: 100,
    marginBottom: 20,
  },
  previewImage: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: CHART_INSET,
    resizeMode: "stretch",
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
