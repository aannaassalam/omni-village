import React, { useState } from 'react';
import { View, Button, Modal, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { fontScale, Styles } from '../../styles/globalStyles';
import {borderColor, primaryColor } from '../../styles/colors';
import { fontFamilyMedium } from '../../styles/fontStyle';

const YearPicker = ({ selectedYear, onYearChange, label }) => {
    const [tempYear, setTempYear] = useState(selectedYear || new Date().getFullYear());

    const years = [];
    for (let i = 1900; i <= new Date().getFullYear(); i++) {
        years.push(i);
    }
    return (
        <View style={Styles.pickerContainer}>
            {label && <Text style={[Styles.fieldLabel,{marginTop:0}]}>{label}</Text>}
            <Picker
                style={{ color: '#000', backgroundColor:'#efefef',borderRadius:8 }}
                selectedValue={selectedYear}
                selectionColor={primaryColor}
                dropdownIconColor={'grey'}
                onValueChange={itemValue => {
                    onYearChange(itemValue);
                }}>
                {years.map(year => (
                    <Picker.Item
                    fontFamily={fontFamilyMedium}
                    style={{fontFamily: fontFamilyMedium}}
                        key={year}
                        label={year.toString()}
                        value={year}
                    />
                ))}
            </Picker>
        </View>
    );
};
export default YearPicker

const styles = StyleSheet.create({
})