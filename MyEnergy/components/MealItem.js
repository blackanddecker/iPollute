import React, { Component } from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { AntDesign } from 'react-native-vector-icons'; 
import { MaterialIcons } from 'react-native-vector-icons'; 
import { MaterialCommunityIcons } from 'react-native-vector-icons'; 
import { FontAwesome } from 'react-native-vector-icons'; 

import DefaultText from './DefaultText';
import Colors from '../constants/Colors';
import Modal from 'react-native-modal';

class MealItem extends Component{

  state = {
    isModalVisible:false
    }
  deleteHistory = () => {
    console.log("delete function called")
  }
  openModal = () =>{
    this.setState({
    isModalVisible:true
    })
    }

    toggleModal = () =>{
      this.setState({
      isModalVisible:!this.state.isModalVisible
      })
      }

      closeModal = () =>{
        this.setState({
        isModalVisible:false
        })
        }
  render(){
      var itemIcon = <MaterialCommunityIcons name="train-car" size={24} color={Colors.primaryColor} /> 
        if (this.props.item === 'car'){
          itemIcon = <AntDesign name="car" size={25} color= {Colors.primaryColor} />
        }
        else if (this.props.item === 'train'){
          itemIcon = <MaterialIcons name="train" size={24} color= {Colors.primaryColor} />
        }
        else if (this.props.item === 'bus'){
          itemIcon = <MaterialIcons name="directions-bus" size={24} color={Colors.primaryColor} />    }
        
        else if (this.props.item === 'aeroplane'){
          itemIcon = <FontAwesome name="plane" size={24} color= {Colors.primaryColor} />
        }
    
      return (
        <View style={styles.mealItem}>
            <View style={{ ...styles.mealRow, ...styles.mealDetail }}>
              
              <View style={{ flex: 1, flexDirection: 'column', paddingHorizontal: 5, margin:10}}>
                {itemIcon}
                <Text> Date : {this.props.date} </Text>


                <View style={{flex: 1, flexDirection: 'column', paddingHorizontal: 5 }}>

                  <TouchableOpacity onPress={()=>this.openModal()} >
                    <MaterialIcons name="change-history" size={30} color={Colors.primaryColor} />
                  </TouchableOpacity>


                  <TouchableOpacity onPress={this.deleteHistory} >
                    <MaterialIcons name="delete" size={30} color={Colors.primaryColor} />
                  </TouchableOpacity>
                </View>

              </View>
              <View style={{flex: 1, flexDirection: 'column', paddingHorizontal: 5}}>
                <Text> Type : {this.props.type} </Text>
                <Text>Item : {this.props.item} </Text>
              </View>
              <View style={{flex: 1, flexDirection: 'column', paddingHorizontal: 5}}>

              <Text> Time : {this.props.time} </Text> 
              <Text> Cost : {this.props.cosredt} </Text>
              </View>

            </View>
        </View>
      );
    }
};

const styles = StyleSheet.create({
  mealItem: {
    height: 90,
    width: '100%',
    backgroundColor: '#E7FFE1',
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical: 10
  },
  mealRow: {
    flexDirection: 'row'
  },
  mealHeader: {
    height: '85%'
  },
  modal: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#f7021a',
    padding: 100
 },
  mealDetail: {
    paddingHorizontal: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '15%'
  },
  titleContainer: {
    backgroundColor: 'green',
    paddingVertical: 5,
    paddingHorizontal: 12
  },
  actionIcons:{
    justifyContent: 'flex-end',
    alignSelf: 'flex-end'
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 20,
    color: 'white',
    textAlign: 'center'
  },
});

export default MealItem;
