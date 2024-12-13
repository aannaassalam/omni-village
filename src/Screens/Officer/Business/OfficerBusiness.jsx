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
import SwitchButton from '../../../Components/SwitchButtons/SwitchButton';
import Input from '../../../Components/Inputs/Input';
import YearPicker from '../../../Components/YearPicker/YearPicker';
import { addModeratorBusiness, editModeratorBusiness, getModeratorBusiness } from '../../../functions/moderator';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

const OfficerBusiness = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { village_id } = route.params
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState([])
  const queryClient = useQueryClient()
  const { data: get_moderator_business, isLoading: isTypeLoading } = useQuery({
    queryKey: [`get_moderator_business`],
    queryFn: () => getModeratorBusiness(village_id),
    enabled: village_id ? true : false,
    refetchOnWindowFocus: true,
  })

  const { mutate: edit_moderator_business } = useMutation({
    mutationKey: ['edit_moderator_business'],
    mutationFn: async (data) => {
      editModeratorBusiness(data)
      queryClient.invalidateQueries()
    },
    onSuccess: (data) => { console.log("successsssss edit", data, navigation.replace('officerHome', { village_id: village_id })) },
    onError: (error) => console.log("error save", error),
    onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const { mutate: add_moderator_business } = useMutation({
    mutationKey: ['add_moderator_business'],
    mutationFn: async (data) => {
      addModeratorBusiness(data)
      queryClient.invalidateQueries()
    },
    onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('officerHome', { village_id: village_id }) },
    onError: (error) => console.log("error save", error),
    onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const scheme = yup.object().shape({
    organisation_not_owned_by_villagers: yup
      .boolean()
      .required(t('Organisation not owned by villagers is required')),
    how_many_establishment: yup
      .array()
      .of(
        yup.object().shape({
          name: yup.string().required(t('Name is required')),
          type: yup.string().required(t('Type is required')),
          purpose: yup.string().required(t('Purpose is required')),
          year_started: yup.string().required(t('Year Started is required')),
        }),
      )
    // type: yup
    //   .string(),
    // year_started: yup
    //   .string(),
    // purpose: yup
    //   .string(),
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
      how_many_establishment: []
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
      setSavepopup(true)
    },

  });
  const onSubmit = () => {
    let data = {
      organisation_not_owned_by_villagers: values.organisation_not_owned_by_villagers,
      how_many_establishment: values.how_many_establishment.map((item) => {
        return {
          name: item.name,
          type: item.type,
          purpose: item.purpose,
          year_started: item.year_started
        }
      })
    }
    if (get_moderator_business?._id) {
      edit_moderator_business({ ...data, business_id: get_moderator_business?._id })
    } else {
      add_moderator_business({ ...data, village_id })
    }
  }
  const handleDraft = () => { }
  const handleFieldChange = (index, field, value) => {
    const newDetailsOfLand = [...values.how_many_establishment];
    newDetailsOfLand[index][field] = value;
    setValues({ ...values, how_many_establishment: newDetailsOfLand });
  };

  const handleStatusChange = (selectedItems) => {
    setSelectedStatus(selectedItems);

    // Update `purpose_status_of_land` based on the selected items
    const updatedPurposeStatusOfLand = Array.from({ length: selectedItems }, (item, index) => {
      // Check if this `type` already exists in `purpose_status_of_land`
      const existingEntry = values.how_many_establishment.find(
        (entry, indx) => indx === index
      );

      return existingEntry || {
        name: '',
        type: '',
        purpose: "",
        year_started: "",
      };
    });
    // Update the form's purpose_status_of_land field
    setFieldValue('how_many_establishment', updatedPurposeStatusOfLand);
  };
  const [collapseStates, setCollapseStates] = useState([]);

  useEffect(() => {
    // Initialize collapseStates with false for all vehicles
    if (values?.how_many_establishment?.length > 0) {
      setCollapseStates(Array(values?.how_many_establishment?.length).fill(true));
    }
  }, [values?.how_many_establishment]);
  useEffect(() => {
    resetForm({
      values: {
        organisation_not_owned_by_villagers: get_moderator_business?.organisation_not_owned_by_villagers,
        how_many_establishment: get_moderator_business?.how_many_establishment.map((item) => {
          return {
            name: item.name,
            type: item.type,
            purpose: item.purpose,
            year_started: item.year_started
          }
        })
      }
    })
    setSelectedStatus(String(get_moderator_business?.how_many_establishment.length))
  }, [get_moderator_business])
  console.log("sele", selectedStatus)
  if (isTypeLoading) {
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
        {/* {values?.organisation_not_owned_by_villagers ?
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
        } */}
        <Input
          label={t(
            `How many establishment/ organisation ?`
          )}
          value={selectedStatus}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={(e) => handleStatusChange(e)}
        />
        {values?.how_many_establishment?.length > 0 &&
          <>
            {values?.how_many_establishment.map((item, index) => {
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
                    style={[styles.divider, { width: '74%' }]}
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
                      <Input
                        label={t(
                          `Type`
                        )}
                        value={item?.type}
                        placeholder={''}
                        fullLength={true}
                        keyboardType="default"
                        onChangeText={value => {
                          handleFieldChange(
                            index,
                            'type',
                            value,
                          )
                        }}
                      />
                      {errors.how_many_establishment &&
                        errors.how_many_establishment[index]
                          ?.type && (
                          <Text style={Styles.error2}>
                            {
                              errors.how_many_establishment[index]
                                .type
                            }
                          </Text>
                        )}
                      <Input
                        label={t(
                          `Name`
                        )}
                        value={item?.name}
                        placeholder={''}
                        fullLength={true}
                        keyboardType="default"
                        onChangeText={value => {
                          handleFieldChange(
                            index,
                            'name',
                            value,
                          )
                        }}
                      />
                      {errors.how_many_establishment &&
                        errors.how_many_establishment[index]
                          ?.name && (
                          <Text style={Styles.error2}>
                            {
                              errors.how_many_establishment[index]
                                .name
                            }
                          </Text>
                        )}

                      <YearPicker
                        onYearChange={(year) => {
                          handleFieldChange(
                            index,
                            'year_started',
                            parseInt(year),
                          )
                        }}
                        selectedYear={item?.year_started}
                        label={t('Year started')}
                      />
                      {errors.how_many_establishment &&
                        errors.how_many_establishment[index]
                          ?.year_started && (
                          <Text style={Styles.error2}>
                            {
                              errors.how_many_establishment[index]
                                .year_started
                            }
                          </Text>
                        )}
                      <Input
                        label={t(
                          `Purpose`
                        )}
                        value={item?.purpose}
                        placeholder={''}
                        fullLength={true}
                        keyboardType="default"
                        onChangeText={value => {
                          handleFieldChange(
                            index,
                            'purpose',
                            value,
                          )
                        }}
                      />
                      {errors.how_many_establishment &&
                        errors.how_many_establishment[index]
                          ?.purpose && (
                          <Text style={Styles.error2}>
                            {
                              errors.how_many_establishment[index]
                                .purpose
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
})