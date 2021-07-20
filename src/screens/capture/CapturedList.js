import React, { useCallback } from "react";
import { StyleSheet, View} from "react-native";
import { selectRecordedSpectra } from "../../redux/reducers/RecordedSpectra";
import { useSelector } from "react-redux";
import { AreaChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import * as ChartPt from "../../types/ChartPoint";

import { useTheme } from "@react-navigation/native";

function CapturedCell({ spectrum, idx }) {
  const { colors } = useTheme();
  return (
    <View key={`sm${idx}`}>
      <AreaChart
        style={styles.chart}
        data={spectrum}
        yAccessor={({ item }) => ChartPt.getY(item)}
        xAccessor={({ item }) => ChartPt.getWavelength(item)}
        yMax={100}
        yMin={0}
        curve={shape.curveBasis}
        svg={{ fill: colors.primary + "80", stroke: colors.primary }}
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
