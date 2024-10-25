import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { borderColor, primaryColor } from '../../styles/colors'
import CustomButton from '../CustomButton/CustomButton'
import { width } from '../../styles/globalStyles'

const SwitchButton = ({firstBtnText, selected, firstBtnPress, secondBtntext, secondBtnPress}:{
    firstBtnText: string,
    secondBtntext: string,
    selected: string,
    firstBtnPress: () => void,
    secondBtnPress: () => void
}) => {
  return (
    <View style={styles.container}>
      <CustomButton
        btnText={firstBtnText}
        onPress={firstBtnPress}
        btnStyle={{
          color: selected == secondBtntext || selected ? 'white' : 'black',
        }}
        style={{
          width: width / 2.5,
          backgroundColor:
            selected == firstBtnText || selected ? primaryColor : borderColor,
        }}
      />
      <CustomButton
        btnText={secondBtntext}
        onPress={secondBtnPress}
        btnStyle={{
          color: selected == secondBtntext || !selected ? 'white' : 'black',
        }}
        style={{
          width: width / 2.5,
          backgroundColor:
            selected == secondBtntext || !selected ? primaryColor : borderColor,
        }}
      />
    </View>
  );
}

export default SwitchButton

const styles = StyleSheet.create({
    container:{
        padding: 12,
        borderColor: primaryColor,
        borderWidth:1,
        marginVertical:8,
        borderRadius: 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
})