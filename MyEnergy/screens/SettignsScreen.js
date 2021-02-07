import React, { Component } from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { View, Text, TextInput, StyleSheet, TouchableOpacity,  SafeAreaView, ScrollView, Picker, ActivityIndicator} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderButton from '../components/HeaderButton';
import Colors from '../constants/Colors';
import Modal from 'react-native-modal';
import BaseUrl from '../constants/Url';
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements';
import Password from "../components/PasswordTextBox";
import base64 from 'react-native-base64'
import { Slider } from 'react-native-elements';

class SettingsScreen extends Component {
    constructor(props){
        super(props);
 
        console.log('passed params: ', props.navigation.state.userId)
 
     }
    state = {
        userId: -1,

        userIdInit: '',
        emailInit: '',
        usernameInit: '',
        userEnergyInit: '',
        passwordInit: '',
        passwordRepeat: '',
        favFoodInit: '',
        favTransportInit: '',
        username : '',
        email: '',
        userEnergy: 0,
        isLoading: true,
        password:'',
        passwordRepeat: '',
        foodStr: '',
        favFood: '',
        transportStr: '',
        favTransport: '',
        foodData : [],
        transportData: [],
        electricityData: [],
        recycledData: [],
        isUsernameModalVisible: false,
        isPasswordModalVisible: false,
        isDeleteAccountModalVisible:false,
        isEnergyModalVisible:false,
        isEmailModalVisible:false,
        isFavFoodVisible:false,
        isFavTransportVisible:false

    }


    componentDidMount = () => {

        const { navigation } = this.props;
        const userId = AsyncStorage.getItem('userId').then((value) => {
          this.setState({userId: value});
      
          console.log("Settings AsyncStorage UserId:",this.state.userId);
          return value
        })
        .then(userId => {
                this.fetchData(this.state.userId)
                this.setState({isFiltersApplied: true})
            })
    
      }

      fetchData = (userId) => {

        fetch(BaseUrl+'getEnergyObjects', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")
            },
            body: JSON.stringify({
                userId:userId,
                appliedFilters: ''
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
        })
        .catch((error) => {
            console.error(error);
            alert("Transport data didnt fetch");
            
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
                    userIdInit: responseJson['userDetails']['id'],
                    emailInit: responseJson['userDetails']['email'],
                    usernameInit: responseJson['userDetails']['username'],
                    userEnergyInit: responseJson['userDetails']['userEnergy'],
                    passwordInit: responseJson['userDetails']['password'],
                    passwordRepeat: responseJson['userDetails']['password'],
                    favFoodInit: responseJson['userDetails']['favFood'],
                    favTransportInit: responseJson['userDetails']['favTransport'],
                    userId: responseJson['userDetails']['id'],
                    email: responseJson['userDetails']['email'],
                    username: responseJson['userDetails']['username'],
                    userEnergy: responseJson['userDetails']['userEnergy'],
                    password: responseJson['userDetails']['password'],
                    passwordRepeat: responseJson['userDetails']['password'],
                    favFood: responseJson['userDetails']['favFood'],
                    favTransport: responseJson['userDetails']['favTransport'],
                    isLoading: false })
                console.log(this.state);
                
        })
        .catch((error) => {
             console.error(error);
             alert("User data didnt fetch");
            });

        }
        

        // Username Modal
        openUsernameModal = () =>{this.setState({isUsernameModalVisible:true})}
        toggleUsernameModal = () =>{this.setState({isUsernameModalVisible:!this.state.isUsernameModalVisible})}
        closeUsernameModal = () =>{this.setState({isUsernameModalVisible:false, username: this.state.usernameInit})}
        // Email Modal
        openEmailModal = () =>{this.setState({isEmailModalVisible:true})}
        toggleEmailModal = () =>{this.setState({isEmailModalVisible:!this.state.isEmailModalVisible})}
        closeEmailModal = () =>{this.setState({isEmailModalVisible:false, email: this.state.emailInit})}
        // Password Modal
        openPasswordModal = () =>{this.setState({isPasswordModalVisible:true})}
        togglePasswordModal = () =>{this.setState({isPasswordModalVisible:!this.state.isPasswordModalVisible})}
        closePasswordModal = () =>{this.setState({isPasswordModalVisible:false,  password: this.state.passwordInit})}
        // Delete Account Modal
        openDeleteAccountModal = () =>{this.setState({isDeleteAccountModalVisible:true})}
        toggleDeleteAccountModal = () =>{this.setState({isDeleteAccountModalVisible:!this.state.isDeleteAccountModalVisible})}
        closeDeleteAccountModal = () =>{this.setState({isDeleteAccountModalVisible:false})}

        //Update Energy
        openEnergyModal = () =>{this.setState({isEnergyModalVisible:true})}
        toggleEnergyModal = () =>{this.setState({isEnergyModalVisible:!this.state.isEnergyModalVisible})}
        closeEnergyModal = () =>{this.setState({isEnergyModalVisible:false, userEnergy:this.state.userEnergyInit})}

        //Update Fav Food
        openFavFoodModal = () =>{this.setState({isFavFoodVisible:true})}
        toggleFavFoodModal = () =>{this.setState({isFavFoodVisible:!this.state.isFavFoodVisible})}
        closeFavFoodModal = () =>{this.setState({isFavFoodVisible:false, favFood: this.state.favFoodInit})}


        //Update Fav Transport
        openFavTransportModal = () =>{this.setState({isFavTransportVisible:true})}
        toggleFavTransportModal = () =>{this.setState({isFavTransportVisible:!this.state.isFavTransportVisible})}
        closeFavTransportModal = () =>{this.setState({isFavTransportVisible:false, favTransport: this.state.favTransportInit})}

        updateUsername = (username) => {
            this.setState({ username: username })
        }

        updatePassword = (password) => {
            this.setState({ password: password })
        }

        updatePasswordRepeat = (password) => {
            this.setState({ passwordRepeat: password })
        }

        updateEmail = (email) => {
            this.setState({ email: email })
        }

        updateUserEnergy = (userEnergy) => {
            this.setState({ userEnergy: userEnergy })
        }

        updateFavTransport = (transport) => {
            this.setState({ favTransport: transport , transportStr: transport})
            console.log("Update Transport Energy:", "Item", this.state.transportStr,  "User:", this.state.userId)
        }
        updateFavFood = (food) => {this.setState({ favFood: food, foodStr:food })
            console.log("Update Food Energy:", "Item", this.state.favFood,  "User:", this.state.userId)
        }

        updateSettings = () => {
            if (this.state.password !== this.state.passwordRepeat){
                alert("Please enter the same password twice");
                return
            }
            this.setState({isLoading:true})
            fetch(BaseUrl+'updateUser', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")
            },
            body: JSON.stringify({
                userId: this.state.userId,
                email: this.state.email,
                username: this.state.username,
                userEnergy: this.state.userEnergy,
                password: this.state.password,
                favTransport: this.state.favTransport,
                favFood: this.state.favFood

            }),
            method: 'POST'
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if(responseJson['success'] == true){
                    alert("Updated Succefully");
                    this.closeUsernameModal()
                    this.closeEmailModal()
                    this.closePasswordModal()
                    this.closeFavTransportModal()
                    this.closeFavFoodModal()
                    this.closeEnergyModal()
                    this.fetchData(this.state.userId)
                    this.setState({isLoading:false})



                }
                else{
                    alert("Update Failed");
                }
                
            })
            .catch((error) => {
                console.error(error);
                alert("Update Failed");
                });
        }
        
        deleteUser = () => {
            this.setState({isLoading:true})
            fetch( BaseUrl+'deleteUser', {
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
                if(responseJson['success'] == true){
                    alert("User Deleted Succefully");
                    this.closeDeleteAccountModal()
                    AsyncStorage.clear();
                    this.props.navigation.navigate('Login')
                    this.setState({isLoading:false})


                }
                else{
                    this.setState({isLoading:false})
                    alert("User deleted Failed");
                }
                
            })
            .catch((error) => {
                console.error(error);
                this.setState({isLoading:false})
                alert("Delete Failed");
                });
        }




        render() {
            if(this.state.isLoading === false) {
                return (
                    <SafeAreaView style={styles.centeredView}>
                        {/* <ScrollView style={styles.scrollView}> */}
                        <View style={styles.inputLabels}>
                            <TouchableOpacity    onPress={()=>this.openUsernameModal()}    underlayColor="white">
                                <View style={styles.button}>
                                    <View style={styles.iconStyle}>
                                        <FontAwesome name="user" size={24} color="black" />
                                    </View>
                                    <Text style={styles.buttonText}> Update Username</Text>
                                </View>
                            </TouchableOpacity>

                            
                            <TouchableOpacity    onPress={()=>this.openPasswordModal()}    underlayColor="black">
                                <View style={styles.button}>
                                    <View style={styles.iconStyle}>
                                        <FontAwesome name="key" size={24} color="black" />
                                    </View>
                                    <Text style={styles.buttonText}> Update Password</Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity    onPress={()=>this.openEmailModal()}    underlayColor="black">
                                <View style={styles.button}>
                                    <View style={styles.iconStyle}>
                                        <FontAwesome name="envelope" size={24} color="black" />
                                    </View>
                                    <Text style={styles.buttonText}> Update Email</Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity    onPress={()=>this.openFavFoodModal()}    underlayColor="black">
                                <View style={styles.button}>
                                    <View style={styles.iconStyle}>
                                        <FontAwesome name="apple" size={24} color="black" />
                                    </View>
                                    <Text style={styles.buttonText}> Update Favorite Food</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity    onPress={()=>this.openFavTransportModal()}    underlayColor="black">
                                <View style={styles.button}>
                                    <View style={styles.iconStyle}>
                                        <FontAwesome name="car" size={24} color="black" />
                                    </View>
                                    <Text style={styles.buttonText}> Update Favorite Transport</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity    onPress={()=>this.openEnergyModal()}    underlayColor="black">
                                <View style={styles.button}>
                                    <View style={styles.iconStyle}>
                                        <FontAwesome name="warning" size={24} color="black" />
                                    </View>
                                    <Text style={styles.buttonText}> Add Recycling Warning</Text>
                                </View>
                            </TouchableOpacity>
                                
                            <TouchableOpacity    onPress={()=>this.openDeleteAccountModal()}    underlayColor="black">
                                <View style={styles.bottom, styles.button}>
                                        <View style={styles.iconStyle}>
                                            <FontAwesome name="ban" size={24} color="black" />
                                        </View>
                                        <Text style={styles.buttonText}> Delete Account</Text>
                                </View>
                            </TouchableOpacity>

                        </View>
                        

                        <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.isPasswordModalVisible} 
                        onBackdropPress={() => {this.closePasswordModal()}}

                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Update Password </Text>
                                        
                                    <Password
                                            label={'Password'}
                                            onChange= {this.updatePassword}
                                            height={30}
                                            style = {styles.input}
                                        />      

                                    <Text style = {styles.title}>Repeat Password </Text>

                                    <Password
                                            label={'Repeat Password'}
                                            style = {styles.input}
                                            onChange={this.updatePasswordRepeat}
                                            height={30}
                                        />
                            
                                    <View style={{flexDirection:'row', marginTop:30}}>
                                        <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closePasswordModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.updateSettings()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </Modal>
















                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.isUsernameModalVisible} 
                            onBackdropPress={() => {this.closeUsernameModal()}}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Update Username </Text>
                                        
                                    <TextInput style = {styles.input}
                                        underlineColorAndroid = "transparent"
                                        placeholder = {"Username"}
                                        autoCapitalize = "none"
                                        defaultValue={this.state.username}
                                        onChangeText = {this.updateUsername}
                                        maxLength={30}
                                        />         
                            
                            
                                    <View style={{flexDirection:'row', marginTop:30}}>
                                        <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeUsernameModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.updateSettings()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </Modal>



                        <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.isEmailModalVisible} 
                        onBackdropPress={() => {this.closeEmailModal()}}

                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Update Email </Text>
                                        
                                    <TextInput style = {styles.input}
                                        underlineColorAndroid = "transparent"
                                        placeholder = {this.state.email}
                                        autoCapitalize = "none"
                                        defaultValue={this.state.email}
                                        onChangeText = {this.updateEmail}
                                        maxLength={30}/>         
                            
                                    <Text></Text>

                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeEmailModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.updateSettings()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </Modal>


                        <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.isFavFoodVisible} 
                        onBackdropPress={() => {this.closeFavFoodModal()}}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Update Favorite Food </Text>
                                        
                                    <View style={styles.picker}>
                                            <Picker selectedValue = {this.state.foodStr} 
                                                    onValueChange = {this.updateFavFood} 
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
                            
                            
                                    <View style={{flexDirection:'row', marginTop:30}}>
                                        <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeFavFoodModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.updateSettings()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </Modal>



                        <Modal
                        animationType="slide"
                        transparent={true}
                        visible={this.state.isFavTransportVisible} 
                        onBackdropPress={() => {this.closeFavTransportModal()}}
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Update Favorite Transport </Text>
                                        
                                    <View style={styles.picker}>
                                            <Picker selectedValue = {this.state.transportStr} 
                                                onValueChange = {this.updateFavTransport} 
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
                            
                            
                                    <View style={{flexDirection:'row', marginTop:30}}>
                                        <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeFavTransportModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.updateSettings()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </Modal>



                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.isEnergyModalVisible}
                            onBackdropPress={() => {this.closeEnergyModal()}} 
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Add Warning </Text>
                                        
                                        <Text style = {styles.text}> Add Warning in Carbon / Recycle Percentage of : {this.state.userEnergy}</Text>
                                        <Slider
                                            value={this.state.userEnergy}
                                            onValueChange={this.updateUserEnergy}
                                            maximumValue={100}
                                            minimumValue={1}
                                            step={1}
                                            trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                                            thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                                        /> 
                                    <Text></Text>
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeEnergyModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.updateSettings()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </Modal>



                        <Modal
                            animationType="slide"
                            transparent={true}
                            visible={this.state.isDeleteAccountModalVisible} 
                            onBackdropPress={() => {this.closeDeleteAccountModal()}} 

                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Do you want to delete your account ?  </Text>
                                             
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeDeleteAccountModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.deleteUser()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </Modal>




                    {/* </ScrollView> */}
                </SafeAreaView>
                )
            }
            else {
                return( <View style={{ flex: 1,justifyContent: "center"}}>
                            <ActivityIndicator size="large" color= {Colors.primaryColor} />
                        </View>)
            }
        }

    // return <MealList listData={favMeals} navigation={props.navigation} />;
};

SettingsScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Settings',
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

    centeredView: {
        // backgroundColor: '#ffffff',
        flex: 1,
        justifyContent: "center",
      },
    inputLabels:{
        flex: 1,
        padding: 10,
    },
    picker: {
        borderColor: 'black', 
        borderWidth: 1 ,
        height: 50,
        textAlign: 'center',
        color: 'black'
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 20,
        margin: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'stretch'
    },

    input:{
        width: "100%",
        zIndex: 2,
        marginBottom:10,
        borderBottomColor: 'grey',
        borderBottomWidth: 1,
    },
    bottom: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', //Here is the trick
        bottom: 0, //Here is the trick
    },
    itemTexts: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        borderBottomColor: 'grey',
        alignItems: 'flex-start',
        
    },
    button: {
        marginBottom: 15,
        // display: 'flex',
        flexDirection: 'row',
        height: 50,
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
    bottom: {
        width: '100%',
        height: 50,
        alignItems: 'center',
        position: 'absolute', //Here is the trick
        bottom: 0 //Here is the trick

        },
    text:{
            height: 36,
            borderRadius: 8,
            marginLeft: 20,
            marginTop: 20,
            alignSelf: 'stretch',
            // justifyContent: 'center'
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
      iconStyle:{
        width: '10%',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: "center",
        marginLeft:10,
    }
});

export default SettingsScreen;
