import { Dimensions, Image, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
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
import { useUser } from '../../Hooks/useUser';

const LandholdingLandRequirement = ({ navigation }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const { t } = useTranslation()
    const { data: user } = useUser()
    const scheme = yup.object().shape({
        more_lands: yup.boolean().required(t('do you have requirement of more land is required')),
        required_area: yup.number().required('required area is required'),
        purpose_for_required_land: yup.string().required('purpose for required land for is required'),
        urgency_required_land: yup.string().required('urgency for required land is required'),
        area_allocated_to_village: yup.number().test(
            'area-allocated-village-required',
            t('area allocated to village is required'),
            function (value) {
                if (user?.type == "officer") {
                    return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
                }
                return true; // Otherwise, no validation on decreasing_yield
            },
        ),
        area_allocated_for_community: yup.number().test(
            'area-allocated-community-required',
            t('area allocated for community is required'),
            function (value) {
                if (user?.type == "officer") {
                    return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
                }
                return true; // Otherwise, no validation on decreasing_yield
            },
        ),
        land_owned_by_non_resident: yup.number().test(
            'land-owned-by-non-resident-required',
            t('land owned by non residents is required'),
            function (value) {
                if (user?.type == "officer") {
                    return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
                }
                return true; // Otherwise, no validation on decreasing_yield
            },
        ),
        freehold_village_land: yup.number().test(
            'freehold-village-required',
            t('freehold village land is required'),
            function (value) {
                if (user?.type == "officer") {
                    return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
                }
                return true; // Otherwise, no validation on decreasing_yield
            },
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
        setValues
    } = useFormik({
        initialValues: {
            marital_status: '',
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
        },
    });
    const handleDraft = () => {

    }
    const onSubmit = () => { }
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('landholding')}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
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
                            onPress={handleSubmit(onSubmit)}
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