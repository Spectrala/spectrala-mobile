import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { format } from "date-fns";
import { useTheme } from "@react-navigation/native";
/**
 * https://icons.expo.fyi
 *
 * Ionicons:
 * arrow-up-circle
 * arrow-up-circle-outline
 */
function SessionCell({ name, date: dateUnix, onSelect }) {
  const { colors } = useTheme();

  const date = new Date(dateUnix);

  return (
    <TouchableOpacity onPress={onSelect} style={styles.container}>
      <View style={styles.centerBox}>
        <Text style={styles.title}>{name}</Text>
        <Text style={{ color: colors.text }}>
          {format(date, "h:mmaaa eeee, MMMM d, yyyy")}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

SessionCell.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.instanceOf(Date).isRequired,
  onSelect: PropTypes.func,
  isUploaded: PropTypes.bool,
  isSelected: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    height: 80,
    width: "100%",
    flexDirection: "row",
  },
  centerBox: {
    height: "100%",
    justifyContent: "center",
    marginRight: "auto",
  },
  title: {
    fontSize: 20,
    paddingBottom: 2,
    fontWeight: "500",
  },
});

export default SessionCell;
