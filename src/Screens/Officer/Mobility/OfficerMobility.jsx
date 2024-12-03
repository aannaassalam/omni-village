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
    village_connected_to_highway: yup.boolean().required(t('Village connectivity to highway is required')),
    number_of_bridges_needed: yup.string().required(t('Number of bridges is required')),
    reason: yup.string().required(t('Reason is required')),
    condition_of_internal_roads: yup.string().required(t('Condition of internal roads is required')),
    safety_issues_on_roads: yup.boolean().required(t('Safety issues on roads is required')),
    describe: yup.string().test(
      'describe-required-if-safety-issues',
      t('Describe is required if there are safety issues on roads'),
      function (value) {
        const { safety_issues_on_roads } = this.parent;
        if (safety_issues_on_roads) {
          return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    connectivity_to_healthcare_facilities: yup.string().required(t('Connectivity to healthcare facilities is required')),
    road_infrastructure_damaged: yup.boolean().required(t('Road infrastructure damaged is required')),
    road_damage_frequency: yup.string().required(t('Road damage frequency is required')),
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
      village_connected_to_highway: false,
      number_of_bridges_needed: '',
      reason: '',
      condition_of_internal_roads: '',
      safety_issues_on_roads:false,
      describe: '',
      connectivity_to_healthcare_facilities:'',
      road_infrastructure_damaged: false,
      road_damage_frequency:''
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
        headerName={t(`mobility`)}
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
          touched.house_connected_to_internal_road && (
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
          touched.house_not_connected_to_internal_road && (
            <Text style={Styles.error2}>
              {
              errors.house_not_connected_to_internal_road
              }
            </Text>
          )}
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false}]
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
          touched.number_of_bridges_needed && (
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
          touched.reason && (
            <Text style={Styles.error2}>
              {
              errors.reason
              }
            </Text>
          )}
        <CustomDropdown
          data={
            [{ label: 'Something2', value: 'something2' }, { label: 'Something', value: 'something' }]
          }
          value={values?.condition_of_internal_roads}
          label={t('Condition of internal roads')}
          onChange={value => {
            setValues({
              ...values,
              condition_of_internal_roads: value?.value,
            });
          }}
        />
        {touched?.condition_of_internal_roads && errors?.condition_of_internal_roads && (
          <Text style={Styles.error2}>{String(errors?.condition_of_internal_roads)}</Text>
        )}
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.safety_issues_on_roads}
          label={t('Safety issues on roads')}
          onChange={value => {
            setValues({
              ...values,
              safety_issues_on_roads: value?.value,
            });
          }}
        />
        {touched?.safety_issues_on_roads && errors?.safety_issues_on_roads && (
          <Text style={Styles.error2}>{String(errors?.safety_issues_on_roads)}</Text>
        )}
        {values?.safety_issues_on_roads ? 
      <>
            <Input
              label={t(
                `If yes, describe`
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
      </> 
      : null 
      }
        <CustomDropdown
          data={
            [{ label: 'Something2', value: 'something2' }, { label: 'Something', value: 'something' }]
          }
          value={values?.connectivity_to_healthcare_facilities}
          label={t('Connectivity to healthcare facilities')}
          onChange={value => {
            setValues({
              ...values,
              connectivity_to_healthcare_facilities: value?.value,
            });
          }}
        />
        {touched?.connectivity_to_healthcare_facilities && errors?.connectivity_to_healthcare_facilities && (
          <Text style={Styles.error2}>{String(errors?.connectivity_to_healthcare_facilities)}</Text>
        )}
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.road_infrastructure_damaged}
          label={t('Road infrastructure damaged due to flooding or landslides')}
          onChange={value => {
            setValues({
              ...values,
              road_infrastructure_damaged: value?.value,
            });
          }}
        />
        {touched?.road_infrastructure_damaged && errors?.road_infrastructure_damaged && (
          <Text style={Styles.error2}>{String(errors?.road_infrastructure_damaged)}</Text>
        )}
        <CustomDropdown
          data={
            [{ label: 'Something', value: 'something' }, { label: 'Something2', value: 'something2' }]
          }
          value={values?.road_damage_frequency}
          label={t('How frequently the road gets damaged due to flooding or landslides?')}
          onChange={value => {
            setValues({
              ...values,
              road_damage_frequency: value?.value,
            });
          }}
        />
        {touched?.road_damage_frequency && errors?.road_damage_frequency && (
          <Text style={Styles.error2}>{String(errors?.road_damage_frequency)}</Text>
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