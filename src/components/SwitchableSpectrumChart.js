import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import SpectrumChart from "./SpectrumChart";
import {
  selectReferenceSpectrum,
  selectReferenceKey,
} from "../redux/reducers/RecordedSpectra";
import { useSelector } from "react-redux";
import * as Spectrum from "../types/Spectrum";
const CHART_HEIGHT = 160;
const MODE_BUTTON_HEIGHT = 24;

export default function SwitchableSpectrumChart({
  spectrum,
  yRange = [0, 100],
  style,
}) {
  if (!spectrum || !Spectrum.getIntensityChart(spectrum)) {
    return <Text>Loading...</Text>;
  }

  const intensities = Spectrum.getIntensityChart(spectrum);
  const reference = useSelector(selectReferenceSpectrum);
  const referenceKey = useSelector(selectReferenceKey);

  const hasValidReference = () => {
    const key = Spectrum.getKey(spectrum);
    const isReference = key === referenceKey;
    return reference && !isReference;
  };

  const isSelected = (spectrumOption) => {
    return spectrumOption === props.selectedViewOption;
  };

  const SPECTRUM_VIEW_OPTION_NAMES = {
    INTENSITY: "Intensity",
    TRANSMITTANCE: "Transmittance",
    ABSORPTION: "Absorption",
  };

  const viewOptions = [
    SPECTRUM_VIEW_OPTION_NAMES.INTENSITY,
    SPECTRUM_VIEW_OPTION_NAMES.TRANSMITTANCE,
    SPECTRUM_VIEW_OPTION_NAMES.ABSORPTION,
  ];

  const selectedOption = SPECTRUM_VIEW_OPTION_NAMES.INTENSITY;

  return (
    <View style={styles.modeContainer}>
      {viewOptions.map((option, idx) => (
        <TouchableOpacity
          key={idx}
          style={{
            ...styles.modeButton,
            ...(option === selectedOption && styles.selectedButton),
          }}
          onPress={() => {
            props.onPress(option);
          }}
        >
          <Text
            style={{
              ...styles.modeButtonText,
              ...(option === selectedOption && styles.selectedText),
            }}
          >
            {option}
          </Text>
        </TouchableOpacity>
      ))}
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
  modeContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignContent: "center",
    marginBottom: 4,
  },
  modeButton: {
    justifyContent: "center",
    height: MODE_BUTTON_HEIGHT,
  },
  selectedButton: {
    backgroundColor: "black",
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  disabledText: {
    fontWeight: "normal",
    color: "gray",
  },
  selectedText: {
    color: "white",
    fontWeight: "normal",
  },
});
