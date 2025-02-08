import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Customdropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { Styles, width } from '../../styles/globalStyles';
import Input from '../../Components/Inputs/Input';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get_dropdown_data } from '../../functions/AuthScreens';
import { borderColor, primaryColor } from '../../styles/colors';
import { addDemographic, editDemographic } from '../../functions/demographic';
import PopupModal from '../../Components/Popups/PopupModal';

const DemographicAspiration = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const { demographic, occupation, disease, habits, data, member_id, member_name,
        demographic_id } = route.params
    const { t } = useTranslation()
    const [aspiration,setAspiration]=useState(true)
    const [savepopup, setSavepopup] = useState(false);
    const [message, setMessage] = useState('');
    const [draftpopup, setDraftpopup] = useState(false);
    const queryClient = useQueryClient()
    const { data: dropdownData, isLoading: dropdown_loading } = useQuery({
        queryKey: ['dropdown_data'],
        queryFn: get_dropdown_data,
        refetchOnWindowFocus: true,
    })
    const { mutate: add_demographic } = useMutation({
        mutationKey: ['save_demographic'],
        mutationFn: async (data) => {
            addDemographic(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss save", data)
            navigation.replace('home') 
        },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const { mutate: edit_demographic } = useMutation({
        mutationKey: ['edit_demographic'],
        mutationFn: async (data) => {
            editDemographic(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss edit", data)
             navigation.replace('home') 
            },
        onError: (error) => console.log("error edit", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const scheme = yup.object().shape({
        economic: yup.array().required('Economic aspiration is required').min(1,t('Atleast one economic aspiration is required')),
        educational: yup.array().required('Educational aspiration is required').min(1,t('Atleast one educational aspiration is required')),
        health_well_being: yup.array().required('Health and well-being aspiration is required').min(1,t('Atleast one health and well-being aspiration is required')),
        infrastructure_technology: yup.array().required('Infrastructure and technology aspiration is required').min(1,t('Atleast one infrastructure and technology aspiration is required')),
        environmental_sustainability: yup.array().required('Environmental sustainability aspiration is required').min(1,t('Atleast one environmental sustainability aspiration is required')),
        cultural: yup.array().required('Cultural aspiration is required').min(1,t('Atleast one cultural aspiration is required')),
        community_social: yup.array().required('Community and social aspiration is required').min(1,t('Atleast one community and social aspiration is required')),
        personal_growth: yup.array().required('Personal growth aspiration is required').min(1,t('Atleast one personal growth aspiration is required')),
        spiritual: yup.array().required('Spiritual aspiration is required').min(1,t('Atleast one spiritual aspiration is required')),
        unfulfilled_needs: yup.string(),
        wishes: yup.string()
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
            economic: [],
            educational: [],
            health_well_being: [],
            infrastructure_technology: [],
            environmental_sustainability: [],
            cultural: [],
            community_social: [],
            personal_growth: [],
            spiritual: [],
            unfulfilled_needs:"",
            wishes:"",
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            setSavepopup(true)
            // navigation.navigate('demographicUnfulfilled',{
            //     occupation,
            //     disease,
            //     habits,
            //     demographic,
            //     aspiration: values,
            //     data:data,
            //     member_id,
            //     demographic_id
            // })
        },
    });
    useEffect(()=>{
        resetForm({
            values:{
                economic: data?.aspiration?.economic.map((i) => { return i?._id }) || [],
                educational: data?.aspiration?.educational.map((i) => { return i?._id }) || [],
                health_well_being: data?.aspiration?.health_well_being.map((i) => { return i?._id }) || [],
                infrastructure_technology: data?.aspiration?.infrastructure_technology.map((i) => { return i?._id }) || [],
                environmental_sustainability: data?.aspiration?.environmental_sustainability.map((i) => { return i?._id }) || [],
                cultural: data?.aspiration?.cultural.map((i) => { return i?._id }) || [],
                community_social: data?.aspiration?.community_social.map((i) => { return i?._id }) || [],
                personal_growth: data?.aspiration?.personal_growth.map((i) => { return i?._id }) || [],
                spiritual: data?.aspiration?.spiritual.map((i) => { return i?._id }) || [],
                unfulfilled_needs: String(data?.general_data?.unfulfilled_needs || ''),
                wishes: String(data?.general_data?.wishes || ''),
            }
        })
    },[data])
    const handleDraft = () => {
        let new_data = { ...demographic,  ...disease, ...habits, ...occupation, ...values }
        if (demographic_id) {
            edit_demographic({ ...new_data, status: 0, demographic_id: demographic_id })
        } else {
            add_demographic({ ...new_data, status: 0, member_id: member_id })
        }

    }
    const onSubmit = () => {
        let new_data = { ...demographic,...disease, ...habits, ...occupation, ...values }
        if (demographic_id) {
            edit_demographic({ ...new_data, status: 1, demographic_id: demographic_id })
        } else {
            add_demographic({ ...new_data, status: 1, member_id: member_id })
        }
    }
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
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>Aspiration</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '55%' }]}
                        horizontalInset={true}
                    />
                    <TouchableOpacity onPress={() => setAspiration(!aspiration)}>
                        {aspiration ? (
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
                {aspiration ?
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['economic_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, economic: item })
                                }
                                selectedd={values?.economic}
                                infoName={t('Spiritual Aspirations')}
                            />
                            {touched?.economic && errors?.economic && (
                                <Text style={Styles.error2}>{String(errors?.economic)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['educational_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, educational: item })
                                }
                                selectedd={values?.educational}
                                infoName={t('Intellectual Aspirations')}
                            />
                            {touched?.educational && errors?.educational && (
                                <Text style={Styles.error2}>{String(errors?.educational)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['health_and_wellbeing_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, health_well_being: item })
                                }
                                selectedd={values?.health_well_being}
                                infoName={t('Social Aspirations')}
                            />
                            {touched?.health_well_being && errors?.health_well_being && (
                                <Text style={Styles.error2}>{String(errors?.health_well_being)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['infrastructure_and_technology_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, infrastructure_technology: item })
                                }
                                selectedd={values?.infrastructure_technology}
                                infoName={t('Emotional Aspirations')}
                            />
                            {touched?.infrastructure_technology && errors?.infrastructure_technology && (
                                <Text style={Styles.error2}>{String(errors?.infrastructure_technology)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['environmental_and_sustainability_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, environmental_sustainability: item })
                                }
                                selectedd={values?.environmental_sustainability}
                                infoName={t('Physical aspirations')}
                            />
                            {touched?.environmental_sustainability && errors?.environmental_sustainability && (
                                <Text style={Styles.error2}>{String(errors?.environmental_sustainability)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['cultural_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, cultural: item })
                                }
                                selectedd={values?.cultural}
                                infoName={t('Occupational aspirations')}
                            />
                            {touched?.cultural && errors?.cultural && (
                                <Text style={Styles.error2}>{String(errors?.cultural)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['community_and_social_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, community_social: item })
                                }
                                selectedd={values?.community_social}
                                infoName={t('Environmental aspirations')}
                            />
                            {touched?.community_social && errors?.community_social && (
                                <Text style={Styles.error2}>{String(errors?.community_social)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['aspiration_for_personal_growth'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, personal_growth: item })
                                }
                                selectedd={values?.personal_growth}
                                infoName={t('Personal growth aspirations')}
                            />
                            {touched?.personal_growth && errors?.personal_growth && (
                                <Text style={Styles.error2}>{String(errors?.personal_growth)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['spiritual_aspiration'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, spiritual: item })
                                }
                                selectedd={values?.spiritual}
                                infoName={t('Spiritual aspirations')}
                            />
                            {touched?.spiritual && errors?.spiritual && (
                                <Text style={Styles.error2}>{String(errors?.spiritual)}</Text>
                            )}
                           
                        </View>
                    </View>
                    : null
                }
                <Input
                    label={t('Unfulfilled needs(If any)')}
                    value={values.unfulfilled_needs}
                    placeholder={''}
                    fullLength={true}
                    onChangeText={handleChange('unfulfilled_needs')}
                />
                {touched?.unfulfilled_needs && errors?.unfulfilled_needs && (
                    <Text style={Styles.error2}>{String(errors?.unfulfilled_needs)}</Text>
                )}
                <Input
                    label={t('Wishes')}
                    value={values.wishes}
                    placeholder={''}
                    fullLength={true}
                    onChangeText={handleChange('wishes')}
                />
                {touched?.wishes && errors?.wishes && (
                    <Text style={Styles.error2}>{String(errors?.wishes)}</Text>
                )}
            </KeyboardAwareScrollView>
            <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <CustomButton btnText={t('submit')} style={{ width: '48%', height: 60 }} onPress={handleSubmit} />
                <CustomButton btnText={t('save as draft')} style={{ width: '48%', height: 60, backgroundColor: borderColor }} onPress={() => { setDraftpopup(true) }} btnStyle={{ color: 'black' }} />
            </View>
            {/* submit popup */}
            <PopupModal
                modalVisible={savepopup}
                setBottomModalVisible={setSavepopup}
                styleInner={[Styles.savePopup, { width: '90%' }]}>
                <View style={Styles.submitPopup}>
                    <View style={Styles.noteImage}>
                        <Image
                            source={require('../../../assets/note.png')}
                            style={Styles.noteImage}
                        />
                    </View>
                    <Text style={Styles.confirmText}>{t('confirm')}</Text>
                    <Text style={Styles.nextText}>{t('')}</Text>
                    <View style={Styles.bottomPopupbutton}>
                        <CustomButton
                            style={Styles.submitButton}
                            btnText={t('submit')}
                            onPress={() => onSubmit()}
                        // loading={}
                        />
                        <CustomButton
                            style={Styles.draftButton}
                            btnText={t('cancel')}
                            onPress={() => {
                                setSavepopup(false);
                            }}
                        />
                    </View>
                </View>
            </PopupModal>
            {/* draft popup */}
            <PopupModal
                modalVisible={draftpopup}
                setBottomModalVisible={setDraftpopup}
                styleInner={[Styles.savePopup, { width: '90%' }]}>
                <View style={Styles.submitPopup}>
                    <View style={Styles.noteImage}>
                        <Image
                            source={require('../../../assets/note.png')}
                            style={Styles.noteImage}
                        />
                    </View>
                    <Text style={Styles.confirmText}>{t('save as draft')}</Text>
                    <Text style={Styles.nextText}>{t('')}</Text>
                    <View style={Styles.bottomPopupbutton}>
                        <CustomButton
                            style={Styles.submitButton}
                            btnText={t('save')}
                            onPress={() => handleDraft()}
                        // loading={}
                        />
                        <CustomButton
                            style={Styles.draftButton}
                            btnText={t('cancel')}
                            onPress={() => setDraftpopup(false)}
                        />
                    </View>
                </View>
            </PopupModal>
        </View>
    );
};

export default DemographicAspiration;

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
