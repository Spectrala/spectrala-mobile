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
import TitleHeader from "../components/TitleHeader";
import { storeCurrentSession } from "../navigation/SessionStorage";

const TextHeaderButton = ({ onPress, text }) => (
  <Item title={text} onPress={onPress} />
);

const IconHeaderButton = (props) => (
  <HeaderButton IconComponent={Ionicons} iconSize={23} {...props} />
);

const NavStack = createStackNavigator();

export default function HomeNavigator({ navigation }) {
  const { colors } = useTheme();
  return (
    /**
     * TODO: MARK: the initialRouteName prop in NavStack.Navigator will
     * define the first screen to load in the navigation stack.
     * For production, make this "HomeScreen".
     * In debug, use:
     *  "CameraScreen", "CalibrationScreen", or "CaptureScreen".
     * A con to this debug strategy is that you can't go back since previous
     * screens were not loaded to the stack.
     */
    <NavStack.Navigator
      initialRouteName="HomeScreen"
      screenOptions={{
        gestureEnabled: false,
        headerTitleAlign: "left",
        headerBackTitleVisible: false,
        headerTintColor: colors.text,
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: "transparent",
        },
      }}
      mode="modal"
    >
      <NavStack.Screen
        name="Sessions"
        component={HomeScreen}
        options={{
          headerTitle: () => <TitleHeader title="Sessions" />,
        }}
      />
      <NavStack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          title: "Settings",
        }}
      />
      <NavStack.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          title: "Setup Box",
          headerStyle: {
            backgroundColor: "black",
            shadowColor: "transparent",
          },
          headerTitle: () => (
            <TitleHeader title="Select Spectrum" color={"white"} />
          ),
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IconHeaderButton}>
              <TextHeaderButton
                onPress={() => navigation.navigate("CalibrationScreen")}
                text={"Next Step"}
              />
            </HeaderButtons>
          ),
        }}
      />
      <NavStack.Screen
        name="CalibrationScreen"
        component={CalibrationScreen}
        options={{
          headerTitle: () => <TitleHeader title="Calibration" />,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IconHeaderButton}>
              <TextHeaderButton
                onPress={() => navigation.navigate("CaptureScreen")}
                text={"Next Step"}
              />
            </HeaderButtons>
          ),
        }}
      />
      <NavStack.Screen
        name="CaptureScreen"
        component={CaptureScreen}
        options={{
          headerTitle: () => <TitleHeader title="Capture Spectra" />,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IconHeaderButton}>
              <Item
                title="Finish"
                onPress={async () => {
                  await storeCurrentSession();
                  navigation.popToTop();
                }}
              />
            </HeaderButtons>
          ),
        }}
      />
      <NavStack.Screen
        name="ReviewScreen"
        component={ReviewScreen}
        options={{ headerTitle: "" }}
      />
    </NavStack.Navigator>
  );
}

function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}
