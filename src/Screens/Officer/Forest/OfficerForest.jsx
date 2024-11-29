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
import Input from '../../../Components/Inputs/Input';

const OfficerForest = ({ navigation }) => {
  const { t } = useTranslation()
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const scheme = yup.object().shape({
    type_of_forest_accessible: yup.string().required(t('Type of forest is required')),
    area_of_forest_accessible: yup.string().required(t('Area of forest is required')),
    condition_of_forest_accessible: yup.string().required(t('Condition of forest is required')),
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
      type_of_forest_accessible: '',
      area_of_forest_accessible: '',
      condition_of_forest_accessible: '',
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
      setSavepopup(true)
    },

  });
  const onSubmit = () => { }
  const handleDraft = () => { }
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
        <CustomDropdown
          data={
            [{ label: 'Something', value: '6736117ecb51156c2f52383e' }, { label: 'Nothing', value: '6736117ecb51156c2f52683e' }]
          }
          value={values?.type_of_forest_accessible}
          label={t('Type of forest accessible')}
          onChange={value => {
            setValues({
              ...values,
              type_of_forest_accessible: value?.value,
            });
          }}
        />
        {touched?.type_of_forest_accessible && errors?.type_of_forest_accessible && (
          <Text style={Styles.error2}>{String(errors?.type_of_forest_accessible)}</Text>
        )}
        <Input
          label={t(
            `Area of forest accessbile`
          )}
          value={values?.area_of_forest_accessible}
          placeholder={'0'}
          fullLength={true}
          keyboardType="default"
          onChangeText={handleChange('area_of_forest_accessible')}
        />
        {errors.area_of_forest_accessible &&
          errors.area_of_forest_accessible && (
            <Text style={Styles.error2}>
              {
              errors.area_of_forest_accessible
              }
            </Text>
          )}
        <CustomDropdown
          data={
            [{ label: 'Something', value: '6736117ecb51156c2f52383e' }, { label: 'Nothing', value: '6736117ecb51156c2f52683e' }]
          }
          value={values?.condition_of_forest_accessible}
          label={t('Condition of forest accessible')}
          onChange={value => {
            setValues({
              ...values,
              condition_of_forest_accessible: value?.value,
            });
          }}
        />
        {touched?.condition_of_forest_accessible && errors?.condition_of_forest_accessible && (
          <Text style={Styles.error2}>{String(errors?.condition_of_forest_accessible)}</Text>
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

export default OfficerForest

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})