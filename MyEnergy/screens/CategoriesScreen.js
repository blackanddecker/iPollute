import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    Picker,
    Button,
    TouchableOpacity,
    ScrollView,
    RefreshControl,
    NumberInput
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Modal from 'react-native-modal';
// import Icon from 'react-native-ionicons'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Icon } from 'react-native-elements';

import { Dimensions } from 'react-native';

import HeaderButton from '../components/HeaderButton';
import Colors from '../constants/Colors';
import { format } from "date-fns";

import BaseUrl from '../constants/Url';
import AsyncStorage from '@react-native-community/async-storage'

import {
    ProgressChart, PieChart
} from 'react-native-chart-kit'

class CategoriesScreen extends Component {
    constructor(){
        super();
            this.forceUpdateHandler = this.forceUpdateHandler.bind(this);
      };
    state = {
        userId: -1,
        //insert energy variables

        energyTypeId: 0,
        userCost:'',
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
        totalUserEnergy:1,
        
        // modal variables
        isTransportLoading: true,
        isFoodLoading: true,
        isDisabled: true,
        isTransportModalVisible: false,
        isFoodModalVisible: false,
        isRecycleModalVisible:false,
        isElectricityModalVisible:false,
        refreshing: false,
        appliedFilters:""
    }
    
    _onRefresh = () => {
        this.setState({refreshing: true});
        this.fetchData(this.state.userId, this.state.appliedFilters)
        this.setState({refreshing: false});
     }


    fetchData = (userId, appliedFilters) => {

        fetch(BaseUrl+'getEnergyObjects', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId:userId,
                appliedFilters: appliedFilters
            }),
            method: 'POST'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            var transportData = []
            var foodData = []
            var electricityData = []
            var recycledData = []
            //console.log(responseJson);
            for (const key in responseJson['transportObjects']){
                // console.log("key:",responseJson['transportObjects'][key])
                transportData.push(responseJson['transportObjects'][key])
            }
            for (const key in responseJson['foodObjects']){
                foodData.push(responseJson['foodObjects'][key])
            }
            for (const key in responseJson['recycledObjects']){
                recycledData.push(responseJson['recycledObjects'][key])
            }
            for (const key in responseJson['electricityObjects']){
                electricityData.push(responseJson['electricityObjects'][key])
            }
            this.setState({recycleStr:1, electricityStr:1, foodStr:1, transportStr:1})
            this.setState({transportData:transportData, foodData:foodData, electricityData:electricityData, recycledData:recycledData})
            this.setState({isTransportLoading: !this.state.isTransportLoading, isFoodLoading: !this.state.isFoodLoading  })
        })
        .catch((error) => {
            console.error(error);
            alert("Transport data didnt fetch");
            
        });
        
        
        fetch(BaseUrl+'getUserEnergy', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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
                    totalUserEnergy: responseJson['userEnergy']['totalUserEnergy'] ,
                    totalFoodCost: responseJson['userEnergy']['totalFoodCost'],
                    totalRecycleCost: responseJson['userEnergy']['totalRecycleCost'],
                    totalElectricityCost: responseJson['userEnergy']['totalElectricityCost']})

            }
            else{
                alert("User Energy didnt fetch");
            }
            
        })
        .catch((error) => {
            console.error(error);
            alert("User Energy didnt fetch");
            
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
            this.fetchData(this.state.userId, this.state.appliedFilters)
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
        var curDate = new Date()
        
        var formattedDate = format(curDate, 'yyyy-MM-dd HH:mm:ss');
        console.log("InserEnergy:", "Type", this.state.energyTypeId,"Item", this.state.energyItemId,  "User:", this.state.userId)
        fetch(BaseUrl+'insertEnergy', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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
                alert(responseJson['message']);
                this.closeTransportModal()
                this.closeFoodModal()
                this.closeRecycleModal()
                this.closeElectricityModal()

                this.fetchData(this.state.userId, this.state.appliedFilters)

                
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
    
    openTransportModal = () =>{this.setState({isTransportModalVisible:true, energyItemId:1, energyTypeId: 1 })}
    toggleTransportModal = () =>{this.setState({isTransportModalVisible:!this.state.isTransportModalVisible})}
    closeTransportModal = () =>{this.setState({isTransportModalVisible:false})}
    
    openFoodModal = () =>{this.setState({isFoodModalVisible:true, energyItemId:1, energyTypeId: 0 })}
    toggleFoodModal = () =>{this.setState({isFoodModalVisible:!this.state.isFoodModalVisible})}
    closeFoodModal = () =>{this.setState({isFoodModalVisible:false})}
    
    
    openRecycleModal = () =>{this.setState({isRecycleModalVisible:true, energyItemId:1, energyTypeId: 2 })}
    toggleRecycleModal = () =>{this.setState({isRecycleModalVisible:!this.state.isRecycleModalVisible})}
    closeRecycleModal = () =>{this.setState({isRecycleModalVisible:false})}

    openElectricityModal = () =>{this.setState({isElectricityModalVisible:true, energyItemId:1, energyTypeId: 3})}
    toggleElectricityModal = () =>{this.setState({isElectricityModalVisible:!this.state.isElectricityModalVisible})}
    closeElectricityModal = () =>{this.setState({isElectricityModalVisible:false})}


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
              name: 'Transport',
              population: (this.state.totalTransportCost / this.state.totalUserEnergy),
              color: 'orange',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Food',
              population: (this.state.totalFoodCost/ this.state.totalUserEnergy),
              color: 'red',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Electricity',
              population: (this.state.totalElectricityCost/ this.state.totalUserEnergy),
              color: 'yellow',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
            {
              name: 'Recycle',
              population: (this.state.totalRecycleCost/ this.state.totalUserEnergy),            
              color: 'blue',
              legendFontColor: '#7F7F7F',
              legendFontSize: 15,
            },
          ];

        if(!this.state.loading) {
            return (
              

                <ScrollView
                    style={styles.centeredView}
                    refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh}
                    />
                    }
                >
                    <PieChart
                        data={pieData}
                        width={Dimensions.get('window').width}
                        height={220}
                        chartConfig={chartConfig}
                        accessor="population"
                        backgroundColor="transparent"
                        paddingLeft="15"
                        absolute
                        />

                    <View style={styles.inputLabels}>
                        <Text> </Text>
                        <TouchableOpacity    onPress={()=>this.openTransportModal()}    underlayColor="white">
                            <View style={styles.button}>
                                <View style={styles.iconsStyles}>
                                    <FontAwesome name="plus-circle" size={24} color="white" />
                                </View>
                                <Text style={styles.buttonText}> Transport Emission</Text>
                            </View>
                        </TouchableOpacity>
                        <Text> </Text>
                        <TouchableOpacity    onPress={()=>this.openFoodModal()}    underlayColor="white">
                            <View style={styles.button}>
                                <View style={styles.iconsStyles}>
                                    <FontAwesome name="plus-circle" size={24} color="white" />
                                </View>
                                <Text style={styles.buttonText}> Food Emission</Text>
                            </View>
                        </TouchableOpacity>
                        <Text> </Text>

                        <TouchableOpacity    onPress={()=>this.openElectricityModal()}    underlayColor="white">
                            <View style={styles.button}>
                                <View style={styles.iconsStyles}>
                                    <FontAwesome name="plus-circle" size={24} color="white" />
                                </View>
                                <Text style={styles.buttonText}> Electricity </Text>
                            </View>
                        </TouchableOpacity>

                        <Text> </Text>

                        <TouchableOpacity    onPress={()=>this.openRecycleModal()}    underlayColor="white">
                            <View style={styles.buttonRecycle}>
                                <View style={styles.iconsStyles}>
                                    <FontAwesome name="plus-circle" size={24} color="white" />
                                </View>
                                <Text style={styles.buttonText}> Recycle</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                
                
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.isTransportModalVisible} 
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Add Transport Emission </Text>
                                        <Text></Text>
                                        <Text style = {styles.text}>Choose Transportation: </Text>
                                        <View style={styles.picker}>
                                            <Picker selectedValue = {this.state.transportStr} 
                                                onValueChange = {this.updateTransport} 
                                                >
                                                    {this.state.transportData.map((transports, id) => {
                                                        return <Picker.Item 
                                                            value={transports.id} 
                                                            label={transports.description}
                                                            key={transports.id}    /> 
                                                            }
                                                        )}
                                            </Picker>     
                                        </View>
                                        <Text></Text>
                                        <Text style = {styles.text}>Add Kilometers done: </Text>
                                        <TextInput style = {styles.input}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "0.0"
                                            keyboardType={'number-pad'}
                                            onChangeText = {this.updateCost}/>         
                            
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeTransportModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.insertEnergy()}>
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
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Add Food Emission </Text>
                                        <Text></Text>
                                        <Text style = {styles.text}>Choose Food: </Text>
                                        <View style={styles.picker}>
                                            <Picker selectedValue = {this.state.foodStr} 
                                                    onValueChange = {this.updateFood} 
                                                >
                                                        {this.state.foodData.map((foods, id) => {
                                                            return <Picker.Item 
                                                                value={foods.id} 
                                                                label={foods.description}
                                                                key={foods.id}    /> 
                                                                
                                                                }
                                                                )}
                                            </Picker>  
                                        </View>
                                        <Text></Text>
                                        <Text style = {styles.text}>Add Kilograms of Food: </Text>

                                        <TextInput style = {styles.input}
                                            underlineColorAndroid = "transparent"
                                            keyboardType = 'decimal-pad'
                                            placeholder = "0.0"
                                            placeholderTextColor = "black"
                                            maxLength={10}
                                            onChangeText = {this.updateCost}/>         
                            
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeFoodModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.insertEnergy()}>
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
                            >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Recycling </Text>
                                        <Text></Text>
                                        <Text style = {styles.text}>Choose Recycled Object: </Text>
                                        <View style={styles.picker}>
                                            <Picker selectedValue = {this.state.recycleStr} 
                                                    onValueChange = {this.updateRecycled} 
                                                    placeholder={{
                                                        label: 'Select a color...',
                                                        value: null,
                                                    }}
                                                >
                                                        {this.state.recycledData.map((recycled, id) => {
                                                            return <Picker.Item 
                                                                value={recycled.id} 
                                                                label={recycled.description + ","+ recycled.id }
                                                                key={recycled.id}    /> 
                                                                
                                                                }
                                                        )}
                                            </Picker>  
                                        </View>
                                        <Text></Text>
                                        <Text style = {styles.text}>How Many: </Text>

                                        <TextInput style = {styles.input}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "0.0"
                                            placeholderTextColor = "black"
                                            keyboardType = 'numeric'
                                            onChangeText = {this.updateCost}/>         
                            
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeRecycleModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.insertEnergy()}>
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
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Add Electricity Emission </Text>
                                        <Text></Text>
                                        <Text style = {styles.text}>Choose Electricity Object: </Text>
                                        <View style={styles.picker}>
                                            <Picker selectedValue = {this.state.electricityStr} 
                                                    onValueChange = {this.updateElectricity} 
                                                >
                                                        {this.state.electricityData.map((electricity, id) => {
                                                            return <Picker.Item 
                                                                value={electricity.id} 
                                                                label={electricity.description}
                                                                key={electricity.id}    /> 
                                                                
                                                                }
                                                                )}
                                            </Picker>  
                                        </View>
                                        <Text></Text>
                                        <Text style = {styles.text}>How Many: </Text>

                                        <TextInput style = {styles.input}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "0.0"
                                            placeholderTextColor = "black"
                                            autoCapitalize = "none"
                                            onChangeText = {this.updateCost}/>         
                            
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeElectricityModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.insertEnergy()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                                
                            </View>
                        </Modal>


                </ScrollView>

            )
        }
        else{
            return(<ActivityIndicator size={"large"} ></ActivityIndicator>)
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
        justifyContent: 'flex-start',
        padding: 10
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
        backgroundColor:    Colors.primaryColor
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
    centeredView: {
        flex: 1,
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

});

export default CategoriesScreen;