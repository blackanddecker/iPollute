import React, {Component} from 'react';
import {StyleSheet, Text, View, FlatList,  TextInput, Modal, TouchableHighlight, RefreshControl, TouchableOpacity,SafeAreaView, ScrollView   } from 'react-native';


import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Colors from '../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import BaseUrl from '../constants/Url';
import base64 from 'react-native-base64'
import { Slider } from 'react-native-elements';
import { TextComponent } from 'react-native';
import Timeline from 'react-native-timeline-flatlist'

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
        updatedUserCost: 0,
        userId :this.props.userId,
        appliedFilters:this.props.appliedFilters,
        refreshing: false
        };
  }

  openUpdateModal = () =>{this.setState({isUpdateModalVisible:true})}
  toggleUpdateModal = () =>{this.setState({isUpdateModalVisible:!this.state.isUpdateModalVisible})}
  closeUpdateModal = () =>{this.setState({isUpdateModalVisible:false, updatedUserCost: 0})}

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

    updateEnergy = (userId, energy) => {
        console.log("Set Updated item :", energy)
        fetch(BaseUrl+'updateEnergy', {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': "Basic " + base64.encode("iPolluteUserName:iPolluteHiddenPassword#901")
        },
        body: JSON.stringify({
            userId: this.state.userId,
            energyId: this.state.updatedItem.energyId,
            userCost: this.state.updatedUserCost,
            energyItemId: this.state.updatedItem.energyItem,
            energyTypeId: this.state.updatedItem.energyType
        }),
        method: 'POST'
        })
        .then((response) => response.json())
        .then((responseJson) => {
            // console.log(responseJson);
            if(responseJson['success'] == true){
                alert("Energy updated Succefully");
                this.props._fetchData(this.state.userId, this.state.appliedFilters)
                this.closeUpdateModal()
                }
            else{
                alert("Energy updated Failed", userId, energy);
            }
            
        })
        .catch((error) => {
            console.error(error);
            alert("Update Failed", userId, energy);
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
    this.setState({updatedItem: item}, () =>{
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


  updateUserCost = (cost) => {this.setState({ updatedUserCost: cost })}

 renderEmptyList = () => {
     return (
         <View style = {{height: 100, flex : 1, justifyContent:'center'}}>
             <Text style = {{textAlign: 'center'}}> Empty History </Text>
             <Text style = {{textAlign: 'center'}}> Please add your last transport and recycling actions </Text>
         </View>
        )
 }
 
 
 renderItem = ({ item }) => {

    var itemIcon = <FontAwesome name="train-car" size={24} color={Colors.primaryColor} /> 
    if (item.energyItem === 1 & item.energyType === 1){
        itemIcon = <FontAwesome name="plane" size={24} color={Colors.primaryColor}/>
    }
    else if (item.energyItem === 2 & item.energyType === 1){
        itemIcon = <Ionicons name="car" size={24} color={Colors.primaryColor} />
    }
    else if (item.energyItem === 3 && item.energyType == 1){
        itemIcon = <Ionicons name="car" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyItem === 4 & item.energyType === 1){
        itemIcon = <FontAwesome name="bus" size={24} color={Colors.primaryColor} />    
    }    
    else if (item.energyItem === 5 && item.energyType == 1 ){
        itemIcon = <FontAwesome name="plane" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyItem === 6 &&  item.energyType == 1){
        itemIcon = <FontAwesome name="plane" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyItem === 7 && item.energyType === 1){
        itemIcon = <FontAwesome name="motorcycle" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyItem === 9 & item.energyType === 1){
        itemIcon = <Ionicons name="train" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyItem === 10 & item.energyType === 1){
        itemIcon = <FontAwesome name="ship" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyItem === 8 & item.energyType === 1 ){
        itemIcon = <MaterialCommunityIcons name="car-electric" size={24} color={Colors.primaryColor} />
    }
    else if (item.energyItem === 11 & item.energyType === 1 ){
        itemIcon = <Ionicons name="train" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyItem === 12 & item.energyType === 1 ){
        itemIcon = <Ionicons name="bicycle" size={24} color={Colors.primaryColor} />
    }
    else if (item.energyType === 0 ){
        itemIcon = <Ionicons name="fast-food" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyType === 1 ){
        itemIcon = <Ionicons name="car" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyType === 2 ){
        itemIcon = <MaterialCommunityIcons name="recycle" size={24} color= {Colors.primaryColor} />
    }  
    else if (item.energyItem === 2 & item.energyType === 3  ){
        itemIcon = <FontAwesome name="bolt" size={24} color= {Colors.primaryColor} />
    }
    else if (item.energyType === 3){
        itemIcon = <FontAwesome name="home" size={24} color= {Colors.primaryColor} />
    }  


    var stringCost = "Energy"
    var actionType = ''
    if (item.energyType === 0 ){
        stringCost = "Kg"
        actionType = "Produced"
    }
    else if (item.energyType === 1 ){
        stringCost = "Km"
        actionType = "Produced"
    }
    else if (item.energyType === 2 ){
        stringCost = "Kg "
        actionType = "Recycled"
    }
    else if (item.energyType === 3 ){
        stringCost = "KWh"
        actionType = "Produced"
    }
 

    var userDate = new Date(item.energyDate)
    var userDateMonth = parseInt(userDate.getMonth() , 10 ) + 1;
    var userDate2 = userDate.getDate() +'/'+ userDateMonth + '/'  + userDate.getFullYear() + ' -' + ' '  + String(userDate.getHours()).padStart(2, '0') + ":" + String(userDate.getMinutes()).padStart(2, '0')

    return (

            <View style={styles.item} >
                        

                <View style={styles.iconStyles}>
                    {itemIcon}
                </View>
                <View style = {styles.itemTexts}>
                    <Text style={styles.textDescription}>{item.description}: {item.userCost} {stringCost}</Text> 
                    <Text style={styles.textDate}> {userDate2}  </Text> 
                    {/* <Text style={styles.textDate}> {userDate2} </Text> */}
                    {/* <Text style={styles.text}> {actionType} C02: {item.totalCost.toFixed(1)} Kg</Text> */}
                </View>
                <View style={styles.iconStylesEdit}>
                    <View>
                        <Text style={styles.textCO2}> {item.totalCost.toFixed(1)} Kg</Text>
                        <Text style={styles.textCO2Unit}> CO2</Text>

                    </View>

                    <View style={styles.marginRight} >
                        <TouchableOpacity onPress={()=>this.setUpdateItem(item)}>
                            <MaterialCommunityIcons name="pencil" size={25} color={Colors.primaryColor} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.marginLeft}>

                        <TouchableOpacity onPress={ ()=>this.setDeletedItem(item)}>
                            <MaterialCommunityIcons name="delete" size={25} color={Colors.primaryColor} />
                        </TouchableOpacity>

                    </View>

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
                ListEmptyComponent={this.renderEmptyList()}
            />
              
              {/* <Timeline
                //..other props
                data={dataList}
                renderItem={this.renderItem}
                keyExtractor={(item) => item.energyId.toString()}
                circleSize={20}
                circleColor='rgb(45,156,219)'
                lineColor='rgb(45,156,219)'
                timeContainerStyle={{minWidth:52, marginTop: -5}}
                timeStyle={{textAlign: 'center', backgroundColor:'#ff9797', color:'white', padding:5, borderRadius:13}}
                descriptionStyle={{color:'gray'}}
                options={{
                  style:{paddingTop:5}
                }}
              /> */}


            {  this.state.isDeleteModalVisible &&
                
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.isDeleteModalVisible} 
                    onBackdropPress={() => {this.closeDeleteModal()}}

                >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style = {styles.title}>Delete Action</Text>

                        <Text style = {styles.textModal}>Do you want to delete this action ? </Text>
                        <Text></Text>
                
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
                    onBackdropPress={() => {this.closeUpdateModal()}}
                >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style = {styles.title}>Update {this.state.updatedItem.description}</Text>
                                 
                        <Text> Current value is: {this.state.updatedItem.userCost}
                        
                        </Text>
                        <Text > Updated value: {this.state.updatedUserCost}</Text>
 
                            <Slider
                                value={this.state.updatedUserCost}
                                onValueChange={this.updateUserCost}
                                maximumValue={1000}
                                minimumValue={1}
                                step={1}
                                trackStyle={{ height: 10, backgroundColor: 'transparent' }}
                                thumbStyle={{ height: 20, width: 20, backgroundColor: Colors.primaryColor }}
                            /> 
                        <View style={{flexDirection:'row'}}>
                            <TouchableOpacity style={{backgroundColor:Colors.red,width:'50%'}} onPress={()=>this.closeUpdateModal()}>
                                <Text style={{color:'white',textAlign:'center',padding:10}}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={{backgroundColor:Colors.primaryColor,width:'50%'}} onPress={()=>this.updateEnergy()}>
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
        
        flexDirection: 'row',
        height: 70,
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
        flex:1, 
        alignSelf: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderBottomColor: 'grey',
        alignItems: 'flex-start',
    },
    marginLeft: {
        marginLeft: 4,
    },
    marginRight: {
        marginRight: 5,
        marginLeft: 8
    },
    text: {
        fontSize: 12,
        fontWeight: 'bold',
        marginLeft: 10,
        
    },
    textCO2: {
        fontSize: 14,
        fontWeight: 'bold',
        marginLeft: 10,
        
    },
    textCO2Unit: {
        fontSize: 10,
        marginLeft: 10,
        justifyContent:'center',
        alignItems: 'center',
        alignSelf: 'center'
    },
    textDescription:{
        fontSize: 13,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    textDate:{
        fontSize: 12,
        marginLeft: 10,
    },
    textModal: {
        fontSize: 12,
        margin: 10,  
    },
    iconStyles:{
        width: "10%",
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: "center",
        marginLeft:5,
    },
    iconStylesEdit:{
        flex:1,
        flexDirection: 'row',
        justifyContent: "flex-end",
        marginLeft:5,
        marginRight: 10,
        alignSelf: 'stretch',
        alignItems: 'center',
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