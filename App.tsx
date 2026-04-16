import React, { useEffect, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';
import { initializeDatabase } from './src/database/schema';
import { seedDatabase } from './src/database/seed';
import { Colors } from './src/constants/theme';

export default function App() {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await initializeDatabase();
        await seedDatabase();
        setReady(true);
      } catch (e) {
        setError('Failed to initialize database. Please restart the app.');
      }
    };
    bootstrap();
  }, []);

  if (error) {
    return (
      <View style={styles.splash}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (!ready) {
    return (
      <View style={styles.splash}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading Creator App...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <AppNavigator />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    gap: 12,
  },
  loadingText: {
    color: Colors.text.secondary,
    fontSize: 15,
    marginTop: 8,
  },
  errorText: {
    color: Colors.error,
    fontSize: 15,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
