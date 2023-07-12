import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  Image,
  View,
  Animated,
} from 'react-native';
import {transformer} from '../../metro.config';
// import LogoWhite from '../../assets/logo-white.svg';
// import {MMKV} from 'react-native-mmkv';

export const SplashScreen = ({isAppReady, children}) => {
  return (
    <>
      {isAppReady && children}

      <Splash isAppReady={isAppReady} />
    </>
  );
};

const LOADING_IMAGE = 'Loading image';
const FADE_IN_IMAGE = 'Fade in image';
const WAIT_FOR_APP_TO_BE_READY = 'Wait for app to be ready';
const FADE_OUT = 'Fade out';
const HIDDEN = 'Hidden';

export default function Splash({isAppReady}) {
  const [state, setState] = useState(LOADING_IMAGE);

  //   const storage = new MMKV();
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const imageOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (state === FADE_IN_IMAGE) {
      Animated.timing(imageOpacity, {
        toValue: 1,
        duration: 500, // Fade out duration
        delay: 50, // Minimum time the logo will stay visible
        useNativeDriver: true,
      }).start(() => {
        setState(WAIT_FOR_APP_TO_BE_READY);
      });
    }
  }, [state]);

  useEffect(() => {
    if (state === WAIT_FOR_APP_TO_BE_READY) {
      if (isAppReady) {
        setState(FADE_OUT);
      }
    }
  }, [isAppReady, state]);

  useEffect(() => {
    if (state === FADE_OUT) {
      Animated.timing(containerOpacity, {
        toValue: 0,
        duration: 1000, // Fade out duration
        delay: 500, // Minimum time the logo will stay visible
        useNativeDriver: true,
      }).start(() => {
        setState(HIDDEN);
      });
    }
  }, [containerOpacity, state]);

  if (state === HIDDEN) return null;

  return (
    <Animated.View
      collapsable={false}
      style={[styles.container, {opacity: containerOpacity}]}>
      <View style={styles.imageContainer}>
        <Animated.Image
          source={require('../../assets/logo-white.png')}
          resizeMode="cover"
          fadeDuration={0}
          onLoad={() => {
            setState(FADE_IN_IMAGE);
          }}
          style={[
            styles.logo,
            {
              opacity: imageOpacity,
            },
          ]}
        />
        {/* <Animated.View
          style={[
            styles.logo,
            {
              opacity: imageOpacity,
            },
          ]}> */}
        {/* <LogoWhite
            width={'50%'}
            onLoad={() => {
              setState(FADE_IN_IMAGE);
            }}
          /> */}
        {/* </Animated.View> */}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#268c43',
    position: 'absolute',
    top: 0,
    zIndex: 9999,
    alignItems: 'center',
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    justifyContent: 'center',
  },
  imageContainer: {
    // height: 180,
    width: Dimensions.get('window').width / 2,
    // backgroundColor: '#fafafa',
    //   backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 5,
  },
  logo: {
    // height: 60,
    width: '100%',
    resizeMode: 'contain',
    // width: '100%',
    // height: '100%',
    // borderWidth: 3,
    // borderColor: '#e9e9e9',
    // borderRadius: 9999,
    // transform: [{translateX: -999}],
    // marginBottom: 20,
  },
});
