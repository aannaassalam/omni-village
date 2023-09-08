/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const { width } = Dimensions.get('window');
import SelectDropdown from 'react-native-select-dropdown';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { SelectList } from 'react-native-dropdown-select-list'

export default CustomDropdown3 = ({
  placeholder,
  selectedValue,
  defaultVal,
  data,
  infoName,
  style,
  value,
}) => {
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const cropType = ['Wheat', 'Barley', 'Paddy', 'Rice', 'Dal', 'Others'];
  return (
    <View style={styles.textInputContainer}>
      <View style={styles.textInputInner}>
        <Text style={styles.infoName}>{infoName}</Text>
        {/* <SelectDropdown
          data={data}
          onSelect={(selectedItem, index) => {
            selectedValue(selectedItem);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return value;
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
                  color="#000"
                  size={15}
                />
              </View>
            );
          }}
          dropdownIconPosition={'right'}
          dropdownStyle={styles.dropdown1DropdownStyle}
          rowStyle={styles.dropdown1RowStyle}
          rowTextStyle={styles.dropdown1RowTxtStyle}
          defaultButtonText={value ? value : placeholder}
          dropdownOverlayColor="rgba(0,0,0,.1)"
        /> */}
        <SelectList
          setSelected={selectedValue}
          data={data?.length >= 1 && data !== undefined ? data.map((j, index) => { return { key: index, value: j?.name } }) : cropType.map((i, index) => { return { key: index, value: i } })}
          save="value"
          dropdownTextStyles={{
            color: '#000'
          }}
          placeholder='Select Option'
          searchPlaceholder='Search here'
          inputStyles={{
            color: '#000',
          }}
          search
          boxStyles={[styles.boxStyle, style]}
          dropdownItemStyles={[styles.dropdownstyle]}
          dropdownStyles={{
            // backgroundColor:'yellow',
            borderColor: '#fff',
            borderWidth: 1,
            elevation:5,
            backgroundColor:"#fff",
            width:'90%',
            alignSelf:'center'
          }}
          defaultOption={defaultVal}

        />
      </View>
    </View>
  );
};

const makeStyles = fontScale =>
  StyleSheet.create({
    textInputContainer: {
      paddingTop: 5,
      marginTop: 10,
      width: '95%',
      alignSelf: 'center',
      position: 'relative',
    },
    textInputInner: {
      backgroundColor: '#fff',
      borderColor: '#268C43',
      borderWidth: 0.5,
      borderRadius: 10,
      paddingRight: 5,
      paddingVertical: 5,
    },
    infoName: {
      paddingHorizontal: 10,
      marginLeft: 5,
      color: '#268C43',
      fontSize: 14,
      fontFamily: 'ubuntu_medium',
    },
    dropdownsRow: {
      flexDirection: 'row',
      width: '100%',
      paddingHorizontal: '5%',
    },
    dropdown1BtnStyle: {
      width: '100%',
      height: 24,
      backgroundColor: '#FFF',
      borderRadius: 8,
      borderWidth: 1,
      //   borderColor: '#268C43',
      borderColor: '#fff',
    },
    dropdown1BtnTxtStyle: {
      color: '#263238',
      textAlign: 'left',
      fontSize: 14 / fontScale,
      fontFamily: 'ubuntu_regular',
      textTransform: 'capitalize',
    },
    dropdown1DropdownStyle: {
      backgroundColor: '#fff',
      //   backgroundColor: 'red',
      borderRadius: 10,
    },
    dropdown1RowStyle: {
      //   width: '90%',
      //   backgroundColor: '#fff',
      // borderBottomColor: '#268C43',
      paddingHorizontal: 15,
    },
    dropdown1RowTxtStyle: {
      color: '#263238',
      textAlign: 'left',
      fontSize: 14 / fontScale,
      fontFamily: 'ubuntu_regular',
      textTransform: 'capitalize',
    },
    icon_btn: {
      backgroundColor: '#a8adaf',
      borderRadius: 5,
      padding: 5,
    },
    boxStyle: {
      borderColor: "#fff",
      borderWidth: 1,
    },
    dropdownstyle: {
      // backgroundColor: 'red'
    }
  });
