import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native-paper';
import Entypo from 'react-native-vector-icons/Entypo'
import { borderColor, primaryColor } from '../../../styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../Components/CustomHeader/CustomHeader';
import { fontScale, Styles } from '../../../styles/globalStyles';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import PopupModal from '../../../Components/Popups/PopupModal';
import DocumentPicker, { types } from 'react-native-document-picker';
import Input from '../../../Components/Inputs/Input';
import AcresElement from '../../../Components/ui/AcresElement';
import { fontFamilyMedium } from '../../../styles/fontStyle';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addModeratorDemographic, editModeratorDemographic, getModeratorDemographic } from '../../../functions/moderator';

const OfficerDemographic = ({ navigation, route }) => {
    const { t } = useTranslation()
    const { village_id } = route.params
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const [images, setImages] = useState([])
    const queryClient = useQueryClient()
    const { data: get_moderator_demographic, isLoading: isTypeLoading } = useQuery({
        queryKey: [`get_moderator_demographic`],
        queryFn: () => getModeratorDemographic(village_id),
        enabled: village_id ? true : false,
        refetchOnWindowFocus: true,
    })

    const { mutate: edit_moderator_demographic } = useMutation({
        mutationKey: ['edit_moderator_demographic'],
        mutationFn: async (data) => {
            editModeratorDemographic(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss edit", data, navigation.replace('officerHome', { village_id: village_id })) },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const { mutate: add_moderator_demographic } = useMutation({
        mutationKey: ['add_moderator_demographic'],
        mutationFn: async (data) => {
            addModeratorDemographic(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('officerHome', { village_id: village_id }) },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const scheme = yup.object().shape({
        average_population_growth_rate: yup.string().required(t('Average population growth rate is required')),
        common_land_measurement_unit: yup.string().required(t('Common land measurement unit is required')),
        how_much: yup.string().required(t('How much is required')),
        local_language: yup.string().required(t('Local language is required')),
        common_traditional_house: yup.string().required(t('Common traditional house is required')),
        upload_house_picture: yup.array().of(
            yup.object().shape({
                name: yup.string().required(t('File is required')),
                uri: yup.string().required(t('File is required')),
                type: yup.string().required(t('File is required')),
            })
        ).required(t('House picture is required'))

    });
    const {
        handleChange,
        handleSubmit,
        values,
        errors,
        setFieldTouched,
        setFieldValue,
        touched,
        resetForm,
        setValues
    } = useFormik({
        initialValues: {
            average_population_growth_rate: '',
            common_land_measurement_unit: '',
            how_much: '',
            local_language: '',
            common_traditional_house: '',
            upload_house_picture: []
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            setSavepopup(true)
        },

    });
    const onSubmit = () => {
        const formData = new FormData()
        formData.append('average_population_growth_rate', values.average_population_growth_rate)
        formData.append('common_land_measurement_unit', values.common_land_measurement_unit)
        formData.append('how_much', values.how_much)
        formData.append('local_language', values.local_language)
        formData.append('common_traditional_house', values.common_traditional_house)
        values.upload_house_picture.forEach((item, index) => {
            formData.append('upload_house_picture', {
                name: item.name,
                uri: item.uri,
                type: item.type
            })
        })

        if (get_moderator_demographic?.id) {
            formData.append('demographic_id', get_moderator_demographic?.id)
            edit_moderator_demographic(formData)
        } else {
            formData.append('village_id', village_id)
            add_moderator_demographic(formData)
        }
    }
    const handleDraft = () => { }
    const handleDocumentSelection = useCallback(async (index) => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                type: [types.images],
                allowMultiSelection: true,
            });
            if (response) {
                setFieldValue('upload_house_picture', [
                    ...values.upload_house_picture,
                    ...response.map((item) => {
                        return {
                            name: item.name,
                            uri: item.uri,
                            type: item.type
                        }
                    })
                ]);
            }
        } catch (err) {
            console.warn(err);
        }
    }, []);

    const handleRemoveImage = (index) => {
        setFieldValue('upload_house_picture', values.upload_house_picture.filter((item, i) => i
            !== index));
    }
    useEffect(() => {
        resetForm({
            values: {
                average_population_growth_rate: String(get_moderator_demographic?.average_population_growth_rate || '') || '',
                common_land_measurement_unit: get_moderator_demographic?.common_land_measurement_unit || '',
                how_much: String(get_moderator_demographic?.how_much || '') || '',
                local_language: get_moderator_demographic?.local_language || '',
                common_traditional_house: get_moderator_demographic?.common_traditional_house || '',
                upload_house_picture: []
            }
        })
        setImages(get_moderator_demographic?.upload_house_picture.map((item, index) => {
            return `https://omnivillage-server-360ba1f0adb3.herokuapp.com/${item}`
        }))
    }, [get_moderator_demographic])
    if (isTypeLoading) {
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
                headerName={t(`demographic`)}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <Input
                    label={t(
                        `Average population growth rate`
                    )}
                    value={values?.average_population_growth_rate}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={handleChange('average_population_growth_rate')}
                    isRight={<AcresElement title={'%'} />}
                />
                {errors.average_population_growth_rate &&
                    touched.average_population_growth_rate && (
                        <Text style={Styles.error2}>
                            {
                                errors.average_population_growth_rate
                            }
                        </Text>
                    )}
                <Input
                    label={t(
                        `Common land measurement unit`
                    )}
                    value={values?.common_land_measurement_unit}
                    placeholder={''}
                    fullLength={true}
                    keyboardType="default"
                    onChangeText={handleChange('common_land_measurement_unit')}
                />
                {errors.common_land_measurement_unit &&
                    touched.common_land_measurement_unit && (
                        <Text style={Styles.error2}>
                            {
                                errors.common_land_measurement_unit
                            }
                        </Text>
                    )}
                <Input
                    label={t(
                        `${t('How much')} ${values?.common_land_measurement_unit} ${t('is equal to 1 acre')} `
                    )}
                    value={values?.how_much}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={handleChange('how_much')}
                />
                {errors.how_much &&
                    touched.how_much && (
                        <Text style={Styles.error2}>
                            {
                                errors.how_much
                            }
                        </Text>
                    )}
                <Input
                    label={t(
                        `What is the local language?`
                    )}
                    value={values?.local_language}
                    placeholder={''}
                    fullLength={true}
                    keyboardType="default"
                    onChangeText={handleChange('local_language')}
                />
                {errors.local_language &&
                    touched.local_language && (
                        <Text style={Styles.error2}>
                            {
                                errors.local_language
                            }
                        </Text>
                    )}
                <Input
                    label={t(
                        `Common traditional house type`
                    )}
                    value={values?.common_traditional_house}
                    placeholder={''}
                    fullLength={true}
                    keyboardType="default"
                    onChangeText={handleChange('common_traditional_house')}
                />
                {errors.common_traditional_house &&
                    touched.common_traditional_house && (
                        <Text style={Styles.error2}>
                            {
                                errors.common_traditional_house
                            }
                        </Text>
                    )}
                <Text style={Styles.fieldLabel}>{t('Upload house picture')}</Text>
                {values?.upload_house_picture?.length > 0 ?
                    <>
                        {values?.upload_house_picture?.map((item, index) => {
                            return <>
                                <TouchableOpacity
                                    style={[styles.add_button, {
                                        justifyContent: item?.uri ? 'space-between' : 'flex-start'
                                    }]}
                                    onPress={() => {
                                        handleDocumentSelection()
                                    }}>

                                    <Text style={styles.add_button_text}>{item.name}</Text>
                                    <Entypo name="circle-with-cross" size={26} color={'red'} onPress={() => handleRemoveImage(index)} />
                                </TouchableOpacity>
                                {errors?.upload_house_picture && errors?.upload_house_picture[index]?.name ?
                                    <Text style={[Styles.error, { marginLeft: 0, marginBottom: 0 }]}>{errors?.upload_house_picture[index]?.name}</Text>
                                    : null
                                }
                            </>
                        })}

                    </> :
                    <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'space-between'}}>
                        {images?.length > 0 ?
                            images?.map((item, index) => {
                                return <Image source={{ uri: '' }} 
                                    style={{ width: 100, height: 100 }} />
                                
                            })
                            :
                            null
                        }
                    </View>
                }
                {/* {errors?.upload_house_picture && errors?.upload_house_picture[0]?.name ?
                    <Text style={[Styles.error, { marginLeft: 0, marginBottom: 0 }]}>{errors?.upload_house_picture[0]?.name}</Text>
                    :
                    null
                } */}
                <TouchableOpacity
                    style={[styles.add_button, {
                        justifyContent: 'flex-start'
                    }]}
                    onPress={() => {
                        if(images?.length>0){
                            setImages([])
                            handleDocumentSelection()
                        }else{
                            handleDocumentSelection()
                        }
                    }}>

                    <>
                        <Entypo name="upload-to-cloud" size={26} color={'black'} />
                        <Text style={styles.add_button_text}>{images?.length>0?t('Re-upload House photo'):t('Add House photo')}</Text>
                    </>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
            <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <CustomButton btnText={t('submit')} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
                {/* <CustomButton btnText={t('save as draft')} style={{ width: '48%', height: 60, backgroundColor: borderColor }} onPress={() => { setDraftpopup(true) }} btnStyle={{ color: 'black' }} /> */}
            </View>
            {/* submit popup */}
            <PopupModal
                modalVisible={savePopup}
                setBottomModalVisible={setSavepopup}
                styleInner={[Styles.savePopup, { width: '90%' }]}>
                <View style={Styles.submitPopup}>
                    <View style={Styles.noteImage}>
                        <Image
                            source={require('../../../../assets/note.png')}
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
                            source={require('../../../../assets/note.png')}
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

export default OfficerDemographic

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    upload_image: {
        height: 46,
        width: 46,
        resizeMode: 'contain',
        marginHorizontal: 12,
        backgroundColor: 'red'
    },
    add_button: {
        borderColor: primaryColor,
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        justifyContent: 'flex-start',
        flexDirection: 'row',
        gap: 48,
        marginTop: 16,
        width: '100%',
        paddingHorizontal: 22
    },
    add_button_text: {
        color: '#000',
        fontSize: 16 / fontScale,
        fontFamily: fontFamilyMedium,
        alignSelf: 'center'
    }
})