import {
  NavigationContainer,
  DefaultTheme,
  DarkTheme,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { OverflowMenuProvider } from "react-navigation-header-buttons";
import NotFoundScreen from "../screens/NotFoundScreen";
import HomeStack from "./HomeStack";
import { Colors, Typography, Spacings } from "react-native-ui-lib";

Colors.loadColors({
  primaryColor: "#FF0000",
  secondaryColor: "#81C3D7",
  textColor: "#221D23",
  errorColor: "#E63B2E",
  successColor: "#ADC76F",
  warnColor: "#FF963C",
});

Typography.loadTypographies({
  heading: { fontSize: 36, fontWeight: "600" },
  subheading: { fontSize: 28, fontWeight: "500" },
  body: { fontSize: 18, fontWeight: "400" },
});

Spacings.loadSpacings({
  page: 20,
  card: 12,
  gridGutter: 16,
});

// Docs: https://reactnavigation.org/docs/getting-started
export default function Navigation({ colorScheme }) {
  return (
    <NavigationContainer>
      <OverflowMenuProvider>
        <RootNavigator />
      </OverflowMenuProvider>
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root" component={HomeStack} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
