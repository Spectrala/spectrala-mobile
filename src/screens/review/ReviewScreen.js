import * as React from "react";
import { StyleSheet, View } from "react-native";
import CaptureChart from "../capture/CaptureChart";
import ModeSwitcher from "../capture/ModeSwitcher";
import ReviewList from "./ReviewList";

import { useDispatch, useSelector } from "react-redux";
import {
  selectValidateLiveSpectrum,
  selectIntensity,
  SPECTRUM_OPTIONS,
  setPreferredSpectrum,
  selectPreferredSpectrumOption,
  selectHasReference,
} from "../../redux/reducers/RecordedSpectra";

const CHART_HEIGHT = 200;
const CHART_MARGIN = 16;
const MODE_BUTTON_HEIGHT = 24;
const CAPTURE_BUTTON_RADIUS = 38;

export default function ReviewScreen({ navigation }) {
  const data = useSelector(selectValidateLiveSpectrum);
  const viewSpect = useSelector(selectPreferredSpectrumOption);
  const hasReference = useSelector(selectHasReference);
  const intensities = useSelector(selectIntensity);
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
        <ReviewList />
      </View>
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
