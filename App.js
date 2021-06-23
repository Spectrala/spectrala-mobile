import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as Font from "expo-font";
import useCachedResources from "./navigation/LoadAssets";
import Navigation from "./navigation/NavigationWrapper";
import { RecreatableGlobalStoreProvider } from "./redux/store/store";

export default function App() {
  const isLoadingComplete = useCachedResources();

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
