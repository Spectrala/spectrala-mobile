import React from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { AreaChart, Grid } from "react-native-svg-charts";
import * as shape from "d3-shape";

const CHART_INSET = 30;

function PreviewChart(props) {
  const { colors } = useTheme();

  const data = props.data;

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

  const contentInset = {
    top: 0,
    bottom: 0,
    left: CHART_INSET,
    right: CHART_INSET,
  };

  const axesSvg = { fontSize: 10, fill: "grey" };
  const verticalContentInset = { top: 10, bottom: 5 };
  const xAxisHeight = 10;

  // Layout of an x-axis together with a y-axis is a problem that stems from flexbox.
  // All react-native-svg-charts components support full flexbox and therefore all
  // layout problems should be approached with the mindset "how would I layout regular Views with flex in this way".
  // In order for us to align the axes correctly we must know the height of the x-axis or the width of the x-axis
  // and then displace the other axis with just as many pixels. Simple but manual.

  return (
    <AreaChart
      style={{ width: props.width }}
      data={data}
      yAccessor={({ item }) => item.y}
      xAccessor={({ item }) => item.x}
      contentInset={verticalContentInset}
      svg={{
        fill: rgbToHexColor(colors.primary) + "99",
        // stroke: rgbToHexColor(colors.primary),
      }}
    />
  );
}

// TODO: use some real data.

PreviewChart.propTypes = {
  data: PropTypes.any,
  width: PropTypes.number,
};

PreviewChart.defaultProps = {
  width: 100,
};

export default PreviewChart;
