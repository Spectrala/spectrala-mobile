import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import * as React from "react";
import { OverflowMenuProvider } from "react-navigation-header-buttons";
import NotFoundScreen from "../screens/NotFoundScreen";
import HomeStack from "./HomeStack";
import { Colors, Typography, Spacings } from "react-native-ui-lib";
import { ThemeManager } from "react-native-ui-lib";
// Using React Native UI for theme: https://wix.github.io/react-native-ui-lib/

// Generate colors here: https://colors.eva.design
Colors.loadColors({
  primaryColor: "#FD893A",
  primary: "#FD893A",
  backgroundColor: "#161316",
  textColor: "#E7EDEE",
  successColor: "#63ED8C",
  infoColor: "#0790F9",
  warningColor: "#F4C433",
  dangerColor: "#FF6689",
});

const reactNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primaryColor,
    background: Colors.backgroundColor,
  },
};

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
    <NavigationContainer theme={reactNavigationTheme}>
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
