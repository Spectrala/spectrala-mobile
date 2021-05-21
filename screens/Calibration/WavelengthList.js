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

function WavelengthList(props) {
  const { colors } = useTheme();

  return (
    <FlatList
      style={{ ...styles.list, backgroundColor: colors.background }}
      data={props.wavelengths}
      renderItem={({ item }) => (
        <WavelengthCell
          wavelength={item.wavelength}
          inSelectionMode={props.inSelectionMode}
          isUploaded={item.isUploaded}
          isSelected={item.isSelected}
          onSelect={() => props.onSelectCell(item)}
          removeSelf={() => {
            console.log(
              props.wavelengths.filter((w) => w.wavelength != item.wavelength)
            );
            props.setWavelengths(
              props.wavelengths.filter((w) => w.wavelength != item.wavelength)
            );
          }}
        />
      )}
      keyExtractor={(item) => String(item.wavelength)}
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
