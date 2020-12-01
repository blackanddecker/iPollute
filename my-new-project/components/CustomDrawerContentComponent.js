import React from 'react'

import { Text, ScrollView, StyleSheet, View, Image} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { DrawerItems } from 'react-navigation-drawer';

import logoImage from "../assets/favicon.png"

const CustomDrawerContentComponent = (props) => {
    return (<ScrollView>
        <SafeAreaView style={styles.container}>      
        <Image source={logoImage} style={styles.profileImg}/>
        <Text style={{fontWeight:"bold",fontSize:16,marginTop:10}}>Janna Doe</Text>
        <Text style={{color:"gray",marginBottom:10}}>janna@doe.com</Text>
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
