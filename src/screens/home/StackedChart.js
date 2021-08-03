import React from "react";
import { useTheme } from "@react-navigation/native";
import { StyleSheet } from "react-native";
import { StackedAreaChart } from "react-native-svg-charts";
import { curveBasis as d3ShapeCurveBasis } from "d3-shape";


function StackedChart(props) {
  const { colors } = useTheme();
  const data = [
    {
      month: new Date(2015, 0, 1),
      apples: 3840,
      bananas: 1920,
      cherries: 960,
      dates: 400,
    },
    {
      month: new Date(2015, 1, 1),
      apples: 1600,
      bananas: 1440,
      cherries: 960,
      dates: 400,
    },
    {
      month: new Date(2015, 2, 1),
      apples: 640,
      bananas: 960,
      cherries: 3640,
      dates: 400,
    },
    {
      month: new Date(2015, 3, 1),
      apples: 3320,
      bananas: 480,
      cherries: 640,
      dates: 400,
    },
  ];

  const baseColor = colors.primary;
  const chartColors = data.map((_, idx) => {
    const alphaPct = 1 - idx / data.length;
    const alphaDec = Math.floor(255 * alphaPct);
    const alpha = alphaDec.toString(16);
    return baseColor + alpha;
  });

  const keys = ["apples", "bananas", "cherries", "dates"];
  return (
    <StackedAreaChart
      style={styles.rightBox}
      data={data}
      keys={keys}
      colors={chartColors}
      curve={d3ShapeCurveBasis}
      showGrid={false}
    />
  );
}

// TODO: use some real data.

const styles = StyleSheet.create({
  rightBox: {
    width: 140,
    height: "auto",
    paddingTop: 8,
    marginLeft: "auto",
  },
});

export default StackedChart;
