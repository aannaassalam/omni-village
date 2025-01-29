import { Image, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Divider } from 'react-native-paper'
import { borderColor, primaryColor } from '../../styles/colors'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useUser } from '../../Hooks/useUser'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Styles } from '../../styles/globalStyles'
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown'
import Input from '../../Components/Inputs/Input'
import AcresElement from '../../Components/ui/AcresElement'
import CustomButton from '../../Components/CustomButton/CustomButton'
import PopupModal from '../../Components/Popups/PopupModal'
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown'
import SwitchButton from '../../Components/SwitchButtons/SwitchButton'
import { addWaterGeneralInfo, editWaterGeneralInfo, getWaterDropdown, getWaterGeneralInfo } from '../../functions/water'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'

const GeneralInformation = ({ navigation, route }) => {
    const { name, water_id, type } = route.params
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const { t } = useTranslation()
    const { data: user } = useUser()
    const queryClient = useQueryClient()
    const { data: water_dropdown, isLoading } = useQuery({
        queryKey: ['water_dropdown'],
        queryFn: () => getWaterDropdown(),
        refetchOnWindowFocus: true,
    })
    const { data: get_usage, isLoading: isUsageLoading } = useQuery({
        queryKey: ['get_generalInfo'],
        enabled: water_id ? true : false,
        queryFn: () => getWaterGeneralInfo(water_id),
        refetchOnWindowFocus: true,
    })
    const { mutate: edit_usage } = useMutation({
        mutationKey: ['edit_generalInfo'],
        mutationFn: async (data) => {
            editWaterGeneralInfo(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('water') },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const { mutate: add_usage } = useMutation({
        mutationKey: ['add_usage'],
        mutationFn: async (data) => {
            addWaterGeneralInfo(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('water') },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const scheme = yup.object().shape({
        water_meter: yup.boolean(),
        water_scarcity: yup.boolean(),
        water_scarcity_severity: yup.string().nullable().test('is-required-if-water_scarcity-true', t('Severity is required'), function (value) {
            const { water_scarcity } = this.parent;
            return water_scarcity ? value && value.trim() !== null : true;
        }),
        month: yup.array()
            .test('is-required-if-water_scarcity-true', t('Month is required'), function (value) {
                const { water_scarcity } = this.parent;
                return water_scarcity ? value && value.length > 0 : true;;
            })
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
            water_meter: false,
            water_scarcity: false,
            water_scarcity_severity: '',
            month: []
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            setSavepopup(true)
        },
    });
    console.log("errororor", errors)
    useEffect(() => {
        resetForm({
            values: {
                water_meter: get_usage?.water_meter || false,
                water_scarcity: get_usage?.water_scarcity || false,
                water_scarcity_severity: get_usage?.water_scarcity_severity || '',
                month: get_usage?.months_of_year_of_scarcity || []
            }
        })
    }, [get_usage])
    const handleDraft = () => {
        let newData = {
            type,
            status: 0,
            water_meter: values.water_meter,
            water_scarcity: values.water_scarcity,
            water_scarcity_severity: values.water_scarcity_severity,
            months_of_year_of_scarcity: values.month,
        }
        if (water_id) {
            edit_usage({ ...newData, water_id })
        } else {
            add_usage({ ...newData })
        }

    }
    const onSubmit = () => {
        let newData = {
            status: 1,
            type,
            water_meter: values.water_meter,
            water_scarcity: values.water_scarcity,
            water_scarcity_severity: values.water_scarcity_severity,
            months_of_year_of_scarcity: values.month,
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
                <SwitchButton
                    nolabel={false}
                    label={t('Do you have water meter?')}
                    selected={values?.water_meter}
                    firstBtnPress={() => setValues({ ...values, water_meter: true })}
                    secondBtnPress={() => setValues({ ...values, water_meter: false })}
                    firstBtnText={t('yes')}
                    secondBtntext={t('no')}
                />
                <SwitchButton
                    nolabel={false}
                    label={t('Do you face water scarcity?')}
                    selected={values?.water_scarcity}
                    firstBtnPress={() => setValues({ ...values, water_scarcity: true })}
                    secondBtnPress={() => setValues({ ...values, water_scarcity: false, water_scarcity_severity: null, month: [] })}
                    firstBtnText={t('yes')}
                    secondBtntext={t('no')}
                />
                {values?.water_scarcity &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <CustomDropdown
                                data={
                                    water_dropdown?.severity.map((item) => {
                                        return { label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id }
                                    })
                                }
                                value={values?.water_scarcity_severity}
                                label={t('How severe it is')}
                                onChange={value => {
                                    setValues({
                                        ...values,
                                        water_scarcity_severity: value?.value,
                                    });
                                }}
                            />
                            {touched?.water_scarcity_severity && errors?.water_scarcity_severity && (
                                <Text style={Styles.error2}>{String(errors?.water_scarcity_severity)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={
                                    [{
                                        name: 'January',
                                        key: 'January',
                                    },
                                        {
                                            name: 'February',
                                            key: 'February',
                                        },
                                        {
                                            name: 'March',
                                            key: 'March',
                                        },
                                        {
                                            name: 'April',
                                            key: 'April',
                                        },
                                        {
                                            name: 'May',
                                            key: 'May',
                                        },
                                        {
                                            name: 'June',
                                            key: 'June',
                                        },
                                        {
                                            name: 'July',
                                            key: 'July',
                                        },
                                        {
                                            name: 'August',
                                            key: 'August',
                                        },
                                        {
                                            name: 'September',
                                            key: 'September',
                                        },
                                        {
                                            name: 'October',
                                            key: 'October',
                                        }, {
                                            name: 'November',
                                            key: 'November',
                                        }, {
                                            name: 'December',
                                            key: 'December',
                                        }
                                    ]
                                }
                                setSelectedd={(value) => {
                                    setValues({ ...values, month: value })
                                }}
                                selectedd={values?.month}
                                infoName={t('Which month of the year you face this problem?')}
                            />
                            {touched?.month && errors?.month && (
                                <Text style={Styles.error2}>{String(errors?.month)}</Text>
                            )}
                        </View>
                    </View>
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

export default GeneralInformation

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    innerInputView: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginBottom: '5%',
        gap: 12,
        paddingHorizontal: 12,
    },
    divider2: {
        alignSelf: 'flex-start',
        height: '100%',
        marginTop: 9,
        width: '1%',
        borderRadius: 10,
    },
})