import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-paper';
// import {TextInput} from 'react-native-paper';

const InputWithoutRightElement = ({
  label,
  value,
  onChangeText,
  placeholder,
  onFocus,
  keyboardType = 'default',
}) => {
  return (
    <View style={styles.textInputContainer}>
      <View>
        <TextInput
          onChangeText={onChangeText}
          outlineColor="green"
          underlineColorAndroid="transparent"
          activeOutlineColor="green"
          outlineStyle={{
            borderRadius: 10,
          }}
          mode="outlined"
          label={label}
          value={value}
          style={styles.textInput}
          placeholder={placeholder}
          onFocus={onFocus}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
};

export default InputWithoutRightElement;

const styles = StyleSheet.create({
  textInputContainer: {
    paddingTop: 10,
    width: '100%',
    alignSelf: 'center',
  },
  textInput: {
    backgroundColor: '#fff',
    fontFamily: 'ubuntu_medium',
  },
});
