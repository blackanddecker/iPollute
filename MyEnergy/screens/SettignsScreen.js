import React, { Component } from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { View, Text, TextInput, StyleSheet, TouchableOpacity,  SafeAreaView, ScrollView  } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderButton from '../components/HeaderButton';
import Colors from '../constants/Colors';
import Modal from 'react-native-modal';
import BaseUrl from '../constants/Url';
import AsyncStorage from '@react-native-community/async-storage'
import { Icon } from 'react-native-elements';

class SettingsScreen extends Component {
    constructor(props){
        super(props);
 
        console.log('passed params: ', props.navigation.state.userId)
 
     }
    state = {
        userId: -1,
        username : '',
        email: '',
        userEnergy: 0,
        isLoading: true,
        password:'',
        favFood: '',
        favTransport: '',
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

        fetch(BaseUrl+'getUserDetails', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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
                    userId: responseJson['userDetails']['id'],
                    email: responseJson['userDetails']['email'],
                    username: responseJson['userDetails']['username'],
                    userEnergy: responseJson['userDetails']['energyTotal'],
                    password: responseJson['userDetails']['password'],
                    favFood: responseJson['userDetails']['favFood'],
                    favTransport: responseJson['userDetails']['favTransport'],
                    isLoading: !this.state.isLoading })
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
        closeUsernameModal = () =>{this.setState({isUsernameModalVisible:false})}
        // Email Modal
        openEmailModal = () =>{this.setState({isEmailModalVisible:true})}
        toggleEmailModal = () =>{this.setState({isEmailModalVisible:!this.state.isEmailModalVisible})}
        closeEmailModal = () =>{this.setState({isEmailModalVisible:false})}
        // Password Modal
        openPasswordModal = () =>{this.setState({isPasswordModalVisible:true})}
        togglePasswordModal = () =>{this.setState({isPasswordModalVisible:!this.state.isPasswordModalVisible})}
        closePasswordModal = () =>{this.setState({isPasswordModalVisible:false})}
        // Delete Account Modal
        openDeleteAccountModal = () =>{this.setState({isDeleteAccountModalVisible:true})}
        toggleDeleteAccountModal = () =>{this.setState({isDeleteAccountModalVisible:!this.state.isDeleteAccountModalVisible})}
        closeDeleteAccountModal = () =>{this.setState({isDeleteAccountModalVisible:false})}

        //Update Energy
        openEnergyModal = () =>{this.setState({isEnergyModalVisible:true})}
        toggleEnergyModal = () =>{this.setState({isEnergyModalVisible:!this.state.isEnergyModalVisible})}
        closeEnergyModal = () =>{this.setState({isEnergyModalVisible:false})}

        //Update Fav Food
        openFavFoodModal = () =>{this.setState({isFavFoodVisible:true})}
        toggleFavFoodModal = () =>{this.setState({isFavFoodVisible:!this.state.isFavFoodVisible})}
        closeFavFoodModal = () =>{this.setState({isFavFoodVisible:false})}


        //Update Fav Transport
        openFavTransportModal = () =>{this.setState({isFavTransportVisible:true})}
        toggleFavTransportModal = () =>{this.setState({isFavTransportVisible:!this.state.isFavTransportVisible})}
        closeFavTransportModal = () =>{this.setState({isFavTransportVisible:false})}

        updateUsername = (username) => {
            this.setState({ username: username })
        }

        updatePassword = (password) => {
            this.setState({ password: password })
        }

        updateEmail = (email) => {
            this.setState({ email: email })
        }

        updateUserEnergy = (userEnergy) => {
            this.setState({ userEnergy: userEnergy })
        }

        updateFavFood = (favFood) => {
            this.setState({ favFood: favFood })
        }

        updateFavTransport = (favTransport) => {
            this.setState({ favTransport: favTransport })
        }

        updateSettings = () => {
            
            fetch(BaseUrl+'updateUser', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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
        
        deleteUser = (userId) => {
            
            fetch('http://192.168.1.4:5000/deleteUser', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
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
                }
                else{
                    alert("User deleted Failed");
                }
                
            })
            .catch((error) => {
                console.error(error);
                alert("Delete Failed");
                });
        }




        render() {
            var placeholderUsername = this.state.username
            if(!this.state.loading) {
                return (
                    <SafeAreaView style={styles.centeredView}>
                        <ScrollView style={styles.scrollView}>
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
                                        <FontAwesome name="bolt" size={24} color="black" />
                                    </View>
                                    <Text style={styles.buttonText}> Update User Energy</Text>
                                </View>
                            </TouchableOpacity>
                            
                            <TouchableOpacity    onPress={()=>this.openDeleteAccountModal()}    underlayColor="black">
                                <View style={styles.button}>
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
                        visible={this.state.isUsernameModalVisible} 
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Update Username </Text>
                                        
                                    <TextInput style = {styles.input}
                                        underlineColorAndroid = "transparent"
                                        placeholder = {"Username"}
                                        autoCapitalize = "none"
                                        defaultValue={this.state.username}
                                        onChangeText = {this.updateUsername}/>         
                            
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeUsernameModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.updateSettings()}>
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
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Update Email </Text>
                                        
                                    <TextInput style = {styles.input}
                                        underlineColorAndroid = "transparent"
                                        placeholder = {this.state.email}
                                        autoCapitalize = "none"
                                        defaultValue={this.state.email}
                                        onChangeText = {this.updateEmail}/>         
                            
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeEmailModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.updateSettings()}>
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
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Update Favorite Food </Text>
                                        
                                    <TextInput style = {styles.input}
                                        underlineColorAndroid = "transparent"
                                        placeholder = {this.state.email}
                                        autoCapitalize = "none"
                                        defaultValue={this.state.email}
                                        onChangeText = {this.updateFavFood}/>         
                            
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeFavFoodModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.updateSettings()}>
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
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Update Favorite Transport </Text>
                                        
                                    <TextInput style = {styles.input}
                                        underlineColorAndroid = "transparent"
                                        placeholder = {this.state.email}
                                        autoCapitalize = "none"
                                        onChangeText = {this.updateFavTransport}/>         
                            
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeFavTransportModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.updateSettings()}>
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
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Update User Energy </Text>
                                        
                                    <TextInput style = {styles.input}
                                        underlineColorAndroid = "transparent"
                                        placeholder = {this.state.email}
                                        autoCapitalize = "none"
                                        onChangeText = {this.updateUserEnergy}/>         
                            
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeEnergyModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.updateSettings()}>
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
                        >
                            <View style={styles.centeredView}>
                                <View style={styles.modalView}>
                                    <Text style = {styles.title}>Do you want to delete your account ?  </Text>
                                             
                            
                                    <View style={{flexDirection:'row',}}>
                                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeDeleteAccountModal()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.deleteUser()}>
                                            <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </View>
                        </Modal>




                    </ScrollView>
                </SafeAreaView>
                )
            }
            else {
                return(<ActivityIndicator size={"large"} ></ActivityIndicator>)
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
    screen: {
        marginBottom: 15,
        position: 'relative',
        backgroundColor: '#ffffff'
    },
    inputLabels:{
        justifyContent: 'flex-start',
        padding: 10
    },
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 12,
        margin: 20,
        textAlign: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'stretch'
    },
    input:{
        width: "100%",
        zIndex: 2,
        borderWidth:1,
        marginBottom:10
    },
    itemTexts: {
        justifyContent: 'flex-start',
        flexDirection: 'column',
        borderBottomColor: 'grey',
        alignItems: 'flex-start',
    },
    button: {
        marginBottom: 15,
        display: 'flex',
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
    text:{
            height: 36,
            borderRadius: 8,
            marginLeft: 20,
            marginTop: 20,
            alignSelf: 'stretch',
            // justifyContent: 'center'
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
      iconStyle:{
        width: '10%',
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: "center",
        marginLeft:10,
    }
});

export default SettingsScreen;