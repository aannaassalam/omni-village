import { Image, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useState, useEffect } from 'react'
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
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown'
import PurposeInput from '../../Components/PurposeInput/PurposeInput'
import { addPetrolDieselNatural, editPetrolDieselNatural, getEnergyByType, getEnergyDropdown } from '../../functions/energyFuel'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'

const NaturalGas = ({ navigation, route }) => {
  const { name, type } = route.params
  const { t } = useTranslation()
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const { data: user } = useUser()
  const queryClient = useQueryClient()
  const [selectedStatus, setSelectedStatus] = useState([]);
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
  const { mutate: edit_petrol_diesel } = useMutation({
    mutationKey: ['edit_petrol_diesel'],
    mutationFn: async (data) => {
      editPetrolDieselNatural(data)
      queryClient.invalidateQueries()
    },
    onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('energyFuel') },
    onError: (error) => console.log("error save", error),
    onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const { mutate: add_petrol_diesel } = useMutation({
    mutationKey: ['add_petrol_diesel'],
    mutationFn: async (data) => {
      addPetrolDieselNatural(data)
      queryClient.invalidateQueries()
    },
    onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('energyFuel') },
    onError: (error) => console.log("error save", error),
    onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const scheme = yup.object().shape({
    yearly_petrol_consumption: yup.number().required(t('Yearly natural gas consumption required')),
    yearly_expenditure_petrol: yup.number().required(t('Yearly expenditure on natural gas is required')),
    purpose_petrol_used_for: yup.array().of(
      yup.object().shape({
        type: yup.string().required(t('Type is required')),
        quantity: yup
          .string()
          .required(t('Quantity is required')),
      }),
    )
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
      yearly_petrol_consumption: '',
      yearly_expenditure_petrol: '',
      purpose_petrol_used_for: []
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
      if (selectedStatus.length > 0) {
        setSavepopup(true)
      } else {
        ToastAndroid.show("Please select one purpose", ToastAndroid.BOTTOM)
      }
    },
  });
  const handleFieldChange = (index, field, value) => {
    const newDetailsOfLand = [...values.purpose_petrol_used_for];
    newDetailsOfLand[index][field] = value;
    setValues({ ...values, purpose_petrol_used_for: newDetailsOfLand });
  };

  const handleStatusChange = (selectedItems) => {
    setSelectedStatus(selectedItems);

    // Update `purpose_status_of_land` based on the selected items
    const updatedPurposeStatusOfLand = selectedItems.map((item) => {
      // Check if this `type` already exists in `purpose_status_of_land`
      const existingEntry = values.purpose_petrol_used_for.find(
        entry => entry.type === item
      );

      return existingEntry || {
        type: item,
        quantity: ''
      };
    });
    // Update the form's purpose_status_of_land field
    setFieldValue('purpose_petrol_used_for', updatedPurposeStatusOfLand);
  };
  const handleDraft = () => {
    let new_data = {
      yearly_petrol_consumption: parseInt(values?.yearly_petrol_consumption),
      yearly_expenditure_petrol: parseInt(values?.yearly_expenditure_petrol),
      purpose_petrol_used_for: values?.purpose_petrol_used_for,
      type,
      status: 0
    }
    if (get_type?._id) {
      edit_petrol_diesel({ ...new_data, energy_id: get_type._id })
    } else {
      add_petrol_diesel({...new_data})
    }
  }

  const onSubmit = () => {
    let new_data = {
      yearly_petrol_consumption: parseInt(values?.yearly_petrol_consumption),
      yearly_expenditure_petrol: parseInt(values?.yearly_expenditure_petrol),
      purpose_petrol_used_for: values?.purpose_petrol_used_for,
      type,
      status: 1
    }
    if (get_type?._id) {
      edit_petrol_diesel({ ...new_data, energy_id: get_type._id })
    } else {
      add_petrol_diesel({...new_data})
    }
  }
  useEffect(() => {
    resetForm({
      values: {
        yearly_petrol_consumption: String(get_type?.yearly_petrol_consumption || ''),
        yearly_expenditure_petrol: String(get_type?.yearly_expenditure_petrol || ''),
        purpose_petrol_used_for: get_type?.purpose_petrol_used_for.map(item => {
          return {
            type: item.type,
            quantity: String(item.quantity)
          }
        }) || []
      }
    })
    setSelectedStatus(get_type?.purpose_petrol_used_for.map(item => item.type) || [])
  }, [get_type])
  if (isTypeLoading ||  isDropdownLoading) {
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
        <Input
          label={t(
            `Yearly consumption of natural gas`
          )}
          value={values?.yearly_petrol_consumption}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('yearly_petrol_consumption')}
          isRight={
            <AcresElement title={'Litres'} />
          }
        />
        {errors.yearly_petrol_consumption &&
          errors.yearly_petrol_consumption && (
            <Text style={Styles.error2}>
              {
                errors.yearly_petrol_consumption
              }
            </Text>
          )}
        <Input
          label={t(
            `Yearly expenditure on natural gas`
          )}
          value={values?.yearly_expenditure_petrol}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('yearly_expenditure_petrol')}
          isRight={
            <AcresElement title={user.currency} />
          }
        />
        {errors.yearly_expenditure_petrol &&
          errors.yearly_expenditure_petrol && (
            <Text style={Styles.error2}>
              {
                errors.yearly_expenditure_petrol
              }
            </Text>
          )}
        <MultiselectDropdown
          containerStyle={{ marginTop: '5%', paddingTop: 0 }}
          data={energy?.purpose_natural_gas.map((item) => {
            return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
          })}
          setSelectedd={handleStatusChange}
          selectedd={selectedStatus}
          infoName={t('For what purposes is the natural gas used for?')}
        />
        {values?.purpose_petrol_used_for.length > 0 && (
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <View style={styles.quantityContainer}>
                {values.purpose_petrol_used_for.map((item, index) => (
                  <>
                    <PurposeInput title={`${t('Quantity')} ${index + 1}`} value={item.quantity} onChangeText={text =>
                      handleFieldChange(
                        index,
                        'quantity',
                        parseInt(text),
                      )
                    } unit={'Litre'}/>
                    {errors.purpose_petrol_used_for &&
                      errors.purpose_petrol_used_for[index]
                        ?.quantity && (
                        <Text style={Styles.error2}>
                          {
                            errors.purpose_petrol_used_for[index]
                              .quantity
                          }
                        </Text>
                      )}
                  </>
                ))}
              </View>
            </View>
          </View>
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

export default NaturalGas

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
  quantityContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: primaryColor,
    paddingHorizontal: 12,
    width: '100%',
    paddingVertical: 6,
    alignSelf: 'center',
    marginTop: '4%'
  }
})