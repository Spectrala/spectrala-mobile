import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  selectRecordedSpectra,
  selectReferenceSpectrum,
} from "../../redux/reducers/RecordedSpectra";
import { useSelector, useDispatch } from "react-redux";
import { AreaChart } from "react-native-svg-charts";
import { curveBasis as d3ShapeCurveBasis } from "d3-shape";
import * as ChartPt from "../../types/ChartPoint";
import * as Spectrum from "../../types/Spectrum";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

export function CapturedCell({ navigation, spectrum }) {
  /**
   * TODO: Once a capture is started, reset the scanner line history.
   * Once desired exposure is reached, record the spectrum. Animate
   * this cell with this:
   * https://wix.github.io/react-native-ui-lib/docs/AnimatedScanner/
   */

  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate("ReviewScreen", { spectrum })}
    >
      <View style={styles.cellContainer}>
        <Text style={styles.name}>{Spectrum.getName(spectrum)}</Text>
        <AreaChart
          style={styles.chart}
          data={Spectrum.getIntensityChart(spectrum)}
          yAccessor={({ item }) => ChartPt.getY(item)}
          xAccessor={({ item }) => ChartPt.getWavelength(item)}
          yMax={100}
          yMin={0}
          curve={d3ShapeCurveBasis}
          svg={{ fill: colors.primary + "30", stroke: colors.primary }}
        />
      </View>
    </TouchableOpacity>
  );
}

export default function CapturedList({ navigation, style }) {
  const recordedSpectra = useSelector(selectRecordedSpectra);
  const referenceSpectrum = useSelector(selectReferenceSpectrum);

  const isReference = (spectrum) => {
    return (
      referenceSpectrum &&
      spectrum &&
      Spectrum.getKey(spectrum) === Spectrum.getKey(referenceSpectrum)
    );
  };

  const list = recordedSpectra.map(
    (spectrum, idx) =>
      isReference(spectrum) || (
        <CapturedCell
          navigation={navigation}
          spectrum={spectrum}
          idx={idx}
          key={`sm${idx}`}
        />
      )
  );

  return <View style={style}>{list}</View>;
}

const styles = StyleSheet.create({
  cellContainer: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
  },
  name: {
    flex: 3,
  },
  chart: {
    flex: 2,
  },
});
