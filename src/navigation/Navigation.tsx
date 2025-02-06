import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from '../utils/NavigationUtil';
import GameScreen from '../screens/GameScreen';
import LevelScreen from '../screens/LevelScreen';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import {createStackNavigator} from '@react-navigation/stack';
import {SoundProvider} from './SoundContext';

const Stack = createStackNavigator();

export const Navigation = () => {
  return (
    <SoundProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{headerShown: false}}
          initialRouteName="SplashScreen">
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen
            name="HomeScreen"
            options={{animation: 'fade'}}
            component={HomeScreen}
          />
          <Stack.Screen
            name="GameScreen"
            options={{animation: 'fade'}}
            component={GameScreen}
          />
          <Stack.Screen
            name="LevelScreen"
            options={{animation: 'fade'}}
            component={LevelScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SoundProvider>
  );
};
