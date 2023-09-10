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
  useWindowDimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
const {width} = Dimensions.get('window');
import SelectDropdown from 'react-native-select-dropdown';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';

export default CustomDropdown1 = ({placeholder, selectedValue,data}) => {
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

  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  return (
    <SelectDropdown
      data={data?data.map((i)=>i?.name):countries}
      onSelect={(selectedItem, index) => {
        selectedValue(selectedItem);
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
          <View style={styles.icon_btn}>
            <FontAwesomeIcon
              icon={isOpened ? faChevronUp : faChevronDown}
              color="rgba(38, 140, 67, 1)"
              size={15}
            />
          </View>
        );
      }}
      dropdownIconPosition={'right'}
      dropdownStyle={styles.dropdown1DropdownStyle}
      rowStyle={styles.dropdown1RowStyle}
      rowTextStyle={styles.dropdown1RowTxtStyle}
      defaultButtonText={placeholder}
      dropdownOverlayColor="rgba(0,0,0,.1)"
    />
  );
};

const makeStyles = fontScale =>
  StyleSheet.create({
    dropdownsRow: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: '5%',
    },
    dropdown1BtnStyle: {
      width: '100%',
      height: 50,
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#268C43',
    },
    dropdown1BtnTxtStyle: {
      color: '#263238',
      textAlign: 'left',
      fontSize: 14 / fontScale,
      fontFamily: 'ubuntu_regular',
    },
    dropdown1DropdownStyle: {backgroundColor: '#fff', borderRadius: 10},
    dropdown1RowStyle: {
      // backgroundColor: '#fff',
      // borderBottomColor: '#268C43',
      paddingHorizontal: 15,
    },
    dropdown1RowTxtStyle: {
      color: '#263238',
      textAlign: 'left',
      fontSize: 14 / fontScale,
      fontFamily: 'ubuntu_regular',
    },
    icon_btn: {
      backgroundColor: 'rgb(168,209,180)',
      borderRadius: 5,
      padding: 5,
    },
  });
