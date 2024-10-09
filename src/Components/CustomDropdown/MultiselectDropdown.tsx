/* eslint-disable no-undef */
import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StatusBar,
  Dimensions,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
const {width} = Dimensions.get('window');
import {MultiSelect} from 'react-native-element-dropdown';
import {borderColor, primary} from '../../styles/colors';
import {fontFamilyMedium} from '../../styles/fontStyle';

const MultiselectDropdown = ({
  selectedd = [],
  setSelectedd,
  data,
  infoName,
  containerStyle,
}: {
  selectedd: Array<any>;
  setSelectedd?: any;
  data: any;
  infoName: any;
  containerStyle: any;
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [selected, setSelected] = useState(selectedd);
  const handleSelect = (items: any) => {
    setSelected(items);
    setSelectedd(items);
  };
  const cropType = ['Wheat', 'Barley', 'Paddy', 'Rice', 'Dal', 'Others'];
  return (
    <View style={[styles.textInputContainer, containerStyle]}>
      <View style={styles.textInputInner}>
        <Text style={styles.infoName}>{infoName}</Text>
        <View style={{paddingHorizontal: 12}}>
          <MultiSelect
            style={styles.dropdown}
            placeholderStyle={styles.placeholderStyle}
            selectedTextStyle={styles.selectedTextStyle}
            search
            data={data?.map((i: any) => {
              return {label: i?.name, value: i?.key};
            })}
            labelField="label"
            valueField="value"
            placeholder="Select items"
            searchPlaceholder="Search..."
            value={selectedd}
            onChange={handleSelect}
            selectedStyle={styles.selectedStyle}
            itemTextStyle={styles.itemTxtStyle}
          />
        </View>
      </View>
    </View>
  );
};

export default MultiselectDropdown
const makeStyles = (fontScale:any) =>
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
      borderColor: primary,
      borderWidth: 1,
      borderRadius: 10,
      paddingRight: 5,
      paddingTop: 5,
      color: '#000',
    },
    infoName: {
      paddingHorizontal: 10,
      marginLeft: 5,
      color: '#268C43',
      fontSize: 12 / fontScale,
      fontFamily: 'ubuntu-medium',
    },
    icon_btn: {
      backgroundColor: '#a8adaf',
      borderRadius: 5,
      padding: 5,
    },
    boxStyle: {
      borderColor: '#fff',
      borderWidth: 1,
      backgroundColor: '#f7f7f7',
      alignSelf: 'center',
      width: width / 1.22,
      marginTop: 10,
      color: '#000',
    },
    dropdown: {
      paddingHorizontal: 8,
      marginTop: 10,
      marginBottom: 12,
      fontSize: 12 / fontScale,
      backgroundColor: '#f4f4f4',
      borderRadius: 4,
    },
    selectedStyle: {
      backgroundColor: primary,
      borderRadius: 8,
      padding: 6,
    },
    selectedTextStyle: {
      color: '#fff',
      fontSize: 12 / fontScale,
      fontFamily: fontFamilyMedium,
    },
    placeholderStyle: {
      color: '#000',
      fontFamily: fontFamilyMedium,
      fontSize: 12 / fontScale,
    },
    itemTxtStyle: {
      fontSize: 12 / fontScale,
      color: '#000',
    },
  });
