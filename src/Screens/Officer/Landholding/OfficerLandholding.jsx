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
import AcresElement from '../../../Components/ui/AcresElement';
import Input from '../../../Components/Inputs/Input';

const OfficerLandholding = ({navigation}) => {
  const { t } = useTranslation()
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const scheme = yup.object().shape({
    total_area_allocated_village: yup.string().required(t('Total area allocated village is required')),
    total_area_allocated_community: yup.string().required(t('Total area allocated community is required')),
    land_owned_by_non_resident: yup.string().required(t('Land owned by non resident is required')),
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
      setSavepopup(true)
    },

  });
  const onSubmit = () =>{}
  const handleDraft = () =>{}
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
        <Input
          label={t(
            `Total area allocated to the village`
          )}
          value={values?.total_area_allocated_village}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('total_area_allocated_village')}
          // isRight={
          //   <AcresElement title={'Kms'} />
          // }
        />
        {errors.total_area_allocated_village &&
          errors.total_area_allocated_village && (
            <Text style={Styles.error2}>
              {
              errors.total_area_allocated_village
              }
            </Text>
          )}
        <Input
          label={t(
            `Total area allocated for community infrastructure including mobility`
          )}
          value={values?.total_area_allocated_community}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('total_area_allocated_community')}
        // isRight={
        //   <AcresElement title={'Kms'} />
        // }
        />
        {errors.total_area_allocated_community &&
          errors.total_area_allocated_community && (
            <Text style={Styles.error2}>
              {
              errors.total_area_allocated_community
              }
            </Text>
          )}
        <Input
          label={t(
            `Land owned by non residents`
          )}
          value={values?.land_owned_by_non_resident}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('land_owned_by_non_resident')}
        // isRight={
        //   <AcresElement title={'Kms'} />
        // }
        />
        {errors.land_owned_by_non_resident &&
          errors.land_owned_by_non_resident && (
            <Text style={Styles.error2}>
              {
              errors.land_owned_by_non_resident
              }
            </Text>
          )}
        <Input
          label={t(
            `Freehold Village Land`
          )}
          value={values?.freehold_village_land}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('freehold_village_land')}
        // isRight={
        //   <AcresElement title={'Kms'} />
        // }
        />
        {errors.freehold_village_land &&
          errors.freehold_village_land && (
            <Text style={Styles.error2}>
              {
              errors.freehold_village_land
              }
            </Text>
          )}
          </KeyboardAwareScrollView>
      <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <CustomButton btnText={t('submit')} style={{ width: '48%', height: 60 }} onPress={handleSubmit} />
        <CustomButton btnText={t('save as draft')} style={{ width: '48%', height: 60, backgroundColor: borderColor }} onPress={() => { setDraftpopup(true) }} btnStyle={{ color: 'black' }} />
      </View>
      {/* submit popup */}
      <PopupModal
        modalVisible={savePopup}
        setBottomModalVisible={setSavepopup}
        styleInner={[Styles.savePopup, { width: '90%' }]}>
        <View style={Styles.submitPopup}>
          <View style={Styles.noteImage}>
            <Image
              source={require('../../../../assets/note.png')}
              style={Styles.noteImage}
            />
          </View>
          <Text style={Styles.confirmText}>{t('confirm')}</Text>
          <Text style={Styles.nextText}>
            {t('lorem ipsum is simply dummy text of the.Lorem Ipsum.')}
          </Text>
          <View style={Styles.bottomPopupbutton}>
            <CustomButton
              style={Styles.submitButton}
              btnText={t('submit')}
              onPress={() => { onSubmit() }}
            // loading={isAddPoultryPending || isEditPoultryPending}
            />
            <CustomButton
              style={Styles.draftButton}
              btnText={t('cancel')}
              onPress={() => {
                setSavepopup(false);
              }}
            />
          </View>
        </View>
      </PopupModal>
      {/* draft popup */}
      <PopupModal
        modalVisible={draftPopup}
        setBottomModalVisible={setDraftpopup}
        styleInner={[Styles.savePopup, { width: '90%' }]}>
        <View style={Styles.submitPopup}>
          <View style={Styles.noteImage}>
            <Image
              source={require('../../../../assets/note.png')}
              style={Styles.noteImage}
            />
          </View>
          <Text style={Styles.confirmText}>{t('save as draft')}</Text>
          <Text style={Styles.nextText}>
            {t('lorem ipsum is simply dummy text of the.Lorem Ipsum.')}
          </Text>
          <View style={Styles.bottomPopupbutton}>
            <CustomButton
              style={Styles.submitButton}
              btnText={t('save')}
              onPress={handleDraft}
            // loading={isAddPoultryPending || isEditPoultryPending}
            />
            <CustomButton
              style={Styles.draftButton}
              btnText={t('cancel')}
              onPress={() => setDraftpopup(false)}
            />
          </View>
        </View>
      </PopupModal>
    </View>
  )
}

export default OfficerLandholding

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: '#fff'
  }
})