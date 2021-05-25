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
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
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
  placePoint,
} from "../../redux/reducers/calibration/calibration";

function WavelengthList(props) {
  const { colors } = useTheme();

  const removeItem = (item) =>
    props.calibrationPoints.filter((w) => w.id != item.id);

  const dispatch = useDispatch();

  const calibrationPoints = props.calibrationPoints;

  // TODO: Make isDuplicateWavelength work (could also be implementation).
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
        return `Select a wavelength between ${CalibPt.MINIMUM_WAVELENGTH} and ${CalibPt.MAXIMUM_WAVELENGTH}`;
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
        <WavelengthCell
          calibrationPoint={item}
          checkValid={pointIsInvalid}
          getValidationFeedback={getValidationFeedback}
          changeWavelength={(wavelength) => {
            dispatch(
              modifyWavelength({
                targetIndex: index,
                value: wavelength,
              })
            );
          }}
          onEdit={() => {
            dispatch(
              editPlacement({
                targetIndex: index,
              })
            );
          }}
          onBeginPlace={() => dispatch(beginPlace({ targetIndex: index }))}
          onCancel={() => dispatch(cancelPlace({ targetIndex: index }))}
          onEndPlace={() =>
            dispatch(
              placePoint({
                value: props.calibXFromChartX(props.activeXPosition),
                targetIndex: index,
              })
            )
          }
          onDelete={() => dispatch(removePoint({ targetIndex: index }))}
          isEnabled={props.inputEnabled}
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
  inputEnabled: PropTypes.bool.isRequired,
  activeXPosition: PropTypes.number,
  calibXFromChartX: PropTypes.func,
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
