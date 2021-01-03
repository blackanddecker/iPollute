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
import AsyncStorage from '@react-native-community/async-storage'

class LoginScreen extends Component {
  state= {
    email: "",
    password: "",
    emailTouched: false,
    passwordTouched: false,
    userId:-1
  }

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
          console.log("Set param:", responseJson['user']['id']);
          AsyncStorage.setItem('userId', responseJson['user']['id']);
          this.props.navigation.navigate({
            routeName:'Categories', 
            params:{
              userId: responseJson['user']['id'],
              email: responseJson['user']['email'],
              username: responseJson['user']['username'],
              fullname: responseJson['user']['fullname']
            }
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
      <KeyboardAvoidingView
        style={styles.container}
        behavior="padding"
      >
        <Image source={imageLogo} style={styles.logo} />
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
            ref={this.passwordInputRef}
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
            label={"Go to sign-up page"}
            onPress={this.goToSignUp}
          />
        </View>
      </KeyboardAvoidingView>

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
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  }
});

export default LoginScreen;