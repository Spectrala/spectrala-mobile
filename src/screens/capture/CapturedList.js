import React, { useCallback } from "react";
import { StyleSheet, View, TextInput, Text } from "react-native";
import {
  selectRecordedSpectra,
  updateSpectrum,
} from "../../redux/reducers/RecordedSpectra";
import { useSelector, useDispatch } from "react-redux";
import { AreaChart } from "react-native-svg-charts";
import * as shape from "d3-shape";
import * as ChartPt from "../../types/ChartPoint";
import * as Spectrum from "../../types/Spectrum";

import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";

function CapturedCell({ navigation, spectrum, idx }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();

  return (
    <TouchableOpacity
      style={styles.cellContainer}
      onPress={() => {
        navigation.navigate("ReviewScreen", {
          spectrum,
          targetIndex: idx,
        });
      }}
    >
      <Text style={styles.name}>{Spectrum.getName(spectrum)}</Text>
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
    </TouchableOpacity>
  );
}

export default function CapturedList({ navigation, style }) {
  const recordedSpectra = useSelector(selectRecordedSpectra);
  const list = recordedSpectra.map((spectrum, idx) => (
    <CapturedCell
      navigation={navigation}
      spectrum={spectrum}
      idx={idx}
      key={`sm${idx}`}
    />
  ));

  return <View style={style}>{list}</View>;
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
  name: {
    flex: 3,
  },
  chart: {
    flex: 2,
  },
});
