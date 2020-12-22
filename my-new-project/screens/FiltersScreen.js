import React, { useState, useEffect, useCallback, Component } from 'react';
import { View, Text, StyleSheet, Switch, Platform, TouchableOpacity} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { Slider } from 'react-native-elements';
import DatePicker from 'react-native-datepicker'
import { AntDesign } from '@expo/vector-icons'; 

import HeaderButton from '../components/HeaderButton';
import Colors from '../constants/Colors';
import BaseUrl from '../constants/Url';


class FiltersScreen extends Component {

    state = {
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
        minCurrentDate: ''
    }

    componentDidMount = () => {
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
    // const { navigation } = props;

    // const [isGlutenFree, setIsGlutenFree] = useState(false);
    // const [isLactoseFree, setIsLactoseFree] = useState(false);
    // const [isVegan, setIsVegan] = useState(false);
    // const [isVegetarian, setIsVegetarian] = useState(false);
    // const [sliderCostValue, setSliderCostValue] = useState(0);
    // const [sliderHoursValue, setSliderHoursValue] = useState(0);

    
    // const [startDate, setStartDate] = useState(0);
    // const [endDate, setEndDate] = useState(0);

    // const saveFilters = useCallback(() => {
    //     const appliedFilters = {
    //         glutenFree: isGlutenFree,
    //         lactoseFree: isLactoseFree,
    //         vegan: isVegan,
    //         isVegetarian: isVegetarian
    //     };

    //     console.log(appliedFilters);
    // }, [isGlutenFree, isLactoseFree, isVegan, isVegetarian]);

    // useEffect(() => {
    //     navigation.setParams({ save: saveFilters });
    // }, [saveFilters]);

    saveFilters = () => {
        console.log("SaveFilters",state)
    }

    updateMinCurrentDate = (minCurrentDate) => {
        this.setState({ minCurrentDate: minCurrentDate })
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
            <View style={styles.screen}>
                <View style={styles.component}>
                    <Text style={styles.text}>Select Start Date</Text>

                    <DatePicker
                        style={{width: 300}}
                        date={this.state.minCurrentDate}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={this.updateMinCurrentDate}
                    />
                </View>
                <View style={styles.component}>
                    <Text style={styles.text}>Select End Date</Text>
                    <DatePicker
                        style={{width: 300}}
                        date={this.state.maxCurrentDate}//{this.state.date}
                        mode="date"
                        placeholder="select date"
                        format="YYYY-MM-DD"
                        minDate={this.state.minDate}
                        maxDate={this.state.maxDate}
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        onDateChange={this.updateMaxCurrentDate}
                        />    
                </View>

                <View style={styles.component}>
                    <Text style={styles.text}>Food Kg: {this.state.currentKg}</Text>
                    
                    <View style={styles.slider}>

                        <Slider
                            value={this.currentKg}
                            onValueChange={this.updateCurrentKg}
                            maximumValue={this.state.maxKg}
                            minimumValue={this.state.minKg}
                            step={5}
                            trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                            thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                        />

                    </View>
                </View>

                <View style={styles.component}>
                    <Text style={styles.text}>Transport Km: {this.state.currentKm}</Text>
                    <View style={styles.slider}>

                        <Slider
                            value={this.currentKm}
                            onValueChange={this.updateCurrentKm}
                            maximumValue={this.state.maxKm}
                            minimumValue={this.state.minKm}
                            step={5}
                            trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                            thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                        />
                    </View>
                </View>

                <TouchableOpacity    onPress={()=>this.saveFilters()} underlayColor="white">
                    <View style={styles.SaveButton}>
                        <Text style={styles.buttonText}> Save </Text>
                    </View>
                </TouchableOpacity>
        </View>
        )

    }
};














FiltersScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Filters',
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
        height: 30
    },

    SaveButton: {

        display: 'flex',
        flexDirection: 'row',
        height: 60,
        borderRadius: 6,
        alignItems: 'center',
        width: '100%',
        paddingLeft:20,
        backgroundColor: '#2AC062',
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: { 
            height: 10, 
            width: 0 
        },
        shadowRadius: 25,
        backgroundColor:    Colors.thirdBlueColor
        },
    buttonText: {
        textAlign: 'center',
        padding: 20,
        color: 'white'
    },
    component: {
        paddingLeft: 25,
        alignSelf: 'stretch',
        // justifyContent: 'center'

        marginBottom: 15,
        display: 'flex',
        flexDirection: 'column',
        height: 70,
        borderRadius: 6,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        backgroundColor: '#F8F8FF',
        shadowColor: '#2AC062',
        shadowOpacity: 0.5,
        shadowOffset: { 
            height: 10, 
            width: 0 
        },
        shadowRadius: 25
        },
        buttonText: {
            textAlign: 'left',
            padding: 20,
            color: 'black'
    },
    slider:{
        width:"75%"
    }
});

export default FiltersScreen;
