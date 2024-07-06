import { Dimensions, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { primaryColor } from '../../styles/colors'
import { fontFamilyMedium, fontFamilyRegular } from '../../styles/fontStyle'

const InputWithTitle = ({ productName, onChangeText, value, multiline, numberOfLines, keyboardType }) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)
  return (
    <View style={styles.container}>
      <Text style={styles.header_txt}>{productName}</Text>
      <TextInput
      style={styles.input_txt}
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      value={value}
      multiline={multiline}
      numberOfLines={numberOfLines}
      />
    </View>
  )
}

export default InputWithTitle
const {width} = Dimensions.get('window')
const makeStyles = fontScale => StyleSheet.create({
    container:{
        backgroundColor:'#fff',
        borderColor: '#c6f1d3',
        borderWidth: 1,
        borderRadius: 6,
        marginTop: '5%',
        width: width/1.12,
        alignSelf:'center',
        paddingHorizontal: 12
    },
    header_txt:{
        fontSize: 12/fontScale,
        fontFamily: fontFamilyMedium,
        color: primaryColor,
        paddingTop:10,
        paddingVertical: 4,
    },
    input_txt:{
        fontSize: 14/fontScale,
        fontFamily: fontFamilyRegular,
        paddingVertical: 2,
        height: 30,
        textAlignVertical: 'top',
        color:'#000',
        paddingHorizontal: -2,
    }
})