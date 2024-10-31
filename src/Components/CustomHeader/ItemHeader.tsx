import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { primaryColor } from '../../styles/colors'
import { fontScale } from '../../styles/globalStyles'
import { fontFamilyMedium, fontFamilyRegular } from '../../styles/fontStyle'

const ItemHeader = ({title}:{title:string}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subText}>Dashboard</Text>
    </View>
  )
}

export default ItemHeader

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ececec',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginVertical: 30,
  },
  title:{
    color: primaryColor,
    fontSize: 18/fontScale,
    fontFamily: fontFamilyMedium
  },
  subText:{
    color: '#000',
    fontSize: 14/fontScale,
    fontFamily: fontFamilyRegular,
    marginTop: 8
  }
});