import React, {Component } from 'react';
import { View, Text, StyleSheet, Switch, Platform, TouchableOpacity, ScrollView} from 'react-native';
import StarRating from 'react-native-star-rating';
import { Icon } from 'react-native-elements';
import HeaderButton from '../components/HeaderButton';
import { HeaderButtons } from 'react-navigation-header-buttons';
import Colors from '../constants/Colors';
import { TextInput } from 'react-native-gesture-handler';

class RateMeScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            starCount: 3.5,
            comment: ''
        };
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
        return (
            <View style={styles.container}>
            
                <Text style={styles.instructions}> Rate Me</Text>
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

                <Text style={styles.commentTextHeader} >Insert any comment in below input</Text>
                <TextInput
                    value={this.state.comment}
                    onChangeText={(comment) => this.setComment(comment)}
                    placeholder={'Insert any comment'}
                    style={styles.input}
                />
        
            
            </View>
        );
    }
}

RateMeScreen.navigationOptions = navData => {
    return {
        headerTitle: 'Rate Me',
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
        backgroundColor: '#e8e8e8'
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
    input: {
        width: 250,
        backgroundColor: '#ffffff',
        height: 120,
        padding: 10,
        marginTop: 20,
        marginBottom: 10,
      }
})

export default RateMeScreen