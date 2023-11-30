import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';
import {useSelector} from 'react-redux';

const CustomInputField = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  const {user} = useSelector(state => state.auth);

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
          label={
            <Text
              style={{fontSize: 16 / fontScale, textTransform: 'capitalize'}}>
              {label}
            </Text>
          }
          value={value}
          style={styles.textInput}
          placeholder={placeholder}
          placeholderTextColor={'#000'}
          right={
            <TextInput.Affix
              text={
                user.land_measurement_symbol
                  ? user.land_measurement_symbol
                  : user.land_measurement
              }
              textStyle={{color: '#000', fontFamily: 'ubuntu-medium'}}
            />
          }
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
};

export default CustomInputField;

const makeStyles = fontScale =>
  StyleSheet.create({
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
      fontFamily: 'ubuntu-medium',
      fontSize: 16 / fontScale,
      color: 'red',
    },
  });
