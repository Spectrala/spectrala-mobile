import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import PropTypes from "prop-types";

const CHART_HEIGHT = 200;
const MODE_BUTTON_HEIGHT = 24;

export default function ModeSwitcher(props) {
  const isSelected = (spectrumOption) => {
    return spectrumOption === props.selectedViewOption;
  };

  return (
    <View style={styles.modeContainer}>
      {props.spectrumViewOptions.map((spectrumOption, idx) => (
        <TouchableOpacity
          key={idx}
          disabled={!props.optionIsEnabled(spectrumOption)}
          style={{
            ...styles.modeButton,
            ...(isSelected(spectrumOption) ? styles.selectedButton : {}),
          }}
          onPress={() => {
            props.onPress(spectrumOption);
          }}
        >
          <Text
            style={{
              ...styles.modeButtonText,
              ...(isSelected(spectrumOption) ? styles.selectedText : {}),
              ...(!props.optionIsEnabled(spectrumOption)
                ? styles.disabledText
                : {}),
            }}
          >
            {spectrumOption}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

ModeSwitcher.propTypes = {
  spectrumViewOptions: PropTypes.array,
  selectedViewOption: PropTypes.string,
  onPress: PropTypes.func,
  optionIsEnabled: PropTypes.func,
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
    marginBottom: 4,
  },
  modeButton: {
    justifyContent: "center",
    height: MODE_BUTTON_HEIGHT,
  },
  selectedButton: {
    backgroundColor: "black",
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  disabledText: {
    fontWeight: "normal",
    color: "gray",
  },
  selectedText: {
    color: "white",
    fontWeight: "normal",
  },
});
