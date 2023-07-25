import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Linking,
} from 'react-native';
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper';
import InputTextComponent from '../../Components/InputTextComponent/InputTextComponent';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {Box, Flex, Pressable} from '@react-native-material/core';
import {useDispatch, useSelector} from 'react-redux';
import {LoginUser, RegisterUser, SendOTP} from '../../Redux/AuthSlice';
import OtpInput from '../../Components/OtpInputs';

export default function LoginWithOtp({navigation}) {
  const {user} = useSelector(state => state.auth);

  const [timer, setTimer] = useState(30);
  const [otp, setOtp] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const interval = setInterval(
      () => setTimer(prev => (prev > 0 ? prev - 1 : 0)),
      1000,
    );

    return () => {
      clearInterval(interval);
    };
  });

  const FormSubmit = () => {
    if (otp.length === 4) {
      dispatch(LoginUser({...user, otp}))
        .unwrap()
        .then(() => {
          navigation.navigate('loginsuccess');
        })
        .catch(err => console.log(err, 'err'));
    }
  };

  return (
    <LoginWrapper>
      <View style={styles.form_section}>
        <View style={styles.form_head}>
          <Text style={styles.LoginHead}>Login</Text>
          <Text>Enter OTP recieved in {`XXX${user?.phone?.slice(-2)}`}</Text>
        </View>
        <View style={styles.login_input}>
          <OtpInput setParentOtp={setOtp} />
        </View>
        <View style={styles.login_submit}>
          <CustomButton btnText={'Confirm'} onPress={FormSubmit} />
        </View>
        <Box style={styles.resend_sec}>
          <Flex style={styles.resend_text}>
            <Text style={styles.normal_text}>Haven’t received any?</Text>
            <Pressable
              onPress={() =>
                timer === 0 ? dispatch(SendOTP(user.phone)) : null
              }>
              <Text style={[timer === 0 ? styles.green : styles.low_green]}>
                Resend
              </Text>
            </Pressable>
          </Flex>
          <Text style={styles.normal_text}>00:00</Text>
        </Box>
      </View>
    </LoginWrapper>
  );
}

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
  login_input_flex: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  resend_sec: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 25,
  },
  resend_text: {
    flexDirection: 'row',
    alignItems: 'cenetr',
  },
  green: {
    color: `#268C43`,
    fontSize: 13,
    marginLeft: 6,
  },
  low_green: {
    color: `#268c4387`,
    fontSize: 13,
    marginLeft: 6,
  },
  normal_text: {
    color: '#36393B',
    fontSize: 13,
  },
});
