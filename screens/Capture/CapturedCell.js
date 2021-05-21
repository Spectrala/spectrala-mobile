import React, { useState, useCallback } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import PropTypes from "prop-types";
import { MaterialIcons } from "@expo/vector-icons";

const CHART_HEIGHT = 200;
const CHART_MARGIN = 16;
const MODE_BUTTON_HEIGHT = 24;

const NUM_ITEMS = 10;

function getColor(i) {
  const multiplier = 255 / (NUM_ITEMS - 1);
  const colorVal = i * multiplier;
  return `rgb(${colorVal}, ${Math.abs(128 - colorVal)}, ${255 - colorVal})`;
}

export default function CapturedCell(props) {
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: props.isActive ? "red" : props.backgroundColor,
      }}
    >
      <Text
        style={{
          fontWeight: "bold",
          color: "white",
          fontSize: 32,
        }}
      >
        {props.label}
      </Text>
      <TouchableOpacity onLongPress={props.dragControl}>
        <MaterialIcons name="drag-indicator" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

CapturedCell.propTypes = {
  label: PropTypes.string,
  backgroundColor: PropTypes.any,
  isActive: PropTypes.bool,
  dragControl: PropTypes.func,
};

const styles = StyleSheet.create({
  container: {
    height: 100,
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 20,
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
});
