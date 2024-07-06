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
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
const { width } = Dimensions.get('window');
import SelectDropdown from 'react-native-select-dropdown';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import { MultipleSelectList, SelectList } from 'react-native-dropdown-select-list';
import { useTranslation } from 'react-i18next';
import '../../i18next';
import { fontFamilyMedium } from '../../styles/fontStyle';
import { primaryColor } from '../../styles/colors';

export default MutipleselectDropdown = ({
    placeholder,
    selectedValue,
    defaultVal,
    data,
    infoName,
    style,
    containerStyle,
    value,
}) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const cropType = ['Wheat', 'Barley', 'Paddy', 'Rice', 'Dal', 'Others'];
    const { t } = useTranslation();
    const [pressedVal, setPressedVal] = useState([])
    return (
        <View style={[styles.textInputContainer, containerStyle]}>
            <View style={styles.textInputInner}>
                <Text style={styles.infoName}>{infoName}</Text>
                <MultipleSelectList
                    setSelected={(val)=>{setPressedVal(val)}}
                    onSelect={()=>selectedValue(pressedVal)}
                    data={
                        data?.length >= 1 && data !== undefined
                            ? data.map((j, index) => {
                                return { key: j?.key, value: j?.name };
                            })
                            : cropType.map((i, index) => {
                                return { key: i, value: i };
                            })
                    }
                    save="key"
                    label='Selected Values are'
                    dropdownTextStyles={{
                        color: '#000',
                        fontSize: 14 / fontScale,
                    }}
                    placeholder={t('Select Option')}
                    searchPlaceholder="Search here"
                    inputStyles={{
                        color: '#000',
                        fontSize: 14 / fontScale,
                    }}
                    fontFamily={fontFamilyMedium}
                    labelStyles={{color:'#000'}}
                    search
                    badgeStyles={{backgroundColor:primaryColor,marginBottom:-5, padding:0}}
                    notFoundText="No data found"
                    boxStyles={[styles.boxStyle, style]}
                    dropdownItemStyles={[styles.dropdownstyle]}
                    dropdownStyles={{
                        borderColor: '#fff',
                        borderWidth: 1,
                        elevation: 2,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.3,
                        shadowRadius: 2,
                        backgroundColor: '#fff',
                        width: width/1.24,
                        alignSelf: 'center',
                        marginBottom: 10,
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
            borderColor: '#c6f1d3',
            borderWidth: 1,
            borderRadius: 10,
            paddingRight: 5,
            paddingTop: 5,
            color:'#000'
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
            backgroundColor:'#f7f7f7',
            alignSelf:'center',
            width: width/1.22,
            marginTop: 10,
            color: '#000'
        },
        dropdownstyle: {
            // backgroundColor: 'red'
            // fontSize: 12 / fontScale,
        },
    });
