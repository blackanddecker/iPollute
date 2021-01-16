import React from 'react'

import { Text, ScrollView, StyleSheet, View, Image} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { Avatar } from 'react-native-elements';

import logoImage from "../assets/Smoke.png";

const CustomDrawerContentComponent = (props) => {
  return (
      <SafeAreaView style={styles.container}>   
      <View>

        <Avatar
          rounded
          source={logoImage}
          style={styles.profileImg}
        />

        <View style={styles.sidebarDivider}></View>

            <DrawerNavigatorItems {...props} />
      </View>   

    </SafeAreaView>
  );
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
