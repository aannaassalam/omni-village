import { Dimensions, Image, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { Styles } from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useTranslation } from 'react-i18next';
import Geolocation from 'react-native-geolocation-service';
import { Divider, TextInput } from 'react-native-paper';
import { fontFamilyMedium } from '../../styles/fontStyle';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Input from '../../Components/Inputs/Input';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';
import AcresElement from '../../Components/ui/AcresElement';
import { useUser } from '../../Hooks/useUser';
import YearPicker from '../../Components/YearPicker/YearPicker';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import { primaryColor } from '../../styles/colors';

const LandholdingUsage = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const {land} = route.params
    const { t } = useTranslation()
    const { data: user } = useUser()
    const scheme = yup.object().shape({
        land_located: yup.string().required(t('Land Located is required')),
        total_land_area: yup.number().required(t('Total land area is required')),
        year_purchased: yup.number().required(t('Year purchased is required')),
        geotag: yup.string().required(t('Geotag is required')),
    })
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
            land_located: '',
            total_land_area: '',
            year_purchased: '',
            geotag: '',
        },
        // validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            navigation.navigate('landSpecification', { landholding: values, land })
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
                    setCoordinates: (coords) =>
                        setValues({
                            ...values,
                            geotag: `${coords.latitude},${coords.longitude}`,
                        }),
                    my_location: {
                        lat: parseFloat(values?.geotag.split(',')[0]) || null,
                        lng: parseFloat(values?.geotag.split(',')[1]) || null,
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
                        setCoordinates: (coords) =>
                            setValues({
                                ...values,
                                geotag: `${coords.latitude},${coords.longitude}`,
                            }),
                        my_location: {
                            lat: parseFloat(values?.geotag.split(',')[0]) || null,
                            lng: parseFloat(values?.geotag.split(',')[1]) || null,
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
                        if (!values?.geotag.length)
                            setValues({
                                ...values,
                                geotag: `${position.coords.latitude},${position.coords.longitude}`,
                            });
                    },
                    error => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                        setValues({ ...values, address: '' });
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
                headerName={`${t('landholding')} (${land})`}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <View style={[styles.subArea, { marginTop: '3%' }]}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center', color: '#000' }]}>{t('landholding details')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '64%' }]}
                        horizontalInset={true}
                    />
                </View>
                <CustomDropdown
                    data={[
                        { id: 1, label: 'Inside village', value: 'Inside village' },
                        { id: 2, label: 'Outside village', value: 'Outside village' },
                    ]}
                    value={values.land_located}
                    label={t('Where is the Land located ?')}
                    onChange={(value) => {
                        setValues({
                            ...values,
                            land_located: value?.value,
                        });
                    }}
                />
                {touched?.land_located && errors?.land_located && (
                    <Text style={Styles.error2}>{String(errors?.land_located)}</Text>
                )}
                <Input
                    label={t('Total area of the land')}
                    value={values.total_land_area}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType='numeric'
                    onChangeText={handleChange('total_land_area')}
                    isRight={<AcresElement title={user?.land_measurement_symbol} />}
                />
                {touched?.total_land_area && errors?.total_land_area && (
                    <Text style={Styles.error2}>{String(errors?.total_land_area)}</Text>
                )}
                <View style={[styles.subArea, { marginTop: '3%' }]}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center', color: '#000' }]}>{t('year purchased/allocated')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '53%' }]}
                        horizontalInset={true}
                    />
                </View>
                <YearPicker
                    onYearChange={(year) => {
                        setValues({ ...values, year_purchased: parseInt(year)})
                                  }}
                    selectedYear={values?.year_purchased}
                    label={t('Kindly mention the year of land purchase')}
                />
                {errors.year_purchased && errors.year_purchased && (
                    <Text style={Styles.error2}>{errors.year_purchased}</Text>
                )}
                <View style={[styles.subArea, { marginTop: '3%' }]}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center', color: '#000' }]}>{t('Geotag location')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '73%' }]}
                        horizontalInset={true}
                    />
                </View>
                <View style={styles.geotag_container}>
                    <Text style={[Styles.fieldLabel,{width:'65%',marginTop:0, alignSelf:'center'}]}>{t('Press Geotag to start locating the land owned per user.')}</Text>
                    <CustomButton btnText={'Geotag'} onPress={getLocation}/>
                </View>
                {errors.geotag && errors.geotag && (
                    <Text style={Styles.error2}>{errors.geotag}</Text>
                )}
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
    subArea: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: '5%',
        width: width / 1.04,
        alignItems: 'center',
    },
    divider: {
        alignSelf: 'center',
        height: 1,
        width: '67%',
        color: 'grey',
    },
    uparrow: {
        height: 20,
        width: 20,
    },
    innerInputView: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginBottom: '5%',
        gap: 12,
        paddingHorizontal: 12
    },
    divider2: {
        // backgroundColor: 'grey',
        alignSelf: 'flex-start',
        height: '100%',
        marginTop: 9,
        width: '1%',
        borderRadius: 10,
    },
    geotag_container:{
        borderColor: primaryColor,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        flexDirection:'row',
        gap: 8,
        justifyContent:'space-between',
        marginTop: 12,
    }
})