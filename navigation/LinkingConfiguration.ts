import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          HomeScreen: 'home',
          SettingsScreen: 'settings',
          CameraScreen: 'camera',
          CalibrationScreen: 'calibration',
          CaptureScreen: 'capture',
          ReviewScreen: 'review',
        },
      },
      NotFound: '*',
    },
  },
};
