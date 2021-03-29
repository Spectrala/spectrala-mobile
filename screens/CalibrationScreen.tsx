import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { HomeStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type CalibrationScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'CalibrationScreen'
>;

type Props = {
  navigation: CalibrationScreenNavigationProp;
};

export default function CaptureScreen({ navigation } : Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>We are gong to CALIBRATE right NOW</Text>
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
