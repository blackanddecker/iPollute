import React, { useState, useEffect, useCallback, Component } from 'react';
import { View, Text, StyleSheet, Thumb, Rail, RailSelected, Notch, Switch, Platform, TouchableOpacity, RefreshControl, ScrollView} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Slider } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import HeaderButton from '../components/HeaderButton';
import Colors from '../constants/Colors';
import BaseUrl from '../constants/Url';
import AsyncStorage from '@react-native-community/async-storage'
import DateTimePicker from '@react-native-community/datetimepicker';

import { Icon } from 'react-native-elements';
import base64 from 'react-native-base64'


class FiltersScreen extends Component {
    constructor(){
        super();
            this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
      }

    state = {
        userId: -1,
        isLoading: true,
        minDate : new Date(),
        maxDate: new Date(),
        maxKm: 0,
        minKm: 0,
        minKg: 0,   

        transports: [],
        foods: [],
        lowCurrentKg:0,
        lowCurrentKm:0,
        highCurrentKg:0,
        highCurrentKm:0,
        maxCurrentDate: new Date(),
        minCurrentDate: new Date(),
        isTransport: true, 
        isFood: true,
        isRecycle: true,
        isElectricity: true, 
        refreshing:false
    };

    forceUpdateHandler(){
        this.forceUpdate();
    };

    componentDidUpdate(){
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchData(this.state.userId)
        this.setState({refreshing: false});
     }

     
    fetchData = (userId) => {
        fetch(BaseUrl+'getFilterOptions', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")

            },
            body: JSON.stringify({
                userId:this.state.userId
            }),
            method: 'POST'
        })
        .then((response) => response.json())
        .then((responseJson) => {

            var minD = new Date(responseJson['filters']['minDate'])
            var minD2 = minD.getFullYear() + '-' + minD.getMonth() +1 + '-' + minD.getDate()

            var maxD = new Date(responseJson['filters']['maxDate'])
            var maxD2 = maxD.getFullYear() + '-' + maxD.getMonth() +1 + '-' + maxD.getDate()

            this.setState({
                minDate : minD2,
                minCurrentDate : minD2,
                maxDate: maxD2,
                maxCurrentDate : maxD2,
                maxKm: responseJson['filters']['maxKm'],
                minKm: responseJson['filters']['minKm'],
                minKg: responseJson['filters']['minKg'], 
                maxKg: responseJson['filters']['maxKg'], 

                lowCurrentKg:responseJson['filters']['minKg'],
                lowCurrentKm:responseJson['filters']['minKm'],
                highCurrentKg:responseJson['filters']['maxKg'],
                highCurrentKm:responseJson['filters']['maxKm'],

                transports: [],
                foods: [],
                isLoading: !this.state.isLoading })
            console.log(this.state);
                        
        })
        .catch((error) => {
                console.error(error);
                alert("User data didnt fetch");
                });
    }

    componentDidMount = () => {
        const userId = AsyncStorage.getItem('userId').then((value) => {
            value = parseInt(value)
            this.setState({userId: value});
            return value
        })
        .then(userId => {
                this.fetchData(this.state.userId)
        })

        console.log("Component did mount")
    }

    showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
      };

    showDatepicker = () => {
        showMode('date');
      };

    saveFilters = () => {
        const appliedFilters = {
            isTransport: this.state.isTransport,
            isFood:this.state.isFood,
            isElectricity:this.state.isElectricity,
            isRecycle:this.state.isRecycle,
            lowKm: this.state.lowCurrentKm,
            highKm: this.state.highCurrenKm,
            lowKg: this.state.lowCurrentKg,
            highKg: this.state.highCurrenKg,
            minCurrentDate: this.state.minCurrentDate, 
            maxCurrentDate: this.state.maxCurrentDate, 

        };
        console.log("appliedFilters",appliedFilters)
        AsyncStorage.setItem('appliedFilters', JSON.stringify(appliedFilters))
        .then(res => {
            alert("Filters are saved")
        });
    }


    restoreFilters = () => {
        this.fetchData(this.state.userId)
        this.setState({
            isTransport: true, 
            isFood: true,
            isRecycle: true,
            isElectricity: true
        })

    }

    updateMinCurrentDate = (minCurDate) => {
        var curDate = minCurDate.substring(0, 10);
        console.log("Update minCurDate: ", minCurDate)
        this.setState({ minCurrentDate: minCurDate })
    }

    updateMaxCurrentDate = (maxCurrentDate) => {
        console.log("Update maxCurrentDate: ", maxCurrentDate)
        this.setState({ maxCurrentDate: maxCurrentDate })
    }


    setIsTransport = (isTransport) => {
        this.setState({ isTransport: isTransport })
    }
    setIsRecycle = (isRecycle) => {
        this.setState({ isRecycle: isRecycle })
    }
    setIsElectricity = (isElectricity) => {
        this.setState({ isElectricity: isElectricity })
    }
    setIsFood = (isFood) => {
        this.setState({ isFood: isFood })
    }
    updateCurrentKm = (low) => {
        this.setState({ lowCurrentKm: low })
    }
    updateCurrentKg = (low) => {
        this.setState({ lowCurrentKg: low })
    }


    render() {
        console.log()
        return  (
            <ScrollView
                style={styles.screen}
                refreshControl={
                <RefreshControl
                    refreshing={this.state.refreshing}
                    onRefresh={this._onRefresh}
                />
                }
            >
                        
                    <View style={styles.component}>
                    <Text style={styles.text}>Select Start Date</Text>

                    <DatePicker
                        style={{width: 200}}
                        date={this.state.minCurrentDate}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate={ this.state.minDate}
                        maxDate={ this.state.maxDate}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                        // ... You can check the source to find the other keys.
                        }}
                        onDateChange={newValue => this.updateMinCurrentDate(newValue)}
                    />
                </View>
                <View style={styles.component}>
                    <Text style={styles.text}>Select End Date</Text>
                    <DatePicker
                        style={{width: 200}}
                        date={this.state.maxCurrentDate}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate={ this.state.minDate}
                        maxDate={ this.state.maxDate}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                        dateIcon: {
                            position: 'absolute',
                            left: 0,
                            top: 4,
                            marginLeft: 0
                        },
                        dateInput: {
                            marginLeft: 36
                        }
                        // ... You can check the source to find the other keys.
                        }}
                        onDateChange={newValue => this.updateMaxCurrentDate(newValue)}
                    />
                </View>     
                <View style={styles.componentRow}>
                    <Text> Transport</Text>
                    <Switch style={styles.switch}
                        value = {this.state.isTransport} 
                        trackColor = {{true: Colors.primaryColor}}
                        thumbColor = {Colors.primaryColor}
                        onValueChange = {newValue => this.setIsTransport(newValue)}>
                    </Switch>
                </View>  
                <View style={styles.componentRow}>
                    <Text> Food</Text>
                    <View style={styles.switch}>
                        <Switch 
                            value = {this.state.isFood}
                            trackColor = {{true: Colors.primaryColor}}
                            thumbColor = {Colors.primaryColor}
                            onValueChange = {newValue => this.setIsFood(newValue)}
                        ></Switch>
                    </View>
                </View>  
                <View style={styles.componentRow}>
                    <Text> Electricity </Text>
                    <Switch 
                        style={styles.switch}
                        value = {this.state.isElectricity}
                        trackColor = {{true: Colors.primaryColor}}
                        thumbColor = {Colors.primaryColor}
                        onValueChange = {newValue => this.setIsElectricity(newValue)}
                    ></Switch>
                </View>  
                <View style={styles.componentRow}>
                    <Text> Recycle </Text>
                    <Switch 
                        style={styles.switch}
                        value = {this.state.isRecycle}
                        trackColor = {{true: Colors.primaryColor}}
                        thumbColor = {Colors.primaryColor}
                        onValueChange = {newValue => this.setIsRecycle(newValue)}

                    ></Switch>
                </View> 



                <View style={styles.component}>
                    
                    <View style={styles.slider}>

                        <Slider
                            value={this.state.lowCurrentKg}
                            onValueChange={this.updateCurrentKg}
                            maximumValue={this.state.maxKg}
                            minimumValue={this.state.minKg}
                            step={5}
                            trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                            thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                        /> 















                    </View>
                    <Text style={styles.text}>Food (kg): {this.state.lowCurrentKg}</Text>
                </View>

                <View style={styles.component}>
                    <View style={styles.slider}>

                        <Slider
                            value={this.state.lowCurrentKm}
                            onValueChange={this.updateCurrentKm}
                            maximumValue={this.state.maxKm}
                            minimumValue={this.state.minKm}
                            step={5}
                            trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                            thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                        />
                    </View>
                    <Text style={styles.text}>Transport (km): {this.state.lowCurrentKm}</Text>
                </View>

                <View>
                    <TouchableOpacity    style={styles.SaveButton2} onPress={()=>this.saveFilters()} underlayColor="white">
                        <View style={styles.Button}>
                            <FontAwesome name="save" size={24} color="black" />

                            <Text style={styles.buttonText}> Save </Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity    style={styles.SaveButton2} onPress={()=>this.restoreFilters()} underlayColor="white">
                        <View style={styles.RestoreButton}>
                            <FontAwesome name="refresh" size={24} color="black" />
                            <Text style={styles.RestorebuttonText}> Reset Filters </Text>
                        </View>
                    </TouchableOpacity>


                </View>

        </ScrollView>
        )

    }
};














FiltersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Filters',
        headerLeft: (
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
        )    
    };
};

const styles = StyleSheet.create({
    screen: {
        flex:1,
        position: 'relative',
        backgroundColor: '#F8F8FF'
        
    },
    text: {
        height: 30
    },
    SaveButton2:{
        alignItems: 'center'
    },
    Button: {
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: "center",
        width: '100%',
        paddingLeft:20,
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: { 
            height: 10, 
            width: 0 
        },
        shadowRadius: 25,
        backgroundColor:    Colors.primaryColor
    },
    
    RestoreButton: {
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: "center",

        width: '100%',
        paddingLeft:20,
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: { 
            height: 10, 
            width: 0 
        },
        shadowRadius: 25,
        backgroundColor:    "white"
    },


    component: {
        paddingLeft: 25,
        alignSelf: 'stretch',
        // justifyContent: 'center'

        backgroundColor: '#ffffff',
        marginBottom: 8,
        display: 'flex',
        flexDirection: 'column',
        height: 70,
        borderRadius: 6,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: { 
            height: 10, 
            width: 0 
        },
        shadowRadius: 25
    },
    buttonText: {
        textAlign: 'center',
        padding: 20,
        color: 'black'
    },
    RestorebuttonText: {
        textAlign: 'center',
        padding: 20,
        color: 'black'
    },
    componentRow:
    {
        backgroundColor: '#ffffff',

        paddingLeft: 25,
        alignSelf: 'stretch',
        // justifyContent: 'center'
        alignItems: 'stretch',
        marginBottom: 8,
        display: 'flex',
        flexDirection: 'row',
        flex:1,
        borderRadius: 6,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: { 
            height: 10, 
            width: 0 
        },
        shadowRadius: 25
    },
    slider:{
        width:"75%"
    },
    switch:{
        flex:1,
        marginRight: 30,
        textAlign: 'center',
        alignSelf: "center"

    }
});

export default FiltersScreen;
