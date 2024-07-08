/* eslint-disable no-undef */
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StatusBar,
    Dimensions,
    StyleSheet,
    ScrollView,
    useWindowDimensions,
} from 'react-native';
const { width } = Dimensions.get('window');
import { MultiSelect } from 'react-native-element-dropdown';
import { borderColor, primaryColor } from '../../styles/colors';
import { fontFamilyMedium } from '../../styles/fontStyle';

export default MutipleselectDropdown = ({
    selectedd = [],
    setSelectedd,
    data,
    infoName,
    containerStyle,
    value,
}) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const [selected, setSelected] = useState(selectedd);
    const handleSelect = (items) => {
        setSelected(items);
        setSelectedd(items);
    };
    const cropType = ['Wheat', 'Barley', 'Paddy', 'Rice', 'Dal', 'Others'];
    return (
        <View style={[styles.textInputContainer, containerStyle]}>
            <View style={styles.textInputInner}>
                <Text style={styles.infoName}>{infoName}</Text>
                <View style={{ paddingHorizontal: 12 }}>
                    <MultiSelect
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        iconStyle={styles.iconStyle}
                        search
                        data={data?.map((i)=>{return{label: i?.name, value: i?.key}})}
                        labelField="label"
                        valueField="value"
                        placeholder="Select item"
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
            borderColor: '#c6f1d3',
            borderWidth: 1,
            borderRadius: 10,
            paddingRight: 5,
            paddingTop: 5,
            color: '#000'
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
            color: '#000'
        },
        dropdown: {
            paddingHorizontal: 8,
            marginTop: 10,
            marginBottom: 6,
            fontSize: 12 / fontScale,
            backgroundColor: borderColor,
            borderRadius: 8,
        },
        selectedStyle:{
            backgroundColor:primaryColor,
            borderRadius: 8,
            padding:6
        },
        selectedTextStyle:{
            color:'#fff',
            fontSize: 12/fontScale,
            fontFamily: fontFamilyMedium
        },
        placeholderStyle:{
            color:'#000',
            fontFamily: fontFamilyMedium,
            fontSize: 12/fontScale
        },
        itemTxtStyle:{
            fontSize: 12/fontScale,
            color: '#000',
        }
    });
