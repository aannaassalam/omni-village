import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React, { useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Customdropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useTranslation } from 'react-i18next';
import { Styles } from '../../styles/globalStyles';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';
import { useUser } from '../../Hooks/useUser';
import Input from '../../Components/Inputs/Input';
import AcresElement from '../../Components/ui/AcresElement';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useQuery } from '@tanstack/react-query';
import { get_dropdown_data } from '../../functions/AuthScreens';
import { ActivityIndicator } from 'react-native-paper';
import { primaryColor } from '../../styles/colors';

const DemographicOccupation = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const { demographic, data, member_id,
        demographic_id } = route.params
    const { t } = useTranslation()
    const { data: user } = useUser()
    const { data: dropdownData, isLoading: dropdown_loading }= useQuery({
        queryKey: ['dropdown_data'],
        queryFn: get_dropdown_data,
        refetchOnWindowFocus: true,
    })
    const scheme = yup.object().shape({
        occupation: yup.string().required(t('occupation is required')),
        yearly_income: yup.string().required(t('yearly income is required')),
        bank_account: yup.boolean().required(t('have bank account required')),
        savings_investment: yup.boolean(),
        savings_investment_amount: yup.number().test(
            'savings_investment-amount-required',
            t('saving amount required'),
            function (value) {
                const { savings_investment } = this.parent; // Accessing other field values
                if (savings_investment) {
                    return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
                }
                return true; // Otherwise, no validation on decreasing_yield
            },
        ),
    });
    const {
        handleChange,
        handleSubmit,
        values,
        errors,
        setFieldTouched,
        touched,
        resetForm,
        setValues
    } = useFormik({
        initialValues: {
            occupation: '',
            yearly_income: '',
            bank_account: false,
            savings_investment: false,
            savings_investment_amount: '',
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            navigation.navigate('demographicDisease', {
                demographic: demographic,
                occupation: { ...values, savings_investment_amount: parseInt(values?.savings_investment_amount) },
                data: data,
                member_id,
                demographic_id
            })
        },
    });
    console.log("errr", errors, values)
    useEffect(() => {
        resetForm({
            values:{
                occupation: data?.occupation || '',
                yearly_income: data?.yearly_income || '',
                bank_account: data?.bank_account || false,
                savings_investment: data?.savings_investment || false,
                savings_investment_amount: data?.savings_investment_amount || '',
            }
        })
    },[data])
    if (dropdown_loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <ActivityIndicator size={'large'} color={primaryColor} />
        </View>
    }
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('demographic')}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <Customdropdown
                    data={dropdownData?.['occupation'].map((item)=>{return {id: item?._id, label: item?.name, value:item?._id}})}
                    value={values.occupation}
                    label={t('occupation')}
                    onChange={(value) => {
                        setValues({
                            ...values,
                            occupation: value?.value,
                        });
                    }}
                />
                {touched?.occupation && errors?.occupation && (
                    <Text style={Styles.error2}>{String(errors?.occupation)}</Text>
                )}
                <Customdropdown
                    data={dropdownData?.['yearly_income'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
                    value={values.yearly_income}
                    label={t('yearly income')}
                    onChange={(value) => {
                        setValues({
                            ...values,
                            yearly_income: value?.value,
                        });
                    }}
                />
                {touched?.yearly_income && errors?.yearly_income && (
                    <Text style={Styles.error2}>{String(errors?.yearly_income)}</Text>
                )}
                <Text style={Styles.fieldLabel}>{t('do you have a bank account?')}</Text>
                <SwitchButton
                    firstBtnText='Yes'
                    firstBtnPress={() => setValues({ ...values, bank_account: true })}
                    selected={values?.bank_account}
                    secondBtntext='No'
                    secondBtnPress={() => setValues({ ...values, bank_account: false })}
                />
                {values?.bank_account?
            <>
                <Text style={Styles.fieldLabel}>{t('do you have any savings/ investments?')}</Text>
                <SwitchButton
                    firstBtnText='Yes'
                    firstBtnPress={() => setValues({ ...values, savings_investment: true })}
                    selected={values?.savings_investment}
                    secondBtntext='No'
                    secondBtnPress={() => setValues({ ...values, savings_investment: false })}
                />
            </>   
            :null 
            }
                {values?.savings_investment ? 
                <>
                <Input
                    label={t('can you specify the amount saved/invested ?')}
                    value={values.savings_investment_amount}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType='numeric'
                    onChangeText={handleChange('savings_investment_amount')}
                    isRight={<AcresElement title={user?.currency} />}
                />
                {touched?.savings_investment_amount && errors?.savings_investment_amount && (
                    <Text style={Styles.error2}>{String(errors?.savings_investment_amount)}</Text>
                )}
                </>
                :null
            }
            </KeyboardAwareScrollView>
            <View style={Styles.bottomBtn}>
                <CustomButton btnText={t('next')} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
            </View>
        </View>
    );
};

export default DemographicOccupation;

const makeStyles = fontScale =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
    });
