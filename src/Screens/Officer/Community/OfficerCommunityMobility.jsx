import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { borderColor, primaryColor } from '../../../styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../Components/CustomHeader/CustomHeader';
import { Styles } from '../../../styles/globalStyles';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import PopupModal from '../../../Components/Popups/PopupModal';
import CustomDropdown from '../../../Components/CustomDropdown/CustomDropdown';
import MultiselectDropdown from '../../../Components/MultiselectDropdown/MultiselectDropdown';
import Input from '../../../Components/Inputs/Input';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addModeratorCommunityInfrastructure, editModeratorCommunityInfrastructure, getModeratorCommunityInfrastructure, getModeratorCommunityInfrastructureDropdown } from '../../../functions/moderator';
import { USER_PREFERRED_LANGUAGE } from '../../../i18next';

const OfficerCommunityMobility = ({ navigation, route }) => {
    const { t } = useTranslation()
    const { community, sports, street, village_id, data } = route.params
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const queryClient = useQueryClient()
    const { data: get_moderator_community_dropdown, isLoading } = useQuery({
      queryKey: [`get_moderator_community_dropdown`],
      queryFn: () => getModeratorCommunityInfrastructureDropdown(),
      refetchOnWindowFocus: true,
    })

    const {mutate: edit_moderator_community} = useMutation({
      mutationFn: 
        editModeratorCommunityInfrastructure,
      onSuccess: data => {
        queryClient.invalidateQueries();
        setDraftpopup(false),
          setSavepopup(false),
          navigation.replace('officerHome', {village_id: village_id}),
          queryClient.invalidateQueries();
      },
      onError: error => console.log('error save', error),
    });
    const {mutate: add_moderator_community} = useMutation({
      mutationFn: addModeratorCommunityInfrastructure,
      onSuccess: data => {
        queryClient.invalidateQueries();
        setDraftpopup(false),
          setSavepopup(false),
          navigation.replace('officerHome', {village_id: village_id}),
          queryClient.invalidateQueries();
      },
      onError: error => console.log('error save', error),
    });
    const scheme = yup.object().shape({
        mobility: yup.boolean().required(t('Mobility is required')),
        type_of_mobility: yup.array().test(
            'is-mobility-type',
            t('Mobility type is required'),
            function (value) {
                const { mobility } = this.parent;
                if (mobility) {
                    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                        return value.length > 0;
                    }
                    return false;
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        water_storage: yup.boolean().required(t('Water storage is required')),
        water_capacity: yup.array().test(
            'is-water-capacity',
            t('Capacity is required'),
            function (value) {
                const { water_storage } = this.parent;
                if (water_storage) {
                    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                        return value.length > 0;
                    }
                    return false;
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        cold_storage: yup.boolean().required(t('Cold storage is required')),
        cold_storage_type: yup.array().test(
            'is-cold-storage-type',
            t('Cold storage type is required'),
            function (value) {
                const { cold_storage } = this.parent;
                if (cold_storage) {
                    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                        return value.length > 0;
                    }
                    return false;
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        cold_storage_capacity: yup.string().test(
            'is-cold-storage-capacity',
            t('Capacity is required'),
            function (value) {
                const { cold_storage } = this.parent;
                if (cold_storage) {
                    return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        energy_battery_house: yup.boolean().required(t('Energy battery house is required')),
        energy_battery_capacity: yup.string().test(
            'is-energy-battery-capacity',
            t('Capacity is required'),
            function (value) {
                const { energy_battery_house } = this.parent;
                if (energy_battery_house) {
                    return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        energy_battery_type: yup.array().test(
            'is-energy-battery-type',
            t('Type is required'),
            function (value) {
                const { energy_battery_house } = this.parent;
                if (energy_battery_house) {
                    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                        return value.length > 0;
                    }
                    return false;
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        others: yup.string(),
        access_to_newspaper: yup.boolean().required(t('Access to newspaper is required')),
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
            mobility: false,
            type_of_mobility: [],
            water_storage: false,
            water_capacity: [],
            cold_storage: false,
            cold_storage_type: [],
            cold_storage_capacity: '',
            energy_battery_house: false,
            energy_battery_capacity: '',
            energy_battery_type: [],
            others: '',
            access_to_newspaper: false,
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            setSavepopup(true)
        },

    });
    console.log("erroror", errors)
    const onSubmit = () => {
        setSavepopup(false)
        let formData = {
            ...values,
            ...community, ...sports, ...street
        }
        if (data?._id) {
            edit_moderator_community({ ...formData, community_id: data?._id })
        } else {
            add_moderator_community({ ...formData, village_id })
        }
    }
    const handleDraft = () => { }
    useEffect(()=>{
        resetForm({
            values:{

                mobility: data?.mobility || false,
                type_of_mobility: data?.type_of_mobility || [],
                water_storage: data?.water_storage || false,
                water_capacity: data?.water_capacity || [],
                cold_storage: data?.cold_storage || false,
                cold_storage_type: data?.cold_storage_type || [],
                cold_storage_capacity: data?.cold_storage_capacity || '',
                energy_battery_house: data?.energy_battery_house || false,
                energy_battery_capacity: data?.energy_battery_capacity || '',
                energy_battery_type: data?.energy_battery_type || [],
                others: data?.others || '',
                access_to_newspaper: data?.access_to_newspaper || false,
            }
        })
    },[])
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
                headerName={t(`community`)}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.mobility}
                    label={t('Mobility')}
                    onChange={value => {
                        setValues({
                            ...values,
                            mobility: value?.value,
                        });
                    }}
                />
                {touched?.mobility && errors?.mobility && (
                    <Text style={Styles.error2}>{String(errors?.mobility)}</Text>
                )}
                {values?.mobility &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={get_moderator_community_dropdown?.type_of_mobility.map((item) => {
                                                                                                                  return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                                                                                                              })}
                                setSelectedd={(value) => {
                                    setValues({ ...values, type_of_mobility: value });
                                }}
                                selectedd={values?.type_of_mobility}
                                infoName={t('Type of mobility accessible from the village')}
                            />
                            {errors.type_of_mobility &&
                                touched.type_of_mobility && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.type_of_mobility
                                        }
                                    </Text>
                                )}
                        </View>
                    </View>
                }
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.water_storage}
                    label={t('Water Storage')}
                    onChange={value => {
                        setValues({
                            ...values,
                            water_storage: value?.value,
                        });
                    }}
                />
                {touched?.water_storage && errors?.water_storage && (
                    <Text style={Styles.error2}>{String(errors?.water_storage)}</Text>
                )}
                {values?.water_storage &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={get_moderator_community_dropdown?.capacity_of_water_storage.map((item) => {
                                                                                                                  return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                                                                                                              })}
                                setSelectedd={(value) => {
                                    setValues({ ...values, water_capacity: value });
                                }}
                                selectedd={values?.water_capacity}
                                infoName={t('Capacity')}
                            />
                            {errors.water_capacity &&
                                touched.water_capacity && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.water_capacity
                                        }
                                    </Text>
                                )}
                        </View>
                    </View>
                }
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.cold_storage}
                    label={t('Cold Storage for perishable items')}
                    onChange={value => {
                        setValues({
                            ...values,
                            cold_storage: value?.value,
                        });
                    }}
                />
                {touched?.cold_storage && errors?.cold_storage && (
                    <Text style={Styles.error2}>{String(errors?.cold_storage)}</Text>
                )}
                {values?.cold_storage &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={get_moderator_community_dropdown?.type_of_cold_storage.map((item) => {
                                                                                                                  return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                                                                                                              })}
                                setSelectedd={(value) => {
                                    setValues({ ...values, cold_storage_type: value });
                                }}
                                selectedd={values?.cold_storage_type}
                                infoName={t('Type')}
                            />
                            {errors.cold_storage_type &&
                                touched.cold_storage_type && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.cold_storage_type
                                        }
                                    </Text>
                                )}
                            <CustomDropdown
                                data={
                                    get_moderator_community_dropdown?.capacity_of_cold_storage.map((item) => {
                               return { label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id }
                             })                                }
                                value={values?.cold_storage_capacity}
                                label={t('Capacity')}
                                onChange={value => {
                                    setValues({
                                        ...values,
                                        cold_storage_capacity: value?.value,
                                    });
                                }}
                            />
                            {errors.cold_storage_capacity &&
                                touched.cold_storage_capacity && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.cold_storage_capacity
                                        }
                                    </Text>
                                )}

                        </View>
                    </View>
                }
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.energy_battery_house}
                    label={t('Energy & Battery house')}
                    onChange={value => {
                        setValues({
                            ...values,
                            energy_battery_house: value?.value,
                        });
                    }}
                />
                {touched?.energy_battery_house && errors?.energy_battery_house && (
                    <Text style={Styles.error2}>{String(errors?.energy_battery_house)}</Text>
                )}
                {values?.energy_battery_house &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={get_moderator_community_dropdown?.type_of_energy_and_battery_house.map((item) => {
                                                                                                                  return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                                                                                                              })}
                                setSelectedd={(value) => {
                                    setValues({ ...values, energy_battery_type: value });
                                }}
                                selectedd={values?.energy_battery_type}
                                infoName={t('Type')}
                            />
                            {errors.energy_battery_type &&
                                touched.energy_battery_type && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.energy_battery_type
                                        }
                                    </Text>
                                )}
                            <CustomDropdown
                                data={
                                    get_moderator_community_dropdown?.capacity_of_energy_and_battery_house.map((item) => {
                                                                  return { label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id }
                                                                })
                                }
                                value={values?.energy_battery_capacity}
                                label={t('Capacity')}
                                onChange={value => {
                                    setValues({
                                        ...values,
                                        energy_battery_capacity: value?.value,
                                    });
                                }}
                            />
                            {errors.energy_battery_capacity &&
                                touched.energy_battery_capacity && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.energy_battery_capacity
                                        }
                                    </Text>
                                )}

                        </View>
                    </View>
                }
                <Input
                    label={t(
                        `Others(If any)`,
                    )}
                    value={values?.others}
                    placeholder={''}
                    fullLength={true}
                    keyboardType="default"
                    onChangeText={handleChange('others')}
                />
                {errors.others &&
                    touched.others && (
                        <Text style={Styles.error2}>
                            {
                                errors.others
                            }
                        </Text>
                    )}
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.access_to_newspaper}
                    label={t('Access to Newspaper, TV & Radio')}
                    onChange={value => {
                        setValues({
                            ...values,
                            access_to_newspaper: value?.value,
                        });
                    }}
                />
                {touched?.access_to_newspaper && errors?.access_to_newspaper && (
                    <Text style={Styles.error2}>{String(errors?.access_to_newspaper)}</Text>
                )}
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

export default OfficerCommunityMobility

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