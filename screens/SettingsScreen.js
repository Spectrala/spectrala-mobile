import * as React from 'react';
import { Button, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text, View } from "react-native-ui-lib";

export default function SettingsScreen({ navigation }) {
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

