import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import React from 'react';
import {Styles} from '../../styles/globalStyles';
import {fontFamilyMedium, fontFamilyRegular} from '../../styles/fontStyle';
import {borderColor} from '../../styles/colors';

const AcresElement = ({title}: {title: any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={styles.container}>
      <View style={[Styles.verticalLine,{height:35, width:2, marginTop:0}]} />
      <Text style={styles.acres_txt}>{title}</Text>
    </View>
  );
};

export default AcresElement;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 6,
      marginRight: 12,
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 10,
    },
    acres_txt: {
      fontSize: 14 / fontScale,
      fontFamily: fontFamilyMedium,
      color: '#000',
      flexWrap: 'wrap',
      textAlign:'center',
      width: 45,
    },
  });
