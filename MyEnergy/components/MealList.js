import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList,  TextInput, Modal, TouchableHighlight, RefreshControl, TouchableOpacity,SafeAreaView, ScrollView   } from 'react-native';


import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Colors';

import BaseUrl from '../constants/Url';
import base64 from 'react-native-base64'
import { Slider } from 'react-native-elements';

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
        userId :this.props.userId,
        appliedFilters:this.props.appliedFilters,
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
        'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")
    },
    body: JSON.stringify({
        userId: this.state.userId,
        energyId: this.state.deletedItem
    }),
    method: 'POST'
    })
    .then((response) => response.json())
    .then((responseJson) => {
        // console.log(responseJson);
        if(responseJson['success'] == true){
            alert("Energy Deleted Succefully");
            this.props._fetchData(this.state.userId, this.state.appliedFilters)
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
    console.log("Set Deleted Item:", item)
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

    var itemIcon = <FontAwesome name="train-car" size={24} color={Colors.primaryColor} /> 
    if (item.itemId === 1 & item.energyType === 1){
        itemIcon = <FontAwesome name="plane" size={24} color={Colors.primaryColor}/>
    }
    else if (item.itemId === 2 & item.energyType === 1){
        itemIcon = <FontAwesome name="car" size={24} color={Colors.primaryColor} />
    }
    else if (item.itemId === 3 && item.energyType == 1){
        itemIcon = <FontAwesome name="car" size={24} color= {Colors.primaryColor} />
    }
    else if (item.itemId === 4 & item.energyType === 1){
        itemIcon = <FontAwesome name="bus" size={24} color={Colors.primaryColor} />    
    }    
    else if (item.itemId === 5 && item.energyType == 1 ){
        itemIcon = <FontAwesome name="plane" size={24} color= {Colors.primaryColor} />
    }
    else if (item.itemId === 6 &&  item.energyType == 1){
        itemIcon = <FontAwesome name="plane" size={24} color= {Colors.primaryColor} />
    }
    else if (item.itemId === 7 && item.energyType === 1){
        itemIcon = <FontAwesome name="motorcycle" size={24} color= {Colors.primaryColor} />
    }
    else if (item.itemId === 8 && item.energyType === 1){
        itemIcon = <FontAwesome name="bicycle" size={24} color= {Colors.primaryColor} />
    }
    else if (item.itemId === 9 & item.energyType === 1){
        itemIcon = <FontAwesome name="train" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyType === 0 ){
        itemIcon = <FontAwesome name="apple" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyType === 2 ){
        itemIcon = <FontAwesome name="recycle" size={24} color= {Colors.primaryColor} />
    }    
    else if (item.energyType === 3 ){
        itemIcon = <FontAwesome name="bolt" size={24} color= {Colors.primaryColor} />
    }


    var stringCost = "Energy"
    if (item.energyType === 0 ){
        stringCost = " Kg"
    }
    else if (item.energyType === 1 ){
        stringCost = " Km"
    }
    else if (item.energyType === 2 ){
        stringCost = " Kg "
    }
    else if (item.energyType === 3 ){
        stringCost = " Hours"
    }
    return (

            <View style={styles.item} >
                        

                <View style={styles.iconStyles}>
                    {itemIcon}
                </View>
                <View style = {styles.itemTexts}>
                    <Text style={styles.text}> Date: {item.energyDate} </Text>
                    <Text style={styles.text}> {item.description} : {item.userCost} {stringCost}</Text> 
                    <Text style={styles.text}> Co2: {item.totalCost} Kg</Text>
                </View>
                
                <View style={styles.iconStyles}>
                    <TouchableOpacity onPress={()=>this.openUpdateModal()}>
                        <FontAwesome name="pencil" size={25} color={Colors.primaryColor} />
                    </TouchableOpacity>
                </View>
                <View style={styles.iconStyles}>

                    <TouchableOpacity onPress={ ()=>this.setDeletedItem(item)}>
                        <FontAwesome name="trash" size={25} color={Colors.primaryColor} />
                    </TouchableOpacity>

                </View>
            </View>
    );
  };

  render() {
    //   console.log("State data", this.state.data)
      var dataList = this.props['list'].sort((a, b) => { 
        // console.log(Date.parse(b.energyDate) , (a.energyDate))  
        return Date.parse(b.energyDate) - Date.parse(a.energyDate); 
    })
      
    return (
        <SafeAreaView style={styles.contentContainer}>
            
            <FlatList 
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
                        <Text style = {styles.title}>Delete </Text>

                        <Text style = {styles.textModal}>Do you want to delete this action ? </Text>
                                 
                
                        <View style={{flexDirection:'row',}}>
                            <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeDeleteModal()}>
                                <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.deleteEnergy()}>
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
                                 
                
                        <Text style = {styles.textModal}>How Many: </Text>

                        <TextInput style = {styles.input}
                            underlineColorAndroid = "transparent"
                            placeholder = "0.0"
                            placeholderTextColor = "black"
                            autoCapitalize = "none"
                            onChangeText = {this.updateCost}/>  
                             
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeUpdateModal()}>
                                <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.updateCost()}>
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
        margin: 20,
        textAlign: 'center',
        justifyContent: 'flex-start',
        alignSelf: 'stretch',
        fontSize: 20,
        fontWeight: 'bold'
    },
    contentContainer: {
        // backgroundColor: 'white',
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
        alignItems: 'stretch',
        width: '100%',
        backgroundColor: 'white',
        borderTopWidth:1,
        borderTopColor:'grey'
        },
    buttonText: {
        textAlign: 'left',
        padding: 20,
        color: 'black'
    },
    itemTexts: {
        justifyContent: 'flex-start',
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
    text: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 10,
        
    },
    textModal: {
        fontSize: 12,
        margin: 10,  
    },
    iconStyles:{
        width: '10%',
        flex:1,
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: "center",
        marginLeft:2,
    },
    iconList:{
        width: '10%',
        justifyContent: 'flex-end',
        textAlign: 'center',
        alignSelf: "center",
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