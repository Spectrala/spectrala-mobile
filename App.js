import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from 'expo-font';
import useCachedResources from "./hooks/useCachedResources";
import useColorScheme from "./hooks/useColorScheme";
import Navigation from "./navigation";
import { RecreatableGlobalStoreProvider } from "./redux/store/store";

export default function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [fontLoaded, setFontLoaded] = useState(false);

  const loadFonts = async () => {
    // From expo: https://docs.expo.io/versions/latest/sdk/font/#example-functions
    await Font.loadAsync({
      Lexend: require('./assets/fonts/Heebo/static/Heebo-Regular.ttf'),
      'Heebo-SemiBold': {
        uri: require('./assets/fonts/Heebo/static/Heebo-SemiBold.ttf'),
        display: Font.FontDisplay.FALLBACK,
      },
    });
    setFontLoaded(true);
  }

  useEffect(() => {
    loadFonts();
  }, [])

  if (!isLoadingComplete || !fontLoaded) {
    return null;
  } else {
    return (
      <RecreatableGlobalStoreProvider>
        <SafeAreaProvider>
          <Navigation colorScheme={colorScheme} />
          <StatusBar />
        </SafeAreaProvider>
      </RecreatableGlobalStoreProvider>
    );
  }
}
