import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    Picker,
    Tooltip,
    Button,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    NumberInput,
    TouchableHighlight,
    Alert
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Modal from 'react-native-modal';
// import Icon from 'react-native-ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { Icon } from 'react-native-elements';

import Dialog, { DialogContent } from 'react-native-popup-dialog';
import { Slider } from 'react-native-elements';

import { Dimensions } from 'react-native';

import HeaderButton from '../components/HeaderButton';
import Colors from '../constants/Colors';
import { format, set } from "date-fns";
import base64 from 'react-native-base64'
import { withNavigationFocus } from 'react-navigation';

import BaseUrl from '../constants/Url';
import AsyncStorage from '@react-native-community/async-storage'
import EnergyObjects from '../constants/EnergyObjects';
import ProgressCircle from 'react-native-progress-circle'


class CategoriesScreen extends Component {
    constructor(){
        super();
            this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
      };
    state = {
        userId: -1,
        //insert energy variables
        initState : [],
        energyTypeId: 0,
        userCost:0,
        energyItemId:0,
        transportStr: '',
        foodStr:'',
        electricityStr:'',
        recycleStr:'',
        
        // energy variables
        transportData: [],
        foodData: [],
        electricityData: [],
        recycledData : [],

        // pie chart variables
        totalFoodCost : 0,
        totalTransportCost: 0, 
        totalElectricityCost: 0, 
        totalRecycleCost: 0, 
        totalUserEnergyCost:1,
        totalUserEnergyRecycle: 0,
        totalUserSavings: 0,
        warningEnergy: 100,
        
        // modal variables
        isTransportLoading: true,
        isFoodLoading: true,
        isDisabled: true,
        isTransportModalVisible: false,
        isFoodModalVisible: false,
        isRecycleModalVisible:false,
        isElectricityModalVisible:false,
        refreshing: false,
        appliedFilters:"",
        favTransport: '', 
        favFood: '',
        isLoading: true, 
        popUpHelp:false,
        popUpFoodHelp:false,
        popUpElectricityHelp:false,
        popUpRecycleHelp:false,
        popUpTransportHelp:false,
        openWarningEnergyModal:true, 
        savedEnergyInfo: false,
        savedEnergyMessage : ''
    }
    
    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchData(this.state.userId, this.state.appliedFilters)
        this.setState({refreshing: false});
     }


    fetchData = (userId, appliedFilters) => {
        // fetch(BaseUrl+'getEnergyObjects', {
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")
        //     },
        //     body: JSON.stringify({
        //         userId:userId,
        //         appliedFilters: appliedFilters
        //     }),
        //     method: 'POST'
        // })
        // .then((response) => response.json())
        // .then((responseJson) => {
        //     var transportData = []
        //     var foodData = []
        //     var electricityData = []
        //     var recycledData = []
        //     //console.log(responseJson);
        //     for (const key in responseJson['transportObjects']){
        //         // console.log("key:",responseJson['transportObjects'][key])
        //         transportData.push(responseJson['transportObjects'][key])
        //     }
        //     for (const key in responseJson['foodObjects']){
        //         foodData.push(responseJson['foodObjects'][key])
        //     }
        //     for (const key in responseJson['recycledObjects']){
        //         recycledData.push(responseJson['recycledObjects'][key])
        //     }
        //     for (const key in responseJson['electricityObjects']){
        //         electricityData.push(responseJson['electricityObjects'][key])
        //     }
        //     this.setState({recycleStr:1, electricityStr:1, foodStr:1, transportStr:1})
        //     this.setState({transportData:transportData, foodData:foodData, electricityData:electricityData, recycledData:recycledData})
        //     this.setState({isTransportLoading: !this.state.isTransportLoading, isFoodLoading: !this.state.isFoodLoading  })
        // })
        // .catch((error) => {
        //     console.error(error);
        //     alert("Transport data didnt fetch");
            
        // });
        
            var transportData = []
            var foodData = []
            var electricityData = []
            var recycledData = []
            //console.log(responseJson);
            for (const key in EnergyObjects.transportObjects){
                // console.log("key:",responseJson['transportObjects'][key])
                transportData.push(EnergyObjects.transportObjects[key])
            }
            for (const key in EnergyObjects.foodObjects){
                foodData.push(EnergyObjects.foodObjects[key])
            }
            for (const key in EnergyObjects.recycledObjects){
                recycledData.push(EnergyObjects.recycledObjects[key])
            }
            for (const key in EnergyObjects.electricityObjects){
                electricityData.push(EnergyObjects.electricityObjects[key])
            }
            this.setState({recycleStr:1, electricityStr:1, foodStr:1, transportStr:1})
            this.setState({transportData:transportData, foodData:foodData, electricityData:electricityData, recycledData:recycledData})
            this.setState({isTransportLoading: !this.state.isTransportLoading, isFoodLoading: !this.state.isFoodLoading  })

        
        fetch(BaseUrl+'getEnergyHistory', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")
            },
            body: JSON.stringify({
                userId:userId,
                appliedFilters: appliedFilters
            }),
            method: 'POST'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if (responseJson['success'] == true){
                
                this.setState({
                    totalTransportCost: responseJson['userEnergy']['totalTransportCost'],
                    totalUserEnergyCost: responseJson['userEnergy']['totalUserEnergyCost'] ,
                    totalFoodCost: responseJson['userEnergy']['totalFoodCost'],
                    totalElectricityCost: responseJson['userEnergy']['totalElectricityCost'],

                    totalRecycleCost: responseJson['userEnergy']['totalRecycleCost'],
                    totalUserSavings: responseJson['userEnergy']['totalUserSavings'],
                    totalUserEnergyRecycle: responseJson['userEnergy']['totalUserEnergyRecycle']})

            }
            else{
                alert("User Energy didnt fetch");
            }
            
        })
        .catch((error) => {
            console.error(error);
            alert("User Energy didnt fetch");
            
        });



        fetch(BaseUrl+'getUserDetails', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")
            },
            body: JSON.stringify({
                userId: this.state.userId
            }),
            method: 'POST'
        })
        .then((response) => response.json())
        .then((responseJson) => {
                console.log(responseJson);
                this.setState({
                    // userEnergy: responseJson['userDetails']['energyTotal'],
                    isLoading:false,
                    favFood: responseJson['userDetails']['favFood'],
                    foodStr: responseJson['userDetails']['favFood'],
                    warningEnergy: responseJson['userDetails']['userEnergy'],
                    favTransport: responseJson['userDetails']['favTransport'],
                    transportStr: responseJson['userDetails']['favTransport'],
                })
                console.log(this.state.warningEnergy , this.state.totalUserSavings, this.state.openWarningEnergyModal);
                
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
      
            console.log("Get state.UserId Async:",this.state.userId);
      
            return value
        })
        .then(userId => {
            var appliedFilters = AsyncStorage.getItem('appliedFilters').then((appliedFilters) => {    
              console.log("componentDidMount appliedFilters:",appliedFilters);
                this.setState({appliedFilters: JSON.parse(appliedFilters)});
                this.fetchData(this.state.userId, this.state.appliedFilters)
                this.setState({isFiltersApplied: true});
              // }
                this.setState({isLoading:false})

              return JSON.parse(appliedFilters)
              
            })
        });
        
    }

    componentDidUpdate(prevProps){
        
        const appliedFilters = AsyncStorage.getItem('appliedFilters').then((value) => {    
          console.log("componentDidUpdate appliedFilters:",value);
          return JSON.parse(value) 
        })
        .then(appliedFilters => {
          console.log("Compare filters:", this.state.appliedFilters, appliedFilters)
          if ((JSON.stringify(this.state.appliedFilters) !== JSON.stringify(appliedFilters)) || (prevProps.isFocused !== this.props.isFocused) ) {
            console.log("Save new Filters")
            this.setState({appliedFilters: appliedFilters});
            this.setState({isLoading:true})
            this.fetchData(this.state.userId, this.state.appliedFilters)
            this.setState({isLoading:false})
            this.setState({ openWarningEnergyModal: true})


          }
        });
      }

    forceUpdateHandler(){
        this.forceUpdate();
      };

    // componentDidUpdate(prevProps, prevState) {
    // if (prevState.pokemons !== this.state.pokemons) {
    //     this.fetchData(this.state.userId)
    //     }
    // }

    insertEnergy = () => {
        if (this.state.userCost <= 0 ){
            alert("User Cost must be greater than Zero");
            return
        }
        this.setState({isLoading:true})

        var curDate = new Date() 
        var formattedDate = format(curDate, 'yyyy-MM-dd HH:mm:ss');
        console.log("InserEnergy:", "Type", this.state.energyTypeId,"Item", this.state.energyItemId,  "User:", this.state.userId)


        fetch(BaseUrl+'insertEnergy', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")

            },
            method: 'POST',
            body: JSON.stringify({
                userId: this.state.userId,
                userCost: Number(this.state.userCost),
                energyItemId: Number(this.state.energyItemId),
                energyTypeId: Number(this.state.energyTypeId),
                datetime: formattedDate
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log(responseJson);
            if(responseJson['success'] == true){
                //alert(responseJson['message']); 

                // Alert.alert(
                //     'Action Saved',
                //     responseJson['message'],
                //     [
                //       { text: 'OK', onPress: () => console.log('OK Pressed') }
                //     ],
                //     { cancelable: false }
                //   );

                this.setState({savedEnergyInfo:true, savedEnergyMessage: responseJson['message']})
                this.closeTransportModal()
                this.closeFoodModal()
                this.closeRecycleModal()
                this.closeElectricityModal()

                this.fetchData(this.state.userId, this.state.appliedFilters)
                this.setState({isLoading:false})

                
            }
            else{
                alert("Insert Order Failed");
            }
        })
        .catch((error) => {
            console.error(error);
            alert("Insert Order Error");
        });
    }
    
    updateElectricity = (electricity) => {
        this.setState({ energyTypeId: 3, energyItemId: electricity , electricityStr: electricity})
        console.log("Update Electricity Energy:", "Type", this.state.energyTypeId,"Item", this.state.energyItemId,  "User:", this.state.userId)
    }
    updateRecycled = (recycle) => {
        this.setState({ energyTypeId: 2, energyItemId: recycle , recycleStr: recycle})
        console.log("Update Recycle Energy:", "Type", this.state.energyTypeId,"Item", this.state.energyItemId,  "User:", this.state.userId)

    }
    updateTransport = (transport) => {
        this.setState({ energyTypeId: 1, energyItemId: transport , transportStr: transport})
        console.log("Update Transport Energy:", "Type", this.state.energyTypeId,"Item", this.state.energyItemId,  "User:", this.state.userId)
    }
    updateFood = (food) => {this.setState({ energyTypeId: 0, energyItemId: food, foodStr:food })
        console.log("Update Food Energy:", "Type", this.state.energyTypeId,"Item", this.state.energyItemId,  "User:", this.state.userId)
    }
    updateCost = (cost) => {this.setState({ userCost: cost })}
    
    openTransportModal = () =>{this.setState({isTransportModalVisible:true, energyItemId:this.state.favTransport, energyTypeId: 1 })}
    toggleTransportModal = () =>{this.setState({isTransportModalVisible:!this.state.isTransportModalVisible})}
    closeTransportModal = () =>{this.setState({isTransportModalVisible:false, userCost: 0, transportStr: this.state.favTransport})}
    
    openFoodModal = () =>{this.setState({isFoodModalVisible:true, energyItemId:this.state.favFood, energyTypeId: 0 })}
    toggleFoodModal = () =>{this.setState({isFoodModalVisible:!this.state.isFoodModalVisible})}
    closeFoodModal = () =>{this.setState({isFoodModalVisible:false, userCost: 0, foodStr: this.state.favFood })}
    
    openRecycleModal = () =>{this.setState({isRecycleModalVisible:true, energyItemId:1, energyTypeId: 2 })}
    toggleRecycleModal = () =>{this.setState({isRecycleModalVisible:!this.state.isRecycleModalVisible})}
    closeRecycleModal = () =>{this.setState({isRecycleModalVisible:false, userCost: 0 })}

    openElectricityModal = () =>{this.setState({isElectricityModalVisible:true, energyItemId:1, energyTypeId: 3})}
    toggleElectricityModal = () =>{this.setState({isElectricityModalVisible:!this.state.isElectricityModalVisible})}
    closeElectricityModal = () =>{this.setState({isElectricityModalVisible:false, userCost: 0 })}

    getProperElectricityPickerName = (id, description) =>{
        if (id === 1){
            return ("🏠 " + description)
        }
        if (id === 2){
            return ("💡 " + description)
        }
        if (id === 3){
            return ("🏠 " + description)
        }
        return ("🏠 " + description)
    }

    getProperRecyclePickerName = (id, description) =>{
        if (id === 7){
            return ("🥾 " + description)
        }
        if (id === 12){
            return ("📄 " + description)
        }
        if (id === 15){
            return ("💡 " + description)
        }
        if (id === 7){
            return ("♻️ " + description)
        }
        if (id === 7){
            return ("♻️ " + description)
        }
        if (id === 7){
            return ("♻️ " + description)
        }
        if (id === 7){
            return ("♻️ " + description)
        }
        return ("♻️ " + description)
    }

    getProperTransportPickerName = (id, description) =>{
        if (id === 1 || id === 5 || id===6){
            return ("✈️ " + description)
        }
        if (id === 2 || id === 8){
            return ("🚗 " + description)
        }
        if (id === 3){
            return ("🚗 " + description)
        }
        if (id === 10){
            return ("🛳️ " + description)
        }
        if (id === 11){
            return ("🚝 " + description)
        }
        if (id === 9){
            return ("🚉 " + description)
        }
        if (id === 7){
            return ("🏍️ " + description)
        }
        if (id === 4){
            return ("🚌 " + description)
        }
        if (id === 12){
            return ("🚲 " + description)
        }
        
        return ("🚗" + description)
    }

    getProperFoodPickerName = (id, description) =>{
        if (id === 1){
            return ("🐄 " + description)
        }
        if (id === 2){
            return ("🐐 " + description)
        }
        if (id === 3){
            return ("🧀 " + description)
        }
        if (id === 4){
            return ("🍫 " + description)
        }
        if (id === 5){
            return ("☕ " + description)
        }
        if (id === 6){
            return ("🐖 " + description)
        }
        if (id === 7){
            return ("🐄 " + description)
        }
        if (id === 8){
            return ("🌴 " + description)
        }
        if (id === 9){
            return ("🐟 " + description)
        }
        if (id === 10){
            return ("🥚 " + description)
        }
        if (id === 11){
            return ("🍚 " + description)
        }
        if (id === 12){
            return ("🍶 " + description)
        }
        if (id === 13){
            return ("🐟 " + description)
        }
        if (id === 14){
            return ("🍅 " + description)
        }
        if (id === 15){
            return ("🍌 " + description)
        }
        if (id === 16){
            return ("🍎 " + description)
        }
        if (id === 17){
            return ("🥬 " + description)
        }
        if (id === 18){
            return ("🍐 " + description)
        }
        if (id === 19 || id === 20){
            return ("🌽 " + description)
        }
        
        return ("🐄" + description)
    }

    render() {


        // const data = {
        //     labels: ['Transport', 'Food', 'Electricity', 'Recycle'],
        //     data: [ 
        //         Math.round(this.state.totalTransportCost / this.state.totalUserEnergy).toFixed(1),
        //         Math.round(this.state.totalFoodCost/ this.state.totalUserEnergy).toFixed(1),
        //         Math.round(this.state.totalElectricityCost/ this.state.totalUserEnergy).toFixed(1),
        //         Math.round(this.state.totalRecycleCost/ this.state.totalUserEnergy).toFixed(1)                 

        //         ]
                
        // }
        // console.log(data)
        const chartConfig = {
            backgroundGradientFromOpacity: 0,
            backgroundGradientTo: "#08130D",
            backgroundGradientToOpacity: 0.5,
            color: (opacity = 1) => `rgba(53, 94, 59, ${opacity})`,
            decimalPlaces: 1
        }

        const pieData = [
            {
              name: '% Transport',
              population: (this.state.totalTransportCost ),
              color: 'orange',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: '% Food',
              population: (this.state.totalFoodCost),
              color: 'red',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: '% Electricity',
              population: (this.state.totalElectricityCost),
              color: 'yellow',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: '% Recycle',
              population: (this.state.totalRecycleCost),            
              color: 'blue',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
          ];

        if(this.state.isLoading === false) {
            if (this.state.totalUserSavings <= 100){
                var explText = "Your C02 recyclings per emissions ratio is " + this.state.totalUserSavings +"%"
                var colorCycle = Colors.red
            }else{
                var explText = "Your C02 recyclings per emissions ratio is " + this.state.totalUserSavings +"%"
                var colorCycle = Colors.primaryColor
            }

            
            return (
              

                <ScrollView
                    style={{
                            flex: 1,
                            backgroundColor: (this.state.isFoodModalVisible ||  this.state.isElectricityModalVisible  || this.state.isRecycleModalVisible 
                                || this.state.isTransportModalVisible)? 'rgba(0, 0, 0, 0.4)' : 'transparent'
                        }}
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                    }
                >   
                    {  ((this.state.warningEnergy > this.state.totalUserSavings) && this.state.openWarningEnergyModal === true) &&
                        <View style = {{flexDirection:'row', backgroundColor: "orange", justifyContent: "center", alignItems: "center", alignSelf: 'flex-start'}}>
                            <View style = {{alignSelf: 'center'}}>
                                <FontAwesome name="warning" size={20} color={"white"} style={{ margin:5}}></FontAwesome>
                            </View>
                            <View style ={{flex:1, marginRight: 10}}>
                                <Text style={styles.titleWarning}> Please Recycle</Text>
                                <Text style={styles.warningText}> Your carbon / recycle ratio percentage must be more than {this.state.warningEnergy} % </Text>
                                
                            </View>
                            <View style = {{alignSelf: 'center'}}>
                                <Ionicons name="close-circle-outline" size={18} color={"white"} style={{ margin:5}} onPress = {() => {this.setState({ openWarningEnergyModal: false });}}></Ionicons>
                            </View>
                        </View>
                    }
                    <View style={styles.progressStyle}>     
                    {/* <View style={styles.infoHelp}>
                        <FontAwesome name="info" size={20} color={Colors.primaryColor} onPress={() => {this.setState({ popUpHelp: true }); }}/>
                    </View> */}
                        {/* <Text> Total: {this.state.totalUserEnergyCost} Kg CO2 </Text> */}
                        {/* <Text> {explText} </Text> */}
                        <Text></Text>
                        <TouchableOpacity onPress={() => {this.setState({ popUpHelp: true }); }}>
                            
                        <ProgressCircle
                            percent={this.state.totalUserSavings}
                            radius={95}
                            borderWidth={5}
                            color={Colors.thirdBlueColor}
                            shadowColor="#999"
                            bgColor="#fff"
                            size={160} 

                        >
                            <Text style={{ color:Colors.thirdBlueColor , fontSize: 28 }}>{this.state.totalUserSavings}%</Text>
                            <Text style={{ fontSize: 12 }}> Carbon-Recycle Ratio</Text>
                        </ProgressCircle>

                            {/* <Progress.Circle 
                                size={160} 
                                indeterminate={false} 
                                animated={true} 
                                indeterminateAnimationDuration={1000} 
                                progress={this.state.totalUserSavings/100}  
                                borderWidth={3}
                                showsText={true} 
                                direction={"clockwise"} 
                                thickness ={8} 
                                unfilledColor={'rgba(255, 255, 255, 0.2)'}
                                formatText = {()=>{
                                    return (
                                    
                                    this.state.totalUserSavings + "%"
                                    
                                    )}}
                                // unfilledColor = {colorCycle}
                                
                                > */}
                                {/* </Progress.Circle> */}
                        </TouchableOpacity>
                            {/* <Text style={{size: 5}}> CO2/Saved C02 </Text> */}
                            
                    </View>

                    {/* <PieChart
                        data={pieData}
                        width={Dimensions.get('window').width}
                        height={220}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                        /> */}

                <View style= {styles.totals}>
                    <TouchableOpacity style= {styles.Eachtotal} onPress = {() => {this.setState({ popUpTransportHelp: true }); }}>
                        <View style= {styles.Eachtotal}>
                            <Ionicons name="car" size={24} color={Colors.primaryColor} />
                            <Text style={styles.textExpl}> Transport </Text>
                            <View style = {{flexDirection: 'row'}}>
                                <Text style={styles.textNumber}> {this.state.totalTransportCost}</Text><Text style={styles.textUnit}> %</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style= {styles.Eachtotal} onPress = {() => {this.setState({ popUpFoodHelp: true }); }}>
                        <View style= {styles.Eachtotal}>
                                <Ionicons name="fast-food" size={25} color={Colors.primaryColor}  />
                                <Text style={styles.textExpl}> Food </Text>
                                <View style = {{flexDirection: 'row'}}>
                                    <Text style={styles.textNumber}> {this.state.totalFoodCost}</Text><Text style={styles.textUnit}> %</Text>
                                </View>
                        </View>
                    </TouchableOpacity>
                    
                    <TouchableOpacity style= {styles.Eachtotal} onPress = {() => {this.setState({ popUpElectricityHelp: true }); }}>
                        <View style= {styles.Eachtotal}>
                            <FontAwesome name="bolt" size={25} color={Colors.primaryColor} />
                            <Text style={styles.textExpl}> Housing</Text>
                            <View style = {{flexDirection: 'row', textAlign:'center'}}>
                                <Text style={styles.textNumber}> {this.state.totalElectricityCost}</Text>
                                <Text style={styles.textUnit}> %</Text>
                            </View>

                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style= {styles.Eachtotal} onPress = {() => {this.setState({ popUpRecycleHelp: true }); }}>

                        <View style= {styles.Eachtotal}>
                            <MaterialCommunityIcons name="recycle" size={25} color={Colors.primaryColor}/>
                            <Text style={styles.textExpl}> Recycled </Text>
                            <Text style={styles.textNumber}> {(this.state.totalRecycleCost).toFixed(1)}</Text>
                            <Text style={styles.textUnit}> (kg CO2) </Text>
                        </View>
                    </TouchableOpacity>

              </View>


                    <View style={styles.inputLabels}>
                        <TouchableOpacity    onPress={()=>this.openTransportModal()}    underlayColor="white">
                            <View style={styles.button}>
                                <View style={styles.iconsStyles}>
                                    <FontAwesome name="plus-circle" size={24} color="white" />
                                </View>
                                <Text style={styles.buttonText}> Transport Emissions</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity    onPress={()=>this.openFoodModal()}    underlayColor="white">
                            <View style={styles.button}>
                                <View style={styles.iconsStyles}>
                                    <FontAwesome name="plus-circle" size={24} color="white" />
                                </View>
                                <Text style={styles.buttonText}> Food Emissions</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity    onPress={()=>this.openElectricityModal()}    underlayColor="white">
                            <View style={styles.button}>
                                <View style={styles.iconsStyles}>
                                    <FontAwesome name="plus-circle" size={24} color="white" />
                                </View>
                                <Text style={styles.buttonText}> House Emissions </Text>
                            </View>
                        </TouchableOpacity>


                        <TouchableOpacity    onPress={()=>this.openRecycleModal()}    underlayColor="white">
                            <View style={styles.buttonRecycle}>
                                <View style={styles.iconsStyles}>
                                    <FontAwesome name="plus-circle" size={24} color="white" />
                                </View>
                                <Text style={styles.buttonText}> Recycle</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                
                    <View  style={styles.wrapper}>
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.isTransportModalVisible} 
                        onBackdropPress={() => {this.closeTransportModal()}}

                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Add Transport Emission </Text>
                                        <Text></Text>
                                        <Text style = {styles.text}>Choose Transportation: </Text>
                                        <View style={styles.picker}>
                                            <Picker 
                                                selectedValue = {this.state.transportStr} 
                                                onValueChange = {this.updateTransport} 
                                                prompt='Choose Transport'
                                                >
                                                    {this.state.transportData.map((transports, id) => {
                                                        return <Picker.Item 
                                                            value={transports.id} 
                                                            label={this.getProperTransportPickerName(transports.id, transports.description)}
                                                            key={transports.id}    /> 
                                                            }
                                                        )}
                                            </Picker>     
                                        </View>
                                        <Text></Text>
                                        <Text style = {styles.text}>Add Kilometers: {this.state.userCost}</Text>     
                            
                                        <Slider
                                            value={this.state.userCost}
                                            onValueChange={this.updateCost}
                                            maximumValue={1000}
                                            minimumValue={1}
                                            step={1}
                                            trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                                            thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                                        /> 
                                        <Text></Text>
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeTransportModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.insertEnergy()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </Modal>







                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.isFoodModalVisible} 
                            onBackdropPress={() => {this.closeFoodModal()}}

                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Add Food Emission </Text>
                                        <Text></Text>
                                        <Text style = {styles.text}>Choose Food: </Text>
                                        <View style={styles.picker}>
                                            <Picker selectedValue = {this.state.foodStr} 
                                                    onValueChange = {this.updateFood} 
                                                    prompt='Choose Food'
                                                >
                                                        {this.state.foodData.map((foods, id) => {
                                                            return <Picker.Item 
                                                                value={foods.id} 
                                                                label={this.getProperFoodPickerName(foods.id, foods.description)}
                                                                key={foods.id}    /> 
                                                                
                                                                }
                                                                )}
                                            </Picker>  
                                        </View>
                                        <Text></Text>
                                        <Text style = {styles.text}>Add Kilograms: {(this.state.userCost).toFixed(1)}</Text>  
                                        
                                        <Slider
                                            value={this.state.userCost}
                                            onValueChange={this.updateCost}
                                            maximumValue={10}
                                            minimumValue={0.1}
                                            step={0.1}
                                            trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                                            thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                                        /> 
                                        <Text></Text>
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeFoodModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.insertEnergy()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                            </View>
                        </Modal>






                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.isRecycleModalVisible} 
                            onBackdropPress={() => {this.closeRecycleModal()}}

                            >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Recycling </Text>
                                        <Text></Text>
                                        <Text style = {styles.text}>Choose Recycled Object: </Text>
                                        <View style={styles.picker}>
                                            <Picker selectedValue = {this.state.recycleStr} 
                                                    onValueChange = {this.updateRecycled}
                                                    mode = "dialog"
                                                    prompt='Choose Recycled Object'
 
                                                    placeholder={{
                                                        label: 'Select a color...',
                                                        value: null,
                                                    }}
                                                >
                                                        {this.state.recycledData.map((recycled, id) => {
                                                            return <Picker.Item 
                                                                value={recycled.id} 
                                                                label={this.getProperRecyclePickerName(recycled.id, recycled.description)}
                                                                key={recycled.id}    /> 
                                                                
                                                                }
                                                        )}
                                            </Picker>  
                                        </View>
                                        <Text></Text>
                                        <Text style = {styles.text}>Recycled Kilograms: {(this.state.userCost).toFixed(1)}</Text>

                                        <Slider
                                            value={this.state.userCost}
                                            onValueChange={this.updateCost}
                                            maximumValue={10}
                                            minimumValue={0.1}
                                            step={0.1}
                                            trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                                            thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                                        /> 
                                        <Text></Text>      
                            
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeRecycleModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.insertEnergy()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                            </View>
                        </Modal>





                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.isElectricityModalVisible} 
                            onBackdropPress={() => {this.closeElectricityModal()}}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Add Electricity Emission </Text>
                                        <Text></Text>
                                        <Text style = {styles.text}>Choose Electricity Object: </Text>
                                        <View style={styles.picker}>
                                            <Picker selectedValue = {this.state.electricityStr} 
                                                    onValueChange = {this.updateElectricity} 
                                                    mode = "dialog"
                                                    prompt='Choose Housing Emissions'

                                                >
                                                        {this.state.electricityData.map((electricity, id) => {
                                                            return <Picker.Item 
                                                                value={electricity.id} 
                                                                label={this.getProperElectricityPickerName(electricity.id, electricity.description)}
                                                                key={electricity.id}    /> 
                                                                
                                                                }
                                                                )}
                                            </Picker>  
                                        </View>
                                        <Text></Text>
                                        <Text style = {styles.text}>How Many KWh: {this.state.userCost}</Text>

                                        <Slider
                                            value={this.state.userCost}
                                            onValueChange={this.updateCost}
                                            maximumValue={1000}
                                            minimumValue={1}
                                            step={1}
                                            trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                                            thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                                        /> 
                                        <Text></Text>      
                            
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeElectricityModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.insertEnergy()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                            </View>
                        </Modal>
                        </View>


                        <Dialog
                            visible={this.state.popUpHelp}
                            style={styles.dialogView}
                                onTouchOutside={() => {
                                    this.setState({ popUpHelp: false });
                                }}
                            >
                            <DialogContent>
                                    <FontAwesome name="info" size={35} color={Colors.primaryColor} style={{alignSelf: 'center', margin:20}} ></FontAwesome>
                                    <Text style={styles.text}>Total carbon emissions are: {this.state.totalUserEnergyCost} kg CO2 </Text>
                                    <Text style={styles.text}>Total saved kg of C02 because of recycling are: {this.state.totalUserEnergyRecycle} kg CO2 </Text>
                                    <Text style={styles.text}>{explText}</Text>

                                </DialogContent>
                        </Dialog>


                        <Dialog
                            style={styles.dialogView}
                            visible={this.state.popUpFoodHelp}
                                onTouchOutside={() => {
                                    this.setState({ popUpFoodHelp: false });
                                }}
                            >
                                <DialogContent>
                                    <FontAwesome name="info" size={35} color={Colors.primaryColor} style={{alignSelf: 'center', margin:20}}></FontAwesome>
                                    <Text style={styles.text}>Food's carbon footprint, or foodprint, is the greenhouse gas emissions produced by growing, rearing, 
                                        farming, processing, transporting, storing, cooking and disposing of the food you eat </Text>
                                </DialogContent>

                        </Dialog>

                        <Dialog
                            style={styles.dialogView}
                            visible={this.state.popUpRecycleHelp}
                                onTouchOutside={() => {
                                    this.setState({ popUpRecycleHelp: false });
                                }}
                            >
                                <DialogContent>
                                    <FontAwesome name="info" size={35} color={Colors.primaryColor} style={{alignSelf: 'center', margin:20}}></FontAwesome>
                                    <Text style={styles.text}>Recycling causes certain carbon emissions by itself, from the fuel used by collection trucks, to the energy taken to treat the waste. Thus, recycling is only beneficial in tackling climate change if the process emits less greenhouse gas than would otherwise be emitted.
                                     This means that net emission savings will be different for different types of waste. </Text>
                                </DialogContent>

                        </Dialog>

                        <Dialog
                            style={styles.dialogView}
                            visible={this.state.popUpElectricityHelp}
                                onTouchOutside={() => {
                                    this.setState({ popUpElectricityHelp: false });
                                }}
                            >
                                <DialogContent>
                                    <FontAwesome name="info" size={35} color={Colors.primaryColor} style={{alignSelf: 'center', margin:20}}></FontAwesome>
                                    <Text style={styles.text}>In order to accurately calculate the CO2 emissions of one's home, one must calculate all the activities that are done daily 
                                        for heating and lighting, for cooking and for recreational activities, etc.
                                    </Text>
                                </DialogContent>

                        </Dialog>

                        <Dialog
                            style={styles.dialogView}
                            visible={this.state.popUpTransportHelp}
                                onTouchOutside={() => {
                                    this.setState({ popUpTransportHelp: false });
                                }}
                            >
                                <DialogContent>
                                    <FontAwesome name="info" size={35} color={Colors.primaryColor} style={{alignSelf: 'center', margin:20}}></FontAwesome>
                                    <Text style={styles.text}>The carbon footprint of the trip is measured in grams of carbon dioxide equivalent per kilometer of passenger. 
                                    This includes carbon dioxide, but also other greenhouse gases, and increased heating by air emissions at altitude </Text>
                                </DialogContent>

                        </Dialog>

                        <Dialog
                            style={styles.dialogView}
                            visible={(this.state.savedEnergyInfo)}
                            onTouchOutside={() => {
                                this.setState({ savedEnergyInfo: false });
                            }}
                        >
                            <DialogContent>
                                    <FontAwesome name="check-circle" size={35} color={"green"} style={{alignSelf: 'center', margin:15}}></FontAwesome>
                                    <View style= {{alignItems: 'center', justifyContent: 'center'}}>
                                        <Text style={styles.title}>Action Saved </Text>
                                        <Text style={styles.text}>Your action is equivalent of {this.state.savedEnergyMessage}.  </Text>
                                    </View>
                            </DialogContent>

                    </Dialog>

                </ScrollView>

            )
        }
        else{
            return(  
                <View style={{ flex: 1,justifyContent: "center"}}>
                    <ActivityIndicator size="large" color= {Colors.primaryColor} />
                </View>)
        }
    }
}

CategoriesScreen.navigationOptions = navData => {
    return {
        headerTitle: 'My Energy',
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

    title:{
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold'
    },
    titleWarning:{
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white'

    },
    warningText:{
        textAlign: 'center',
        fontSize: 12,
        color: 'white'

    },
    hintText:{
        textAlign: 'center',
        fontSize: 5
    },
    textUnit:{
        textAlign: 'center',
        fontSize: 12,
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    },
    textNumber:{
        textAlign: 'center',
        fontSize: 15
    },
    textExpl:{
        textAlign: 'center',
        fontSize: 12
    },
    wrapper: {
        backgroundColor:'rgba(255,255,255,0.5)'
      },
    input: {
        marginBottom: 15,
        height: 50,
        borderColor: 'black',
        textAlign: 'center',
        borderWidth: 1,
        justifyContent: 'center'
    },
    picker: {
        borderColor: 'black', 
        borderWidth: 1 ,
        height: 50,
        textAlign: 'center',
        color: 'black'
    },
    inputLabels:{
        justifyContent: 'flex-start'
    },
    submitButton: {
            backgroundColor: Colors.primaryColor,
            padding: 10,
            margin: 15,
            height: 40,
    },
    iconsStyles:{
        justifyContent: 'flex-start',
        alignItems: 'flex-start'
    },
    submitButtonText:{
            color: 'white'
    },

    button: {

        display: 'flex',
        flexDirection: 'row',
        height: 60,
        borderRadius: 6,
        marginBottom: 13, 
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
        backgroundColor: Colors.primaryColor
    },


    buttonRecycle: {

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

    progressStyle: {
        display: 'flex',
        flex: 1,
        alignItems: 'center',
        textAlign: 'center'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
        },

    dialogView: {
        margin: 1,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5
    },
    totals:{
        marginBottom: 5,
        marginTop: 10,

        // textAlign: 'center',
        // backgroundColor: '#6ED4C8',
        
        flexDirection: 'row',
        // alignItems: 'stretch',
        alignSelf: 'center',
        // justifyContent: 'center'
    },
    infoStyle:{
        flexDirection: 'row'
    },
    Eachtotal:{
        flex:1,
        textAlign: 'center',
        alignSelf: 'center',
        alignItems: 'center',
        // justifyContent: 'center'
    },
    infoHelp:{
        padding:10
    }

});

export default withNavigationFocus(CategoriesScreen);
