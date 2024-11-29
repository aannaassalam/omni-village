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

const OfficerMobility = ({ navigation }) => {
  const { t } = useTranslation()
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const scheme = yup.object().shape({
    house_connected_to_internal_road: yup.string().required(t('Houses connected to internal road is required')),
    house_not_connected_to_internal_road: yup.number().required(t('Houses not connected to internal road is required')),
    village_connected_to_highway: yup.string().required(t('Village connectivity to highway is required')),
    number_of_bridges_needed: yup.string().required(t('Number of bridges is required')),
    reason: yup.string().required(t('Reason is required')),
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
      house_connected_to_internal_road: '',
      house_not_connected_to_internal_road: '',
      village_connected_to_highway: '',
      number_of_bridges_needed: '',
      reason: '',
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
        <Input
          label={t(
            `Houses connected to internal road`
          )}
          value={values?.house_connected_to_internal_road}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('house_connected_to_internal_road')}
        />
        {errors.house_connected_to_internal_road &&
          errors.house_connected_to_internal_road && (
            <Text style={Styles.error2}>
              {
              errors.house_connected_to_internal_road
              }
            </Text>
          )}
        <Input
          label={t(
            `Houses not connected to internal road`
          )}
          value={values?.house_not_connected_to_internal_road}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('house_not_connected_to_internal_road')}
        />
        {errors.house_not_connected_to_internal_road &&
          errors.house_not_connected_to_internal_road && (
            <Text style={Styles.error2}>
              {
              errors.house_not_connected_to_internal_road
              }
            </Text>
          )}
        <CustomDropdown
          data={
            [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }]
          }
          value={values?.village_connected_to_highway}
          label={t('Village connectivity to highway')}
          onChange={value => {
            setValues({
              ...values,
              village_connected_to_highway: value?.value,
            });
          }}
        />
        {touched?.village_connected_to_highway && errors?.village_connected_to_highway && (
          <Text style={Styles.error2}>{String(errors?.village_connected_to_highway)}</Text>
        )}
        <Input
          label={t(
            `Number of bridges needed`
          )}
          value={values?.number_of_bridges_needed}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('number_of_bridges_needed')}
        />
        {errors.number_of_bridges_needed &&
          errors.number_of_bridges_needed && (
            <Text style={Styles.error2}>
              {
              errors.number_of_bridges_needed
              }
            </Text>
          )}
        <Input
          label={t(
            `Reason`
          )}
          value={values?.reason}
          placeholder={''}
          fullLength={true}
          keyboardType="default"
          onChangeText={handleChange('reason')}
        />
        {errors.reason &&
          errors.reason && (
            <Text style={Styles.error2}>
              {
              errors.reason
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

export default OfficerMobility

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
})