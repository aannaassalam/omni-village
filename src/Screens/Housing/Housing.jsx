import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import ItemHeader from '../../Components/CustomHeader/ItemHeader';
import { Styles, width } from '../../styles/globalStyles';
import Input from '../../Components/Inputs/Input';
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput';
import { Divider } from 'react-native-paper';
import CustomButton from '../../Components/CustomButton/CustomButton';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';

const Housing = ({ navigation }) => {
    const { t } = useTranslation()
    const scheme = yup.object().shape({
        total_numbers_of_house: yup
            .number()
            .required(t('Total number of houses owned is required'))
            .max(20, 'Total number of houses owned cannot be greater than 20!')
            .min(1, 'At least one total number of houses owned is required'),
        house_requirements: yup.boolean().required(t('House requirements is required')),
        //  details_of_land: yup.array().of(
        //    yup.object().shape({
        //      land_located: yup.string().required('Land located is required'),
        //      total_land_area_owned: yup
        //        .number()
        //        .required('Total land area owned is required'),
        //      location: yup.string().required('Location is required'),
        //      area_utilised_for: yup
        //        .string()
        //        .required('Area utilised for is required'),
        //      total_land_area_utilised: yup
        //        .number()
        //        .required('Total land area utilised for is required'),
        //      area_under_utilised: yup
        //        .string()
        //        .required('Area under utilised is required'),
        //      total_land_area_under_utilised: yup
        //        .number()
        //        .required('Total area under utilised is required'),
        //      year_purchased: yup.number().required('Year purchased is required'),
        //    }),
        //  ),
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
            total_numbers_of_house: '',
            house_requirements: false,
            //  details_of_land: [],
        },
        validationSchema: scheme,
        onSubmit: async values => {
            console.log(values);
            navigation.navigate('houseSpecificationQuestioner', {
                total_numbers_of_house: values.total_numbers_of_house,
                house_requirements: values.house_requirements,
            })
        },
    });
    //  useEffect(() => {
    //    const totalLands = parseInt(values.total_numbers_of_lands || 0);
    //    const newDetailsOfLand = Array(totalLands)
    //      .fill()
    //      .map((_, index) => ({
    //        land_located: '',
    //        total_land_area_owned: '',
    //        location: '',
    //        area_utilised_for: '',
    //        total_land_area_utilised: '',
    //        area_under_utilised: '',
    //        total_land_area_under_utilised: '',
    //        year_purchased: '',
    //      }));

    //    setValues(prevValues => ({
    //      ...prevValues,
    //      details_of_land: newDetailsOfLand,
    //    }));
    //  }, [values.total_numbers_of_lands]);
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('housing')}
                goBack={() => navigation.goBack()}
            />
            <ItemHeader title={t('housing')} />
            <View style={styles.mainContainer}>
                <Input
                    label={t('Total number of houses owned')}
                    value={values.total_numbers_of_house}
                    placeholder={''}
                    fullLength={true}
                    keyboardType='numeric'
                    onChangeText={handleChange('total_numbers_of_house')}
                />
                {touched?.total_numbers_of_house && errors?.total_numbers_of_house && (
                    <Text style={Styles.error2}>{String(errors?.total_numbers_of_house)}</Text>
                )}
                <SwitchButton
                    nolabel={false}
                    label={t('Do have any more house requirements?')}
                    selected={values?.house_requirements}
                    firstBtnPress={() => setValues({ ...values, house_requirements: true })}
                    secondBtnPress={() => setValues({ ...values, house_requirements: false })}
                    firstBtnText={t('yes')}
                    secondBtntext={t('no')}
                />
                {touched?.house_requirements && errors?.house_requirements && (
                    <Text style={Styles.error2}>{String(errors?.house_requirements)}</Text>
                )}
            </View>
            <View style={Styles.bottomBtn}>
                <CustomButton
                    btnText={t('next')}
                    style={{ width: '100%' }}
                    onPress={handleSubmit}
                />
            </View>
        </View>
    )
}

export default Housing

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
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
});