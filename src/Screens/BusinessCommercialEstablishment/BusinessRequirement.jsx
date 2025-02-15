import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Styles, width } from '../../styles/globalStyles'
import { ActivityIndicator, Divider } from 'react-native-paper'
import * as yup from 'yup';
import { useFormik } from 'formik';
import CustomButton from '../../Components/CustomButton/CustomButton'
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown'
import { borderColor, primaryColor } from '../../styles/colors'
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown'
import PopupModal from '../../Components/Popups/PopupModal'
import { editHousing, getHousingDropdown } from '../../functions/housing'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'
import SwitchButton from '../../Components/SwitchButtons/SwitchButton'
import Input from '../../Components/Inputs/Input'
import { addBusiness, editBusiness, getBusiness, getBusinessById, getBusinessDropdown, getBusinessRequirement } from '../../functions/business'

const BusinessRequirement = ({ navigation, route }) => {
    const { t } = useTranslation()
    const { businessEmployee, businessName,businessInvestment, id, name } = route.params
    const [houseDetails, setHouseDetails] = useState(true)
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const queryClient = useQueryClient()
    const { data: business_dropdown, isLoading, refetch } = useQuery({
        queryKey: ['business_dropdown'],
        queryFn: () => getBusinessDropdown(),
        refetchOnWindowFocus: true,
    })
    const { data: business, isLoading:isBusinessLoading } = useQuery({
        queryKey: [`business_${id}`],
        queryFn: () => getBusinessById(id),
        refetchOnWindowFocus: true,
    })
    const { mutate: add_business } = useMutation({
        mutationKey: ['add_business'],
        mutationFn: async data => {
          addBusiness(data);
          queryClient.invalidateQueries();
        },
        onSuccess: data => {
          console.log('successsssss save', data),
              navigation.replace('businessCount');
        },
        onError: error => console.log('error save', error),
      });
    const { mutate: edit_business } = useMutation({
        mutationKey: ['edit_business'],
        mutationFn: async (data) => {
            editBusiness(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => {
            navigation.replace('businessCount')
        },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const scheme = yup.object().shape({
        skill_requirement: yup.boolean(),
        type_of_skill: yup.string().nullable().test(
            'type-of-skill-required',
            t('Type of skill is required when skill requirement is true'),
            function (value) {
                const { skill_requirement } = this.parent;
                return skill_requirement ? !!value : true;
            }
        ),
        skill_urgency: yup.string().nullable().test(
            'skill-urgency-required',
            t('Skill urgency is required when skill requirement is true'),
            function (value) {
                const { skill_requirement } = this.parent;
                return skill_requirement ? !!value : true;
            }
        ),
        manpower_requirement: yup.boolean(),
        number_of_manpower: yup.string().nullable().test(
            'number-of-manpower-required',
            t('Number of manpower is required when manpower requirement is true'),
            function (value) {
                const { manpower_requirement } = this.parent;
                return manpower_requirement ? !!value : true;
            }
        ),
        manpower_urgency: yup.string().nullable().test(
            'manpower-urgency-required',
            t('Manpower urgency is required when manpower requirement is true'),
            function (value) {
                const { manpower_requirement } = this.parent;
                return manpower_requirement ? !!value : true;
            }
        ),
        equipment_requirement: yup.boolean(),
        equipment_type: yup.string().nullable().test(
            'equipment-type-required',
            t('Equipment type is required when equipment requirement is true'),
            function (value) {
                const { equipment_requirement } = this.parent;
                return equipment_requirement ? !!value : true;
            }
        ),
        equipment_urgency: yup.string().nullable().test(
            'equipment-urgency-required',
            t('Equipment urgency is required when equipment requirement is true'),
            function (value) {
                const { equipment_requirement } = this.parent;
                return equipment_requirement ? !!value : true;
            }
        ),
        other: yup.string().nullable(),
        urgency: yup.string().nullable().test(
            'urgency-required',
            t('Urgency is required when other has a value'),
            function (value) {
                const { other } = this.parent;
                return other ? !!value : true;
            }
        ),
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
            skill_requirement: false,
            type_of_skill: '',
            skill_urgency: '',
            manpower_requirement: false,
            number_of_manpower: '',
            manpower_urgency: '',
            equipment_requirement: false,
            equipment_type: '',
            equipment_urgency: '',
            other: '',
            urgency: ''

        },
        validationSchema: scheme,
        onSubmit: async values => {
            console.log(values)
            setSavepopup(true)
        },
    });
    const handleDraft = () => {
        let new_data ={
            ...businessEmployee, ...businessInvestment, ...businessName, ...values, 
            status:0
        }
        if (id){
            edit_business({...new_data, business_id: id })
        }else{
            add_business(new_data)
        }

    }

    const onSubmit = () => {
        let new_data = {
            ...businessEmployee, ...businessInvestment, ...businessName, ...values, 
            status: 1
        }
        if (id) {
            edit_business({ ...new_data, business_id: id })
        } else {
            add_business(new_data)
        }
    }
    useEffect(() => {
        resetForm({
            values: {
                skill_requirement: business?.skill_requirement|| false,
                type_of_skill: business?.type_of_skill||'',
                skill_urgency: business?.skill_urgency||'',
                manpower_requirement: business?.manpower_requirement||false,
                number_of_manpower: String(business?.number_of_manpower || '')||'',
                manpower_urgency: business?.manpower_urgency||'',
                equipment_requirement: business?.equipment_requirement||false,
                equipment_type: business?.equipment_type||'',
                equipment_urgency: business?.equipment_urgency||'',
                other: business?.other||'',
                urgency: business?.urgency||''
            }
        })
    }, [business])
    if (isLoading||isBusinessLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
                <ActivityIndicator size={'large'} color={primaryColor} />
            </View>
        );
    }
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={name}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <SwitchButton
                    nolabel={false}
                    label={t('Skills Requirement?')}
                    selected={values?.skill_requirement}
                    firstBtnPress={() => setValues({ ...values, skill_requirement: true, })}
                    secondBtnPress={() => { setValues({ ...values, skill_requirement: false, }) }}
                    firstBtnText={t('yes')}
                    secondBtntext={t('no')}
                />
                {values?.skill_requirement ?
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <Input
                                label={t(
                                    `Type of skills`
                                )}
                                value={values?.type_of_skill}
                                placeholder={''}
                                fullLength={true}
                                keyboardType="default"
                                onChangeText={handleChange('type_of_skill')}
                            />
                            {errors.type_of_skill &&
                                errors.type_of_skill && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.type_of_skill
                                        }
                                    </Text>
                                )}
                            <CustomDropdown
                                data={
                                    business_dropdown?.urgency.map((item)=>{
                                        return{
                                            label: item?.name[USER_PREFERRED_LANGUAGE], value: item?._id
                                        }
                                    })
                                }
                                value={values?.skill_urgency}
                                label={t('Urgency')}
                                onChange={value => {
                                    setValues({
                                        ...values,
                                        skill_urgency: value?.value,
                                    });
                                }}
                            />
                            {touched?.skill_urgency && errors?.skill_urgency && (
                                <Text style={Styles.error2}>{String(errors?.skill_urgency)}</Text>
                            )}
                        </View>
                    </View>
                    : null
                }
                <SwitchButton
                    nolabel={false}
                    label={t('Manpower Requirement?')}
                    selected={values?.manpower_requirement}
                    firstBtnPress={() => setValues({ ...values, manpower_requirement: true, })}
                    secondBtnPress={() => { setValues({ ...values, manpower_requirement: false, }) }}
                    firstBtnText={t('yes')}
                    secondBtntext={t('no')}
                />
                {values?.manpower_requirement ?
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <Input
                                label={t(
                                    `Number of manpower required`
                                )}
                                value={values?.number_of_manpower}
                                placeholder={'0'}
                                fullLength={true}
                                keyboardType="numeric"
                                onChangeText={handleChange('number_of_manpower')}
                            />
                            {errors.number_of_manpower &&
                                errors.number_of_manpower && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.number_of_manpower
                                        }
                                    </Text>
                                )}
                            <CustomDropdown
                                data={
                                    business_dropdown?.urgency.map((item) => {
                                        return {
                                            label: item?.name[USER_PREFERRED_LANGUAGE], value: item?._id
                                        }
                                    })
                                }
                                value={values?.manpower_urgency}
                                label={t('Urgency')}
                                onChange={value => {
                                    setValues({
                                        ...values,
                                        manpower_urgency: value?.value,
                                    });
                                }}
                            />
                            {touched?.manpower_urgency && errors?.manpower_urgency && (
                                <Text style={Styles.error2}>{String(errors?.manpower_urgency)}</Text>
                            )}
                        </View>
                    </View>
                    : null
                }
                <SwitchButton
                    nolabel={false}
                    label={t('Equipment Requirement?')}
                    selected={values?.equipment_requirement}
                    firstBtnPress={() => setValues({ ...values, equipment_requirement: true, })}
                    secondBtnPress={() => { setValues({ ...values, equipment_requirement: false, }) }}
                    firstBtnText={t('yes')}
                    secondBtntext={t('no')}
                />
                {values?.equipment_requirement ?
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <Input
                                label={t(
                                    `Type of equipment`
                                )}
                                value={values?.equipment_type}
                                placeholder={''}
                                fullLength={true}
                                keyboardType="default"
                                onChangeText={handleChange('equipment_type')}
                            />
                            {errors.equipment_type &&
                                errors.equipment_type && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.equipment_type
                                        }
                                    </Text>
                                )}
                            <CustomDropdown
                                data={
                                    business_dropdown?.urgency.map((item) => {
                                        return {
                                            label: item?.name[USER_PREFERRED_LANGUAGE], value: item?._id
                                        }
                                    })
                                }
                                value={values?.equipment_urgency}
                                label={t('Urgency')}
                                onChange={value => {
                                    setValues({
                                        ...values,
                                        equipment_urgency: value?.value,
                                    });
                                }}
                            />
                            {touched?.equipment_urgency && errors?.equipment_urgency && (
                                <Text style={Styles.error2}>{String(errors?.equipment_urgency)}</Text>
                            )}
                        </View>
                    </View>
                    : null
                }
                <Input
                    label={t(
                        `Other Requirement`
                    )}
                    value={values?.other}
                    placeholder={''}
                    fullLength={true}
                    keyboardType="default"
                    onChangeText={handleChange('other')}
                />
                {errors.other &&
                    errors.other && (
                        <Text style={Styles.error2}>
                            {
                                errors.other
                            }
                        </Text>
                    )}
                {values?.other !== "" ?
                    <>
                        <CustomDropdown
                            data={
                                business_dropdown?.urgency.map((item) => {
                                    return {
                                        label: item?.name[USER_PREFERRED_LANGUAGE], value: item?._id
                                    }
                                })
                            }
                            value={values?.urgency}
                            label={t('Urgency')}
                            onChange={value => {
                                setValues({
                                    ...values,
                                    urgency: value?.value,
                                });
                            }}
                        />
                        {touched?.urgency && errors?.urgency && (
                            <Text style={Styles.error2}>{String(errors?.urgency)}</Text>
                        )}
                    </> : null
                }
            </KeyboardAwareScrollView>
            <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <CustomButton btnText={t('submit')} style={{ width: '48%', height: 60 }} onPress={handleSubmit} />
                <CustomButton btnText={t('save as draft')} style={{ width: '48%', height: 60, backgroundColor: borderColor }} onPress={() => { setDraftpopup(true) }} btnStyle={{ color: 'black' }} />
            </View>
            {/* submit popup */}
            <PopupModal
                modalVisible={savePopup}
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
                    <Text style={Styles.nextText}>
                        {t('lorem ipsum is simply dummy text of the.Lorem Ipsum.')}
                    </Text>
                    <View style={Styles.bottomPopupbutton}>
                        <CustomButton
                            style={Styles.submitButton}
                            btnText={t('submit')}
                            onPress={() => { onSubmit() }}
                        // loading={isAddPoultryPending || isEditPoultryPending}
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
                modalVisible={draftPopup}
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
                    <Text style={Styles.nextText}>
                        {t('lorem ipsum is simply dummy text of the.Lorem Ipsum.')}
                    </Text>
                    <View style={Styles.bottomPopupbutton}>
                        <CustomButton
                            style={Styles.submitButton}
                            btnText={t('save')}
                            onPress={handleDraft}
                        // loading={isAddPoultryPending || isEditPoultryPending}
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
    )
}

export default BusinessRequirement

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