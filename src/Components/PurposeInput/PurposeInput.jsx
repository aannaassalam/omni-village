import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { fontFamilyMedium } from '../../styles/fontStyle'
import { fontScale } from '../../styles/globalStyles'
import Input from '../Inputs/Input'
import AcresElement from '../ui/AcresElement'
import { primaryColor } from '../../styles/colors'

const PurposeInput = ({ title, onChangeText, value, unit }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>{title}</Text>
      <Input
      fullLength={false}
      placeholder="Enter purpose"
      noLabel={true}
      main_width={'87%'}
      onChangeText={onChangeText}
              value={value}
              keyboardType="numeric"
              isRight={
                  <AcresElement title={unit} />
              }
      />
    </View>
  )
}

export default PurposeInput

const styles = StyleSheet.create({
    container:{
        flexDirection:'row',
        alignItems:'center',
        gap:12,
        marginVertical: 8
    },
    headingText:{
        fontFamily: fontFamilyMedium,
        fontSize: 14 / fontScale,
        color: primaryColor,
        marginTop: 5,
    }
})