import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Platform as RNPlatform, SafeAreaView, StyleSheet, View } from 'react-native';
import { Provider } from 'react-redux';
import { COLORS } from './src/utils/theme';
import AppNavigation from './src/navigation';
import { store } from './src/store';

export default function App() {
  const [isFirebaseInitialized, setIsFirebaseInitialized] = useState(false);

  useEffect(() => {
    // Ensure Firebase is initialized
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  if (!isFirebaseInitialized) {
    return <View />; // Show a blank screen while Firebase initializes
  }

  return (
    <Provider store={store}>
      <SafeAreaView style={styles.container}>
        <StatusBar style="auto" />
        <AppNavigation />
      </SafeAreaView>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: RNPlatform.OS === 'android' ? 25 : 0,
  },
});
