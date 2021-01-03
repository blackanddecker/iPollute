import React from 'react'

import { Text, ScrollView, StyleSheet, View, Image} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { DrawerItems } from 'react-navigation-drawer';

import logoImage from "../assets/Smoke.png";

const CustomDrawerContentComponent = (props) => {
    console.log("Custom Navigation Props",props)
    // const { navigation } = this.props;
    // const userId = navigation.getParam('userId', '-1');
    return (<ScrollView>
        <SafeAreaView style={styles.container}>      
        <Image source={logoImage} style={styles.profileImg}/>

        <View style={styles.sidebarDivider}></View>

            <DrawerItems {...props} />

      </SafeAreaView>
    </ScrollView>);
};

const styles = StyleSheet.create({

    container: {
      flex: 1
    },
    profileImg:{
      width:"100%",
      height:120,
      borderRadius:40,
      marginTop:20
    },
    sidebarDivider:{
      height:1,
      width:"100%",
      backgroundColor:"lightgray",
      marginVertical:10
    }

});

  
export default CustomDrawerContentComponent;
