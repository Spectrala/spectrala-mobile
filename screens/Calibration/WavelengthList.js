import React from "react";
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
import { modifyWavelength } from "../../redux/reducers/calibration/calibration";
import { useDispatch, useSelector } from "react-redux";

function WavelengthList(props) {
  const { colors } = useTheme();

  const removeItem = (item) => props.wavelengths.filter((w) => w.id != item.id);

  const dispatch = useDispatch();

  return (
    <FlatList
      style={{ ...styles.list, backgroundColor: colors.background }}
      data={props.wavelengths}
      scrollEnabled={false}
      renderItem={({ item, idx }) => (
        <WavelengthCell
          calibrationPoint={item}
          changeWavelength={(wavelength) => {
            dispatch(
              modifyWavelength({
                targetIndex: idx,
                value: parseInt(wavelength),
              })
            );
          }}
          removeSelf={() => {
            dispatch(
              removePoint({
                targetIndex: idx,
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
  wavelengths: PropTypes.array.isRequired,
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
