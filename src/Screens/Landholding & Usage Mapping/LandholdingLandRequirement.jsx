import { Dimensions, Image, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { Styles } from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import { useTranslation } from 'react-i18next';
import { Divider, TextInput } from 'react-native-paper';
import { fontFamilyMedium } from '../../styles/fontStyle';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFormik } from 'formik';
import { borderColor } from '../../styles/colors';
import Input from '../../Components/Inputs/Input';
import { useUser } from '../../Hooks/useUser';
import AcresElement from '../../Components/ui/AcresElement';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const LandholdingLandRequirement = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const { data } = route.params
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const { t } = useTranslation()
    const { data: user } = useUser()
    const queryClient = useQueryClient()
    const { data: dropdownData, isLoading: dropdown_loading } = useQuery({
        queryKey: ['dropdown_data'],
        queryFn: () => { },
        refetchOnWindowFocus: true,
    })
    const { mutate: add_landholdingReq } = useMutation({
        mutationKey: ['add_landholdingReq'],
        mutationFn: async (data) => {
            // addDemographic(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('home') },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const { mutate: edit_landholdingReq } = useMutation({
        mutationKey: ['edit_landholdingReq'],
        mutationFn: async (data) => {
            // editDemographic(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss edit", data), navigation.replace('home') },
        onError: (error) => console.log("error edit", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const scheme = yup.object().shape({
        required_area: yup.number().required(t('required area is required')),
        purpose_for_required_land: yup.string().required(t('purpose for required land for is required')),
        urgency_required_land: yup.string().required(t('urgency for required land is required')),
        // area_allocated_to_village: yup.number().test(
        //     'area-allocated-village-required',
        //     t('area allocated to village is required'),
        //     function (value) {
        //         if (user?.type == "officer") {
        //             return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        //         }
        //         return true; // Otherwise, no validation on decreasing_yield
        //     },
        // ),
        // area_allocated_for_community: yup.number().test(
        //     'area-allocated-community-required',
        //     t('area allocated for community is required'),
        //     function (value) {
        //         if (user?.type == "officer") {
        //             return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        //         }
        //         return true; // Otherwise, no validation on decreasing_yield
        //     },
        // ),
        // land_owned_by_non_resident: yup.number().test(
        //     'land-owned-by-non-resident-required',
        //     t('land owned by non residents is required'),
        //     function (value) {
        //         if (user?.type == "officer") {
        //             return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        //         }
        //         return true; // Otherwise, no validation on decreasing_yield
        //     },
        // ),
        // freehold_village_land: yup.number().test(
        //     'freehold-village-required',
        //     t('freehold village land is required'),
        //     function (value) {
        //         if (user?.type == "officer") {
        //             return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        //         }
        //         return true; // Otherwise, no validation on decreasing_yield
        //     },
        // ),
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
            required_area: '',
            purpose_for_required_land: '',
            urgency_required_land: '',
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
                required_area: '',
                purpose_for_required_land: '',
                urgency_required_land: '',
            }
        })
    }, [data])
    const handleDraft = () => {
        if (data) {

        } else {

        }
    }
    const onSubmit = () => {
        if (data) {

        } else {

        }
    }
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={`${t('landholding')}`}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <Input
                    label={t(
                        `Kindly mention the required area`,
                    )}
                    value={values.required_area}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={handleChange('required_area')}
                    isRight={
                        <AcresElement title={user?.land_measurement_symbol} />
                    }
                />
                {errors.required_area &&
                    errors.required_area && (
                        <Text style={Styles.error2}>
                            {
                                errors.required_area
                            }
                        </Text>
                    )}
                <CustomDropdown
                    data={[
                        { id: 1, label: 'Yes', value: true },
                        { id: 2, label: 'No', value: false },
                    ]}
                    value={values.purpose_for_required_land}
                    label={t('Kindly mention the purpose for which the land is required?')}
                    onChange={value => {
                        setValues({
                            ...values,
                            purpose_for_required_land: value?.value,
                        });
                    }}
                />
                {touched?.purpose_for_required_land && errors?.purpose_for_required_land && (
                    <Text style={Styles.error2}>{String(errors?.purpose_for_required_land)}</Text>
                )}
                <CustomDropdown
                    data={[
                        { id: 1, label: 'Yes', value: true },
                        { id: 2, label: 'No', value: false },
                    ]}
                    value={values.urgency_required_land}
                    label={t('Kindly mention the urgency for the required land ?')}
                    onChange={value => {
                        setValues({
                            ...values,
                            urgency_required_land: value?.value,
                        });
                    }}
                />
                {touched?.urgency_required_land && errors?.urgency_required_land && (
                    <Text style={Styles.error2}>{String(errors?.urgency_required_land)}</Text>
                )}
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

export default LandholdingLandRequirement
const { width } = Dimensions.get('window')
const makeStyles = fontScale => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 12,
    },
    mainContainer: {
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    textInputContainer: {
        marginTop: 16,
        width: width / 1.12,
        alignSelf: 'center',
    },
    textInput: {
        backgroundColor: '#fff',
        fontFamily: fontFamilyMedium,
        fontSize: 16 / fontScale,
        textAlign: 'auto',
    },
    item_header_txt: {
        fontSize: 14 / fontScale,
        fontFamily: fontFamilyMedium,
        textAlign: 'left',
        color: '#000',
        marginTop: 10,
        padding: 10,
    },
    item_container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginVertical: 4,
    },
    option_text: {
        alignSelf: 'center',
        paddingHorizontal: 10,
        color: '#000',
        fontSize: 14 / fontScale,
        fontFamily: fontFamilyMedium,
    },
})