import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Styles, width } from '../../styles/globalStyles'
import { Divider } from 'react-native-paper'
import * as yup from 'yup';
import { useFormik } from 'formik';
import CustomButton from '../../Components/CustomButton/CustomButton'
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown'
import { borderColor } from '../../styles/colors'
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown'
import Input from '../../Components/Inputs/Input'
import AcresElement from '../../Components/ui/AcresElement'
import { useUser } from '../../Hooks/useUser'

const HousingRequirement = ({ navigation, route }) => {
    const { t } = useTranslation()
    const { data: user } = useUser()
    const { data } = route.params
    const [houseDetails, setHouseDetails] = useState(true)
    const scheme = yup.object().shape({
        need_new_unit: yup.boolean(),
        new_unit_purpose: yup.string().required(t('Purpose of new unit is required')),
        new_unit_urgency: yup.string().required(t('Urgency of new unit is required')),
        land_for_new_unit: yup.boolean(),
        required_area: yup.number().required(t('Required area is required')),
    });
    const {
        handleChange,
        handleSubmit,
        values,
        errors,
        setFieldTouched,
        touched,
        resetForm,
        setValues,
    } = useFormik({
        initialValues: {
           need_new_unit: true,
           new_unit_purpose:'',
           new_unit_urgency:'',
           land_for_new_unit: true,
           required_area:''
        },
        // validationSchema: scheme,
        onSubmit: async values => {
            console.log(values)
        },
    });
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={`${t('Housing requirement')}`}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Housing Requirements')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '45%' }]}
                        horizontalInset={true}
                    />
                    <TouchableOpacity onPress={() => setHouseDetails(!houseDetails)}>
                        {houseDetails ? (
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
                {houseDetails ? <>
                    <CustomDropdown
                        data={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
                        value={values.need_new_unit}
                        label={t('Do you need a new unit ?')}
                        onChange={(value) => {
                            setValues({
                                ...values,
                                need_new_unit: value?.value,
                            });
                        }}
                    />
                    {touched?.need_new_unit && errors?.need_new_unit && (
                        <Text style={Styles.error2}>{String(errors?.need_new_unit)}</Text>
                    )}
                    {values?.need_new_unit && (
                        <View style={styles.innerInputView}>
                            <Divider style={styles.divider2} />
                            <View style={{ width: '100%' }}>
                                <CustomDropdown
                                    data={[{ label: 'Month', value: '1' }]}
                                    value={values.new_unit_purpose}
                                    label={t('Purpose')}
                                    onChange={(value) => {
                                        setValues({
                                            ...values,
                                            new_unit_purpose: value?.value,
                                        });
                                    }}
                                />
                                {touched?.new_unit_purpose && errors?.new_unit_purpose && (
                                    <Text style={Styles.error2}>{String(errors?.new_unit_purpose)}</Text>
                                )}
                                <CustomDropdown
                                    data={[{ label: 'Month', value: '1' }]}
                                    value={values.new_unit_urgency}
                                    label={t('Urgency')}
                                    onChange={(value) => {
                                        setValues({
                                            ...values,
                                            new_unit_urgency: value?.value,
                                        });
                                    }}
                                />
                                {touched?.new_unit_urgency && errors?.new_unit_urgency && (
                                    <Text style={Styles.error2}>{String(errors?.new_unit_urgency)}</Text>
                                )}
                            </View>
                        </View>
                    )}
                    <CustomDropdown
                        data={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
                        value={values.land_for_new_unit}
                        label={t('Do you need land for a new unit ? ')}
                        onChange={(value) => {
                            setValues({
                                ...values,
                                land_for_new_unit: value?.value,
                            });
                        }}
                    />
                    {touched?.land_for_new_unit && errors?.land_for_new_unit && (
                        <Text style={Styles.error2}>{String(errors?.land_for_new_unit)}</Text>
                    )}
                    {values?.land_for_new_unit && (
                        <View style={styles.innerInputView}>
                            <Divider style={styles.divider2} />
                            <View style={{ width: '100%' }}>
                                <Input
                                    label={t('Required Area ? ')}
                                    value={values.required_area}
                                    placeholder={''}
                                    fullLength={true}
                                    keyboardType='numeric'
                                    onChangeText={handleChange('required_area')}
                                    isRight={<AcresElement title={user?.land_measurement_symbol}/>}
                                />
                                {touched?.required_area && errors?.required_area && (
                                    <Text style={Styles.error2}>{String(errors?.required_area)}</Text>
                                )}
                            </View>
                        </View>
                    )}
                </> : null}
            </KeyboardAwareScrollView>
            <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <CustomButton btnText={t('submit')} style={{ width: '48%', height: 60 }} onPress={handleSubmit} />
                <CustomButton btnText={t('save as draft')} style={{ width: '48%', height: 60, backgroundColor: borderColor }} onPress={() => { }} btnStyle={{ color: 'black' }} />
            </View>
        </View>
    )
}

export default HousingRequirement

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    subArea: {
        alignSelf: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        // margin: 10,
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