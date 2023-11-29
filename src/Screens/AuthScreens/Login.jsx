import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation} from '@tanstack/react-query';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import CountryPicker from 'react-native-country-picker-modal';
import * as yup from 'yup';
import CustomButton from '../../Components/CustomButton/CustomButton';
import LoginInput from '../../Components/CustomInputField/LoginInput';
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper';
import {sentOtp} from '../../functions/AuthScreens';

export default function Login({navigation, route}) {
  const [inputVal, setInputVal] = useState('');
  const [api_err, setApi_err] = useState('');

  const [selectedCountry, setSelectedCountry] = useState({
    callingCode: ['60'],
    cca2: 'MY',
    currency: ['MYR'],
    name: 'Malaysia',
    region: 'Asia',
    subregion: 'South-Eastern Asia',
  });
  const [countryModal, setCountryModal] = useState(false);

  const {t} = useTranslation();

  const onSelectCountry = country => {
    setSelectedCountry(country);
  };

  const loginSchema = yup
    .object()
    .shape({
      phone: yup.string().required(t('phone number is required')),
    })
    .required();

  const {
    handleSubmit,
    setValue,
    control,
    watch,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(loginSchema),
  });
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  const {isPending, mutate} = useMutation({
    mutationFn: sentOtp,
    onSuccess: (data, variables) => {
      navigation.navigate('loginotp', variables);
    },
    onError: err => {
      if (err.response.status === 400) {
        setApi_err(err.response.data.message);
      }
      console.log(err.response.data.message);
    },
  });

  const FormSubmit = data => {
    mutate({
      ...data,
      country_code: `+${selectedCountry?.callingCode[0]}`,
      type: 'login',
    });
  };

  return (
    <LoginWrapper>
      <>
        <View style={styles.form_section}>
          <View style={styles.form_head}>
            <Text style={styles.LoginHead}>{t('login')}</Text>
            <Text style={styles.subtitle}>{t('login with sent OTP')}</Text>
          </View>
          <View style={styles.login_input}>
            <Controller
              control={control}
              name={'phone'}
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <LoginInput
                  placeholder={t('phone number')}
                  // label={'Phone Number'}
                  countryModal={() => setCountryModal(!countryModal)}
                  onChangeText={e => {
                    onChange(e);
                    setApi_err('');
                  }}
                  value={value}
                  keyboardType="number-pad"
                  countryCode={
                    selectedCountry !== null
                      ? '+' + selectedCountry?.callingCode[0]
                      : '+60'
                  }
                />
              )}
            />
            {errors.phone?.message.length > 0 && (
              <Text
                style={{
                  marginTop: 5,
                  marginLeft: 10,
                  color: '#ff000e',
                  fontFamily: 'ubuntu-regular',
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
                  fontFamily: 'ubuntu-regular',
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
              btnText={t('login')}
              onPress={handleSubmit(FormSubmit)}
              loading={isPending}
            />
          </View>
          <CountryPicker
            withCountryNameButton={false}
            containerButtonStyle={{
              display: 'none',
            }}
            withCurrency
            onClose={() => {
              setCountryModal(false);
            }}
            modalProps={{
              visible: countryModal,
            }}
            flatListProps={{
              renderItem: ({item}) => {
                return (
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      padding: 10,
                    }}
                    onPress={() => {
                      onSelectCountry(item);
                      setCountryModal(false);
                    }}>
                    <Image
                      source={{uri: item?.flag}}
                      resizeMode="contain"
                      style={{
                        width: 30,
                        height: 35,
                        marginRight: 10,
                      }}
                    />
                    <Text style={styles.text}> +{item?.callingCode}</Text>
                    <Text style={styles.text}> {item?.name}</Text>
                    <Text style={styles.text}> ({item.currency[0]})</Text>
                  </TouchableOpacity>
                );
              },
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
          <Text style={styles.register_text_frst}>
            {t("don't have an account")}
          </Text>
          <Pressable onPress={() => navigation.navigate('register')}>
            <Text style={styles.register_text_scnd}>{t('register')}</Text>
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
      fontFamily: 'ubuntu-medium',
    },
    text: {
      color: '#000',
      marginHorizontal: 2,
      fontSize: 16 / fontScale,
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
      fontFamily: 'ubuntu-medium',
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
      fontFamily: 'ubuntu-regular',
    },
    register_text_scnd: {
      color: '#268C43',
      fontSize: 14 / fontScale,
      marginLeft: 5,
      fontFamily: 'ubuntu-medium',
    },
  });
