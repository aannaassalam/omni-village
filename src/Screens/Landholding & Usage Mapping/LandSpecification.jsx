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

const LandSpecification = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const { t } = useTranslation()
    const {landholding,land} = route.params
    const { data: user } = useUser()
    const scheme = yup.object().shape({
        land_under_use: yup.string().required(t('Land Located is required')),
        purpose_land_utilised_for: yup.array().of(
            yup.object().shape({
                type: yup.string().required('Type is required'),
                total_land_area_utilised: yup
                    .number()
                    .required('Total land area utilised is required'),
            }),
        )
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
            land_under_use: false,
            purpose_land_utilised_for: [],
        },
        // validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            navigation.navigate('landholdingLandRequirement', { landholding, land, specification: values })
        },
    });
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={`${t('landholding')}(${land})`}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <View style={[styles.subArea, { marginTop: '3%' }]}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center', color: '#000' }]}>{t('landholding specification')}</Text>
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
                    value={values.land_under_use}
                    label={t('Is the Land under use?')}
                    onChange={(value) => {
                        setValues({
                            ...values,
                            land_under_use: value?.value,
                        });
                    }}
                />
                {touched?.land_under_use && errors?.land_under_use && (
                    <Text style={Styles.error2}>{String(errors?.land_located)}</Text>
                )}
                <MultiselectDropdown
                    containerStyle={{
                        marginTop: '5%',
                        paddingTop: 0,
                    }}
                    data={[]}
                    setSelectedd={(item) =>
                        setValues({ ...values, purpose_land_utilised_for: item })
                    }
                    selectedd={values?.purpose_land_utilised_for}
                    infoName={t('What are the purposes land utilised for?')}
                />
                {touched?.purpose_land_utilised_for && errors?.purpose_land_utilised_for && (
                    <Text style={Styles.error2}>{String(errors?.purpose_land_utilised_for)}</Text>
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
            </KeyboardAwareScrollView>
            <View style={Styles.bottomBtn}>
                <CustomButton btnText={t('next')} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
            </View>
        </View>
    )
}

export default LandSpecification
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
    geotag_container: {
        borderColor: primaryColor,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
        marginTop: 12,
    }
})