import React from 'react';
import { AppLoading } from 'expo';
import { StyleSheet, Text, View, StatusBar } from 'react-native';
import { useFonts } from '@use-expo/font';


import Routes from './src/routes';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Roboto_400Regular': require('./assets/fonts/Roboto/Roboto-Regular.ttf'),
    'Roboto_500Medium': require('./assets/fonts/Roboto/Roboto-Medium.ttf'),
    'Ubuntu_700Bold': require('./assets/fonts/Ubuntu/Ubuntu-Bold.ttf'),
  });

  if (!fontsLoaded) {
    return <AppLoading/>
  }
  
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent"/>
        <Routes/>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
