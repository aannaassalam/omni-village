import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator } from 'react-native-paper';
import { borderColor, primaryColor } from '../../../styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../Components/CustomHeader/CustomHeader';
import { Styles } from '../../../styles/globalStyles';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import PopupModal from '../../../Components/Popups/PopupModal';
import CustomDropdown from '../../../Components/CustomDropdown/CustomDropdown';
import MultiselectDropdown from '../../../Components/MultiselectDropdown/MultiselectDropdown';

const OfficerCommunity = ({ navigation }) => {
  const { t } = useTranslation()
  const scheme = yup.object().shape({
    education: yup.array().required(t('Education is required')).min(1,'Atleast one education is required'),
    town_hall: yup.number().required(t('Town hall is required')),
    market: yup.number().required(t('Market is required')),
    bank: yup.string().required(t('Bank is required')),
    health_care: yup.string().required(t('Health care is required')),
    library: yup.string().required(t('Library is required')),
    museum: yup.string().required(t('Museum is required')),
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
      education: [],
      town_hall: '',
      market: '',
      bank: '',
      health_care:'',
      library:'',
      museum:'',
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
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
        headerName={t(`landholding`)}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <MultiselectDropdown
          containerStyle={{ marginTop: '5%', paddingTop: 0 }}
          data={[{ key: '6736117ecb51156c2f52383e', name: 'test' }, { key: '6736117ecb51156c2f59383e', name: 'test2' }]}
          setSelectedd={(value) => setValues({ ...values, education: value })}
          selectedd={values?.education}
          infoName={t('Education')}
        />
        {touched?.education && errors?.education && (
          <Text style={Styles.error2}>{String(errors?.education)}</Text>
        )}
        <CustomDropdown
          data={
            [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]
          }
          value={values?.town_hall}
          label={t('Town hall')}
          onChange={value => {
            setValues({
              ...values,
              town_hall: value?.value,
            });
          }}
        />
        {touched?.town_hall && errors?.town_hall && (
          <Text style={Styles.error2}>{String(errors?.town_hall)}</Text>
        )}
      </KeyboardAwareScrollView>
      <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <CustomButton btnText={t('submit')}  onPress={handleSubmit} style={{width:'100%'}} />
      </View>
    </View>
  )
}

export default OfficerCommunity

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})