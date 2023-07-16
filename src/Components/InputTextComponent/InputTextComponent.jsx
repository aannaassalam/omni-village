import React, {useState} from 'react';
import {SafeAreaView, StyleSheet, TextInput} from 'react-native';

const styles = StyleSheet.create({
  input: {
    height: 50,
    paddingHorizontal: 20,
    paddingVertical: 0,
    borderRadius: 8,
    borderColor: '#268C43',
    borderWidth: 1,
    borderRadius: 8,
    lineHeight: 1,
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

export default function InputTextComponent({placeholder, className}) {
  const [value, setValue] = useState('');
  return (
    <SafeAreaView>
      <TextInput
        style={className ? styles.inputSmall : styles.input}
        onChangeText={e => setValue(e)}
        value={value}
        placeholder={placeholder}
        keyboardType="numeric"
      />
    </SafeAreaView>
  );
}
