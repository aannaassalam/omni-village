import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import {dark_grey, primary } from '../../styles/colors'
import { fontFamilyMedium } from '../../styles/fontStyle'
import { useNavigation } from '@react-navigation/native'

const HomeCardOptions = ({item, active, setActive}:{item:any, active?:any, setActive?:any}) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const navigation = useNavigation()
  return (
    <View key={item?.id}>
      <TouchableOpacity
        style={[
          styles.container,
          {backgroundColor: active === item?.title ? primary : dark_grey},
        ]}
        onPress={() => {
          setActive(item?.title);
          navigation.navigate(item?.navigation);
        }}>
        <Image source={item?.image} style={styles.image} />
      </TouchableOpacity>
      <Text
        style={[
          styles.name_txt,
          {color: active === item?.title ? primary : dark_grey},
        ]}>
        {item.title}
      </Text>
    </View>
  );
}

export default HomeCardOptions

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      borderColor: '#e4e4e7',
      borderWidth: 1,
      borderRadius: 4,
      backgroundColor: dark_grey,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: 8,
      marginHorizontal: 8,
    },
    name_txt: {
      fontSize: 13 / fontScale,
      fontFamily: fontFamilyMedium,
      color: dark_grey,
      textAlign: 'center',
      flexWrap: 'wrap',
      width: 80,
      marginVertical: 4,
      marginHorizontal: 8,
    },
    image:{
      height: 40,
      width: 40,
      resizeMode: 'contain',
    }
  });