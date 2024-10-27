import { Dimensions, Image, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import Input from '../../Components/Inputs/Input';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';
import AcresElement from '../../Components/ui/AcresElement';
import { useUser } from '../../Hooks/useUser';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import YearPicker from '../../Components/YearPicker/YearPicker';

const LandholdingUsage = ({ navigation }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const { t } = useTranslation()
    const {data:user} =useUser()
    const [landholdingDetails, setLandholdingDetails] = useState(true)
    const [collapsed, setCollapsed] = useState(
        Array(parseInt(values?.total_numbers_of_lands || 0)).fill(false)
    );

    // Toggle function for each collapsible section
    const toggleCollapse = (index) => {
        setCollapsed((prevState) =>
            prevState.map((isOpen, i) => (i === index ? !isOpen : isOpen))
        );
    };
    const scheme = yup.object().shape({
        total_numbers_of_lands: yup.number().required(t('Total number of lands owned is required'))
            .max(20, 'Total number of lands owned cannot be greater than 20!')
            .min(1, 'At least one total number of lands owned is required'),
        lands_owned_inside_village: yup.number().required(t('Lands owned inside village is required')),
        lands_owned_outside_village: yup.number().required(t('Lands owned outside village is required')),
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
        // .test(
        //     'total-land-count',
        //     'You must have exactly the number of land owned specified',
        //     function (value) {
        //         const { total_numbers_of_lands, details_of_land } = this.parent;
        //         console.log("valueeeee", value)

        //         // Check if the number of members matches the input
        //         if (value) {
        //             // If the lengths don't match, remove excess members
        //             if (value.length > total_numbers_of_lands) {
        //                 console.log("heereee")
        //                 return (values.details_of_land = values.details_of_land.slice(
        //                     0,
        //                     values.total_numbers_of_lands,
        //                 ));
        //             }
        //             console.log("here2", value.length, total_numbers_of_lands)
        //             return value.length === total_numbers_of_lands;
        //         }
        //         return total_numbers_of_lands === 0;
        //     },
        // )
    }).test(
        'land-limit',
        'The total of lands owned inside and outside the village cannot exceed the total number of lands owned',
        function (values) {
            const {
                lands_owned_inside_village,
                lands_owned_outside_village,
                total_numbers_of_lands
            } = values;

            const totalAllocatedLand =
                lands_owned_inside_village +
                lands_owned_outside_village;

            // Validate that the total allocated land does not exceed total land
            if (totalAllocatedLand > total_numbers_of_lands) {
                return this.createError({
                    path: 'total_numbers_of_lands',
                    message: `The total number of land (${totalAllocatedLand}) exceeds the available total number of land (${total_numbers_of_lands})`,
                });
            }
            return true;
        },
    )
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
            lands_owned_inside_village: '',
            lands_owned_outside_village: '',
            details_of_land: []
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
    useEffect(() => {
        const totalLands = parseInt(values.total_numbers_of_lands || 0);
        const newDetailsOfLand = Array(totalLands).fill().map((_, index) => ({
            land_located: '',
            total_land_area_owned: '',
            location: '',
            area_utilised_for: '',
            total_land_area_utilised: '',
            area_under_utilised: '',
            total_land_area_under_utilised: '',
            year_purchased: ''
        }));

        setValues(prevValues => ({
            ...prevValues,
            details_of_land: newDetailsOfLand
        }));

        // Set collapsed states for each land section
        setCollapsed(Array(totalLands).fill(false));
    }, [values.total_numbers_of_lands]);
    const handleFieldChange = (index, field, value) => {
        const newDetailsOfLand = [...values.details_of_land];
        newDetailsOfLand[index][field] = value;
        console.log("newdetaissss", newDetailsOfLand)
        setValues({ ...values, details_of_land: newDetailsOfLand });
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
                <View style={[styles.subArea, { marginTop: '3%' }]}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('landholding details')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '50%' }]}
                        horizontalInset={true}
                    />
                    <TouchableOpacity onPress={() => setLandholdingDetails(!landholdingDetails)}>
                        {landholdingDetails ? (
                            <Image
                                source={require('../../../assets/arrowUp.png')}
                                style={styles.uparrow}
                            />
                        ) : (
                            <Image
                                source={require('../../../assets/arrowDown.png')}
                                style={styles.uparrow}
                            />
                        )}
                    </TouchableOpacity>
                </View>
                {landholdingDetails ?
                    <>
                        <Input
                            label={t('Total number of lands owned')}
                            value={values.total_numbers_of_lands}
                            placeholder={''}
                            fullLength={true}
                            keyboardType='numeric'
                            onChangeText={handleChange('total_numbers_of_lands')}
                        />
                        {touched?.total_numbers_of_lands && errors?.total_numbers_of_lands && (
                            <Text style={Styles.error2}>{String(errors?.total_numbers_of_lands)}</Text>
                        )}
                        <View style={styles.innerInputView}>
                            <Divider style={styles.divider2} />
                            <View style={{ width: '100%' }}>
                                <Input
                                    label={t('Lands owned inside village')}
                                    value={values.lands_owned_inside_village}
                                    placeholder={'0'}
                                    fullLength={true}
                                    keyboardType='numeric'
                                    onChangeText={handleChange('lands_owned_inside_village')}
                                />
                                {touched?.lands_owned_inside_village && errors?.lands_owned_inside_village && (
                                    <Text style={Styles.error2}>{String(errors?.lands_owned_inside_village)}</Text>
                                )}
                                <Input
                                    label={t('Land owned outside village')}
                                    value={values.lands_owned_outside_village}
                                    placeholder={'0'}
                                    fullLength={true}
                                    keyboardType='numeric'
                                    onChangeText={handleChange('lands_owned_outside_village')}
                                />
                                {touched?.lands_owned_outside_village && errors?.lands_owned_outside_village && (
                                    <Text style={Styles.error2}>{String(errors?.lands_owned_outside_village)}</Text>
                                )}
                            </View>
                        </View>
                    </>
                    : null
                }
                {values.details_of_land.map((land, index) => {
                    return (
                        <>
                            <View style={[styles.subArea, { marginTop: '3%' }]}>
                                <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Details of land')}:{index + 1}</Text>
                                <Divider
                                    bold={true}
                                    style={[styles.divider, { width: '50%' }]}
                                    horizontalInset={true}
                                />
                                <TouchableOpacity onPress={() => toggleCollapse(index)}>
                                    <Image
                                        source={collapsed[index] ?
                                            require('../../../assets/arrowUp.png') : require('../../../assets/arrowDown.png')}
                                        style={styles.uparrow}
                                    />
                                </TouchableOpacity>
                            </View>
                            {collapsed[index] ?
                                <>
                                    <SwitchButton
                                        firstBtnPress={() => { handleFieldChange(index, 'land_located', 'Inside village') }}
                                        firstBtnText='Inside village'
                                        secondBtnPress={() => { handleFieldChange(index, 'land_located', 'Outside village') }}
                                        secondBtntext='Outside village'
                                        label={`Where is Land : ${index + 1} located ?`}
                                        selected={land?.land_located}
                                    />
                                    {errors.details_of_land && errors.details_of_land[index]?.land_located && (
                                        <Text style={Styles.error2}>{errors.details_of_land[index].land_located}</Text>
                                    )}
                                    <Input
                                        label={t('Kindly mention the total land area owned')}
                                        value={land.total_land_area_owned}
                                        placeholder={'0'}
                                        fullLength={true}
                                        keyboardType='numeric'
                                        onChangeText={(text) => handleFieldChange(index, 'total_land_area_owned', parseInt(text))}
                                        isRight={<AcresElement title={user?.land_measurement_symbol}/>}
                                    />
                                    {errors.details_of_land && errors.details_of_land[index]?.total_land_area_owned && (
                                        <Text style={Styles.error2}>{errors.details_of_land[index].total_land_area_owned}</Text>
                                    )}
                                    {/* <Input
                                        label={t('Kindly mention the total land area owned')}
                                        value={land.total_land_area_owned}
                                        placeholder={'0'}
                                        fullLength={true}
                                        keyboardType='numeric'
                                        onChangeText={(text) => handleFieldChange(index, 'total_land_area_owned', parseInt(text))}
                                        isRight={<AcresElement title={user?.land_measurement_symbol} />}
                                    />
                                    {touched?.total_land_area_owned && errors?.total_land_area_owned && (
                                        <Text style={Styles.error2}>{String(errors?.total_land_area_owned)}</Text>
                                    )} */}
                                    <MultiselectDropdown
                                        containerStyle={{
                                            marginTop: '5%',
                                            paddingTop: 0,
                                        }}
                                        data={[]}
                                        setSelectedd={(item) =>
                                            handleFieldChange(index, 'area_utilised_for', item)
                                        }
                                        selectedd={land?.area_utilised_for}
                                        infoName={t('Area utilised for')}
                                    />
                                    {errors.details_of_land && errors.details_of_land[index]?.area_utilised_for && (
                                        <Text style={Styles.error2}>{errors.details_of_land[index].area_utilised_for}</Text>
                                    )}
                                    <Input
                                        label={t('Kindly mention the total land area utilised for')}
                                        value={land.total_land_area_utilised}
                                        placeholder={'0'}
                                        fullLength={true}
                                        keyboardType='numeric'
                                        onChangeText={(text) => handleFieldChange(index, 'total_land_area_utilised', parseInt(text))}
                                        isRight={<AcresElement title={user?.land_measurement_symbol} />}
                                    />
                                    {errors.details_of_land && errors.details_of_land[index]?.total_land_area_utilised && (
                                        <Text style={Styles.error2}>{errors.details_of_land[index].total_land_area_utilised}</Text>
                                    )}
                                    <MultiselectDropdown
                                        containerStyle={{
                                            marginTop: '5%',
                                            paddingTop: 0,
                                        }}
                                        data={[]}
                                        setSelectedd={(item) =>
                                            handleFieldChange(index, 'area_under_utilised', item)
                                        }
                                        selectedd={land?.area_under_utilised}
                                        infoName={t('Area under utilised')}
                                    />
                                    {errors.details_of_land && errors.details_of_land[index]?.area_under_utilised && (
                                        <Text style={Styles.error2}>{errors.details_of_land[index].area_under_utilised}</Text>
                                    )}
                                    <Input
                                        label={t('Kindly mention the total land area under utilised')}
                                        value={land.total_land_area_under_utilised}
                                        placeholder={'0'}
                                        fullLength={true}
                                        keyboardType='numeric'
                                        onChangeText={(text) => handleFieldChange(index, 'total_land_area_under_utilised', parseInt(text))}
                                        isRight={<AcresElement title={user?.land_measurement_symbol} />}
                                    />
                                    {errors.details_of_land && errors.details_of_land[index]?.total_land_area_under_utilised && (
                                        <Text style={Styles.error2}>{errors.details_of_land[index].total_land_area_under_utilised}</Text>
                                    )}
                                    <YearPicker
                                        onYearChange={(year) => {
                                            handleFieldChange(index, 'year_purchased', parseInt(year))
                                        }}
                                        selectedYear={land?.year_purchased}
                                        label={'Kindly mention the year of land purchase'}
                                    />
                                    {errors.details_of_land && errors.details_of_land[index]?.year_purchased && (
                                        <Text style={Styles.error2}>{errors.details_of_land[index].year_purchased}</Text>
                                    )}
                                </>
                                : null
                            }
                        </>
                    )
                })}
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
})