import React, { Component } from 'react'
import {
    View,
    Text,
    TextInput,
    ActivityIndicator,
    StyleSheet,
    Picker,
    Button,
    TouchableOpacity
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

    state = {
        userId: -1,
        //insert energy variables
        energyTypeId: '',
        userCost:'',
        energyItemId:'',
        
        // energy variables
        transportData: [],
        foodData: [],
        electricityData: [],
        recycleData : [],

        // pie chart variables
        totalFoodCost : 0,
        totalTransportCost: 0, 
        totalUserEnergy:10000,
        
        // modal variables
        isTransportLoading: true,
        isFoodLoading: true,
        isDisabled: true,
        isTransportModalVisible: false,
        isFoodModalVisible: false,
        isRecycleModalVisible:false,
        isElectricityModalVisible:false

    }
    
    
    componentDidMount = () => {

        // const { navigation } = this.props;
        // this.setState({ userId: navigation.getParam('userId', '-1') });

        fetch(BaseUrl+'getTransportObjects', {
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
            this.setState({isTransportLoading: !this.state.isTransportLoading })
        })
        .catch((error) => {
            console.error(error);
            alert("Transport data didnt fetch");
            
        });
        
        fetch(BaseUrl+'getFoodObjects', {
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
            for (const key in responseJson['foodObjects']){
                // console.log("key:",responseJson['transportObjects'][key])
                this.state.foodData.push(responseJson['foodObjects'][key])
            }
            this.setState({isFoodLoading: !this.state.isFoodLoading })
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
                this.setState({totalTransportCost: responseJson['userEnergy']['totalTransportCost']})
                this.setState({totalFoodCost: responseJson['userEnergy']['totalFoodCost']})
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
    
    updateTransport = (transport) => {this.setState({ energyTypeId: 1, energyItemId: transport })}
    updateFood = (food) => {this.setState({ energyTypeId: 0, energyItemId: food })}
    updateCost = (cost) => {this.setState({ userCost32: cost })}
    
    openTransportModal = () =>{this.setState({isTransportModalVisible:true})}
    toggleTransportModal = () =>{this.setState({isTransportModalVisible:!this.state.isTransportModalVisible})}
    closeTransportModal = () =>{this.setState({isTransportModalVisible:false})}
    
    openFoodModal = () =>{this.setState({isFoodModalVisible:true})}
    toggleFoodModal = () =>{this.setState({isFoodModalVisible:!this.state.isFoodModalVisible})}
    closeFoodModal = () =>{this.setState({isFoodModalVisible:false})}
    
    
    openRecycleModal = () =>{this.setState({isRecycleModalVisible:true})}
    toggleRecycleModal = () =>{this.setState({isRecycleModalVisible:!this.state.isRecycleModalVisible})}
    closeRecycleModal = () =>{this.setState({isFoodModalVisible:false})}


    render() {


        const data = {
            labels: ['Transport', 'Food', 'Total'],
            data: [ this.state.totalTransportCost / this.state.totalUserEnergy, this.state.totalFoodCost/ this.state.totalUserEnergy, 1 ]
        }
        console.log("Pie Chart data:", data)
        const chartConfig = {
            backgroundGradientFrom: '#1E2923',
            backgroundGradientTo: '#08130D',
            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`
        }
        
        
        if(!this.state.loading) {
            return (
                <View style={styles.centeredView}>
                    <ProgressChart
                    data={data}
                    width={360}
                    height={220}
                    chartConfig={chartConfig}
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

                        <TouchableOpacity    onPress={()=>this.openHouseModal()}    underlayColor="white">
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
                                        <Picker selectedValue = {this.state.transport} 
                                            onValueChange = {this.updateTransport} 
                                            style = {styles.input}>
                                                {this.state.transportData.map((transports, id) => {
                                                    return <Picker.Item 
                                                        value={transports.id} 
                                                        label={transports.description}
                                                        key={transports.id}    /> 
                                                        }
                                                    )}
                                        </Picker>     
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
                                        <Text style = {styles.text}>Choose Food </Text>

                                        <Picker selectedValue = {this.state.food} 
                                                onValueChange = {this.updateFood} 
                                                style = {styles.input}>
                                                    {this.state.foodData.map((foods, id) => {
                                                        return <Picker.Item 
                                                            value={foods.id} 
                                                            label={foods.description}
                                                            key={foods.id}    /> 
                                                            
                                                            }
                                                            )}
                                        </Picker>  
                                        <Text style = {styles.text}>Add Kilograms of Food: </Text>
                                        <TextInput style = {styles.input}
                                            underlineColorAndroid = "transparent"
                                            placeholder = "0.0 km"
                                            placeholderTextColor = {Colors.primaryColor}
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















                   {/*  <Modal animationIn="slideInUp" 
                            animationOut="slideOutDown" 
                            onBackdropPress={()=>this.closeFoodModal()}
                            onSwipeComplete={()=>this.closeFoodModal()} 
                            swipeDirection="right" 
                            isVisible={this.state.isFoodModalVisible} 
                            width="90%"
                            max-height="40%"
                            style={{backgroundColor:'white'}}>
                        <View style={styles.modalView}>           
                            <Text style = {styles.title}>Add Food Emission </Text>

                            <Text style = {styles.text}>Choose Food </Text>

                            <Picker selectedValue = {this.state.food} 
                                    onValueChange = {this.updateFood} 
                                    style = {styles.input}>
                                        {this.state.foodData.map((foods, id) => {
                                            return <Picker.Item 
                                                value={foods.id} 
                                                label={foods.description}
                                                key={foods.id}    /> 
                                                
                                                }
                                                )}
                            </Picker>

                            <Text style = {styles.text}>Add Kg  </Text>

                            <TextInput style = {styles.input}
                                underlineColorAndroid = "transparent"
                                placeholder = "0.0 kg"
                                placeholderTextColor = {Colors.primaryColor}
                                autoCapitalize = "none"
                                onChangeText = {this.updateCost}/>         

                                <View style={{ flex: 1,justifyContent:'center',position:'absolute',bottom:0}}>
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

                    <Modal animationIn="slideInUp" 
                            animationOut="slideOutDown" 
                            onBackdropPress={()=>this.closeRecycleModal()}
                            onSwipeComplete={()=>this.closeRecycleModal()} 
                            swipeDirection="right" 
                            isVisible={this.state.isRecycleModalVisible} 
                            width="90%"
                            max-height="40%"
                            style={{backgroundColor:'white'}}>

                    <View style={styles.modalView}>           
                        <Text style = {styles.title}>Choose Recycling Type: </Text>
                        
                        <Picker selectedValue = {this.state.food} 
                                onValueChange = {this.updateFood} 
                                style = {styles.input}>
                                    {this.state.foodData.map((foods, id) => {
                                        return <Picker.Item 
                                            value={foods.id} 
                                            label={foods.description}
                                            key={foods.id}    /> 
                                            
                                            }
                                            )}
                        </Picker>


                        <TextInput style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "0.0 km"
                            placeholderTextColor = {Colors.primaryColor}
                            autoCapitalize = "none"
                            onChangeText = {this.updateCost}/>         
                    </View>
                    
                    
                    <View style={{ flex: 1,justifyContent:'center',position:'absolute',bottom:0}}>
                            <View style={{flexDirection:'row',}}>
                                <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeRecycleModal()}>
                                    <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.insertEnergy()}>
                                    <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </View> */}

















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
            margin: 15,
            height: 30,
            borderColor: Colors.primaryColor,
            borderColor: 'black', 
            borderWidth: 1 ,
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
