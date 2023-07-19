import React from 'react';
import {
  Image,
  StyleSheet,
  ScrollView,
  Text,
  View,
  Dimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import SvgUri from 'react-native-svg-uri';

const styles = StyleSheet.create({
  main_wrap: {
    flex: 1,
    backgroundColor: '#fff',
    position: 'relative',
  },
  logo_image: {
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 90,
  },
  logo_image_less_gap:{
    alignItems: 'center',
    paddingBottom: 20,
    marginBottom: 30,
  },
  loginContainer: {
    paddingVertical: 52,
    paddingHorizontal: 20,
    flex: 1,
  },
  tinyLogo: {
    width: '50%',
    height: 80,
    resizeMode: 'contain',
  },
});

export default function LoginWrapper({children, no_gap}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <View style={styles.main_wrap}>
          <View style={styles.loginContainer}>
            {no_gap ? (
              <View style={styles.logo_image_less_gap}>
                <Image
                  style={styles.tinyLogo}
                  source={require('../../../assets/logo.png')}
                  // height={100}
                />
                {/* <SvgUri source={require('../../assets/logo.svg')} /> */}
              </View>
            ) : (
              <View style={styles.logo_image}>
                <Image
                  style={styles.tinyLogo}
                  source={require('../../../assets/logo.png')}
                  // height={100}
                />
                {/* <SvgUri source={require('../../assets/logo.svg')} /> */}
              </View>
            )}

            {children}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
