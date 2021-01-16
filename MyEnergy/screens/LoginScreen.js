import React, { Component } from 'react'
import { Image, KeyboardAvoidingView, StyleSheet, View, TouchableOpacity, Text, TextInput } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogo from "../assets/logo2.jpeg";
import colors from '../constants/Colors';
import strings from "../config/strings";
import BaseUrl from '../constants/Url';
import MainNavigator from '../navigation/MealsNavigator';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import AsyncStorage from '@react-native-community/async-storage'
import Modal from 'react-native-modal';

class LoginScreen extends Component {
  state= {
    email: "",
    password: "",
    emailTouched: false,
    passwordTouched: false,
    userId:-1,
    passwordInputRef: '',
    forgotPasswordEmail: '',
    isForgotPasswordVisible: false
  }

  clearAppData = async function() {
    try {
        const keys = await AsyncStorage.getAllKeys();
        await AsyncStorage.multiRemove(keys);
    } catch (error) {
        console.error('Error clearing app data.');
    }
}

  componentDidMount = () => {
    // this.clearAppData()
  }

  // componentDidUpdate = () => {
  //   this.clearAppData()
  // }

  handleEmailChange = (email: string) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

  handleEmailSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  forgotPasswordEmail = (forgotPasswordEmail) => {
    this.setState({ forgotPasswordEmail: forgotPasswordEmail })
  }
  openForgotPasswordModal = () =>{this.setState({isForgotPasswordVisible:true})}
  toggleForgotPasswordModal = () =>{this.setState({isForgotPasswordVisible:!this.state.isForgotPasswordVisible})}
  closeForgotPasswordModal = () =>{this.setState({isForgotPasswordVisible:false})}
  // ...and we update them in the input onBlur callback
  handleEmailBlur = () => {
    this.setState({ emailTouched: true });
  };

  handlePasswordBlur = () => {
    this.setState({ passwordTouched: true });
  };

  goToSignUp = () => {
    this.props.navigation.navigate({routeName:'SignUp'})
  }


  sendForgotPassword = () => {
    fetch(BaseUrl+'forgotPassword', {
      headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: this.state.forgotPasswordEmail
      }),
      method: 'POST'
      })
      .then((response) => response.json())
      .then((responseJson) => {
          console.log(responseJson);     
          if (responseJson['success'] == true){
            alert("Email Send");
          }
          else{
            alert("Wrong Email");
          }
  
      })
      .catch((error) => {
          console.error(error);
          alert("Wrong Email");
      });
  }

  handleLoginPress = () => {
    
    fetch(BaseUrl+'login', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: this.state.email,
        password: this.state.password

    }),
    method: 'POST'
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);     
        if (responseJson['success'] == true){


          AsyncStorage.setItem('userId', responseJson['user']['id'].toString()).then((value) => {

            console.log("Login: Set userId:", responseJson['user']['id']);
            this.props.navigation.navigate({
              routeName:'Categories', 
              params:{
                userId: responseJson['user']['id'],
                email: responseJson['user']['email'],
                username: responseJson['user']['username'],
                fullname: responseJson['user']['fullname']
              }
            });

          });


          
        }
        else{
          alert("Login Failed");
        }

    })
    .catch((error) => {
        console.error(error);
        alert("Login Failed");
        });

  };

  render() {
    // Show the validation errors only when the inputs
    // are empty AND have been blurred at least once
    const {
      email,
      password,
      emailTouched,
      passwordTouched
    } = this.state;

    const emailError =
      !email && emailTouched
        ? strings.EMAIL_REQUIRED
        : undefined;
    const passwordError =
      !password && passwordTouched
        ? strings.PASSWORD_REQUIRED
        : undefined;
    return (
      <View
        style={styles.container}
        behavior="padding"
      >
        <Image source={imageLogo} style={styles.logo} />
        <View style={{ height: 60 }} />
        <View style={styles.form}>
          <FormTextInput
            value={this.state.email}
            onChangeText={this.handleEmailChange}
            onSubmitEditing={this.handleEmailSubmitPress}
            placeholder={strings.EMAIL_PLACEHOLDER}
            autoCorrect={false}
            keyboardType="email-address"
            returnKeyType="next"
            onBlur={this.handleEmailBlur}
            error={emailError}
          />
          <FormTextInput
            ref={(input) => { this.passwordInputRef = input; }}
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
          />
          <Button
            label={strings.LOGIN}
            onPress={this.handleLoginPress}
            disabled={!email || !password}
          />
          
          <Button
            label={"Create New Account"}
            onPress={this.goToSignUp}
          />
          <TouchableOpacity style={styles.text} onPress={()=>this.openForgotPasswordModal()}>
              <Text style={styles.text} >Forgot Password</Text>
          </TouchableOpacity>
        </View>


        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.isForgotPasswordVisible} 
          >
              <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                      <Text style = {styles.title}>Give your E-mail </Text>
                          
                      <TextInput style = {styles.input}
                          underlineColorAndroid = "transparent"
                          placeholder = {"Email"}
                          autoCapitalize = "none"
                          defaultValue={this.state.forgotPasswordEmail}
                          onChangeText = {this.forgotPasswordEmail}/>         
              
              
                      <View style={{flexDirection:'row', marginTop:30}}>
                          <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeForgotPasswordModal()}>
                              <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={() =>this.sendForgotPassword()}>
                              <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                          </TouchableOpacity>
                      </View>
                  </View>

              </View>
          </Modal>
      </View>

    );
  }
}

LoginScreen.navigationOptions = navData => {
  return {
      headerTitle: 'Login',
      // headerLeft: (
      //     <HeaderButtons HeaderButtonComponent={HeaderButton}>
      //         <Item
      //             title="Menu"
      //             iconName="ios-menu"
      //             onPress={() => {
      //                 navData.navigation.toggleDrawer();
      //             }}
      //         />
      //     </HeaderButtons>
      // )
  };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    alignItems: "center",
    justifyContent: "space-between"
  },
  logo: {
    marginTop:10,
    flex: 1,
    width: "100%",
    resizeMode: "center",
    alignSelf: "center"
  },
  form: {
    marginTop:10,
    flex: 1,
    justifyContent: "center",
    width: "80%"
  },
  text:{
    marginBottom: 5,
    color:'white',
    textAlign:'center',
    padding:10, 
    color:'blue'
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

export default LoginScreen;