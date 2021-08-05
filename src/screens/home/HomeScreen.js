import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { StyleSheet, View, FlatList } from "react-native";
import { getSessions, eraseSessions } from "../../navigation/SessionStorage";
import PropTypes from "prop-types";
import SessionCell from "./SessionCell";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Session from "../../types/Session";
import {
  DEFAULT_SPECTRUM_SLICE_STATE,
  restoreSpectra,
} from "../../redux/reducers/RecordedSpectra";
import { useDispatch } from "react-redux";

const ADD_DIAMETER = 90;
const ADD_ICON_WIDTH = 70;

function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const [sessions, setSessions] = useState([]);
  const dispatch = useDispatch();

  const fetchSessions = async () => {
    const savedSessions = await getSessions();
    setSessions(savedSessions);
  };

  useFocusEffect(
    useCallback(() => {
      // eraseSessions();
      fetchSessions();
    }, [])
  );

  const sessionList = () => (
    <FlatList
      data={sessions.sort(
        (a, b) =>
          new Date(Session.getLastEditDateUnix(b)) -
          new Date(Session.getLastEditDateUnix(a))
      )}
      renderItem={({ item: session }) => {
        const date = Session.getLastEditDateUnix(session);
        const name = Session.getName(session);
        return (
          <SessionCell
            name={name}
            date={date}
            onSelect={() => navigation.navigate("SessionDetail", { session })}
          />
        );
      }}
      keyExtractor={(item) => String(item.name)}
      showsVerticalScrollIndicator={true}
    />
  );

  const noSessionsMessage = () => (
    <Text style={styles.noSessions}>
      No saved sessions. Press the add button at the bottom to get started!
    </Text>
  );

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.foreground,
      }}
    >
      {sessions && sessions.length > 0 ? sessionList() : noSessionsMessage()}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          navigation.push("CameraScreen");
          dispatch(restoreSpectra({ value: DEFAULT_SPECTRUM_SLICE_STATE }));
        }}
      >
        <Ionicons
          style={styles.addIcon}
          name={"add-outline"}
          size={ADD_ICON_WIDTH}
          color={colors.foreground}
        />
      </TouchableOpacity>
    </View>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    marginHorizontal: 16,
  },
  addButton: {
    backgroundColor: "orange",
    height: ADD_DIAMETER,
    width: ADD_DIAMETER,
    borderRadius: ADD_DIAMETER / 2,
    shadowRadius: 30,
    shadowColor: "gray",
    shadowOpacity: 0.4,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "auto",
    bottom: 32,
  },
  addIcon: {
    height: ADD_ICON_WIDTH,
    width: ADD_ICON_WIDTH,
    left: 2,
    bottom: 2,
  },
  noSessions: {
    marginTop: 32,
  },
});

export default HomeScreen;
