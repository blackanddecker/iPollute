import React, { Component } from 'react'
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

import HeaderButton from '../components/HeaderButton';
import { AntDesign } from '@expo/vector-icons'; 
import Colors from '../constants/Colors';
import Modal from 'react-native-modal';

class SettingsScreen extends Component {
    constructor(props){
        super(props);
 
        console.log('passed params: ', props.navigation.state.userId)
 
     }
    state = {
        userId: -1,
        username : '',
        email: '',
        energyTotal: 0,
        isLoading: true,
        password:'',
        isUsernameModalVisible: false,
        isPasswordModalVisible: false,
        isDeleteAccountModalVisible:false,
        isEnergyModalVisible:false,
        isEmailModalVisible:false

    }

    componentDidMount(){
        const { navigation } = this.props;
        const userId = navigation.getParam('userId', '-1');

        console.log("Get param1:",this.props.navigation.state.params);

        this.setState({ userId: userId });

        console.log("Get param after set state:", this.state.userId);

        fetch('http://192.168.1.4:5000/getUserDetails', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId
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
        //Update Email
        openModal = () =>{this.setState({isModalVisible:true})}
        toggleModal = () =>{this.setState({isModalVisible:!this.state.isModalVisible})}
        closeModal = () =>{this.setState({isModalVisible:false})}
        //Update Energy
        openEnergyModal = () =>{this.setState({isEnergyModalVisible:true})}
        toggleEnergyModal = () =>{this.setState({isEnergyModalVisible:!this.state.isEnergyModalVisible})}
        closeEnergyModal = () =>{this.setState({isEnergyModalVisible:false})}


        updateUsername = (username) => {
            this.setState({ username: username })
        }




        updateSettings = (userId, username, email, password, energyTotal) => {
            alert(userId+'username: ' + username + ' email: ' + email +' energyTotal: ' + energyTotal+ 'password:'+ password)
            
            fetch('http://192.168.1.4:5000/updateUser', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                email: email,
                username: username,
                userEnergy: energyTotal,
                password: password
            }),
            method: 'POST'
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if(responseJson['success'] == true){
                    alert("Updated Succefully");
                    this.setState({
                        userId: userId,
                        email: email,
                        username: username,
                        energyTotal: energyTotal,
                        password: password,
                        isLoading: !this.state.isLoading })
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
            alert("userId:", userId)
            
            fetch('http://192.168.1.4:5000/deleteUser', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId
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
            console.log("In render:",this.props.navigation.state.params);

            // if(!this.state.loading) {
                return (
                <View    style = {styles.screen}>

                <View style={styles.inputLabels}>
                <Text> </Text>

                <TouchableOpacity    onPress={()=>this.openUsernameModal()}    underlayColor="white">
                    <View style={styles.button}>
                        <AntDesign name="arrowright" size={24} color="black" />
                        <Text style={styles.buttonText}> Update Username</Text>
                    </View>
                </TouchableOpacity>

                <Text> </Text>
                <TouchableOpacity    onPress={()=>this.openPasswordModal()}    underlayColor="black">
                    <View style={styles.button}>
                        <AntDesign name="arrowright" size={24} color="black" />
                        <Text style={styles.buttonText}> Update Password</Text>
                    </View>
                </TouchableOpacity>
                <Text> </Text>
                <TouchableOpacity    onPress={()=>this.openEmailModal()}    underlayColor="black">
                    <View style={styles.button}>
                        <AntDesign name="arrowright" size={24} color="black" />
                        <Text style={styles.buttonText}> Update Email</Text>
                    </View>
                </TouchableOpacity>
                <Text> </Text>
                <TouchableOpacity    onPress={()=>this.openEnergyModal()}    underlayColor="black">
                    <View style={styles.button}>
                        <AntDesign name="arrowright" size={24} color="black" />
                        <Text style={styles.buttonText}> Update Total Energy</Text>
                    </View>
                </TouchableOpacity>
                <Text> </Text>
                <TouchableOpacity    onPress={()=>this.openDeleteAccountModal()}    underlayColor="black">
                    <View style={styles.button}>
                        <AntDesign name="arrowright" size={24} color="black" />
                        <Text style={styles.buttonText}> Delete Account</Text>
                    </View>
                </TouchableOpacity>
                </View>
         
         
         
         
         
         {/* USERNAME MODAL */}
         
         <View>
            <Modal animationIn="slideInUp" 
                animationOut="slideOutDown" 
                onBackdropPress={()=>this.closeUsernameModal()}
                onSwipeComplete={()=>this.closeUsernameModal()} 
                swipeDirection="right" 
                isVisible={this.state.isUsernameModalVisible} 
                style={{backgroundColor:'white'}}>

                <Text style = {styles.text}>Update Username </Text>
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = {this.state.username}
                    autoCapitalize = "none"
                    onChangeText = {this.updateUsername}/> 


                <View style={{justifyContent:'center',}}>
                    <View style={{flexDirection:'row',}}>
                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeUsernameModal()}>
                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                        style={{backgroundColor:'green',width:'50%'}} 
                        onPress={()=>this.updateSettings(
                            this.state.userId,
                            this.state.username,
                            this.state.email,
                            this.state.password,
                            this.state.energyTotal)} >
                            <Text style={{color:'white',textAlign:'center',padding:10}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>

              </Modal>
          </View>



         {/* EMAIL MODAL */}



          <View>
            <Modal animationIn="slideInUp" 
                animationOut="slideOutDown" 
                onBackdropPress={()=>this.closeEmailModal()}
                onSwipeComplete={()=>this.closeEmailModal()} 
                swipeDirection="right" 
                isVisible={this.state.isEmailModalVisible} 
                width="90%"
                max-height="40%"
                style={{backgroundColor:'white'}}>

                <Text style = {styles.text}>Update Email </Text>
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = {this.state.email}
                    // placeholderTextColor = {Colors.primaryColor}
                    autoCapitalize = "none"
                    onChangeText = {this.email}/> 

                <View style={{ justifyContent:'center' }}>
                    <View style={{flexDirection:'row',}}>
                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeEmailModal()}>
                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={{backgroundColor:'green',width:'50%'}} 
                          onPress={()=>this.updateSettings(
                            this.state.userId,
                            this.state.username,
                            this.state.email,
                            this.state.password,
                            this.state.energyTotal)} >
                            <Text style={{color:'white',textAlign:'center',padding:10}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </Modal>
          </View>



         {/* PASSWORD MODAL */}



         <View>
            <Modal animationIn="slideInUp" 
                animationOut="slideOutDown" 
                onBackdropPress={()=>this.closePasswordModal()}
                onSwipeComplete={()=>this.closePasswordModal()} 
                swipeDirection="right" 
                isVisible={this.state.isPasswordModalVisible} 
                width="90%"
                max-height="40%"
                style={{backgroundColor:'white'}}>

                <Text style = {styles.text}>Update Password </Text>
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = {this.state.username}
                    // placeholderTextColor = {Colors.primaryColor}
                    autoCapitalize = "none"
                    onChangeText = {this.password}/> 
                <Text style = {styles.text}>Update Password Again </Text>
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    // placeholderTextColor = {Colors.primaryColor}
                    autoCapitalize = "none"
                    onChangeText = {this.password}/> 

                <View style={{ flex: 1,justifyContent:'center',position:'absolute',bottom:0}}>
                    <View style={{flexDirection:'row',}}>
                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closePasswordModal()}>
                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={{backgroundColor:'green',width:'50%'}} 
                          onPress={()=>this.updateSettings(
                            this.state.userId,
                            this.state.username,
                            this.state.email,
                            this.state.password,
                            this.state.energyTotal)} >
                            <Text style={{color:'white',textAlign:'center',padding:10}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </Modal>
          </View>


         {/* ENERGY MODAL */}



         <View>
            <Modal animationIn="slideInUp" 
                animationOut="slideOutDown" 
                onBackdropPress={()=>this.closeEnergyModal()}
                onSwipeComplete={()=>this.closeEnergyModal()} 
                swipeDirection="right" 
                isVisible={this.state.isEnergyModalVisible} 
                width="90%"
                max-height="40%"
                style={{backgroundColor:'white'}}>

                <Text style = {styles.text}>Update Energy </Text>
                <TextInput style = {styles.input}
                    underlineColorAndroid = "transparent"
                    placeholder = {this.state.username}
                    // placeholderTextColor = {Colors.primaryColor}
                    autoCapitalize = "none"
                    onChangeText = {this.energy}/> 

                <View style={{ flex: 1,justifyContent:'center',position:'absolute',bottom:0}}>
                    <View style={{flexDirection:'row',}}>
                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeEnergyModal()}>
                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={{backgroundColor:'green',width:'50%'}} 
                          onPress={()=>this.updateSettings(
                            this.state.userId,
                            this.state.username,
                            this.state.email,
                            this.state.password,
                            this.state.energyTotal)} >
                            <Text style={{color:'white',textAlign:'center',padding:10}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </Modal>
          </View>









         {/* DELETE MODAL */}



         <View>
            <Modal animationIn="slideInUp" 
                animationOut="slideOutDown" 
                onBackdropPress={()=>this.closeDeleteAccountModal()}
                onSwipeComplete={()=>this.closeDeleteAccountModal()} 
                swipeDirection="right" 
                isVisible={this.state.isDeleteAccountModalVisible} 
                width="90%"
                max-height="40%"
                style={{backgroundColor:'white'}}>
                <Text style = {styles.text}>Are you sure you want to delete your account ??</Text>
                <View style={{ flex: 1,justifyContent:'center',position:'absolute',bottom:0}}>
                    <View style={{flexDirection:'row',}}>
                        <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeDeleteAccountModal()}>
                            <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={{backgroundColor:'green',width:'50%'}} 
                          onPress={()=>this.deleteUser(
                            this.state.userId)} >
                            <Text style={{color:'white',textAlign:'center',padding:10}}>Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
              </Modal>
          </View>






































        </View>

        

                )
            // }
            // else{
            //     return (
            //         <ActivityIndicator size={"large"} ></ActivityIndicator>)
            // }
        }

    // return <MealList listData={favMeals} navigation={props.navigation} />;
};

SettingsScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Settings',
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
        textAlign: 'center'
    },
    input:{
        width: "75%",
        zIndex: 2,
        borderWidth:1
    },

    button: {

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
    }
});

export default SettingsScreen;
