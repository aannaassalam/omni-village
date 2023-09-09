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
import SearchableDropdown from 'react-native-searchable-dropdown';

export default CustomDropdown2 = ({
  placeholder,
  selectedValue,
  data,
  valu,
  style,
}) => {
  const cropType = ['Wheat', 'Barley', 'Paddy', 'Rice', 'Dal', 'Others'];
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);
  // console.log("value", valu, data)
  return (
    // <SelectDropdown
    //   data={data?.length >=1 && data !== undefined ? data.map(dat => dat.name) : cropType}
    //   onSelect={(selectedItem, index) => {
    //     selectedValue(selectedItem);
    //   }}
    //   buttonTextAfterSelection={(selectedItem, index) => {
    //     // text represented after item is selected
    //     // if data array is an array of objects then return selectedItem.property to render after item is selected
    //     return selectedItem;
    //   }}
    //   rowTextForSelection={(item, index) => {
    //     // text represented for each item in dropdown
    //     // if data array is an array of objects then return item.property to represent item in dropdown
    //     return item;
    //   }}
    //   search
    //   buttonStyle={styles.dropdown1BtnStyle}
    //   buttonTextStyle={styles.dropdown1BtnTxtStyle}
    //   renderDropdownIcon={isOpened => {
    //     return (
    //       <View style={styles.icon_btn}>
    //         <FontAwesomeIcon
    //           icon={isOpened ? faChevronUp : faChevronDown}
    //           color="#000"
    //           size={15}
    //         />
    //       </View>
    //     );
    //   }}
    //   dropdownIconPosition={'right'}
    //   dropdownStyle={styles.dropdown1DropdownStyle}
    //   rowStyle={styles.dropdown1RowStyle}
    //   rowTextStyle={styles.dropdown1RowTxtStyle}
    //   defaultButtonText={placeholder}
    //   dropdownOverlayColor="rgba(0,0,0,.1)"
    // />
    // <SelectList
    //   setSelected={selectedValue}
    //   data={data?.length >= 1 && data !== undefined ? data.map((j, index) => { return { key: index, value: j?.name } }) : cropType.map((i, index)=>{return {key: index, value:i}})}
    //   save="value"
    //   dropdownTextStyles={{
    //     color:'#000'
    //   }}
    //   placeholder='Select Option'
    //   searchPlaceholder='Search here'
    //   inputStyles={{
    //     color:'#000'
    //   }}
    //   search
    //   dropdownStyles={{
    //     // borderColor:"#fff",
    //     // borderWidth:1,
    //     // // backgroundColor:"red"
    //   }}
    //   boxStyles={[styles.boxStyle,style]}
    //   dropdownItemStyles={{
    //     // backgroundColor:"pink"
    //   }}
    // />
      <SearchableDropdown
      listMode="SCROLLVIEW"
        onTextChange={(text) => console.log(text)}
        onItemSelect={(item) => {
          console.log("item")
          // const items = this.state.selectedItems;
          // items.push(item)
          // this.setState({ selectedItems: items });
          // alert("item", item)
          selectedValue(item)
        }}
        containerStyle={{ padding: 5 }}
        itemStyle={{
          padding: 10,
          marginTop: 2,
          borderColor: '#bbb',
          borderWidth: 1,
          borderRadius: 5,
        }}
        textInputStyle={{
          //inserted text style
          padding: 12,
          borderWidth: 1,
          borderColor: '#ccc',
          backgroundColor: '#FAF7F6',
          color:'#000'
        }}
        itemTextStyle={{ color: '#000' }}
        itemsContainerStyle={{ maxHeight: 140 }}
        // items={data}
        items={data?.length >= 1 && data !== undefined ? data.map((j, index) => { return { id: j?._id, name: j?.name } }) : cropType.map((i, index) => { return { key: index, value: i } })}
        defaultIndex={valu ? data.findIndex(item => item.name === valu) : 0}
        resetValue={false}
        placeholder="hello serach "
        textInputProps={
          {
            placeholder: valu?valu?.name:'Search',
            placeholderTextColor:"#000",
            underlineColorAndroid: "transparent",
            style: {
              padding: 12,
              borderWidth: 1,
              borderColor: '#ccc',
              borderRadius: 5,
              color:'#000'
            },
            // onTextChange: text => alert(text)
          }
        }
      listProps={{
        nestedScrollEnabled: true
      }}
        
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
      textTransform: 'capitalize',
    },
    dropdown1DropdownStyle: { backgroundColor: '#fff', borderRadius: 10 },
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
      textTransform: 'capitalize',
    },
    icon_btn: {
      backgroundColor: '#a8adaf',
      borderRadius: 5,
      padding: 5,
    },
    boxStyle: {
      borderColor: "#000",
      borderWidth: 1,
    }
  });
