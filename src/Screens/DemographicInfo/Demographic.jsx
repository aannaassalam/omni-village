import { ActivityIndicator, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React, { useEffect } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Customdropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useTranslation } from 'react-i18next';
import Input from '../../Components/Inputs/Input';
import AcresElement from '../../Components/ui/AcresElement';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { Styles } from '../../styles/globalStyles';
import { useQuery } from '@tanstack/react-query';
import { get_dropdown_data } from '../../functions/AuthScreens';
import { getDemographic } from '../../functions/demographic';
import { primaryColor } from '../../styles/colors';

const Demographic = ({ navigation, route }) => {
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const { member_id, demographic_id } = route.params
  const { data: dropdownData, isLoading: dropdown_loading } = useQuery({
    queryKey: ['dropdown_data'],
    queryFn: get_dropdown_data,
  })
  const {data: demographic_data, isLoading: demographic_loading} = useQuery({
    queryKey: ['demographic_data'],
    queryFn: ()=>getDemographic(demographic_id),
    enabled: !!demographic_id
  })
  const { t } = useTranslation()
  const scheme = yup.object().shape({
    marital_status: yup.string().required(t('marital status is required')),
    diet: yup.string().required(t('diet is required')),
    height: yup.number().required(t('height is required')),
    weight: yup.number().required(t('weight is required')),
    language_speak: yup.string().required(t('language speak is required')),
    language_read: yup.string().required(t('language read is required')),
    language_write: yup.string().required(t('language write is required')),
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
      marital_status: '',
      diet: '',
      height: '',
      weight: '',
      language_speak: '',
      language_read: '',
      language_write: '',
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
      navigation.navigate('demographicOccupation', {
        demographic: { ...values, height: parseInt(values?.height), weight: parseInt(values?.weight) },
        data: demographic_data,
        member_id,
        demographic_id
      })
    },
  });
  useEffect(()=>{
    resetForm({
      values:{
        marital_status: demographic_data?.marital_status,
        diet: demographic_data?.diet,
        height: demographic_data?.height,
        weight: demographic_data?.weight,
        language_speak: demographic_data?.language_speak,
        language_read: demographic_data?.language_read,
        language_write: demographic_data?.language_write,
      }
    })
  }, [demographic_data])
  if(dropdown_loading || demographic_loading){
    return <View style={{flex:1, justifyContent:'center', alignSelf:'center'}}>
      <ActivityIndicator size={'large'} color={primaryColor}/>
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
          data={dropdownData?.['marital_status'].map((item) => { return { label: item?.name, value: item?._id } })
          }
          value={values.marital_status}
          label={t('marital_status')}
          onChange={(value) => {
            setValues({
              ...values,
              marital_status: value?.value,
            });
          }}
        />
        {touched?.marital_status && errors?.marital_status && (
          <Text style={Styles.error2}>{String(errors?.marital_status)}</Text>
        )}
        <Customdropdown
          data={dropdownData?.['diet'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
          value={values.diet}
          label={t('diet')}
          onChange={(value) => {
            setValues({
              ...values,
              diet: value?.value,
            });
          }}
        />
        {touched?.diet && errors?.diet && (
          <Text style={Styles.error2}>{String(errors?.diet)}</Text>
        )}
        <Input
          label={t('height')}
          value={values.height}
          placeholder={'0'}
          fullLength={true}
          keyboardType='numeric'
          onChangeText={handleChange('height')}
          isRight={<AcresElement title={'Unit'} />}
        />
        {touched?.height && errors?.height && (
          <Text style={Styles.error2}>{String(errors?.height)}</Text>
        )}
        <Input
          label={t('weight')}
          value={values.weight}
          placeholder={'0'}
          fullLength={true}
          keyboardType='numeric'
          onChangeText={handleChange('weight')}
          isRight={<AcresElement title={'Unit'} />}
        />
        {touched?.weight && errors?.weight && (
          <Text style={Styles.error2}>{String(errors?.weight)}</Text>
        )}
        <Customdropdown
          data={dropdownData?.['language'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
          value={values.language_speak}
          label={t('which language can you speak?')}
          onChange={(value) => {
            setValues({
              ...values,
              language_speak: value?.value,
            });
          }}
        />
        {touched?.language_speak && errors?.language_speak && (
          <Text style={Styles.error2}>{String(errors?.language_speak)}</Text>
        )}
        <Customdropdown
          data={dropdownData?.['language'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
          value={values.language_read}
          label={t('which language can you read?')}
          onChange={(value) => {
            setValues({
              ...values,
              language_read: value?.value,
            });
          }}
        />
        {touched?.language_read && errors?.language_read && (
          <Text style={Styles.error2}>{String(errors?.language_read)}</Text>
        )}
        <Customdropdown
          data={dropdownData?.['language'].map((item) => { return { id: item?._id, label: item?.name, value: item?._id } })}
          value={values.language_write}
          label={t('which language can you write?')}
          onChange={(value) => {
            setValues({
              ...values,
              language_write: value?.value,
            });
          }}
        />
        {touched?.language_write && errors?.language_write && (
          <Text style={Styles.error2}>{String(errors?.language_write)}</Text>
        )}
      </KeyboardAwareScrollView>
      <View style={Styles.bottomBtn}>
        <CustomButton btnText={t('next')} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default Demographic;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
