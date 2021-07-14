import { StatusBar } from "expo-status-bar";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import loadAssets from "./src/navigation/LoadAssets";
import Navigation from "./src/navigation/NavigationWrapper";
import { RecreatableGlobalStoreProvider } from "./src/redux/store/Store";

export default function App() {
  const isLoadingComplete = loadAssets();

  if (!isLoadingComplete) {
    return null;
  } else {
    return (
      <RecreatableGlobalStoreProvider>
        <SafeAreaProvider>
          <Navigation />
          <StatusBar />
        </SafeAreaProvider>
      </RecreatableGlobalStoreProvider>
    );
  }
}
