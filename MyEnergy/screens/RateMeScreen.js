import React, {Component } from 'react';
import { View, Text, StyleSheet, Switch, Platform, TouchableOpacity, ScrollView, ActivityIndicator} from 'react-native';
import StarRating from 'react-native-star-rating';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons } from 'react-navigation-header-buttons';
import Colors from '../constants/Colors';
import { TextInput } from 'react-native-gesture-handler';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage'
import BaseUrl from '../constants/Url';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AwesomeAlert from 'react-native-awesome-alerts';
import base64 from 'react-native-base64'

class RateMeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            starCount: 3,
            comment: '',
            userId: -1, 
            comment: '',
            showSaveAlert: false,
            loading: false
        };
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
            })
    
      }


    fetchData = (userId) => {
        this.setState({ loading: true });
        fetch(BaseUrl+'getUserRate', {
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
                    starCount: responseJson['ratings']['star'],
                })
                this.setState({ loading: false});
                
        })
        .catch((error) => {
            this.setState({ loading: false});
             console.error(error);
             alert("User data didnt fetch");
        });
    }


    showAlert = () => {
        this.setState({
          showSaveAlert: true
        });
      };

    saveRatings = () => {
        if (this.state.comment.length > 390){
            alert("Maximum 400 letters in comments")
            return
        }
        this.setState({ loading: true});
        fetch(BaseUrl+'saveUserRate', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")

        },
        body: JSON.stringify({
            userId: this.state.userId,
            star: this.state.starCount,
            comment: this.state.comment

        }),
        method: 'POST'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            if(responseJson['success'] == true){
                this.setState({ loading: false, comment: ''});
                alert("Saved Ratings");
            }
            else{
                this.setState({ loading: false});
                alert("Fail to save ratings");
            }
        })
        .catch((error) => {
            console.error(error);
            this.setState({ loading: false});
            alert("Fail to save ratings");
        });
    }













    onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }


    setComment = (comment) => {
        this.setState({ comment: comment })
    }   

    render() {
        if(this.state.loading === false) {  

            return (
                <View style={styles.container}>
                
                    <Text style={styles.instructions}> Rate Us</Text>
                    <Text style={styles.instructions}>
                    {`${this.state.starCount} of stars is displayed`}
                    </Text>
                    <StarRating
                        disabled={false}
                        maxStars={5}
                        fullStarColor={Colors.primaryColor}
                        rating={this.state.starCount}
                        selectedStar={(rating) => this.onStarRatingPress(rating)}
                    />

                    <TextInput
                        multiline={true}
                        numberOfLines={5}
                        value={this.state.comment}
                        onChangeText={(comment) => this.setComment(comment)}
                        placeholder={'Insert any comment '}
                        style={styles.input}
                    />
                    {/* <Text style = {styles.lengthText}> {this.state.comment.length}/ 400</Text> */}

                    <TouchableOpacity    style={styles.SaveButton2} onPress={()=>this.saveRatings()} underlayColor="white">
                        <View style={styles.SaveButton}>
                            <FontAwesome name="save" size={24} color="black" />
                            <Text style={styles.buttonText}>         Save         </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            );
        }
        else{
            return(  
                <View style={{ flex: 1,justifyContent: "center"}}>
                    <ActivityIndicator size="large" color= {Colors.primaryColor} />
                </View>)
          }
    }
}

RateMeScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Rate Us',
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    instructions: {
        fontSize: 20,
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    commentTextHeader: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    lengthText:{
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        alignSelf: 'auto',
        fontSize: 8
    },
    input: {
        width: 250,
        backgroundColor: '#ffffff',
        height: 120,
        padding: 10,
        marginTop: 20,
        marginBottom: 10,
      },
      SaveButton: {
        
        display: 'flex',
        flexDirection: 'row',
        height: 60,
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1 ,
        borderBottomColor:'black',
        shadowOpacity: 0.5,
        shadowOffset: { 
            height: 10, 
            width: 0 
        },
        shadowRadius: 25,
    }
})

export default RateMeScreen