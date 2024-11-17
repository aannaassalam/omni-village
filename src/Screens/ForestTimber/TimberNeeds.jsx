import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useUser } from '../../Hooks/useUser'
import { useQueryClient } from '@tanstack/react-query'
import SwitchButton from '../../Components/SwitchButtons/SwitchButton'
import { Styles } from '../../styles/globalStyles'
import AcresElement from '../../Components/ui/AcresElement'
import Input from '../../Components/Inputs/Input'
import { Divider } from 'react-native-paper'
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown'
import CustomButton from '../../Components/CustomButton/CustomButton'
import { borderColor } from '../../styles/colors'
import PopupModal from '../../Components/Popups/PopupModal'
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown'

const TimberNeeds = ({ navigation, route }) => {
  const { name, type, energy_id } = route.params
  const { t } = useTranslation()
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const { data: user } = useUser()
  const queryClient = useQueryClient()
  const scheme = yup.object().shape({
    timber_needs: yup.boolean().required('Timber needs is required'), // Ensures boolean validation
    quantity: yup
      .string()
      .when('timber_needs', (timberNeeds, schema) =>
        timberNeeds
          ? schema.required(t('Quantity is required')) // Required when timber_needs is true
          : schema // No additional validation otherwise
      )
      ,
    purpose: yup
      .array()
      .when('timber_needs', (timberNeeds, schema) =>
        timberNeeds
          ? schema
            .of(yup.string().required(t('Each purpose is required')))
            .min(1, t('At least one purpose is required')) // Validates at least one item in the array
          : schema
      ),
    urgency: yup
      .string()
      .when('timber_needs', (timberNeeds, schema) =>
        timberNeeds
          ? schema.required(t('Urgency is required')) // Required when timber_needs is true
          : schema.nullable() // Optional otherwise
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
      timber_needs: false,
      quantity: '',
      purpose:[],
      urgency:''
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
      setSavepopup(true)
    },
  });
  const handleDraft = () => {

  }

  const onSubmit = () => { }
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t(`${name}`)}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <SwitchButton
          nolabel={false}
          label={t('Do you have unfulfilled Timber needs?')}
          selected={values?.timber_needs}
          firstBtnPress={() => setValues({ ...values, timber_needs: true })}
          secondBtnPress={() => setValues({ ...values, timber_needs: false, quantity: '', purpose:[], urgency:'' })}
          firstBtnText={t('yes')}
          secondBtntext={t('no')}
        />
        {values?.timber_needs ?
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <Input
                label={t(
                  `Quantity`
                )}
                value={values?.quantity}
                placeholder={'0'}
                fullLength={true}
                keyboardType="numeric"
                onChangeText={handleChange('quantity')}
                isRight={
                  <AcresElement title={'Unit'} />
                }
              />
              {errors.quantity &&
                errors.quantity && (
                  <Text style={Styles.error2}>
                    {
                    errors.quantity
                    }
                  </Text>
                )}
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={
                [
                  { key: 1, name: 'Timber for construction' },
                  { key: 2, name: 'Timber for furniture' },
                ]
                }
                setSelectedd={(value) => {
                  setValues({ ...values, purpose: value })
                }}
                selectedd={values?.purpose}
                infoName={t('Purpose')}
              />
              {touched?.purpose && errors?.purpose && (
                <Text style={Styles.error2}>{String(errors?.purpose)}</Text>
              )}
              <CustomDropdown
                data={
                  [{ label: 'Microgrid', value: 'Microgrid' }]
                }
                value={values?.urgency}
                label={t('Urgency')}
                onChange={value => {
                  setValues({
                    ...values,
                    urgency: value?.value,
                  });
                }}
              />
              {touched?.urgency && errors?.urgency && (
                <Text style={Styles.error2}>{String(errors?.urgency)}</Text>
              )}
            </View>
          </View>
          :
          null
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
              source={require('../../../assets/note.png')}
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
              source={require('../../../assets/note.png')}
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

export default TimberNeeds

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