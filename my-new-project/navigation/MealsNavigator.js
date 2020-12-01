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

import Colors from '../constants/Colors';

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

const MealsNavigator = createStackNavigator(
  {
    Categories: {
      screen: CategoriesScreen
    },
    MealDetail: MealDetailScreen
  },
  {
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const HistoryNavigator  = createStackNavigator(
  {
    History: HistoryScreen,
    Categories: {
      screen: MealsNavigator
    }
  },
  {
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const tabScreenConfig = {
  Meals: {
    screen: MealsNavigator,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return (
          // <Ionicons name="baidu" size={25} color={tabInfo.tintColor} />
          <SimpleLineIcons name="energy" size={25} color={tabInfo.tintColor} />
        );
      },
      tabBarColor: Colors.primaryColor,      
      tabBarLabel:
        Platform.OS === 'android' ? (
          <Text style={{ fontFamily: 'open-sans-bold' }}>My Energy</Text>
        ) : (
          'My Energy'
        )
    }
  },
  History: {
    screen: HistoryNavigator,
    navigationOptions: {
      tabBarIcon: tabInfo => {
        return <MaterialIcons name="history" size={25} color={tabInfo.tintColor} /> ;
      },
      tabBarColor: Colors.accentColor,
      tabBarLabel:
        Platform.OS === 'android' ? (
          <Text style={{ fontFamily: 'open-sans-bold' }}>History</Text>
        ) : (
          'History'
        )
    }
  }
};

const MealsFavTabNavigator =
  Platform.OS === 'android'
    ? createMaterialBottomTabNavigator(tabScreenConfig, {
        activeTintColor: 'white',
        shifting: true,
        barStyle: {
          backgroundColor: Colors.primaryColor
        }
      })
    : createBottomTabNavigator(tabScreenConfig, {
        tabBarOptions: {
          labelStyle: {
            fontFamily: 'open-sans'
          },
          activeTintColor: Colors.accentColor
        }
});

const HistoryTabNavigator =
  Platform.OS === 'android'
    ? createMaterialBottomTabNavigator(tabScreenConfig, {
        activeTintColor: 'white',
        shifting: true,
        barStyle: {
          backgroundColor: Colors.primaryColor
        }
      })
    : createBottomTabNavigator(tabScreenConfig, {
        tabBarOptions: {
          labelStyle: {
            fontFamily: 'open-sans'
          },
          activeTintColor: Colors.accentColor
        }
});

const FiltersNavigator = createStackNavigator(
  {
    Filters: FiltersScreen
  },
  {
    navigationOptions: {
      drawerLabel: 'Filters'
    },
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const AboutNavigator = createStackNavigator(
  {
    Abouts: AboutsScreen
  },
  {
    navigationOptions: {
      drawerLabel: 'About'
    },
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const SettingsNavigator = createStackNavigator(
  {
    Settings: SettingsScreen
  },
  {
    navigationOptions: {
      drawerLabel: 'Settings'
    },
    defaultNavigationOptions: defaultStackNavOptions
  }
);


const LoginNavigator = createStackNavigator(
  {
    Login: LoginScreen
  },
  {
    navigationOptions: {
      drawerLabel: 'Login'
    },
    defaultNavigationOptions: defaultStackNavOptions
  }
);


const LogoutNavigator = createStackNavigator(
  {
    Login: LoginScreen
  },
  {
    navigationOptions: {
      drawerLabel: 'Logout'
    },
    defaultNavigationOptions: defaultStackNavOptions
  }
);

// This is for side drawer
const MainNavigator = createDrawerNavigator(
  {
    MealsFavs: {
      screen: MealsFavTabNavigator,
      navigationOptions: {
        drawerLabel: 'My Energy',
        drawerIcon: tabInfo =>  (
            <SimpleLineIcons name="energy" size={25} color={tabInfo.tintColor} />
          )
      }
    },
    History: {
      screen:HistoryTabNavigator,
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
      screen:AboutNavigator,
      navigationOptions: {
        drawerLabel: 'About',
        drawerIcon: tabInfo =>  (
          <Ionicons name="md-information-circle-outline" size={25} color={tabInfo.tintColor} />
          )
      }
    },
    Login: {
      screen:LoginNavigator,
      navigationOptions: {
        drawerLabel: 'Login',
        drawerIcon: tabInfo =>  (
          <Ionicons name="md-information-circle-outline" size={25} color={tabInfo.tintColor} />
          )
      }
    },
    Logout: {
      screen:LoginNavigator,
      navigationOptions: {
        drawerLabel: 'Logout',
        drawerIcon: tabInfo =>  (
          <Ionicons name="md-information-circle-outline" size={25} color={tabInfo.tintColor} />
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
