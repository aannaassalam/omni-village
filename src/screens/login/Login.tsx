import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import { Styles, width } from '../../styles/globalStyles'
import { fontFamilyBold, fontFamilyRegular } from '../../styles/fontStyle'
import { dark_grey, primary } from '../../styles/colors'
import Input from '../../Components/Inputs/Input'
import {CountryPicker} from 'react-native-country-codes-picker';
import CustomButton from '../../Components/CustomButton/CustomButton'
import {useFormik} from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux'
import { reqSuccess } from '../../redux/auth/actions'

const Login = ({navigation}:{navigation:any}) => {
  const {fontScale} = useWindowDimensions()
  const styles = makeStyles(fontScale)
  const [show,setShow]=useState(false)
  const dispatch=useDispatch()
  const [countryCode, setCountryCode]=useState('+91')
   let loginSchema = Yup.object().shape({
     phone: Yup.string()
       .matches(/^[0-9]{10}$/, 'Mobile number must be exactly 10 digits')
       .required('Mobile number is required'),
   });
   const {
     handleChange,
     handleSubmit,
     values,
     errors,
     setFieldTouched,
     touched,
     resetForm,
   } = useFormik({
     initialValues: {
       phone: '',
     },
     validationSchema: loginSchema,
     onSubmit: async (values: any) => {
      dispatch(reqSuccess())
     },
   });
  return (
    <View style={styles.container}>
      <Image source={require('../../../assets/logo.png')} style={styles.logo} />
      <View style={Styles.mainContainer}>
        <View>
          <Text style={styles.heading}>Login</Text>
          <Text style={styles.subheading}>
            Welcome back you’ve been missed!
          </Text>
        </View>
        <Input
          onChangeText={handleChange('phone')}
          value={values?.phone}
          placeholder="Enter phone"
          fullLength={true}
          phone={() => setShow(true)}
          countryCode={countryCode}
        />
        {errors?.phone && (
          <Text style={Styles.error}>{String(errors?.phone)}</Text>
        )}
      </View>
      <Text style={[styles.subheading, {bottom: 130, alignSelf: 'center'}]}>
        Dont have an account ?<Text style={{color: primary}} onPress={()=>navigation.navigate('signup')}> Signup</Text>{' '}
      </Text>
      <View style={Styles.bottomBtn}>
        <CustomButton onPress={handleSubmit} btnText={'Login'} />
      </View>
      <CountryPicker
        show={show}
        lang={'en'}
        showOnly={['IN', 'MY', 'BT']}
        onBackdropPress={() => setShow(false)}
        style={{
          // Styles for whole modal [View]
          modal: {
            height: 500,
            // backgroundColor: 'red',
          },
          textInput: {
            height: 50,
            color: '#000',
            // borderRadius: 0,
          },
          // Styles for country button [TouchableOpacity]
          countryButtonStyles: {
            height: 70,
          },
          dialCode: {
            color: 'black',
          },
          countryName: {
            color: 'black',
          },
          searchMessageText: {
            color: 'black',
          },
        }}
        pickerButtonOnPress={(item: any) => {
          setCountryCode(item.dial_code);
          setShow(false);
        }}
      />
    </View>
  );
}

export default Login

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    logo: {
      width: '60%',
      resizeMode: 'contain',
      alignSelf: 'center',
      marginTop: 50,
    },
    heading: {
      fontSize: 20 / fontScale,
      fontFamily: fontFamilyBold,
      color: dark_grey,
      textAlign: 'left',
    },
    subheading: {
      fontSize: 16 / fontScale,
      color: dark_grey,
      fontFamily: fontFamilyRegular,
      alignSelf: 'flex-start',
      textAlign: 'left',
      marginTop: '2%',
    },
  });