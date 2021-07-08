import React from "react";
import PropTypes from "prop-types";
import {
  FlatList,
  View,
  StyleSheet,
} from "react-native";
import SessionCell from "./SessionCell";
import { useTheme } from "@react-navigation/native";

function SessionList(props) {
  const { colors } = useTheme();

  return (
    <FlatList
      style={{ ...styles.list, backgroundColor: colors.background }}
      data={props.sessions}
      renderItem={({ item }) => (
        <SessionCell
          name={item.name}
          date={item.date}
          inSelectionMode={props.inSelectionMode}
          isUploaded={item.isUploaded}
          isSelected={item.isSelected}
          onSelect={() => props.onSelectCell(item)}
        />
      )}
      keyExtractor={(item) => String(item.name)}
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

SessionList.propTypes = {
  sessions: PropTypes.array.isRequired,
  inSelectionMode: PropTypes.bool.isRequired,
  onSelectCell: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});

export default SessionList;
