import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native'; // Added Text

const SplashScreen = () => (
  <View style={styles.container}>
    <ActivityIndicator size="large" color="#00FF00" />
    <Text style={{ color: '#FFFFFF' }}>Loading... (Debug)</Text> // Added for
    visibility
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SplashScreen;
