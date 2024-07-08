import React, { useState } from 'react';
import { View, Button, Modal, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const YearPicker = ({ selectedYear, onYearChange, modalVisible, setModalVisible }) => {
    // const [modalVisible, setModalVisible] = useState(false);
    const [tempYear, setTempYear] = useState(selectedYear || new Date().getFullYear());

    const years = [];
    for (let i = 1900; i <= new Date().getFullYear(); i++) {
        years.push(i);
    }
console.log("seleleeee", selectedYear)
    return (
        <View style={styles.container}>
            {/* <Button title="Select Year" onPress={() => setModalVisible(true)} /> */}
            <Text>Selected Year: {selectedYear}</Text>

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                {/* <View style={styles.modalContainer}> */}
                    {/* <View style={styles.pickerContainer}> */}
                        <Picker
                            selectedValue={tempYear}
                            onValueChange={(itemValue) => setTempYear(itemValue)}
                        >
                            {years.map((year) => (
                                <Picker.Item key={year} label={year.toString()} value={year} />
                            ))}
                        </Picker>
                        <Button
                            title="Done"
                            onPress={() => {
                                onYearChange(tempYear);
                                setModalVisible(false);
                            }}
                        />
                    {/* </View> */}
                 {/* </View> */}
             </Modal>
         </View>
    );
};
export default YearPicker

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    pickerContainer: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
    },
})