import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, useWindowDimensions, View } from 'react-native'
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
import { Styles, width } from '../../styles/globalStyles'
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown'
import Input from '../../Components/Inputs/Input'
import AcresElement from '../../Components/ui/AcresElement'
import CustomButton from '../../Components/CustomButton/CustomButton'
import PopupModal from '../../Components/Popups/PopupModal'
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown'
import { addWaterHarvesting, editWaterHarvesting, getWaterDropdown, getWaterHarvesting } from '../../functions/water'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'
import { editMobilityRequirement, getMobilityRequirement } from '../../functions/mobility'

const VehicleRequirement = ({ navigation, route }) => {
    const { name } = route.params
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const [enterInfo, setEnterInfo] = useState(true)
    const { t } = useTranslation()
    const { data: user } = useUser()
    const queryClient = useQueryClient()
    const { data: mobility, isLoading: isTypeLoading } = useQuery({
        queryKey: [`mobility`],
        queryFn: () => getMobilityDropdown(),
        refetchOnWindowFocus: true,
    })
    const { data: get_mobility_requirement, isLoading: isLoading } = useQuery({
        queryKey: [`get_mobility_requirement`],
        queryFn: () => getMobilityRequirement(),
        refetchOnWindowFocus: true,
    })
    const { mutate: edit_mobility_requirement } = useMutation({
        mutationKey: ['edit_mobility_requirement'],
        mutationFn: async (data) => {
            editMobilityRequirement(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('vehicleCount') },
        onError: (error) => console.log("error save", error),
    })
    const [selectedStatus, setSelectedStatus] = useState(0);
    const scheme = yup.object().shape({
        vehicles_needed: yup
            .array()
            .of(
                yup.object().shape({
                    vehicle_number: yup.string().required(t('Vehicle number is required')),
                    vehicle_type: yup.string().required(t('Vehicle Type is required')),
                    purpose: yup.string().required(t('Purpose is required')),
                    urgency: yup.string().required(t('Urgency is required')),
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
            vehicles_needed: [],
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
                vehicles_needed: get_mobility_requirement?.vehicles_needed.map(item => ({
                    vehicle_number: item.vehicle_number,
                    vehicle_type: item.vehicle_type,
                    purpose: item.purpose,
                    urgency: item.urgency,
                }))
            }
        })
        setSelectedStatus(String(get_mobility_requirement?.vehicles_needed.length) || 0)
    }, [get_mobility_requirement])
    const handleFieldChange = (index, field, value) => {
        const newDetailsOfLand = [...values.vehicles_needed];
        newDetailsOfLand[index][field] = value;
        setValues({ ...values, vehicles_needed: newDetailsOfLand });
    };

    const handleStatusChange = (selectedItems) => {
        console.log("selelele", selectedItems)
        setSelectedStatus(selectedItems);

        // Update `purpose_status_of_land` based on the selected items
        const updatedPurposeStatusOfLand = Array.from({ length: selectedItems }, (item, index) => {
            // Check if this `type` already exists in `purpose_status_of_land`
            const existingEntry = values.vehicles_needed.find(
                entry => entry.vehicle_number === index
            );

            return existingEntry || {
                vehicle_number: index +1,
                purpose: "",
                vehicle_type: "",
                urgency: "",
            };
        });
        // Update the form's purpose_status_of_land field
        setFieldValue('vehicles_needed', updatedPurposeStatusOfLand);
    };
    const [collapseStates, setCollapseStates] = useState([]);

    useEffect(() => {
        // Initialize collapseStates with false for all vehicles
        if (values?.vehicles_needed.length > 0) {
            setCollapseStates(Array(values.vehicles_needed.length).fill(true));
        }
    }, [values?.vehicles_needed]);

    const toggleCollapse = (index) => {
        setCollapseStates((prevStates) => {
            // Create a new array to avoid mutating the state directly
            const newStates = [...prevStates];
            newStates[index] = !newStates[index]; // Toggle the specific index
            return newStates;
        });
    };
    const handleDraft = () => {
        let newData = {
            vehicle_requirement: true,
            vehicles_needed: values?.vehicles_needed,
            // status: 0
        }
        edit_mobility_requirement(newData)
    }
    const onSubmit = () => {
        let newData = {
            vehicle_requirement: true,
            vehicles_needed: values?.vehicles_needed,
            // status: 1
        }
        edit_mobility_requirement(newData)
        // if (water_id) {
        //     // edit_usage({ ...newData, water_id })
        // } else {
        //     // add_usage({ ...newData })
        // }
    }
    if (isLoading || isTypeLoading) {
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
                {/* <MultiselectDropdown
                    containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                    data={[{
                        name: 'keyboard',
                        key: 'keyboard'
                    }, {
                        name: 'mouse',
                        key: 'mouse'
                    }]}
                    setSelectedd={handleStatusChange}
                    selectedd={selectedStatus}
                    infoName={t('How many vehicles do you need')}
                /> */}
                <Input
                    label={t(
                        `How many vehicles do you need`
                    )}
                    value={selectedStatus}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={(e)=> handleStatusChange(e)}
                />
                {values?.vehicles_needed?.length > 0 &&
                    <>
                        {values?.vehicles_needed.map((item, index) =>{
                            return <>
                                <View style={[styles.subArea, { marginTop: '3%' }]}>
                                    <Text
                                        style={[
                                            Styles.fieldLabel,
                                            { marginTop: 4, alignSelf: 'center' },
                                        ]}>
                                        {t(`Details of vehicle number ${index + 1}`)}
                                    </Text>
                                    <Divider
                                        bold={true}
                                        style={[styles.divider, { width: '34%' }]}
                                        horizontalInset={true}
                                    />
                                    <TouchableOpacity onPress={() => toggleCollapse(index)}>
                                        {collapseStates[index] ? (
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
                                {collapseStates[index] &&
                                <View style={styles.innerInputView}>
                                    <Divider style={styles.divider2} />
                                    <View style={{ width: '100%' }}>
                                        <CustomDropdown
                                            data={
                                                    [{ label: 'Yes', value: '6736117ecb51156c2f52383e' }, { label: 'No', value: '6736117ecb51156c2f52683e' }]
                                            }
                                            value={item?.vehicle_type}
                                            label={t('Type of Vehicle Required')}
                                            onChange={value => {
                                                handleFieldChange(
                                                    index,
                                                    'vehicle_type',
                                                    value?.value,
                                                )
                                            }}
                                        />
                                        {errors.vehicles_needed &&
                                            errors.vehicles_needed[index]
                                                ?.vehicle_type && (
                                                <Text style={Styles.error2}>
                                                    {
                                                        errors.vehicles_needed[index]
                                                            .vehicle_type
                                                    }
                                                </Text>
                                            )}
                                        <CustomDropdown
                                            data={
                                                    [{ label: 'Yes', value: '6736117ecb51156c2f52383e' }, { label: 'No', value: '6736117ecb51156c2f52683e' }]
                                            }
                                            value={item?.purpose}
                                            label={t('Purpose')}
                                            onChange={value => {
                                                handleFieldChange(
                                                    index,
                                                    'purpose',
                                                    value?.value,
                                                )
                                            }}
                                        />
                                        {errors.vehicles_needed &&
                                            errors.vehicles_needed[index]
                                                ?.purpose && (
                                                <Text style={Styles.error2}>
                                                    {
                                                        errors.vehicles_needed[index]
                                                            .purpose
                                                    }
                                                </Text>
                                            )}

                                        <CustomDropdown
                                            data={
                                                    [{ label: 'Yes', value: '6736117ecb51156c2f52383e' }, { label: 'No', value: '6736117ecb51156c2f52683e' }]
                                            }
                                            value={item?.urgency}
                                            label={t('Urgency')}
                                            onChange={value => {
                                                handleFieldChange(
                                                    index,
                                                    'urgency',
                                                    value?.value,
                                                )
                                            }}
                                        />
                                        {errors.vehicles_needed &&
                                            errors.vehicles_needed[index]
                                                ?.urgency && (
                                                <Text style={Styles.error2}>
                                                    {
                                                        errors.vehicles_needed[index]
                                                            .urgency
                                                    }
                                                </Text>
                                            )}
                                    </View>
                                </View>
                            }
                            </>
                        }
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

export default VehicleRequirement

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
})