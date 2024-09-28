import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import {Styles} from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {
  fontFamilyBold,
  fontFamilyMedium,
  fontFamilyRegular,
} from '../../styles/fontStyle';
import {dark_grey, light_grey, primary} from '../../styles/colors';
import AlertModal from '../../Components/Popups/AlertModal';
import {useDispatch} from 'react-redux';
import {reqSuccess} from '../../redux/auth/actions';
const VerifyOtp = ({navigation, route}: {navigation: any; route: any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {mobile} = route.params;
  const [code, setCode] = useState('');
  const [verified, setVerified] = useState(false);
  const dispatch = useDispatch();
  const [timer, setTimer] = useState(30);
  useEffect(() => {
    const interval = setInterval(
      () => setTimer(prev => (prev > 0 ? prev - 1 : 0)),
      1000,
    );

    return () => {
      clearInterval(interval);
    };
  }, []);
  const onResend = () => {
    let data = {
      token: '',
    };
    setTimer(30);
  };
  return (
    <View style={styles.container}>
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Verification</Text>
        <Text style={styles.loginDescription}>
          Please verify the OTP below that we have sent to your Mobile Number .
        </Text>
        <Text style={styles.otpText}>OTP Sent to: </Text>
        <Text
          style={{
            color: primary,
            fontFamily: fontFamilyRegular,
            marginTop: 8,
            fontSize: 18 / fontScale,
          }}>
          {mobile}
        </Text>

        <View style={styles.otpView}>
          <OTPInputView
            style={{width: '60%', height: 80}}
            pinCount={6}
            // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            onCodeChanged={c => {
              setCode(c);
            }}
            autoFocusOnLoad
            keyboardType="number-pad"
            placeholderTextColor={'black'}
            codeInputFieldStyle={styles.underlineStyleBase}
            codeInputHighlightStyle={styles.underlineStyleHighLighted}
            onCodeFilled={code => {
              console.log(`Code is ${code}, you are good to go!`);
            }}
          />
        </View>
        <Text
          style={styles.resendOtp}
          onPress={() => {
            onResend();
          }}>
          {timer == 0 ? (
            <Text>Resend</Text>
          ) : (
            <Text>00:{timer < 10 ? '0' + timer : timer}</Text>
          )}
        </Text>
      </View>
      <View style={Styles.bottomBtn}>
        <CustomButton
          btnText="Verify"
          onPress={() => {
            setVerified(true);
          }}
        />
      </View>
      <AlertModal
        visible={verified}
        onSubmit={() => {
          setVerified(false);
          dispatch(reqSuccess());
        }}
        successModal={true}
        confirmText={'Continue'}
        comments={'Please move forward to add your data'}
        title={'Successfully Verified'}
      />
    </View>
  );
};

export default VerifyOtp;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    loginContainer: {
      flex: 0.9,
      marginTop: 48,
      paddingHorizontal: 25,
      paddingVertical: 16,
    },
    loginText: {
      fontSize: 20 / fontScale,
      fontFamily: fontFamilyMedium,
      color: 'black',
    },
    loginDescription: {
      fontSize: 16 / fontScale,
      fontFamily: fontFamilyRegular,
      color: dark_grey,
      marginTop: 16,
    },
    inputContainer: {alignItems: 'flex-start', marginTop: '15%'},
    loginButton: {
      fontSize: 16 / fontScale,
      fontWeight: '400',
      fontFamily: fontFamilyRegular,
      color: '#fff',
    },
    otpText: {
      fontSize: 13 / fontScale,
      fontFamily: fontFamilyRegular,
      color: dark_grey,
      marginTop: '10%',
    },
    otpView: {
      marginTop: '5%',
    },
    borderStyleHighLighted: {
      borderColor: '#c9ccd3',
    },
    underlineStyleBase: {
      width: 43,
      height: 45,
      borderWidth: 1,
      marginRight: 5,
      borderRadius: 5,
      color: '#000',
      backgroundColor: '#fff',
      fontFamily: fontFamilyBold,
      fontSize: 16 / fontScale,
    },
    underlineStyleHighLighted: {
      borderColor: primary,
    },
    resendOtp: {
      color: primary,
      fontFamily: fontFamilyRegular,
      fontSize: 16 / fontScale,
      marginTop: '5%',
    },
  });
