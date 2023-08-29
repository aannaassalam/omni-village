import { StyleSheet, Text, TouchableHighlight, View, useWindowDimensions, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import CustomDropdown3 from '../CustomDropdown/CustomDropdown3';
import { Others, averageTreeAge, fertilisers, pesticides, soilHealth } from '../../MockData/Mockdata';
import { Divider } from 'react-native-paper';
import InputWithoutBorder from '../CustomInputField/InputWithoutBorder';
import InputLikeButton from '../CustomButton/InputLikeButton';
import InputWithoutRightElement from '../CustomInputField/InputWithoutRightElement';

const ImportantInformationHunting = ({ treeAgePress, fish, fishType }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    return (
        <View style={styles.container}>
            <InputWithoutBorder
                measureName={'kg'}
                productionName={'Number'}
                value={'10'}
                onChangeText={e => console.log(e)}
                notRightText={true}
            />
        </View>
    );
};

export default ImportantInformationHunting;

const makeStyles = fontScale =>
    StyleSheet.create({
        container: {
            width: '100%',
            alignSelf: 'center',
            marginBottom: '5%',
        },
        divider: {
            // backgroundColor: 'grey',
            alignSelf: 'flex-start',
            height: '100%',
            marginTop: 9,
            width: '1%',
            borderRadius: 10,
        },
        innerInputView: {
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
            width: '95%',
            marginBottom: '5%',
        },
        savePopup: {
            justifyContent: 'center',
            width: '97%',
            borderRadius: 20,
        },
        popupButton: {
            width: '70%',
            alignSelf: 'center',
        },
        bottomPopupbutton: {
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginTop: '5%',
        },
        submitButton: {
            width: '45%',
            margin: 10,
        },
        draftButton: {
            width: '45%',
            margin: 10,
            backgroundColor: 'grey',
        },
        confirmText: {
            alignSelf: 'center',
            fontSize: 18 / fontScale,
            color: '#000',
            fontFamily: 'ubuntu_medium',
            fontWeight: '500',
            padding: 10,
            textAlign: 'center',
        },
        nextText: {
            alignSelf: 'center',
            fontSize: 18 / fontScale,
            color: '#000',
            fontFamily: 'ubuntu',
            textAlign: 'center',
        },
        submitPopup: {
            alignItems: 'center',
            padding: 10,
        },
        noteImage: {
            padding: 10,
        },
    });
