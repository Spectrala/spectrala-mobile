import React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { OverflowMenuProvider } from "react-navigation-header-buttons";
import NotFoundScreen from "../screens/NotFoundScreen";
import NavStack from "./NavStack";

const reactNavigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: "#FD893A",
    background: "#F3F3EC",
    backgroundDark: "#000000",
    foreground: "#FBFCFF",
    text: "#161316",
    textDark: "#FFFFFF",
    warning: "#eada25",
    danger: "#ff7863",
  },
};

// Docs: https://reactnavigation.org/docs/getting-started
export default function Navigation() {
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
      <Stack.Screen name="Root" component={NavStack} />
      <Stack.Screen
        name="NotFound"
        component={NotFoundScreen}
        options={{ title: "Oops!" }}
      />
    </Stack.Navigator>
  );
}
