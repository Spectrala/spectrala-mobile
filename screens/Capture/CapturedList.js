import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import PropTypes from "prop-types";
import { MaterialIcons } from "@expo/vector-icons";
import CapturedCell from "./CapturedCell";
import { useTheme } from "@react-navigation/native";

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
  const [data, setData] = useState(exampleData);
  const { colors } = useTheme();

  const renderItem = useCallback(({ item, index, drag, isActive }) => {
    return (
      <CapturedCell
        label={item.label}
        backgroundColor={item.backgroundColor}
        isActive={isActive}
        dragControl={drag}
      />
    );
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item, index) => `draggable-item-${item.key}`}
        onDragEnd={({ data }) => setData(data)}
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
