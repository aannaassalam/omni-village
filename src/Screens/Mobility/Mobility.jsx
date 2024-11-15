import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import ItemHeader from '../../Components/CustomHeader/ItemHeader';
import { Styles, width } from '../../styles/globalStyles';
import Input from '../../Components/Inputs/Input';
import CustomButton from '../../Components/CustomButton/CustomButton';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addHousingByUser } from '../../functions/housing';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';

const Mobility = ({ navigation }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const scheme = yup.object().shape({
        methods_of_mobility: yup.array().required(t('Methods of mobility is required')).min(1, t('Atleast one Methods of mobility is required')),
        access_to_public_transport: yup.boolean(),
        number_of_vehicles: yup.number().required(t('Number of vehicles is required')),
        vehicle_requirement: yup.boolean().required(t('Vehicle requirement is required'))
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
    } = useFormik({
        initialValues: {
            methods_of_mobility: [],
            access_to_public_transport: false,
            number_of_vehicles: '',
            vehicle_requirement: false
        },
        validationSchema: scheme,
        onSubmit: async values => {
            console.log(values);
            let new_data = {
                methods_of_mobility: values.methods_of_mobility,
                access_to_public_transport: values.access_to_public_transport,
                number_of_vehicles: parseInt(values.number_of_vehicles),
                vehicle_requirement: values.vehicle_requirement

            }
navigation.navigate('vehicleCount')
        },
    });
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('mobility')}
                goBack={() => navigation.goBack()}
            />
            <ItemHeader title={t('mobility')} />
            <View style={styles.mainContainer}>
                <MultiselectDropdown
                    containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                    data={[
                        {
                            name: 'Electricity',
                            key: 'electricity',
                        },
                        {
                            name: 'Petrol',
                            key: 'petrol',
                        },
                        {
                            name: 'Others',
                            key: 'othersEnergy',
                        },
                    ]}
                    setSelectedd={(value) => setValues({...values, methods_of_mobility: value})}
                    selectedd={values?.methods_of_mobility}
                    infoName={t('Select all the methods of Mobility that you use')}
                />
                {touched?.methods_of_mobility && errors?.methods_of_mobility && (
                    <Text style={Styles.error2}>{String(errors?.methods_of_mobility)}</Text>
                )}
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false}]
                    }
                    value={values?.access_to_public_transport}
                    label={t('Access to Public Transport within 5 KM')}
                    onChange={value => {
                        setValues({
                            ...values,
                            access_to_public_transport: value?.value,
                        });
                    }}
                />
                {touched?.access_to_public_transport && errors?.access_to_public_transport && (
                    <Text style={Styles.error2}>{String(errors?.access_to_public_transport)}</Text>
                )}
                <Input
                    label={t(
                        `Number of Vehicles owned by your household`
                    )}
                    value={values?.number_of_vehicles}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={handleChange('number_of_vehicles')}
                />
                {errors.number_of_vehicles &&
                    errors.number_of_vehicles && (
                        <Text style={Styles.error2}>
                            {
                            errors.number_of_vehicles
                            }
                        </Text>
                    )}
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.vehicle_requirement}
                    label={t('Do you have any new Vehicle Requirement?')}
                    onChange={value => {
                        setValues({
                            ...values,
                            vehicle_requirement: value?.value,
                        });
                    }}
                />
                {touched?.vehicle_requirement && errors?.vehicle_requirement && (
                    <Text style={Styles.error2}>{String(errors?.vehicle_requirement)}</Text>
                )}
            </View>
            <View style={Styles.bottomBtn}>
                <CustomButton
                    btnText={t('next')}
                    style={{ width: '100%' }}
                    onPress={handleSubmit}
                />
            </View>
        </View>
    )
}

export default Mobility

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainContainer: {
        paddingHorizontal: 22,
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
});