import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import { View, Colors, Text } from "react-native-ui-lib";
import { selectRecordedSpectra } from "../../redux/reducers/RecordedSpectra";
import { useSelector } from "react-redux";
import { AreaChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import * as ChartPt from "../../types/ChartPoint";

function CapturedCell({ spectrum, idx }) {
  return (
    <View key={idx}>
      <AreaChart
        style={styles.chart}
        data={spectrum}
        yAccessor={({ item }) => ChartPt.getY(item)}
        xAccessor={({ item }) => ChartPt.getWavelength(item)}
        yMax={100}
        yMin={0}
        curve={shape.curveBasis}
        svg={{ fill: Colors.primary + "80", stroke: Colors.primary }}
      />
    </View>
  );
}

export default function CapturedList() {
  const recordedSpectra = useSelector(selectRecordedSpectra);

  return recordedSpectra.map((spectrum, idx) => (
    <CapturedCell spectrum={spectrum} idx={idx} />
  ));
}

// CapturedList.propTypes = {
//   selectedMode: PropTypes.string,
// };

const styles = StyleSheet.create({
  chart: {
    height: 40,
  },
});
