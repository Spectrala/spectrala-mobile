import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { HomeStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import CaptureChart from "./CaptureChart";
import { TouchableOpacity } from "react-native-gesture-handler";
import PropTypes from "prop-types";

const CHART_HEIGHT = 200;
const CHART_MARGIN = 16;
const MODE_BUTTON_HEIGHT = 24;

export default function ModeSwitcher({ navigation }) {
  return (
    <View style={styles.modeContainer}>
      <TouchableOpacity style={styles.modeButton}>
        <Text style={styles.modeButtonText}>Intensity</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modeButton}>
        <Text style={styles.modeButtonText}>Transmittance</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.modeButton}>
        <Text style={styles.modeButtonText}>Absorbance</Text>
      </TouchableOpacity>
    </View>
  );
}

ModeSwitcher.propTypes = {
  selectedMode: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  chart: {
    width: "100%",
    height: CHART_HEIGHT,
  },
  modeContainer: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignContent: "center",
  },
  modeButton: {
    justifyContent: "center",
    height: MODE_BUTTON_HEIGHT,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
