import React from "react";
import { StyleSheet, Image } from "react-native";
import { View, Card, Button, Colors } from "react-native-ui-lib";
import CaptureChart from "./CaptureChart";
import { useSelector, useDispatch } from "react-redux";
import { selectActivePointPlacement } from "../../redux/reducers/Calibration";
import { toggleIsFlipped } from "../../redux/reducers/ReaderBox";
import {
  selectPreviewImg,
  resetIntensityArrayHistory,
  selectIntensityChart,
} from "../../redux/reducers/SpectrumFeed";
import CameraLoader from "../../components/CameraLoader";
import { TouchableOpacity } from "react-native";
const CHART_INSET = 24;
const INNER_CIRCLE_SIZE = 70;
const CIRCLE_RING_SPACE = 10;

export default function CaptureScreen() {
  const previewImage = useSelector(selectPreviewImg);
  const intensityChart = useSelector(selectIntensityChart);
  const dispatch = useDispatch();

  return (
    <>
      <View style={{ ...styles.container, opacity: 0 }}>
        <CameraLoader collectsFrames />
      </View>

      <View style={styles.container}>
        <Card style={styles.previewImageCard}>
          <Image
            style={styles.previewImage}
            fadeDuration={0}
            source={{ uri: previewImage }}
          />
        </Card>
        <Card style={styles.chart}>
          <CaptureChart horizontalInset={CHART_INSET} data={intensityChart} />
        </Card>
        <View style={styles.captureButtonContainer}>
          <TouchableOpacity style={styles.captureButtonArea}>
            <View style={styles.cameraCircle} />
          </TouchableOpacity>
        </View>
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
    height: 30,
  },
  previewImageCard: {
    width: "100%",
    height: 100,
  },
  previewImage: {
    flex: 1,
    marginBottom: 20,
    marginHorizontal: CHART_INSET,
    resizeMode: "stretch",
  },
  captureButtonContainer: {
    height: INNER_CIRCLE_SIZE,
    width: "100%",
    alignItems: "center",
  },
  captureButtonArea: {
    height: INNER_CIRCLE_SIZE + CIRCLE_RING_SPACE,
    width: INNER_CIRCLE_SIZE + CIRCLE_RING_SPACE,
    borderRadius: (CIRCLE_RING_SPACE + INNER_CIRCLE_SIZE) / 2,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.primary,
  },
  cameraCircle: {
    width: INNER_CIRCLE_SIZE,
    height: INNER_CIRCLE_SIZE,
    backgroundColor: Colors.primary,
    borderRadius: INNER_CIRCLE_SIZE / 2,
  },
});
