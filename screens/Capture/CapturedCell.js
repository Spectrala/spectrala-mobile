import React, { useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
} from "react-native";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import PropTypes from "prop-types";
import { MaterialIcons } from "@expo/vector-icons";
import PreviewChart from "./PreviewChart";

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
  const activeProps = {
    shadowRadius: 4,
    shadowOpacity: 0.1,
  };
  return (
    <SafeAreaView
      style={{
        ...styles.container,
        ...(props.isActive ? activeProps : {}),
      }}
    >
      <TextInput
        style={styles.input}
        onChangeText={(wavelength) => {
          console.log(wavelength);
        }}
        value={props.label}
        placeholder="Spectrum name..."
        keyboardType="default"
      />
      <View style={styles.rightContainer}>
        <PreviewChart />
        <TouchableOpacity onLongPress={props.dragControl}>
          <MaterialIcons name="drag-indicator" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

CapturedCell.propTypes = {
  label: PropTypes.string,
  backgroundColor: PropTypes.any,
  isActive: PropTypes.bool,
  dragControl: PropTypes.func,
};

const PADDING = 8;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
  },
  input: {
    height: 40,
    marginLeft: PADDING,
    width: 180,
    borderWidth: 1,
    paddingLeft: 10,
  },
  lock: {
    width: 30,
    display: "flex",
    alignItems: "center",
    marginLeft: PADDING,
  },
  minus: {
    width: 30,
    display: "flex",
    alignItems: "center",
    marginLeft: "auto",
    marginRight: PADDING,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});