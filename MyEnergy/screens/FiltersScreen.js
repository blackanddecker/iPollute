import React, { useState, useEffect, useCallback, Component } from 'react';
import { View, Text, StyleSheet, Switch, Platform, TouchableOpacity, ScrollView} from 'react-native';
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


class FiltersScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            minDate : '',
            maxDate: '',
            maxKm: 0,
            minKm: 0,
            minKg: 0, 
            maxKg: 0, 
            transports: [],
            foods: [],
            currentKg:0,
            currentKm:0,
            maxCurrentDate: '',
            minCurrentDate: '',
            isTransport: true, 
            isFood: true,
            isRecycle: true,
            isElectricity: true, 
            date:"2016-05-15"
        };
      }


    fetchData = (userId) => {
        fetch(BaseUrl+'getFilterOptions', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId:1
            }),
            method: 'POST'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            this.setState({
                minDate : responseJson['filters']['minDate'],
                maxDate: responseJson['filters']['maxDate'],
                maxKm: responseJson['filters']['maxKm'],
                minKm: responseJson['filters']['minKm'],
                minKg: responseJson['filters']['minKg'], 
                maxKg: responseJson['filters']['maxKg'], 
                currentKg:responseJson['filters']['minKg'],
                currentKm:responseJson['filters']['minKm'],
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
        const { navigation } = this.props;
        const userId = navigation.getParam('userId', '-1');

        console.log("Get param1:",this.props.navigation.state.params);

        this.setState({ userId: userId });

        this.fetchData(userId)
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
            isRecycle:this.state.isRecycle
        };
        console.log("appliedFilters",appliedFilters)
        AsyncStorage.setItem('appliedFilters', JSON.stringify(appliedFilters))
        .then(res => {
            alert("Filters are saved")
        });
    }

    updateMinCurrentDate = (minCurrentDate) => {
        this.setState({ minCurrentDate: minCurrentDate })
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
    updateMaxCurrentDate = (maxCurrentDate) => {
        this.setState({ maxCurrentDate: maxCurrentDate })
    }
    updateCurrentKm = (currentKm) => {
        this.setState({ currentKm: currentKm })
    }
    updateCurrentKg = (currentKg) => {
        this.setState({ currentKg: currentKg })
    }

    render() {
        return (
            <ScrollView style={styles.screen}>
                        
                    <View style={styles.component}>
                    <Text style={styles.text}>Select Start Date</Text>

                    <DatePicker
                        style={{width: 200}}
                        date={this.state.date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate="2016-05-01"
                        maxDate="2016-06-01"
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
                        onDateChange={(date) => {this.setState({date: date})}}
                    />
                    {/* <DateTimePicker
                        style={{width: 300}}
                        value={"2016-05-15"}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate={"2016-05-15"}
                        maxDate={"2016-05-15"}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={this.updateMinCurrentDate}
                    /> */}
                </View>
                <View style={styles.component}>
                    <Text style={styles.text}>Select End Date</Text>
                    <DatePicker
                        style={{width: 200}}
                        date={this.state.date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate="2016-05-01"
                        maxDate="2016-06-01"
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
                        onDateChange={(date) => {this.setState({date: date})}}
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
                            value={this.state.currentKg}
                            onValueChange={this.updateCurrentKg}
                            maximumValue={this.state.maxKg}
                            minimumValue={this.state.minKg}
                            step={5}
                            trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                            thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                        />

                    </View>
                    <Text style={styles.text}>Food Kg: {this.state.currentKg}</Text>
                </View>

                <View style={styles.component}>
                    <View style={styles.slider}>

                        <Slider
                            value={this.state.currentKm}
                            onValueChange={this.updateCurrentKm}
                            maximumValue={this.state.maxKm}
                            minimumValue={this.state.minKm}
                            step={5}
                            trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                            thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                        />
                    </View>
                    <Text style={styles.text}>Transport Km: {this.state.currentKm}</Text>
                </View>

                <TouchableOpacity    style={styles.SaveButton2} onPress={()=>this.saveFilters()} underlayColor="white">
                    <View style={styles.SaveButton}>
                        <FontAwesome name="save" size={24} color="black" />

                        <Text style={styles.buttonText}> Save </Text>
                    </View>
                </TouchableOpacity>
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
    SaveButton: {
        
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        borderRadius: 6,
        alignItems: 'center',
        width: '85%',
        backgroundColor: '#2AC062',
        justifyContent: 'center',
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: { 
            height: 10, 
            width: 0 
        },
        shadowRadius: 25,
        backgroundColor:    Colors.thirdBlueColor
    },
    
    component: {
        paddingLeft: 25,
        alignSelf: 'stretch',
        // justifyContent: 'center'

        backgroundColor: '#ffffff',
        marginBottom: 15,
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
    componentRow:
    {
        backgroundColor: '#ffffff',

        paddingLeft: 25,
        alignSelf: 'stretch',
        // justifyContent: 'center'
        alignItems: 'stretch',
        marginBottom: 15,
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
