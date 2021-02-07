import React from 'react'

import { Text, ScrollView, StyleSheet, View, Image, TouchableOpacity, Alert} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { DrawerNavigatorItems } from 'react-navigation-drawer';
import { Avatar } from 'react-native-elements';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-community/async-storage'

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
            <TouchableOpacity onPress={()=>
              Alert.alert(
                'Log out',
                'Do you want to logout?',
                [
                  {text: 'Cancel', onPress: () => {return null}},
                  {text: 'Confirm', onPress: () => {

                    AsyncStorage.getAllKeys((err, keys) => {
                      AsyncStorage.multiGet(keys, (error, stores) => {
                        stores.map((result, i, store) => {
                          console.log({ [store[i][0]]: store[i][1] });
                          return true;
                        });
                      });
                    });
                    AsyncStorage.clear();
                    
                    AsyncStorage.getAllKeys((err, keys) => {
                      AsyncStorage.multiGet(keys, (error, stores) => {
                        stores.map((result, i, store) => {
                          console.log({ [store[i][0]]: store[i][1] });
                          return true;
                        });
                      });
                    });
                    props.navigation.navigate('Login')
                  }},
                ],
                { cancelable: false }
              )  
            }>
              <View style = {{flexDirection: "row", paddingLeft: 20, marginVertical:10}}>
              <Ionicons name="ios-log-out" borderRadius={40} marginVertical={10} size={25} color={"gray"} />
              <Text style={{paddingLeft: 29, fontWeight: 'bold',color: "black", fontFamily: 'open-sans'}}>Logout</Text>
              </View>
            </TouchableOpacity>
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
      flex:1,
      height:1,
      width:"100%",
      backgroundColor:"lightgray",
      marginVertical:10
    }

});

  
export default CustomDrawerContentComponent;
