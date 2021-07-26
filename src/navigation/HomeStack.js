import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "../screens/camera/CameraScreen";
import CalibrationScreen from "../screens/calibration/CalibrationScreen";
import CaptureScreen from "../screens/capture/CaptureScreen";
import ReviewScreen from "../screens/review/ReviewScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HomeScreen from "../screens/home/HomeScreen";
import { View, Text } from "react-native";
import {
  HeaderButtons,
  HeaderButton,
  Item,
} from "react-navigation-header-buttons";
import { useTheme } from "@react-navigation/native";

const TextHeaderButton = ({ onPress, text }) => (
  <Item title={text} onPress={onPress} />
);

const IconHeaderButton = (props) => (
  <HeaderButton IconComponent={Ionicons} iconSize={23} {...props} />
);

function TitleHeader({ title }) {
  return <Text style={{ fontSize: 20, fontWeight: "600" }}>{title}</Text>;
}

function ProgressHeader({ title }) {
  return TitleHeader(title);
}

const HomeStack = createStackNavigator();

export default function HomeNavigator({ navigation }) {
  const { colors } = useTheme();
  return (
    /**
     * TODO: MARK: the initialRouteName prop in HomeStack.Navigator will
     * define the first screen to load in the navigation stack.
     * For production, make this "HomeScreen".
     * In debug, use:
     *  "CameraScreen", "CalibrationScreen", or "CaptureScreen".
     * A con to this debug strategy is that you can't go back since previous
     * screens were not loaded to the stack.
     */
    <HomeStack.Navigator
      initialRouteName="CameraScreen"
      screenOptions={{ gestureEnabled: false }}
    >
      <HomeStack.Screen
        name="Sessions"
        component={HomeScreen}
        options={{
          headerTitle: () => <TitleHeader title="Sessions" />,
          headerTitleAlign: "left",
          headerStyle: {
            backgroundColor: colors.background,
            shadowColor: "transparent",
          },
        }}
      />
      <HomeStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />
      <HomeStack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          title: "Setup Box",
          headerStyle: {
            backgroundColor: colors.background,
            shadowColor: "transparent",
          },
          headerBackTitleVisible: false,
          headerTintColor: colors.text,
          headerTitle: () => <TitleHeader title="Camera" />,
          headerTitleAlign: "left",
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IconHeaderButton}>
              <TextHeaderButton
                onPress={() => navigation.navigate("CalibrationScreen")}
                text={"Next"}
              />
            </HeaderButtons>
          ),
        }}
      />
      <HomeStack.Screen
        name="CalibrationScreen"
        component={CalibrationScreen}
        options={{
          title: "Setup Calibration",
          headerStyle: {
            backgroundColor: colors.background,
            shadowColor: "transparent",
          },
          headerTintColor: colors.text,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IconHeaderButton}>
              <TextHeaderButton
                onPress={() => navigation.navigate("CaptureScreen")}
                text={"Next"}
              />
            </HeaderButtons>
          ),
        }}
      />
      <HomeStack.Screen
        name="CaptureScreen"
        component={CaptureScreen}
        options={{
          title: "Capture",
          headerStyle: {
            backgroundColor: colors.background,
            shadowColor: "transparent",
          },
          headerTintColor: colors.text,
        }}
      />
      <HomeStack.Screen
        name="ReviewScreen"
        component={ReviewScreen}
        options={{
          title: "Review",
          headerStyle: {
            backgroundColor: colors.background,
            shadowColor: "transparent",
          },
          headerTintColor: colors.text,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IconHeaderButton}>
              <Item
                title="Save"
                onPress={() => {
                  alert("Save");
                  navigation.popToTop();
                }}
              />
            </HeaderButtons>
          ),
        }}
      />
    </HomeStack.Navigator>
  );
}

function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}
