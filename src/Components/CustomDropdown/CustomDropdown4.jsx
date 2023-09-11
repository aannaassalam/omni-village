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
import DropDownPicker from 'react-native-dropdown-picker';

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
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [items, setItems] = useState([
        { label: 'Apple', value: 'apple' },
        { label: 'Banana', value: 'banana' }
    ]);
    console.log("value", valu)
    // console.log("data", data)
    return (
        <DropDownPicker
            listMode='SCROLLVIEW'
            maxHeight={400}
            autoScroll={true}
            open={open}
            value={valu}
            items={data ? data?.map((i) => { return { label: i?.name, value: i?._id } }) : items}
            setOpen={setOpen}
            setValue={(item)=>selectedValue(item)}
            // setItems={selectedValue}
        />
    );
};

const makeStyles = fontScale =>
    StyleSheet.create({
        dropdown: {
            borderColor: 'blue',
            borderRadius: 6,
            // zIndex: 0,
        },
    });
