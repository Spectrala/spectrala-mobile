import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "../screens/camera/CameraScreen";
import CalibrationScreen from "../screens/calibration/CalibrationScreen";
import CaptureScreen from "../screens/capture/CaptureScreen";
import ReviewScreen from "../screens/review/ReviewScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HomeScreen from "../screens/home/HomeScreen";
import {
  HeaderButtons,
  HeaderButton,
  Item,
} from "react-navigation-header-buttons";
import { useTheme } from "@react-navigation/native";

const NextPageButton = ({ onPress }) => <Item title="Next" onPress={onPress} />;

const IoniconsHeaderButton = (props) => (
  // the `props` here come from <Item ... />
  // you may access them and pass something else to `HeaderButton` if you like
  <HeaderButton IconComponent={Ionicons} iconSize={23} {...props} />
);

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
      initialRouteName="CaptureScreen"
      options={{ headerTintColor: colors.background }}
      screenOptions={{ gestureEnabled: false }}
    >
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

          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
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
          title: "Setup Box",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
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
          title: "Setup Calibration",
          headerStyle: {
            backgroundColor: colors.background,
          },
          headerTintColor: colors.text,
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
          headerStyle: {
            backgroundColor: colors.background,
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
          },
          headerTintColor: colors.text,
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
