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
import SessionCell from "./SessionCell";

function SessionList(props) {
  return (
    <FlatList
      style={styles.list}
      data={props.sessions}
      renderItem={({ item }) => (
        <SessionCell
          name={item.name}
          date={item.date}
          inSelectionMode={props.inSelectionMode}
          isUploaded={item.isUploaded}
          isSelected={item.isSelected}
        />
      )}
      keyExtractor={(item) => String(item.name)}
      showsVerticalScrollIndicator={true}
      ItemSeparatorComponent={
        Platform.OS !== "android" &&
        (({ highlighted }) => (
          <View style={[styles.separator, highlighted && { marginLeft: 0 }]} />
        ))
      }
    />
  );
}

SessionList.propTypes = {
  sessions: PropTypes.array.isRequired,
  inSelectionMode: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
  separator: {
      borderBottomColor: 'lightgray',
      borderBottomWidth: StyleSheet.hairlineWidth,
  }
});

export default SessionList;
