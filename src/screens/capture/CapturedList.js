import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { selectRecordedSpectra } from "../../redux/reducers/RecordedSpectra";
import { useSelector } from "react-redux";
import { AreaChart } from "react-native-svg-charts";
import { curveBasis as d3ShapeCurveBasis } from "d3-shape";
import * as ChartPt from "../../types/ChartPoint";
import * as Spectrum from "../../types/Spectrum";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

function CapturedCell({ navigation, spectrum, idx }) {
  const { colors } = useTheme();

  /**
   * TODO: Once a capture is started, reset the scanner line history.
   * Once desired exposure is reached, record the spectrum. Animate
   * this cell with this:
   * https://wix.github.io/react-native-ui-lib/docs/AnimatedScanner/
   */
  return (
    <TouchableOpacity
      style={styles.cellContainer}
      onPress={() => {
        navigation.navigate("ReviewScreen", {
          spectrum,
          targetIndex: idx,
        });
      }}
    >
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
    </TouchableOpacity>
  );
}

export default function CapturedList({ navigation, style }) {
  const recordedSpectra = useSelector(selectRecordedSpectra);

  const list = recordedSpectra.map((spectrum, idx) => (
    <CapturedCell
      navigation={navigation}
      spectrum={spectrum}
      idx={idx}
      key={`sm${idx}`}
    />
  ));

  return <View style={style}>{list}</View>;
}

const styles = StyleSheet.create({
  cellContainer: {
    width: "100%",
    height: 48,
    flexDirection: "row",
  },
  name: {
    flex: 3,
  },
  chart: {
    flex: 2,
  },
});
