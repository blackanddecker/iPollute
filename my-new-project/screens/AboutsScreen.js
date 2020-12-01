import React from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { View, Text, StyleSheet } from 'react-native';

import HeaderButton from '../components/HeaderButton';

const AboutsScreen = props => {
//   const favMeals = MEALS.filter(meal => meal.id === 'm1' || meal.id === 'm2');
  return (    
    <View style={styles.screen}>
      <Text style={styles.text}>A carbon footprint is the total amount of greenhouse gases (including carbon dioxide and methane) that are generated by our actions.</Text>
      <Text style={styles.text}>Ipollute is a carbon footprint tracker that helps you learn more about your carbon emissions and carbon footprint from your daily lifestyle. Capture can help you towards achieving a sustainable lifestyle, whether through sustainable travel, reducing your dietary carbon footprint, or removing CO2 by offsetting the CO2 emissions you can't avoid. </Text>
      <Text style={styles.title}>Owner: Foufikos Evangelos</Text>
      <Text style={styles.title}>Contact Info: efoufikos@inf.uth.gr</Text>
      <Text style={styles.title}>Version 0.8 </Text>
      <Text style={styles.title}>Copyrights 2020 </Text>

    </View>
    );
};

AboutsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'About',
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

export default AboutsScreen;
