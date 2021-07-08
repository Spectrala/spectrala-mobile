import React, { useCallback } from "react";
import { StyleSheet } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { View } from "react-native-ui-lib";
import CapturedCell from "./CapturedCell";
import { useTheme } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import {
  renameSpectrum,
  selectRecordedSpectra,
  removeSpectrum,
  removeReference,
  setReference,
  setRecordedSpectra,
} from "../../redux/reducers/spectrum";

const CHART_HEIGHT = 200;
const CHART_MARGIN = 16;
const MODE_BUTTON_HEIGHT = 24;

const NUM_ITEMS = 10;

function getColor(i) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

const exampleData = [...Array(10)].map((d, index) => {
  const backgroundColor = getColor(index);
  return {
    key: `item-${backgroundColor}`,
    label: "New Spectrum " + String(index),
    backgroundColor,
  };
});

export default function CapturedList({ navigation }) {
  const dispatch = useDispatch();
  const recordedSpectra = useSelector(selectRecordedSpectra);
  const { colors } = useTheme();

  const renderItem = useCallback(
    ({ item, index, drag, isActive }) => {
      const spectrum = item;

      const text = spectrum.name ? spectrum.name : "";
      const aria = `Saved Spectrum ${index + 1}`;
      return (
        <CapturedCell
          label={text}
          backgroundColor={item.backgroundColor}
          isActive={isActive}
          dragControl={drag}
          data={spectrum.data}
          isReference={spectrum.isReference}
          onSetReference={() => {
            spectrum.isReference
              ? dispatch(removeReference())
              : dispatch(setReference({ targetIndex: index }));
          }}
          onDelete={() => {
            dispatch(
              removeSpectrum({
                targetIndex: index,
              })
            );
          }}
          onRename={(value) => {
            dispatch(
              renameSpectrum({
                targetIndex: index,
                name: value,
              })
            );
          }}
        />
      );
    },
    [recordedSpectra]
  );

  const onReorder = (list) => {
    dispatch(
      setRecordedSpectra({
        value: list,
      })
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={recordedSpectra}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
        onDragEnd={({ data }) => onReorder(data)}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={
          Platform.OS !== "android" &&
          (({ highlighted }) => (
            <View
              style={[
                { ...styles.separator, borderBottomColor: colors.border },
                highlighted && { marginLeft: 0 },
              ]}
            />
          ))
        }
      />
    </View>
  );
}

// CapturedList.propTypes = {
//   selectedMode: PropTypes.string,
// };

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  chart: {
    width: "100%",
    height: CHART_HEIGHT,
  },
  modeContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignContent: "center",
  },
  modeButton: {
    justifyContent: "center",
    height: MODE_BUTTON_HEIGHT,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});
