import * as React from 'react';
import { Button, StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import PropTypes from 'prop-types';
import { HomeStackParamList } from '../types';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenNavigationProp = StackNavigationProp<
  HomeStackParamList,
  'HomeScreen'
>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

function HomeScreen({ navigation } : Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bro this is the home screen</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <EditScreenInfo path="/screens/TabOneScreen.tsx" />
      <Button title={"your mom"} onPress={()=>{ // What is title?
        console.log("asdf")
        // for real though let's do some navigation
      }}>asdf</Button>
      <Button title={"da settings"} onPress={()=>{ // What is title?
        console.log("settings?");
        navigation.navigate("SettingsScreen")
        // for real though let's do some navigation
      }}>Let's see some settings</Button>
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

HomeScreen.propTypes  = {
  navigation: PropTypes.object
}

export default HomeScreen;