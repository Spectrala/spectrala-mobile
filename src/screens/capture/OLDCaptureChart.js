import React from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Text, View } from "react-native-ui-lib";
import { useTheme } from "@react-navigation/native";
import { AreaChart, Grid, XAxis, YAxis } from "react-native-svg-charts";

const CHART_INSET = 30;

function CaptureChart(props) {
  const { colors } = useTheme();

  if (!props.spectrumData) {
    return <Text>Loading...</Text>;
  } else if (!props.spectrumData.isValid()) {
    return <Text>{props.spectrumData.getMessage()}</Text>;
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

  const data = props.spectrumData.data;

  const min_x_value = data[0].x;
  const max_x_value = data[data.length - 1].x;

  let y_range =
    props.spectrumViewOption === props.spectrumViewOptions.INTENSITY
      ? [0, 100]
      : [undefined, undefined];

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
    <View style={{ height: "100%", padding: 10, flexDirection: "row" }}>
      <YAxis
        data={data.map((p) => p.y)}
        style={{ marginBottom: xAxisHeight }}
        contentInset={verticalContentInset}
        svg={axesSvg}
        numberOfTicks={5}
        min={y_range[0]}
        max={y_range[1]}
      />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <AreaChart
          style={{ flex: 1 }}
          data={data}
          yAccessor={({ item }) => item.y}
          xAccessor={({ item }) => item.x}
          yMin={y_range[0]}
          yMax={y_range[1]}
          xMin={min_x_value}
          xMax={max_x_value}
          contentInset={verticalContentInset}
          svg={{
            fill: rgbToHexColor(colors.primary) + "99",
            stroke: rgbToHexColor(colors.primary),
          }}
        >
          <Grid />
        </AreaChart>
        <XAxis
          style={{ marginHorizontal: -10, height: xAxisHeight }}
          data={data.map((p) => p.x)}
          formatLabel={(value, index) => value}
          contentInset={{ left: 10, right: 10 }}
          numberOfTicks={5}
          min={min_x_value}
          max={max_x_value}
          svg={axesSvg}
        />
      </View>
    </View>
  );
}

// TODO: use some real data.

CaptureChart.propTypes = {
  margin: PropTypes.number,
  spectrumData: PropTypes.any,
  spectrumViewOption: PropTypes.string,
  spectrumViewOptions: PropTypes.object,
};

const styles = StyleSheet.create({
  chartContainer: {
    height: "100%",
    flex: 1,
    flexDirection: "column",
  },
  yAxis: {
    width: 20,
    top: 0,
    bottom: 0,
    backgroundColor: "lime",
  },
  masterChartContainer: {
    flexDirection: "row",
    flex: 1,
    paddingBottom: 16,
  },
  area: {
    height: "100%",
  },
});

export default CaptureChart;
