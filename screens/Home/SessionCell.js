import React from "react";
import PropTypes from "prop-types";
import { TouchableWithoutFeedback, Text, View, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";

/**
 * https://icons.expo.fyi
 *
 * Ionicons:
 * arrow-up-circle
 * arrow-up-circle-outline
 */
function SessionCell(props) {
  return (
    <TouchableOpacity>
      <View style={styles.container}>
        <View style={styles.leftBox}>
          <Ionicons
            name={
              props.isUploaded ? "arrow-up-circle" : "arrow-up-circle-outline"
            }
            size={24}
            color="blue"
          />
        </View>
        <View style={styles.centerBox}>
          <Text style={styles.title}>{props.name}</Text>
          <Text>{format(props.date, "eeee, MMMM d, yyyy")}</Text>
        </View>
        <View style={styles.rightBox}>
          <Text style={{ flex: 1, alignSelf: "center"}}>Charts</Text>
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
    height: 64,
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
    flex: 1
  },
  rightBox: {
    width: 140,
    backgroundColor: "#F0FF0F20",
    borderColor: "black",
    borderWidth: 0.2,
    marginLeft: "auto",
    marginRight: 12
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export default SessionCell;
