import React, { useState } from 'react';
import { View, Button, Modal, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { fontScale, Styles } from '../../styles/globalStyles';
import { primary } from '../../styles/colors';
import { fontFamilyMedium } from '../../styles/fontStyle';

const YearPicker = ({ selectedYear, onYearChange}) => {
    // const [modalVisible, setModalVisible] = useState(false);
    const [tempYear, setTempYear] = useState(selectedYear || new Date().getFullYear());

    const years = [];
    for (let i = 1900; i <= new Date().getFullYear(); i++) {
        years.push(i);
    }
    return (
        <View style={Styles.pickerContainer}>
            <Picker
                style={{ color: '#000' }}
                selectedValue={selectedYear}
                selectionColor={primary}
                onValueChange={itemValue => {
                    onYearChange(itemValue);
                }}>
                {years.map(year => (
                    <Picker.Item
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