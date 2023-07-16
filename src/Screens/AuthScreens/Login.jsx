import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper';
import InputTextComponent from '../../Components/InputTextComponent/InputTextComponent';
import CustomButton from '../../Components/CustomButton/CustomButton';

const styles = StyleSheet.create({
  form_section: {
    alignItems: 'center',
    // flex: 1,
    paddingTop: 50,
  },
  LoginHead: {
    color: '#36393B',
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'ubuntu_medium',
  },
  subtitle: {
    fontFamily: 'ubuntu',
    color: '#36393B',
  },
  login_input: {
    width: '100%',
  },
  form_head: {
    marginBottom: 35,
  },
  login_submit: {
    marginTop: 20,
    width: '100%',
  },
  socialbuttons: {},
  form_btm: {
    marginTop: 40,
  },
  login_text: {
    textAlign: 'center',
    position: 'relative',
    zIndex: 5,
    height: 30,
    // backgroundColor: '#fff',
  },
  form_btm_text: {
    width: '100%',
    marginBottom: 40,
  },
  social_btn: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  line_border: {
    flexDirection: 'row',
    height: 2,
    backgroundColor: '#EBEBEB',
    marginTop: -20,
  },
  register_text: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 150,
  },
  register_text_frst: {},
  register_text_scnd: {
    color: '#268C43',
    fontSize: 13,
    marginLeft: 5,
  },
});

export default function Login({navigation, route}) {
  return (
    <SafeAreaView>
      <LoginWrapper>
        <View style={styles.form_section}>
          <View style={styles.form_head}>
            <Text style={styles.LoginHead}>Login</Text>
            <Text style={styles.subtitle}>Login with sent OTP</Text>
          </View>
          <View style={styles.login_input}>
            <InputTextComponent placeholder={'Phone Number'} />
          </View>
          <View style={styles.login_submit}>
            <CustomButton
              btnText={'Login'}
              onPress={() => navigation.navigate('loginotp')}
            />
          </View>
        </View>
        <View style={styles.form_btm}>
          <View style={styles.form_btm_text}>
            <Text style={styles.login_text}>Or login with</Text>
            <View style={styles.line_border}></View>
          </View>
          <View style={styles.social_btn}>
            <Image
              style={styles.socialbuttons}
              source={require('../../../assets/socialbuttons.png')}
            />
          </View>
        </View>
        <View style={styles.register_text}>
          <Text style={styles.register_text_frst}>Don’t have an account?</Text>
          <Text style={styles.register_text_scnd}>Register</Text>
        </View>
      </LoginWrapper>
    </SafeAreaView>
  );
}
