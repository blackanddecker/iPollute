import React, { useState } from 'react';
import { Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { enableScreens } from 'react-native-screens';

import MealsNavigator from './navigation/MealsNavigator';

enableScreens();


export default function App() {

  return <MealsNavigator />;
}
