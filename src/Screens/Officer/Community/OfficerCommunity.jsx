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
import CustomDropdown from '../../../Components/CustomDropdown/CustomDropdown';
import MultiselectDropdown from '../../../Components/MultiselectDropdown/MultiselectDropdown';
import Input from '../../../Components/Inputs/Input';
import { useQuery } from '@tanstack/react-query';
import { getModeratorCommunityInfrastructure, getModeratorCommunityInfrastructureDropdown } from '../../../functions/moderator';
import { USER_PREFERRED_LANGUAGE } from '../../../i18next';

const OfficerCommunity = ({ navigation, route }) => {
  const { t } = useTranslation()
  const [sewage, setSewage] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState([]);
  const {village_id} = route.params
  const { data: get_moderator_community_dropdown, isLoading } = useQuery({
    queryKey: [`get_moderator_community_dropdown`],
    queryFn: () => getModeratorCommunityInfrastructureDropdown(),
    refetchOnWindowFocus: true,
  })
  const { data: get_moderator_community, isLoading: isTypeLoading } = useQuery({
    queryKey: [`get_moderator_community`],
    queryFn: () => getModeratorCommunityInfrastructure(village_id),
    enabled: village_id ? true : false,
    refetchOnWindowFocus: true,
  })
  const scheme = yup.object().shape({
    // education: yup.array().of(
    //   yup.object().shape({
    //     type: yup.string().required(t('Type is required')),
    //     number: yup.string().required(t('Number is required')),
    //     how_far_from_village: yup.string().required(t('How far from the village is required')),
    //   })
    // ).required(t('Education is required')).min(1, 'Atleast one education is required'),
    town_hall: yup.boolean().required(t('Town hall is required')),
    town_hall_purpose: yup.array().test(
      'describe-required-if-safety-issues',
      t('Purpose is required'),
      function (value) {
        const { town_hall } = this.parent;

        if (town_hall) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true;
      }
    ),
    market: yup.boolean().required(t('Market is required')),
    how_many_market: yup.array().test(
      'how-many-market-required',
      t('How many is required'),
      function (value) {
        // console.log("market", market, value)
        const { market } = this.parent;
        if (market) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    bank: yup.boolean().required(t('Bank is required')),
    how_many_bank: yup.array().test(
      'how-many-bank-required',
      t('How many is required'),
      function (value) {
        const { bank } = this.parent;
        if (bank) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    how_far_from_village_bank: yup.string().test(
      'how_far_from_village_bank-required',
      t('How far from village is required'),
      function (value) {
        const { bank } = this.parent;
        if (bank) {
          return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    health_care: yup.boolean().required(t('Health care is required')),
    how_many_healthcare: yup.array().test(
      'how-many-healthcare-required',
      t('How many is required'),
      function (value) {
        const { health_care } = this.parent;
        if (health_care) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    how_far_from_village_healthcare: yup.string().test(
      'how_far_from_village_bank-required',
      t('How far from village is required'),
      function (value) {
        const { health_care } = this.parent;
        if (health_care) {
          return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    library: yup.boolean().required(t('Library is required')),
    how_many_library: yup.array().test(
      'how-many-library-required',
      t('How many is required'),
      function (value) {
        const { library } = this.parent;
        if (library) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    museum: yup.boolean().required(t('Museum is required')),
    how_many_museum: yup.array().test(
      'how-many-museum-required',
      t('How many is required'),
      function (value) {
        const { museum } = this.parent;
        if (museum) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
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
      // education: [],
      town_hall: false,
      town_hall_purpose: [],
      market: false,
      how_many_market: [],
      bank: false,
      how_many_bank: [],
      how_far_from_village_bank: '',
      health_care: false,
      how_many_healthcare: [],
      how_far_from_village_healthcare: '',
      library: false,
      how_many_library: [],
      museum: false,
      how_many_museum: [],
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
      navigation.navigate('officerCommunitySports', { community: values, village_id, data: get_moderator_community })
    },

  });
  // console.log("errorrr", errors)
  const handleFieldChange = (index, field, value) => {
    const newDetailsOfLand = [...values.education];
    newDetailsOfLand[index][field] = value;
    setValues({ ...values, education: newDetailsOfLand });
  };

  // const handleStatusChange = (selectedItems) => {
  //   setSelectedStatus(selectedItems);

  //   // Update `purpose_status_of_land` based on the selected items
  //   const updatedPurposeStatusOfLand = selectedItems.map((item) => {
  //     // Check if this `type` already exists in `purpose_status_of_land`
  //     const existingEntry = values.education.find(
  //       entry => entry.type === item
  //     );

  //     return existingEntry || {
  //       type: item,
  //       number: '',
  //       how_far_from_village: '',
  //     };
  //   });
  //   // Update the form's purpose_status_of_land field
  //   setFieldValue('education', updatedPurposeStatusOfLand);
  // };
  // const [collapseStates, setCollapseStates] = useState([]);

  // useEffect(() => {
  //   // Initialize collapseStates with false for all vehicles
  //   if (values?.education.length > 0) {
  //     setCollapseStates(Array(values.education.length).fill(true));
  //   }
  // }, [values?.education]);

  // const toggleCollapse = (index) => {
  //   setCollapseStates((prevStates) => {
  //     // Create a new array to avoid mutating the state directly
  //     const newStates = [...prevStates];
  //     newStates[index] = !newStates[index]; // Toggle the specific index
  //     return newStates;
  //   });
  // };
  useEffect(()=>{
    resetForm({
      values: {
        town_hall: get_moderator_community?.town_hall || false,
        town_hall_purpose: get_moderator_community?.town_hall_purpose || [],
        market: get_moderator_community?.market || false,
        how_many_market: get_moderator_community?.how_many_market ||[],
        bank: get_moderator_community?.bank || false,
        how_many_bank: get_moderator_community?.how_many_bank ||[],
        how_far_from_village_bank: get_moderator_community?.how_far_from_village_bank || '',
        health_care: get_moderator_community?.health_care || false,
        how_many_healthcare: get_moderator_community?.how_many_healthcare ||[],
        how_far_from_village_healthcare: get_moderator_community?.how_far_from_village_healthcare || '',
        library: get_moderator_community?.library || false,
        how_many_library: get_moderator_community?.how_many_library ||[],
        museum: get_moderator_community?.museum || false,
        how_many_museum: get_moderator_community?.how_many_museum ||[],
      },
    })
  }, [get_moderator_community])
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
        headerName={t(`community`)}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        {/* <MultiselectDropdown
          containerStyle={{ marginTop: '5%', paddingTop: 0 }}
          data={[{ key: '6736117ecb51156c2f52383e', name: 'test' }, { key: '6736117ecb51156c2f59383e', name: 'test2' }]}
          setSelectedd={handleStatusChange}
          selectedd={selectedStatus}
          infoName={t('Education')}
        />
        {touched?.education && errors?.education && (
          <Text style={Styles.error2}>{String(errors?.education)}</Text>
        )}
        {values?.education?.length > 0 &&
          <>
            {values?.education?.map((item, index) => {
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
                      <Input
                        label={t('Enter the Number')}
                        value={item?.number}
                        placeholder={''}
                        fullLength={true}
                        keyboardType="numeric"
                        onChangeText={value => {
                          handleFieldChange(
                            index,
                            'number',
                            value,
                          )
                        }}
                      />
                      {errors.education &&
                        errors.education[index]
                          ?.number && (
                          <Text style={Styles.error2}>
                            {
                              errors.education[index]
                                .number
                            }
                          </Text>
                        )}
                      <CustomDropdown
                        data={
                          [{ label: '1 Kilometer', value: '6736117ecb51156c2f52383e' }, { label: '2 Kilometer', value: '6736117ecb51155c2f52383e' }]
                        }
                        value={item?.how_far_from_village}
                        label={t('How far from village?')}
                        onChange={value => {
                          handleFieldChange(
                            index,
                            'how_far_from_village',
                            value?.value,
                          )
                        }}
                      />
                      {errors.education &&
                        errors.education[index]
                          ?.how_far_from_village && (
                          <Text style={Styles.error2}>
                            {
                              errors.education[index]
                                .how_far_from_village
                            }
                          </Text>
                        )}

                    </View>
                  </View>
                }
              </>
            })}
          </>
        } */}
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.town_hall}
          label={t('Town hall')}
          onChange={value => {
            setValues({
              ...values,
              town_hall: value?.value,
            });
          }}
        />
        {touched?.town_hall && errors?.town_hall && (
          <Text style={Styles.error2}>{String(errors?.town_hall)}</Text>
        )}
        {values?.town_hall &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={get_moderator_community_dropdown?.no_of_townhall.map((item) => {
                                                  return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                                              })}
                setSelectedd={(value) => {
                  setValues({ ...values, town_hall_purpose: value });
                }}
                selectedd={values?.town_hall_purpose}
                infoName={t('Purpose')}
              />
              {errors.town_hall_purpose &&
                touched.town_hall_purpose && (
                  <Text style={Styles.error2}>
                    {
                      errors.town_hall_purpose
                    }
                  </Text>
                )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.market}
          label={t('Market')}
          onChange={value => {
            setValues({
              ...values,
              market: value?.value,
            });
          }}
        />
        {touched?.market && errors?.market && (
          <Text style={Styles.error2}>{String(errors?.market)}</Text>
        )}
        {values?.market &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={get_moderator_community_dropdown?.no_of_market.map((item) => {
                                                  return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                                              })}
                setSelectedd={(value) => {
                  setValues({ ...values, how_many_market: value });
                }}
                selectedd={values?.how_many_market}
                infoName={t('How many?')}
              />
              {errors.how_many_market &&
                touched.how_many_market && (
                  <Text style={Styles.error2}>
                    {
                      errors.how_many_market
                    }
                  </Text>
                )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.bank}
          label={t('Bank')}
          onChange={value => {
            setValues({
              ...values,
              bank: value?.value,
            });
          }}
        />
        {touched?.bank && errors?.bank && (
          <Text style={Styles.error2}>{String(errors?.bank)}</Text>
        )}
        {values?.bank &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={get_moderator_community_dropdown?.no_of_bank.map((item) => {
                  return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                })}
                setSelectedd={(value) => {
                  setValues({ ...values, how_many_bank: value });
                }}
                selectedd={values?.how_many_bank}
                infoName={t('How many?')}
              />
              {errors.how_many_bank &&
                touched.how_many_bank && (
                  <Text style={Styles.error2}>
                    {
                      errors.how_many_bank
                    }
                  </Text>
                )}
              <CustomDropdown
                data={
                  get_moderator_community_dropdown?.distance_of_bank.map((item) => {
                               return { label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id }
                             })
                }
                value={values?.how_far_from_village_bank}
                label={t('How far from village')}
                onChange={value => {
                  setValues({
                    ...values,
                    how_far_from_village_bank: value?.value,
                  });
                }}
              />
              {touched?.how_far_from_village_bank && errors?.how_far_from_village_bank && (
                <Text style={Styles.error2}>{String(errors?.how_far_from_village_bank)}</Text>
              )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.health_care}
          label={t('Health care')}
          onChange={value => {
            setValues({
              ...values,
              health_care: value?.value,
            });
          }}
        />
        {touched?.health_care && errors?.health_care && (
          <Text style={Styles.error2}>{String(errors?.health_care)}</Text>
        )}
        {values?.health_care &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={get_moderator_community_dropdown?.no_of_healthcare.map((item) => {
                                                  return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                                              })}
                setSelectedd={(value) => {
                  setValues({ ...values, how_many_healthcare: value });
                }}
                selectedd={values?.how_many_healthcare}
                infoName={t('How many?')}
              />
              {errors.how_many_healthcare &&
                touched.how_many_healthcare && (
                  <Text style={Styles.error2}>
                    {
                      errors.how_many_healthcare
                    }
                  </Text>
                )}
              <CustomDropdown
                data={
                  get_moderator_community_dropdown?.distance_of_healthcare.map((item) => {
                                return { label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id }
                              })
                }
                value={values?.how_far_from_village_healthcare}
                label={t('How far from village')}
                onChange={value => {
                  setValues({
                    ...values,
                    how_far_from_village_healthcare: value?.value,
                  });
                }}
              />
              {touched?.how_far_from_village_healthcare && errors?.how_far_from_village_healthcare && (
                <Text style={Styles.error2}>{String(errors?.how_far_from_village_healthcare)}</Text>
              )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.library}
          label={t('Library')}
          onChange={value => {
            setValues({
              ...values,
              library: value?.value,
            });
          }}
        />
        {touched?.library && errors?.library && (
          <Text style={Styles.error2}>{String(errors?.library)}</Text>
        )}
        {values?.library &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={get_moderator_community_dropdown?.no_of_library.map((item) => {
                                                  return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                                              })}
                setSelectedd={(value) => {
                  setValues({ ...values, how_many_library: value });
                }}
                selectedd={values?.how_many_library}
                infoName={t('How many?')}
              />
              {errors.how_many_library &&
                touched.how_many_library && (
                  <Text style={Styles.error2}>
                    {
                      errors.how_many_library
                    }
                  </Text>
                )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.museum}
          label={t('Museum')}
          onChange={value => {
            setValues({
              ...values,
              museum: value?.value,
            });
          }}
        />
        {touched?.museum && errors?.museum && (
          <Text style={Styles.error2}>{String(errors?.museum)}</Text>
        )}
        {values?.museum &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={get_moderator_community_dropdown?.no_of_museum.map((item) => {
                  return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                })}
                setSelectedd={(value) => {
                  setValues({ ...values, how_many_museum: value });
                }}
                selectedd={values?.how_many_museum}
                infoName={t('How many?')}
              />
              {errors.how_many_museum &&
                touched.how_many_museum && (
                  <Text style={Styles.error2}>
                    {
                      errors.how_many_museum
                    }
                  </Text>
                )}
            </View>
          </View>
        }
      </KeyboardAwareScrollView>
      <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <CustomButton btnText={t('next')} onPress={handleSubmit} style={{ width: '100%' }} />
      </View>
    </View>
  )
}

export default OfficerCommunity

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