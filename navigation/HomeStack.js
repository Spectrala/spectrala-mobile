import { Ionicons } from "@expo/vector-icons";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import * as React from "react";
import { Button } from "react-native";

import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";
import CaptureScreen from "../screens/Capture/CaptureScreen";
import CameraScreen from "../screens/Camera/CameraScreen";
import CalibrationScreen from "../screens/Calibration/CalibrationScreen";
import ReviewScreen from "../screens/ReviewScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HomeScreen from "../screens/Home/HomeScreen";

import {
  HomeStackParamList,
  SettingsParamList,
  ReviewParamList,
} from "../types";

import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";

const NextPageButton = ({ onPress }) => <Item title="Next" onPress={onPress} />;

const HelpButton = ({ onPress }) => (
  <Item title="search" iconName="ios-help" onPress={onPress} />
);

const ReusableHiddenItem = ({ onPress }) => (
  <HiddenItem title="hidden2" onPress={onPress} />
);

const IoniconsHeaderButton = (props) => (
  // the `props` here come from <Item ... />
  // you may access them and pass something else to `HeaderButton` if you like
  <HeaderButton IconComponent={Ionicons} iconSize={23} {...props} />
);

const HomeStack = createStackNavigator();

export default function HomeNavigator({ navigation }) {
  const colorScheme = useColorScheme();
  return (
    // TODO: MARK: Make this "HomeScreen"
    <HomeStack.Navigator initialRouteName="CaptureScreen">
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Sessions",
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
              <Item
                title="Settings"
                iconName="settings"
                onPress={() => {
                  navigation.navigate("SettingsScreen");
                }}
              />
            </HeaderButtons>
          ),
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
              <Item
                title="Select"
                onPress={() => {
                  alert("Start selecting");
                }}
              />
            </HeaderButtons>
          ),
        }}
      />
      <HomeStack.Screen
        name="SettingsScreen"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />
      <HomeStack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          title: "Camera",
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
              <NextPageButton
                onPress={() => navigation.navigate("CalibrationScreen")}
              />
            </HeaderButtons>
          ),
        }}
      />
      <HomeStack.Screen
        name="CalibrationScreen"
        component={CalibrationScreen}
        options={{
          title: "Calibration",
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
              <NextPageButton
                onPress={() => navigation.navigate("CaptureScreen")}
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
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
              <NextPageButton
                onPress={() => navigation.navigate("ReviewScreen")}
              />
            </HeaderButtons>
          ),
        }}
      />
      <HomeStack.Screen
        name="ReviewScreen"
        component={ReviewScreen}
        options={{
          title: "Review",
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
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
