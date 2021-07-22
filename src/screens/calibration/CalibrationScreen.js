import React from "react";
import { StyleSheet, Image, View } from "react-native";
import Button from "react-native-ui-lib/button";
import Card from "react-native-ui-lib/card";
import CalibrationChart from "./CalibrationChart";
import { useSelector, useDispatch } from "react-redux";
import { selectActivePointPlacement } from "../../redux/reducers/Calibration";
import { toggleIsFlipped } from "../../redux/reducers/ReaderBox";
import {
  selectPreviewImg,
  resetIntensityArrayHistory,
} from "../../redux/reducers/SpectrumFeed";
import CameraLoader from "../../components/CameraLoader";
const CHART_INSET = 24;

export default function CalibrationScreen() {
  const previewImage = useSelector(selectPreviewImg);
  const isActivelyPlacing = useSelector(selectActivePointPlacement);
  const dispatch = useDispatch();

  return (
    <>
      <View style={{ ...styles.container, opacity: 0 }}>
        <CameraLoader collectsFrames={!isActivelyPlacing} />
      </View>

      <View style={styles.container}>
        <Card style={styles.previewImageCard}>
          <Image
            style={styles.previewImage}
            fadeDuration={0}
            source={{ uri: previewImage }}
          />
        </Card>
        <Button
          label="Flip image"
          onPress={() => {
            dispatch(toggleIsFlipped());
            dispatch(resetIntensityArrayHistory());
          }}
          style={styles.flipButton}
        />
        <Card style={styles.chart}>
          <CalibrationChart horizontalInset={CHART_INSET} />
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
  flipButton: {
    width: "40%",
    height: 40,
    color: "white",
    alignSelf: "center",
    marginBottom: 20,
  },
});
