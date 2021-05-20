import React from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { StackedAreaChart } from "react-native-svg-charts";
import * as shape from "d3-shape";
/**
 * https://icons.expo.fyi
 *
 * Ionicons:
 * arrow-up-circle
 * arrow-up-circle-outline
 */
function CalibrationChart(props) {
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

  /**
   * Converts a string of an rgb color formatted like "rgb(0,2,255)"
   * to a hex string like "#0002FF"
   * @param {string} str - the rgb string to convert to hex
   * @returns {string} the reformatted string
   */
  const rgbToHexColor = (str) => {
    return (
      "#" +
      str
        .replace("rgb(", "")
        .replace(")", "")
        .split(",")
        .map((x) => parseInt(x).toString(16).padStart(2, "0"))
        .join("")
        .toUpperCase()
    );
  };

  const baseColor = colors.primary;
  const chartColors = data.map((_, idx) => {
    const alphaPct = 1 - idx / data.length;
    const alphaDec = Math.floor(255 * alphaPct);
    const alpha = alphaDec.toString(16);
    return rgbToHexColor(baseColor) + alpha;
  });
  const keys = ["apples", "bananas", "cherries", "dates"];
  const svgs = [
    { onPress: () => console.log("apples") },
    { onPress: () => console.log("bananas") },
    { onPress: () => console.log("cherries") },
    { onPress: () => console.log("dates") },
  ];

  return (
    <StackedAreaChart
      style={{...styles.rightBox, paddingHorizontal: props.margin}}
      data={data}
      keys={keys}
      colors={chartColors}
      curve={shape.curveNatural}
      showGrid={false}
      svgs={svgs}
    />
  );
}

// TODO: use some real data.

CalibrationChart.propTypes = {
  margin: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  rightBox: {
    width: "100%",
    height: "100%",
    paddingTop: 8,
  },
});

export default CalibrationChart;
