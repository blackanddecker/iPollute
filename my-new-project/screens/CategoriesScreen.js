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
    RefreshControl
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import Modal from 'react-native-modal';
import { Ionicons } from '@expo/vector-icons'; 
import HeaderButton from '../components/HeaderButton';
import Colors from '../constants/Colors';
import { format } from "date-fns";

import BaseUrl from '../constants/Url';

import {
    PieChart,
    ProgressChart
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
        energyItemId:1,
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
        refreshing: false
    }
    
    _onRefresh = () => {
        this.setState({refreshing: true});
        fetchData().then(() => {
          this.setState({refreshing: false});
        });
      }


    fetchData = () => {


        // const { navigation } = this.props;
        // this.setState({ userId: navigation.getParam('userId', '-1') });

        fetch(BaseUrl+'getEnergyObjects', {
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
            for (const key in responseJson['transportObjects']){
                // console.log("key:",responseJson['transportObjects'][key])
                this.state.transportData.push(responseJson['transportObjects'][key])
            }
            for (const key in responseJson['foodObjects']){
                this.state.foodData.push(responseJson['foodObjects'][key])
            }
            for (const key in responseJson['recycledObjects']){
                this.state.recycledData.push(responseJson['recycledObjects'][key])
            }
            for (const key in responseJson['electricityObjects']){
                this.state.electricityData.push(responseJson['electricityObjects'][key])
            }
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
                userId:1
            }),
            method: 'POST'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            console.log("getUserEnergy:",responseJson);
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
        this.fetchData()
        
    }
    
    forceUpdateHandler(){
        this.forceUpdate();
      };

    insertEnergy = () => {
        var curDate = new Date()
        
        var formattedDate = format(curDate, 'yyyy-MM-dd HH:mm:ss');
        console.log("insert energy:", this.state)
        fetch(BaseUrl+'insertEnergy', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({
                userId: 1,
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

                this.fetchData()

                
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
    
    updateElectricity = (electricity) => {this.setState({ energyTypeId: 3, energyItemId: electricity , electricityStr: electricity})}
    updateRecycled = (recycle) => {this.setState({ energyTypeId: 2, energyItemId: recycle , recycleStr: recycle})}
    updateTransport = (transport) => {this.setState({ energyTypeId: 1, energyItemId: transport , transportStr: transport})}
    updateFood = (food) => {this.setState({ energyTypeId: 0, energyItemId: food, foodStr:food })}
    updateCost = (cost) => {this.setState({ userCost: cost })}
    
    openTransportModal = () =>{this.setState({isTransportModalVisible:true})}
    toggleTransportModal = () =>{this.setState({isTransportModalVisible:!this.state.isTransportModalVisible})}
    closeTransportModal = () =>{this.setState({isTransportModalVisible:false})}
    
    openFoodModal = () =>{this.setState({isFoodModalVisible:true})}
    toggleFoodModal = () =>{this.setState({isFoodModalVisible:!this.state.isFoodModalVisible})}
    closeFoodModal = () =>{this.setState({isFoodModalVisible:false})}
    
    
    openRecycleModal = () =>{this.setState({isRecycleModalVisible:true})}
    toggleRecycleModal = () =>{this.setState({isRecycleModalVisible:!this.state.isRecycleModalVisible})}
    closeRecycleModal = () =>{this.setState({isRecycleModalVisible:false})}

    openElectricityModal = () =>{this.setState({isElectricityModalVisible:true})}
    toggleElectricityModal = () =>{this.setState({isElectricityModalVisible:!this.state.isElectricityModalVisible})}
    closeElectricityModal = () =>{this.setState({isElectricityModalVisible:false})}


    render() {


        const data = {
            labels: ['Transport', 'Food', 'Electricity', 'Recycle'],
            data: [ 
                this.state.totalTransportCost / this.state.totalUserEnergy,
                this.state.totalFoodCost/ this.state.totalUserEnergy,
                this.state.totalElectricityCost/ this.state.totalUserEnergy,
                this.state.totalRecycleCost/ this.state.totalUserEnergy                 

                ]
                
        }
        console.log("Pie Chart data:", data)
        const chartConfig = {
            backgroundGradientFrom: '#1E2923',
            backgroundGradientTo: '#08130D',
            decimalPlaces: 1,
            color: (opacity = 0.8) => `rgba(26, 255, 146, ${opacity})`
        }
        
        
        if(!this.state.loading) {
            return (
              

                <View style={styles.centeredView}>
                    <ScrollView
                        refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                        }
    
                    />

                    <ProgressChart
                    data={data}
                    width={350}
                    height={220}
                    chartConfig={chartConfig}
                    style={{
                        marginVertical: 8,
                        borderRadius: 12,
                    }}
                    />


                    <View style={styles.inputLabels}>
                        <Text> </Text>
                        <TouchableOpacity    onPress={()=>this.openTransportModal()}    underlayColor="white">
                            <View style={styles.button}>
                                <View style={styles.iconsStyles}>
                                    <Ionicons name="ios-add-circle-outline" size={24} color="white" />
                                </View>
                                <Text style={styles.buttonText}> Transport Emission</Text>
                            </View>
                        </TouchableOpacity>
                        <Text> </Text>
                        <TouchableOpacity    onPress={()=>this.openFoodModal()}    underlayColor="white">
                            <View style={styles.button}>
                                <View style={styles.iconsStyles}>
                                    <Ionicons name="ios-add-circle-outline" size={24} color="white" />
                                </View>
                                <Text style={styles.buttonText}> Food Emission</Text>
                            </View>
                        </TouchableOpacity>
                        <Text> </Text>

                        <TouchableOpacity    onPress={()=>this.openElectricityModal()}    underlayColor="white">
                            <View style={styles.button}>
                                <View style={styles.iconsStyles}>
                                    <Ionicons name="ios-add-circle-outline" size={24} color="white" />
                                </View>
                                <Text style={styles.buttonText}> Electricity </Text>
                            </View>
                        </TouchableOpacity>

                        <Text> </Text>

                        <TouchableOpacity    onPress={()=>this.openRecycleModal()}    underlayColor="white">
                            <View style={styles.buttonRecycle}>
                                <View style={styles.iconsStyles}>
                                    <Ionicons name="ios-add-circle-outline" size={24} color="white" />
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
                                            autoCapitalize = "none"
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
                                            placeholder = "0.0"
                                            placeholderTextColor = "black"
                                            autoCapitalize = "none"
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
                                                >
                                                        {this.state.recycledData.map((recycled, id) => {
                                                            return <Picker.Item 
                                                                value={recycled.id} 
                                                                label={recycled.description}
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
                                            autoCapitalize = "none"
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


                </View>

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
        buttonText: {
            textAlign: 'center',
            padding: 20,
            color: 'white'
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
            justifyContent: "center",
            marginTop: 22
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
