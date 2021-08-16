import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import SpectrumChart from "./SpectrumChart";
import { selectReferenceSpectrum } from "../redux/reducers/RecordedSpectra";
import { useSelector } from "react-redux";
import * as Spectrum from "../types/Spectrum";
import {
  computeAbsorbanceChart,
  computeTransmittanceChart,
} from "../util/spectroscopyMath";
import { useTheme } from "@react-navigation/native";
import * as ChartPt from "../types/ChartPoint";
import * as Range from "../types/Range";

const CHART_HEIGHT = 160;
const MODE_BUTTON_HEIGHT = 24;

const SPECTRUM_VIEW_OPTION_NAMES = {
  INTENSITY: "Intensity",
  TRANSMITTANCE: "Transmittance",
  ABSORBANCE: "Absorbance",
};

const viewOptions = [
  SPECTRUM_VIEW_OPTION_NAMES.INTENSITY,
  SPECTRUM_VIEW_OPTION_NAMES.TRANSMITTANCE,
  SPECTRUM_VIEW_OPTION_NAMES.ABSORBANCE,
];

const DEFAULT_INTENSITY_Y_RANGE = Range.construct(0, 100);
const DEFAULT_TRANSMITTANCE_Y_RANGE = Range.construct(0, 1);
const DEFAULT_ABSORBANCE_Y_RANGE = Range.construct(0, 1);

export default function SwitchableSpectrumChart({ spectrum, style }) {
  const { colors } = useTheme();

  const intensities = Spectrum.getIntensityChart(spectrum);
  const reference = useSelector(selectReferenceSpectrum);

  const [selectedOption, setSelectedOption] = useState(
    SPECTRUM_VIEW_OPTION_NAMES.INTENSITY
  );

  const [transmittanceRange, setTransmittanceRange] = useState(
    DEFAULT_TRANSMITTANCE_Y_RANGE
  );
  const [absorbanceRange, setAbsorbanceRange] = useState(
    DEFAULT_ABSORBANCE_Y_RANGE
  );

  /**
   * Returns the appropriate y range for the given chart.
   * @param {SPECTRUM_VIEW_OPTION_NAMES} viewOption current chart selection
   * @returns {Range} range of the y-axis for the given chart.
   */
  const getYRange = (viewOption) => {
    switch (viewOption) {
      case SPECTRUM_VIEW_OPTION_NAMES.INTENSITY:
        return DEFAULT_INTENSITY_Y_RANGE;
      case SPECTRUM_VIEW_OPTION_NAMES.ABSORBANCE:
        return absorbanceRange;
      case SPECTRUM_VIEW_OPTION_NAMES.TRANSMITTANCE:
        return transmittanceRange;
      default:
        console.error(`Unexpected chart type ${selectedOption}`);
    }
  };

  /**
   * Returns true if a reference spectrum is present and the
   * reference spectrum is not also the test spectrum. If the
   * reference spectrum and the test spectrum are the same, the
   * user is likely viewing the reference spectrum, so transmittance
   * and absorbance calculations would be meaningless.
   * @returns {bool} whether or not the reference spectrum is valid
   */
  const hasValidReference = () => {
    if (!reference) return false;
    const key = Spectrum.getKey(spectrum);
    const referenceKey = Spectrum.getKey(reference);
    const isReference = key === referenceKey;
    return !isReference;
  };

  /**
   * Upon a change in the reference spectrum,
   *  - Reset the axes ranges to default values
   *  - Ensure transmittance/absorbance are only
   *    selected with a valid reference spectrum.
   */
  useEffect(() => {
    setAbsorbanceRange(DEFAULT_ABSORBANCE_Y_RANGE);
    setTransmittanceRange(DEFAULT_TRANSMITTANCE_Y_RANGE);

    if (
      !hasValidReference() &&
      selectedOption != SPECTRUM_VIEW_OPTION_NAMES.INTENSITY
    ) {
      setSelectedOption(SPECTRUM_VIEW_OPTION_NAMES.INTENSITY);
    }
  }, [reference]);

  /**
   * Computes an expanded chart range to fit the current data and sets the
   * chart range if any expanding was done to the chart range.
   * @param {Range} currentRange currently set chart range
   * @param {function} maxRangeSetter useState setter for currentRange
   * @param {Array<ChartPt>} newChart chart data for the current tick
   */
  const expandRangeIfNecessary = (currentRange, maxRangeSetter, newChart) => {
    const yVals = newChart.map((pt) => ChartPt.getY(pt));
    const yRangeChart = Range.construct(Math.min(...yVals), Math.max(...yVals));
    const maximumRange = Range.union(currentRange, yRangeChart);
    if (!Range.rangesAreEqual(currentRange, maximumRange)) {
      maxRangeSetter(maximumRange);
    }
  };

  /**
   * Returns chart data for currently selected chart.
   * @returns {Array<ChartPt>} current chart data
   */
  const getChartData = () => {
    switch (selectedOption) {
      case SPECTRUM_VIEW_OPTION_NAMES.INTENSITY:
        return intensities;
      case SPECTRUM_VIEW_OPTION_NAMES.TRANSMITTANCE:
        const transmittanceChart = computeTransmittanceChart(
          intensities,
          Spectrum.getIntensityChart(reference)
        );
        expandRangeIfNecessary(
          transmittanceRange,
          setTransmittanceRange,
          transmittanceChart
        );
        return transmittanceChart;
      case SPECTRUM_VIEW_OPTION_NAMES.ABSORBANCE:
        const absorbanceChart = computeAbsorbanceChart(
          intensities,
          Spectrum.getIntensityChart(reference)
        );
        expandRangeIfNecessary(
          absorbanceRange,
          setAbsorbanceRange,
          absorbanceChart
        );
        return absorbanceChart;
      default:
        console.error(`Unexpected chart type ${selectedOption}`);
    }
  };

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
      <SpectrumChart
        intensities={getChartData()}
        yRange={getYRange(selectedOption)}
        showsYAxis={selectedOption !== SPECTRUM_VIEW_OPTION_NAMES.INTENSITY}
        style={style}
      />
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
    width: "100%",
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
