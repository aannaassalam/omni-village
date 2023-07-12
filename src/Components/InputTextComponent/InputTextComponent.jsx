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
});

export default function InputTextComponent({placeholder}) {
  const [value, setValue] = useState('');
  return (
    <SafeAreaView>
      <TextInput
        style={styles.input}
        onChangeText={e => setValue(e)}
        value={value}
        placeholder={placeholder}
        keyboardType="numeric"
      />
    </SafeAreaView>
  );
}
