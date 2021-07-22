import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AreaChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import { Defs } from "react-native-svg";
import { curveBasis as d3ShapeCurveBasis } from "d3-shape";
import * as ChartPt from "../types/ChartPoint";
import SpectrumGradientProvider from "./SpectrumGradientProvider";
const CHART_HEIGHT = 160;
const X_AXIS_HEIGHT = 10;
const SHOWS_Y = false;
const AXES_FONT_SIZE = 10;
const INSET_TOP = SHOWS_Y ? 10 : 0;
const INSET_BOTTOM = 5;
const GRADIENT_ID = "grad";

function SpectrumChart({ intensities, yRange = [0, 100], style }) {

  const xRange = [
    ChartPt.getWavelength(intensities[0]),
    ChartPt.getWavelength(intensities[intensities.length - 1]),
  ];

  return (
    <View style={{ ...styles.master, ...style }}>
      {SHOWS_Y && (
        <YAxis
          data={intensities.map((p) => ChartPt.getY(p))}
          style={styles.yAxis}
          contentInset={{ top: INSET_TOP, bottom: INSET_BOTTOM }}
          svg={{ fontSize: AXES_FONT_SIZE, fill: "grey" }}
          numberOfTicks={5}
          min={yRange[0]}
          max={yRange[1]}
        />
      )}
      <View style={styles.innerView}>
        <AreaChart
          style={{ height: CHART_HEIGHT }}
          data={intensities}
          yAccessor={({ item }) => ChartPt.getY(item)}
          xAccessor={({ item }) => ChartPt.getWavelength(item)}
          yMax={yRange[1]}
          yMin={yRange[0]}
          min={xRange[0]}
          max={xRange[1]}
          contentInset={{
            top: INSET_TOP,
            bottom: INSET_BOTTOM,
          }}
          curve={d3ShapeCurveBasis}
          svg={{ fill: `url(#${GRADIENT_ID})` }}
        >
          <Defs>
            <SpectrumGradientProvider
              chartData={intensities}
              id={GRADIENT_ID}
            />
          </Defs>

          <Grid />
        </AreaChart>
        <XAxis
          style={{ marginHorizontal: -10, height: X_AXIS_HEIGHT }}
          data={intensities.map((p) => ChartPt.getWavelength(p))}
          formatLabel={(value, index) => value}
          numberOfTicks={5}
          svg={{ fontSize: AXES_FONT_SIZE, fill: "grey" }}
          min={xRange[0]}
          max={xRange[1]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  master: {
    padding: 0,
    flexDirection: "row",
    height: CHART_HEIGHT,
  },
  innerView: {
    flex: 1,
  },
  yAxis: {
    height: CHART_HEIGHT,
    marginBottom: X_AXIS_HEIGHT,
  },
});

export default SpectrumChart;
