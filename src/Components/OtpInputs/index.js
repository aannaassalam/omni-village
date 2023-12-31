import {Flex} from '@react-native-material/core';
import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TextInput, useWindowDimensions} from 'react-native';
import {Scale} from '../../Helper/utils';

export default function OtpInput({setParentOtp}) {
  //   const inputRefs = useRef([]);
  const inputRefs = [];
  const [otp, setOtp] = useState([]);

  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  useEffect(() => {
    inputRefs[0].focus();
  }, []);

  const focusPrevious = (key, index) => {
    // console.log('back');
    if (key === 'Backspace' && index !== 0) {
      inputRefs[index - 1].focus();
    }
  };

  const focusNext = (index, value) => {
    // console.log(inputRefs);\
    if (index < inputRefs.length - 1 && value.trim().length > 0) {
      inputRefs[index + 1].focus();
    }
    // console.log(index, inputRefs.length - 1, 'sd');
    if (index === inputRefs.length - 1) {
      // console.log('two');
      // const local_otp = otp;
      // local_otp[index] = value;
      // setOtp(local_otp);
      inputRefs[index].blur();
    }
    const local_otp = otp;
    local_otp[index] = value;
    setOtp(local_otp);
    setParentOtp(otp.join(''));
    // this.props.getOtp(otp.join(''));
  };

  const inputs = Array(4).fill(0);
  const renderedInputs = inputs.map((i, j) => (
    <TextInput
      key={j}
      style={[styles.inputRadius, {borderRadius: 10}]}
      keyboardType="numeric"
      onChangeText={v => focusNext(j, v)}
      onKeyPress={e => focusPrevious(e.nativeEvent.key, j)}
      maxLength={1}
      ref={ref => {
        inputRefs[j] = ref;
      }}
    />
  ));

  return <Flex style={styles.login_input_flex}>{renderedInputs}</Flex>;
}

const makeStyles = fontScale =>
  StyleSheet.create({
    login_input_flex: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
    },
    inputRadius: {
      width: '15%',
      paddingVertical: 14,
      textAlign: 'center',
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: '#eee',
      fontSize: 16 / fontScale,
      color: '#000',
    },
  });
