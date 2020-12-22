import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList,  TextInput, Modal, TouchableHighlight, RefreshControl, TouchableOpacity,SafeAreaView, ScrollView   } from 'react-native';
import { AntDesign } from '@expo/vector-icons'; 
import { MaterialIcons } from '@expo/vector-icons'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import Colors from '../constants/Colors';

import MealItem from './MealItem';
import BaseUrl from '../constants/Url';

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
        updatedItem: '',
        userId :1,
        refreshing: false
        };
  }

  openUpdateModal = () =>{this.setState({isUpdateModalVisible:true})}
  toggleUpdateModal = () =>{this.setState({isUpdateModalVisible:!this.state.isUpdateModalVisible})}
  closeUpdateModal = () =>{this.setState({isUpdateModalVisible:false})}

  openDeleteModal = () =>{this.setState({isDeleteModalVisible:true})}
  toggleDeleteModal = () =>{this.setState({isDeleteModalVisible:!this.state.isDeleteModalVisible})}
  closeDeleteModal = () =>{this.setState({isDeleteModalVisible:false})}


//   _onRefresh = () => {
//     this.setState({refreshing: true});
//     fetchData().then(() => {
//       this.setState({refreshing: false});
//     });
//   }

  deleteEnergy = (userId, energy) => {
    console.log("Set Deleted item :", energy)
    fetch(BaseUrl+'deleteEnergy', {
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        userId: this.state.userId,
        energyId: this.state.deletedItem
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


  setUpdateItem = (item) => {
    console.log("In:", item)
    this.setState({updatedItem: item.energyId}, () =>{
        this.setState({isUpdateModalVisible:true})
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
    else if (item.itemId === 4 && item.energyType === 1){
      itemIcon = <MaterialIcons name="directions-bus" size={24} color={Colors.primaryColor} />    }
    
    else if (item.itemId === 1 && item.energyType === 1){
      itemIcon = <FontAwesome name="plane" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyType === 0 ){
        itemIcon = <MaterialCommunityIcons name="food" size={24} color= {Colors.primaryColor} />
      }
    else if (item.energyType === 2 ){
        itemIcon = <MaterialCommunityIcons name="recycle" size={24} color= {Colors.primaryColor} />
    }    
    else if (item.energyType === 3 ){
        itemIcon = <MaterialCommunityIcons name="power" size={24} color= {Colors.primaryColor} />
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
                    <Text style={styles.text}> {stringCost} {item.userCost}</Text> 
                    <Text style={styles.text}> Total Co2 produced: {item.totalCost} </Text>
                </View>
                
                <View style={styles.iconStyles}>
                    <TouchableHighlight onPress={()=>this.openUpdateModal()}>
                        <MaterialIcons name="update" size={25} color={Colors.primaryColor} />
                    </TouchableHighlight>

                    <TouchableHighlight onPress={ ()=>this.setDeletedItem(item)}>
                        <MaterialIcons name="delete" size={25} color={Colors.primaryColor} />
                    </TouchableHighlight>

                </View>
            </View>
    );
  };

  render() {
      console.log("State data", this.state.data)
      var dataList = this.props['list'].sort((a, b) => { 
        console.log(Date.parse(b.energyDate) , (a.energyDate))  
        return Date.parse(b.energyDate) - Date.parse(a.energyDate); 
    })
      
    return (
        <SafeAreaView style={styles.contentContainer}>
            
            <FlatList 
                refreshControl={
                    <RefreshControl
                    refreshing={this.props.refreshing}
                    onRefresh={this.props._handleRefresh}
                    />
                }
                data={dataList}
                renderItem={this.renderItem}
                keyExtractor={(item) => item.energyId.toString()}
            />

            {  this.state.isDeleteModalVisible &&
                
                <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isDeleteAccountModalVisible} 
                >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style = {styles.title}>Do you want to delete this action ? </Text>
                                 
                
                        <View style={{flexDirection:'row',}}>
                            <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeDeleteModal()}>
                                <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.deleteEnergy()}>
                                <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </Modal>
            }

            {  this.state.isUpdateModalVisible &&
                
                <Modal
                animationType="slide"
                transparent={true}
                visible={this.state.isUpdateModalVisible} 
                >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style = {styles.title}>Update Action</Text>
                                 
                
                        <Text style = {styles.text}>How Many: </Text>

                        <TextInput style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "0.0"
                            placeholderTextColor = "black"
                            autoCapitalize = "none"
                            onChangeText = {this.updateCost}/>  
                             
                        <View style={{flexDirection:'row',}}>
                            <TouchableOpacity style={{backgroundColor:'red',width:'50%'}} onPress={()=>this.closeUpdateModal()}>
                                <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:'green',width:'50%'}} onPress={()=>this.deleteUser()}>
                                <Text style={{color:'white',textAlign:'center',padding:10}}>Ok</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </Modal>
            }

            </SafeAreaView>
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
    title: {
        fontFamily: 'open-sans-bold',
        fontSize: 12,
        margin: 20,
        textAlign: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'stretch'
    },
    contentContainer: {
        backgroundColor: 'white',
    },
    // item: {
    //     flexDirection: 'row',
    //     marginVertical: 8

    // },
    item: {
        marginBottom: 5,
        display: 'flex',
        flexDirection: 'row',
        height: 50,
        borderRadius: 9,
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

    touchableHighlight: {
        backgroundColor: 'white', 
        marginVertical: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
    } ,
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
      
export default MealList;