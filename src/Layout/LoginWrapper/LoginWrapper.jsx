import React from 'react';
import {
  Image,
  StyleSheet,
  ScrollView,
  Text,
  View,
  KeyboardAvoidingView,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
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
    marginBottom: 20,
  },
  logo_image_less_gap: {
    alignItems: 'center',
    paddingBottom: 20,
    // marginBottom: 30,
  },
  loginContainer: {
    paddingVertical: 52,
    paddingHorizontal: 20,
    flex: 1,
    paddingBottom: 30,
  },
  tinyLogo: {
    width: '55%',
    height: 80,
    resizeMode: 'contain',
  },
});

export default function LoginWrapper({children, no_gap}) {
  return (
    <SafeAreaView style={{flex: 1}} edges={['top', 'left', 'right']}>
      <KeyboardAwareScrollView
        behavior="padding"
        keyboardShouldPersistTaps="handled"
        // contentContainerStyle={[!no_gap && {flex: 1}]}
        // style={[no_gap && {flex: 1}]}>
        style={no_gap && {flex: 1}}
        contentContainerStyle={!no_gap && {flex: 1}}>
        <View style={styles.main_wrap}>
          <View style={styles.loginContainer}>
            <View
              style={[no_gap ? styles.logo_image_less_gap : styles.logo_image]}>
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
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
