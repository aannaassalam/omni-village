
import { StyleSheet, Text, View,TouchableOpacity,useWindowDimensions, Dimensions } from 'react-native'
import React from 'react'
import { Styles } from '../../styles/globalStyles';
import {fontFamilyMedium, fontFamilyRegular} from '../../styles/fontStyle'
import AntDesign from 'react-native-vector-icons/AntDesign';
import {MultiSelect} from 'react-native-element-dropdown';
import { borderColor, primary } from '../../styles/colors';

const CustomMultiselect = ({
  data,
  value,
  onChange,
  style,
  placeholderStyle,
  selectedTextStyle,
  inputSearchStyle,
  iconStyle,
  selectedStyle,
  renderItem,
  label,
  treatment,
  placeholder,
  noLabel
}: {
  data: any;
  value: any;
  onChange: any;
  style?: any;
  placeholderStyle?: any;
  selectedTextStyle?: any;
  inputSearchStyle?: any;
  iconStyle?: any;
  selectedStyle?: any;
  renderItem?: any;
  label?: any;
  treatment?: any;
  placeholder?: any;
  noLabel?:any;
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View>
      {noLabel ? null : <Text style={Styles.fieldLabel}>{label}</Text>}
      <MultiSelect
        style={[styles.dropdown, style]}
        placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
        alwaysRenderSelectedItem
        activeColor={'#f4f4f4'}
        visibleSelectedItem={true}
        showsVerticalScrollIndicator={true}
        selectedTextStyle={[styles.selectedTextStyle, selectedTextStyle]}
        iconStyle={[styles.iconStyle, iconStyle]}
        search
        inside
        data={data}
        labelField="label"
        valueField="value"
        placeholder={placeholder ? placeholder : 'Select'}
        fontFamily={fontFamilyMedium}
        searchPlaceholder="Search..."
        value={value}
        onChange={(item: any) => onChange(item)}
        iconColor={primary}
        selectedStyle={[
          styles.selectedStyle,
          selectedStyle,
          {backgroundColor: treatment ? '#DFECFF' : '#bbffcc'},
        ]}
        renderItem={renderItem}
        renderSelectedItem={(item, unSelect) => (
          <TouchableOpacity
            onPress={() => {
              console.log('itemmmmmmm', item);
              unSelect && unSelect(item);
            }}>
            <View
              style={[
                styles.selectedStyle,
                {backgroundColor: treatment ? '#DFECFF' : '#bbffcc'},
              ]}>
              <Text
                style={[
                  styles.textSelectedStyle,
                  {color: treatment ? primary : '#2b9947'},
                ]}>
                {item.label}
              </Text>
              <AntDesign
                color={treatment ? primary : '#2b9947'}
                name="close"
                size={17}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default CustomMultiselect
const width = Dimensions.get('window').width;
const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    dropdown: {
      borderColor: borderColor,
      borderWidth: 1,
      borderRadius: 6,
      zIndex: 0,
      backgroundColor: '#fff',
      paddingVertical: 8,
      paddingHorizontal: 10,
      width: width / 1.13,
    },
    dropdownContainer: {
      borderColor: borderColor,
      width: '100%',
    },
    placeholderStyle: {
      color: borderColor,
      fontFamily: fontFamilyRegular,
      fontSize: 16 / fontScale,
    },
    selectedTextStyle: {
      fontSize: 16 / fontScale,
      color: primary,
      fontFamily: fontFamilyRegular,
    },
    inputSearchStyle: {
      color: '#000',
    },
    selectedStyle: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      // alignItems: 'center',
      borderRadius: 8,
      backgroundColor: '#DFECFF',
      shadowColor: '#000',
      marginTop: 6,
      marginBottom: 4,
      marginRight: 10,
      paddingHorizontal: 10,
      paddingVertical: 6,
      alignSelf: 'center',
      alignItems: 'center',
    },
    textSelectedStyle: {
      marginRight: 5,
      fontSize: 16 / fontScale,
      color: primary,
      fontFamily: fontFamilyRegular,
    },
    item: {
      padding: 17,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    iconStyle: {
      height: 20,
      width: 20,
    },
  });