import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
  useWindowDimensions,
} from 'react-native';
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper';
import InputTextComponent from '../../Components/InputTextComponent/InputTextComponent';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useDispatch } from 'react-redux';
import { SendOTP } from '../../Redux/AuthSlice';
import { TextInput } from 'react-native-gesture-handler';
import { Scale } from '../../Helper/utils';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import LoginInput from '../../Components/CustomInputField/LoginInput';
import CountryPicker, {
  Country,
  CountryCode,
} from 'react-native-country-picker-modal';
export default function Login({ navigation, route }) {
  const dispatch = useDispatch();
  const [inputVal, setInputVal] = useState('');
  const [api_err, setApi_err] = useState('');

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [countryModal, setCountryModal] = useState(false);

  const onSelectCountry = (country) => {
    setSelectedCountry(country);
  };

  const loginSchema = yup
    .object()
    .shape({
      phone: yup.string().required('Phone number is required!'),
    })
    .required();

  const {
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
  });

  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);

  const FormSubmit = data => {
    dispatch(SendOTP({ ...data, type: 'login' }))
      .unwrap()
      .then(() => navigation.navigate('loginotp'))
      .catch(err => {
        if (err.status === 400) {
          setApi_err(err.data.message);
        }
        console.log(err.data.message);
      });
  };
  return (
    <LoginWrapper>
      <>
        <View style={styles.form_section}>
          <View style={styles.form_head}>
            <Text style={styles.LoginHead}>Login</Text>
            <Text style={styles.subtitle}>Login with sent OTP</Text>
          </View>
          <View style={styles.login_input}>
            <Controller
              control={control}
              name="phone"
              render={({ field: { onChange, onBlur, value, name, ref } }) => (
                <LoginInput
                  placeholder={'Phone Number'}
                  // label={'Phone Number'}
                  countryModal={() => setCountryModal(!countryModal)}
                  onChangeText={e => {
                    console.log("hereeeeeee", e)
                    onChange(e);
                    setApi_err('');
                  }}
                  value={value}
                  keyboardType="number-pad"
                  countryCode={selectedCountry !== null ? '+' + selectedCountry?.callingCode[0] : '+91'}
                />
              )}
            />
            {errors.phone?.message.length > 0 && (
              <Text
                style={{
                  marginTop: 5,
                  marginLeft: 10,
                  color: '#ff000e',
                  fontFamily: 'ubuntu_regular',
                }}>
                {errors.phone.message}
              </Text>
            )}
            {api_err.length > 0 && (
              <Text
                style={{
                  marginTop: 5,
                  marginLeft: 10,
                  color: '#ff000e',
                  fontFamily: 'ubuntu_regular',
                }}>
                {api_err}
              </Text>
            )}
            {/* <TextInput
            placeholder={'Phone Number'}
            onChangeText={setInputVal}
            value={inputVal.toString()}
            keyboardType="number-pad"
          /> */}
          </View>
          <View style={styles.login_submit}>
            <CustomButton
              btnText={'Login'}
              onPress={handleSubmit(FormSubmit)}
            />
          </View>
          <CountryPicker
            withCountryNameButton={false}
            containerButtonStyle={{
              display:'none'
            }}
            withCurrency
            onClose={() => {
              setCountryModal(false)
            }}
            modalProps={{
              visible: countryModal
            }}
            flatListProps={{
              renderItem: ({ item }) => {
                return (
                  <TouchableOpacity style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10
                  }}
                    onPress={() => {
                      onSelectCountry(item)
                      setCountryModal(false)
                    }}
                  >
                    <Image
                      source={{ uri: item?.flag }}
                      resizeMode='contain'
                      style={{
                        width: 30,
                        height: 35,
                        marginRight: 10
                      }}
                    />
                    <Text style={styles.text}>{' '}+{item?.callingCode}</Text>
                    <Text style={styles.text}>{' '}{item?.name}</Text>
                    <Text style={styles.text}>{' '}({item.currency[0]})</Text>
                  </TouchableOpacity>
                )
              }
            }}
            countryCodes={['IN', 'BT', 'MY']}
            onSelect={onSelectCountry}
            withCallingCode
            withEmoji={false}
            withFilter
          />
        </View>
        {/* <View style={styles.form_btm}>
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
      </View> */}
        <View style={styles.register_text}>
          <Text style={styles.register_text_frst}>Don’t have an account?</Text>
          <Pressable onPress={() => navigation.navigate('register')}>
            <Text style={styles.register_text_scnd}>Register</Text>
          </Pressable>
        </View>
      </>
    </LoginWrapper>
  );
}

const makeStyles = fontScale =>
  StyleSheet.create({
    form_section: {
      alignItems: 'center',
      marginTop: 30,
      // marginBottom: 20,
    },
    LoginHead: {
      color: '#36393B',
      fontSize: 22 / fontScale,
      marginBottom: 10,
      textAlign: 'center',
      fontFamily: 'ubuntu_medium',
    },
    text: {
      color: '#000',
      marginHorizontal: 2,
      fontSize: 16 / fontScale
    },
    subtitle: {
      fontFamily: 'ubuntu',
      color: '#36393B',
      fontSize: 14 / fontScale,
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
      marginBottom: 20,
    },
    login_text: {
      textAlign: 'center',
      // position: 'relative',
      zIndex: 5,
      height: 28,
      backgroundColor: '#fff',
      width: 100,
      fontSize: 14 / fontScale,
      color: '#5C6066',
      fontFamily: 'ubuntu_medium',
    },
    form_btm_text: {
      width: '100%',
      marginBottom: 40,
      alignItems: 'center',
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
      width: '100%',
    },
    register_text: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: 'auto',
      // alignSelf: 'center',
      alignItems: 'center',
    },
    register_text_frst: {
      fontSize: 14 / fontScale,
      color: '#36393B',
      fontFamily: 'ubuntu_regular',
    },
    register_text_scnd: {
      color: '#268C43',
      fontSize: 14 / fontScale,
      marginLeft: 5,
      fontFamily: 'ubuntu_medium',
    },
  });
