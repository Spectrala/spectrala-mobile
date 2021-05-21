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

  const removeItem = (item) => props.wavelengths.filter((w) => w.id != item.id);

  return (
    <FlatList
      style={{ ...styles.list, backgroundColor: colors.background }}
      data={props.wavelengths}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <WavelengthCell
          calibrationPoint={item}
          setSelf={(newSelf) => {
            const idx = props.wavelengths.indexOf(item);
            let wavelengths = [...props.wavelengths];
            wavelengths[idx] = { ...newSelf, id: wavelengths[idx].id };
            props.setWavelengths(wavelengths);
          }}
          removeSelf={() => props.setWavelengths(removeItem(item))}
        />
      )}
      keyExtractor={(item) => String(item.id)}
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
