import { Dimensions, Image, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { Styles } from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import { useTranslation } from 'react-i18next';
import { fontFamilyMedium } from '../../styles/fontStyle';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useFormik } from 'formik';
import { borderColor, primaryColor } from '../../styles/colors';
import Input from '../../Components/Inputs/Input';
import { useUser } from '../../Hooks/useUser';
import AcresElement from '../../Components/ui/AcresElement';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { editLandholding, editLandholdingSpecification, getLandholdingDropdown, getLandholdingSpecification } from '../../functions/landholding';
import { USER_PREFERRED_LANGUAGE } from '../../i18next';
import { ActivityIndicator } from 'react-native-paper';

const LandholdingLandRequirement = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const { t } = useTranslation()
    const { data: user } = useUser()
    const queryClient = useQueryClient()
    const { data: landholding_dropdown, isLoading } = useQuery({
        queryKey: ['landholding_dropdown'],
        queryFn: () => getLandholdingDropdown(),
        refetchOnWindowFocus: true,
    })
    const { data: landholding_requirement, isLoading: isLandholdingLoading } = useQuery({
        queryKey: ['landholding_requirement'],
        queryFn: () => getLandholdingSpecification(),
        refetchOnWindowFocus: true,
    })
    const { mutate: edit_landholding_specification } = useMutation({
        mutationKey: ['edit_landholding_specification'],
        mutationFn: async (data) => {
            editLandholdingSpecification(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('home') },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const scheme = yup.object().shape({
        required_area: yup.number().required(t('required area is required')),
        purpose_for_required_land: yup.string().required(t('purpose for required land for is required')),
        urgency_required_land: yup.string().required(t('urgency for required land is required')),
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
                required_area: landholding_requirement?.required_area === null ? '' : String(landholding_requirement?.required_area) || '',
                purpose_for_required_land: landholding_requirement?.purpose_for_required_land || '',
                urgency_required_land: landholding_requirement?.urgency_required_land || '',
            }
        })
    }, [landholding_requirement])
    console.log("landholdingggg", landholding_requirement)
    const handleDraft = () => {
let newData = {
    required_area: parseInt(values.required_area),
    purpose_for_required_land: values.purpose_for_required_land,
    urgency_required_land: values.urgency_required_land,
}
edit_landholding_specification({...newData, status: 0})
    
    }
    const onSubmit = () => {
            let newData = {
                required_area: parseInt(values.required_area),
                purpose_for_required_land: values.purpose_for_required_land,
                urgency_required_land: values.urgency_required_land,
            }
            edit_landholding_specification({ ...newData, status: 1 })
    }
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
                    data={landholding_dropdown?.purpose_requirement.map((item) => { return { label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id } })}
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
                    data={landholding_dropdown?.urgency_requirement.map((item) => { return { label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id } })}
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