import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';
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

const DemographicOccupation = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const { demographic } = route.params
    const { t } = useTranslation()
    const { data: user } = useUser()
    const {data: dropdownData}= useQuery({
        queryKey: ['dropdown_data'],
        queryFn: get_dropdown_data,
        refetchOnWindowFocus: true,
    })
    const scheme = yup.object().shape({
        occupation: yup.string().required('Occupation is required'),
        yearly_income: yup.string().required('Yearly income is required'),
        bank_account: yup.boolean().required(t('have bank account required')),
        savings_investment: yup.boolean().required(
            t('have savings investment required'),
        ),
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
        // validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            navigation.navigate('demographicDisease', {
                demographic: demographic,
                occupation: { ...values, savings_investment_amount: parseInt(values?.savings_investment_amount) }
            })
        },
    });
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={'Demographic'}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <Customdropdown
                    data={dropdownData?.['occupation'].map((item)=>{return {id: item?._id, label: item?.name, value:item?._id}})}
                    value={values.diet}
                    label={t('occupation')}
                    onChange={(value) => {
                        setValues({
                            ...values,
                            occupation: value?.value,
                        });
                    }}
                />
                {touched?.marital_status && errors?.marital_status && (
                    <Text style={Styles.error2}>{String(errors?.marital_status)}</Text>
                )}
                <Customdropdown
                    data={[{ id: 1, label: 'Single', value: 'Single' }, { id: 1, label: 'Married', value: 'Married' }]}
                    value={values.diet}
                    label={t('yearly income')}
                    onChange={(value) => {
                        setValues({
                            ...values,
                            yearly_income: value?.value,
                        });
                    }}
                />
                {touched?.diet && errors?.diet && (
                    <Text style={Styles.error2}>{String(errors?.diet)}</Text>
                )}
                <Text style={Styles.fieldLabel}>Do you have a bank account?</Text>
                <SwitchButton
                    firstBtnText='Yes'
                    firstBtnPress={() => setValues({ ...values, bank_account: true })}
                    selected={values?.bank_account}
                    secondBtntext='No'
                    secondBtnPress={() => setValues({ ...values, bank_account: false })}
                />
                <Text style={Styles.fieldLabel}>Do you have any savings/ investments?</Text>
                <SwitchButton
                    firstBtnText='Yes'
                    firstBtnPress={() => setValues({ ...values, savings_investment: true })}
                    selected={values?.savings_investment}
                    secondBtntext='No'
                    secondBtnPress={() => setValues({ ...values, savings_investment: false })}
                />
                <Input
                    label={'Can you specify the amount saved/invested ?'}
                    value={values.savings_investment_amount}
                    placeholder={'0'}
                    fullLength={true}
                    onChange={handleChange('savings_investment_amount')}
                    isRight={<AcresElement title={user?.currency} />}
                />
                {touched?.height && errors?.height && (
                    <Text style={Styles.error2}>{String(errors?.height)}</Text>
                )}
            </KeyboardAwareScrollView>
            <View style={Styles.bottomBtn}>
                <CustomButton btnText={'Next'} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
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
