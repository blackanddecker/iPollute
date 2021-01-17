import React from 'react';
import { Platform, Text, ScrollView } from 'react-native';
import {
  createStackNavigator
} from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';

import {createDrawerNavigator} from 'react-navigation-drawer'

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import CustomDrawerContentComponent from '../components/CustomDrawerContentComponent';

import CategoriesScreen from '../screens/CategoriesScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import FiltersScreen from '../screens/FiltersScreen';
import AboutsScreen from '../screens/AboutsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import SettingsScreen from '../screens/SettignsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import RateMeScreen from '../screens/RateMeScreen';

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

// const tabScreenConfig = {
//   Meals: {
//     screen: MealsNavigator,
//     navigationOptions: {
//       // tabBarIcon: tabInfo => {
//       //   return (
//       //     // <Icon name="baidu" size={25} color={tabInfo.tintColor} />
//       //     // <SimpleLineIcons name="energy" size={25} color={tabInfo.tintColor} />
//       //   );
//       // },
//       tabBarColor: Colors.primaryColor,      
//       tabBarLabel:
//         Platform.OS === 'android' ? (
//           <Text style={{ fontFamily: 'open-sans-bold' }}>My Energy</Text>
//         ) : (
//           'My Energy'
//         )
//     }
//   },
//   History: {
//     screen: HistoryNavigator,
//     navigationOptions: {
//       // tabBarIcon: tabInfo => {
//       //     <Icon name="baidu" size={25} color={tabInfo.tintColor} />
//       // },
//       tabBarColor: Colors.accentColor,
//       tabBarLabel:
//         Platform.OS === 'android' ? (
//           <Text style={{ fontFamily: 'open-sans-bold' }}>History</Text>
//         ) : (
//           'History'
//         )
//     }
//   }
// };

// const MyEnergyNavigator =
//   Platform.OS === 'android'
//     ? createBottomTabNavigator(tabScreenConfig, {
//         activeTintColor: 'white',
//         shifting: true,
//         barStyle: {
//           backgroundColor: Colors.primaryColor
//         }
//       })
//     : createBottomTabNavigator(tabScreenConfig, {
//         tabBarOptions: {
//           labelStyle: {
//             fontFamily: 'open-sans'
//           },
//           activeTintColor: Colors.accentColor
//         }
// });

// const HistoryTabNavigator =
//   Platform.OS === 'android'
//     ? createBottomTabNavigator(tabScreenConfig, {
//         activeTintColor: 'white',
//         shifting: true,
//         barStyle: {
//           backgroundColor: Colors.primaryColor
//         }
//       })
//     : createBottomTabNavigator(tabScreenConfig, {
//         tabBarOptions: {
//           labelStyle: {
//             fontFamily: 'open-sans'
//           },
//           activeTintColor: Colors.accentColor
//         }
// });

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

const AboutsNavigator = createStackNavigator(
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


const CityNavigator = createStackNavigator(
  {
    City: CityScreen
  },
  {
    navigationOptions: {
      drawerLabel: 'City'
    },
    defaultNavigationOptions: defaultStackNavOptions
  }
);


const RateMeNavigator = createStackNavigator(
  {
    RateMe: RateMeScreen
  },
  {
    navigationOptions: {
      drawerLabel: 'Rate Us'
    },
    defaultNavigationOptions: defaultStackNavOptions
  }
);

const LoginNavigator = createStackNavigator(
  {
    Login: LoginScreen,
    SignUp:SignUpScreen

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
      screen: MealsNavigator,
      navigationOptions: {
        drawerLabel: 'My Energy',
        drawerIcon: tabInfo =>  (
            <FontAwesome name="bolt" size={25} color={tabInfo.tintColor} />
          )
      }
    },
    History: {
      screen:HistoryNavigator,
      navigationOptions: {
        drawerLabel: 'History',
        drawerIcon: tabInfo =>  (
          <FontAwesome name="history" size={25} color={tabInfo.tintColor} />          )
      }
    },
    Filters: {
      screen:FiltersNavigator,
      navigationOptions: {
        drawerLabel: 'Filters',
        drawerIcon: tabInfo =>  (
          <FontAwesome name="filter" size={25} color={tabInfo.tintColor} />
          )
      }
    },
    City: {
      screen:CityNavigator,
      navigationOptions: {
        drawerLabel: 'City',
        drawerIcon: tabInfo =>  (
          <FontAwesome name="building" size={25} color={tabInfo.tintColor} />
          )
      }
    },
    Settings: {
      screen:SettingsNavigator,
      navigationOptions: {
        drawerLabel: 'Settings',
        drawerIcon: tabInfo =>  (
          <Ionicons name="settings" size={25} color={tabInfo.tintColor} />
          )
      }
    },    
    RateMe: {
      screen:RateMeNavigator,
      navigationOptions: {
        drawerLabel: 'Rate Me',
        drawerIcon: tabInfo =>  (
          <Ionicons name="star" size={25} color={tabInfo.tintColor} />
          )
      }
    },  
    Abouts: {
      screen:AboutsNavigator,
      navigationOptions: {
        drawerLabel: 'About',
        drawerIcon: tabInfo =>  (
          <FontAwesome name="info" size={25} color={tabInfo.tintColor} />
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