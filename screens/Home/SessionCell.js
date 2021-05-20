import React from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@react-navigation/native";
/**
 * https://icons.expo.fyi
 *
 * Ionicons:
 * arrow-up-circle
 * arrow-up-circle-outline
 */
function SessionCell(props) {
  const { colors } = useTheme();

  return (
    <TouchableOpacity onPress={props.onSelect}>
      <View style={{ ...styles.container, backgroundColor: colors.card }}>
        <View style={styles.leftBox}>
          <Ionicons
            name={
              props.isUploaded ? "arrow-up-circle" : "arrow-up-circle-outline"
            }
            size={24}
            color={colors.primary}
          />
        </View>
        <View style={styles.centerBox}>
          <Text style={{ ...styles.title, color: colors.text }}>
            {props.name}
          </Text>
          <Text style={{ color: colors.text }}>
            {format(props.date, "eeee, MMMM d, yyyy")}
          </Text>
        </View>
        <View style={styles.rightBox}>
          <Text style={{ flex: 1, alignSelf: "center" }}>Charts</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

SessionCell.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  onSelect: PropTypes.func,
  inSelectionMode: PropTypes.bool.isRequired,
  isUploaded: PropTypes.bool,
  isSelected: PropTypes.bool,
};

// TODO: Add preview of spectra
// TODO: Adjust for long names

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  leftBox: {
    width: 40,
    alignItems: "center",
  },
  centerBox: {
    alignItems: "flex-start",
    flex: 1,
  },
  rightBox: {
    width: 140,
    backgroundColor: "#F0FF0F20",
    borderColor: "green",
    borderWidth: 0.2,
    marginLeft: "auto",
    marginRight: 12,
  },
  title: {
    fontSize: 20,
    paddingBottom: 2,
    fontWeight: "bold",
  },
});

export default SessionCell;
