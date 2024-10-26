import { Dimensions, Image, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import * as yup from 'yup';
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { Styles } from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useTranslation } from 'react-i18next';
import Geolocation from 'react-native-geolocation-service';
import { Divider, TextInput } from 'react-native-paper';
import { fontFamilyMedium } from '../../styles/fontStyle';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFormik } from 'formik';

const LandholdingUsage = ({ navigation }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const { t } = useTranslation()
    const scheme = yup.object().shape({
        total_numbers_of_lands: yup.string().required(t('total number of lands owned is required'))
        .max(20, 'total number of lands owned cannot be greater than 20!')
            .min(1, 'At least one total number of lands owned is required'),
        details_of_land: yup.array()
            .of(
                yup.object().shape({
                    land_located: yup.string().required('Land located is required'),
                    total_land_area_owned: yup.number()
                        .required('Total land area owned is required'),
                    location: yup.string().required('Location is required'),
                    area_utilised_for: yup.string().required('Area utilised for is required'),
                    total_land_area_utilised: yup.number().required('Total land area utilised for is required'),
                    area_under_utilised: yup.string().required('Area under utilised is required'),
                    total_land_area_under_utilised: yup.number().required('Total area under utilised is required'),
                    year_purchased: yup.number().required('Year purchased is required')
                }),
            )
            .test(
                'total-land-count',
                'You must have exactly the number of land owned specified',
                function (value) {
                    const { total_numbers_of_lands } = this.parent;


                    // Check if the number of members matches the input
                    if (value) {
                        // If the lengths don't match, remove excess members
                        if (value.length > total_numbers_of_lands) {
                            return (values.details_of_land = values.details_of_land.slice(
                                0,
                                values.total_numbers_of_lands,
                            ));
                        }
                        return value.length === total_numbers_of_lands;
                    }
                    return total_numbers_of_lands === 0;
                },
            ),
    });
    const {
        handleChange,
        handleSubmit,
        values,
        errors,
        setFieldTouched,
        touched,
        resetForm,
        setValues
    } = useFormik({
        initialValues: {
            total_numbers_of_lands: '',
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            navigation.navigate('landholdingLandRequirement', { landholding: values })
        },
    });
    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const granted = await Geolocation.requestAuthorization('whenInUse');
            Geolocation.setRNConfiguration({
                skipPermissionRequests: false,
                authorizationLevel: 'whenInUse',
            });

            if (granted === 'granted') {
                navigation.navigate('MapScreen', {
                    setCoordinates: coords =>
                        setValue('geotag', `${coords.latitude},${coords.longitude}`),
                    my_location: {
                        lat: parseFloat(watch('geotag').split(',')[0]) || null,
                        lng: parseFloat(watch('geotag').split(',')[1]) || null,
                    },
                });
                return true;
            } else {
                console.log('You cannot use Geolocation');
                return false;
            }

        } else if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required!',
                        message: 'We need to access your location for address related data',
                        // buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === 'granted') {
                    navigation.navigate('MapScreen', {
                        setCoordinates: coords =>
                            setValue('geotag', `${coords.latitude},${coords.longitude}`),
                        my_location: {
                            lat: parseFloat(watch('geotag').split(',')[0]) || null,
                            lng: parseFloat(watch('geotag').split(',')[1]) || null,
                        },
                    });
                    return true;
                } else {
                    console.log('You cannot use Geolocation');
                    return false;
                }
            } catch (err) {
                return false;
            }
        }
    };

    const getLocation = async () => {
        const result = requestLocationPermission();
        result.then(res => {
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        console.log(position);
                        if (!watch('geotag').length)
                            setValue(
                                'geotag',
                                `${parseFloat(position.coords.latitude).toFixed(7)},${parseFloat(position.coords.longitude).toFixed(7)}`,
                            );
                    },
                    error => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                        setValue('geotag', '');
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        });
    };
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('landholding')}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
            </KeyboardAwareScrollView>
            <View style={Styles.bottomBtn}>
                <CustomButton btnText={t('next')} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
            </View>
        </View>
    )
}

export default LandholdingUsage
const { width } = Dimensions.get('window')
const makeStyles = fontScale => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 12,
    },
    mainContainer: {
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    textInputContainer: {
        marginTop: 16,
        width: width / 1.12,
        alignSelf: 'center',
    },
    textInput: {
        backgroundColor: '#fff',
        fontFamily: fontFamilyMedium,
        fontSize: 16 / fontScale,
        textAlign: 'auto',
    },
    item_header_txt: {
        fontSize: 14 / fontScale,
        fontFamily: fontFamilyMedium,
        textAlign: 'left',
        color: '#000',
        marginTop: 10,
        padding: 10,
    },
    item_container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginVertical: 4,
    },
    option_text: {
        alignSelf: 'center',
        paddingHorizontal: 10,
        color: '#000',
        fontSize: 14 / fontScale,
        fontFamily: fontFamilyMedium,
    },
})