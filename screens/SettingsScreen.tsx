import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { HomeStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type SettingsScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'SettingsScreen'
>;

type Props = {
  navigation: SettingsScreenNavigationProp;
};

export default function SettingsScreen({ navigation } : Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Are yall ready to do some settings</Text>
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

