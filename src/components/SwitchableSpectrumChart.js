import React, { useCallback, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import SpectrumChart from "./SpectrumChart";
import { selectReferenceSpectrum } from "../redux/reducers/RecordedSpectra";
import { useSelector } from "react-redux";
import * as Spectrum from "../types/Spectrum";
import {
  computeAbsorptionChart,
  computeTransmittanceChart,
} from "../util/spectroscopyMath";
import { useTheme } from "@react-navigation/native";
const CHART_HEIGHT = 160;
const MODE_BUTTON_HEIGHT = 24;

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

export default function SwitchableSpectrumChart({ spectrum, style }) {
  const { colors } = useTheme();

  const intensities = Spectrum.getIntensityChart(spectrum);
  const reference = useSelector(selectReferenceSpectrum);
  const [selectedOption, setSelectedOption] = useState(
    SPECTRUM_VIEW_OPTION_NAMES.INTENSITY
  );


  const hasValidReference = () => {
    if (!reference) return false;
    const key = Spectrum.getKey(spectrum);
    const referenceKey = Spectrum.getKey(reference);
    const isReference = key === referenceKey;
    return !isReference;
  };

  const getChartData = useCallback(() => {
    switch (selectedOption) {
      case SPECTRUM_VIEW_OPTION_NAMES.INTENSITY:
        return intensities;
      case SPECTRUM_VIEW_OPTION_NAMES.TRANSMITTANCE:
        return computeTransmittanceChart(
          intensities,
          Spectrum.getIntensityChart(reference)
        );
      case SPECTRUM_VIEW_OPTION_NAMES.ABSORPTION:
        return computeAbsorptionChart(
          intensities,
          Spectrum.getIntensityChart(reference)
        );
      default:
        console.error(`Unexpected chart type ${selectedOption}`);
    }
  }, [selectedOption, intensities, reference]);

  const modeSwitcher = () => {
    return (
      hasValidReference() && (
        <View style={styles.modeContainer}>
          {viewOptions.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={{
                ...styles.modeButton,
                ...(option === selectedOption && {
                  ...styles.selectedButton,
                  backgroundColor: colors.primary,
                }),
              }}
              onPress={() => setSelectedOption(option)}
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
      )
    );
  };

  if (!spectrum || !Spectrum.getIntensityChart(spectrum)) {
    return <ActivityIndicator />;
  }
  return (
    <>
      <SpectrumChart intensities={getChartData()} style={style} />
      {modeSwitcher()}
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
  selectedButton: {
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "300",
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
