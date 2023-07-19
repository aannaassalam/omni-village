/* eslint-disable no-undef */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Dimensions,
  StyleSheet,
  ScrollView,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
const {width} = Dimensions.get('window');
import SelectDropdown from 'react-native-select-dropdown';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';

export default CustomDropdown1 = () => {
  const countries = [
    'Egypt',
    'Canada',
    'Australia',
    'Ireland',
    'Brazil',
    'England',
    'Dubai',
    'France',
    'Germany',
    'Saudi Arabia',
    'Argentina',
    'India',
  ];

  return (
    <SelectDropdown
      data={countries}
      onSelect={(selectedItem, index) => {
        console.log(selectedItem, index);
      }}
      buttonTextAfterSelection={(selectedItem, index) => {
        // text represented after item is selected
        // if data array is an array of objects then return selectedItem.property to render after item is selected
        return selectedItem;
      }}
      rowTextForSelection={(item, index) => {
        // text represented for each item in dropdown
        // if data array is an array of objects then return item.property to represent item in dropdown
        return item;
      }}
      buttonStyle={styles.dropdown1BtnStyle}
      buttonTextStyle={styles.dropdown1BtnTxtStyle}
      renderDropdownIcon={isOpened => {
        return (
          <FontAwesomeIcon
            icon={isOpened ? faChevronUp : faChevronDown}
            color="rgba(38, 140, 67, 1)"
            size={18}
            style={styles.icon_btn}
          />
        );
      }}
      dropdownIconPosition={'right'}
      dropdownStyle={styles.dropdown1DropdownStyle}
      rowStyle={styles.dropdown1RowStyle}
      rowTextStyle={styles.dropdown1RowTxtStyle}
    />
  );
};

const styles = StyleSheet.create({
  dropdownsRow: {flexDirection: 'row', width: '100%', paddingHorizontal: '5%'},
  dropdown1BtnStyle: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#268C43',
  },
  dropdown1BtnTxtStyle: {color: '#263238', textAlign: 'left', fontSize: 13},
  dropdown1DropdownStyle: {backgroundColor: '#fff'},
  dropdown1RowStyle: {
    backgroundColor: '#fff',
    borderBottomColor: '#268C43',
  },
  dropdown1RowTxtStyle: {color: '#263238', textAlign: 'left', fontSize: 13},
  icon_btn: {
    backgroundColor: 'rgb(168,209,180)',
  },
});
