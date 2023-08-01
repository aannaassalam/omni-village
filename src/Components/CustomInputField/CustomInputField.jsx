import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';

const CustomInputField = ({label, value, onChangeText, placeholder}) => {
  return (
    <View style={styles.textInputContainer}>
      <View>
        <TextInput
          onChangeText={onChangeText}
          outlineColor="#268C43"
          underlineColorAndroid="transparent"
          activeOutlineColor="#268C43"
          mode="outlined"
          outlineStyle={{
            borderRadius: 10,
          }}
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
    width: '90%',
  },
  textInputContainer: {
    paddingTop: 10,
    width: '95%',
    alignSelf: 'center',
  },
  textInput: {
    backgroundColor: '#fff',
    fontFamily: 'ubuntu_medium',
  },
});