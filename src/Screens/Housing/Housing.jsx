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

const Housing = ({ navigation }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const { mutate: add_housing_by_user } = useMutation({
        mutationKey: ['add_housing_by_user'],
        mutationFn: async (data) => {
            addHousingByUser(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => {
            console.log("successsssss save", data)
            navigation.navigate('houseSpecificationQuestioner')
        },
        onError: (error) => console.log("error save", error),
        onSettled: () => { }
    })
    const scheme = yup.object().shape({
        total_numbers_of_house: yup
            .number()
            .required(t('Total number of houses owned is required'))
            .max(20, 'Total number of houses owned cannot be greater than 20!')
            .min(1, 'At least one total number of houses owned is required'),
        house_requirements: yup.boolean().required(t('House requirements is required')),
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
            total_numbers_of_house: '',
            house_requirements: false,
        },
        validationSchema: scheme,
        onSubmit: async values => {
            console.log(values);
            let new_data = {
                total_numbers_of_house: parseInt(values.total_numbers_of_house),
                house_requirements: values.house_requirements,
            }
            add_housing_by_user(new_data)
            
        },
    });
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('housing')}
                goBack={() => navigation.goBack()}
            />
            <ItemHeader title={t('housing')} />
            <View style={styles.mainContainer}>
                <Input
                    label={t('Total number of houses owned')}
                    value={values.total_numbers_of_house}
                    placeholder={''}
                    fullLength={true}
                    keyboardType='numeric'
                    onChangeText={handleChange('total_numbers_of_house')}
                />
                {touched?.total_numbers_of_house && errors?.total_numbers_of_house && (
                    <Text style={Styles.error2}>{String(errors?.total_numbers_of_house)}</Text>
                )}
                <SwitchButton
                    nolabel={false}
                    label={t('Do have any more house requirements?')}
                    selected={values?.house_requirements}
                    firstBtnPress={() => setValues({ ...values, house_requirements: true })}
                    secondBtnPress={() => setValues({ ...values, house_requirements: false })}
                    firstBtnText={t('yes')}
                    secondBtntext={t('no')}
                />
                {touched?.house_requirements && errors?.house_requirements && (
                    <Text style={Styles.error2}>{String(errors?.house_requirements)}</Text>
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

export default Housing

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