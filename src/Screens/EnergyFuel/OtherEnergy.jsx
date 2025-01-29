import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableOpacity,
    useWindowDimensions,
    View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { borderColor, primaryColor } from '../../styles/colors';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../Hooks/useUser';
import * as yup from 'yup';
import { useFormik } from 'formik';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles } from '../../styles/globalStyles';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import Input from '../../Components/Inputs/Input';
import AcresElement from '../../Components/ui/AcresElement';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import {
    addWaterHarvesting,
    editWaterHarvesting,
    getWaterDropdown,
    getWaterHarvesting,
} from '../../functions/water';
import { USER_PREFERRED_LANGUAGE } from '../../i18next';
import {
    addOthers,
    editOthers,
    getEnergyByType,
    getEnergyDropdown,
} from '../../functions/energyFuel';
import { fontFamilyRegular } from '../../styles/fontStyle';

const OtherEnergy = ({ navigation, route }) => {
    const { name, type } = route.params;
    const [savePopup, setSavepopup] = useState(false);
    const [draftPopup, setDraftpopup] = useState(false);
    const { t } = useTranslation();
    const { data: user } = useUser();
    const queryClient = useQueryClient();
    const { data: energy, isLoading: isDropdownLoading } = useQuery({
        queryKey: [`energy`],
        queryFn: () => getEnergyDropdown(),
        refetchOnWindowFocus: true,
    });
    const { data: get_type, isLoading: isTypeLoading } = useQuery({
        queryKey: [`get_type ${type}`],
        queryFn: () => getEnergyByType(type),
        refetchOnWindowFocus: true,
    });
    const { mutate: edit_others } = useMutation({
        mutationKey: ['edit_others'],
        mutationFn: async data => {
            editOthers(data);
            queryClient.invalidateQueries();
        },
        onSuccess: data => {
            console.log('successsssss save', data), navigation.replace('energyFuel');
        },
        onError: error => console.log('error save', error),
        onSettled: () => {
            setDraftpopup(false), setSavepopup(false);
        },
    });
    const { mutate: add_others } = useMutation({
        mutationKey: ['add_others'],
        mutationFn: async data => {
            addOthers(data);
            queryClient.invalidateQueries();
        },
        onSuccess: data => {
            console.log('successsssss save', data), navigation.replace('energyFuel');
        },
        onError: error => console.log('error save', error),
        onSettled: () => {
            setDraftpopup(false), setSavepopup(false);
        },
    });
    const [selectedStatus, setSelectedStatus] = useState([]);
    const scheme = yup.object().shape({
        source_of_fuels_used: yup.array().of(
            yup.object().shape({
                type: yup.string().required(t('Type is required')),
                purpose: yup.array().required(t('Purpose is required')),
                expenditures: yup.string().required(t('Expenditure is required')),
                quantity: yup.string().required(t('Quantity is required')),
                quantity_unit: yup.string().required(t('Quantity unit is required')),
            }),
        ),
    });
    // console.log("energrryrgry", energy['dropdown'])
    const {
        handleChange,
        handleSubmit,
        values,
        errors,
        setFieldTouched,
        touched,
        resetForm,
        setValues,
        setFieldValue,
    } = useFormik({
        initialValues: {
            source_of_fuels_used: [],
        },
        validationSchema: scheme,
        onSubmit: async values => {
            console.log(values);
            if (selectedStatus.length > 0) {
                setSavepopup(true);
            } else {
                ToastAndroid.show('Please select one value', ToastAndroid.BOTTOM);
            }
        },
    });

    const handleFieldChange = (index, field, value) => {
        const newDetailsOfLand = [...values.source_of_fuels_used];
        newDetailsOfLand[index][field] = value;
        setValues({ ...values, source_of_fuels_used: newDetailsOfLand });
    };

    const handleStatusChange = selectedItems => {
        setSelectedStatus(selectedItems);

        // Update `purpose_status_of_land` based on the selected items
        const updatedPurposeStatusOfLand = selectedItems.map(item => {
            // Check if this `type` already exists in `purpose_status_of_land`
            const existingEntry = values.source_of_fuels_used.find(
                entry => entry.type === item,
            );

            return (
                existingEntry || {
                    type: item,
                    purpose: [],
                    expenditures: '',
                    quantity: '',
                    quantity_unit: '',
                }
            );
        });
        // Update the form's purpose_status_of_land field
        setFieldValue('source_of_fuels_used', updatedPurposeStatusOfLand);
    };
    const handleDraft = () => {
        let newData = {
            source_of_fuels_used: values?.source_of_fuels_used,
            // type: type,
            status: 0,
        };
        if (get_type?._id) {
            edit_others({ ...newData, energy_id: get_type._id });
        } else {
            add_others({ ...newData });
        }
    };
    const onSubmit = () => {
        let newData = {
            source_of_fuels_used: values?.source_of_fuels_used,
            // type: type,
            status: 1,
        };
        if (get_type?._id) {
            edit_others({ ...newData, energy_id: get_type._id });
        } else {
            add_others({ ...newData });
        }
    };
    useEffect(() => {
        resetForm({
            values: {
                source_of_fuels_used:
                    get_type?.source_of_fuels_used.map(item => {
                        return {
                            type: item.type,
                            purpose: item.purpose,
                            expenditures: String(item.expenditures),
                            quantity: String(item.quantity || ''),
                            quantity_unit: item.quantity_unit,
                        };
                    }) || [],
            },
        });
        setSelectedStatus(
            get_type?.source_of_fuels_used.map(item => item.type) || [],
        );
    }, [get_type]);
    const [collapseStates, setCollapseStates] = useState([]);

    useEffect(() => {
        // Initialize collapseStates with false for all vehicles
        if (values?.source_of_fuels_used?.length > 0) {
            setCollapseStates(Array(values?.source_of_fuels_used?.length).fill(true));
        }
    }, [values?.source_of_fuels_used?.length]);

    const toggleCollapse = index => {
        setCollapseStates(prevStates => {
            // Create a new array to avoid mutating the state directly
            const newStates = [...prevStates];
            newStates[index] = !newStates[index]; // Toggle the specific index
            return newStates;
        });
    };
    console.log("errorrrrr", errors)
    if (isTypeLoading || isDropdownLoading) {
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
                    data={energy?.source_of_fuels_used?.length > 0
                        ? energy?.source_of_fuels_used.map(item => {
                            return {
                                name: item?.name?.[USER_PREFERRED_LANGUAGE],
                                key: item?._id,
                            };
                        })
                        : [
                        {
                            name: 'keyboard',
                            key: '6736117ecb51156c2f92383e',
                        },
                        {
                            name: 'mouse',
                            key: '6736117ecb51156c2f52383e',
                        },
                    ]}
                    setSelectedd={handleStatusChange}
                    selectedd={selectedStatus}
                    infoName={t('Other sources of fuels used')}
                />
                {values?.source_of_fuels_used.length > 0 && (
                    <>
                        {values?.source_of_fuels_used.map((item, index) => {
                            return (
                                <>
                                    <View style={[styles.subArea, { marginTop: '3%' }]}>
                                        <Text
                                            style={[
                                                Styles.fieldLabel,
                                                { marginTop: 4, alignSelf: 'center' },
                                            ]}>
                                            {`Enter details for ${energy?.source_of_fuels_used
                                                    ? energy?.source_of_fuels_used.find(
                                                        i => item?.type == i?._id,
                                                    )
                                                        ? energy?.source_of_fuels_used.find(
                                                            i => item?.type == i?._id,
                                                        )?.name[USER_PREFERRED_LANGUAGE]
                                                        : item?.type
                                                    : null
                                                }`}
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
                                    {collapseStates[index] && (
                                        <View style={styles.innerInputView}>
                                            <Divider style={styles.divider2} />
                                            <View style={{ width: '100%' }}>
                                                <MultiselectDropdown
                                                    containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                                    data={
                                                        energy?.other_source_purpose?.length > 0
                                                            ? energy?.other_source_purpose.map(item => {
                                                                return {
                                                                    name: item?.name?.[USER_PREFERRED_LANGUAGE],
                                                                    key: item?._id,
                                                                };
                                                            })
                                                            : [
                                                                {
                                                                    name: 'Title',
                                                                    key: '6736117ecb51156c2f52683e',
                                                                },
                                                            ]
                                                    }
                                                    setSelectedd={value => {
                                                        handleFieldChange(index, 'purpose', value);
                                                    }}
                                                    selectedd={item.purpose}
                                                    infoName={t('What is the purpose?')}
                                                />
                                                {errors.source_of_fuels_used &&
                                                    errors.source_of_fuels_used[index]?.purpose && (
                                                        <Text style={Styles.error2}>
                                                            {errors.source_of_fuels_used[index].purpose}
                                                        </Text>
                                                    )}
                                                <Input
                                                    label={t(`${t('Enter Quantity')}`)}
                                                    value={item.quantity}
                                                    placeholder={'0'}
                                                    fullLength={true}
                                                    keyboardType="numeric"
                                                    onChangeText={text =>
                                                        handleFieldChange(index, 'quantity', parseInt(text))
                                                    }
                                                    isRight={
                                                        <CustomDropdown
                                                            data={energy?.dropdown ? energy?.dropdown.map(
                                                                item => {
                                                                    return {
                                                                        label:
                                                                            item?.name?.[USER_PREFERRED_LANGUAGE],
                                                                        value: item?._id,
                                                                    };
                                                                },
                                                            ) : [
                                                                {
                                                                    label: 'Kg',
                                                                    value: '6736117ecb51156c2f52683e',
                                                                },
                                                                {
                                                                    label: 'Litres',
                                                                    value: '6736117ecb51156c2f52643e',
                                                                }
                                                            ]}
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
                                                                right: 3
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
                                                />
                                                {errors.source_of_fuels_used &&
                                                    errors.source_of_fuels_used[index]?.quantity && (
                                                        <Text style={Styles.error2}>
                                                            {errors.source_of_fuels_used[index].quantity}
                                                        </Text>
                                                    )}
                                                <Input
                                                    label={t(`${t('Total Expenditure')}`)}
                                                    value={item.expenditures}
                                                    placeholder={'0'}
                                                    fullLength={true}
                                                    keyboardType="numeric"
                                                    onChangeText={text =>
                                                        handleFieldChange(
                                                            index,
                                                            'expenditures',
                                                            parseInt(text),
                                                        )
                                                    }
                                                    isRight={<AcresElement title={user.currency} />}
                                                />
                                                {errors.source_of_fuels_used &&
                                                    errors.source_of_fuels_used[index]?.expenditure && (
                                                        <Text style={Styles.error2}>
                                                            {errors.source_of_fuels_used[index].expenditure}
                                                        </Text>
                                                    )}
                                            </View>
                                        </View>
                                    )}
                                </>
                            );
                        })}
                    </>
                )}
            </KeyboardAwareScrollView>
            <View
                style={[
                    Styles.bottomBtn,
                    { flexDirection: 'row', justifyContent: 'space-between' },
                ]}>
                <CustomButton
                    btnText={t('submit')}
                    style={{ width: '48%', height: 60 }}
                    onPress={handleSubmit}
                />
                <CustomButton
                    btnText={t('save as draft')}
                    style={{ width: '48%', height: 60, backgroundColor: borderColor }}
                    onPress={() => {
                        setDraftpopup(true);
                    }}
                    btnStyle={{ color: 'black' }}
                />
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
                            onPress={() => {
                                onSubmit();
                            }}
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
    );
};

export default OtherEnergy;
const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
});
