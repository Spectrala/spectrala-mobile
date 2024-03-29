import React, { useState } from "react";
import { Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { AreaChart, Grid } from "react-native-svg-charts";
import { Defs } from "react-native-svg";
import { useSelector } from "react-redux";
import {
  selectIntensityChart,
  selectUncalibratedIntensityChart,
} from "../../redux/reducers/SpectrumFeed";
import { curveBasis as d3ShapeCurveBasis } from "d3-shape";
import * as ChartPt from "../../types/ChartPoint";
import * as UncalibratedIntensity from "../../types/UncalibratedIntensity";
import Tick from "./Tick";
import { selectCalibrationPoints } from "../../redux/reducers/Calibration";
import SpectrumGradientProvider from "../../components/SpectrumGradientProvider";

const CHART_HEIGHT = 200;
const TOP_TICK_Y = 215;
const BOTTOM_TICK_Y = 255;
const GRADIENT_ID = "grad";

function CalibrationChart({ horizontalInset }) {
  const intensityChart = useSelector(selectIntensityChart);
  const uncalibratedChart = useSelector(selectUncalibratedIntensityChart);

  const calibrationPoints = useSelector(selectCalibrationPoints);
  const [tickViewDims, setTickDims] = useState(undefined);

  if (!intensityChart || !uncalibratedChart) {
    return <ActivityIndicator />;
  }

  const getTicks = () => {
    return calibrationPoints.map((_, idx) => {
      const isBottom = idx % 2 === 1;
      return (
        <Tick
          key={idx}
          targetIdx={idx}
          calibrationPoints={calibrationPoints}
          yPosition={isBottom ? BOTTOM_TICK_Y : TOP_TICK_Y}
          isBottom={isBottom}
          viewDims={tickViewDims}
          horizontalInset={horizontalInset}
        />
      );
    });
  };

  // https://stackoverflow.com/questions/60503898/how-to-apply-gradient-color-on-react-native-stackedareachart
  return (
    <View>
      <AreaChart
        style={{ height: CHART_HEIGHT }}
        data={intensityChart}
        yAccessor={({ item }) => ChartPt.getY(item)}
        xAccessor={({ item }) => ChartPt.getXPosition(item)}
        yMax={100}
        yMin={0}
        contentInset={{
          top: 0,
          bottom: 0,
          left: horizontalInset,
          right: horizontalInset,
        }}
        curve={d3ShapeCurveBasis}
        svg={{ fill: `url(#${GRADIENT_ID})` }}
      >
        <Grid />
        <Defs>
          <SpectrumGradientProvider
            chartData={intensityChart}
            id={GRADIENT_ID}
          />
        </Defs>
      </AreaChart>

      <View
        style={styles.tickContainer}
        onLayout={(e) => setTickDims(e.nativeEvent.layout)}
      >
        {getTicks()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tickContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
});

export default CalibrationChart;
