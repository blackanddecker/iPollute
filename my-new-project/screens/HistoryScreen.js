import React, { Component } from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { View, Text, StyleSheet,ActivityIndicator } from 'react-native';

import HeaderButton from '../components/HeaderButton';
import MealList from '../components/MealList';

class HistoryScreen extends Component {

  state = {
    transportData: [],
    foodData: [],
    isLoading: true,
    isDisabled: true
  }

  componentDidMount = () => {
    fetch('http://192.168.1.4:5000/getEnergyHistory', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        userId: 1
      })
    })
    .then((response) => response.json())
    .then((responseJson) => {
       console.log(responseJson);
       for (const key in responseJson['foodHistory']){
         console.log("food key:",responseJson['foodHistory'][key])
         this.state.foodData.push(responseJson['foodHistory'][key])
        }
        for (const key in responseJson['transportHistory']){
          console.log("transport key:",responseJson['transportHistory'][key])
          this.state.transportData.push(responseJson['transportHistory'][key])
         }

        this.setState({isLoading: !this.state.isLoading })
    })
    .catch((error) => {
       console.error(error);
       alert("Transport data didnt fetch");
  
      });
    }
    


    render() {
      console.log("FoodData",this.state.foodData)
      if(this.state.isLoading == false) {
        return (
            <MealList list={this.state.transportData, this.state.foodData} />
        )
      }
      else{
        return (
          <ActivityIndicator size={"large"} ></ActivityIndicator>)
      }
    }

  // return <MealList listData={favMeals} navigation={props.navigation} />;
};

HistoryScreen.navigationOptions = navData => {
  return {
    headerTitle: 'History',
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

export default HistoryScreen;




