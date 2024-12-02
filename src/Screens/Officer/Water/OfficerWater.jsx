import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { borderColor, primaryColor } from '../../../styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../Components/CustomHeader/CustomHeader';
import { Styles, width } from '../../../styles/globalStyles';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import PopupModal from '../../../Components/Popups/PopupModal';
import CustomDropdown from '../../../Components/CustomDropdown/CustomDropdown';
import MultiselectDropdown from '../../../Components/MultiselectDropdown/MultiselectDropdown';
import Input from '../../../Components/Inputs/Input';
import AcresElement from '../../../Components/ui/AcresElement';
import SwitchButton from '../../../Components/SwitchButtons/SwitchButton';

const OfficerWater = ({ navigation }) => {
  const { t } = useTranslation()
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const [sewage, setSewage] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState([]);
  const scheme = yup.object().shape({
    water_source_available: yup.array().of(
      yup.object().shape({
        type: yup.string().required(t('Type is required')),
        condition: yup.string().required(t('Condition is required')),
        tapped_into: yup.string().required(t('Tapped Into is required')),
        sustainable_yearly_supply: yup.string().required(t('Sustainable Yearly Supply is required')),
        yearly_consumption: yup.string().required(t('Yearly consumption is required')),
        storage_capacity: yup.string(),
        distribution_method: yup.array().min(1, t('Atleast one Distribution method is required')).required(t('Distribution method is required')),
        storage_method: yup.string().required(t('Storage method is required')),
        rate_of_replenishment: yup.string().required(t('Rate of replenishment is required')),
      })
    ).required('Water source available is required').min(1, 'Atleast one Water source available is required'),
    sewage_treatment: yup.boolean().required(t('Sewage treatment is required')),
    capacity: yup.string().required(t('Capacity is required')).test('capacity-required', t('Capacity is required when sewage treatment is enabled'), function (value) {
      const { sewage_treatment } = this.parent;
      return !sewage_treatment || (!!value && parseFloat(value) > 0);
    }),
    treated_water_discharged: yup.string().required(t('Treated water discharged is required')).test(
      'treated-water-required',
      t('Treated water discharged is required when sewage treatment is enabled'),
      function (value) {
        const { sewage_treatment } = this.parent;
        return !sewage_treatment || !!value;
      }
    ),
    number_of_houses: yup.string().required(t('Number of houses in the collection network is required')).test(
      'houses-required',
      t('Number of houses in the collection network is required when sewage treatment is enabled'),
      function (value) {
        const { sewage_treatment } = this.parent;
        return !sewage_treatment || !!value;
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
      water_source_available: [],
      sewage_treatment: false,
      capacity: '',
      treated_water_discharged: '',
      number_of_houses: '',
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
      setSavepopup(true)
    },

  });
  const onSubmit = () => { }
  const handleDraft = () => { }
  const handleFieldChange = (index, field, value) => {
    const newDetailsOfLand = [...values.water_source_available];
    newDetailsOfLand[index][field] = value;
    setValues({ ...values, water_source_available: newDetailsOfLand });
  };

  const handleStatusChange = (selectedItems) => {
    setSelectedStatus(selectedItems);

    // Update `purpose_status_of_land` based on the selected items
    const updatedPurposeStatusOfLand = selectedItems.map((item) => {
      // Check if this `type` already exists in `purpose_status_of_land`
      const existingEntry = values.water_source_available.find(
        entry => entry.type === item
      );

      return existingEntry || {
        type: item,
        condition: '',
        tapped_into: '',
        sustainable_yearly_supply: '',
        yearly_consumption: '',
        storage_capacity: '',
        distribution_method: [],
        storage_method: '',
        rate_of_replenishment: '',
      };
    });
    // Update the form's purpose_status_of_land field
    setFieldValue('water_source_available', updatedPurposeStatusOfLand);
  };
  const [collapseStates, setCollapseStates] = useState([]);

  useEffect(() => {
    // Initialize collapseStates with false for all vehicles
    if (values?.water_source_available.length > 0) {
      setCollapseStates(Array(values.water_source_available.length).fill(true));
    }
  }, [values?.water_source_available]);

  const toggleCollapse = (index) => {
    setCollapseStates((prevStates) => {
      // Create a new array to avoid mutating the state directly
      const newStates = [...prevStates];
      newStates[index] = !newStates[index]; // Toggle the specific index
      return newStates;
    });
  };
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
        headerName={t(`water`)}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <MultiselectDropdown
          containerStyle={{ marginTop: '5%', paddingTop: 0 }}
          data={[
            { key: 1, name: 'Agriculture' },
            { key: 2, name: 'Drinking water' },
          ]}
          setSelectedd={handleStatusChange}
          selectedd={selectedStatus}
          infoName={t('Select Water sources available at the village level')}
        />
        {touched?.water_source_available && errors?.water_source_available && (
          <Text style={Styles.error2}>{String(errors?.water_source_available)}</Text>
        )}
        {values?.water_source_available?.length > 0 &&
          <>
            {values?.water_source_available.map((item, index) => {
              return <>
                <View style={[styles.subArea, { marginTop: '3%' }]}>
                  <Text
                    style={[
                      Styles.fieldLabel,
                      { marginTop: 4, alignSelf: 'center' },
                    ]}>
                    {t(`${t('Type')} ${index + 1}`)}
                  </Text>
                  <Divider
                    bold={true}
                    style={[styles.divider, { width: '64%' }]}
                    horizontalInset={true}
                  />
                  <TouchableOpacity onPress={() => toggleCollapse(index)}>
                    {collapseStates[index] ? (
                      <Image
                        source={require('../../../../assets/arrowUp.png')}
                        style={styles.uparrow}
                      />
                    ) : (
                      <Image
                        source={require('../../../../assets/arrowDown.png')}
                        style={styles.uparrow}
                      />
                    )}
                  </TouchableOpacity>
                </View>
                {collapseStates[index] &&
                  <View style={styles.innerInputView}>
                    <Divider style={styles.divider2} />
                    <View style={{ width: '100%' }}>
                      <CustomDropdown
                        data={
                          [{ label: 'Yes', value: '6736117ecb51156c2f52383e' }, { label: 'No', value: '6736117ecb51155c2f52383e' }]
                        }
                        value={item?.condition}
                        label={t('Condition')}
                        onChange={value => {
                          handleFieldChange(
                            index,
                            'condition',
                            value?.value,
                          )
                        }}
                      />
                      {errors.water_source_available &&
                        errors.water_source_available[index]
                          ?.condition && (
                          <Text style={Styles.error2}>
                            {
                              errors.water_source_available[index]
                                .condition
                            }
                          </Text>
                        )}
                      <CustomDropdown
                        data={
                          [{ label: 'Yes', value: '6736117ecb51156c2f52383e' }, { label: 'No', value: '6736117ecb51155c2f52383e' }]
                        }
                        value={item?.tapped_into}
                        label={t('Tapped Into')}
                        onChange={value => {
                          handleFieldChange(
                            index,
                            'tapped_into',
                            value?.value,
                          )
                        }}
                      />
                      {errors.water_source_available &&
                        errors.water_source_available[index]
                          ?.tapped_into && (
                          <Text style={Styles.error2}>
                            {
                              errors.water_source_available[index]
                                .tapped_into
                            }
                          </Text>
                        )}
                      <Input
                        label={t('Potential sustainable yearly supply')}
                        value={item?.sustainable_yearly_supply}
                        placeholder={''}
                        fullLength={true}
                        keyboardType="numeric"
                        onChangeText={value => {
                          handleFieldChange(
                            index,
                            'sustainable_yearly_supply',
                            value,
                          )
                        }}
                        isRight={
                          <AcresElement title={'Litres'} />
                        }
                      />
                      {errors.water_source_available &&
                        errors.water_source_available[index]
                          ?.sustainable_yearly_supply && (
                          <Text style={Styles.error2}>
                            {
                              errors.water_source_available[index]
                                .sustainable_yearly_supply
                            }
                          </Text>
                        )}
                      <Input
                        label={t('Present yearly consumption')}
                        value={item?.yearly_consumption}
                        placeholder={''}
                        fullLength={true}
                        keyboardType="numeric"
                        onChangeText={value => {
                          handleFieldChange(
                            index,
                            'yearly_consumption',
                            value,
                          )
                        }}
                        isRight={
                          <AcresElement title={'Litres'} />
                        }
                      />
                      {errors.water_source_available &&
                        errors.water_source_available[index]
                          ?.yearly_consumption && (
                          <Text style={Styles.error2}>
                            {
                              errors.water_source_available[index]
                                .yearly_consumption
                            }
                          </Text>
                        )}
                      <Input
                        label={t('Storage Capacity (If any)')}
                        value={item?.storage_capacity}
                        placeholder={''}
                        fullLength={true}
                        keyboardType="default"
                        onChangeText={value => {
                          handleFieldChange(
                            index,
                            'storage_capacity',
                            value,
                          )
                        }}
                      />
                      {errors.water_source_available &&
                        errors.water_source_available[index]
                          ?.storage_capacity && (
                          <Text style={Styles.error2}>
                            {
                              errors.water_source_available[index]
                                .storage_capacity
                            }
                          </Text>
                        )}
                      {/* <CustomDropdown
                        data={[
                          {
                            label: 'Tank',
                            value: 'tank',
                          },
                          {
                            label: 'Bucket',
                            value: 'bucket',
                          }
                        ]
                        }
                        value={item?.distribution_method}
                        label={t('Distribution method')}
                        onChange={value => {
                          handleFieldChange(
                            index,
                            'distribution_method',
                            value?.value,
                          )
                        }}
                      /> */}
                      <MultiselectDropdown
                        containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                        data={[
                          {
                            key:'Tank',
                            name:'Tank'
                          },
                          {
                            key: 'Tank1',
                            name: 'Tank1'
                          },
                          {
                            key: 'Tank2',
                            name: 'Tank2'
                          },
                        ]}
                        setSelectedd={(value) => {
                          handleFieldChange(
                            index,
                            'distribution_method',
                            value,
                          )
}}
                        selectedd={item?.distribution_method}
                        infoName={t('Distribution method')}
                      />
                      {errors.water_source_available &&
                        errors.water_source_available[index]
                          ?.distribution_method && (
                          <Text style={Styles.error2}>
                            {
                              errors.water_source_available[index]
                                .distribution_method
                            }
                          </Text>
                        )}
                      <CustomDropdown
                        data={[
                          {
                            label: 'Tank',
                            value: 'tank',
                          },
                          {
                            label: 'Bucket',
                            value: 'bucket',
                          }
                        ]
                        }
                        value={item?.storage_method}
                        label={t('Storage method')}
                        onChange={value => {
                          handleFieldChange(
                            index,
                            'storage_method',
                            value?.value,
                          )
                        }}
                      />
                      {errors.water_source_available &&
                        errors.water_source_available[index]
                          ?.storage_method && (
                          <Text style={Styles.error2}>
                            {
                              errors.water_source_available[index]
                                .storage_method
                            }
                          </Text>
                        )}
                      <Input
                        label={t('Rate of replenishment')}
                        value={item?.rate_of_replenishment}
                        placeholder={''}
                        fullLength={true}
                        keyboardType="numeric"
                        onChangeText={value => {
                          handleFieldChange(
                            index,
                            'rate_of_replenishment',
                            value,
                          )
                        }}
                        isRight={
                          <AcresElement title={'Inch/Yr'} />
                        }
                      />
                      {errors.water_source_available &&
                        errors.water_source_available[index]
                          ?.rate_of_replenishment && (
                          <Text style={Styles.error2}>
                            {
                              errors.water_source_available[index]
                                .rate_of_replenishment
                            }
                          </Text>
                        )}
                    </View>
                  </View>
                }
              </>
            }
            )}

          </>
        }
        <View style={[styles.subArea, { marginTop: '3%' }]}>
          <Text
            style={[
              Styles.fieldLabel,
              { marginTop: 4, alignSelf: 'center' },
            ]}>
            {t(`Sewage treatment plant`)}
          </Text>
          <Divider
            bold={true}
            style={[styles.divider, { width: '44%' }]}
            horizontalInset={true}
          />
          <TouchableOpacity onPress={() => setSewage(!sewage)}>
            {sewage ? (
              <Image
                source={require('../../../../assets/arrowUp.png')}
                style={styles.uparrow}
              />
            ) : (
              <Image
                source={require('../../../../assets/arrowDown.png')}
                style={styles.uparrow}
              />
            )}
          </TouchableOpacity>
        </View>
        <SwitchButton
          nolabel={false}
          label={t('Is there any community Sewage treatment plant?')}
          selected={values?.sewage_treatment}
          firstBtnPress={() => setValues({ ...values, sewage_treatment: true })}
          secondBtnPress={() => { setValues({ ...values, sewage_treatment: false, number_of_business: '' }) }}
          firstBtnText={t('yes')}
          secondBtntext={t('no')}
        />
        {values?.sewage_treatment ?
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <Input
                label={t(
                  `Capacity`
                )}
                value={values?.capacity}
                placeholder={'0'}
                fullLength={true}
                keyboardType="numeric"
                onChangeText={handleChange('capacity')}
                isRight={
                  <AcresElement title={'Litres'} />}
              />
              {errors.capacity &&
                touched.capacity && (
                  <Text style={Styles.error2}>
                    {
                    errors.capacity
                    }
                  </Text>
                )}
              <CustomDropdown
                data={
                  [{ label: 'ha', value: '6736117ecb51156c2f52383e' }, { label: 'km', value: '6736117ecb51156c2f52683e' }]
                }
                value={values?.treated_water_discharged}
                label={t('Where is the treated water discharged')}
                onChange={value => {
                  setValues({
                    ...values,
                    treated_water_discharged: value?.value,
                  });
                }}
              />
              {errors.treated_water_discharged &&
                touched.treated_water_discharged && (
                  <Text style={Styles.error2}>
                    {
                    errors.treated_water_discharged
                    }
                  </Text>
                )}
              <Input
                label={t(
                  `Number of houses in the collection network`
                )}
                value={values?.number_of_houses}
                placeholder={'0'}
                fullLength={true}
                keyboardType="numeric"
                onChangeText={handleChange('number_of_houses')}
              />
              {errors.number_of_houses &&
                touched.number_of_houses && (
                  <Text style={Styles.error2}>
                    {
                    errors.number_of_houses
                    }
                  </Text>
                )}
              </View> 
              </View> : null
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

export default OfficerWater

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
  subArea: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    // margin: 10,
    marginTop: '5%',
    width: width / 1.04,
    alignItems: 'center',
  },
  divider: {
    alignSelf: 'center',
    height: 1,
    width: '67%',
    color: 'grey',
  },
  uparrow: {
    height: 20,
    width: 20,
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