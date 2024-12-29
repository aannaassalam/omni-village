import { Image, StyleSheet, Text, ToastAndroid, TouchableOpacity, View } from 'react-native'
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
import Input from '../../../Components/Inputs/Input';
import MultiselectDropdown from '../../../Components/MultiselectDropdown/MultiselectDropdown';
import AcresElement from '../../../Components/ui/AcresElement';
import SwitchButton from '../../../Components/SwitchButtons/SwitchButton';
import { useModerator } from '../../../Hooks/useUser';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addModeratorEnergy, editModeratorEnergy, getModeratorEnergy, getModeratorEnergyDropdown } from '../../../functions/moderator';
import CustomDropdown from '../../../Components/CustomDropdown/CustomDropdown';
import { USER_PREFERRED_LANGUAGE } from '../../../i18next';

const OfficerEnergy = ({ navigation, route }) => {
  const { t } = useTranslation()
  const {village_id}= route.params
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState([]);
  const {data: user} = useModerator()
  const queryClient = useQueryClient()
      const { data: get_moderator_energy_dropdown, isLoading: isLoading } = useQuery({
        queryKey: [`get_moderator_energy_dropdown`],
        queryFn: () => getModeratorEnergyDropdown(),
        refetchOnWindowFocus: true,
      })
  const { data: get_moderator_energy, isLoading: isTypeLoading } = useQuery({
    queryKey: [`get_moderator_energy`],
    queryFn: () => getModeratorEnergy(village_id),
    enabled: village_id ? true : false,
    refetchOnWindowFocus: true,
  })

  const { mutate: edit_moderator_energy } = useMutation({
    mutationKey: ['edit_moderator_energy'],
    mutationFn: async (data) => {
      editModeratorEnergy(data)
      queryClient.invalidateQueries()
    },
    onSuccess: (data) => { console.log("successsssss edit", data, navigation.replace('officerHome', { village_id: village_id })) },
    onError: (error) => console.log("error save", error),
    onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const { mutate: add_moderator_energy } = useMutation({
    mutationKey: ['add_moderator_energy'],
    mutationFn: async (data) => {
      addModeratorEnergy(data)
      queryClient.invalidateQueries()
    },
    onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('officerHome', { village_id: village_id }) },
    onError: (error) => console.log("error save", error),
    onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const scheme = yup.object().shape({
    available_renewable_energy: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string().required(t('Type is required')),
          energy_source: yup.boolean().required(t('Energy Source is required')),

          capacity: yup
            .string()
            .test('is-required-if-energy-source-true', t('Capacity is required'), function (value) {
              const { energy_source } = this.parent;
              return energy_source ? value && value.trim() !== '' : true;
            }),

          distribution_method: yup
            .array()
            .test('is-required-if-energy-source-true', t('Distribution Method is required'), function (value) {
              const { energy_source } = this.parent;
              return energy_source ? value && value.length > 0 : true;
            }),

          installation_cost: yup
            .string()
            .test('is-required-if-energy-source-true', t('Installation Cost is required'), function (value) {
              const { energy_source } = this.parent;
              return energy_source ? value && value.trim() !== '' : true;
            }),
          distance_to_pumps: yup
            .string()
            .test('is-required-if-energy-source-true', t('How far is Petrol or Diesel Pumps is required'), function (value) {
              const { energy_source } = this.parent;
              return energy_source ? value && value.trim() !== '' : true;
            }),
          central_grid_fossil: yup
            .string()
            .test('sum-limit', t('The total of central grid fossil, renewable, and microgrid should be equal to 100'), function (value) {
              const { central_grid_fossil, central_grid_renewable, local_renewable_microgrid, energy_source } = this.parent;
              const sum =
                (parseFloat(central_grid_fossil) || 0) +
                (parseFloat(central_grid_renewable) || 0) +
                (parseFloat(local_renewable_microgrid) || 0);
              return sum === 100
            }),

          central_grid_renewable: yup
            .string()
            .test('sum-limit', t('The total of central grid fossil, renewable, and microgrid should be equal to 100'), function (value) {
              const { central_grid_fossil, central_grid_renewable, local_renewable_microgrid } = this.parent;
              const sum =
                (parseFloat(central_grid_fossil) || 0) +
                (parseFloat(central_grid_renewable) || 0) +
                (parseFloat(local_renewable_microgrid) || 0);
              return sum === 100
            }),

          local_renewable_microgrid: yup
            .string()
            .test('sum-limit', t('The total of central grid fossil, renewable, and microgrid should be equal to 100'), function (value) {
              const { central_grid_fossil, central_grid_renewable, local_renewable_microgrid } = this.parent;
              const sum =
                (parseFloat(central_grid_fossil) || 0) +
                (parseFloat(central_grid_renewable) || 0) +
                (parseFloat(local_renewable_microgrid) || 0);
              // return sum <= 100;
              return sum === 100
            }),
        })
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
      available_renewable_energy: [],
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      if (selectedStatus.length > 0) {
        setSavepopup(true);
      } else {
        ToastAndroid.show(t("Please select one value"), ToastAndroid.BOTTOM)
      }
    },

  });

  const onSubmit = () => {
    let data = {
      available_renewable_energy: values.available_renewable_energy.map((item) => ({
        type: item.type,
        energy_source: item.energy_source,
        capacity: parseFloat(item.capacity),
        distribution_method: item.distribution_method,
        installation_cost: parseFloat(item.installation_cost),
        central_grid_fossil: parseFloat(item.central_grid_fossil),
        central_grid_renewable: parseFloat(item.central_grid_renewable),
        local_renewable_microgrid: parseFloat(item.local_renewable_microgrid),
        distance_to_pumps: item?.distance_to_pumps,
      })),
    }
    if(get_moderator_energy?._id){
      edit_moderator_energy({...data, energy_id: get_moderator_energy._id })
    }else{
      add_moderator_energy({...data, village_id})
    }
   }
  const handleDraft = () => { }
  const handleFieldChange = (index, field, value) => {
    const newDetailsOfLand = [...values.available_renewable_energy];
    newDetailsOfLand[index][field] = value;
    setValues({ ...values, available_renewable_energy: newDetailsOfLand });
  };
  const handleStatusChange = (selectedItems) => {
    setSelectedStatus(selectedItems);

    // Update `purpose_status_of_land` based on the selected items
    const updatedPurposeStatusOfLand = selectedItems.map((item) => {
      // Check if this `type` already exists in `purpose_status_of_land`
      const existingEntry = values?.available_renewable_energy?.find(
        entry => entry?.type === item
      );

      return existingEntry || {
        type: item,
        energy_source: false,
        capacity: '',
        distribution_method: [],
        installation_cost: '',
        central_grid_fossil: '',
        central_grid_renewable: '',
        local_renewable_microgrid: '',
        distance_to_pumps: '',
      };
    });
    // Update the form's purpose_status_of_land field
    setFieldValue('available_renewable_energy', updatedPurposeStatusOfLand);
  };
  const [collapseStates, setCollapseStates] = useState([]);

  useEffect(() => {
    // Initialize collapseStates with false for all vehicles
    if (values?.available_renewable_energy?.length > 0) {
      setCollapseStates(Array(values.available_renewable_energy?.length).fill(true));
    }
  }, [values?.available_renewable_energy]);

  const toggleCollapse = (index) => {
    setCollapseStates((prevStates) => {
      // Create a new array to avoid mutating the state directly
      const newStates = [...prevStates];
      newStates[index] = !newStates[index]; // Toggle the specific index
      return newStates;
    });
  };
  useEffect(() => {
    resetForm({
      values:{
        available_renewable_energy: get_moderator_energy?.available_renewable_energy.map((item)=>{
          return{
            type: item.type,
            energy_source: item.energy_source,
            capacity: String(item.capacity || '') || '',
            distribution_method: item.distribution_method || '',
            installation_cost: String(item.installation_cost || '') || '',
            central_grid_fossil: String(item.central_grid_fossil || '') || '',
            central_grid_renewable: String(item.central_grid_renewable||'') || '',
            local_renewable_microgrid: String(item.local_renewable_microgrid || '') || '',
            distance_to_pumps: item?.distance_to_pumps || ''
          }
        })
      }
    })
    setSelectedStatus(get_moderator_energy?.available_renewable_energy.map((item) => item.type))
  },[get_moderator_energy])
  console.log("errrr", errors)
  if (isTypeLoading || isLoading) {
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
        headerName={t(`energy`)}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <MultiselectDropdown
          containerStyle={{ marginTop: '5%', paddingTop: 0 }}
          data={get_moderator_energy_dropdown?.type_of_energy_sources.map((item) => {
                                            return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                                        })}
          setSelectedd={handleStatusChange}
          selectedd={selectedStatus}
          infoName={t('Available renewable energy sources')}
        />
        {values?.available_renewable_energy?.length > 0 && (
         <>
            {values?.available_renewable_energy.map((item, index) => {
              return <>
                <View style={[styles.subArea, { marginTop: '3%' }]}>
                  <Text
                    style={[
                      Styles.fieldLabel,
                      { marginTop: 4, alignSelf: 'center', textTransform:'capitalize' },
                    ]}>
                    {/* {t(`${t('Type')} ${index + 1}`)} */}
                    {get_moderator_energy_dropdown?.type_of_energy_sources.find((i) => item?.type == i?._id) ? get_moderator_energy_dropdown?.type_of_energy_sources.find((i) => item?.type == i?._id)?.name[USER_PREFERRED_LANGUAGE] : item?.type}
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
                      <View style={{ width: '100%' }}>
                            <SwitchButton
                              nested={true}
                              nolabel={false}
                              label={t('Is the village using this energy source?')}
                              selected={item?.energy_source}
                              firstBtnPress={() => handleFieldChange(
                                index,
                                'energy_source',
                                true,
                              )}
                              secondBtnPress={() => {
                                handleFieldChange(
                                  index,
                                  'energy_source',
                                  false,
                                )
                              }}
                              firstBtnText={t('yes')}
                              secondBtntext={t('no')}
                            />
                            {item?.energy_source &&
                              <>
                                <Input
                                  label={t(
                                    `${t(
                                      'Capacity'
                                    )} `
                                    // ${water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id) ? water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id)?.name[USER_PREFERRED_LANGUAGE] : item?.type} `,
                                  )}
                                  value={item.capacity}
                                  placeholder={'0'}
                                  fullLength={true}
                                  keyboardType="numeric"
                                  onChangeText={text =>
                                    handleFieldChange(
                                      index,
                                      'capacity',
                                      parseInt(text),
                                    )
                                  }
                                  isRight={
                                    <AcresElement title={'kWh'} />
                                  }
                                />
                                {errors.available_renewable_energy &&
                                  errors.available_renewable_energy[index]
                                    ?.capacity && (
                                    <Text style={Styles.error2}>
                                      {
                                        errors.available_renewable_energy[index]
                                          .capacity
                                      }
                                    </Text>
                                  )}
                          <MultiselectDropdown
                            containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                            data={get_moderator_energy_dropdown?.distribution_method.map((item) => {
                              return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                            })}
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
                          {errors.available_renewable_energy &&
                            errors.available_renewable_energy[index]
                              ?.distribution_method && (
                              <Text style={Styles.error2}>
                                {
                                errors.available_renewable_energy[index]
                                    .distribution_method
                                }
                              </Text>
                            )}
                          <Input
                            label={t(
                              `${t(
                                'Installation Cost'
                              )} `
                              // ${water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id) ? water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id)?.name[USER_PREFERRED_LANGUAGE] : item?.type} `,
                            )}
                            value={item.installation_cost}
                            placeholder={'0'}
                            fullLength={true}
                            keyboardType="numeric"
                            onChangeText={text =>
                              handleFieldChange(
                                index,
                                'installation_cost',
                                parseInt(text),
                              )
                            }
                            isRight={
                              <AcresElement title={user?.currency} />
                            }
                          />
                          {errors.available_renewable_energy &&
                            errors.available_renewable_energy[index]
                            ?.installation_cost && (
                              <Text style={Styles.error2}>
                                {
                                  errors.available_renewable_energy[index]
                                    .installation_cost
                                }
                              </Text>
                            )}
                          <Text style={Styles.fieldLabel}>{t("Percentage distribution of village electricity:")}</Text>
                          <Input
                            label={t(
                              `${t(
                                'Central grid fossil based'
                              )} `
                              // ${water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id) ? water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id)?.name[USER_PREFERRED_LANGUAGE] : item?.type} `,
                            )}
                            value={item.central_grid_fossil}
                            placeholder={'0'}
                            fullLength={true}
                            keyboardType="numeric"
                            onChangeText={text =>
                              handleFieldChange(
                                index,
                                'central_grid_fossil',
                                parseInt(text),
                              )
                            }
                            isRight={
                              <AcresElement title={'%'} />
                            }
                          />
                          {errors.available_renewable_energy &&
                            errors.available_renewable_energy[index]
                            ?.central_grid_fossil && (
                              <Text style={Styles.error2}>
                                {
                                  errors.available_renewable_energy[index]
                                  .central_grid_fossil
                                }
                              </Text>
                            )}
                          <Input
                            label={t(
                              `${t(
                                'Central grid renewable'
                              )} `
                              // ${water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id) ? water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id)?.name[USER_PREFERRED_LANGUAGE] : item?.type} `,
                            )}
                            value={item.central_grid_renewable}
                            placeholder={'0'}
                            fullLength={true}
                            keyboardType="numeric"
                            onChangeText={text =>
                              handleFieldChange(
                                index,
                                'central_grid_renewable',
                                parseInt(text),
                              )
                            }
                            isRight={
                              <AcresElement title={'%'} />
                            }
                          />
                          {errors.available_renewable_energy &&
                            errors.available_renewable_energy[index]
                            ?.central_grid_renewable && (
                              <Text style={Styles.error2}>
                                {
                                  errors.available_renewable_energy[index]
                                  .central_grid_renewable
                                }
                              </Text>
                            )}
                          <Input
                            label={t(
                              `${t(
                                'Local renewable microgrid'
                              )} `
                              // ${water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id) ? water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id)?.name[USER_PREFERRED_LANGUAGE] : item?.type} `,
                            )}
                            value={item.local_renewable_microgrid}
                            placeholder={'0'}
                            fullLength={true}
                            keyboardType="numeric"
                            onChangeText={text =>
                              handleFieldChange(
                                index,
                                'local_renewable_microgrid',
                                parseInt(text),
                              )
                            }
                            isRight={
                              <AcresElement title={'%'} />
                            }
                          />
                          {errors.available_renewable_energy &&
                            errors.available_renewable_energy[index]
                            ?.local_renewable_microgrid && (
                              <Text style={Styles.error2}>
                                {
                                  errors.available_renewable_energy[index]
                                  .local_renewable_microgrid
                                }
                              </Text>
                            )}
                            <CustomDropdown
                            data={get_moderator_energy_dropdown?.distance_of_fuel_pumps.map((item) => {
                                                                      return { label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id }
                                                                    })
                              }
                              value={item?.distance_to_pumps}
                              label={t('How far is Petrol or Diesel Pumps?')}
                              onChange={value => {
                                handleFieldChange(
                                  index,
                                  'distance_to_pumps',
                                  value?.value,
                                )
                              }}
                            />
                            {errors.available_renewable_energy &&
                              errors.available_renewable_energy[index]
                              ?.distance_to_pumps && (
                                <Text style={Styles.error2}>
                                  {
                                  errors.available_renewable_energy[index]
                                    .distance_to_pumps
                                  }
                                </Text>
                              )}
                              </>
                            }
                          </View>
                    </View>
                    </View>
            }
              </>
            })}
         </>
        )}
            
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

export default OfficerEnergy

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