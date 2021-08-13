import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { AreaChart } from "react-native-svg-charts";
import { curveBasis as d3ShapeCurveBasis } from "d3-shape";
import * as ChartPt from "../../types/ChartPoint";
import * as Spectrum from "../../types/Spectrum";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

const CapturedCell = React.memo(({ navigation, spectrum, style }) => {
  const { colors } = useTheme();
  return (
    <View style={style}>
      <TouchableOpacity
        onPress={() => navigation.push("ReviewScreen", { spectrum })}
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
    </View>
  );
});

const styles = StyleSheet.create({
  cellContainer: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  name: {
    flex: 3,
    fontSize: 18,
    fontWeight: "400",
  },
  chart: {
    flex: 2,
  },
});

export default CapturedCell;
