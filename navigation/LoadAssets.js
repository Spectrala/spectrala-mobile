import { Ionicons } from '@expo/vector-icons';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import * as React from 'react';

export default function useCachedResources() {
  const [isLoadingComplete, setLoadingComplete] = React.useState(false);

  // Load any resources or data that we need prior to rendering the app
  React.useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        // TODO: Understand what commented splash screen lines are meant for
        // SplashScreen.preventAutoHideAsync();

        await Font.loadAsync({
          Lexend: require('../assets/fonts/Heebo/static/Heebo-Regular.ttf'),
          'Heebo-SemiBold': {
            uri: require('../assets/fonts/Heebo/static/Heebo-SemiBold.ttf'),
            display: Font.FontDisplay.FALLBACK,
          },
        });
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e);
      } finally {
        setLoadingComplete(true);
        // SplashScreen.hideAsync();
      }
    }

    loadResourcesAndDataAsync();
  }, []);

  return isLoadingComplete;
}

