import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import React from 'react';
import {TextInput} from 'react-native-paper';
// import {TextInput} from 'react-native-paper';

const LoginInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  onFocus,
  countryModal,
  countryCode,
  keyboardType = 'default',
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    // <View style={styles.textInputContainer}>
    <TextInput
      // onChangeText={onChangeText}
      outlineColor="green"
      underlineColorAndroid="transparent"
      activeOutlineColor="green"
      outlineStyle={{
        borderRadius: 10,
      }}
      style={{
        backgroundColor: '#fff',
        // padding: 5,
        paddingHorizontal: 5,
        height: 40,
        marginTop: 10,
        // alignSelf: 'stretch',
      }}
      render={inputProps => (
        <View
          style={{
            flexDirection: 'row',
            // alignItems: 'center',
            position: 'relative',
          }}>
          <Pressable
            style={{
              padding: 5,
              alignSelf: 'center',
              borderRightWidth: 3,
              borderRightColor: '#ccc',
            }}
            onPress={countryModal}>
            <Text
              style={{
                color: '#000',
                marginTop: 0,
                paddingHorizontal: 15,
                fontSize: 16 / fontScale,
              }}>
              {countryCode}
            </Text>
          </Pressable>
          <TextInput
            outlineColor="white"
            underlineColorAndroid="transparent"
            // autoComplete="tel-device"
            selectionColor="green"
            autoFocus
            // blurOnSubmit
            // textContentType="telephoneNumber"
            // dataDetectorTypes="phoneNumber"
            outlineStyle={{
              borderRadius: 10,
              flex: 1,
              marginBottom: 2,
              display: 'none',
            }}
            // contentStyle={{marginTop: -5}}
            // label={<Text style={{fontSize: 16 / fontScale}}>{label}</Text>}
            value={value}
            mode="outlined"
            style={[styles.textInput, {flex: 1}]}
            placeholder={placeholder}
            placeholderTextColor={'#333'}
            // onFocus={onFocus}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
          />
        </View>
      )}
      mode="outlined"
      label={<Text style={{fontSize: 16 / fontScale}}>{label}</Text>}
      // value={value}
      // placeholder={placeholder}
      // placeholderTextColor={'#333'}
      // onFocus={onFocus}
      // keyboardType={keyboardType}
    />
    // {/* </View> */}
  );
};

export default LoginInput;

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
      // paddingTop: ,
    },
  });
