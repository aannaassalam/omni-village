import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import ItemHeader from '../../Components/CustomHeader/ItemHeader'
import * as yup from 'yup';
import { useFormik } from 'formik';
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'
import SwitchButton from '../../Components/SwitchButtons/SwitchButton'
import Input from '../../Components/Inputs/Input'
import { Styles } from '../../styles/globalStyles'
import CustomButton from '../../Components/CustomButton/CustomButton'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { addBusinessByUser } from '../../functions/business'

const BusinessCommercial = ({ navigation }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const { mutate: add_business_by_user } = useMutation({
        mutationKey: ['add_business_by_user'],
        mutationFn: async (data) => {
            addBusinessByUser(data)
            queryClient.invalidateQueries()
        },
        onSuccess: (data) => {
            console.log("successsssss save", data)
            navigation.navigate('businessCount')
        },
        onError: (error) => console.log("error save", error),
        onSettled: () => { }
    })
    const scheme = yup.object().shape({
        number_of_business: yup.number(),
        other_business_apart_farming: yup.boolean(),
        plan_to_start_business: yup.boolean()
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
            other_business_apart_farming: false,
            number_of_business: '',
            plan_to_start_business: false
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
           add_business_by_user({...values, number_of_business: parseInt(values?.number_of_business)})
        }
    });
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('business')}
                goBack={() => navigation.goBack()}
            />
            <ScrollView>

                <ItemHeader title={t('business')} />
                <View style={styles.mainContainer}>
                    <SwitchButton
                        nolabel={false}
                        label={t('Do you have any other businesses apart from farming?')}
                        selected={values?.other_business_apart_farming}
                        firstBtnPress={() => setValues({ ...values, other_business_apart_farming: true })}
                        secondBtnPress={() => { setValues({ ...values, other_business_apart_farming: false, number_of_business: '' }) }}
                        firstBtnText={t('yes')}
                        secondBtntext={t('no')}
                    />
                    {values?.other_business_apart_farming ?
                        <>
                            <Input
                                label={t(
                                    `How many other businesses?`
                                )}
                                value={values?.number_of_business}
                                placeholder={'0'}
                                fullLength={true}
                                keyboardType="numeric"
                                onChangeText={handleChange('number_of_business')}
                            />
                            {errors.number_of_business &&
                                errors.number_of_business && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.number_of_business
                                        }
                                    </Text>
                                )}
                        </>
                        : null
                    }
                    <SwitchButton
                        nolabel={false}
                        label={t('Do you have plan to start a new business or organisation?')}
                        selected={values?.plan_to_start_business}
                        firstBtnPress={() => setValues({ ...values, plan_to_start_business: true })}
                        secondBtnPress={() => { setValues({ ...values, plan_to_start_business: false }) }}
                        firstBtnText={t('yes')}
                        secondBtntext={t('no')}
                    />
                </View>
            </ScrollView>
            {values?.other_business_apart_farming || values?.plan_to_start_business ?
            <View style={Styles.bottomBtn}>
                <CustomButton
                    btnText={t('next')}
                    style={{ width: '100%' }}
                    onPress={handleSubmit}
                />
            </View>
            :null
            }
        </View>
    )
}

export default BusinessCommercial

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainContainer: {
        paddingHorizontal: 22
    }
})