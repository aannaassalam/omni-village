import { StyleSheet, Text, View,Image,useWindowDimensions,TouchableOpacity } from 'react-native'
import React from 'react'

const Checkbox = ({ name, checked, checking }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
  return (
    <View style={styles.checkboxContainer}>
      <View style={{flexDirection: 'row'}}>
      <Text style={styles.textName}>{name}</Text>
      <TouchableOpacity onPress={checking}>
      {checked?
          <Image 
          style={styles.closeIcon}
          source={require('../../../assets/checked.png')}
          />
    :
        <Image
        style={styles.closeIcon}
        source={require('../../../assets/unchecked.png')}
        />  
    }
        </TouchableOpacity>
        </View>
    </View>
  )
}

export default Checkbox

const makeStyles = fontScale => StyleSheet.create({
    checkboxContainer:{
        width:'100%',
        padding:18,
        borderColor:'#C6F1D3',
        borderWidth:1,
        marginBottom:10,
        borderRadius:7,
    },
    textName:{
        fontFamily: 'ubuntu_medium',
        fontSize: 14 / fontScale,
        color: '#000',
        alignSelf: 'center',
        width: '95%',
    },
    closeIcon: {
        height: 20,
        width: 20,
        alignSelf: 'center',
    },
})