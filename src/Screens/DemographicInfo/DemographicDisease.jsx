import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Customdropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useTranslation } from 'react-i18next';
import { Styles, width } from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { ActivityIndicator, Divider } from 'react-native-paper';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import { useQuery } from '@tanstack/react-query';
import { get_dropdown_data } from '../../functions/AuthScreens';
import { primaryColor } from '../../styles/colors';
import Input from '../../Components/Inputs/Input';

const DemographicDisease = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const { t } = useTranslation()
    const { demographic, occupation, data, member_id, member_name,
        demographic_id } = route.params
    const [mental, setMental] = useState(true)
    const { data: dropdownData, isLoading: dropdown_loading } = useQuery({
        queryKey: ['dropdown_data'],
        queryFn: get_dropdown_data,
        refetchOnWindowFocus: true,
    })
    const scheme = yup.object().shape({
        chronic_disease: yup.array().required(t('chronic disease is required')).min(1, t('Atleast one chronic disease is required')),
        other_chronic: yup.string(),
        motor_disablity: yup.string().required(t('motor disability is required')),
        other_motor: yup.string(),
        currently_feeling: yup.string().required(t('current feeling is required')),
        feelings_with_others: yup.string().required(t('feelings with others is required')),
        support_you_have: yup.array().required(t('support you have is required')).min(1, t('atleast one support is required')),
        recover_from_stress: yup.string().required(t('recover from stress is required')),
        share_feelings_of_others: yup.string().required(t('share feelings of others is required')),
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
            chronic_disease: [],
            other_chronic:'',
            motor_disablity: '',
            other_motor:'',
            currently_feeling: '',
            feelings_with_others: '',
            support_you_have: [],
            recover_from_stress: '',
            share_feelings_of_others: ''
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            navigation.navigate('demographicHabits', {
                demographic: demographic,
                occupation: occupation,
                disease: values,
                data: data,
                member_id,
                demographic_id,
                member_name
            })
        },
    });
    useEffect(() => {
        resetForm({
            values: {
                chronic_disease: data?.general_data?.chronic_disease?.map((i) => { return i?._id }) || [],
                other_chronic: data?.general_data?.other_chronic || '',
                motor_disablity: data?.general_data?.motor_disablity?._id || '',
                other_motor: data?.general_data?.other_motor || '',
                currently_feeling: data?.mental_and_emotional_wellbeing?.currently_feeling?._id || '',
                feelings_with_others: data?.mental_and_emotional_wellbeing?.feelings_with_others?._id || '',
                support_you_have: data?.mental_and_emotional_wellbeing?.support_you_have.map((i) => { return i?._id }) || [],
                recover_from_stress: data?.mental_and_emotional_wellbeing?.recover_from_stress?._id || '',
                share_feelings_of_others: data?.mental_and_emotional_wellbeing?.share_feelings_of_others?._id || '',
            }
        })
    }, [data])
    console.log("erororor", errors)
    if (dropdown_loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <ActivityIndicator size={'large'} color={primaryColor} />
        </View>
    }
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={`${t('demographic')} (${member_name})`}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <MultiselectDropdown
                    containerStyle={{
                        marginTop: '5%',
                        paddingTop: 0,
                    }}
                    data={dropdownData?.['chronic_diseases'].map((item) => { return { name: item?.name, key: item?._id } })}
                    setSelectedd={(item) =>
                        setValues({
                            ...values,
                            chronic_disease: item,
                        })
                    }
                    selectedd={values?.chronic_disease}
                    infoName={t('Do you have any chronic disease?')}
                />
                {touched?.chronic_disease && errors?.chronic_disease && (
                    <Text style={Styles.error2}>{String(errors?.chronic_disease)}</Text>
                )}
                {dropdownData?.['chronic_diseases'].find((item) => values?.chronic_disease.includes(item?._id))?.name === "Others(if any)" && (
                    <Input
                        label={t('Others(If any)')}
                        value={values.other_chronic}
                        placeholder={''}
                        fullLength={true}
                        keyboardType='default'
                        onChangeText={handleChange('other_chronic')}
                    />
                )}
                <Customdropdown
                    data={dropdownData?.['motor_disability'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
                    value={values.motor_disablity}
                    label={t('Do you have any motor disability?')}
                    onChange={(value) => {
                        setValues({
                            ...values,
                            motor_disablity: value?.value,
                        });
                    }}
                />
                {touched?.motor_disablity && errors?.motor_disablity && (
                    <Text style={Styles.error2}>{String(errors?.motor_disablity)}</Text>
                )}
                {dropdownData?.['motor_disability'].find((item) => item?._id === values?.motor_disablity)?.name === "other (please specify)" && (
                    <Input
                        label={t('Others(If any)')}
                        value={values.other_motor}
                        placeholder={''}
                        fullLength={true}
                        keyboardType='default'
                        onChangeText={handleChange('other_motor')}
                    />
                )}
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Mental Health & Emotional Well-being')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '15%' }]}
                        horizontalInset={true}
                    />
                    <TouchableOpacity onPress={() => setMental(!mental)}>
                        {mental ? (
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
                {mental ?
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <Customdropdown
                                data={dropdownData?.['overall_wellbeing'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
                                value={values.currently_feeling}
                                label={t('How are you currently feeling?')}
                                onChange={(value) => {
                                    setValues({
                                        ...values,
                                        currently_feeling: value?.value,
                                    });
                                }}
                            />
                            {touched?.currently_feeling && errors?.currently_feeling && (
                                <Text style={Styles.error2}>{String(errors?.currently_feeling)}</Text>
                            )}
                            <Customdropdown
                                data={dropdownData?.['communication_of_feelings'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
                                value={values.feelings_with_others}
                                label={t('Do you talk about your feelings with others?')}
                                onChange={(value) => {
                                    setValues({
                                        ...values,
                                        feelings_with_others: value?.value,
                                    });
                                }}
                            />
                            {touched?.feelings_with_others && errors?.feelings_with_others && (
                                <Text style={Styles.error2}>{String(errors?.feelings_with_others)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['support_system'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, support_you_have: item })
                                }
                                selectedd={values?.support_you_have}
                                infoName={t('What kind of support do you have ?')}
                            />
                            {touched?.support_you_have && errors?.support_you_have && (
                                <Text style={Styles.error2}>{String(errors?.support_you_have)}</Text>
                            )}
                            <Customdropdown
                                data={dropdownData?.['stress_and_resilience'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
                                value={values.recover_from_stress}
                                label={t('How do you manage and recover from stress?')}
                                onChange={(value) => {
                                    setValues({
                                        ...values,
                                        recover_from_stress: value?.value,
                                    });
                                }}
                            />
                            {touched?.recover_from_stress && errors?.recover_from_stress && (
                                <Text style={Styles.error2}>{String(errors?.recover_from_stress)}</Text>
                            )}
                            <Customdropdown
                                data={dropdownData?.['empathy'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
                                value={values.share_feelings_of_others}
                                label={t('How well do you understand & share feelings of others?')}
                                onChange={(value) => {
                                    setValues({
                                        ...values,
                                        share_feelings_of_others: value?.value,
                                    });
                                }}
                            />
                            {touched?.share_feelings_of_others && errors?.share_feelings_of_others && (
                                <Text style={Styles.error2}>{String(errors?.share_feelings_of_others)}</Text>
                            )}
                        </View>
                    </View>
                    : null
                }
            </KeyboardAwareScrollView>
            <View style={Styles.bottomBtn}>
                <CustomButton btnText={t('next')} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
            </View>
        </View>
    );
};

export default DemographicDisease;

const makeStyles = fontScale =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        subArea: {
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            margin: 10,
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
            gap: 16,
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
    });
