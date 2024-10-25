import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native';
import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Customdropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useTranslation } from 'react-i18next';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { Styles, width } from '../../styles/globalStyles';
import Input from '../../Components/Inputs/Input';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import { Divider } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { get_dropdown_data } from '../../functions/AuthScreens';

const DemographicAspiration = ({ navigation, route }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const { demographic, occupation , disease, habits} = route.params
    const { t } = useTranslation()
    const [aspiration,setAspiration]=useState(true)
    const { data: dropdownData } = useQuery({
        queryKey: ['dropdown_data'],
        queryFn: get_dropdown_data,
        refetchOnWindowFocus: true,
    })
    const scheme = yup.object().shape({
        economic: yup.array().required('Economic is required').min(1,'Atleast one economic aspiration is required'),
        educational: yup.array().required('Educational is required').min(1,'Atleast one educational aspiration is required'),
        health_well_being: yup.array().required('Health and well-being is required').min(1,'Atleast one health and well-being aspiration is required'),
        infrastructure_technology: yup.array().required('Infrastructure and technology is required').min(1,'Atleast one infrastructure and technology aspiration is required'),
        environmental_sustainability: yup.array().required('Environmental sustainability is required').min(1,'Atleast one environmental sustainability aspiration is required'),
        cultural: yup.array().required('Cultural is required').min(1,'Atleast one cultural aspiration is required'),
        community_social: yup.array().required('Community and social is required').min(1,'Atleast one community and social aspiration is required'),
        personal_growth: yup.array().required('Personal growth is required').min(1,'Atleast one personal growth aspiration is required'),
        spiritual: yup.array().required('Spiritual is required').min(1,'Atleast one spiritual aspiration is required'),
      
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
            economic: [],
            educational: [],
            health_well_being: [],
            infrastructure_technology: [],
            environmental_sustainability: [],
            cultural: [],
            community_social: [],
            personal_growth: [],
            spiritual: []
        },
        // validationSchema: schema,
        onSubmit: async (values) => {
            console.log(values);
            navigation.navigate('demographicUnfulfilled',{
                occupation,
                disease,
                habits,
                demographic,
                aspiration: values
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
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>Aspiration</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '55%' }]}
                        horizontalInset={true}
                    />
                    <TouchableOpacity onPress={() => setAspiration(!aspiration)}>
                        {aspiration ? (
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
                {aspiration ?
                    <View style={styles.innerInputView}>
                        <Divider style={styles.divider2} />
                        <View style={{ width: '100%' }}>
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['economic_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, economic: item })
                                }
                                selectedd={values?.economic}
                                infoName={'Economic aspirations'}
                            />
                            {touched?.economic && errors?.economic && (
                                <Text style={Styles.error2}>{String(errors?.economic)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['educational_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, educational: item })
                                }
                                selectedd={values?.educational}
                                infoName={'Educational aspirations'}
                            />
                            {touched?.educational && errors?.educational && (
                                <Text style={Styles.error2}>{String(errors?.educational)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['health_and_wellbeing_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, health_well_being: item })
                                }
                                selectedd={values?.health_well_being}
                                infoName={'Health & well-being aspirations'}
                            />
                            {touched?.health_well_being && errors?.health_well_being && (
                                <Text style={Styles.error2}>{String(errors?.health_well_being)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['infrastructure_and_technology_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, infrastructure_technology: item })
                                }
                                selectedd={values?.infrastructure_technology}
                                infoName={'Infrastructure & Technology aspirations'}
                            />
                            {touched?.infrastructure_technology && errors?.infrastructure_technology && (
                                <Text style={Styles.error2}>{String(errors?.infrastructure_technology)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['environmental_and_sustainability_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, environmental_sustainability: item })
                                }
                                selectedd={values?.environmental_sustainability}
                                infoName={'Environmemtal sustainability aspirations'}
                            />
                            {touched?.environmental_sustainability && errors?.environmental_sustainability && (
                                <Text style={Styles.error2}>{String(errors?.environmental_sustainability)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['cultural_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, cultural: item })
                                }
                                selectedd={values?.cultural}
                                infoName={'Cultural aspirations'}
                            />
                            {touched?.cultural && errors?.cultural && (
                                <Text style={Styles.error2}>{String(errors?.cultural)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['community_and_social_aspirations'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, community_social: item })
                                }
                                selectedd={values?.community_social}
                                infoName={'Community social aspirations'}
                            />
                            {touched?.community_social && errors?.community_social && (
                                <Text style={Styles.error2}>{String(errors?.community_social)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['aspiration_for_personal_growth'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, personal_growth: item })
                                }
                                selectedd={values?.personal_growth}
                                infoName={'Personal growth aspirations'}
                            />
                            {touched?.personal_growth && errors?.personal_growth && (
                                <Text style={Styles.error2}>{String(errors?.personal_growth)}</Text>
                            )}
                            <MultiselectDropdown
                                containerStyle={{
                                    marginTop: '5%',
                                    paddingTop: 0,
                                }}
                                data={dropdownData?.['spiritual_aspiration'].map((item) => { return { name: item?.name, key: item?._id } })}
                                setSelectedd={(item) =>
                                    setValues({ ...values, spiritual: item })
                                }
                                selectedd={values?.spiritual}
                                infoName={'Spiritual aspirations'}
                            />
                            {touched?.spiritual && errors?.spiritual && (
                                <Text style={Styles.error2}>{String(errors?.spiritual)}</Text>
                            )}
                           
                        </View>
                    </View>
                    : null
                }
            </KeyboardAwareScrollView>
            <View style={Styles.bottomBtn}>
                <CustomButton btnText={'Next'} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
            </View>
        </View>
    );
};

export default DemographicAspiration;

const makeStyles = fontScale =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
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
    });
