import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper';

export default function StartupScreen() {
  return (
    <SafeAreaView>
      <LoginWrapper></LoginWrapper>
    </SafeAreaView>
  );
}
