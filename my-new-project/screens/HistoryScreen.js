import React, { Component } from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { View, Text, StyleSheet,ActivityIndicator , RefreshControl, ScrollView} from 'react-native';

import HeaderButton from '../components/HeaderButton';
import MealList from '../components/MealList';
import BaseUrl from '../constants/Url';

class HistoryScreen extends Component {

  // constructor(props) {
  //   super(props);
  // }
  
  state = {
    refreshing: false,
    transportData: [],
    historyData: [],
    isLoading: true,
    isDisabled: true,
    totalCo2 : 0, 
    totalRecycledCo2:0, 
    totalCo2Reduced:0
  }


  fetchData = () => {
    this.setState({historyData: []}); 
    fetch(BaseUrl+'getEnergyHistory', {
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
         for (const key in responseJson['history']){
           console.log("history key:",responseJson['history'][key])
           this.state.historyData.push(responseJson['history'][key])
          }
  
          this.setState({
            isLoading: false,  
            totalCo2: responseJson['totalStats']['totalCo2'],
            totalRecycledCo2: responseJson['totalStats']['totalRecycledCo2'],
            totalCo2Reduced: responseJson['totalStats']['totalCo2Reduced']
          })

    })
    .catch((error) => {
       console.error(error);
       alert("History data didnt fetch");
  
      });
  }


  componentDidMount = () => {

    const { navigation } = this.props;
    const userId = navigation.getParam('userId', '-1');
    this.fetchData()

  }
    

    _onRefresh = () => {
      this.setState({refreshing: true});
      this.fetchData()
      this.setState({refreshing: false});
    }


    render() {
      console.log("Render")
      if(this.state.isLoading == false) {
        return (
            <View>
              <View style= {styles.totals}>
                <Text style={styles.text}> Total Co2: {this.state.totalCo2}</Text>
                <Text style={styles.text}> Total Recycled Co2: {this.state.totalRecycledCo2}</Text>
                <Text style={styles.text}> Reduced C02 from last week: {this.state.totalCo2Reduced}</Text>

              </View>
                <MealList list={this.state.historyData} refresing={this.state.refreshing} _handleRefresh={this._onRefresh}/>
            </View>

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


const styles = StyleSheet.create({
  screen: {

      marginTop: 15,
      position: 'relative',
      backgroundColor: '#ffffff'
  },
  text: {
    textAlign: 'left',
    color: 'black',
    fontWeight: 'bold',
    textAlign: "center",
    marginTop:5    
  },
  totals:{
    backgroundColor: '#6ED4C8',
    paddingBottom: 15,
  }

});

export default HistoryScreen;




