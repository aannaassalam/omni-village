import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Customdropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useTranslation } from 'react-i18next';
import { Styles, width } from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { Divider } from 'react-native-paper';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import { useQuery } from '@tanstack/react-query';
import { get_dropdown_data } from '../../functions/AuthScreens';

const DemographicDisease = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const { t } = useTranslation()
    const { demographic, occupation } = route.params
    const [mental, setMental] = useState(false)
    const { data: dropdownData } = useQuery({
        queryKey: ['dropdown_data'],
        queryFn: get_dropdown_data,
        refetchOnWindowFocus: true,
    })
    const scheme = yup.object().shape({
        chronic_disease: yup.string().required('Chronic disease is required'),
        motor_disablity: yup.string().required('Motor disability is required'),
        currently_feeling: yup.string().required('Current feeling is required'),
        feelings_with_others: yup.string().required('Feelings with others is required'),
        support_you_have: yup.array().required('Support you have is required').min(1,'Atleast one support is required'),
        recover_from_stress: yup.string().required('Recover from stress is required'),
        share_feelings_of_others: yup.string().required('Share feelings of others is required'),
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
            chronic_disease: '',
            motor_disablity: '',
            currently_feeling: '',
            feelings_with_others: '',
            support_you_have: [],
            recover_from_stress: '',
            share_feelings_of_others: ''
        },
        // validationSchema: loginSchema,
        onSubmit: async (values) => {
            console.log(values);
            navigation.navigate('demographicHabits',{
                demographic: demographic,
                occupation: occupation,
                disease: values
            })
        },
    });
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={'Demographic'}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <Customdropdown
                    data={dropdownData?.['chronic_diseases'].map((item) => { return { id: item?._id, label: item?.name, value: item?.name } })}
                    value={values.chronic_disease}
                    label={'Do you have any chronic disease'}
                    onChange={(value) => {
                        setValues({
                            ...values,
                            chronic_disease: value?.value,
                        });
                    }}
                />
                {touched?.chronic_disease && errors?.chronic_disease && (
                    <Text style={Styles.error2}>{String(errors?.chronic_disease)}</Text>
                )}
                <Customdropdown
                    data={dropdownData?.['motor_disability'].map((item) => { return { id: item?._id, label: item?.name, value: item?.name } })}
                    value={values.motor_disablity}
                    label={'Do you have any motor disablity'}
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
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>Mental Health & Emotional Well-being</Text>
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
                        <View style={{width:'100%'}}>
                        <Customdropdown
                                data={dropdownData?.['overall_wellbeing'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
                            value={values.currently_feeling}
                            label={'How are you currently feeling?'}
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
                            label={'Do you talk about your feelings with others?'}
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
                            infoName={'What kind of support do you have ?'}
                        />
                        {touched?.support_you_have && errors?.support_you_have && (
                            <Text style={Styles.error2}>{String(errors?.support_you_have)}</Text>
                        )}
                        <Customdropdown
                                data={dropdownData?.['stress_and_resilience'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
                            value={values.recover_from_stress}
                                label={'How do you manage and recover from stress?'}
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
                            label={'How well do you understand & share feelings of others?'}
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
                <CustomButton btnText={'Next'} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
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
