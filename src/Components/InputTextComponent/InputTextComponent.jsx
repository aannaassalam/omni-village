import React, {useState, useEffect} from 'react';
import {SafeAreaView, StyleSheet, TextInput} from 'react-native';


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
  console.log(typeof value);
  return (
    <TextInput
      style={className ? styles.inputSmall : styles.input}
      onChangeText={onChangeText}
      value={value?.toString()}
      placeholder={placeholder}
      keyboardType={others.keyboardType || 'default'}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: 50,
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderRadius: 8,
    borderColor: '#268C43',
    borderWidth: 1,
    borderRadius: 8,
  },
  inputSmall: {
    width: 50,
    height: 50,
    borderWidth: 1,
    borderColor: '#F8F8F8',
    borderRadius: 8,
    backgroundColor: '#F8F8F8',
    textAlign: 'center',
  },
});