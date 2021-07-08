import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { StyleSheet } from "react-native";
import { useTheme } from "@react-navigation/native";
import DropDownPicker from "react-native-dropdown-picker";
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

  const calibrationPoints = useSelector(
    selectCalibrationPoints,
    (a, b) => false // TODO: Fix hack
  );

  const dispatch = useDispatch();
  const presets = currentAndOtherCalibrationPresets(calibrationPoints);

  const [valueID, setValueID] = useState(presets.current.id);
  const [items, setItems] = useState(presets.all);

  // If changing presets is necessary, use something like this
  // const [items, setItems] = useState([
  //   { label: "CFL Bulb", value: "cfl" },
  //   { label: "Ch3a Lab Kit", value: "ch3kit" },
  // ]);
  // In the DropDownPicker component:
  //

  const updatePreset = useCallback(() => {
    const preset = presets.all.find((p) => p.id === valueID);
    if (preset.value) {
      dispatch(
        setPreset({
          preset,
        })
      );
    }
  }, [valueID, items]);

  useEffect(() => {
    updatePreset();
  }, [valueID, items]);

  if (!presets) return;

  return (
    <DropDownPicker
      open={props.open}
      value={presets.current.id}
      items={presets.all}
      setItems={setItems}
      schema={{
        label: "title",
        value: "id",
      }}
      itemKey="id"
      setOpen={props.setOpen}
      setValue={(setter) => {
        setValueID(setter);
        updatePreset();
      }}
      searchable={true}
      searchPlaceholder={"Search..."}
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

CalibrationModePicker.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingTop: 8,
    paddingHorizontal: 32,
  },
});

export default CalibrationModePicker;
