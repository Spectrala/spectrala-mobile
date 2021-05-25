import React from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { AreaChart, Grid } from "react-native-svg-charts";
import { useDispatch, useSelector } from 'react-redux';
import { selectChartData } from '../../redux/reducers/video';
import {
  selectCalibrationPoints,
  placePoint,
} from '../../redux/reducers/calibration/calibration';
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
  const data = useSelector(selectChartData);
  const calibrationPoints = useSelector(selectCalibrationPoints);
  const dispatch = useDispatch();

  if (!data) {
    return (<Text>Loading...</Text>)
  }

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
      data={data[0].data}
      yAccessor={({item}) => item.y}
      xAccessor={({item}) => item.x}
      contentInset={{
        top: 0,
        bottom: 0,
        left: props.horizontalInset,
        right: props.horizontalInset,
      }}
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

CalibrationChart.propTypes = {
  margin: PropTypes.number.isRequired,
  horizontalInset: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({
  rightBox: {
    width: "100%",
    height: "100%",
    paddingTop: 8,
  },
});

export default CalibrationChart;
