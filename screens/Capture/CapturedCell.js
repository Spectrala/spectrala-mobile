import React, { useState, useCallback } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Button,
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
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={props.onDelete}
      >
        <Text style={styles.buttonText}>Delete</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        onChangeText={props.onRename}
        value={props.label}
        placeholder="Spectrum name..."
        keyboardType="default"
      />

      <TouchableOpacity
        onPress={props.onSetReference}
        style={{
          ...styles.buttonStyle,
          ...(props.isReference ? styles.selectedButton : {}),
        }}
      >
        <Text style={{
          ...styles.buttonText,
          ...(props.isReference ? styles.selectedButtonText : {}),
        }}>Ref</Text>
      </TouchableOpacity>

      <View style={styles.rightContainer}>
        <PreviewChart data={props.data} />
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
  data: PropTypes.array,
  isReference: PropTypes.bool,
  onSetReference: PropTypes.func,
  onDelete: PropTypes.func,
  onRename: PropTypes.func,
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
    width: 140,
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
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    alignContent: "center",
  },
  buttonStyle: {
    marginLeft: PADDING,
  },
  selectedButton: {
    backgroundColor: "black",
    padding: 5,
    borderRadius: 3,
  },
  selectedButtonText: {
    color: "white",
  },
});
