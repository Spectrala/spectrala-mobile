import React, { useState } from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { StackedAreaChart } from "react-native-svg-charts";
import DropDownPicker from "react-native-dropdown-picker";
import * as shape from "d3-shape";

const DEFAULT_CALIBRATION = "cfl";
function CalibrationModePicker(props) {
  const { colors } = useTheme();

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(DEFAULT_CALIBRATION);
  const [items, setItems] = useState([
    { label: "CFL Bulb", value: "cfl" },
    { label: "Ch3a Lab Kit", value: "ch3kit" },
  ]);

  return (
    <DropDownPicker
      open={open}
      value={value}
      items={items}
      setOpen={setOpen}
      setValue={setValue}
      searchable={true}
      searchPlaceholder={"Search..."}
      setItems={setItems}
      containerStyle={{
        borderWidth: 0,
      }}
      labelStyle={{
        fontWeight: "bold",
      }}
      style={{
        borderWidth: 0,
      }}
    />
  );
}

// TODO: use some real data.

// CalibrationModePicker.propTypes = {
//   name: PropTypes.string.isRequired,
//   date: PropTypes.instanceOf(Date).isRequired,
//   onSelect: PropTypes.func,
//   inSelectionMode: PropTypes.bool.isRequired,
//   isUploaded: PropTypes.bool,
//   isSelected: PropTypes.bool,
// };

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 8,
    paddingHorizontal: 32,
  },
});

export default CalibrationModePicker;
