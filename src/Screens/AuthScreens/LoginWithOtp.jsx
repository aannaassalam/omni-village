import React, { useEffect, useState } from 'react';
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
import {Box, Flex} from '@react-native-material/core';
import { useDispatch, useSelector } from 'react-redux';
import { LoginUser, RegisterUser } from '../../Redux/AuthSlice';



export default function LoginWithOtp({navigation}) {

  const {user,otpData} = useSelector((state)=>state.auth)

  console.log(user,"user")
  console.log(otpData,"otpData")

  const dispatch = useDispatch()

  const [otp1 , setOtp1] = useState("")
  const [otp2 , setOtp2] = useState("")
  const [otp3 , setOtp3] = useState("")
  const [otp4 , setOtp4] = useState("")

  const InputValueCallback1 = (data) =>{
    setOtp1(data)
  }
  const InputValueCallback2 = (data) =>{
    setOtp2(data)
  }
  const InputValueCallback3 = (data) =>{
    setOtp3(data)
  }
  const InputValueCallback4 = (data) =>{
    setOtp4(data)
  }


  const FormSubmit = () =>{
      const OTP = otp1 + otp2 + otp3 + otp4
      if(OTP.length === 4){
        dispatch(LoginUser({...user,otp:OTP})).unwrap().then(()=>navigation.navigate('loginsuccess')).catch((err)=>err && console.log(err,"err"))
      }
  }

  return (

      <LoginWrapper>
        <View style={styles.form_section}>
          <View style={styles.form_head}>
            <Text style={styles.LoginHead}>Login</Text>
            <Text>Enter OTP recieved in {`XXX${user?.phone?.slice(-2)}`}</Text>
          </View>
          <View style={styles.login_input}>
            <Flex style={styles.login_input_flex}>
              <InputTextComponent placeholder={'_'} className InputValueCallback={InputValueCallback1} value={otp1}/>
              <InputTextComponent placeholder={'_'} className InputValueCallback={InputValueCallback2} value={otp2}/>
              <InputTextComponent placeholder={'_'} className InputValueCallback={InputValueCallback3} value={otp3}/>
              <InputTextComponent placeholder={'_'} className InputValueCallback={InputValueCallback4} value={otp4}/>
            </Flex>
          </View>
          <View style={styles.login_submit}>
            <CustomButton btnText={'Confirm'} onPress={FormSubmit}/>
          </View>
          <Box style={styles.resend_sec}>
            <Flex style={styles.resend_text}>
              <Text style={styles.normal_text}>Haven’t received any?</Text>
              <Text
                style={styles.green}
                onPress={() => Linking.openURL('http://google.com')}>
                Resend
              </Text>
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
  normal_text: {
    color: '#36393B',
    fontSize: 13,
  },
});