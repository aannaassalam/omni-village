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

export default function LoginWrapper({children}) {
  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flex: 1}}>
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
      </ScrollView>
    </SafeAreaView>
  );
}
