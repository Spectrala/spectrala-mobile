import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import { StackedAreaChart } from "react-native-svg-charts";
import DropDownPicker from "react-native-dropdown-picker";
import * as shape from "d3-shape";
import { useDispatch, useSelector } from "react-redux";

import {
  selectCalibrationPoints,
  modifyWavelength,
  removePoint,
  addOption,
  beginPlace,
  cancelPlace,
  editPlacement,
  setCalibrationPoints,
  setPreset,
} from "../../redux/reducers/calibration/calibration";
import { currentAndOtherCalibrationPresets } from "../../redux/reducers/calibration/calibration_constants";

const DEFAULT_CALIBRATION = "cfl";
function CalibrationModePicker(props) {
  const { colors } = useTheme();

  const [open, setOpen] = useState(false);
  const [valueID, setValueID] = useState(DEFAULT_CALIBRATION);
  const [items, setItems] = useState([
    { label: "CFL Bulb", value: "cfl" },
    { label: "Ch3a Lab Kit", value: "ch3kit" },
  ]);

  //   {
  //     title: 'Ch3A Lab Kit',
  //     value: [400, 530, 875, 940],
  // },

  const calibrationPoints = useSelector(
    selectCalibrationPoints,
    (a, b) => false // TODO: Fix hack
  );

  const dispatch = useDispatch();
  const presets = currentAndOtherCalibrationPresets(calibrationPoints);

  useEffect(() => {
    const preset = presets.all.filter((p) => p.id === valueID)[0];
    if (preset.value) {
      console.log("okay something got called");
      dispatch(
        setPreset({
          preset,
        })
      );
    }
  }, [valueID]);

  useEffect(() => {
    console.log(`Items: ${JSON.stringify(items)}`);
  }, [items]);

  if (!presets) return;

  console.log(`Show this preset: ${JSON.stringify(presets.current)}`);

  return (
    <DropDownPicker
      open={open}
      value={presets.current.id}
      items={presets.all}
      schema={{
        label: "title",
        value: "id",
      }}
      itemKey="id"
      setOpen={setOpen}
      setValue={setValueID}
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
        borderRadius: 0,
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
