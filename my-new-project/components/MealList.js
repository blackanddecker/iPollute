import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList,  TextInput, Modal, TouchableHighlight, TouchableOpacity  } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

import MealItem from './MealItem';

class MealList extends Component {
  constructor(props) {
      super(props);
      this.state = {
        data: this.props['list'],
        isUpdateModalVisible: false,
        isDeleteModalVisible: false,
        inputText: '',
        editedItem: 0, 
        deletedItem : '',
        userId :1
        };
  }

  openUpdateModal = () =>{this.setState({isUpdateModalVisible:true})}
  toggleUpdateModal = () =>{this.setState({isUpdateModalVisible:!this.state.isUpdateModalVisible})}
  closeUpdateModal = () =>{this.setState({isUpdateModalVisible:false})}

  openDeleteModal = () =>{this.setState({isDeleteModalVisible:true})}
  toggleDeleteModal = () =>{this.setState({isDeleteModalVisible:!this.state.isDeleteModalVisible})}
  closeDeleteModal = () =>{this.setState({isDeleteModalVisible:false})}


  deleteEnergy = (userId, energy) => {
    console.log("Set Deleted item :", energy)
    fetch('http://192.168.1.4:5000/deleteEnergy', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        userId: userId,
        energyId: energy
    }),
    method: 'POST'
    })
    .then((response) => response.json())
    .then((responseJson) => {
        console.log(responseJson);
        if(responseJson['success'] == true){
            alert("Energy Deleted Succefully");
            this.closeDeleteModal()
        }
        else{
            alert("Energy deleted Failed", userId, energy);
        }
        
    })
    .catch((error) => {
        console.error(error);
        alert("Delete Failed", userId, energy);
        });
    }

  setInputText = (text) => {
      this.setState({ inputText: text })
  }

  setEditedItem = (id) => {
      this.setState({ editedItem: id })
  }
  
  setDeletedItem = (item) => {

    console.log("In:", item)
    this.setState({deletedItem: item.energyId}, () =>{
        this.setState({isDeleteModalVisible:true})
    });
  }

  handleEditItem = (editedItem) => {
      const newData = this.state.data.map( item => {
          if (item.id === editedItem ) {
              item.text = this.state.inputText
              return item
          }
          return item
      })
      this.setState({ data: newData })
  }




 renderItem = ({ item }) => {

    var itemIcon = <MaterialCommunityIcons name="train-car" size={24} color={Colors.primaryColor} /> 
    if (item.transportDescription === 'car'){
      itemIcon = <AntDesign name="car" size={25} color= {Colors.primaryColor} />
    }
    else if (item.transportDescription === 'train'){
      itemIcon = <MaterialIcons name="train" size={24} color= {Colors.primaryColor} />
    }
    else if (item.transportDescription === 'bus'){
      itemIcon = <MaterialIcons name="directions-bus" size={24} color={Colors.primaryColor} />    }
    
    else if (item.transportDescription === 'aeroplane'){
      itemIcon = <FontAwesome name="plane" size={24} color= {Colors.primaryColor} />
    }
    else if (item.foodDescription !== undefined ){
        itemIcon = <MaterialCommunityIcons name="food" size={24} color= {Colors.primaryColor} />
      }
    

    var stringCost = "Energy"
    if (item.foodDescription !== undefined ){
        stringCost = "Total kg used: "
    }
    else{
        stringCost = "Total km done: "
    }
    return (

            <View style={styles.item} >
                
                <View style={styles.marginLeft}>
                    {itemIcon}

                </View>
                <View style = {styles.itemTexts}>
                    <Text style={styles.text}> Date: {item.energyDate} </Text>
                    <Text style={styles.text}> {stringCost} {item.energyCost}</Text> 
                    <Text style={styles.text}> Total Co2 produced: {item.cost} </Text>
                </View>
                
                <View style={styles.iconStyles}>
                    <TouchableHighlight onPress={()=>this.openUpdateModal()}>
                        <MaterialIcons name="change-history" size={30} color={Colors.primaryColor} />
                    </TouchableHighlight>

                    <TouchableHighlight onPress={ ()=>this.setDeletedItem(item)}>
                        <MaterialIcons name="delete" size={30} color={Colors.primaryColor} />
                    </TouchableHighlight>

                </View>
            </View>
    );
  };

  render() {
      console.log("State data", this.state.data)

    return (
        <View style={styles.contentContainer}>
            <FlatList 
                data={this.props['list']}
                renderItem={this.renderItem}
                keyExtractor={(item) => item.energyId.toString()}
            />

            {  this.state.isDeleteModalVisible &&
                
                <View>
                    <Modal animationIn="slideInUp" 
                        animationOut="slideOutDown" 
                        onBackdropPress={()=>this.closeDeleteModal()}
                        onSwipeComplete={()=>this.closeDeleteModal()} 
                        swipeDirection="right" 
                        isVisible={this.state.isDeleteModalVisible} 
                        width="90%"
                        max-height="40%"
                        style={{backgroundColor:'white'}}>

                    <View style={styles.modalView}>           
                        <Text style = {styles.title}>Are you sure, you wan to delete it ?  </Text>       
                    </View>
                                
                    <View style={{ flex: 1,justifyContent:'center',position:'absolute',bottom:0}}>
                            <View style={{flexDirection:'row',}}>
                                <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeDeleteModal()}>
                                    <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={() => {this.deleteEnergy(this.state.userId, this.state.deletedItem)}}>
                                    <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                </View>
            }
                            
            </View>
    )
  }
};
      
const styles = StyleSheet.create({
    list: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 15
    },
    headerText: {
        fontSize: 20,
    },
    contentContainer: {
        backgroundColor: 'white',
    },
    item: {
        flexDirection: 'row',
        marginVertical: 8

    },
    itemTexts: {
        flexDirection: 'column',
        borderBottomColor: 'grey',
        alignItems: 'flex-start',
    },
    marginLeft: {
        marginLeft: 5,
    },
    marginRight: {
        justifyContent: 'flex-end',
    },
    menu: {
        width: 20,
        height: 2,
        backgroundColor: '#111',
        margin: 2,
        borderRadius: 3,
    },
    text: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    iconStyles:{
        flexDirection: 'row'
    },
    textInput: {
        width: '90%',
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 30,
        borderColor: 'gray', 
        fontSize: 8,
    },
    modalView: {
        flex: 1, 
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    },
    touchableHighlight: {
        backgroundColor: 'white', 
        marginVertical: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
    } 
});
      
export default MealList;