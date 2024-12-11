import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'
import * as yup from 'yup';
import { useFormik } from 'formik';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, width } from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import PurposeInput from '../../Components/PurposeInput/PurposeInput';
import { ActivityIndicator, Divider } from 'react-native-paper';
import Input from '../../Components/Inputs/Input';
import AcresElement from '../../Components/ui/AcresElement';
import { useUser } from '../../Hooks/useUser';
import { primaryColor } from '../../styles/colors';
import { useQuery } from '@tanstack/react-query';
import { getBusiness, getBusinessDropdown } from '../../functions/business';

const BusinessInvestment = ({ navigation, route }) => {
    const { businessEmployee, businessName, name, id } = route.params;
    const { t } = useTranslation()
    const [selectedStatus, setSelectedStatus] = useState([]);
    const [selectedStatusSecond, setSelectedStatusSecond] = useState([]);
    const { data: user } = useUser()
    const { data: business_dropdown, isLoading, refetch } = useQuery({
        queryKey: ['business_dropdown'],
        queryFn: () => getBusinessDropdown(),
        refetchOnWindowFocus: true,
    })
    const { data: business, isLoading: isBusinessLoading } = useQuery({
        queryKey: ['business'],
        queryFn: () => getBusiness(id),
        refetchOnWindowFocus: true,
    })
    const scheme = yup.object().shape({
        investment_need_so_far: yup.string().required('Investment need so far is required'),
        water_consumption: yup.number().required('Water consumption is required'),
        energy_consumption: yup.number().required('Energy consumption is required'),
        raw_material_consumption: yup.array().of(yup.object().shape({
            item: yup.string().required(t('Type is required')),
            quantity: yup.string().required(t('Quantity is required'))})).required('Raw material consumption is required'),
        fuel_source: yup.array().of(yup.object().shape({
            item: yup.string().required(t('Type is required')),
            quantity: yup.string().required(t('Quantity is required'))
        })).required('Fuel source is required'),
        type_of_infrastructure: yup.array().of(yup.string()).required('Infrastructure is required'),
        machine_equipment_installed: yup.string().required('Machine and equipment installed is required'),
    })
    const {
        handleChange,
        handleSubmit,
        values,
        errors,
        setFieldTouched,
        setFieldValue,
        touched,
        resetForm,
        setValues,
    } = useFormik({
        initialValues: {
            investment_need_so_far: '',
            water_consumption: '',
            energy_consumption: '',
            raw_material_consumption: [],
            fuel_source: [],
            type_of_infrastructure: [],
            machine_equipment_installed: ''
        },
        validationSchema: scheme,
        onSubmit: async values => {
            console.log(values);
            let new_data = {
                investment_need_so_far: parseInt(values.investment_need_so_far),
                water_consumption: parseInt(values.water_consumption),
                energy_consumption: parseInt(values.energy_consumption),
                raw_material_consumption: values.raw_material_consumption,
                fuel_source: values.fuel_source,
                type_of_infrastructure: values.type_of_infrastructure,
                machine_equipment_installed: values.machine_equipment_installed,
            }
            navigation.navigate('businessRequirement', { businessInvestment: new_data, businessEmployee, businessName: businessName, id: id, name })
        },
    });
    const handleFieldChange = (index, field, value) => {
        const newDetailsOfLand = [...values.raw_material_consumption];
        newDetailsOfLand[index][field] = value;
        setValues({ ...values, raw_material_consumption: newDetailsOfLand });
    };
    const handleStatusChange = (selectedItems) => {
        setSelectedStatus(selectedItems);

        // Update `purpose_status_of_land` based on the selected items
        const updatedPurposeStatusOfLand = selectedItems.map((item) => {
            // Check if this `type` already exists in `purpose_status_of_land`
            const existingEntry = values.raw_material_consumption.find(
                entry => entry.item === item
            );

            return existingEntry || {
                item: item,
                quantity: ''
            };
        });
        // Update the form's purpose_status_of_land field
        setFieldValue('raw_material_consumption', updatedPurposeStatusOfLand);
    };
    const handleFieldChangeSecond = (index, field, value) => {
        const newDetailsOfLand = [...values.fuel_source];
        newDetailsOfLand[index][field] = value;
        setValues({ ...values, fuel_source: newDetailsOfLand });
    };
    const handleStatusChangeSecond = (selectedItems) => {
        setSelectedStatusSecond(selectedItems);

        // Update `purpose_status_of_land` based on the selected items
        const updatedPurposeStatusOfLand = selectedItems.map((item) => {
            // Check if this `type` already exists in `purpose_status_of_land`
            const existingEntry = values.fuel_source.find(
                entry => entry.type === item
            );

            return existingEntry || {
                item: item,
                quantity: ''
            };
        });
        // Update the form's purpose_status_of_land field
        setFieldValue('fuel_source', updatedPurposeStatusOfLand);
    };
    useEffect(() => {
        resetForm({
            values: {
                investment_need_so_far: String(business?.investment_need_so_far || '') || '',
                water_consumption: String(business?.water_consumption || '') || '',
                energy_consumption: String(business?.energy_consumption || '') || '',
                raw_material_consumption: business?.raw_material_consumption?.length > 0 ? business?.raw_material_consumption.map((item)=>{
                    return {
                        item: item.item,
                        quantity: String(item.quantity)
                    }
                }) : [],
                fuel_source: business?.fuel_source?.length>0 ?business?.fuel_source.map((item) => {
                    return {
                        item: item.item,
                        quantity: String(item.quantity)
                    }
                }): [],
                type_of_infrastructure: business?.type_of_infrastructure||[],
                machine_equipment_installed: business?.machine_equipment_installed || ''
            }
        })
        setSelectedStatus(business?.raw_material_consumption.map((item)=> item?.item))
        setSelectedStatusSecond(business?.fuel_source.map((item) => item?.item))
    }, [business])
    if (isBusinessLoading || isLoading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <ActivityIndicator size={'large'} color={primaryColor} />
        </View>
    }
    console.log(errors)
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={name}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <Input
                    label={t(
                        `Investment made so far`
                    )}
                    value={values?.investment_need_so_far}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={handleChange('investment_need_so_far')}
                    isRight={<AcresElement title={user?.currency} />}
                />
                {errors.investment_need_so_far &&
                    errors.investment_need_so_far && (
                        <Text style={Styles.error2}>
                            {
                                errors.investment_need_so_far
                            }
                        </Text>
                    )}
                <Input
                    label={t(
                        `Water consumption`
                    )}
                    value={values?.water_consumption}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={handleChange('water_consumption')}
                    isRight={<AcresElement title={'Litres'} />}
                />
                {errors.water_consumption &&
                    errors.water_consumption && (
                        <Text style={Styles.error2}>
                            {
                                errors.water_consumption
                            }
                        </Text>
                    )}
                <Input
                    label={t(
                        `Energy Consumption`
                    )}
                    value={values?.energy_consumption}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={handleChange('energy_consumption')}
                    isRight={<AcresElement title={'kWh'} />}
                />
                {errors.energy_consumption &&
                    errors.energy_consumption && (
                        <Text style={Styles.error2}>
                            {
                                errors.energy_consumption
                            }
                        </Text>
                    )}
                <MultiselectDropdown
                    containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                    data={business_dropdown?.raw_materials.map((item) => {
                        return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                    })}
                    setSelectedd={handleStatusChange}
                    selectedd={selectedStatus}
                    infoName={t('Raw materials consumption')}
                />

                {values?.raw_material_consumption?.length > 0 && (
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <View style={styles.quantityContainer}>
                                {values.raw_material_consumption.map((item, index) => (
                                    <>
                                        <PurposeInput title={`${t('Item')} ${index + 1}`} value={item.quantity} onChangeText={text =>
                                            handleFieldChange(
                                                index,
                                                'quantity',
                                                parseInt(text),
                                            )
                                        } unit={'Kg'} placeholder={t('Quantity')} />
                                        {errors.raw_material_consumption &&
                                            errors.raw_material_consumption[index]
                                                ?.quantity && (
                                                <Text style={Styles.error2}>
                                                    {
                                                        errors.raw_material_consumption[index]
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
                <MultiselectDropdown
                    containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                    data={business_dropdown?.fuel_sources.map((item) => {
                        return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                    })}
                    setSelectedd={handleStatusChangeSecond}
                    selectedd={selectedStatusSecond}
                    infoName={t('Select your Fuel sources if any')}
                />

                {values?.fuel_source?.length > 0 && (
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <View style={styles.quantityContainer}>
                                {values.fuel_source.map((item, index) => (
                                    <>
                                        <PurposeInput title={`${t('Item')} ${index + 1}`} value={item.quantity} onChangeText={text =>
                                            handleFieldChangeSecond(
                                                index,
                                                'quantity',
                                                parseInt(text),
                                            )
                                        } unit={'Litre'} placeholder={t('Quantity')} />
                                        {errors.fuel_source &&
                                            errors.fuel_source[index]
                                                ?.quantity && (
                                                <Text style={Styles.error2}>
                                                    {
                                                        errors.fuel_source[index]
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
                <MultiselectDropdown
                    containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                    data={business_dropdown?.type_of_infrastructure.map((item) => {
                        return { key: item?._id, name: item?.name?.[USER_PREFERRED_LANGUAGE] }
                    })}
                    setSelectedd={(value) => {setValues({ ...values, type_of_infrastructure: value }), console.log("value", value)}}
                    selectedd={values?.type_of_infrastructure}
                    infoName={t('Type of infrastructure')}
                />
                {touched?.type_of_infrastructure && errors?.type_of_infrastructure && (
                    <Text style={Styles.error2}>{String(errors?.type_of_infrastructure)}</Text>
                )}
                <Input
                    label={t(
                        `Machines & equipments installed`
                    )}
                    value={values?.machine_equipment_installed}
                    placeholder={''}
                    fullLength={true}
                    keyboardType="default"
                    onChangeText={handleChange('machine_equipment_installed')}
                />
                {errors.machine_equipment_installed &&
                    errors.machine_equipment_installed && (
                        <Text style={Styles.error2}>
                            {
                                errors.machine_equipment_installed
                            }
                        </Text>
                    )}
            </KeyboardAwareScrollView>
            <View style={Styles.bottomBtn}>
                <CustomButton btnText={t('next')} onPress={handleSubmit} style={{ width: '100%' }} />
            </View>
        </View>
    )
}

export default BusinessInvestment

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
    innerInputView: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginBottom: '5%',
        gap: 12,
        paddingHorizontal: 12
    },
    divider2: {
        // backgroundColor: 'grey',
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