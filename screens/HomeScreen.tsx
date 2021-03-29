import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { HomeStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation } : Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bro this is the home screen</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button title={"Create New"} onPress={()=>{
        navigation.navigate("CaptureScreen")
      }}/>
      <Button title={"Settings"} onPress={()=>{
        navigation.navigate("SettingsScreen")
      }}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
