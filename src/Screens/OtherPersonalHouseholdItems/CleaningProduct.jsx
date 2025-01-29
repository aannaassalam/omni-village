import { Image, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useUser } from '../../Hooks/useUser'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import SwitchButton from '../../Components/SwitchButtons/SwitchButton'
import { Styles } from '../../styles/globalStyles'
import AcresElement from '../../Components/ui/AcresElement'
import Input from '../../Components/Inputs/Input'
import { ActivityIndicator, Divider } from 'react-native-paper'
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown'
import CustomButton from '../../Components/CustomButton/CustomButton'
import { borderColor, primaryColor } from '../../styles/colors'
import PopupModal from '../../Components/Popups/PopupModal'
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown'
import PurposeInput from '../../Components/PurposeInput/PurposeInput'
import { addPetrolDieselNatural, editPetrolDieselNatural, getEnergyByType, getEnergyDropdown } from '../../functions/energyFuel'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'
import { addOtherPersonal, editOtherPersonal, getOtherPersonal, getOtherPersonalDropdown } from '../../functions/otherPersonalHousehold'
import { fontFamilyRegular } from '../../styles/fontStyle'

const CleaningProduct = ({ navigation, route }) => {
    const { name, type } = route.params
    const { t } = useTranslation()
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const { data: user } = useUser()
    const queryClient = useQueryClient()
    const [selectedStatus, setSelectedStatus] = useState([]);
    const {data: other_personal, isLoading: isDropdownLoading} = useQuery({
      queryKey: [`other_personal`],
      queryFn: () => getOtherPersonalDropdown(),
      refetchOnWindowFocus: true,
    });
    const { data: get_other_personal, isLoading: isTypeLoading } = useQuery({
        queryKey: [`get_other_personal ${type}`],
        queryFn: () => getOtherPersonal(type),
        refetchOnWindowFocus: true,
    })
    const { mutate: edit_other_personal } = useMutation({
        mutationKey: ['edit_other_personal'],
        mutationFn: async (data) => {
            editOtherPersonal(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss save", data, navigation.replace('otherPersonalHousehold')) },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const { mutate: add_other_personal } = useMutation({
        mutationKey: ['add_other_personal'],
        mutationFn: async (data) => {
            addOtherPersonal(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('otherPersonalHousehold') },
        onError: (error) => console.log("error save", error),
        onSettled: () => { setDraftpopup(false), setSavepopup(false) }
    })
    const scheme = yup.object().shape({
        personal_care_item_use: yup.array().required(t('Cleaning Products used is required')),
        yearly_expense_for_personal_care: yup.number().required(t('Yearly expense for Cleaning Products is required')),
        items_produced_locally: yup.boolean(),
        item_produces: yup.array().of(
            yup.object().shape({
                type: yup.string().required(t('Type is required')),
                quantity: yup
                    .string()
                    .required(t('Quantity is required')),
                    quantity_unit: yup.string().required(t('Quantity unit is required')),
            }),
        )
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
            personal_care_item_use: [],
            yearly_expense_for_personal_care: '',
            items_produced_locally: false,
            items_produces: []
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            setSavepopup(true)
        },
    });
    const handleFieldChange = (index, field, value) => {
        const newDetailsOfLand = [...values.items_produces];
        newDetailsOfLand[index][field] = value;
        setValues({ ...values, items_produces: newDetailsOfLand });
    };
    const handleStatusChange = (selectedItems) => {
        setSelectedStatus(selectedItems);

        // Update `purpose_status_of_land` based on the selected items
        const updatedPurposeStatusOfLand = selectedItems.map((item) => {
            // Check if this `type` already exists in `purpose_status_of_land`
            const existingEntry = values.items_produces.find(
                entry => entry.type === item
            );

            return existingEntry || {
                type: item,
                quantity: '',
                quantity_unit: '',
            };
        });
        // Update the form's purpose_status_of_land field
        setFieldValue('items_produces', updatedPurposeStatusOfLand);
    };
    const handleDraft = () => {
        let new_data = {
            type: type,
            personal_care_item_use: values.personal_care_item_use,
            yearly_expense_for_personal_care: values.yearly_expense_for_personal_care,
            items_produced_locally: values.items_produced_locally,
            items_produces: values.items_produces,
            status: 0
        }
        if (get_other_personal?._id) {
            edit_other_personal({ ...new_data, personal_household_id: get_other_personal._id })
        } else {
            add_other_personal({ ...new_data })
        }
    }

    const onSubmit = () => {
        let new_data = {
            personal_care_item_use: values.personal_care_item_use,
            yearly_expense_for_personal_care: values.yearly_expense_for_personal_care,
            items_produced_locally: values.items_produced_locally,
            items_produces: values.items_produces,
            type: type,
            status: 1
        }
        if (get_other_personal?._id) {
            edit_other_personal({ ...new_data, personal_household_id: get_other_personal._id })
        } else {
            add_other_personal({ ...new_data })
        }
    }
    useEffect(() => {
        resetForm({
            values: {
                personal_care_item_use: get_other_personal?.personal_care_item_use || [],
                yearly_expense_for_personal_care: String(get_other_personal?.yearly_expense_for_personal_care || '') || '',
                items_produced_locally: get_other_personal?.items_produced_locally || false,
                items_produces: get_other_personal?.items_produces.map((item) => {
                    return {
                        type: item.type,
                        quantity: String(item.quantity),
                        quantity_unit: item.quantity_unit || '',
                    }
                }) || [],
            }
        })
        setSelectedStatus(get_other_personal?.items_produces.map(item => item.type) || [])
    }, [get_other_personal])
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
                headerName={`${name}`}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <MultiselectDropdown
                    containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                    data={other_personal?.personal_care
                        ? other_personal?.personal_care.map(item => {
                                                              return {
                                                                name: item?.name?.[USER_PREFERRED_LANGUAGE],
                                                                                      key: item?._id,
                                                              };
                                                            })
                                                          :[{
                        name: 'keyboard',
                        key: '6739df18a4cfd8cc1f107ef9'
                    }, {
                        name: 'mouse',
                        key: '6739df18a4cfd8cc1f108ef9'
                    }]}
                    setSelectedd={(value) => {
                        setValues({ ...values, personal_care_item_use: value })
                    }}
                    selectedd={values?.personal_care_item_use}
                    infoName={t('What are the Cleaning Products you use?')}
                />
                {errors.personal_care_item_use &&
                    errors.personal_care_item_use && (
                        <Text style={Styles.error2}>
                            {
                                errors.personal_care_item_use
                            }
                        </Text>
                    )}
                <Input
                    label={t(
                        `Total yearly expense for Cleaning Products`
                    )}
                    value={values?.yearly_expense_for_personal_care}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={handleChange('yearly_expense_for_personal_care')}
                    isRight={
                        <AcresElement title={user.currency} />
                    }
                />
                {errors.yearly_expense_for_personal_care &&
                    errors.yearly_expense_for_personal_care && (
                        <Text style={Styles.error2}>
                            {
                                errors.yearly_expense_for_personal_care
                            }
                        </Text>
                    )}
                <SwitchButton
                    nolabel={false}
                    label={t('Are there items that you produce locally in village or at home?')}
                    selected={values?.items_produced_locally}
                    firstBtnPress={() => setValues({ ...values, items_produced_locally: true })}
                    secondBtnPress={() => { setValues({ ...values, items_produced_locally: false, items_produces: [] }), setSelectedStatus([]) }}
                    firstBtnText={t('yes')}
                    secondBtntext={t('no')}
                />
                {values?.items_produced_locally ?
                    <>
                        <MultiselectDropdown
                            containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                            data={other_personal?.cleaning_products_produce
                                ? other_personal?.cleaning_products_produce.map(item => {
                                                  return {
                                                    name: item?.name?.[USER_PREFERRED_LANGUAGE],
                                                                          key: item?._id,
                                                  };
                                                })
                                              :[{
                                name: 'keyboard',
                                key: '6739df18a4cfd8cc1f107ef9'
                            }, {
                                name: 'mouse',
                                key: '6739df18a4cfd8cc1f108ef9'
                            }]}
                            setSelectedd={handleStatusChange}
                            selectedd={selectedStatus}
                            infoName={t('Select items produced locally or at home.')}
                        />

                        {values?.items_produces?.length > 0 && (
                            <View style={styles.innerInputView}>
                                <Divider style={styles.divider2} />
                                <View style={{ width: '100%' }}>
                                    <View style={styles.quantityContainer}>
                                        {values.items_produces.map((item, index) => (
                                            <>
                                                <PurposeInput
                                                    title={`${other_personal?.cleaning_products_produce
                                                        ? other_personal?.cleaning_products_produce.find(
                                                            i => item?.type == i?._id,
                                                        )
                                                            ? other_personal?.cleaning_products_produce.find(
                                                                i => item?.type == i?._id,
                                                            )?.name[USER_PREFERRED_LANGUAGE]
                                                            : item?.type
                                                        : item?.type
                                                        }`}
                                                    value={item.quantity}
                                                    onChangeText={text =>
                                                        handleFieldChange(index, 'quantity', parseInt(text))
                                                    }
                                                    isRight={
                                                        <CustomDropdown
                                                            data={
                                                                other_personal?.dropdown
                                                                    ? other_personal?.dropdown.map(item => {
                                                                        return {
                                                                            label:
                                                                                item?.name?.[USER_PREFERRED_LANGUAGE],
                                                                            value: item?._id,
                                                                        };
                                                                    })
                                                                    : [
                                                                        {
                                                                            label: 'Kg',
                                                                            value: '6636117ecb51156c2f52683e',
                                                                        },
                                                                        {
                                                                            label: 'Litres',
                                                                            value: '6736117ecb51156c2f52643e',
                                                                        },
                                                                    ]
                                                            }
                                                            value={item?.quantity_unit}
                                                            noLabel={true}
                                                            onChange={value => {
                                                                handleFieldChange(index, 'quantity_unit', value?.value)
                                                            }}
                                                            sideDrop={true}
                                                            style={{
                                                                height: 30,
                                                                borderColor: '#fff',
                                                                width: 72,
                                                                marginTop: -1,
                                                                right: 3,
                                                                // backgroundColor:'red'
                                                            }}
                                                            placeholder={t('Unit')}
                                                            placeholderStyle={{
                                                                fontSize: 14,
                                                                fontFamily: fontFamilyRegular,
                                                                marginRight: 2,
                                                            }}
                                                        />
                                                    }
                                                    placeholder={'Quantity'}
                                                />
                                                {errors.items_produces &&
                                                    errors.items_produces[index]
                                                        ?.quantity && (
                                                        <Text style={Styles.error2}>
                                                            {
                                                                errors.items_produces[index]
                                                                    .quantity
                                                            }
                                                        </Text>
                                                    )}
                                            </>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        )}
                    </>
                    : null
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

export default CleaningProduct

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
    quantityContainer: {
        borderRadius: 10,
        borderWidth: 1,
        borderColor: primaryColor,
        paddingHorizontal: 12,
        width: '100%',
        paddingVertical: 6,
        alignSelf: 'center',
        marginTop: '4%'
    }
})