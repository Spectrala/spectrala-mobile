import React from "react";
import { StyleSheet, Image, View, Button } from "react-native";
import CalibrationChart from "./CalibrationChart";
import { useSelector, useDispatch } from "react-redux";
import { selectActivePointPlacement } from "../../redux/reducers/Calibration";
import { toggleIsFlipped } from "../../redux/reducers/ReaderBox";
import {
  selectPreviewImg,
  resetIntensityArrayHistory,
} from "../../redux/reducers/SpectrumFeed";
import CameraLoader from "../../components/CameraLoader";
import { useTheme } from "@react-navigation/native";
const CHART_INSET = 24;

export default function CalibrationScreen() {
  const previewImage = useSelector(selectPreviewImg);
  const isActivelyPlacing = useSelector(selectActivePointPlacement);
  const dispatch = useDispatch();
  const { colors } = useTheme();

  return (
    <>
      <View style={{ ...styles.container, opacity: 0 }}>
        <CameraLoader collectsFrames={!isActivelyPlacing} />
      </View>

      <View
        style={{ ...styles.container, backgroundColor: colors.background }}
      >
        <Image
          style={styles.previewImage}
          fadeDuration={0}
          source={{ uri: previewImage }}
        />
        <Button
          title="Flip Image"
          color={colors.text}
          onPress={() => {
            dispatch(toggleIsFlipped());
            dispatch(resetIntensityArrayHistory());
          }}
          style={styles.flipButton}
        />
        <CalibrationChart horizontalInset={CHART_INSET} />
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
  previewImage: {
    width: "100%",
    height: 100,
    resizeMode: "stretch",
  },
  flipButton: {
    width: "40%",
    height: 40,
    alignSelf: "center",
    marginBottom: 20,
  },
});
