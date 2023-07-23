import {Box, Flex, Text} from '@react-native-material/core';
import React, {useEffect} from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {CheckToken} from '../../Helper/CheckToken';

const styles = StyleSheet.create({
  tickLogo: {
    width: 97,
    height: 97,
    flexDirection: 'row',
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
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 269,
    marginHorizontal: 'auto',
  },
});

export default function LoginSuccessfull({navigation}) {
  useEffect(() => {
    if (CheckToken()) {
      setTimeout(() => {
        navigation.navigate('home');
      }, 3000);
    }
  }, [CheckToken()]);

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <View style={styles.inner}>
          <Image
            style={styles.tickLogo}
            source={require('../../../assets/tick_icon.png')}
          />
          <Text
            variant="h3"
            style={{fontSize: 22, color: '#263238', marginBottom: 20}}>
            Successfully Logged In
          </Text>
          <Text variant="body1" style={styles.normalText}>
            Lorem Ipsum is simply dummy text of the.Lorem Ipsum.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
