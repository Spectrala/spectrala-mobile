import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  TouchableWithoutFeedback,
  Text,
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from "react-native";
import { TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { FontAwesome } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
/**
 * https://icons.expo.fyi
 *
 * Ionicons:
 * arrow-up-circle
 * arrow-up-circle-outline
 */

function WavelengthCell(props) {
  const { colors } = useTheme();

  const [number, onChangeNumber] = useState(props.wavelength);
  const IS_LOCKED = false;
  const [isLocked, setLocked] = useState(IS_LOCKED);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        style={styles.lock}
        onPress={() => {
          setLocked(!isLocked);
        }}
      >
        <FontAwesome
          name={isLocked ? "lock" : "unlock-alt"}
          size={24}
          color="black"
        />
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={number.toString()}
        placeholder="Wavelength (nm)"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.minus} onPress={props.removeSelf}>
        <FontAwesome name={"minus-circle"} size={24} color="black" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

WavelengthCell.propTypes = {
  name: PropTypes.string,
  wavelength: PropTypes.number,
  onSelect: PropTypes.func,
  inSelectionMode: PropTypes.bool,
  isUploaded: PropTypes.bool,
  isSelected: PropTypes.bool,
  removeSelf: PropTypes.func,
};

// TODO: Add preview of spectra
// TODO: Adjust for long names

const PADDING = 8;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
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
});

export default WavelengthCell;
