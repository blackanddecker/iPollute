import React, { Component } from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { View, Text, StyleSheet,ActivityIndicator , RefreshControl, ScrollView} from 'react-native';

import HeaderButton from '../components/HeaderButton';
import MealList from '../components/MealList';
import BaseUrl from '../constants/Url';
import AsyncStorage from '@react-native-community/async-storage'

import Colors from '../constants/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Icon } from 'react-native-elements';

class HistoryScreen extends Component {

  constructor(){
    super();
        this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
  };
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
        var historyData = []
        // console.log(responseJson);
         for (const key in responseJson['history']){
          //  console.log("history key:",responseJson['history'][key])
           historyData.push(responseJson['history'][key])
          }
  
          this.setState({
            isLoading: false,  
            historyData: historyData,
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

    var userId = AsyncStorage.getItem('userId').then((value) => {
      value = parseInt(value)
      this.setState({userId: value});
      console.log("History User Id Async:",this.state.userId);
      return value      
    })
    .then(userId => {
      var appliedFilters = AsyncStorage.getItem('appliedFilters').then((appliedFilters) => {    
        console.log("Get appliedFilters Async History:",appliedFilters);
          this.setState({appliedFilters: JSON.parse(appliedFilters)});
          this.fetchData(this.state.userId, this.state.appliedFilters)
          this.setState({isFiltersApplied: true});
        // }
        return JSON.parse(appliedFilters)
        
      })
      //do something else
  });
    console.log("Component did mount")
  }
    
  forceUpdateHandler(){
    this.forceUpdate();
  };
  
  componentDidUpdate(){
    const appliedFilters = AsyncStorage.getItem('appliedFilters').then((value) => {    
      console.log("Get appliedFilters Async History:",value);
      return JSON.parse(value) 
    })
    .then(appliedFilters => {
      console.log("Compare filters:", this.state.appliedFilters, appliedFilters)
      if (JSON.stringify(this.state.appliedFilters) !== JSON.stringify(appliedFilters)) {
        console.log("Save new Filters")
        this.setState({appliedFilters: appliedFilters});
        this.fetchData(this.state.userId, appliedFilters)

      }
    });
  }

  componentWillUnmount() {
    console.log("History Screen componentWillUnmount")
  }

  _onRefresh = () => {
    this.setState({refreshing: true});
    this.fetchData(this.state.userId, this.state.appliedFilters)
    this.setState({refreshing: false});
  }

    render() {
      console.log("Render")


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
          <ScrollView
              refreshControl={
              <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
              />
              }
          >
              <View style= {styles.totals}>
                <View style= {styles.Eachtotal}>
                  <Text style={styles.text}> Total </Text>
                  <Text style={styles.text}>{this.state.totalCo2}Kg</Text>
                  <View style= {styles.Eachtotal}>
                    <FontAwesome name="smog" size={25} color={Colors.primaryColor} />
                  </View>
                </View>
                <View style= {styles.Eachtotal}>
                  <Text style={styles.text}> Recycled </Text>
                  <Text style={styles.text}>{this.state.totalRecycledCo2}Kg</Text>
                  <View style= {styles.Eachtotal}>

                    <FontAwesome name="recycle" size={24} color={Colors.primaryColor} />
                  </View>
                </View>
                <View style= {styles.Eachtotal}>
                  <Text style={styles.text}> Since last week </Text>
                  <Text style={styles.text}> {totalCo2Reduced} %</Text>
                  {/* <MaterialCommunityIcons name="percent" size={24} color={Colors.primaryColor} /> */}
                </View>
              </View>
              <View style= {styles.ListView}>
                <MealList 
                    list={this.state.historyData}
                    refresing={this.state.refreshing}
                    userId={this.state.userId}
                    appliedFilters={this.state.appliedFilters}
                    _handleRefresh={this._onRefresh}
                    _fetchData={this.fetchData}
                    />

              </View>
            </ScrollView>

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
        <Icon
            name="menu"
            size={30}
            color='white'
                onPress={() => {
                    navData.navigation.toggleDrawer();
                }}
            />
      </HeaderButtons>
    
  };
};


const styles = StyleSheet.create({
  screen: {

      flex:1,
      marginTop: 15,
      position: 'relative',
      backgroundColor: '#ffffff'
  },
  text: {
    textAlign: 'center',
    color: 'black',
    fontWeight: 'bold',
    textAlign: "center",
    marginTop:5 ,
    alignSelf: "center"
  },
  Eachtotal:{
    flex:1,

    textAlign: 'center',
    alignSelf: "center",
    justifyContent: "center"
  },
  ListView:{
    flex:1,
    backgroundColor: 'white'
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




