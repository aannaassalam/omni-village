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

const OfficerCommunitySports = ({ navigation }) => {
  const { t } = useTranslation()
  const scheme = yup.object().shape({
    total_area_allocated_village: yup.string().required(t('Total area allocated village is required')),
    total_area_allocated_community: yup.number().required(t('Total area allocated community is required')),
    land_owned_by_non_resident: yup.number().required(t('Land owned by non resident is required')),
    freehold_village_land: yup.string().required(t('Freehold village land is required'))
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
      total_area_allocated_village: '',
      total_area_allocated_community: '',
      land_owned_by_non_resident: '',
      freehold_village_land: '',
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
      </KeyboardAwareScrollView>
      <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <CustomButton btnText={t('submit')} onPress={handleSubmit} style={{ width: '100%' }} />
      </View>
    </View>
  )
}

export default OfficerCommunitySports

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})