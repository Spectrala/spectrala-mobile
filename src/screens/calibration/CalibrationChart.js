import React, { useState} from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { Text, View, Colors } from "react-native-ui-lib";
import { AreaChart, Grid } from "react-native-svg-charts";
import { useSelector } from "react-redux";
import { selectChartData } from "../../redux/reducers/video";
import * as shape from "d3-shape";
// import TickContainer from "./TickContainer";
import Tick from "./Tick";
import { selectCalibrationPoints } from "../../redux/reducers/calibration/calibration";

function CalibrationChart({ horizontalInset }) {
  const data = useSelector(selectChartData);
  const calibrationPoints = useSelector(selectCalibrationPoints);
  const [tickViewDims, setTickDims] = useState(undefined);

  const HORIZONTAL_INSET = 20;

  if (!data) {
    return <Text>Loading...</Text>;
  }

  return (
    <View>
      <AreaChart
        style={{ height: 200 }}
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
      <Tick
        targetIdx={0}
        calibrationPoints={calibrationPoints}
        yPosition={210}
        onPress={() => {
          console.warn("I felt that.");
        }}
        viewDims={tickViewDims}
      />
      <Tick
        targetIdx={1}
        calibrationPoints={calibrationPoints}
        yPosition={250}
        onPress={() => {
          console.warn("I felt that.");
        }}
        viewDims={tickViewDims}
      />
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
