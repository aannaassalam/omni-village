import { Image, StyleSheet, Text, ToastAndroid, useWindowDimensions, View } from 'react-native'
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
import { addWaterHarvesting, editWaterHarvesting, getWaterDropdown, getWaterHarvesting } from '../../functions/water'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'

const OtherEnergy = ({ navigation, route }) => {
    const { name, water_id, type } = route.params
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const { t } = useTranslation()
    const { data: user } = useUser()
    const queryClient = useQueryClient()
    // const { data: water_dropdown, isLoading } = useQuery({
    //     queryKey: ['energy_dropdown'],
    //     queryFn: () => {},
    //     refetchOnWindowFocus: true,
    // })
    const get_usage ={}
    // const { data: get_usage, isLoading: isUsageLoading } = useQuery({
    //     queryKey: ['get_harvesting'],
    //     enabled: water_id ? true : false,
    //     queryFn: () => getWaterHarvesting(water_id),
    //     refetchOnWindowFocus: true,
    // })
    // const { mutate: edit_usage } = useMutation({
    //     mutationKey: ['edit_usage'],
    //     mutationFn: async (data) => {
    //         editWaterHarvesting(data)
    //         queryClient.invalidateQueries()
    //     },
    //     onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('water') },
    //     onError: (error) => console.log("error save", error),
    //     onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    // })
    // const { mutate: add_usage } = useMutation({
    //     mutationKey: ['add_usage'],
    //     mutationFn: async (data) => {
    //         addWaterHarvesting(data)
    //         queryClient.invalidateQueries()
    //     },
    //     onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('water') },
    //     onError: (error) => console.log("error save", error),
    //     onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    // })
    const [selectedStatus, setSelectedStatus] = useState([]);
    const scheme = yup.object().shape({
        source_of_fuels_used: yup
            .array()
            .of(
                yup.object().shape({
                    type: yup.string().required(t('Type is required')),
                    purpose: yup.string().required(t('Purpose is required')),
                    expenditures: yup.string().required(t('Expenditure is required')),
                    quantity: yup
                        .string()
                        .required(t('quantity is required')),
                }),
            )
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
        setFieldValue
    } = useFormik({
        initialValues: {
            source_of_fuels_used: [],
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            if (selectedStatus.length > 0) {
                setSavepopup(true);
            } else {
                ToastAndroid.show("Please select one value", ToastAndroid.BOTTOM)
            }
        },
    });
    useEffect(() => {
        resetForm({
            values: {
                // source_of_fuels_used: get_usage?.source_of_fuels_used.map((item) => {
                //     return {
                //         type: item.type,
                //         purpose: item.purpose,
                //         expenditures: String(item.expenditures),
                //         quantity: String(item.quantity)
                //     }
                // }) || []
                source_of_fuels_used: []
            }
        })
        // setSelectedStatus(get_usage?.type_of_harvesting.map(item => item.type) || [])
    }, [])
    const handleFieldChange = (index, field, value) => {
        const newDetailsOfLand = [...values.source_of_fuels_used];
        newDetailsOfLand[index][field] = value;
        setValues({ ...values, source_of_fuels_used: newDetailsOfLand });
    };

    const handleStatusChange = (selectedItems) => {
        setSelectedStatus(selectedItems);

        // Update `purpose_status_of_land` based on the selected items
        const updatedPurposeStatusOfLand = selectedItems.map((item) => {
            // Check if this `type` already exists in `purpose_status_of_land`
            const existingEntry = values.source_of_fuels_used.find(
                entry => entry.type === item
            );

            return existingEntry || {
                type: item,
                purpose: "",
                expenditures: "",
                capacity: ''
            };
        });
        // Update the form's purpose_status_of_land field
        setFieldValue('source_of_fuels_used', updatedPurposeStatusOfLand);
    };
    const handleDraft = () => {
        let newData = {
            source_of_fuels_used: values?.source_of_fuels_used,
            type: type,
            status: 0
        }
        if (water_id) {
            // edit_usage({ ...newData, water_id })
        } else {
            // add_usage({ ...newData })
        }
    }
    const onSubmit = () => {
        let newData = {
            source_of_fuels_used: values?.source_of_fuels_used,
            type: type,
            status: 1
        }
        if (water_id) {
            // edit_usage({ ...newData, water_id })
        } else {
            // add_usage({ ...newData })
        }
    }
    // if (isLoading || isUsageLoading) {
    //     return (
    //         <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
    //             <ActivityIndicator size={'large'} color={primaryColor} />
    //         </View>
    //     );
    // }
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
                    data={[{
                        name:'keyboard',
                        key: 'keyboard'
                    }, {
                            name: 'mouse',
                            key: 'mouse'
                        }]}
                    setSelectedd={handleStatusChange}
                    selectedd={selectedStatus}
                    infoName={t('Other sources of fuels used')}
                />
                {values?.source_of_fuels_used.length > 0 && (
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            {values.source_of_fuels_used.map((item, index) => (
                                <>
                                    <MultiselectDropdown
                                        containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                        data={[
                                            { name: 'Title', key: 'Title' }
                                        ]}
                                        setSelectedd={(value) => {
                                            handleFieldChange(
                                                index,
                                                'purpose',
                                                value,
                                            )
                                        }}
                                        selectedd={item.purpose}
                                        infoName={t('What is the purpose?')}
                                    />
                                    {errors.source_of_fuels_used &&
                                        errors.source_of_fuels_used[index]
                                            ?.purpose && (
                                            <Text style={Styles.error2}>
                                                {
                                                    errors.source_of_fuels_used[index]
                                                        .purpose
                                                }
                                            </Text>
                                        )}
                                    <Input
                                        label={t(
                                            `${t(
                                                'Enter Qunatity for')}`
                                        )}
                                        value={item.capacity}
                                        placeholder={'0'}
                                        fullLength={true}
                                        keyboardType="numeric"
                                        onChangeText={text =>
                                            handleFieldChange(
                                                index,
                                                'quantity',
                                                parseInt(text),
                                            )
                                        }
                                        isRight={
                                            <AcresElement title={'Unit'} />
                                        }
                                    />
                                    {errors.source_of_fuels_used &&
                                        errors.source_of_fuels_used[index]
                                            ?.quantity && (
                                            <Text style={Styles.error2}>
                                                {
                                                    errors.source_of_fuels_used[index]
                                                        .quantity
                                                }
                                            </Text>
                                        )}
                                    <Input
                                        label={t(
                                            `${t(
                                                'Total Expenditure',
                                            )}`
                                        )}
                                        value={item.expenditure}
                                        placeholder={'0'}
                                        fullLength={true}
                                        keyboardType="numeric"
                                        onChangeText={text =>
                                            handleFieldChange(
                                                index,
                                                'expenditure',
                                                parseInt(text),
                                            )
                                        }
                                        isRight={
                                            <AcresElement title={user.currency} />
                                        }
                                    />
                                    {errors.source_of_fuels_used &&
                                        errors.source_of_fuels_used[index]
                                        ?.expenditure && (
                                            <Text style={Styles.error2}>
                                                {
                                                errors.source_of_fuels_used[index]
                                                    .expenditure
                                                }
                                            </Text>
                                        )}
                                    
                                </>
                            ))}
                        </View>
                    </View>
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

export default OtherEnergy

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