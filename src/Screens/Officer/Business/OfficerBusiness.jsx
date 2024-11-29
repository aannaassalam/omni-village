import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { borderColor, primaryColor } from '../../../styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../Components/CustomHeader/CustomHeader';
import { Styles } from '../../../styles/globalStyles';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import PopupModal from '../../../Components/Popups/PopupModal';
import SwitchButton from '../../../Components/SwitchButtons/SwitchButton';
import Input from '../../../Components/Inputs/Input';
import YearPicker from '../../../Components/YearPicker/YearPicker';

const OfficerBusiness = ({ navigation }) => {
  const { t } = useTranslation()
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const scheme = yup.object().shape({
    organisation_not_owned_by_villagers: yup
      .boolean()
      .required(t('required')),
    type: yup
      .string(),
    year_started: yup
      .string(),
    purpose: yup
      .string(),
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
      organisation_not_owned_by_villagers: false,
      type: '',
      year_started: '',
      purpose:''
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
        headerName={t(`business`)}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <SwitchButton
          nolabel={false}
          label={t('Any other establishment/ organisation not owned by villagers')}
          selected={values?.organisation_not_owned_by_villagers}
          firstBtnPress={() => setValues({ ...values, organisation_not_owned_by_villagers: true, })}
          secondBtnPress={() => { setValues({ ...values, organisation_not_owned_by_villagers: false, }) }}
          firstBtnText={t('yes')}
          secondBtntext={t('no')}
        />
        {values?.organisation_not_owned_by_villagers ?
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <Input
                label={t(
                  `Type`
                )}
                value={values?.type}
                placeholder={''}
                fullLength={true}
                keyboardType="default"
                onChangeText={handleChange('type')}
              />
              {errors.type &&
                errors.type && (
                  <Text style={Styles.error2}>
                    {
                    errors.type
                    }
                  </Text>
                )}
              <YearPicker
                onYearChange={(year) => {
                  setValues({ ...values, year_started: parseInt(year) })
                }}
                selectedYear={values?.year_started}
                label={t('Year Started')}
              />
              {errors.year_started && errors.year_started && (
                <Text style={Styles.error2}>{errors.year_started}</Text>
              )}
              <Input
                label={t(
                  `Purpose`
                )}
                value={values?.purpose}
                placeholder={''}
                fullLength={true}
                keyboardType="default"
                onChangeText={handleChange('purpose')}
              />
              {errors.purpose &&
                errors.purpose && (
                  <Text style={Styles.error2}>
                    {
                    errors.purpose
                    }
                  </Text>
                )}
            </View>
          </View>
          : null
        }
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

export default OfficerBusiness

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  innerInputView: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: '5%',
    gap: 12,
    paddingHorizontal: 12,
  },
  divider2: {
    alignSelf: 'flex-start',
    height: '100%',
    marginTop: 9,
    width: '1%',
    borderRadius: 10,
  },
})