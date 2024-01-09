import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {useUser} from '../../Hooks/useUser';
// import {TextInput} from 'react-native-paper';

const InputWithoutBorder = ({
  label,
  value,
  onChangeText,
  placeholder,
  productionName,
  measureName,
  onFocus,
  notRightText,
  multiline,
  editable = true,
  keyboardType = 'number-pad',
  editableColorChange = false,
}) => {
  const {data: user} = useUser();

  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View pointerEvents={editableColorChange ? 'none' : 'auto'}>
      <View style={[styles.textInputContainer]}>
        <View
          style={[
            styles.textInputInner,
            {
              backgroundColor:
                editable == false && !editableColorChange ? '#cacaca' : '#fff',
            },
          ]}>
          <View
            style={[
              styles.textInputAcres,
              {
                justifyContent: notRightText ? 'flex-start' : 'space-evenly',
                marginLeft: notRightText ? '5%' : 0,
              },
            ]}>
            <View style={[styles.textInput]}>
              <Text style={styles.cultivationText}>{productionName}</Text>
              <TextInput
                style={styles.inputText}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={'#333'}
                onFocus={onFocus}
                editable={editable}
                // keyboardType={keyboardType}
                multiline={notRightText ? true : false}
                numberOfLines={notRightText ? 2 : null}
                keyboardType={keyboardType}
                // editable={!disabled}
              />
            </View>
            {notRightText ? null : (
              <>
                <Divider horizontalInset={false} style={styles.divider} />
                <Text style={styles.acresText}>
                  {measureName
                    ? measureName
                    : user.land_measurement_symbol
                    ? user.land_measurement_symbol
                    : user.land_measurement}
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default InputWithoutBorder;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      width: '95%',
    },
    textInputContainer: {
      paddingTop: 5,
      marginTop: 10,
      width: '95%',
      alignSelf: 'center',
    },
    inputText: {
      color: '#333',
      fontSize: 14 / fontScale,
      fontWeight: '500',
      paddingVertical: 14,
      // backgroundColor: 'red',
    },
    textInputInner: {
      backgroundColor: '#fff',
      borderColor: '#268C43',
      borderWidth: 0.5,
      borderRadius: 10,
    },
    textInput: {
      // width: '75%',
      flex: 0.75,
      margin: -10,
      padding: 5,
    },
    textInputAcres: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    cultivationText: {
      color: 'green',
      fontSize: 12 / fontScale,
      marginBottom: 2,
      marginTop: 10,
      fontFamily: 'ubuntu-medium',
      textTransform: 'capitalize',
    },
    divider: {
      height: '80%',
      width: '1%',
      alignSelf: 'center',
    },
    acresText: {
      alignSelf: 'center',
      fontSize: 14 / fontScale,
      color: '#000',
    },
  });
