import {Box, Flex, Text} from '@react-native-material/core';
import React, {useEffect} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CheckToken} from '../../Helper/CheckToken';
import {StackActions, NavigationAction} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {useUser} from '../../Hooks/useUser';
import {storage} from '../../Helper/Storage';

export default function LoginSuccessfull({navigation}) {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  const {t} = useTranslation();

  const {data: user} = useUser();

  useEffect(() => {
    const timeout = setTimeout(() => {
      storage.set('user', JSON.stringify(user));
      navigation.replace('home');
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#fff'}}
      edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <View style={styles.inner}>
          <Image
            style={styles.tickLogo}
            source={require('../../../assets/tick_icon.png')}
          />
          <Text
            variant="h3"
            style={{
              fontSize: 22 / fontScale,
              color: '#263238',
              marginBottom: 15,
              fontFamily: 'ubuntu-medium',
            }}>
            {t('successfully logged in')}
          </Text>
          <Text variant="body1" style={styles.normalText}>
            {t('lorem ipsum is simply dummy text of the.Lorem Ipsum.')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const makeStyles = fontScale =>
  StyleSheet.create({
    tickLogo: {
      width: 97,
      height: 97,
      // flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 20,
    },
    inner: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 15,
    },
    normalText: {
      color: '#263238',
      fontSize: 14 / fontScale,
      textAlign: 'center',
      maxWidth: 269,
      marginHorizontal: 'auto',
      fontFamily: 'ubuntu-regular',
      lineHeight: 15,
    },
  });
