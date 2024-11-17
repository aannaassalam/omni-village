import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useUser } from '../../Hooks/useUser'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import SwitchButton from '../../Components/SwitchButtons/SwitchButton'
import { Styles } from '../../styles/globalStyles'
import AcresElement from '../../Components/ui/AcresElement'
import Input from '../../Components/Inputs/Input'
import { ActivityIndicator, Divider } from 'react-native-paper'
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown'
import CustomButton from '../../Components/CustomButton/CustomButton'
import { borderColor, primaryColor } from '../../styles/colors'
import PopupModal from '../../Components/Popups/PopupModal'
import { addElectricty, editElectricty, getEnergyByType, getEnergyDropdown } from '../../functions/energyFuel'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'

const Electricity = ({ navigation, route }) => {
  const { name, type } = route.params
  const { t } = useTranslation()
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const { data: user } = useUser()
  const queryClient = useQueryClient()
  const { data: energy, isLoading: isDropdownLoading } = useQuery({
    queryKey: [`energy`],
    queryFn: () => getEnergyDropdown(),
    refetchOnWindowFocus: true,
  })
  const { data: get_type, isLoading: isTypeLoading } = useQuery({
    queryKey: [`get_type ${type}`],
    queryFn: () => getEnergyByType(type),
    refetchOnWindowFocus: true,
  })
  const { mutate: edit_electricity } = useMutation({
    mutationKey: ['edit_electricity'],
    mutationFn: async (data) => {
      editElectricty(data)
      queryClient.invalidateQueries()
    },
    onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('energyFuel') },
    onError: (error) => console.log("error save", error),
    onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const { mutate: add_electricity } = useMutation({
    mutationKey: ['add_electricity'],
    mutationFn: async (data) => {
      addElectricty(data)
      queryClient.invalidateQueries()
    },
    onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('energyFuel') },
    onError: (error) => console.log("error save", error),
    onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const scheme = yup.object().shape({
    electric_grid: yup.bool(),
    yearly_electricity_consumption: yup.number().required(t('Yearly electricity consumption is required')),
    yearly_expenditure_electricity: yup.number().required(t('Yearly expenditure electricity is required')),
    electricity_stable: yup.bool(),
    microgrid_installed: yup.bool(),
    type: yup.string().required(t('Type is required')),
    usage: yup.string().required(t('Usage is required')),
    installation_cost: yup.number().required(t('Installation cost is required'))
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
      electric_grid: false,
      yearly_electricity_consumption: '',
      yearly_expenditure_electricity: '',
      electricity_stable: false,
      microgrid_installed: false,
      type: '',
      usage: '',
      installation_cost: ''
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
      setSavepopup(true)
    },
  });
  const handleDraft = () => {
    let new_data = {
      electric_grid: values?.electric_grid,
      yearly_electricity_consumption: parseInt(values?.yearly_electricity_consumption),
      yearly_expenditure_electricity: parseInt(values?.yearly_expenditure_electricity),
      electricity_stable: values?.electricity_stable,
      microgrid_installed: values?.microgrid_installed,
      microgrid_type: values?.type,
      usage: parseInt(values?.usage),
      installation_cost: parseInt(values?.installation_cost),
      status: 0
    }
    if (get_type?._id) {
      edit_electricity({ ...new_data, energy_id: get_type._id })
    } else {
      add_electricity({ ...new_data })
    }
  }

  const onSubmit = () => { 
    let new_data = {
      electric_grid: values?.electric_grid,
      yearly_electricity_consumption: parseInt(values?.yearly_electricity_consumption),
      yearly_expenditure_electricity: parseInt(values?.yearly_expenditure_electricity),
      electricity_stable: values?.electricity_stable,
      microgrid_installed: values?.microgrid_installed,
      microgrid_type: values?.type,
      usage: parseInt(values?.usage),
      installation_cost: parseInt(values?.installation_cost),
      status: 1
    }
    if (get_type?._id) {
      edit_electricity({ ...new_data, energy_id: get_type._id })
    } else {
      add_electricity({ ...new_data })
    }
  }
  useEffect(() => {
    resetForm({
      values: {
        electric_grid: get_type?.electric_grid || false,
        yearly_electricity_consumption: String(get_type?.yearly_electricity_consumption || '') || '',
        yearly_expenditure_electricity: String(get_type?.yearly_expenditure_electricity || '') || '',
        electricity_stable: get_type?.electricity_stable || false,
        microgrid_installed: get_type?.microgrid_installed || false,
        type: get_type?.microgrid_type || '',
        usage: String(get_type?.usage || '') || '',
        installation_cost: String(get_type?.installation_cost || '') || '',
      }
    })
  }, [get_type])
  if (isTypeLoading || isDropdownLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
        <ActivityIndicator size={'large'} color={primaryColor} />
      </View>
    );
  }
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
          label={t('Connected to electric grid?')}
          selected={values?.electric_grid}
          firstBtnPress={() => setValues({ ...values, electric_grid: true })}
          secondBtnPress={() => setValues({ ...values, electric_grid: false, yearly_electricity_consumption: '', yearly_expenditure_electricity: '' })}
          firstBtnText={t('yes')}
          secondBtntext={t('no')}
        />
        {values?.electric_grid ?
          <>
            <Input
              label={t(
                `Yearly Household electricity consumption`
              )}
              value={values?.yearly_electricity_consumption}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('yearly_electricity_consumption')}
              isRight={
                <AcresElement title={'kWh'} />
              }
            />
            {errors.yearly_electricity_consumption &&
              errors.yearly_electricity_consumption && (
                <Text style={Styles.error2}>
                  {
                    errors.yearly_electricity_consumption
                  }
                </Text>
              )}
            <Input
              label={t(
                `Yearly Expenditure on the electricity`
              )}
              value={values?.yearly_expenditure_electricity}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('yearly_expenditure_electricity')}
              isRight={
                <AcresElement title={user.currency} />
              }
            />
            {errors.yearly_expenditure_electricity &&
              errors.yearly_expenditure_electricity && (
                <Text style={Styles.error2}>
                  {
                    errors.yearly_expenditure_electricity
                  }
                </Text>
              )}
          </>
          : null
        }
        <SwitchButton
          nolabel={false}
          label={t('Is the electricity stable?')}
          selected={values?.electricity_stable}
          firstBtnPress={() => setValues({ ...values, electricity_stable: true })}
          secondBtnPress={() => setValues({ ...values, electricity_stable: false })}
          firstBtnText={t('yes')}
          secondBtntext={t('no')}
        />
        <SwitchButton
          nolabel={false}
          label={t('Any renewable microgrid installed')}
          selected={values?.microgrid_installed}
          firstBtnPress={() => setValues({ ...values, microgrid_installed: true })}
          secondBtnPress={() => setValues({ ...values, microgrid_installed: false, type: '', usage: '', installation_cost: '' })}
          firstBtnText={t('yes')}
          secondBtntext={t('no')}
        />
        {values?.microgrid_installed ?
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <CustomDropdown
                data={
                  energy?.microgrid_type.map((item) => {
                    return {
                      label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id
                    }
                  })
                }
                value={values?.type}
                label={t('What is the type?')}
                onChange={value => {
                  setValues({
                    ...values,
                    type: value?.value,
                  });
                }}
              />
              {touched?.type && errors?.type && (
                <Text style={Styles.error2}>{String(errors?.type)}</Text>
              )}
              <Input
                label={t(
                  `How much is the usage?`
                )}
                value={values?.usage}
                placeholder={'0'}
                fullLength={true}
                keyboardType="numeric"
                onChangeText={handleChange('usage')}
                isRight={
                  <AcresElement title={'kWh'} />
                }
              />
              {errors.usage &&
                errors.usage && (
                  <Text style={Styles.error2}>
                    {
                      errors.usage
                    }
                  </Text>
                )}
              <Input
                label={t(
                  `What is the installation cost incurred?`
                )}
                value={values?.installation_cost}
                placeholder={'0'}
                fullLength={true}
                keyboardType="numeric"
                onChangeText={handleChange('installation_cost')}
                isRight={
                  <AcresElement title={user.currency} />
                }
              />
              {errors.installation_cost &&
                errors.installation_cost && (
                  <Text style={Styles.error2}>
                    {
                      errors.installation_cost
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

export default Electricity

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