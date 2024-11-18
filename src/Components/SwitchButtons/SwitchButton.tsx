import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { borderColor, primaryColor } from '../../styles/colors'
import CustomButton from '../CustomButton/CustomButton'
import { Styles, width } from '../../styles/globalStyles'

const SwitchButton = ({firstBtnText, selected, firstBtnPress, secondBtntext, secondBtnPress, label, nolabel=true}:{
    firstBtnText: string,
    secondBtntext: string,
    selected: string,
    firstBtnPress: () => void,
    secondBtnPress: () => void,
    label?:any,
    nolabel?:any,
}) => {
 const isFirstButtonSelected = selected === firstBtnText || selected === true;
 const isSecondButtonSelected =
   selected === secondBtntext || selected === false;
  return (
    <View style={styles.mainContainer}>
      {!nolabel && (
        <Text style={[Styles.fieldLabel, {marginTop: 0}]}>{label}</Text>
      )}
      <View style={styles.container}>
        <CustomButton
          btnText={firstBtnText}
          onPress={firstBtnPress}
          btnStyle={{
            color: isFirstButtonSelected ? 'white' : 'black',
          }}
          style={{
            width: width / 2.5,
            backgroundColor: isFirstButtonSelected ? primaryColor : borderColor,
          }}
        />
        <CustomButton
          btnText={secondBtntext}
          onPress={secondBtnPress}
          btnStyle={{
            color: isSecondButtonSelected ? 'white' : 'black',
          }}
          style={{
            width: width / 2.5,
            backgroundColor: isSecondButtonSelected
              ? primaryColor
              : borderColor,
          }}
        />
      </View>
    </View>
  );
}

export default SwitchButton

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  mainContainer: {
    borderColor: primaryColor,
    borderWidth: 1,
    padding: 12,
    borderRadius: 8,
    marginTop: '5%'
  },
});