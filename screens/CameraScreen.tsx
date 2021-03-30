import * as React from 'react';
import { Button, StyleSheet, Text, View  } from 'react-native';

import { HomeStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type CameraScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'CameraScreen'
>;

type Props = {
  navigation: CameraScreenNavigationProp;
};

export default function CameraScreen({ navigation } : Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Let's configure this camera dude</Text>
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
