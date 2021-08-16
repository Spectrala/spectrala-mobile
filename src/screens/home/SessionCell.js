import React from "react";
import PropTypes from "prop-types";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import { format } from "date-fns";
import { useTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

/**
 * React.memo helps speed up using the cell in the flatlist.
 * https://reactjs.org/docs/hooks-faq.html#how-do-i-implement-shouldcomponentupdate
 */
const SessionCell = React.memo(
  ({ name, numSessions, date: dateUnix, onSelect }) => {
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
        <View style={styles.right}>
          {numSessions > 0 && (
            <Text style={{ ...styles.numSpectraText, color: colors.grayText }}>
              {numSessions}
            </Text>
          )}
          <Ionicons name="chevron-forward" size={24} color={colors.grayText} />
        </View>
      </TouchableOpacity>
    );
  }
);

SessionCell.propTypes = {
  name: PropTypes.string.isRequired,
  date: PropTypes.number.isRequired,
  numSessions: PropTypes.number,
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
  right: {
    alignSelf: "center",
    flexDirection: "row",
  },
  numSpectraText: {
    fontSize: 16,
    textAlignVertical: "center",
    alignSelf: "center",
    marginRight: 4,
  },
});

export default SessionCell;
