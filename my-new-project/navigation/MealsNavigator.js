import React from 'react';
import { Platform, Text } from 'react-native';
import {
  createStackNavigator
} from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import {createDrawerNavigator} from 'react-navigation-drawer'
import { createBottomTabNavigator } from 'react-navigation-tabs'
import { Ionicons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons'; 

import CustomDrawerContentComponent from '../components/CustomDrawerContentComponent';


import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';

import CategoriesScreen from '../screens/CategoriesScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import FiltersScreen from '../screens/FiltersScreen';
import AboutsScreen from '../screens/AboutsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettignsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

import Colors from '../constants/Colors';
import CityScreen from '../screens/CityScreen';

const defaultStackNavOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.primaryColor : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.primaryColor,
  headerTitle: 'A Screen'
};


// const MealsFavsNavigator = createStackNavigator(
//   {
//     Login: LoginScreen,
//     SignUp:SignUpScreen,
//     // Categories: CategoriesScreen,
//     Logout: LoginScreen

//   },
//   {
//     initialRouteName: 'Login',
//     navigationOptions: {
//       drawerLabel: 'Login'
//     },
//     defaultNavigationOptions: defaultStackNavOptions
//   }
// );


const MyEnergyNavigator = createStackNavigator({
  Categories: CategoriesScreen
  },{
  defaultNavigationOptions: defaultStackNavOptions
  }
)

const HistoryNavigator = createStackNavigator({
  History: HistoryScreen
  },{
  defaultNavigationOptions: defaultStackNavOptions
  }
)

const FiltersNavigator = createStackNavigator({
  Filters: FiltersScreen
  },{
  defaultNavigationOptions: defaultStackNavOptions
  }
)

const LoginNavigator = createStackNavigator({
  Login: LoginScreen
  },{
  defaultNavigationOptions: defaultStackNavOptions
  }
)

const CityNavigator = createStackNavigator({
  City: CityScreen
  },{
  defaultNavigationOptions: defaultStackNavOptions
  }
)

const SettingsNavigator = createStackNavigator({
  Settings: SettingsScreen
  },{
  defaultNavigationOptions: defaultStackNavOptions
  }
)

const AboutsNavigator = createStackNavigator({
  Abouts: AboutsScreen
  },{
  defaultNavigationOptions: defaultStackNavOptions
  }
)

// This is for side drawer
const MainNavigator = createDrawerNavigator(
  {
    MealsFavs: {
      screen: MyEnergyNavigator,
      navigationOptions: {
        drawerLabel: 'My Energy',
        drawerIcon: tabInfo =>  (
            <SimpleLineIcons name="energy" size={25} color={tabInfo.tintColor} />
          )
      }
    },
    History: {
      screen:HistoryNavigator,
      navigationOptions: {
        drawerLabel: 'History',
        drawerIcon: tabInfo =>  (
          <MaterialIcons name="history" size={25} color={tabInfo.tintColor} />          )
      }
    },
    Filters: {
      screen:FiltersNavigator,
      navigationOptions: {
        drawerLabel: 'Filters',
        drawerIcon: tabInfo =>  (
          <Ionicons name="ios-star" size={25} color={tabInfo.tintColor} />
          )
      }
    },
    City: {
      screen:CityNavigator,
      navigationOptions: {
        drawerLabel: 'City',
        drawerIcon: tabInfo =>  (
          <MaterialIcons name="location-city" size={25} color={tabInfo.tintColor} />
          )
      }
    },
    Settings: {
      screen:SettingsNavigator,
      navigationOptions: {
        drawerLabel: 'Settings',
        drawerIcon: tabInfo =>  (
          <Ionicons name="ios-settings" size={25} color={tabInfo.tintColor} />
          )
      }
    },    
    Abouts: {
      screen:AboutsNavigator,
      navigationOptions: {
        drawerLabel: 'About',
        drawerIcon: tabInfo =>  (
          <Ionicons name="md-information-circle-outline" size={25} color={tabInfo.tintColor} />
          )
      }
    },
    // Login: {
    //   screen:LoginNavigator,
    //   navigationOptions: {
    //     drawerLabel: 'Login',
    //     drawerIcon: tabInfo =>  (
    //       <Ionicons name="md-information-circle-outline" size={25} color={tabInfo.tintColor} />
    //       )
    //   }
    // },
    // SignUpScreen: {
    //   screen:MealsFavsNavigator,
    //   navigationOptions: {
    //     drawerLabel: 'Sign-Up',
    //     drawerIcon: tabInfo =>  (
    //       <Ionicons name="md-information-circle-outline" size={25} color={tabInfo.tintColor} />
    //       )
    //   }
    // },
    Logout: {
      screen:LoginNavigator,
      navigationOptions: {
        drawerLabel: 'Logout',
        drawerIcon: tabInfo =>  (
          <Ionicons name="ios-log-out" size={25} color={tabInfo.tintColor} />
          )
      }
    }
  },
  {
    contentComponent: props => <CustomDrawerContentComponent {...props} />,
    contentOptions: {
      activeTintColor: Colors.accentColor,
      labelStyle: {
        fontFamily: 'open-sans-bold'
      }
    }
  }
);

export default createAppContainer(MainNavigator);
