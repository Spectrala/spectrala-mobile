import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import loadAssets from "./src/navigation/LoadAssets";
import Navigation from "./src/navigation/NavigationWrapper";
import { RecreatableGlobalStoreProvider } from "./src/redux/store/store";

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
