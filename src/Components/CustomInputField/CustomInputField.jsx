import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';

const CustomInputField = ({label, value, onChangeText, placeholder}) => {
  return (
    <View style={styles.textInputContainer}>
      <View>
        <TextInput
          onChangeText={onChangeText}
          outlineColor="green"
          underlineColorAndroid="transparent"
          activeOutlineColor="green"
          mode="outlined"
          label={label}
          value={value}
          style={styles.textInput}
          placeholder={placeholder}
          right={
            <TextInput.Affix
              text="acres"
              textStyle={{color: '#000', fontFamily: 'ubuntu_medium'}}
            />
          }
        />
      </View>
    </View>
  );
};

export default CustomInputField;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '95%',
  },
  textInputContainer: {
    paddingTop: 10,
  },
  textInput: {
    backgroundColor: '#fff',
    fontFamily: 'ubuntu_medium',
  },
});
