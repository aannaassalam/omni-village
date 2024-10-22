import {StyleSheet, Text, View, TextInput, useWindowDimensions,TouchableOpacity, KeyboardTypeOptions, Dimensions} from 'react-native';
import React, { useState } from 'react';
import {borderColor, light_grey, primary} from '../../styles/colors';
import {fontFamilyBold, fontFamilyMedium, fontFamilyRegular } from '../../styles/fontStyle';
import { Styles } from '../../styles/globalStyles';
import AntIcon from 'react-native-vector-icons/AntDesign';

interface InputProps {
  keyboardType?: KeyboardTypeOptions;
  onChangeText?: (text: string) => void;
  value: string;
  style?: any;
  placeholder?: string;
  multiline?: boolean;
  onFocus?: () => void;
  secureTextEntry?: boolean;
  numberOfLines?: number;
  maxLength?: number;
  textAlignVertical?: 'auto' | 'top' | 'bottom' | 'center';
  defaultValue?: string;
  editable?: boolean;
  autoCorrect?: boolean;
  phone?: () => void;
  countryCode?: string;
  label?: String;
  noLabel?: Boolean;
  width_?: any;
  boxHeight?: number;
  fullLength?: Boolean;
  longText?: Boolean;
  isClock?: Boolean;
  isRupee?: Boolean;
  isDate?: Boolean;
  isKM?: Boolean;
  isRight?: any;
  topLabel?: any;
  onBlur?: any;
  inner_width?: any;
  main_width?: any;
  autoFocus?: any;
  txtStyle?:any
}

const Input = ({
  keyboardType,
  onChangeText,
  value,
  style,
  isKM,
  placeholder,
  multiline,
  onFocus,
  secureTextEntry,
  numberOfLines,
  maxLength,
  textAlignVertical,
  defaultValue,
  editable = true,
  autoCorrect,
  phone,
  countryCode,
  label,
  noLabel,
  width_,
  fullLength,
  longText,
  isClock,
  isRupee,
  isDate,
  isRight,
  topLabel,
  onBlur,
  inner_width,
  main_width,
  autoFocus,
  txtStyle,
}: InputProps) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [boxHeight, setBoxHeight] = useState(50);
  return (
    <View>
      {!noLabel && <Text style={[Styles.fieldLabel, txtStyle]}>{label}</Text>}
      <View
        style={{
          backgroundColor: 'white',
          borderColor: primary,
          borderRadius: 8,
          borderWidth: 1,
          width: width_
            ? width_
            : main_width
            ? main_width
            : fullLength
            ? '100%'
            : (width - 88) / 2,
        }}>
        {topLabel && (
          <View>
            <Text style={styles.topLabel}>{topLabel}</Text>
          </View>
        )}
        <View
          style={[
            styles.inputBox,
            {
              width: width_ ? width_ : fullLength ? '100%' : (width - 88) / 2,
              height:
                longText && boxHeight < 100
                  ? 150
                  : boxHeight > 50
                  ? boxHeight
                  : 50,
            },
            style,
          ]}>
          {phone && (
            <TouchableOpacity onPress={phone}>
              <Text style={styles.phoneNumberStyle}>{countryCode}</Text>
            </TouchableOpacity>
          )}
          <TextInput
            style={{
              width:
                parseInt(width_) > 0
                  ? parseInt(width_) - 2
                  : inner_width
                  ? inner_width
                  : isDate || isClock || isRupee || isKM || isRight
                  ? '80%'
                  : width - 50,
              fontSize: 16 / fontScale,
              fontFamily: fontFamilyMedium,
              // lineHeight: 16 * 1.25,
              textAlignVertical: !longText ? 'center' : 'top',
              height:
                longText && boxHeight < 100
                  ? 150
                  : boxHeight > 50
                  ? boxHeight
                  : 50,
              color: !editable ? 'black' : 'black',
              paddingHorizontal: 16,
            }}
            maxLength={maxLength}
            onContentSizeChange={event => {
              const {contentSize} = event.nativeEvent;
              setBoxHeight(contentSize.height);
            }}
            onBlur={onBlur}
            keyboardType={keyboardType}
            autoFocus={autoFocus}
            onChangeText={onChangeText}
            value={value}
            onFocus={onFocus}
            editable={isDate || isClock ? false : editable}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : undefined}
            placeholder={placeholder}
            defaultValue={defaultValue}
            placeholderTextColor={'#c4c4c4'}
            secureTextEntry={secureTextEntry}
            textAlignVertical={textAlignVertical}
            autoCorrect={autoCorrect}
            autoCapitalize="none"
          />
          {isClock && <AntIcon name="home" size={24} color={primary} />}
          {isDate && (
            <AntIcon
              name="calendar"
              size={24}
              color={primary}
              style={{marginRight: 16}}
            />
          )}
          {isKM && (
            <Text
              style={{
                fontFamily: fontFamilyBold,
                color: primary,
                fontSize: 16 / fontScale,
                marginRight: 10,
              }}>
              KM
            </Text>
          )}
          {isRight && isRight}
        </View>
      </View>
    </View>
  );
};

export default Input;
const {width} = Dimensions.get('window')
const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    input: {
      fontFamily: fontFamilyRegular,
      color: '#000',
      fontSize: 16 / fontScale,
      width: width / 1.33,
      textAlignVertical: 'center',
      alignSelf: 'center',
      marginTop: 2,
    },
    inputBox: {
      borderRadius: 0,
      // borderColor: borderColor,
      fontFamily: fontFamilyRegular,
      color: 'black',
      // borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      display: 'flex',
      alignItems: 'center',
    },
    phoneNumberStyle: {
      paddingLeft: 10,
      fontFamily: fontFamilyRegular,
      fontSize: 16 / fontScale,
      color: '#000',
    },
    topLabel:{
      fontSize: 12 / fontScale,
      fontFamily: fontFamilyRegular,
      color: '#000',
      marginLeft: 10,
      marginTop: 10
    }
  });
