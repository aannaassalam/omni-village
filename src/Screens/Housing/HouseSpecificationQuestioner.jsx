import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'
import { Styles, width } from '../../styles/globalStyles'
import { Divider } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import * as yup from 'yup';
import { useFormik } from 'formik';

const HouseSpecificationQuestioner = ({ navigation, route }) => {
    const { t } = useTranslation()
    const { total_numbers_of_house, house_requirements } = route.params
    const [value, setValue] = useState('')
    const scheme = yup.object().shape({
         house_names: yup.array().of(
           yup.object().shape({
             name: yup.string().required(t('Name is required')),
           }),
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
        setValues,
    } = useFormik({
        initialValues: {
             house_names: [],
        },
        validationSchema: scheme,
        onSubmit: async values => {
            console.log(values);
        },
    });
     useEffect(() => {
         const totalLands = parseInt(total_numbers_of_house || 0);
       const newDetailsOfLand = Array(totalLands)
         .fill()
         .map((_, index) => ({
           name: `${t("House")} ${index + 1}`,
         }));

       setValues(prevValues => ({
         ...prevValues,
         house_names: newDetailsOfLand,
       }));
     }, [total_numbers_of_house]);
    const handleFieldChange = (index, field, value) => {
        const newDetailsOfLand = [...values.house_names];
        newDetailsOfLand[index][field] = value;
        setValues({ ...values, house_names: newDetailsOfLand });
    };
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('landholding')}
                goBack={() => navigation.goBack()}
            />
            <ScrollView>

                {total_numbers_of_house > 0 ?
                    <View style={styles.subArea}>
                        <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Fill in details for')}</Text>
                        <Divider
                            bold={true}
                            style={[styles.divider, { width: '65%' }]}
                            horizontalInset={true}
                        />
                    </View>
                    : null
                }
                <View style={styles.mainContainer}>
                    {/* {Array.from({ length: total_numbers_of_house }, (_, index) => { */}
                    {values.house_names.map((item, index) => {
                        return <CustomShowcaseInput
                            key={index}
                            input={true}
                            setInputValue={(e) => {
                                handleFieldChange(index, 'name', e)
                            }}
                            inputValue={item.name}
                            productionName={`${t('House')} ${index + 1}`}
                            style={{ width: '100%' }}
                            progressBar={false}
                            onPress={() => {
                                navigation.navigate('housingDetails', { house: item?.name , data: [] })
                                // console.log("valyesssss", values)
                            }}
                        />
                    })}
                    {house_requirements ?
                        <CustomShowcaseInput
                            key={1}
                            productionName={t(`House Requirements`)}
                            style={{ width: '100%', }}
                            progressBar={false}
                            onPress={() => {
                                navigation.navigate('housingRequirement', { data: [] })
                            }}
                        />
                        : null
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default HouseSpecificationQuestioner

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
})