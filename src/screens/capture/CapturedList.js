import React, { useCallback } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import {
  selectRecordedSpectra,
  updateSpectrum,
} from "../../redux/reducers/RecordedSpectra";
import { useSelector, useDispatch } from "react-redux";
import { AreaChart, Grid, YAxis, XAxis } from "react-native-svg-charts";
import * as shape from "d3-shape";
import * as ChartPt from "../../types/ChartPoint";
import * as Spectrum from "../../types/Spectrum";

import { useTheme } from "@react-navigation/native";

function CapturedCell({ spectrum, idx }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  return (
    <View style={styles.cellContainer}>
      <TextInput
        style={styles.nameField}
        onChangeText={(text) =>
          dispatch(
            updateSpectrum({
              targetIndex: idx,
              spectrum: Spectrum.rename(spectrum, text),
            })
          )
        }
        value={Spectrum.getName(spectrum)}
      />
      <AreaChart
        style={styles.chart}
        data={Spectrum.getIntensityChart(spectrum)}
        yAccessor={({ item }) => ChartPt.getY(item)}
        xAccessor={({ item }) => ChartPt.getWavelength(item)}
        yMax={100}
        yMin={0}
        curve={shape.curveBasis}
        svg={{ fill: colors.primary + "30", stroke: colors.primary }}
      />
    </View>
  );
}

export default function CapturedList() {
  const recordedSpectra = useSelector(selectRecordedSpectra);

  return recordedSpectra.map((spectrum, idx) => (
    <CapturedCell spectrum={spectrum} idx={idx} key={`sm${idx}`} />
  ));
}

// CapturedList.propTypes = {
//   selectedMode: PropTypes.string,
// };

const styles = StyleSheet.create({
  cellContainer: {
    width: "100%",
    height: 48,
    flexDirection: "row",
  },
  nameField: {
    flex: 3,
    borderColor: "black",
    borderWidth: 1,
  },
  chart: {
    flex: 2,
  },
});
