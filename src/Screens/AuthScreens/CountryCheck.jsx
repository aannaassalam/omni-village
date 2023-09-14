import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import StringsOfLanguages from '../../string'

const CountryCheck = ({route}) => {
  return (
    <View>
      <Text style={styles.text}>{StringsOfLanguages.how}</Text>
    </View>
  )
}

export default CountryCheck

const styles = StyleSheet.create({
    text:{
        fontFamily:'ubuntu_regular',
        fontSize:16,
        color:'black'
    }
})