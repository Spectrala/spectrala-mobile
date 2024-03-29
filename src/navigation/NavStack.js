import React from "react";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { createStackNavigator } from "@react-navigation/stack";
import CameraScreen from "../screens/camera/CameraScreen";
import CalibrationScreen from "../screens/calibration/CalibrationScreen";
import CaptureScreen, {
  exitCaptureScreen,
} from "../screens/capture/CaptureScreen";
import SessionsScreen from "../screens/home/SessionsScreen";
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
  endEditingSession,
  setShowsOnExitToast,
  selectShowsOnExitToast,
} from "../redux/reducers/Sessions";
import { View, StyleSheet } from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { selectCornersAreValid } from "../redux/reducers/ReaderBox";
import { Platform } from "react-native";
import SpectrumDetailScreen from "../screens/review/SpectrumDetailScreen";
import {
  selectShowsHelp,
  toggleShowsHelp,
} from "../redux/reducers/Calibration";

const TextHeaderButton = ({ onPress, text, disabled }) => (
  <Item
    title={text}
    onPress={onPress}
    disabled={disabled}
    opacity={disabled ? 0.4 : 1}
  />
);

const IoniconHeaderButton = (props) => (
  <HeaderButton IconComponent={Ionicons} iconSize={23} {...props} />
);


const StackNavigator = createStackNavigator();

export default function NavStack({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const showsRecalibrateHint = useSelector(selectShowsRecalibrateHint);
  const showsOnExitToast = useSelector(selectShowsOnExitToast);
  const cornersAreValid = useSelector(selectCornersAreValid);
  const showsHelp = useSelector(selectShowsHelp);

  return (
    /**
     * TODO: MARK: the initialRouteName prop in NavStack.Navigator will
     * define the first screen to load in the navigation stack.
     * For production, make this "Sessions".
     * In debug, use:
     *  "CameraScreen", "CalibrationScreen", or "CaptureScreen".
     * A con to this debug strategy is that you can't go back since previous
     * screens were not loaded to the stack.
     */
    <StackNavigator.Navigator
      initialRouteName="Sessions"
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
        detachPreviousScreen: true,
      }}
    >
      <StackNavigator.Screen
        name="Sessions"
        component={SessionsScreen}
        options={{
          headerTitle: () => <TitleHeader title="Sessions" />,
        }}
      />
      <StackNavigator.Screen
        name="SessionDetail"
        component={SessionDetailScreen}
        options={{
          detachPreviousScreen: Platform.OS === "android",
          headerShown: false,
          presentation: "transparentModal",
        }}
      />
      <StackNavigator.Screen
        name="ReviewScreen"
        component={SpectrumDetailScreen}
        options={{
          headerShown: false,
        }}
      />
      <StackNavigator.Screen
        name="CameraScreen"
        component={CameraScreen}
        options={{
          title: "Setup Box",

          headerLeft: () => (
            <View style={styles.row}>
              <HeaderButtons HeaderButtonComponent={IoniconHeaderButton}>
                <Item
                  title="cancel"
                  iconName="chevron-back"
                  color="black"
                  iconSize={30}
                  onPress={() => navigation.goBack()}
                />
              </HeaderButtons>
              <HeaderButtons HeaderButtonComponent={IoniconHeaderButton}>
                <Item
                  title="calibrate"
                  iconName={
                    showsHelp
                      ? "information-circle"
                      : "information-circle-outline"
                  }
                  color="black"
                  onPress={() => dispatch(toggleShowsHelp())}
                  iconSize={26}
                />
              </HeaderButtons>
            </View>
          ),
          headerTitle: () => <TitleHeader title="Select Spectrum" />,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconHeaderButton}>
              <TextHeaderButton
                onPress={() => navigation.push("CalibrationScreen")}
                text={"Next Step"}
                disabled={!cornersAreValid}
              />
            </HeaderButtons>
          ),
        }}
      />
      <StackNavigator.Screen
        name="CalibrationScreen"
        component={CalibrationScreen}
        options={{

          headerLeft: () => (
            <View style={styles.row}>
              <HeaderButtons HeaderButtonComponent={IoniconHeaderButton}>
                <Item
                  title="cancel"
                  iconName="chevron-back"
                  color="black"
                  iconSize={30}
                  onPress={() => navigation.goBack()}
                />
              </HeaderButtons>
              <HeaderButtons HeaderButtonComponent={IoniconHeaderButton}>
                <Item
                  title="calibrate"
                  iconName={
                    showsHelp
                      ? "information-circle"
                      : "information-circle-outline"
                  }
                  color="black"
                  onPress={() => dispatch(toggleShowsHelp())}
                  iconSize={26}
                />
              </HeaderButtons>
            </View>
          ),
          headerTitle: () => <TitleHeader title="Calibration" />,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconHeaderButton}>
              <TextHeaderButton
                onPress={() => navigation.push("CaptureScreen")}
                text={"Next Step"}
              />
            </HeaderButtons>
          ),
        }}
      />
      <StackNavigator.Screen
        name="CaptureScreen"
        component={CaptureScreen}
        options={{
          headerLeft: () => (
            <View style={styles.row}>
              <HeaderButtons HeaderButtonComponent={IoniconHeaderButton}>
                <Item
                  title="cancel"
                  iconName="close"
                  iconSize={34}
                  onPress={() => {
                    if (showsOnExitToast) {
                      exitCaptureScreen(dispatch, navigation);
                    } else {
                      dispatch(setShowsOnExitToast({ value: true }));
                    }
                  }}
                />
              </HeaderButtons>
              <HeaderButtons HeaderButtonComponent={IoniconHeaderButton}>
                <Item
                  title="calibrate"
                  iconName="aperture-outline"
                  color={showsRecalibrateHint ? colors.warning : colors.primary}
                  onPress={() => navigation.push("CameraScreen")}
                  iconSize={26}
                />
              </HeaderButtons>
            </View>
          ),
          headerTitle: () => <TitleHeader title="Capture Spectra" />,
          headerRight: () => (
            <HeaderButtons HeaderButtonComponent={IoniconHeaderButton}>
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
    </StackNavigator.Navigator>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
  },
});
