import React from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { View, Text, StyleSheet } from 'react-native';

import HeaderButton from '../components/HeaderButton';

const CityScreen = props => {
//   const favMeals = MEALS.filter(meal => meal.id === 'm1' || meal.id === 'm2');
  return (    
    <View style={styles.screen}>

      <Text style={styles.title}>City: </Text>
      <Text style={styles.title}>Air Pollution Category: </Text>

    </View>
    );
};

CityScreen.navigationOptions = navData => {
  return {
    headerTitle: 'City',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
    screen: {
      flex: 1,
      alignItems: 'center'
    },
    title: {
      fontFamily: 'open-sans-bold',
      fontSize: 12,
      margin: 20,
      textAlign: 'center'
    },
    text: {
      fontSize: 12,
      margin: 20,
      textAlign: 'left'
    },    
    filterContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '80%',
      marginVertical: 15
    }
  });

export default CityScreen;
