import { Ionicons } from '@expo/vector-icons';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import * as React from 'react';
import { Button } from 'react-native';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import CaptureScreen from '../screens/CaptureScreen';
import HomeScreen from '../screens/HomeScreen';
import ReviewScreen from '../screens/ReviewScreen';
import SettingsScreen from '../screens/SettingsScreen';

import { HomeStackParamList, SettingsParamList, ReviewParamList } from '../types';

const HomeStack = createStackNavigator<HomeStackParamList>();

type HomeProp = StackNavigationProp<
  HomeStackParamList,
  'ReviewScreen'
>;

export default function HomeNavigator() {
  const colorScheme = useColorScheme();

  return (
    <HomeStack.Navigator initialRouteName="HomeScreen">
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          title: "Home",
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
        name="CaptureScreen"
        component={ CaptureScreen }
        options={{
          title: "Capture",
          headerRight: () => (
            <Button
              onPress={() => navigation.navigate("ReviewScreen")}
              title="Info"
            />
          ),
        }}
      />
      <HomeStack.Screen
        name="ReviewScreen"
        component={ ReviewScreen }
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

