import React, { useState, useCallback } from "react";
import { StyleSheet } from "react-native";
import { Text, View, Colors } from "react-native-ui-lib";
import { AreaChart, Grid } from "react-native-svg-charts";
import { useSelector } from "react-redux";
import { selectChartData } from "../../redux/reducers/video";
import * as shape from "d3-shape";
import Tick from "./Tick";
import { selectCalibrationPoints } from "../../redux/reducers/calibration/calibration";

const CHART_HEIGHT = 200;
const TOP_TICK_Y = 215;
const BOTTOM_TICK_Y = 255;

function CalibrationChart({ horizontalInset }) {
  const data = useSelector(selectChartData);
  const calibrationPoints = useSelector(selectCalibrationPoints);
  const [tickViewDims, setTickDims] = useState(undefined);

  const HORIZONTAL_INSET = 20;

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
          horizontalInset={ HORIZONTAL_INSET}
        />
      );
    });
  };

  return (
    <View>
      <AreaChart
        style={{ height: CHART_HEIGHT }}
        data={data[0].data}
        yAccessor={({ item }) => item.y}
        xAccessor={({ item }) => item.x}
        contentInset={{
          top: 0,
          bottom: 0,
          left: HORIZONTAL_INSET,
          right: HORIZONTAL_INSET,
        }}
        curve={shape.curveBasis}
        svg={{
          fill: Colors.primary + "80",
          stroke: Colors.primary,
        }}
      >
        <Grid />
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
