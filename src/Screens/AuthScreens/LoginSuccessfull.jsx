import {Box, Flex, Text} from '@react-native-material/core';
import React from 'react';
import {Image, ScrollView, StyleSheet, View} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

const styles = StyleSheet.create({
  tickLogo: {
    width: 97,
    height: 97,
    // borderRadius: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outer: {
    flex: 1,
  },
});

export default function LoginSuccessfull() {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={{backgroundColor: 'red', flex: 1}}>
          <Image
            style={styles.tickLogo}
            source={require('../../assets/tick_icon.png')}
          />
          <Text variant="h3">Successfully Logged In</Text>
          <Text variant="body1">
            Lorem Ipsum is simply dummy text of the.Lorem Ipsum.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
