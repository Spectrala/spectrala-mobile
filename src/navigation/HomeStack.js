import { Ionicons } from "@expo/vector-icons";
import {
  createStackNavigator,
  StackNavigationProp,
} from "@react-navigation/stack";
import * as React from "react";
import CaptureScreen from "../screens/capture/CaptureScreen";
import CameraScreen from "../screens/camera/CameraScreen";
import CalibrationScreen from "../screens/calibration/CalibrationScreen";
import ReviewScreen from "../screens/review/ReviewScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HomeScreen from "../screens/home/HomeScreen";
import {
  HeaderButtons,
  HeaderButton,
  Item,
  HiddenItem,
  OverflowMenu,
} from "react-navigation-header-buttons";
import { Colors, Typography, Spacings, ProgressBar } from "react-native-ui-lib";
import { CAMERA_VISIBILITY_OPTIONS } from "../screens/camera/CameraLoader"
import SessionScreen from "../screens/SessionScreen";

export const SESSION_SCREENS = {
  camera: {
    name: "camera",
    header: "Setup (1/2)",
    cameraVisibility: CAMERA_VISIBILITY_OPTIONS.full,
  },
  calibration: {
    name: "calibration",
    header: "Setup (2/2)",
    cameraVisibility: CAMERA_VISIBILITY_OPTIONS.none,
  },
  capture: {
    name: "capture",
    header: "Capture",
    cameraVisibility: CAMERA_VISIBILITY_OPTIONS.none,
  },
};

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
  return (
    // TODO: MARK: Make this "HomeScreen"
    <HomeStack.Navigator
      initialRouteName="CameraScreen"
      options={{ headerTintColor: Colors.background }}
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
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
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
        component={SessionScreen}
        initialParams={{ screenOptions: SESSION_SCREENS.camera }}
        options={{
          title: SESSION_SCREENS.camera.header,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
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
        component={SessionScreen}
        initialParams={{ screenOptions: SESSION_SCREENS.calibration }}
        options={{
          title: SESSION_SCREENS.calibration.header,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
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
        component={SessionScreen}
        initialParams={{ screenOptions: SESSION_SCREENS.capture }}
        options={{
          title: SESSION_SCREENS.capture.header,
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
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
      {/* <HomeStack.Screen
        name="ReviewScreen"
        component={ReviewScreen}
        options={{
          title: "Review",
          
          headerStyle: {
            backgroundColor: Colors.background,
          },
          headerTintColor: Colors.text,
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
      /> */}
    </HomeStack.Navigator>
  );
}

function TabBarIcon(props) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}
