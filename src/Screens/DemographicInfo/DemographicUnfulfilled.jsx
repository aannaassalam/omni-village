import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Customdropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useTranslation } from 'react-i18next';
import { Styles, width } from '../../styles/globalStyles';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import { ActivityIndicator, Divider } from 'react-native-paper';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Input from '../../Components/Inputs/Input';
import { useQuery } from '@tanstack/react-query';
import { get_dropdown_data } from '../../functions/AuthScreens';
import { primaryColor } from '../../styles/colors';

const DemographicUnfulfilled = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const { t } = useTranslation()
    const [unfulfilled,setUnfulfilled]  =useState(true)
    const { demographic, aspiration, disease, habits, occupation, data, member_id,
        demographic_id }=route.params
    const { data: dropdownData, isLoading: dropdown_loading } = useQuery({
        queryKey: ['dropdown_data'],
        queryFn: get_dropdown_data,
        refetchOnWindowFocus: true,
    })
    const scheme = yup.object().shape({
        basic_necessities: yup.array(),
        // .required('Basic necessities is required').min(1, 'Atleast one basic necessities is required'),
        educational_needs: yup.array(),
        // .required('Educational needs is required').min(1, 'Atleast one educational needs is required'),
        economic_needs: yup.array(),
        // .required('Economic needs is required').min(1, 'Atleast one economic needs is required'),
        healthcare_needs: yup.array(),
        // .required('Healthcare needs is required').min(1, 'Atleast one healthcare needs is required'),
        infrastructure_needs: yup.array(),
        // .required('Infrastructure needs is required').min(1, 'Atleast one infrastructure needs is required'),
        social_governance_needs: yup.array(),
        // .required('Social governance needs is required').min(1, 'Atleast one social governance needs is required'),
        environmental_needs: yup.array(),
        // .required('Environmental needs is required').min(1, 'Atleast one environmental needs is required'),
        others_needs: yup.string(),
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
            basic_necessities: [],
            educational_needs: [],
            economic_needs: [],
            healthcare_needs: [],
            infrastructure_needs: [],
            social_governance_needs: [],
            environmental_needs: [],
            others_needs: '',
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            navigation.navigate('demographicWishes', {
                occupation,
                disease,
                habits,
                demographic,
                aspiration,
                unfulfilled: values,
                data:data,
                member_id,
                demographic_id
            })
        },
    });
    useEffect(()=>{
resetForm({
    values:{
        basic_necessities: data?.basic_necessities || [],
        educational_needs: data?.educational_needs || [],
        economic_needs: data?.economic_needs || [],
        healthcare_needs: data?.healthcare_needs || [],
        infrastructure_needs: data?.infrastructure_needs || [],
        social_governance_needs: data?.social_governance_needs || [],
        environmental_needs: data?.environmental_needs || [],
        others_needs: data?.others_needs || '',
    }
})
    },[data])
    if (dropdown_loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <ActivityIndicator size={'large'} color={primaryColor} />
        </View>
    }
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('demographic')}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Unfulfilled needs(If any)')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '35%' }]}
                        horizontalInset={true}
                    />
                    <TouchableOpacity onPress={() => setUnfulfilled(!unfulfilled)}>
                        {unfulfilled ? (
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
                {unfulfilled ?
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['basic_necessities'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, basic_necessities: item })
                                }
                                selectedd={values?.basic_necessities}
                                infoName={t('Basic necessities')}
                            />
                            {touched?.economic && errors?.basic_necessities && (
                                <Text style={Styles.error2}>{String(errors?.basic_necessities)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['educational_needs'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, educational_needs: item })
                                }
                                selectedd={values?.educational_needs}
                                infoName={t('Educational needs')}
                            />
                            {touched?.educational_needs && errors?.educational_needs && (
                                <Text style={Styles.error2}>{String(errors?.educational_needs)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['economic_needs'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, economic_needs: item })
                                }
                                selectedd={values?.economic_needs}
                                infoName={t('Economic Needs')}
                            />
                            {touched?.economic_needs && errors?.economic_needs && (
                                <Text style={Styles.error2}>{String(errors?.economic_needs)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['healthcare_needs'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, healthcare_needs: item })
                                }
                                selectedd={values?.healthcare_needs}
                                infoName={t('Healthcare needs')}
                            />
                            {touched?.healthcare_needs && errors?.healthcare_needs && (
                                <Text style={Styles.error2}>{String(errors?.healthcare_needs)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['infrastructure_needs'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, infrastructure_needs: item })
                                }
                                selectedd={values?.infrastructure_needs}
                                infoName={t('Infrastructure needs')}
                            />
                            {touched?.infrastructure_needs && errors?.infrastructure_needs && (
                                <Text style={Styles.error2}>{String(errors?.infrastructure_needs)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['social_and_governance_needs'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, social_governance_needs: item })
                                }
                                selectedd={values?.social_governance_needs}
                                infoName={t('Self governance needs')}
                            />
                            {touched?.social_governance_needs && errors?.social_governance_needs && (
                                <Text style={Styles.error2}>{String(errors?.social_governance_needs)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['environmental_needs'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, environmental_needs: item })
                                }
                                selectedd={values?.environmental_needs}
                                infoName={t('Environmental needs')}
                            />
                            {touched?.environmental_needs && errors?.environmental_needs && (
                                <Text style={Styles.error2}>{String(errors?.environmental_needs)}</Text>
                            )}
                            <Input
                                label={t('Other needs(Specify if any)')}
                                value={values.others_needs}
                                placeholder={''}
                                fullLength={true}
                                onChangeText={handleChange('others_needs')}
                            />

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

export default DemographicUnfulfilled;

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
    });
