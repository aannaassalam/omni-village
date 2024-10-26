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
import Input from '../../Components/Inputs/Input';
import { get_dropdown_data } from '../../functions/AuthScreens';
import { useQuery } from '@tanstack/react-query';
import { primaryColor } from '../../styles/colors';

const DemographicHabits = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const { t } = useTranslation()
    const [hobbies,setHobbies] = useState(false)
    const [skillset, setSkillset] = useState(false)
    const [skills,setSkills] = useState(false)
    const { demographic, occupation, disease, data, member_id,
        demographic_id } = route.params
    const { data: dropdownData, isLoading: dropdown_loading } = useQuery({
        queryKey: ['dropdown_data'],
        queryFn: get_dropdown_data,
        refetchOnWindowFocus: true,
    })
    const scheme = yup.object().shape({
        specific_habit: yup.string().required(t('Specific habit is required')),
        education_status: yup.string().required(t('Education status is required')),
        education_seeking_to_gain: yup.string().required(t('Education seeking to gain is required')),
        cultural_traditional_hobbies: yup.array().required('Cultural traditional hobbies are required').min(1, t('Atleast one Cultural traditional hobbies are required')),
        outdoor_nature_based_hobbies: yup.array().required('Outdoor nature based hobbies are required').min(1, t('Atleast one Outdoor nature based hobbies are required')),
        modern_digital_hobbies: yup.array().required('Modern digital hobbies are required').min(1, t('Atleast one Modern digital hobbies are required')),
        creative_artistics_hobbies: yup.array().required('Creative artistics hobbies are required').min(1, t('Atleast one Creative artistics hobbies are required')),
        other_hobbies: yup.string(),
        technical_vocational_skills_learn: yup.array().required('Technical vocational skills learn are required').min(1, t('Atleast one Technical vocational skills learn are required')),
        entrepreneurial_business_skills_learn: yup.array().required('Entrepreneurial business skills learn are required').min(1, t('Atleast one Entrepreneurial business skills learn are required')),
        digital_technological_skills_learn: yup.array().required('Digital technological learn are required').min(1, t('Atleast one Digital technological learn are required')),
        communication_language_skills_learn: yup.array().required('Communication language skills learn are required').min(1, t('Atleast one Communication language skills learn are required')),
        health_well_being_skills_learn: yup.array().required('Health well being skills learn are required').min(1, t('Atleast one Health well being skills learn are required')),
        creative_artistics_skills_learn: yup.array().required('Creative artistics skills learn are required').min(1, t('Atleast one Creative artistics skills learn are required')),
        others_skills_learn: yup.string(),
        technical_vocational_skills: yup.array().required('Technical vocational skills are required').min(1, t('Atleast one Technical vocational skills are required')),
        entrepreneurial_business_skills: yup.array().required('Entrepreneurial business skills are required').min(1, t('Atleast one Entrepreneurial business skills are required')),
        interpersonal_skills: yup.array().required('Interpersonal skills are required').min(1, t('Atleast one Interpersonal skills are required')),
        creative_artistic_skills: yup.array().required('Creative artistic skills are required').min(1, t('Atleast one Creative artistic skills are required')),
        professional_skills: yup.array().required('Professional skills are required').min(1, t('Atleast one Professional skills are required')),
        others_skills: yup.string()
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
            specific_habit: '',
            education_status: '',
            education_seeking_to_gain: '',
            cultural_traditional_hobbies:[],
            outdoor_nature_based_hobbies:[],
            modern_digital_hobbies:[],
            creative_artistics_hobbies:[],
            other_hobbies:'',
            technical_vocational_skills_learn:[],
            entrepreneurial_business_skills_learn:[],
            digital_technological_skills_learn:[],
            communication_language_skills_learn:[],
            health_well_being_skills_learn: [],
            creative_artistics_skills_learn: [],
            others_skills_learn:'',
            technical_vocational_skills: [],
            entrepreneurial_business_skills: [],
            interpersonal_skills: [],
            creative_artistic_skills: [],
            professional_skills:[],
            others_skills: ''
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            navigation.navigate('demographicAspiration', {
                demographic: demographic,
                occupation: occupation,
                disease: disease,
                data:data,
                member_id,
        demographic_id,
                habits: values
            })
        },
    });
    useEffect(()=>{
        resetForm({
            values:{
                specific_habit:data?.specific_habit ||'',
                education_status: data?.education_status ||'',
                education_seeking_to_gain: data?.education_seeking_to_gain || '',
                cultural_traditional_hobbies: data?.cultural_traditional_hobbies || [],
                outdoor_nature_based_hobbies: data?.outdoor_nature_based_hobbies || [],
                modern_digital_hobbies: data?.modern_digital_hobbies || [],
                creative_artistics_hobbies: data?.creative_artistics_hobbies || [],
                other_hobbies:data?.other_hobbies || '',
                technical_vocational_skills_learn: data?.technical_vocational_skills_learn || [],
                entrepreneurial_business_skills_learn: data?.entrepreneurial_business_skills_learn || [],
                digital_technological_skills_learn: data?.digital_technological_skills_learn || [],
                skills_learn: data?.digital_technological_skills_learn || [],
                communication_language_skills_learn: data?.communication_language_skills_learn || [],
                health_well_being_skills_learn: data?.health_well_being_skills_learn || [],
                creative_artistics_skills_learn: data?.creative_artistics_skills_learn || [],
                others_skills_learn: data?.others_skills_learn || '',
                technical_vocational_skills: data?.technical_vocational_skills || [],
                entrepreneurial_business_skills: data?.entrepreneurial_business_skills || [],
                interpersonal_skills: data?.interpersonal_skills || [],
                creative_artistic_skills: data?.creative_artistics_skills || [],
                professional_skills:data?.professional_skills || [],
                others_skills:data?.others_skills || ''
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
                <Customdropdown
                    data={dropdownData?.['habbits'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
                    value={values.specific_habit}
                    label={t('Do you have any specific habits?')}
                    onChange={(value) => {
                        setValues({
                            ...values,
                            specific_habit: value?.value,
                        });
                    }}
                />
                {touched?.specific_habit && errors?.specific_habit && (
                    <Text style={Styles.error2}>{String(errors?.specific_habit)}</Text>
                )}
                <Customdropdown
                    data={dropdownData?.['current_education_status'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
                    value={values.education_status}
                    label={t('Mention your current education status')}
                    onChange={(value) => {
                        setValues({
                            ...values,
                            education_status: value?.value,
                        });
                    }}
                />
                {touched?.education_status && errors?.education_status && (
                    <Text style={Styles.error2}>{String(errors?.education_status)}</Text>
                )}
                <Customdropdown
                    data={dropdownData?.['education_seeking_to_gain'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
                    value={values.education_seeking_to_gain}
                    label={t('Education seeking to gain')}
                    onChange={(value) => {
                        setValues({
                            ...values,
                            education_seeking_to_gain: value?.value,
                        });
                    }}
                />
                {touched?.education_seeking_to_gain && errors?.education_seeking_to_gain && (
                    <Text style={Styles.error2}>{String(errors?.education_seeking_to_gain)}</Text>
                )}
                {/* // NOTE: Hobbies section */}
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Hobbies')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '65%' }]}
                        horizontalInset={true}
                    />
                    <TouchableOpacity onPress={() => setHobbies(!hobbies)}>
                        {hobbies ? (
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
                {hobbies ?
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['cultural_and_traditional_hobbies'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, cultural_traditional_hobbies: item })
                                }
                                selectedd={values?.cultural_traditional_hobbies}
                                infoName={t('Cultural and traditional hobbies')}
                            />
                            {touched?.cultural_traditional_hobbies && errors?.cultural_traditional_hobbies && (
                                <Text style={Styles.error2}>{String(errors?.cultural_traditional_hobbies)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['outdoor_and_nature_based_hobbies'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, outdoor_nature_based_hobbies: item })
                                }
                                selectedd={values?.outdoor_nature_based_hobbies}
                                infoName={t('Outdoor and nature based hobbies')}
                            />
                            {touched?.outdoor_nature_based_hobbies && errors?.outdoor_nature_based_hobbies && (
                                <Text style={Styles.error2}>{String(errors?.outdoor_nature_based_hobbies)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['modern_and_digital_hobbies'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, modern_digital_hobbies: item })
                                }
                                selectedd={values?.modern_digital_hobbies}
                                infoName={t('Modern digital hobbies')}
                            />
                            {touched?.modern_digital_hobbies && errors?.modern_digital_hobbies && (
                                <Text style={Styles.error2}>{String(errors?.modern_digital_hobbies)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['creative_and_artistic_hobbies'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, creative_artistics_hobbies: item })
                                }
                                selectedd={values?.creative_artistics_hobbies}
                                infoName={t('Creative and Artistic Hobbies')}
                            />
                            {touched?.creative_artistics_hobbies && errors?.creative_artistics_hobbies && (
                                <Text style={Styles.error2}>{String(errors?.creative_artistics_hobbies)}</Text>
                            )}
                            <Input
                                label={t('Other Hobbies(Specify if any)')}
                                value={values.other_hobbies}
                                placeholder={''}
                                fullLength={true}
                                onChangeText={handleChange('other_hobbies')}
                            />
                        </View>
                    </View>
                    : null
                }
                {/* NOTE: Skillset section */}
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Skillset')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '65%' }]}
                        horizontalInset={true}
                    />
                    <TouchableOpacity onPress={() => setSkillset(!skillset)}>
                        {skillset ? (
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
                {skillset ?
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['technical_and_vocational_skills'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, technical_vocational_skills: item })
                                }
                                selectedd={values?.technical_vocational_skills}
                                infoName={t('Technical and Vocational Skills')}
                            />
                            {touched?.technical_vocational_skills && errors?.technical_vocational_skills && (
                                <Text style={Styles.error2}>{String(errors?.technical_vocational_skills)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['entrepreneurical_and_business_skills'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, entrepreneurial_business_skills: item })
                                }
                                selectedd={values?.entrepreneurial_business_skills}
                                infoName={t('Entrepreneurial and Business Skills')}
                            />
                            {touched?.entrepreneurial_business_skills && errors?.entrepreneurial_business_skills && (
                                <Text style={Styles.error2}>{String(errors?.entrepreneurial_business_skills)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['interpersonal_skills'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, interpersonal_skills: item })
                                }
                                selectedd={values?.interpersonal_skills}
                                infoName={t('Interpersonal Skills')}
                            />
                            {touched?.interpersonal_skills && errors?.interpersonal_skills && (
                                <Text style={Styles.error2}>{String(errors?.interpersonal_skills)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['creative_and_artistic_skills'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, creative_artistic_skills: item })
                                }
                                selectedd={values?.creative_artistic_skills}
                                infoName={t('Creative and Artistic Skills')}
                            />
                            {touched?.creative_artistic_skills && errors?.creative_artistic_skills && (
                                <Text style={Styles.error2}>{String(errors?.creative_artistic_skills)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['professional_skills'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, professional_skills: item })
                                }
                                selectedd={values?.professional_skills}
                                infoName={t('Professional Skills')}
                            />
                            {touched?.professional_skills && errors?.professional_skills && (
                                <Text style={Styles.error2}>{String(errors?.professional_skills)}</Text>
                            )}
                            <Input
                                label={t('Others skills(Specify if any)')}
                                value={values.others}
                                placeholder={''}
                                fullLength={true}
                                onChangeText={handleChange('others')}
                            />
                        </View>
                    </View>
                    : null
                }
                {/* NOTE: Skills seeking to learn */}
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Skillset seeking to learn')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '35%' }]}
                        horizontalInset={true}
                    />
                    <TouchableOpacity onPress={() => setSkills(!skills)}>
                        {skills ? (
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
                {skills ?
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['technical_and_vocational_skills_learn'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, technical_vocational_skills_learn: item })
                                }
                                selectedd={values?.technical_vocational_skills_learn}
                                infoName={t('Technical and Vocational Skills Learn')}
                            />
                            {touched?.technical_vocational_skills_learn && errors?.technical_vocational_skills_learn && (
                                <Text style={Styles.error2}>{String(errors?.technical_vocational_skills_learn)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['entrepreneurial_and_business_skills_learn'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, entrepreneurial_business_skills_learn: item })
                                }
                                selectedd={values?.entrepreneurial_business_skills_learn}
                                infoName={t('Entrepreneurial and Business Skills Learn')}
                            />
                            {touched?.entrepreneurial_business_skills_learn && errors?.entrepreneurial_business_skills_learn && (
                                <Text style={Styles.error2}>{String(errors?.entrepreneurial_business_skills_learn)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['digital_and_technological_skills_learn'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, digital_technological_skills_learn: item })
                                }
                                selectedd={values?.digital_technological_skills_learn}
                                infoName={t('Digital and Technological Skills Learn')}
                            />
                            {touched?.digital_technological_skills_learn && errors?.digital_technological_skills_learn && (
                                <Text style={Styles.error2}>{String(errors?.digital_technological_skills_learn)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['health_and_wellbeing_skills_learn'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, health_well_being_skills_learn: item })
                                }
                                selectedd={values?.health_well_being_skills_learn}
                                infoName={t('Health and Well-being Skills Learn')}
                            />
                            {touched?.health_well_being_skills_learn && errors?.health_well_being_skills_learn && (
                                <Text style={Styles.error2}>{String(errors?.health_well_being_skills_learn)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['communication_and_language_skills_learn'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, communication_language_skills_learn: item })
                                }
                                selectedd={values?.communication_language_skills_learn}
                                infoName={t('Communication and language Skill Learn')}
                            />
                            {touched?.communication_language_skills_learn && errors?.communication_language_skills_learn && (
                                <Text style={Styles.error2}>{String(errors?.communication_language_skills_learn)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['creative_and_artistic_skills_learn'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, creative_artistics_skills_learn: item })
                                }
                                selectedd={values?.creative_artistics_skills_learn}
                                infoName={t('Creative and Artistic Skills Learn')}
                            />
                            {touched?.creative_artistics_skills_learn && errors?.creative_artistics_skills_learn && (
                                <Text style={Styles.error2}>{String(errors?.creative_artistics_skills_learn)}</Text>
                            )}
                            <Input
                                label={t('Others skiils learn(Specify if any)')}
                                value={values.others_skills}
                                placeholder={''}
                                fullLength={true}
                                onChangeText={handleChange('others_skills')}
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

export default DemographicHabits;

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
