import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Styles, width } from '../../styles/globalStyles'
import { Divider } from 'react-native-paper'
import * as yup from 'yup';
import { useFormik } from 'formik';
import CustomButton from '../../Components/CustomButton/CustomButton'
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown'
import { borderColor } from '../../styles/colors'
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown'

const HouseholdRequirement = ({ navigation, route }) => {
    const { t } = useTranslation()
    const { house, housingData, housingPhoto } = route.params
    const [houseDetails, setHouseDetails] = useState(true)
    const scheme = yup.object().shape({
        equipment: yup.string().required(t('Equipment is required')),
        furnishing: yup.string().required(t('Furnishing is required')),
        renovation_requirement: yup.boolean(),
        renovation_urgency: yup.string(),
        expansion_requirement: yup.boolean(),
        expansion_urgency: yup.string()
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
            equipment: '',
            furnishing: '',
            renovation_requirement: false,
            renovation_urgency: '',
            expansion_requirement: false,
            expansion_urgency: '',
        },
        // validationSchema: scheme,
        onSubmit: async values => {
            console.log(values)
        },
    });
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={`${t('housing')} (${house})`}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Household Requirements')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '45%' }]}
                        horizontalInset={true}
                    />
                    <TouchableOpacity onPress={() => setHouseDetails(!houseDetails)}>
                        {houseDetails ? (
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
                {houseDetails ? <>
                    <MultiselectDropdown
                        containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                        data={[
                            { key: 'Cricket', name: 'Cricket' },
                            { key: 'Football', name: 'Football' },
                            { key: 'Basketball', name: 'Basketball' },
                            { key: 'Hockey', name: 'Hockey' },
                        ]}
                        setSelectedd={item => {
                            setValues({
                                ...values,
                                equipment: item,
                            });
                        }}
                        selectedd={values.equipment}
                        infoName={t('Equipment')}
                    />
                    {touched?.equipment && errors?.equipment && (
                        <Text style={Styles.error2}>{String(errors?.equipment)}</Text>
                    )}
                    <MultiselectDropdown
                        containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                        data={[
                            { key: 'Cricket', name: 'Cricket' },
                            { key: 'Football', name: 'Football' },
                            { key: 'Basketball', name: 'Basketball' },
                            { key: 'Hockey', name: 'Hockey' },
                        ]}
                        setSelectedd={item => {
                            setValues({
                                ...values,
                                furnishing: item,
                            });
                        }}
                        selectedd={values.furnishing}
                        infoName={t('Furnishing')}
                    />
                    {touched?.furnishing && errors?.furnishing && (
                        <Text style={Styles.error2}>{String(errors?.furnishing)}</Text>
                    )}
                    <CustomDropdown
                        data={[{ label: 'Yes', value: true },{ label: 'No', value: false}]}
                        value={values.renovation_requirement}
                        label={t('Renovation requirement')}
                        onChange={(value) => {
                            setValues({
                                ...values,
                                renovation_requirement: value?.value,
                            });
                        }}
                    />
                    {touched?.renovation_requirement && errors?.renovation_requirement && (
                        <Text style={Styles.error2}>{String(errors?.renovation_requirement)}</Text>
                    )}
                    {values?.renovation_requirement && (    
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <CustomDropdown
                                data={[{ label: 'Month', value: '1' }]}
                                value={values.renovation_urgency}
                                label={t('Urgenncy')}
                                onChange={(value) => {
                                    setValues({
                                        ...values,
                                        renovation_urgency: value?.value,
                                    });
                                }}
                            />
                                {touched?.renovation_urgency && errors?.renovation_urgency && (
                                    <Text style={Styles.error2}>{String(errors?.renovation_urgency)}</Text>
                            )}
                        </View>
                    </View>
                    )}
                    <CustomDropdown
                        data={[{ label: 'Yes', value: true }, { label: 'No', value: false }]}
                        value={values.expansion_requirement}
                        label={t('Expansion requirement')}
                        onChange={(value) => {
                            setValues({
                                ...values,
                                expansion_requirement: value?.value,
                            });
                        }}
                    />
                    {touched?.expansion_requirement && errors?.expansion_requirement && (
                        <Text style={Styles.error2}>{String(errors?.expansion_requirement)}</Text>
                    )}
                    {values?.expansion_requirement && (
                        <View style={styles.innerInputView}>
                            <Divider style={styles.divider2} />
                            <View style={{ width: '100%' }}>
                                <CustomDropdown
                                    data={[{ label: 'Month', value: '1' }]}
                                    value={values.expansion_urgency}
                                    label={t('Urgenncy')}
                                    onChange={(value) => {
                                        setValues({
                                            ...values,
                                            expansion_urgency: value?.value,
                                        });
                                    }}
                                />
                                {touched?.expansion_urgency && errors?.expansion_urgency && (
                                    <Text style={Styles.error2}>{String(errors?.expansion_urgency)}</Text>
                                )}
                            </View>
                        </View>
                    )}
                </> : null}
            </KeyboardAwareScrollView>
            <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <CustomButton btnText={t('submit')} style={{ width: '48%', height: 60 }} onPress={handleSubmit} />
                <CustomButton btnText={t('save as draft')} style={{ width: '48%', height: 60, backgroundColor: borderColor }} onPress={() => { }} btnStyle={{ color: 'black' }} />
            </View>
        </View>
    )
}

export default HouseholdRequirement

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