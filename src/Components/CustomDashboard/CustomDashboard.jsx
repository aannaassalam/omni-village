import {StyleSheet, Text, View, useWindowDimensions, Image} from 'react-native';
import React from 'react';

const CustomDashboard = ({first, second, third}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={styles.topContainer}>
      <Text style={styles.topText}>{first}</Text>
      <Image
        source={require('../../../assets/right_black_arrow.png')}
        style={styles.arrow}
      />
      <Text style={[styles.topText, {color: '#000'}]}>{second}</Text>
      {third ? (
        <>
          <Image
            source={require('../../../assets/right_black_arrow.png')}
            style={styles.arrow}
          />
          <Text style={[styles.topText, {color: '#000'}]}>{third}</Text>
        </>
      ) : null}
    </View>
  );
};

export default CustomDashboard;

const makeStyles = fontScale =>
  StyleSheet.create({
    topContainer: {
      padding: 20,
      margin: 10,
      alignSelf: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      backgroundColor: '#D9D9D9',
      width: '90%',
      borderRadius: 5,
    },
    topText: {
      fontSize: 14 / fontScale,
      color: '#576A74',
      fontFamily: 'ubuntu_medium',
      // width: '25%',
      marginLeft: 5,
      textTransform: 'capitalize',
    },
    arrow: {
      alignSelf: 'center',
      height: 10,
      width: 8,
      left: 3,
      marginHorizontal: 10,
    },
  });
