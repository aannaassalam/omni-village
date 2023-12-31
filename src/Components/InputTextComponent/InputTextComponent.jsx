import React, {useState, useEffect} from 'react';
import {StyleSheet, TextInput, useWindowDimensions} from 'react-native';
import {Scale} from '../../Helper/utils';

export default function InputTextComponent({
  placeholder,
  className,
  onChangeText,
  value,
  ...others
}) {
  // const [value, setValue] = useState('');

  // useEffect(() => {
  //   InputValueCallback(value)
  // }, [value])

  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <TextInput
      style={className ? styles.inputSmall : styles.input}
      onChangeText={onChangeText}
      value={value?.toString()}
      placeholderTextColor={'#bbb'}
      placeholder={placeholder}
      keyboardType={others.keyboardType || 'default'}
      {...others}
    />
  );
}

const makeStyles = fontScale =>
  StyleSheet.create({
    input: {
      height: 50,
      paddingHorizontal: 20,
      paddingVertical: 0,
      borderRadius: 8,
      borderColor: '#268C43',
      borderWidth: 1,
      fontSize: 14 / fontScale,
      color: '#263238',
      fontFamily: 'ubuntu-regular',
    },
    inputSmall: {
      width: 50,
      height: 50,
      borderWidth: 1,
      borderColor: '#F8F8F8',
      borderRadius: 8,
      backgroundColor: '#F8F8F8',
      textAlign: 'center',
      fontSize: 14 / fontScale,
      color: '#263238',
      fontFamily: 'ubuntu-regular',
    },
  });
