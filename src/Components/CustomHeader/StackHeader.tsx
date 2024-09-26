import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { primary } from '../../styles/colors';
import { fontFamilyBold } from '../../styles/fontStyle';
import { useNavigation } from '@react-navigation/native';

const StackHeader = ({title, style}:{title:any, style?:any}) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const navigation = useNavigation()
  return (
    <View style={[styles.container,style]}>
      <TouchableOpacity onPress={()=>navigation.goBack()}>
        <AntDesign name={'left'} color={primary} size={24}/>
      </TouchableOpacity>
      <Text style={styles.header_txt}>{title}</Text>
      <View style={{width: 30}}/>
    </View>
  )
}

export default StackHeader

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      paddingHorizontal: 22,
      paddingVertical: 32,
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    header_txt:{
        fontSize: 20/fontScale,
        fontFamily: fontFamilyBold,
        color: '#000',
        textAlign:'center',
        alignSelf:'center'
    }
  });