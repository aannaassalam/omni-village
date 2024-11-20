import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'
import * as yup from 'yup';
import { useFormik } from 'formik';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, width } from '../../styles/globalStyles';
import Input from '../../Components/Inputs/Input';
import { ActivityIndicator, Divider } from 'react-native-paper';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useUser } from '../../Hooks/useUser';
import AcresElement from '../../Components/ui/AcresElement';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { primaryColor } from '../../styles/colors';
import { getBusiness, getBusinessDropdown } from '../../functions/business';
import { useQuery } from '@tanstack/react-query';

const BusinessEmployee = ({ navigation, route }) => {
    const { businessName, name, id } = route.params;
    const { t } = useTranslation()
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
        total_employee: yup.number().required(t('Total employee is required')).test(
            'coworkers-check',
            t('Total coworkers inside and outside the village should not exceed total employees.'),
            function (value) {
                const { coworker_inside_village, coworker_outside_village } = this.parent;
                return (
                    coworker_inside_village + coworker_outside_village <= value
                );
            }
        ),
        coworker_inside_village: yup.number().required(t('Co worker inside village is required')),
        coworker_outside_village: yup.number().required(t('Co worker outside village is required')),
        legal_structure: yup.string().required(t('Legal structure is required')),
        annual_turnover: yup.number().required(t('Annual turnover is required')),
        made_profit: yup.boolean(),
        total_profit: yup.number(),
        total_loss: yup.number()
    })
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
            total_employee: '',
            coworker_inside_village: '',
            coworker_outside_village: '',
            legal_structure: '',
            annual_turnover: '',
            made_profit: false,
            total_profit: '',
            total_loss: ''
        },
        validationSchema: scheme,
        onSubmit: async values => {
            console.log(values);
            let new_data = {
                total_employee: parseInt(values.total_employee),
                coworker_inside_village: parseInt(values.coworker_inside_village),
                coworker_outside_village: parseInt(values.coworker_outside_village),
                legal_structure: values.legal_structure,
                annual_turnover: parseInt(values.annual_turnover),
                made_profit: values.made_profit,
                total_profit: parseInt(values.total_profit),
                total_loss: parseInt(values.total_loss)
            }
            navigation.navigate('businessInvestment', { businessEmployee: new_data, businessName: businessName, id: id, name })
        },
    });
    useEffect(() => {
        resetForm({
            values: {
                total_employee: String(business?.total_employee || '') || '',
                coworker_inside_village: String(business?.coworker_inside_village || '') || '',
                coworker_outside_village: String(business?.coworker_outside_village || '') ||
                    '',
                legal_structure: business?.legal_structure || '',
                annual_turnover: String(business?.annual_turnover || '') || '',
                made_profit: business?.made_profit || false,
                total_profit: String(business?.total_profit || '') || '',
                total_loss: String(business?.total_loss || '') || ''
            }
        })
    }, [business])
    if (isBusinessLoading || isLoading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <ActivityIndicator size={'large'} color={primaryColor} />
        </View>
    }
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
                        `Total employee`
                    )}
                    value={values?.total_employee}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={handleChange('total_employee')}
                />
                {errors.total_employee &&
                    errors.total_employee && (
                        <Text style={Styles.error2}>
                            {
                                errors.total_employee
                            }
                        </Text>
                    )}
                <View style={styles.innerInputView}>
                    <Divider style={styles.divider2} />
                    <View style={{ width: '100%' }}>
                        <Input
                            label={t(
                                `Coworkers within the village neighbourhood`
                            )}
                            value={values?.coworker_inside_village}
                            placeholder={'0'}
                            fullLength={true}
                            keyboardType="numeric"
                            onChangeText={handleChange('coworker_inside_village')}
                        />
                        {errors.coworker_inside_village &&
                            errors.coworker_inside_village && (
                                <Text style={Styles.error2}>
                                    {
                                        errors.coworker_inside_village
                                    }
                                </Text>
                            )}
                        <Input
                            label={t(
                                `Coworkers from outside`
                            )}
                            value={values?.coworker_outside_village}
                            placeholder={'0'}
                            fullLength={true}
                            keyboardType="numeric"
                            onChangeText={handleChange('coworker_outside_village')}
                        />
                        {errors.coworker_outside_village &&
                            errors.coworker_outside_village && (
                                <Text style={Styles.error2}>
                                    {
                                        errors.coworker_outside_village
                                    }
                                </Text>
                            )}
                    </View>
                </View>
                <CustomDropdown
                    data={
                        business_dropdown?.legal_structure.map((item) => {
                            return {
                                label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id
                            }
                        })
                        // [{ label: 'Pharmaceutical', value: '6736117ecb51156c2f52383e' }, { label: 'IT/Telecom', value: '6736117ecb51156c2f52683e' }]
                    }
                    value={values?.legal_structure}
                    label={t('Legal structure')}
                    onChange={value => {
                        setValues({
                            ...values,
                            legal_structure: value?.value,
                        });
                    }}
                />
                {touched?.legal_structure && errors?.legal_structure && (
                    <Text style={Styles.error2}>{String(errors?.legal_structure)}</Text>
                )}
                <Input
                    label={t(
                        `Annual Turnover`
                    )}
                    value={values?.annual_turnover}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={handleChange('annual_turnover')}
                    isRight={<AcresElement title={user?.currency} />}
                />
                {errors.annual_turnover &&
                    errors.annual_turnover && (
                        <Text style={Styles.error2}>
                            {
                                errors.annual_turnover
                            }
                        </Text>
                    )}
                <SwitchButton
                    nolabel={false}
                    label={t('Have you made profit from this business?')}
                    selected={values?.made_profit}
                    firstBtnPress={() => setValues({ ...values, made_profit: true, total_loss: '' })}
                    secondBtnPress={() => { setValues({ ...values, made_profit: false, total_profit: '' }) }}
                    firstBtnText={t('yes')}
                    secondBtntext={t('no')}
                />
                <View style={styles.innerInputView}>
                    <Divider style={styles.divider2} />
                    <View style={{ width: '100%' }}>
                        {values?.made_profit ?
                            <>
                                <Input
                                    label={t(
                                        `Total profit`
                                    )}
                                    value={values?.total_profit}
                                    placeholder={'0'}
                                    fullLength={true}
                                    keyboardType="numeric"
                                    onChangeText={handleChange('total_profit')}
                                    isRight={<AcresElement title={user?.currency} />}
                                />
                                {errors.total_profit &&
                                    errors.total_profit && (
                                        <Text style={Styles.error2}>
                                            {
                                                errors.total_profit
                                            }
                                        </Text>
                                    )}
                            </>
                            :
                            <>
                                <Input
                                    label={t(
                                        `Total loss`
                                    )}
                                    value={values?.total_loss}
                                    placeholder={'0'}
                                    fullLength={true}
                                    keyboardType="numeric"
                                    onChangeText={handleChange('total_loss')}
                                    isRight={<AcresElement title={user?.currency} />}
                                />
                                {errors.total_loss &&
                                    errors.total_loss && (
                                        <Text style={Styles.error2}>
                                            {
                                                errors.total_loss
                                            }
                                        </Text>
                                    )}
                            </>
                        }
                    </View>
                </View>
            </KeyboardAwareScrollView>
            <View style={Styles.bottomBtn}>
                <CustomButton btnText={t('next')} onPress={handleSubmit} style={{ width: '100%' }} />
            </View>
        </View>
    )
}

export default BusinessEmployee

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
})