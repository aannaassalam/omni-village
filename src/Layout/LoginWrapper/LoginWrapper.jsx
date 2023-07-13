import React from 'react';
import {Image, StyleSheet, Text, View, Dimensions} from 'react-native';
import SvgUri from 'react-native-svg-uri';

const styles = StyleSheet.create({
  main_wrap: {
    // flex: 1,
    backgroundColor: '#fff',
  },
  logo_image: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  loginContainer: {
    paddingVertical: 52,
    paddingHorizontal: 20,
  },
  tinyLogo: {
    width: '50%',
    height: 80,
    resizeMode: 'contain',
  },
});

export default function LoginWrapper({children}) {
  return (
    <View style={styles.main_wrap}>
      <View style={styles.loginContainer}>
        <View style={styles.logo_image}>
          <Image
            style={styles.tinyLogo}
            source={require('../../../assets/logo.png')}
            // height={100}
          />
          {/* <SvgUri source={require('../../assets/logo.svg')} /> */}
        </View>
        {children}
      </View>
    </View>
  );
}
