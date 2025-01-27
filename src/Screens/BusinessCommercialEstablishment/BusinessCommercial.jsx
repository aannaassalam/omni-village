import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { addBusinessByUser, editBusinessByUser, getBusinessByUser } from '../../functions/business'

const BusinessCommercial = ({ navigation }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const { data: get_business_by_user, isLoading, refetch } = useQuery({
        queryKey: ['get_business_by_user'],
        queryFn: () => getBusinessByUser(),
        refetchOnWindowFocus: true,
    })
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
     const { mutate: edit_business_by_user } = useMutation({
         mutationKey: ['edit_business_by_user'],
            mutationFn: async (data) => {
                editBusinessByUser(data)
                queryClient.invalidateQueries()
            },
         onSuccess: (data) => { console.log("successsssss save", data), navigation.navigate('businessCount') },
            onError: (error) => console.log("error save", error),
        })
    const scheme = yup.object().shape({
        other_business_apart_farming: yup.boolean(),
        plan_to_start_business: yup.boolean()
    });
    const {
        handleSubmit,
        values,
        setValues
    } = useFormik({
        initialValues: {
            other_business_apart_farming: false,
            plan_to_start_business: false
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            if(get_business_by_user?._id){
                edit_business_by_user({ ...values, number_of_business: parseInt(values?.number_of_business), business_by_user_id: get_business_by_user._id })
            }else{
                add_business_by_user({...values, number_of_business: parseInt(values?.number_of_business)})
            }
        }
    });
    useEffect(() => {
        if (get_business_by_user?._id) {
            setValues({
                other_business_apart_farming: get_business_by_user?.other_business_apart_farming,
                plan_to_start_business: get_business_by_user?.plan_to_start_business,
            })
        }
    },[get_business_by_user])
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
                        secondBtnPress={() => { setValues({ ...values, other_business_apart_farming: false }) }}
                        firstBtnText={t('yes')}
                        secondBtntext={t('no')}
                    />
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