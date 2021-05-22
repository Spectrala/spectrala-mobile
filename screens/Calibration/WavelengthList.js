import React, { useCallback } from "react";
import PropTypes from "prop-types";
import {
  FlatList,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  View,
  BackHandler,
  useState,
  StyleSheet,
} from "react-native";
import WavelengthCell from "./WavelengthCell";
import { useTheme } from "@react-navigation/native";

import {
  MINIMUM_WAVELENGTH,
  MAXIMUM_WAVELENGTH,
  currentAndOtherCalibrationPresets,
  presetOfTitle,
} from "../../redux/reducers/calibration/calibration_constants";
import * as CalibPt from "../../redux/reducers/calibration/calibration_point";

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

function WavelengthList(props) {
  const { colors } = useTheme();

  const removeItem = (item) =>
    props.calibrationPoints.filter((w) => w.id != item.id);

  const dispatch = useDispatch();

  const calibrationPoints = props.calibrationPoints;

  const isDuplicateWavelength = useCallback(
    (wavelength) => {
      if (wavelength === null || wavelength === "") return false;
      return calibrationPoints.every(
        (point) => CalibPt.getWavelength(point) !== wavelength
      );
    },
    [calibrationPoints]
  );

  const getValidationFeedback = useCallback(
    (point) => {
      if (CalibPt.wavelengthIsEmpty(point)) {
        return null;
      } else if (!CalibPt.wavelengthIsValid(point)) {
        return `Select a wavelength between ${MINIMUM_WAVELENGTH} and ${MAXIMUM_WAVELENGTH}`;
      } else if (isDuplicateWavelength(CalibPt.getWavelength(point))) {
        return "Duplicated wavelength found.";
      }
    },
    [isDuplicateWavelength]
  );

  const pointIsInvalid = useCallback(
    (point) => {
      return !!getValidationFeedback(point);
    },
    [getValidationFeedback]
  );

  return (
    <FlatList
      style={{ ...styles.list, backgroundColor: colors.background }}
      data={props.calibrationPoints}
      scrollEnabled={false}
      renderItem={({ item, index }) => (
        /**
         *  modifyWavelength: (state, action) => {
            const point =
                state.calibrationPoints.value[action.payload.targetIndex];
            CalibPt.setWavelength(point, action.payload.value);
            if (point.isBeingPlaced && !CalibPt.isValidToPlace(point)) {
              CalibPt.setPlacementStatus(point, false);
          }
},
         */

        <WavelengthCell
          calibrationPoint={item}
          changeWavelength={(wavelength) => {
            dispatch(
              modifyWavelength({
                targetIndex: index,
                value: parseInt(wavelength),
              })
            );
          }}
          removeSelf={() => {
            dispatch(
              removePoint({
                targetIndex: index,
              })
            );
          }}
        />
      )}
      keyExtractor={(item) => String(item.key)}
      showsVerticalScrollIndicator={true}
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
  );
}

WavelengthList.propTypes = {
  calibrationPoints: PropTypes.array.isRequired,
  setWavelengths: PropTypes.func.isRequired,
  inSelectionMode: PropTypes.bool,
  onSelectCell: PropTypes.func,
};

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default WavelengthList;
