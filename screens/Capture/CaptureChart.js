import React from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { AreaChart, Grid } from "react-native-svg-charts";

import * as shape from "d3-shape";
/**
 * https://icons.expo.fyi
 *
 * Ionicons:
 * arrow-up-circle
 * arrow-up-circle-outline
 */
function CaptureChart(props) {
  const { colors } = useTheme();

  if (!props.spectrumData) {
    return <Text>Loading...</Text>;
  } else if (!props.spectrumData.isValid()) {
    return <Text>{props.spectrumData.getMessage()}</Text>;
  }

  const data = [50, 10, 40, 95, 0, 0, 85, 91, 35, 53, 0, 24, 50, 0, 0];

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

  return (
    <AreaChart
      style={{ height: 200 }}
      data={data}
      contentInset={{ top: 0, bottom: 0, left: 30, right: 30 }}
      curve={shape.curveBasis}
      svg={{
        fill: rgbToHexColor(colors.primary) + "99",
        stroke: rgbToHexColor(colors.primary),
      }}
    >
      <Grid />
    </AreaChart>
  );
}

// TODO: use some real data.

CaptureChart.propTypes = {
  margin: PropTypes.number,
  spectrumData: PropTypes.any,
  spectrumViewOption: PropTypes.string,
};

const styles = StyleSheet.create({
  rightBox: {
    width: "100%",
    height: "100%",
    paddingTop: 8,
  },
});

export default CaptureChart;
