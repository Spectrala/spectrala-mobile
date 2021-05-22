import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
import {
  TouchableWithoutFeedback,
  Text,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import { TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { FontAwesome, Entypo } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
import KeyboardSpacer from "react-native-keyboard-spacer";

/**
 * https://icons.expo.fyi
 *
 * Ionicons:
 * arrow-up-circle
 * arrow-up-circle-outline
 */

function WavelengthCell(props) {
  const { colors } = useTheme();

  const invalid = props.checkValid(props.calibrationPoint);

  const getValidationText = () => {
    if (!invalid) return;
    return (
      <Text style={styles.validationText}>
        {props.getValidationFeedback(props.calibrationPoint)}
      </Text>
    );
  };

  const wavelength = props.calibrationPoint.wavelength;

  const getPrependedGroup = useCallback(() => {
    const description = props.placementStatusDescription;

    if (description["isBeingPlaced"]) {
      return (
        <TouchableOpacity style={styles.lock} onPress={props.onCancel}>
          <FontAwesome name="unlock-alt" size={24} color="black" />
        </TouchableOpacity>
      );
    } else if (description["hasBeenPlaced"]) {
      return (
        <TouchableOpacity style={styles.lock} onPress={props.onEdit}>
          <FontAwesome name="lock" size={24} color="black" />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        style={styles.placeText}
        disabled={invalid}
        onPress={props.onBeginPlace}
      >
        <Text>Place</Text>
      </TouchableOpacity>
    );
  }, []);

  return (
    <View style={styles.container}>
      {getPrependedGroup()}
      <TextInput
        style={{ ...styles.input, ...(invalid ? styles.invalidInput : {}) }}
        onChangeText={(text) => props.changeWavelength(text)}
        value={wavelength ? wavelength.toString() : ""}
        placeholder="Wavelength (nm)"
        keyboardType="numeric"
        editable={props.isEnabled}
      />
      {getValidationText()}
      <TouchableOpacity style={styles.minus} onPress={props.onDelete}>
        <FontAwesome name={"minus-circle"} size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
}

WavelengthCell.propTypes = {
  calibrationPoint: PropTypes.object,
  changeWavelength: PropTypes.func,
  checkValid: PropTypes.func,
  getValidationFeedback: PropTypes.func,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  onBeginPlace: PropTypes.func,
  placementStatusDescription: PropTypes.object,
  onDelete: PropTypes.func,
  isEnabled: PropTypes.bool,
};

const PADDING = 8;

const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
  },
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
    borderColor: "black",
  },
  invalidInput: {
    borderColor: "orange",
    width: 60,
  },
  validationText: {
    marginHorizontal: PADDING,
    flexShrink: 1,
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
  placeText: {
    fontSize: 14,
  },
});

export default WavelengthCell;
