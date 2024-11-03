import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'
import { useUser } from '../../Hooks/useUser'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getDemographic } from '../../functions/demographic'
import { get_dropdown_data } from '../../functions/AuthScreens'
import { Styles, width } from '../../styles/globalStyles'
import Input from '../../Components/Inputs/Input'
import { Divider } from 'react-native-paper'
import { primaryColor } from '../../styles/colors'
import ItemHeader from '../../Components/CustomHeader/ItemHeader'
import * as yup from 'yup';
import { useFormik } from 'formik';

const Housing = ({ navigation }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const { data: user, refetch: refetchUser } = useUser()
    const { t } = useTranslation()
    const scheme = yup.object().shape({
        total_numbers_of_houses: yup
            .number()
            .required(t('Total number of houses is required'))
            .max(20, 'Total number of houses cannot be greater than 20!')
            .min(1, 'At least one total number of houses is required'),
        total_numbers_of_farmhouses: yup.number()
            .required(t('Total number of farmhouses is required'))
            .max(20, 'Total number of farmhouses cannot be greater than 20!')
            .min(1, 'At least one total number of farmhouses owned is required'),
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
            total_numbers_of_houses: '',
            total_numbers_of_farmhouses: '',
        },
        validationSchema: scheme,
        onSubmit: async values => {
            console.log(values);
            navigation.navigate('housingDetails', values)
        },
    });
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('housing')}
                goBack={() => navigation.goBack()}
            />
            <ScrollView>
            <ItemHeader title={t('housing')} />
            <View style={styles.mainContainer}>
                <Input
                    label={t('Total number of Houses')}
                        onChangeText={handleChange('total_numbers_of_houses')}
                    value={values?.total_numbers_of_houses}
                    fullLength={true}
                        keyboardType='numeric'
                />
                    {touched?.total_numbers_of_houses && errors?.total_numbers_of_houses && (
                        <Text style={Styles.error2}>{String(errors?.total_numbers_of_houses)}</Text>
                    )}
                {values?.total_numbers_of_houses>0?
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Fill in details for')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '65%' }]}
                        horizontalInset={true}
                    />
                </View>
                :
                null
            }
            </View>
                {Array.from({ length: values?.total_numbers_of_houses }, (_, index) => {
                return <CustomShowcaseInput
                    key={index}
                    productionName={`House ${index+1}`}
                    progressBar={false}
                    onPress={() => {
                        navigation.navigate('housingDetails', { house: `House ${index + 1}` })
                    }}
                />
            })}
                <View style={styles.mainContainer}>
                    <Input
                        label={t('Total number of Farmhouses')}
                        onChangeText={handleChange('total_numbers_of_farmhouses')}
                        value={values?.total_numbers_of_farmhouses}
                        fullLength={true}
                        keyboardType='numeric'
                    />
                    {touched?.total_numbers_of_farmhouses && errors?.total_numbers_of_farmhouses && (
                        <Text style={Styles.error2}>{String(errors?.total_numbers_of_farmhouses)}</Text>
                    )}
                    {values?.total_numbers_of_farmhouses > 0 ?
                        <View style={styles.subArea}>
                            <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Fill in details for')}</Text>
                            <Divider
                                bold={true}
                                style={[styles.divider, { width: '65%' }]}
                                horizontalInset={true}
                            />
                        </View>
                        :
                        null
                    }
                </View>
                {Array.from({ length: values?.total_numbers_of_farmhouses }, (_, index) => {
                    return <CustomShowcaseInput
                        key={index}
                        productionName={`Farmhouse ${index + 1}`}
                        progressBar={false}
                        onPress={() => {
                            navigation.navigate('farmhouseDetails', { house: `Farmhouse ${index + 1}`  })
                        }}
                    />
                })}
            </ScrollView>
        </View>
    )
}

export default Housing

const makeStyles = (fontScale) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainContainer: {
        paddingHorizontal: 22
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
})