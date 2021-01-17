import React, { Component } from 'react'
import { Image, KeyboardAvoidingView, StyleSheet, View } from "react-native";
import Button from "../components/Button";
import FormTextInput from "../components/FormTextInput";
import imageLogo from "../assets/logo2.jpeg";
import colors from '../constants/Colors';
import strings from "../config/strings";
import BaseUrl from '../constants/Url';
import MainNavigator from '../navigation/MealsNavigator';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import HeaderButton from '../components/HeaderButton';
import base64 from 'react-native-base64'

import AsyncStorage from '@react-native-community/async-storage'

class SignUpScreen extends Component {
  state= {
    email: "",
    password: "",
    passwordRepeat: "",
    username: "",
    userEnergy: "",
    favFood: "",
    favTransport: "",
    emailTouched: false,
    passwordTouched: false
  }

  handleEmailChange = (email: string) => {
    this.setState({ email: email });
  };

  handlePasswordChange = (password: string) => {
    this.setState({ password: password });
  };

  handlePasswordRepeatChange = (passwordRepeat: string) => {
    this.setState({ passwordRepeat: passwordRepeat });
  };

  handleUsernameChange = (username: string) => {
    this.setState({ username: username });
  };

  handleFavFoodChange = (favFood: string) => {
    this.setState({ favFood: favFood });
  };

  handleFavTransportChange = (favTransport: string) => {
    this.setState({ favTransport: favTransport });
  };

  handleEmailSubmitPress = () => {
    if (this.passwordInputRef.current) {
      this.passwordInputRef.current.focus();
    }
  };

  // ...and we update them in the input onBlur callback
  handleEmailBlur = () => {
    this.setState({ emailTouched: true });
  };

  handlePasswordBlur = () => {
    this.setState({ passwordTouched: true });
  };

  goToLogin = () => {
    this.props.navigation.navigate({routeName:'Login'})
  }

  handleSignUpPress = () => {
    if (this.state.passwordRepeat != this.state.password){
      console.log(this.state.passwordRepeat, this.state.password, "Different Passwords")
      alert("Different Passwords");
      this.handlePasswordRepeatChange("")
      this.handlePasswordChange("")
      return
    }
    fetch(BaseUrl+'signup', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")

    },
    body: JSON.stringify({
        email: this.state.email,
        password: this.state.password,
        username: this.state.username,
        userEnergy: this.state.userEnergy,
        favFood: this.state.favFood,
        favTransport: this.state.favTransport,

    }),
    method: 'POST'
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);     
        if (responseJson['success'] == true){
          console.log("Set param:", responseJson['user']['id']);
          AsyncStorage.setItem('userId', responseJson['user']['id']);
          this.props.navigation.navigate('Categories', 
            {userId: responseJson['user']['id'],
            email: responseJson['user']['email'],
            username: responseJson['user']['username'],
            fullname: responseJson['user']['fullname']
          });

          
        }
        else if (responseJson['success'] === false && responseJson['message'] === 'User Exists'){
          console.log(this.state.passwordRepeat, this.state.password, "User Exists")
          alert("User Exists");
          this.handleEmailChange("")
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

        <View style={styles.form}>
        <Image source={imageLogo} style={styles.logo} />
        <View style={{ height: 60 }} />

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
            value={this.state.username}
            onChangeText={this.handleUsernameChange}
            onSubmitEditing={this.handleEmailSubmitPress}
            placeholder={"Username"}
            autoCorrect={false}
            keyboardType="string"
            returnKeyType="next"
            onBlur={this.handleEmailBlur}
          />
          {/* <FormTextInput
            value={this.state.email}
            onChangeText={this.handleFavFoodChange}
            onSubmitEditing={this.handleEmailSubmitPress}
            placeholder={"Favorite Food"}
            autoCorrect={false}
            keyboardType="string"
            returnKeyType="next"
            onBlur={this.handleEmailBlur}
          />
          <FormTextInput
            value={this.state.email}
            onChangeText={this.handleFavTransportChange}
            onSubmitEditing={this.handleEmailSubmitPress}
            placeholder={"Favorite Transport"}
            autoCorrect={false}
            keyboardType="string"
            returnKeyType="next"
            onBlur={this.handleEmailBlur}

          /> */}
          <FormTextInput
            value={this.state.password}
            onChangeText={this.handlePasswordChange}
            placeholder={strings.PASSWORD_PLACEHOLDER}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
          />

          <FormTextInput
            value={this.state.passwordRepeat}
            onChangeText={this.handlePasswordRepeatChange}
            placeholder={"Repeat Password"}
            secureTextEntry={true}
            returnKeyType="done"
            onBlur={this.handlePasswordBlur}
            error={passwordError}
          />
          <Button
            label={strings.SIGNIN}
            onPress={this.handleSignUpPress}
            disabled={!email || !password}
          />

          <Button
            label={"Go to login page"}
            onPress={this.goToLogin}
          />
        </View>
      </View>

    );
  }
}

SignUpScreen.navigationOptions = navData => {
  return {
      headerTitle: 'Sign-In',
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
    width: "80%",
    marginBottom:30
  }
});

export default SignUpScreen;