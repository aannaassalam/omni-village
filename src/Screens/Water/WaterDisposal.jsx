import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator } from 'react-native-paper'
import { borderColor, primaryColor } from '../../styles/colors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from '../../Hooks/useUser'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Styles } from '../../styles/globalStyles'
import CustomButton from '../../Components/CustomButton/CustomButton'
import PopupModal from '../../Components/Popups/PopupModal'
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown'
import SwitchButton from '../../Components/SwitchButtons/SwitchButton'
import { addWaterDisposal, editWaterDisposal, getWaterDisposal, getWaterDropdown } from '../../functions/water'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'
import Input from '../../Components/Inputs/Input'

const WaterDisposal = ({ navigation, route }) => {
    const { name, water_id, type } = route.params
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const [bool, setBool] = useState(false)
    const { t } = useTranslation()
    const { data: user } = useUser()
    const queryClient = useQueryClient()
    const { data: water_dropdown, isLoading } = useQuery({
        queryKey: ['water_dropdown'],
        queryFn: () => getWaterDropdown(),
        refetchOnWindowFocus: true,
    })
    const { data: get_usage, isLoading: isUsageLoading } = useQuery({
        queryKey: ['get_water_disposal'],
        enabled: water_id ? true : false,
        queryFn: () => getWaterDisposal(water_id),
        refetchOnWindowFocus: true,
    })
    const { mutate: edit_usage } = useMutation({
        mutationKey: ['edit_usage'],
        mutationFn: async (data) => {
            editWaterDisposal(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('water') },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const { mutate: add_usage } = useMutation({
        mutationKey: ['add_usage'],
        mutationFn: async (data) => {
            addWaterDisposal(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('water') },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const scheme = yup.object().shape({
        wastewater_disposal_methods: yup.array().required(t('waste water disposal methods is required')).min(1, t('waste water disposal methods is required')),
        water_recycling_methods: yup.array().required(t('water recycling methods is required')).min(1, t('water recycling methods is required')),
        other_recycling: yup.string().required(t('other recycling is required')),
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
            wastewater_disposal_methods: [],
            water_recycling_methods: [],
            other_recycling: '',
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            setSavepopup(true)
        },
    });
    useEffect(() => {
        resetForm({
            values: {
                wastewater_disposal_methods: get_usage?.wastewater_disposal_methods || [],
                water_recycling_methods: get_usage?.water_recycling_methods || [],
                other_recycling: get_usage?.other_recycling
            }
        })
        setBool(get_usage?.water_recycling_methods.length > 0 ? true : false)
    }, [get_usage])
    const handleDraft = () => {
        let newData = {
            wastewater_disposal_methods: values.wastewater_disposal_methods,
            water_recycling_methods: values.water_recycling_methods,
            water_recycle: bool,
            other_recycling: values.other_recycling,
            type,
            status: 0
        }
        if (water_id) {
            edit_usage({ ...newData, water_id })
        } else {
            add_usage({ ...newData })
        }
    }
    const onSubmit = () => {
        let newData = {
            wastewater_disposal_methods: values.wastewater_disposal_methods,
            water_recycling_methods: values.water_recycling_methods,
            water_recycle: bool,
            other_recycling: values.other_recycling,
            type,
            status: 1
        }
        if (water_id) {
            edit_usage({ ...newData, water_id })
        } else {
            add_usage({ ...newData })
        }
    }
    if (isLoading || isUsageLoading) {
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
                headerName={t(`${name}`)}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <MultiselectDropdown
                    containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                    data={
                        water_dropdown?.wastewater.map((item) => {
                            return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                        })
                    }
                    setSelectedd={(value) => {
                        console.log("valueeeeee", value)
                        setValues({ ...values, wastewater_disposal_methods: value })
                    }}
                    selectedd={values?.wastewater_disposal_methods}
                    infoName={t('What type of Wastewater disposal method do you use?')}
                />
                {touched?.wastewater_disposal_methods && errors?.wastewater_disposal_methods && (
                    <Text style={Styles.error2}>{String(errors?.wastewater_disposal_methods)}</Text>
                )}

                <SwitchButton
                    nolabel={false}
                    label={t('Do you recycle waste water?')}
                    selected={bool}
                    firstBtnPress={() => setBool(true)}
                    secondBtnPress={() => setBool(false)}
                    firstBtnText={t('yes')}
                    secondBtntext={t('no')}
                />
                {bool &&
                    <>
                        <MultiselectDropdown
                            containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                            data={
                                water_dropdown?.water_recycling.map((item) => {
                                    return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                                })
                            }
                            setSelectedd={(value) => {
                                setValues({ ...values, water_recycling_methods: value })
                            }}
                            selectedd={values?.water_recycling_methods}
                            infoName={t('Water recycling methods ?')}
                        />
                        {touched?.water_recycling_methods && errors?.water_recycling_methods && (
                            <Text style={Styles.error2}>{String(errors?.water_recycling_methods)}</Text>
                        )}
                        {water_dropdown?.water_recycling.find((item) => values.water_recycling_methods.includes(item?._id))?.name === "Others(if any)" && (
                            <Input
                                label={t('Others(If any)')}
                                value={values.other_recycling}
                                placeholder={''}
                                fullLength={true}
                                keyboardType='default'
                                onChangeText={handleChange('other_recycling')}
                            />
                        )}
                    </>
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

export default WaterDisposal

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})