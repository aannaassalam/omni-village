import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Customdropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useTranslation } from 'react-i18next';
import { Styles, width } from '../../styles/globalStyles';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import { Divider } from 'react-native-paper';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Input from '../../Components/Inputs/Input';
import { borderColor } from '../../styles/colors';
import { useQuery } from '@tanstack/react-query';
import { get_dropdown_data } from '../../functions/AuthScreens';

const DemographicWishes = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const { t } = useTranslation()
    const [wishes,setWishes] = useState(true)
    const { demographic, aspiration, disease, habits, occupation, unfulfilled } = route.params
    const { data: dropdownData } = useQuery({
        queryKey: ['dropdown_data'],
        queryFn: get_dropdown_data,
        refetchOnWindowFocus: true,
    })
    const scheme = yup.object().shape({
        for_community: yup.array().required('for community is required').min(1, 'Atleast one for community is required'),
        for_economy: yup.array().required('for economy is required').min(1, 'Atleast one for economy is required'),
        for_personal_growth: yup.array().required('for personal growth is required').min(1, 'Atleast one for personal growth is required'),
        for_environment: yup.array().required('for environment is required').min(1, 'Atleast one for environment is required'),
        for_family_future_generation: 
        yup.array().required('for family future generation is required').min(1, 'Atleast one for family future generation is required'),
        others: yup.string(),
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
            for_community: [],
            for_economy: [],
            for_personal_growth: [],
            for_environment: [],
            for_family_future_generation: [],
            others: '',
        },
        // validationSchema: loginSchema,
        onSubmit: async (values) => {
            console.log(values);
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
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>Wishes</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '70%' }]}
                        horizontalInset={true}
                    />
                    <TouchableOpacity onPress={() => setWishes(!wishes)}>
                        {wishes ? (
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
                {wishes ?
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['for_the_community'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, for_community: item })
                                }
                                selectedd={values?.for_community}
                                infoName={'For community'}
                            />
                            {touched?.for_community && errors?.for_community && (
                                <Text style={Styles.error2}>{String(errors?.for_community)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['for_the_economy'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, for_economy: item })
                                }
                                selectedd={values?.for_economy}
                                infoName={'For economy'}
                            />
                            {touched?.for_economy && errors?.for_economy && (
                                <Text style={Styles.error2}>{String(errors?.for_economy)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['for_personal_growth'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, for_personal_growth: item })
                                }
                                selectedd={values?.for_personal_growth}
                                infoName={'For personal growth'}
                            />
                            {touched?.for_personal_growth && errors?.for_personal_growth && (
                                <Text style={Styles.error2}>{String(errors?.for_personal_growth)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['for_the_environment'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, for_environment: item })
                                }
                                selectedd={values?.for_environment}
                                infoName={'For environment'}
                            />
                            {touched?.for_environment && errors?.for_environment && (
                                <Text style={Styles.error2}>{String(errors?.for_environment)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['for_family_and_future_generations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, for_family_future_generation: item })
                                }
                                selectedd={values?.for_family_future_generation}
                                infoName={'For family and future generation'}
                            />
                            {touched?.for_family_future_generation && errors?.for_family_future_generation && (
                                <Text style={Styles.error2}>{String(errors?.for_family_future_generation)}</Text>
                            )}
                            <Input
                                label={'Other(Specify if any)'}
                                value={values.others}
                                placeholder={''}
                                fullLength={true}
                                onChange={handleChange('others')}
                            />

                        </View>
                    </View>
                    : null
                }
            </KeyboardAwareScrollView>
            <View style={[Styles.bottomBtn, {flexDirection:'row', justifyContent:'space-between'}]}>
                <CustomButton btnText={t('submit')} style={{ width: '48%', height: 60 }} onPress={handleSubmit} />
                <CustomButton btnText={t('save as draft')} style={{ width: '48%', height: 60, backgroundColor:borderColor }} onPress={handleSubmit} btnStyle={{color:'black'}}/>
            </View>
        </View>
    );
};

export default DemographicWishes;

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
