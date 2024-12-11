import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Divider } from 'react-native-paper';
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
    type_of_forest_accessible: yup.array().required(t('Type of forest is required')),
    area_of_forest_accessible: yup.string().required(t('Area of forest is required')),
    do_you_have_flora_fauna: yup.boolean(),
    link_of_the_doc: yup.string().test(
      'link-of-the-doc-required-if-flora-fauna',
      t('Link of the doc is required if flora fauna is true'),
      function (value) {
        const { do_you_have_flora_fauna } = this.parent;
        if (do_you_have_flora_fauna) {
          return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    condition_of_forest_accessible: yup.string().test(
      'link-of-the-doc-required-if-flora-fauna',
      t('Condition of forest is required if flora fauna is true'),
      function (value) {
        const { do_you_have_flora_fauna } = this.parent;
        if (do_you_have_flora_fauna) {
          return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    incident_of_forest_fire: yup.boolean().test(
      'link-of-the-doc-required-if-flora-fauna',
      t('Incident of forest fire is required if flora fauna is true'),
      function (value) {
        const { do_you_have_flora_fauna } = this.parent;
        if (do_you_have_flora_fauna) {
          return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    incident_of_wildlife_conflict: yup.boolean().test(
      'link-of-the-doc-required-if-flora-fauna',
      t('Incident of wildlife conflict is required if flora fauna is true'),
      function (value) {
        const { do_you_have_flora_fauna } = this.parent;
        if (do_you_have_flora_fauna) {
          return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    describe: yup.string().test(
      'link-of-the-doc-required-if-flora-fauna',
      t('Describe is required'),
      function (value) {
        const { incident_of_wildlife_conflict } = this.parent;
        if (incident_of_wildlife_conflict) {
          return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    any_incident_of_illegal_forest_activities: yup.boolean().test(
      'link-of-the-doc-required-if-flora-fauna',
      t('Any incident of illegal forest activities is required'),
      function (value) {
        const { incident_of_wildlife_conflict } = this.parent;
        if (incident_of_wildlife_conflict) {
          return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
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
      do_you_have_flora_fauna: false,
      link_of_the_doc: '',
      condition_of_forest_accessible: '',
      incident_of_forest_fire: '',
      incident_of_wildlife_conflict:false,
      describe:'',
      any_incident_of_illegal_forest_activities: ''
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
        headerName={t(`forest`)}
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
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.do_you_have_flora_fauna}
          label={t('Do you have flora & fauna survey done for the village?')}
          onChange={value => {
            setValues({
              ...values,
              do_you_have_flora_fauna: value?.value,
            });
          }}
        />
        {touched?.do_you_have_flora_fauna && errors?.do_you_have_flora_fauna && (
          <Text style={Styles.error2}>{String(errors?.do_you_have_flora_fauna)}</Text>
        )}
        {values?.do_you_have_flora_fauna ?
           <View style={styles.innerInputView}>
                    <Divider style={styles.divider2} />
                    <View style={{ width: '100%' }}>
            <Input
              label={t(
                `Share the link of the doc`
              )}
              value={values?.link_of_the_doc}
              placeholder={''}
              fullLength={true}
              keyboardType="default"
              onChangeText={handleChange('link_of_the_doc')}
            />
            {errors.link_of_the_doc &&
              touched.link_of_the_doc && (
                <Text style={Styles.error2}>
                  {
                  errors.link_of_the_doc
                  }
                </Text>
              )}
            <CustomDropdown
              data={
                [{ label: 'Tank', value: '6736117ecb51156c2f52383e' }, { label: 'Bucket', value: '6736117ecb51156c2f58383e' }]
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
            <CustomDropdown
              data={
                [{ label: 'Something', value: '6736117ecb51156c2f52383e' }, { label: 'Nothing', value: '6736117ecb51156c2f52683e' }]
              }
              value={values?.incident_of_forest_fire}
              label={t('Incident of Forest Fire')}
              onChange={value => {
                setValues({
                  ...values,
                  incident_of_forest_fire: value?.value,
                });
              }}
            />
            {touched?.incident_of_forest_fire && errors?.incident_of_forest_fire && (
              <Text style={Styles.error2}>{String(errors?.incident_of_forest_fire)}</Text>
            )}
            <CustomDropdown
              data={
                [{ label: 'Yes', value: true }, { label: 'No', value: false }]
              }
              value={values?.incident_of_wildlife_conflict}
              label={t('Incident of wildlife conflict')}
              onChange={value => {
                setValues({
                  ...values,
                  incident_of_wildlife_conflict: value?.value,
                });
              }}
            />
            {touched?.incident_of_wildlife_conflict && errors?.incident_of_wildlife_conflict && (
              <Text style={Styles.error2}>{String(errors?.incident_of_wildlife_conflict)}</Text>
            )}
            {values?.incident_of_wildlife_conflict ? 
          <>
              <Input
                label={t(
                  `Describe`
                )}
                value={values?.describe}
                placeholder={''}
                fullLength={true}
                keyboardType="default"
                onChangeText={handleChange('describe')}
              />
              {errors.describe &&
                touched.describe && (
                  <Text style={Styles.error2}>
                    {
                      errors.describe
                    }
                  </Text>
                )}
              <Input
                label={t(
                  `Any incidents of illegal forest activities? `
                )}
                value={values?.any_incident_of_illegal_forest_activities}
                placeholder={''}
                fullLength={true}
                keyboardType="default"
                onChangeText={handleChange('any_incident_of_illegal_forest_activities')}
              />
              {errors.any_incident_of_illegal_forest_activities &&
                touched.any_incident_of_illegal_forest_activities && (
                  <Text style={Styles.error2}>
                    {
                      errors.any_incident_of_illegal_forest_activities
                    }
                  </Text>
                )}
          </>  
          :null
          }
          </View>
          </View>
          : null
        }
       
      </KeyboardAwareScrollView>
      <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <CustomButton btnText={t('submit')} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
        {/* <CustomButton btnText={t('save as draft')} style={{ width: '48%', height: 60, backgroundColor: borderColor }} onPress={() => { setDraftpopup(true) }} btnStyle={{ color: 'black' }} /> */}
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