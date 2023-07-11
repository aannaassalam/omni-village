import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import SvgUri from 'react-native-svg-uri';

const styles = StyleSheet.create({
  main_wrap: {},
  logo_image: {
    alignItems:'center',
    paddingBottom:100,
   
  },
  loginContainer: {
    paddingVertical: 52,
    paddingHorizontal: 20,
  },
  tinyLogo:{
    width:180
  }
});

export default function LoginWrapper({children}) {
  return (
    <View style={styles.main_wrap}>
      <View style={styles.loginContainer}>
        <View style={styles.logo_image}>
          <Image
            style={styles.tinyLogo}
            source={require('../../assets/logo.png')}
          />
          {/* <SvgUri source={require('../../assets/logo.svg')} /> */}
          
        </View>
        {children}
      </View>
    </View>
  );
}
