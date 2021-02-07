import React from 'react';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Linking  } from 'react-native';
import { Icon, SocialIcon } from 'react-native-elements';

import HeaderButton from '../components/HeaderButton';

import Hyperlink from 'react-native-hyperlink'


const AboutsScreen = props => {
//   const favMeals = MEALS.filter(meal => meal.id === 'm1' || meal.id === 'm2');
  return (    
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.containerMain}>
      <Text style={styles.text}>A carbon footprint is the total amount of greenhouse gases (including carbon dioxide and methane) that are generated by our actions.</Text>
      <Text style={styles.text}>iPollute is a carbon footprint tracker that helps you learn more about your carbon emissions and carbon footprint from your daily lifestyle. iPollute can help you towards achieving a sustainable lifestyle, whether through sustainable travel, reducing your dietary carbon footprint, or removing CO2 by offsetting the CO2 emissions you can't avoid. </Text>
      <Text style={styles.title}>Owner: Foufikos Evangelos</Text>
      <Text style={styles.title}>Contact Info: efoufikos@inf.uth.gr</Text>
      <Text style={styles.title}>Version 1.0 (Beta) </Text>

      <View style={styles.socialIcons}>
        <SocialIcon
          raised={false}
          type='github'
          onPress={() => Linking.openURL('http://github.com')}
        />

        <SocialIcon
          raised={false}
          type='facebook'
          onPress={() => Linking.openURL('http://facebook.com')}
        />

        <SocialIcon
          raised={false}
          type='instagram'
          onPress={() => Linking.openURL('http://instagram.com')}
        />
      </View>

      {/* <View style={styles.bottom}>
        <Text style={styles.text}>Copyrights 2020 </Text>
      </View> */}


      </View>
    </SafeAreaView>
    );
};

AboutsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'About',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Icon
            name="menu"
            size={30}
            color='white'
                onPress={() => {
                    navData.navigation.toggleDrawer();
                }}
            />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
    containerMain: {
      flex: 1,
      alignItems: 'center',
    },
    socialIcons:{
      flexDirection: 'row',
      alignSelf: "center"

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
    bottom: {
      width: '100%',
      height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      position: 'absolute', //Here is the trick
      bottom: 0, //Here is the trick
    }
  });

export default AboutsScreen;
