import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {useUser} from '../../Hooks/useUser';
import '../../i18next';
// import {TextInput} from 'react-native-paper';

const InputWithStorage = ({
  label,
  val,
  onChangeText,
  placeholder,
  productionName,
  measureName,
  onFocus,
  storagePress,
  notRightText,
  multiline,
  storageMethod,
  editable,
  keyboardType,
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  const {data: userDetails} = useUser();
  const {t} = useTranslation();
  return (
    <View>
      <View style={[styles.textInputContainer]}>
        <View style={styles.textInputInner}>
          <View
            style={[
              styles.textInputAcres,
              {
                justifyContent: 'space-evenly',
                marginLeft: '5%',
              },
            ]}>
            <View style={[styles.textInput]}>
              <Text style={styles.cultivationText}>{productionName}</Text>
              <TextInput
                style={styles.inputText}
                onChangeText={onChangeText}
                value={val}
                placeholder={placeholder}
                placeholderTextColor={'#333'}
                onFocus={onFocus}
                // editable={!editable}
                keyboardType={keyboardType}
                multiline={multiline}
                // numberOfLines={multiline == true ? 2 : 0}
              />
            </View>
            <Divider horizontalInset={false} style={styles.divider} />
            <Text style={styles.acresText}>
              {userDetails.land_measurement_symbol
                ? userDetails.land_measurement_symbol
                : userDetails.land_measurement}
            </Text>
            <TouchableOpacity
              style={styles.storageContainer}
              onPress={storagePress}>
              <Text
                style={[
                  styles.cultivationText,
                  {marginTop: 0, marginBottom: 4, fontSize: 12 / fontScale},
                ]}>
                {t('storage method')}
              </Text>
              <Text style={styles.methodText}>{storageMethod}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InputWithStorage;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      //   width: '95%',
      flexDirection: 'row',
      flex: 1,
    },
    textInputContainer: {
      paddingTop: 5,
      marginTop: 10,
      flexDirection: 'row',
      flex: 1,
      alignSelf: 'center',
    },
    inputText: {
      color: '#000',
      fontSize: 16 / fontScale,
      fontWeight: '500',
      flex: 1,
      // backgroundColor: 'red',
    },
    textInputInner: {
      backgroundColor: '#fff',
      borderColor: '#268C43',
      borderWidth: 0.5,
      borderRadius: 10,
      flexDirection: 'column',
      flex: 1,
    },
    textInput: {
      //   width: '55%',
      flex: 1,
      margin: -7,
      padding: 5,
    },
    textInputAcres: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      flex: 0.2,
    },
    cultivationText: {
      color: 'green',
      fontSize: 14 / fontScale,
      marginBottom: -10,
      marginTop: 10,
      fontFamily: 'ubuntu',
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
      paddingHorizontal: 15,
    },
    storageContainer: {
      alignSelf: 'center',
      paddingHorizontal: 8,
      paddingVertical: 5,
      backgroundColor: '#F1F7F3',
      margin: 10,
      marginVertical: 7,
      marginRight: 15,
      borderRadius: 7,
      flex: 0.7,
    },
    methodText: {
      fontSize: 14 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu',
      textTransform: 'capitalize',
    },
  });
