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
import base64 from 'react-native-base64'

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
    isFiltersApplied: false,
    isUpdateModalVisible:false,
  }


  fetchData = (userId, appliedFilters) => {
    fetch(BaseUrl+'getEnergyHistory', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")
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
            
            
            curWeekCo2: responseJson['totalStats']['curWeekCo2'],
            lastWeekCo2: responseJson['totalStats']['lastWeekCo2'],
            totalCo2Reduced: responseJson['totalStats']['totalCo2Reduced'],
            
            
            curWeekCo2Recycled: responseJson['totalStats']['curWeekCo2Recycled'],
            lastWeekCo2Recycled: responseJson['totalStats']['lastWeekCo2Recycled'],
            totalCo2RecycledReduced: responseJson['totalStats']['totalCo2RecycledReduced']
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
      var totalCo2RecycledReduced = this.state.totalCo2RecycledReduced
      // if (totalCo2Reduced > 0) {
      //   totalCo2Reduced = " + " + totalCo2Reduced
      // } 
      // else if (totalCo2Reduced < 0){
      //   totalCo2Reduced = " - " + totalCo2Reduced
      // }
      // else{
      //   totalCo2Reduced = " - " 
      // }

      if(this.state.isLoading === false) {
        if (totalCo2Reduced < 0 ){
          var sinceLastWeekIcon = <FontAwesome name="chevron-up" size={25} color={Colors.primaryColor} />  
        }
        else if (totalCo2Reduced == 0 ){
          var sinceLastWeekIcon = <FontAwesome name="minus" size={25} color={"black"} />  
        }
        else{
          var sinceLastWeekIcon = <FontAwesome name="chevron-down" size={25} color={Colors.red} />  
        }

        if (totalCo2RecycledReduced > 0 ){
          var sinceLastWeekIconRecycled = <FontAwesome name="chevron-up" size={25} color={Colors.primaryColor} />  
        }
        else if (totalCo2RecycledReduced == 0 ){
          var sinceLastWeekIconRecycled = <FontAwesome name="minus" size={25} color={"black"} />  
        }
        else{
          var sinceLastWeekIconRecycled = <FontAwesome name="chevron-down" size={25} color={Colors.red} />  
        }

        return (
          <ScrollView
              refreshControl={
              <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh}
              />
              }
          >
            <View style = {{ backgroundColor: (this.state.isUpdateModalVisible)? 'rgba(0, 0, 0, 0.4)' : 'transparent'}}>

              <View style = {{flexDirection : 'row'}}>
              <View style = {{flex:1}}>
                  <View>
                    <Text style = {styles.text}> Totals</Text>
                  </View>
                  <View style= {styles.totals}> 
                    <View style= {styles.Eachtotal}>
                      <FontAwesome name="cloud" size={25} color={Colors.primaryColor} />
                      <Text style={styles.text}> Emissions</Text>
                      <Text style={styles.text}>{this.state.totalCo2.toFixed(1)}</Text>
                      <Text style={styles.text}>(kg CO2)</Text>

                    </View>
                      <View style= {styles.Eachtotal}>
                          <FontAwesome name="recycle" size={25} color={Colors.primaryColor} />
                          <Text style={styles.text}> Recycled</Text>
                          <Text style={styles.text}> {this.state.totalRecycledCo2.toFixed(1)}</Text>
                          <Text style={styles.text}>(kg CO2)</Text>

                      </View>

                  </View>
                </View>

                <View style = {{flex:1}}>
                  <View>
                    <Text style = {styles.text}> Last Week Carbon Progress</Text>
                  </View>
                  <View style= {styles.totals}>
                    <View style= {styles.Eachtotal}>
                      {sinceLastWeekIcon} 
                      <Text style={styles.text}> Produced </Text>
                      <Text style={styles.text}> {this.state.totalCo2Reduced.toFixed(1)}</Text>
                      <Text style={styles.text}>(%)</Text>

                      {/* <MaterialCommunityIcons name="percent" size={24} color={Colors.primaryColor} /> */}
                    </View>

                    <View style= {styles.Eachtotal}>
                      {sinceLastWeekIconRecycled} 
                      <Text style={styles.text}> Recycled </Text>
                      <Text style={styles.text}> {this.state.totalCo2RecycledReduced.toFixed(1)}</Text>
                      <Text style={styles.text}>(%)</Text>

                      {/* <MaterialCommunityIcons name="percent" size={24} color={Colors.primaryColor} /> */}
                    </View>

                  </View>
                
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
            </View>

            </ScrollView>

        )
      }
      else{
        return( <View style={{ flex: 1,justifyContent: "center"}}>
              <ActivityIndicator size="large" color= {Colors.primaryColor} />
            </View>
            )
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
      position: 'relative'
    },
  text: {
    textAlign: 'center',
    color: 'black',
    textAlign: "center",
    marginTop:2 ,
    alignSelf: "center"
  },
  Eachtotal:{
    flex:1,
    alignItems: 'center',
    textAlign: 'center',
    alignSelf: "center",
    justifyContent: "center"
  },
  ListView:{
    flex:1,
    backgroundColor: 'white'
  },
  totals:{
    flex:1,
    marginTop:10,
    marginBottom: 5,
    textAlign: 'center',
    paddingBottom: 15,
    flexDirection: 'row',
    alignItems: 'stretch',
    alignSelf: "center",
    justifyContent: "center"
  }

});

export default HistoryScreen;




