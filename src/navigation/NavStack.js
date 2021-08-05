import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "../screens/camera/CameraScreen";
import CalibrationScreen from "../screens/calibration/CalibrationScreen";
import CaptureScreen from "../screens/capture/CaptureScreen";
import ReviewScreen from "../screens/review/ReviewScreen";
import HomeScreen from "../screens/home/HomeScreen";
import SessionDetailScreen from "../screens/sessionDetail/SessionDetailScreen";
import {
  HeaderButtons,
  HeaderButton,
  Item,
} from "react-navigation-header-buttons";
import { useTheme } from "@react-navigation/native";
import TitleHeader from "../components/TitleHeader";
import { handleSaveSession } from "../navigation/SessionStorage";
import {
  selectShowsRecalibrateHint,
  dismissRecalibrateHint,
  endEditingSession,
} from "../redux/reducers/Sessions";
import Hint from "react-native-ui-lib/hint";
import { useSelector, useDispatch } from "react-redux";

const TextHeaderButton = ({ onPress, text }) => (
  <Item title={text} onPress={onPress} />
);

const IconHeaderButton = (props) => (
  <HeaderButton IconComponent={Ionicons} iconSize={23} {...props} />
);

const NavStack = createStackNavigator();

export default function HomeStack({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const showsRecalibrateHint = useSelector(selectShowsRecalibrateHint);

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
        headerTitleAlign: "center",
        headerBackTitleVisible: false,
        headerTintColor: colors.text,
        headerStyle: {
          backgroundColor: colors.background,
          shadowColor: "transparent",
        },
        gestureDirection: "horizontal",
      }}
    >
      <NavStack.Screen
        name="Sessions"
        component={HomeScreen}
        options={{
          headerTitle: () => <TitleHeader title="Sessions" />,
        }}
      />
      <NavStack.Screen
        name="SessionDetail"
        component={SessionDetailScreen}
        options={{
          headerShown: false,
          presentation: "transparentModal",
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
          headerTintColor: "white",
          headerTitle: () => (
            <TitleHeader title="Select Spectrum" color="white" />
          ),
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IconHeaderButton}>
              <TextHeaderButton
                onPress={() => navigation.push("CalibrationScreen")}
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
          headerStyle: {
            backgroundColor: "black",
            shadowColor: "transparent",
          },
          headerTintColor: "white",
          headerTitle: () => <TitleHeader title="Calibration" color="white" />,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IconHeaderButton}>
              <TextHeaderButton
                onPress={() => navigation.push("CaptureScreen")}
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
          headerLeft: () => (
            <HeaderButtons HeaderButtonComponent={IconHeaderButton}>
              <Item
                title="cancel"
                iconName="close"
                iconSize={34}
                onPress={() => {
                  console.error("TODO: implement are you sure");
                  dispatch(endEditingSession());
                  navigation.popToTop();
                }}
              />
              <Hint
                visible={showsRecalibrateHint}
                color={colors.primary}
                message="Select to recalibrate"
                borderRadius={16}
                marginLeft={22}
                offset={4}
                opacity={0.9}
                onPress={() => dispatch(dismissRecalibrateHint())}
              >
                <Item
                  title="calibrate"
                  iconName="beaker"
                  onPress={() => navigation.navigate("CameraScreen")}
                />
              </Hint>
            </HeaderButtons>
          ),
          headerTitle: () => <TitleHeader title="Capture Spectra" />,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IconHeaderButton}>
              <Item
                title="calibrate"
                iconName="save"
                onPress={async () => {
                  await handleSaveSession();
                  dispatch(endEditingSession());
                  navigation.popToTop();
                }}
              />
            </HeaderButtons>
          ),
        }}
      />
      <NavStack.Screen name="ReviewScreen" component={ReviewScreen} />
    </NavStack.Navigator>
  );
}
