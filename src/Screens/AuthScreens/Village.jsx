import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from '../../Components/CustomButton/CustomButton'
import { storage } from '../../Helper/Storage'

const Village = ({navigation}) => {
  return (
    <View style={styles.container}  >
      <Text style={styles.text}>Village</Text>
      <CustomButton onPress={()=>{
        storage.clearAll();
        navigation.replace('startup');
      }} btnText={'Logout'}/>
    </View>
  )
}

export default Village

const styles = StyleSheet.create({
  container:{
    flex:1
  },
  text:{
    color:'#000'
  }
})