import React, { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { Text, View, Colors } from "react-native-ui-lib";
import { AreaChart, Grid } from "react-native-svg-charts";
import { Defs, LinearGradient, Stop } from "react-native-svg";
import { useSelector } from "react-redux";
import { selectChartData } from "../../redux/reducers/SpectrumFeed";
import * as shape from "d3-shape";
import Tick from "./Tick";
import { selectCalibrationPoints } from "../../redux/reducers/calibration/Calibration";
import { wavelengthToRGB } from "../../util/colorUtil";

const CHART_HEIGHT = 200;
const TOP_TICK_Y = 215;
const BOTTOM_TICK_Y = 255;

const GRADIENT_COLOR_STOPS = 100; // one less than the number of color stops placed

function CalibrationChart({ horizontalInset }) {
  const data = useSelector(selectChartData);
  const calibrationPoints = useSelector(selectCalibrationPoints);
  const [tickViewDims, setTickDims] = useState(undefined);

  if (!data) {
    return <Text>Loading...</Text>;
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
          onPress={() => {
            console.log(idx);
          }}
          viewDims={tickViewDims}
          horizontalInset={horizontalInset}
        />
      );
    });
  };

  // https://stackoverflow.com/questions/60503898/how-to-apply-gradient-color-on-react-native-stackedareachart
  
  // offset [0-1], color [#AABBCC]
  // for (let stop = 0; stop <= GRADIENT_COLOR_STOPS; stop++) {
  //   const x = stop / GRADIENT_COLOR_STOPS;

  // }

  return (
    <View>
      <AreaChart
        style={{ height: CHART_HEIGHT }}
        data={data}
        yAccessor={({ item }) => item.y}
        xAccessor={({ item }) => item.x}
        yMax={100}
        yMin={0}
        contentInset={{
          top: 0,
          bottom: 0,
          left: horizontalInset,
          right: horizontalInset,
        }}
        curve={shape.curveBasis}
        svg={{
          fill: "url(#grad)",
        }}
      >
        <Grid />

        <Defs>
          <LinearGradient id="grad" x1={0} y1={0} x2={1} y2={0}>
            <Stop offset={0} stopColor="#FFD080" stopOpacity="1" />
            <Stop offset={0.3} stopColor="red" stopOpacity="1" />
            <Stop offset={0.9} stopColor="#FFD080" stopOpacity="1" />
            <Stop offset={1} stopColor="red" stopOpacity="1" />
          </LinearGradient>
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
