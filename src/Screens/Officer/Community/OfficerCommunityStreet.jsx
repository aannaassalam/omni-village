import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { borderColor, primaryColor } from '../../../styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../Components/CustomHeader/CustomHeader';
import { Styles } from '../../../styles/globalStyles';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import PopupModal from '../../../Components/Popups/PopupModal';
import CustomDropdown from '../../../Components/CustomDropdown/CustomDropdown';
import MultiselectDropdown from '../../../Components/MultiselectDropdown/MultiselectDropdown';
import Input from '../../../Components/Inputs/Input';

const OfficerCommunityStreet = ({ navigation, route }) => {
    const { t } = useTranslation()
    const { community, sports, village_id, data } = route.params
    const scheme = yup.object().shape({
        street_light: yup.boolean().required(t('Street light is required')),
        solar_electric: yup.string().required(t('Solar electric is required')),
        broadband_internet: yup.boolean().required(t('Broadband internet is required')),
        how_many_provider: yup.array().test(
            'provider-is-required',
            t('How many provider is required'),
            function (value) {
                const { broadband_internet } = this.parent;
                if (broadband_internet) {
                    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                        return value.length > 0;
                    }
                    return false;
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        methods_of_using: yup.array().test(
            'methods-of-using-is-required',
            t('Methods of using is required'),
            function (value) {
                const { broadband_internet } = this.parent;
                if (broadband_internet) {
                    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                        return value.length > 0;
                    }
                    return false;
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        bandwidth: yup.array().test(
            'bandwidth-is-required',
            t('Bandwidth is required'),
            function (value) {
                const { broadband_internet } = this.parent;
                if (broadband_internet) {
                    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                        return value.length > 0;
                    }
                    return false;
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        stability: yup.array().test(
            'stability-is-required',
            t('Stability is required'),
            function (value) {
                const { broadband_internet } = this.parent;
                if (broadband_internet) {
                    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                        return value.length > 0;
                    }
                    return false;
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }),
        burial_ground: yup.boolean().required(t('Burial ground is required')),
        how_far_from_village_burial_ground: yup.string().test(
            'burial_ground-required-if-safety-issues',
            t('How far from village is required'),
            function (value) {
                const { burial_ground } = this.parent;
                if (burial_ground) {
                    return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        animal_shelters: yup.boolean().required(t('Animal shelters is required')),
        how_far_from_village_animal_shelter: yup.string().test(
            'how_far_from_village_animal_shelter-required-if-safety-issues',
            t('How far from village is required'),
            function (value) {
                const { animal_shelters } = this.parent;
                if (animal_shelters) {
                    return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        animal_shelter_type: yup.array().test(
            'animal-shelter-type-is-required',
            t('Animal shelter type is required'),
            function (value) {
                const { animal_shelters } = this.parent;
                if (animal_shelters) {
                    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                        return value.length > 0;
                    }
                    return false;
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        parking: yup.boolean().required(t('Parking is required')),
        capacity: yup.string().test(
            'spiritual-retreats-required-if-safety-issues',
            t('How far from village is required'),
            function (value) {
                const { parking } = this.parent;
                if (parking) {
                    return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
                }
                return true; // Pass validation if safety_issues_on_roads is false
            }
        ),
        children_playground: yup.boolean().required(t('Children playground is required')),
        children_playground_type: yup.array().test(
            'children-playground-type-is-required',
            t('Children playground type is required'),
            function (value) {
                const { children_playground } = this.parent;
                if (children_playground) {
                    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                    return value.length > 0;
                    }
                    return false;
                }
                return true;
            }
        ),
        senile_center: yup.boolean().required(t('Senile center is required')),
        senile_center_type: yup.array().test(
            'senile-center-type-is-required',
            t('Senile center type is required'),
            function (value) {
                const { senile_center } = this.parent;
                if (senile_center) {
                    if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
                    return value.length > 0;
                    }
                    return false;
                }
                return true;
            }
        )
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
            street_light: false,
            solar_electric: '',
            broadband_internet: false,
            how_many_provider: [],
            methods_of_using: [],
            bandwidth: [],
            stability: [],
            burial_ground: false,
            how_far_from_village_burial_ground: '',
            animal_shelters: false,
            how_far_from_village_animal_shelter: '',
            animal_shelter_type: [],
            parking: false,
            capacity: '',
            children_playground: false,
            children_playground_type: [],
            senile_center: false,
            senile_center_type: [],
        },
        validationSchema: scheme,
        onSubmit: async (values) => {
            console.log(values);
            navigation.navigate('officerCommunityMobility', { community, sports, street: values, village_id, data })
        },

    });
    // if (isTypeLoading || isLoading) {
    //   return (
    //     <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
    //       <ActivityIndicator size={'large'} color={primaryColor} />
    //     </View>
    //   );
    // }
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t(`community`)}
                goBack={() => navigation.goBack()}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.street_light}
                    label={t('Street Lights')}
                    onChange={value => {
                        setValues({
                            ...values,
                            street_light: value?.value,
                        });
                    }}
                />
                {touched?.street_light && errors?.street_light && (
                    <Text style={Styles.error2}>{String(errors?.street_light)}</Text>
                )}
                {values?.street_light &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <CustomDropdown
                                data={
                                    [{ label: 'Solar', value: '6736117ecb51156c2f52383e' }, { label: 'Electric', value: '6736117ecb51155c2f52383e' }]
                                }
                                value={values?.solar_electric}
                                label={t('Solar or Electric')}
                                onChange={value => {
                                    setValues({
                                        ...values,
                                        solar_electric: value?.value,
                                    });
                                }}
                            />
                            {errors.solar_electric &&
                                touched.solar_electric && (
                                    <Text style={Styles.error2}>
                                        {
                                        errors.solar_electric
                                        }
                                    </Text>
                                )}
                        </View>
                    </View>
                }
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.broadband_internet}
                    label={t('Broadband Internet')}
                    onChange={value => {
                        setValues({
                            ...values,
                            broadband_internet: value?.value,
                        });
                    }}
                />
                {touched?.broadband_internet && errors?.broadband_internet && (
                    <Text style={Styles.error2}>{String(errors?.broadband_internet)}</Text>
                )}
                {values?.broadband_internet &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={[
                                    {
                                        key: '6736117ecb51156c2f52383e',
                                        name: 'Tank'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52583e',
                                        name: 'Tank1'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52323e',
                                        name: 'Tank2'
                                    },
                                ]}
                                setSelectedd={(value) => {
                                    setValues({ ...values, how_many_provider: value });
                                }}
                                selectedd={values?.how_many_provider}
                                infoName={t('How many providers ?')}
                            />
                            {errors.how_many_provider &&
                                touched.how_many_provider && (
                                    <Text style={Styles.error2}>
                                        {
                                        errors.how_many_provider
                                        }
                                    </Text>
                                )}
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={[
                                    {
                                        key: '6736117ecb51156c2f52383e',
                                        name: 'Wifi'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52583e',
                                        name: 'Wired'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52323e',
                                        name: 'Satellite'
                                    },
                                ]}
                                setSelectedd={(value) => {
                                    setValues({ ...values, methods_of_using: value });
                                }}
                                selectedd={values?.methods_of_using}
                                infoName={t('Method of using')}
                            />
                            {errors.methods_of_using &&
                                touched.methods_of_using && (
                                    <Text style={Styles.error2}>
                                        {
                                        errors.methods_of_using
                                        }
                                    </Text>
                                )}
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={[
                                    {
                                        key: '6736117ecb51156c2f52383e',
                                        name: 'Tank'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52583e',
                                        name: 'Tank1'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52323e',
                                        name: 'Tank2'
                                    },
                                ]}
                                setSelectedd={(value) => {
                                    setValues({ ...values, bandwidth: value });
                                }}
                                selectedd={values?.bandwidth}
                                infoName={t('Bandwidth')}
                            />
                            {errors.bandwidth &&
                                touched.bandwidth && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.bandwidth
                                        }
                                    </Text>
                                )}
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={[
                                    {
                                        key: '6736117ecb51156c2f52383e',
                                        name: 'Tank'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52583e',
                                        name: 'Tank1'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52323e',
                                        name: 'Tank2'
                                    },
                                ]}
                                setSelectedd={(value) => {
                                    setValues({ ...values, stability: value });
                                }}
                                selectedd={values?.stability}
                                infoName={t('Stability')}
                            />
                            {errors.stability &&
                                touched.stability && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.stability
                                        }
                                    </Text>
                                )}
                        </View>
                    </View>
                }
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.burial_ground}
                    label={t('Burial ground')}
                    onChange={value => {
                        setValues({
                            ...values,
                            burial_ground: value?.value,
                        });
                    }}
                />
                {touched?.burial_ground && errors?.burial_ground && (
                    <Text style={Styles.error2}>{String(errors?.burial_ground)}</Text>
                )}
                {values?.burial_ground &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <CustomDropdown
                                data={
                                    [{ label: '1 Kilometer', value: '6736117ecb51156c2f52383e' }, { label: '2 Kilometer', value: '6736117ecb51155c2f52383e' }]
                                }
                                value={values?.how_far_from_village_burial_ground}
                                label={t('How far from village')}
                                onChange={value => {
                                    setValues({
                                        ...values,
                                        how_far_from_village_burial_ground: value?.value,
                                    });
                                }}
                            />
                            {errors.how_far_from_village_burial_ground &&
                                touched.how_far_from_village_burial_ground && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.how_far_from_village_burial_ground
                                        }
                                    </Text>
                                )}
                        </View>
                    </View>
                }
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.animal_shelters}
                    label={t('Animal shelters')}
                    onChange={value => {
                        setValues({
                            ...values,
                            animal_shelters: value?.value,
                        });
                    }}
                />
                {touched?.animal_shelters && errors?.animal_shelters && (
                    <Text style={Styles.error2}>{String(errors?.animal_shelters)}</Text>
                )}
                {values?.animal_shelters &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <CustomDropdown
                                data={
                                    [{ label: '1 Kilometer', value: '6736117ecb51156c2f52383e' }, { label: '2 Kilometer', value: '6736117ecb51155c2f52383e' }]
                                }
                                value={values?.how_far_from_village_animal_shelter}
                                label={t('How far from village')}
                                onChange={value => {
                                    setValues({
                                        ...values,
                                        how_far_from_village_animal_shelter: value?.value,
                                    });
                                }}
                            />
                            {errors.how_far_from_village_animal_shelter &&
                                touched.how_far_from_village_animal_shelter && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.how_far_from_village_animal_shelter
                                        }
                                    </Text>
                                )}
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={[
                                    {
                                        key: '6736117ecb51156c2f52383e',
                                        name: 'Tank'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52583e',
                                        name: 'Tank1'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52323e',
                                        name: 'Tank2'
                                    },
                                ]}
                                setSelectedd={(value) => {
                                    setValues({ ...values, animal_shelter_type: value });
                                }}
                                selectedd={values?.animal_shelter_type}
                                infoName={t('Type')}
                            />
                            {errors.animal_shelter_type &&
                                touched.animal_shelter_type && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.animal_shelter_type
                                        }
                                    </Text>
                                )}
                        </View>
                    </View>
                }
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.parking}
                    label={t('Parking')}
                    onChange={value => {
                        setValues({
                            ...values,
                            parking: value?.value,
                        });
                    }}
                />
                {touched?.parking && errors?.parking && (
                    <Text style={Styles.error2}>{String(errors?.parking)}</Text>
                )}
                {values?.parking &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <CustomDropdown
                                data={
                                    [{ label: '1 kg', value: '6736117ecb51156c2f52383e' }, { label: '2 kg', value: '6736117ecb51155c2f52383e' }]
                                }
                                value={values?.capacity}
                                label={t('Capacity')}
                                onChange={value => {
                                    setValues({
                                        ...values,
                                        capacity: value?.value,
                                    });
                                }}
                            />
                            {errors.capacity &&
                                touched.capacity && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.capacity
                                        }
                                    </Text>
                                )}
                        </View>
                    </View>
                }
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.children_playground}
                    label={t('Children Playground')}
                    onChange={value => {
                        setValues({
                            ...values,
                            children_playground: value?.value,
                        });
                    }}
                />
                {touched?.children_playground && errors?.children_playground && (
                    <Text style={Styles.error2}>{String(errors?.children_playground)}</Text>
                )}
                {values?.children_playground &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={[
                                    {
                                        key: '6736117ecb51156c2f52383e',
                                        name: 'Tank'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52583e',
                                        name: 'Tank1'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52323e',
                                        name: 'Tank2'
                                    },
                                ]}
                                setSelectedd={(value) => {
                                    setValues({ ...values, children_playground_type: value });
                                }}
                                selectedd={values?.children_playground_type}
                                infoName={t('Type')}
                            />
                            {errors.children_playground_type &&
                                touched.children_playground_type && (
                                    <Text style={Styles.error2}>
                                        {
                                        errors.children_playground_type
                                        }
                                    </Text>
                                )}
                        </View>
                    </View>
                }
                <CustomDropdown
                    data={
                        [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                    }
                    value={values?.senile_center}
                    label={t('Senile centre')}
                    onChange={value => {
                        setValues({
                            ...values,
                            senile_center: value?.value,
                        });
                    }}
                />
                {touched?.senile_center && errors?.senile_center && (
                    <Text style={Styles.error2}>{String(errors?.senile_center)}</Text>
                )}
                {values?.senile_center &&
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                                data={[
                                    {
                                        key: '6736117ecb51156c2f52383e',
                                        name: 'Tank'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52583e',
                                        name: 'Tank1'
                                    },
                                    {
                                        key: '6736117ecb51156c2f52323e',
                                        name: 'Tank2'
                                    },
                                ]}
                                setSelectedd={(value) => {
                                    setValues({ ...values, senile_center_type: value });
                                }}
                                selectedd={values?.senile_center_type}
                                infoName={t('Type')}
                            />
                            {errors.senile_center_type &&
                                touched.senile_center_type && (
                                    <Text style={Styles.error2}>
                                        {
                                            errors.senile_center_type
                                        }
                                    </Text>
                                )}
                        </View>
                    </View>
                }
            </KeyboardAwareScrollView>
            <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
                <CustomButton btnText={t('next')} onPress={handleSubmit} style={{ width: '100%' }} />
            </View>
        </View>
    )
}

export default OfficerCommunityStreet

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    innerInputView: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginBottom: '5%',
        gap: 12,
        paddingHorizontal: 12,
    },
    divider2: {
        alignSelf: 'flex-start',
        height: '100%',
        marginTop: 9,
        width: '1%',
        borderRadius: 10,
    },
})