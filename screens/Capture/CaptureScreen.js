import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { HomeStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import CaptureChart from "./CaptureChart";
import { TouchableOpacity } from "react-native-gesture-handler";
import ModeSwitcher from "./ModeSwitcher";
import CapturedList from "./CapturedList";
import { SafeAreaView } from "react-native";
import CameraView from "../Camera/CameraView";

import { useDispatch, useSelector } from "react-redux";
import {
  selectValidateLiveSpectrum,
  SPECTRUM_OPTIONS,
  setPreferredSpectrum,
  selectPreferredSpectrumOption,
  selectHasReference,
} from "../../redux/reducers/spectrum";

const CHART_HEIGHT = 200;
const CHART_MARGIN = 16;
const MODE_BUTTON_HEIGHT = 24;
const CAPTURE_BUTTON_RADIUS = 38;

export default function CaptureScreen({ navigation }) {
  const data = useSelector(selectValidateLiveSpectrum);
  const viewSpect = useSelector(selectPreferredSpectrumOption);
  const hasReference = useSelector(selectHasReference);
  const dispatch = useDispatch();
  

  const spectrumViewOptions = [
    SPECTRUM_OPTIONS.INTENSITY,
    SPECTRUM_OPTIONS.TRANSMITTANCE,
    SPECTRUM_OPTIONS.ABSORBANCE,
  ];

  function isEnabled(option) {
    if (option === SPECTRUM_OPTIONS.INTENSITY) return true;
    // Only show transmittance/absorbance if there is a reference spectrum
    return hasReference === true;
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.chart}>
          <CaptureChart
            spectrumData={data}
            spectrumViewOption={viewSpect}
            spectrumViewOptions={SPECTRUM_OPTIONS}
          />
        </View>
        <ModeSwitcher
          selectedViewOption={viewSpect}
          spectrumViewOptions={spectrumViewOptions}
          onPress={(spectrumOption) => {
            dispatch(
              setPreferredSpectrum({
                preferredSpectrum: spectrumOption,
              })
            );
          }}
          optionIsEnabled={isEnabled}
        />
        <CapturedList />
        <View style={styles.captureContainer}>
          <TouchableOpacity style={styles.captureButton}></TouchableOpacity>
        </View>
      </View>

      <CameraView
        captureIntervalSeconds={5}
        isActive={false}
        style={{ height: 0 }}
      />
    </>
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
  modeContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignContent: "center",
  },
  modeButton: {
    justifyContent: "center",
    height: MODE_BUTTON_HEIGHT,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  captureContainer: {
    backgroundColor: "gray",
    height: 80,
    position: "absolute",
    bottom: 0,
    width: "100%",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  captureButton: {
    borderRadius: CAPTURE_BUTTON_RADIUS,
    width: CAPTURE_BUTTON_RADIUS * 2,
    height: CAPTURE_BUTTON_RADIUS * 2,
    borderWidth: 3,
    top: -CAPTURE_BUTTON_RADIUS * 0.618,
    backgroundColor: "white",
  },
});
