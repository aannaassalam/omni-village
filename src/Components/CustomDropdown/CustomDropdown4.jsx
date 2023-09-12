import React, {useState} from 'react';
import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import AntDesign from 'react-native-vector-icons/AntDesign';

const data2 = [
  {label: 'Item 1', value: '1'},
  {label: 'Item 2', value: '2'},
  {label: 'Item 3', value: '3'},
  {label: 'Item 4', value: '4'},
  {label: 'Item 5', value: '5'},
  {label: 'Item 6', value: '6'},
  {label: 'Item 7', value: '7'},
  {label: 'Item 8', value: '8'},
];

const CustomDropdown4 = ({
  placeholder = 'Select item',
  selectedValue,
  data,
  valu,
  style,
}) => {
  const [value, setValue] = useState(null);
  const [isFocus, setIsFocus] = useState(false);

  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  const renderLabel = () => {
    if (value || isFocus) {
      return (
        <Text style={[styles.label, isFocus && {color: 'blue'}]}>
          Dropdown label
        </Text>
      );
    }
    return null;
  };

  return (
    <View style={styles.container}>
      {/* {renderLabel()} */}
      <Dropdown
        style={[styles.dropdown, isFocus && {borderColor: 'blue'}]}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={
          data
            ? data.map(i => {
                return {label: i?.name, value: i?._id};
              })
            : data2
        }
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        itemTextStyle={styles.selectedTextStyle}
        placeholder={placeholder}
        searchPlaceholder="Search..."
        value={valu}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={item => {
          setValue(item.value);
          selectedValue(item);
          setIsFocus(false);
        }}
      />
    </View>
  );
};

export default CustomDropdown4;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      backgroundColor: 'white',
      // paddingHorizontal: 5,
    },
    dropdown: {
      height: 50,
      borderColor: 'gray',
      borderWidth: 0.5,
      borderRadius: 8,
      paddingHorizontal: 8,
      // width: '100%',
    },
    icon: {
      marginRight: 5,
    },
    label: {
      position: 'absolute',
      backgroundColor: 'white',
      left: 22,
      top: 8,
      zIndex: 999,
      paddingHorizontal: 8,
      fontSize: 14 / fontScale,
      color: '#000',
    },
    placeholderStyle: {
      fontSize: 16 / fontScale,
      color: '#000',
    },
    selectedTextStyle: {
      fontSize: 16 / fontScale,
      color: '#000',
      textTransform: 'capitalize',
    },
    iconStyle: {
      width: 20,
      height: 20,
    },
    inputSearchStyle: {
      height: 40,
      fontSize: 16,
      color: '#000',
    },
  });
