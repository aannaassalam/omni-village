import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
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
import PopupModal from '../../Components/Popups/PopupModal'
import { editHousing, getHousingDropdown } from '../../functions/housing'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'

const HouseholdRequirement = ({ navigation, route }) => {
    const { t } = useTranslation()
    const { house, housingData, housingPhoto, house_id, housing_data } = route.params
    const [houseDetails, setHouseDetails] = useState(true)
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const queryClient = useQueryClient()
    const { data: housing_dropdown, isLoading, refetch } = useQuery({
        queryKey: ['housing'],
        queryFn: () => getHousingDropdown(),
        refetchOnWindowFocus: true,
    })
    const { mutate: edit_housing } = useMutation({
        mutationKey: ['edit_housing'],
        mutationFn: async (data) => {
            editHousing(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { 
            navigation.replace('houseSpecificationQuestioner') 
        },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const scheme = yup.object().shape({
        equipment: yup.array().required(t('Equipment is required')),
        furnishing: yup.array().required(t('Furnishing is required')),
        renovation_requirement: yup.boolean(),
        renovation_urgency: yup.string(),
        expansion_requirement: yup.boolean(),
        expansion_urgency: yup.string()
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
            equipment:[],
            furnishing: [],
            renovation_requirement: false,
            renovation_urgency: '',
            expansion_requirement: false,
            expansion_urgency: '',
        },
        validationSchema: scheme,
        onSubmit: async values => {
            console.log(values)
            setSavepopup(true)
        },
    });
    const jsonToFormdata = (json) => {
        const formdata = new FormData();
        Object.keys(json).forEach((_data) => {
            if (Array.isArray(json[_data])) {
                json[_data].forEach((_item, index) => {
                    formdata.append(`${ _data }[${ index }]`, _item);
                });
            } else {
                formdata.append(_data, json[_data]);
            }
        });
        return formdata;
    };
    const handleDraft = () => {
        if (house_id) {
            edit_housing(jsonToFormdata({ ...housingData, ...housingPhoto, ...values, status: 0, housing_id: house_id }))
        } else{
            edit_housing(jsonToFormdata({ ...housingData, ...housingPhoto, ...values, status: 0, housing_id: house_id }))
        }
    }

    const onSubmit = () => {
        if (house_id) {
            edit_housing(jsonToFormdata({ ...housingData, ...housingPhoto, ...values, status:1, housing_id: house_id }))
        } else {
            edit_housing(jsonToFormdata({ ...housingData, ...housingPhoto, ...values, status: 1, housing_id: house_id }))
        }
    }
    useEffect(()=>{
        resetForm({
            values:{
                equipment: housing_data.equipment,
                furnishing: housing_data.furnishing,
                renovation_requirement: housing_data.renovation_requirement,
                renovation_urgency: housing_data.renovation_urgency,
                expansion_requirement: housing_data.expansion_requirement,
                expansion_urgency: housing_data.expansion_urgency,
            }
        })
    }, [housing_data])
    if (isLoading) {
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
                headerName={`${t('housing')} (${house})`}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Household Requirements')}</Text>
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
                    <MultiselectDropdown
                        containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                        data={housing_dropdown?.equipment.map((item) => { return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id } })}
                        setSelectedd={item => {
                            setValues({
                                ...values,
                                equipment: item,
                            });
                        }}
                        selectedd={values.equipment}
                        infoName={t('Equipments')}
                    />
                    {touched?.equipment && errors?.equipment && (
                        <Text style={Styles.error2}>{String(errors?.equipment)}</Text>
                    )}
                    <MultiselectDropdown
                        containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                        data={housing_dropdown?.furnishing.map((item) => { return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id } })}
                        setSelectedd={item => {
                            setValues({
                                ...values,
                                furnishing: item,
                            });
                        }}
                        selectedd={values.furnishing}
                        infoName={t('Furnishing')}
                    />
                    {touched?.furnishing && errors?.furnishing && (
                        <Text style={Styles.error2}>{String(errors?.furnishing)}</Text>
                    )}
                    <CustomDropdown
                        data={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
                        value={values.renovation_requirement}
                        label={t('Renovation requirement')}
                        onChange={(value) => {
                            setValues({
                                ...values,
                                renovation_requirement: value?.value,
                            });
                        }}
                    />
                    {touched?.renovation_requirement && errors?.renovation_requirement && (
                        <Text style={Styles.error2}>{String(errors?.renovation_requirement)}</Text>
                    )}
                    {values?.renovation_requirement && (
                        <View style={styles.innerInputView}>
                            <Divider style={styles.divider2} />
                            <View style={{ width: '100%' }}>
                                <CustomDropdown
                                    data={housing_dropdown?.urgency.map((item) => { return { label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id } })}
                                    value={values.renovation_urgency}
                                    label={t('Urgency')}
                                    onChange={(value) => {
                                        setValues({
                                            ...values,
                                            renovation_urgency: value?.value,
                                        });
                                    }}
                                />
                                {touched?.renovation_urgency && errors?.renovation_urgency && (
                                    <Text style={Styles.error2}>{String(errors?.renovation_urgency)}</Text>
                                )}
                            </View>
                        </View>
                    )}
                    <CustomDropdown
                        data={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
                        value={values.expansion_requirement}
                        label={t('Expansion requirement')}
                        onChange={(value) => {
                            setValues({
                                ...values,
                                expansion_requirement: value?.value,
                            });
                        }}
                    />
                    {touched?.expansion_requirement && errors?.expansion_requirement && (
                        <Text style={Styles.error2}>{String(errors?.expansion_requirement)}</Text>
                    )}
                    {values?.expansion_requirement && (
                        <View style={styles.innerInputView}>
                            <Divider style={styles.divider2} />
                            <View style={{ width: '100%' }}>
                                <CustomDropdown
                                    data={housing_dropdown?.urgency.map((item) => { return { label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id } })}
                                    value={values.expansion_urgency}
                                    label={t('Urgenncy')}
                                    onChange={(value) => {
                                        setValues({
                                            ...values,
                                            expansion_urgency: value?.value,
                                        });
                                    }}
                                />
                                {touched?.expansion_urgency && errors?.expansion_urgency && (
                                    <Text style={Styles.error2}>{String(errors?.expansion_urgency)}</Text>
                                )}
                            </View>
                        </View>
                    )}
                </> : null}
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

export default HouseholdRequirement

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