import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CustomButton from '../CustomButton/CustomButton';
import {width} from '../../styles/globalStyles';

const NoData = ({title, onPress}: {title: any; onPress?: any}) => {
  return (
    <View
      style={{
        alignSelf: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={require('../../../assets/illustration.png')}
        style={styles.illustration}
      />
      <CustomButton
        btnText={title}
        onPress={onPress}
        style={{width: width / 2, marginTop: 16}}
      />
    </View>
  );
};

export default NoData;

const styles = StyleSheet.create({
  illustration: {
    marginTop: '30%',
    height: 300,
    width: 300,
    resizeMode: 'contain',
  },
});
