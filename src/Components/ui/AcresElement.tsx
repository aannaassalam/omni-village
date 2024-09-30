import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import { Styles } from '../../styles/globalStyles'
import { fontFamilyRegular } from '../../styles/fontStyle'
import { borderColor, dark_grey } from '../../styles/colors'

const AcresElement = ({title}:{title:any}) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)
  return (
    <View style={styles.container}>
      <View style={Styles.verticalLine} />
      <Text style={styles.acres_txt}>{title}</Text>
    </View>
  );
}

export default AcresElement

const makeStyles = (fontScale:any) => StyleSheet.create({
    container: {
        paddingHorizontal: 12,
        marginRight: 12,
        alignItems:'center',
        flexDirection:'row',
        gap:10
    },
    acres_txt:{
        fontSize: 14 / fontScale,
        fontFamily: fontFamilyRegular,
        color: dark_grey
    }
})