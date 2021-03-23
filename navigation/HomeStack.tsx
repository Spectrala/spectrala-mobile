import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import TabOneScreen from '../screens/TabOneScreen';
import TabTwoScreen from '../screens/TabTwoScreen';
import { HomeStackParamList, SettingsParamList, ReviewParamList, CaptureStackParamList } from '../types';

const HomeStack = createStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
  const colorScheme = useColorScheme();

  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="HomeScreen"
        component={TabOneScreen}
        options={{
          title: "Home",
        }}
      />
      <HomeStack.Screen
        name="SettingsScreen"
        component={TabTwoScreen}
        options={{
          title: "Settings",
        }}
      />
      <HomeStack.Screen
        name="CaptureScreen"
        component={CaptureNavigator}
        options={{
          title: "Capture",
        }}
      />
      <HomeStack.Screen
        name="ReviewScreen"
        component={TabOneScreen}
        options={{
          title: "Review",
        }}
      />
    </HomeStack.Navigator>
  );
}
  
  // You can explore the built-in icon families and icons on the web at:
  // https://icons.expo.fyi/
  function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const CaptureStack = createStackNavigator<CaptureStackParamList>();

function CaptureNavigator() {
  return (
    <CaptureStack.Navigator>
      <CaptureStack.Screen
        name="CaptureScreen"
        component={TabOneScreen}
        options={{ headerTitle: 'CaptureE' }}
      />
    </CaptureStack.Navigator>
  );
}


