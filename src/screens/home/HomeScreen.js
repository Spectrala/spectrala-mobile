import React from "react";
import { StyleSheet, View, FlatList } from "react-native";
import PropTypes from "prop-types";
import SessionCell from "./SessionCell";
import { useTheme } from "@react-navigation/native";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

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

const ADD_DIAMETER = 90;
const ADD_ICON_WIDTH = 70;

function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: colors.foreground,
      }}
    >
      <FlatList
        style={styles.list}
        data={SESSIONS}
        renderItem={({ item }) => (
          <SessionCell
            name={item.name}
            date={item.date}
            onSelect={() => console.log(item)}
          />
        )}
        keyExtractor={(item) => String(item.name)}
        showsVerticalScrollIndicator={true}
      />
      <TouchableOpacity
        style={styles.bottomBar}
        onPress={() => navigation.navigate("CameraScreen")}
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
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    marginHorizontal: 16,
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
  bottomBar: {
    backgroundColor: "orange",
    height: ADD_DIAMETER,
    width: ADD_DIAMETER,
    borderRadius: ADD_DIAMETER / 2,
    bottom: 32,
    shadowRadius: 30,
    shadowColor: "gray",
    shadowOpacity: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    height: ADD_ICON_WIDTH,
    width: ADD_ICON_WIDTH,
    paddingLeft: 2,
    paddingBottom: 2,
  },
});

export default HomeScreen;
