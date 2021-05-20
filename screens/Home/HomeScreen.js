import * as React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import PropTypes from "prop-types";
import { HomeStackParamList } from "../../types";
import { StackNavigationProp } from "@react-navigation/stack";
import SessionList from "./SessionList";

const SESSIONS = [
  {
    name: "Beer's Law Lab",
    date: new Date("9/17/2021"),
    isSelected: false,
    isUploaded: false,
  },
  {
    name: "Yellowstone",
    date: new Date("9/13/2021"),
    isSelected: true,
    isUploaded: true,
  },
  {
    name: "Samples",
    date: new Date("2/13/2021"),
    isSelected: true,
    isUploaded: true,
  },
];

const onSelectSession = (session, navigation) => {
  console.log(session);
  navigation.navigate("CameraScreen");
};

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <SessionList
        sessions={SESSIONS}
        inSelectionMode={true}
        onSelectCell={(session) => onSelectSession(session, navigation)}
      />
    </View>
  );
}

HomeScreen.propTypes = {
  navigation: PropTypes.object,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});

export default HomeScreen;
