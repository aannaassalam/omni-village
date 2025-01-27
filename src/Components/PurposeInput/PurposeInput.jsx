import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { fontFamilyMedium } from '../../styles/fontStyle'
import { fontScale } from '../../styles/globalStyles'
import Input from '../Inputs/Input'
import AcresElement from '../ui/AcresElement'
import { primaryColor } from '../../styles/colors'

const PurposeInput = ({ title, onChangeText, value, unit, placeholder, isRight }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headingText}>{title}</Text>
      <Input
        fullLength={false}
        placeholder={placeholder ? placeholder : 'Enter a value'}
        noLabel={true}
        main_width={'87%'}
        onChangeText={onChangeText}
        value={value}
        keyboardType="numeric"
        isRight={isRight ? isRight:
          <AcresElement title={unit} />
        }
      />
    </View>
  )
}

export default PurposeInput

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
    justifyContent: 'space-between'
  },
  headingText: {
    fontFamily: fontFamilyMedium,
    fontSize: 14 / fontScale,
    color: primaryColor,
    marginTop: 5,
    textTransform: 'capitalize',
    width: '20%'
  }
})