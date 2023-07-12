import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper';
import InputTextComponent from '../../Components/InputTextComponent/InputTextComponent';
import CustomButton from '../../Components/CustomButton/CustomButton';

const styles = StyleSheet.create({
  form_section: {
    alignItems: 'center',
  },
  LoginHead: {
    color: '#36393B',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  login_input: {
    width: '100%',
  },
  form_head: {
    marginBottom: 35,
  },
  login_submit:{
    marginTop:20,
    width:'100%'
  }
});

export default function Login() {
  return (
    <SafeAreaView>
      <LoginWrapper>
        <View style={styles.form_section}>
          <View style={styles.form_head}>
            <Text style={styles.LoginHead}>Login</Text>
            <Text>Login with sent OTP</Text>
          </View>
          <View style={styles.login_input}>
            <InputTextComponent placeholder={'Phone Number'} />
          </View>
          <View style={styles.login_submit}>
            <CustomButton btnText={'Login'} />
          </View>
        </View>
      </LoginWrapper>
    </SafeAreaView>
  );
}
