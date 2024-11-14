import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import ItemHeader from '../../Components/CustomHeader/ItemHeader';
import { Styles, width } from '../../styles/globalStyles';
import Input from '../../Components/Inputs/Input';
import CustomButton from '../../Components/CustomButton/CustomButton';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';
import { addLandholdingByUser } from '../../functions/landholding';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useUser } from '../../Hooks/useUser';

const LandholdingTotalLand = ({ navigation }) => {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const {data: user} = useUser()
  const { mutate: add_landholding_by_user } = useMutation({
    mutationKey: ['add_landholding_by_user'],
    mutationFn: async (data) => {
      addLandholdingByUser(data)
      queryClient.invalidateQueries()
    },
    onSuccess: (data) => {
      console.log("successsssss save", data)
      navigation.navigate('landSpecificationQuestioner')
    },
    onError: (error) => console.log("error save", error),
    onSettled: () => { }
  })
  const scheme = yup.object().shape({
    total_numbers_of_lands: yup
      .number()
      .required(t('Total number of lands owned is required'))
      .max(20, 'Total number of lands owned cannot be greater than 20!')
      .min(1, 'At least one total number of lands owned is required'),
      land_requirements: yup.boolean().required(t('Land requirements is required')),
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
      total_numbers_of_lands: '',
      land_requirements: false,
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      let new_data = {
        total_numbers_of_lands: parseInt(values.total_numbers_of_lands),
        land_requirements: values.land_requirements
       }
      add_landholding_by_user(new_data)
    },
  });
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t('landholding')}
        goBack={() => navigation.goBack()}
      />
      <ItemHeader title={t('landholding')} />
      <View style={styles.mainContainer}>
        <Input
          label={t('Total number of lands owned')}
          value={values.total_numbers_of_lands}
          placeholder={''}
          fullLength={true}
          keyboardType='numeric'
          onChangeText={handleChange('total_numbers_of_lands')}
        />
        {touched?.total_numbers_of_lands && errors?.total_numbers_of_lands && (
          <Text style={Styles.error2}>{String(errors?.total_numbers_of_lands)}</Text>
        )}
        <SwitchButton
        nolabel={false}
        label={t('Do have any more land requirements?')}
        selected={values?.land_requirements}
        firstBtnPress={()=> setValues({...values, land_requirements: true})}
        secondBtnPress={()=> setValues({...values, land_requirements: false})}
        firstBtnText={t('yes')}
        secondBtntext={t('no')}
        />
        {touched?.land_requirements && errors?.land_requirements && (
          <Text style={Styles.error2}>{String(errors?.land_requirements)}</Text>
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

export default LandholdingTotalLand

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