import React, { Component } from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { View, Text, StyleSheet,ActivityIndicator , RefreshControl, ScrollView} from 'react-native';

import HeaderButton from '../components/HeaderButton';
import MealList from '../components/MealList';
import BaseUrl from '../constants/Url';
import AsyncStorage from '@react-native-community/async-storage'
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons'; 
import Colors from '../constants/Colors';

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
    totalCo2Reduced:0,
    userId:-1,
    appliedFilters:"",
    isFiltersApplied: false
  }


  fetchData = (userId, appliedFilters) => {
    fetch(BaseUrl+'getEnergyHistory', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        userId: userId,
        appliedFilters: appliedFilters
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
    console.log("Component did mount")
  }
    

    _onRefresh = () => {
      this.setState({refreshing: true});
      this.fetchData()
      this.setState({refreshing: false});
    }


    render() {
      console.log("Render")

      const userId = AsyncStorage.getItem('userId').then((value) => {
        console.log("in then", value)
        if(this.state.userId == -1){
          this.setState({userId: value});
        }
        console.log("History User Id Async:",this.state.userId);
  
        const appliedFilters = AsyncStorage.getItem('appliedFilters').then((value) => {    
          console.log("Get appliedFilters Async History:",value);
            this.setState({appliedFilters: value});
            this.fetchData(this.state.userId, this.state.appliedFilters)
          // }
          return value
          
        })
        return value      
      })
      this.setState({isFiltersApplied: true});

      // if (appliedFilters !== "" && this.state.isFiltersApplied == false){
      //   this.fetchData(this.state.userId, this.state.appliedFilters)
      //   this.setState({isFiltersApplied: !isFiltersApplied});

      // }

      var totalCo2Reduced = this.state.totalCo2Reduced
      // if (totalCo2Reduced > 0) {
      //   totalCo2Reduced = " + " + totalCo2Reduced
      // } 
      // else if (totalCo2Reduced < 0){
      //   totalCo2Reduced = " - " + totalCo2Reduced
      // }
      // else{
      //   totalCo2Reduced = " - " 
      // }

      if(this.state.isLoading == false) {
        return (
            <View>
              <View style= {styles.totals}>
                <View style= {styles.Eachtotal}>
                  <Text> Total </Text>
                  <Text style={styles.text}>{this.state.totalCo2}Kg</Text>
                  <MaterialCommunityIcons name="periodic-table-co2" size={25} color={Colors.primaryColor} />
                </View>
                <View style= {styles.Eachtotal}>
                  <Text> Recycled </Text>
                  <Text style={styles.text}>{this.state.totalRecycledCo2}Kg</Text>
                  <FontAwesome name="recycle" size={24} color={Colors.primaryColor} />

                </View>
                <View style= {styles.Eachtotal}>
                  <Text> Since last week </Text>
                  <Text style={styles.text}> {totalCo2Reduced} %</Text>
                  {/* <MaterialCommunityIcons name="percent" size={24} color={Colors.primaryColor} /> */}
                </View>
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
    headerLeft:() =>
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Menu"
          iconName="ios-menu"
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    
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
    marginTop:5 ,
    alignSelf: "center"
  },
  Eachtotal:{
    borderColor: '#F8F8FF',
    border:1,
    width: '32%'

  },
  totals:{
    marginBottom: 15,
    textAlign: 'center',
    // backgroundColor: '#6ED4C8',
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: "center",
    justifyContent: "center"
  }

});

export default HistoryScreen;




