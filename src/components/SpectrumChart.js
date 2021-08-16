import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { AreaChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import { Defs } from "react-native-svg";
import { curveBasis as d3ShapeCurveBasis } from "d3-shape";
import * as ChartPt from "../types/ChartPoint";
import * as Range from "../types/Range";
import SpectrumGradientProvider from "./SpectrumGradientProvider";

const CHART_HEIGHT = 160;
const X_AXIS_HEIGHT = 10;
const SHOWS_Y = true;
const AXES_FONT_SIZE = 10;
const INSET_TOP = SHOWS_Y ? 10 : 0;
const INSET_BOTTOM = 5;
const GRADIENT_ID = "grad";

function SpectrumChart({ intensities, yRange, showsYAxis, style }) {

  const xRange = Range.construct(
    ChartPt.getWavelength(intensities[0]),
    ChartPt.getWavelength(intensities[intensities.length - 1])
  );

  return (
    <View style={{ ...styles.master, ...style }}>
      {showsYAxis && (
        <YAxis
          data={intensities.map((p) => ChartPt.getY(p))}
          style={styles.yAxis}
          contentInset={{ top: INSET_TOP, bottom: INSET_BOTTOM }}
          svg={{ fontSize: AXES_FONT_SIZE, fill: "grey" }}
          numberOfTicks={5}
          min={yRange && Range.getMin(yRange)}
          max={yRange && Range.getMax(yRange)}
        />
      )}
      <View style={styles.innerView}>
        <AreaChart
          style={{ height: CHART_HEIGHT }}
          data={intensities}
          yAccessor={({ item }) => ChartPt.getY(item)}
          xAccessor={({ item }) => ChartPt.getWavelength(item)}
          yMin={yRange ? Range.getMin(yRange) : undefined}
          yMax={yRange ? Range.getMax(yRange) : undefined}
          min={Range.getMin(xRange)}
          max={Range.getMax(xRange)}
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
          formatLabel={(value) => value}
          numberOfTicks={5}
          svg={{ fontSize: AXES_FONT_SIZE, fill: "grey" }}
          min={Range.getMin(xRange)}
          max={Range.getMax(xRange)}
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
    marginBottom: 16,
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
