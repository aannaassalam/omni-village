import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';
// import {TextInput} from 'react-native-paper';

const InputWithoutRightElement = ({
  label,
  value,
  onChangeText,
  placeholder,
  onFocus,
  style,
  keyboardType = 'default',
  onEndEditing,
  editable = true,
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
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
          textAlignVertical="auto"
          label={<Text style={{fontSize: 16 / fontScale}}>{label}</Text>}
          value={value}
          style={[styles.textInput, style]}
          placeholder={placeholder}
          placeholderTextColor={'#333'}
          onFocus={onFocus}
          keyboardType={keyboardType}
          onEndEditing={onEndEditing}
          editable={editable}
        />
      </View>
    </View>
  );
};

export default InputWithoutRightElement;

const makeStyles = fontScale =>
  StyleSheet.create({
    textInputContainer: {
      paddingTop: 10,
      width: '100%',
      alignSelf: 'center',
    },
    textInput: {
      backgroundColor: '#fff',
      fontFamily: 'ubuntu-medium',
      fontSize: 16 / fontScale,
    },
  });
