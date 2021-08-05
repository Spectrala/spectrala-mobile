import React from "react";
import { useTheme } from "@react-navigation/native";
import { StyleSheet, View } from "react-native";
import { StackedAreaChart } from "react-native-svg-charts";
import { curveBasis as d3ShapeCurveBasis } from "d3-shape";
import * as Spectrum from "../../types/Spectrum";
import * as ChartPoint from "../../types/ChartPoint";

export default function StackedChart({ spectra, style }) {
  const { colors } = useTheme();

  const spectrumCharts = spectra.map((s) => Spectrum.getIntensityChart(s));

  // Push objects looking like {w: 423.3, s0: 100, s1: 49, s2: 40}
  let stackedData = [];
  const firstChart = spectrumCharts[0];

  if (firstChart) {
    for (let idx = 0; idx < firstChart.length; idx++) {
      let stackedPoint = {
        w: ChartPoint.getWavelength(firstChart[idx]),
      };
      spectrumCharts.forEach((chart, chartNum) => {
        const key = `s${chartNum}`;
        const point = chart[idx];
        stackedPoint[key] = point ? ChartPoint.getY(point) : 50;
      });
      stackedData.push(stackedPoint);
    }
  }

  const baseColor = colors.primary;
  const numCharts = spectrumCharts.length;
  const chartColors = Array.from(Array(numCharts).keys()).map((_, idx) => {
    const alphaPct = 1 - idx / numCharts;
    const alphaDec = Math.floor(255 * alphaPct);
    const alpha = alphaDec.toString(16).padStart(2, "0");
    return baseColor + alpha;
  });

  const keys = Array.from(Array(numCharts).keys(), (i) => `s${i}`);

  return (
    <View style={[styles.container, style]}>
      <StackedAreaChart
        style={styles.chart}
        data={stackedData}
        keys={keys}
        xAccessor={({ item }) => item.w}
        colors={chartColors}
        curve={d3ShapeCurveBasis}
        showGrid={false}
      />
    </View>

  );
}

const styles = StyleSheet.create({
  chart: {
    flex: 1,
  },
  container: {
    height: 160,
    width: "100%",
  },
});
