import {
  ActivityIndicator,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Styles, width} from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {useTranslation} from 'react-i18next';
import Geolocation from 'react-native-geolocation-service';
import {Divider, TextInput} from 'react-native-paper';
import {fontFamilyMedium} from '../../styles/fontStyle';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {useFormik} from 'formik';
import Input from '../../Components/Inputs/Input';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';
import AcresElement from '../../Components/ui/AcresElement';
import {useUser} from '../../Hooks/useUser';
import YearPicker from '../../Components/YearPicker/YearPicker';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import {borderColor, primaryColor} from '../../styles/colors';
import PopupModal from '../../Components/Popups/PopupModal';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  addLandholding,
  editLandholding,
  getLandholdingDropdown,
} from '../../functions/landholding';
import {USER_PREFERRED_LANGUAGE} from '../../i18next';

const LandSpecification = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {t} = useTranslation();
  const {landholding, land, landholding_id, data} = route.params;
  const [savePopup, setSavepopup] = useState(false);
  const [draftPopup, setDraftpopup] = useState(false);
  const {data: user} = useUser();
  const queryClient = useQueryClient();
  const {data: landholding_dropdown, isLoading} = useQuery({
    queryKey: ['landholding_dropdown'],
    queryFn: () => getLandholdingDropdown(),
    refetchOnWindowFocus: true,
  });
  const {mutate: add_landholding} = useMutation({
    mutationKey: ['add_landholding'],
    mutationFn: async data => {
      addLandholding(data);
      queryClient.invalidateQueries();
    },
    onSuccess: data => {
      navigation.replace('landSpecificationQuestioner');
    },
    onError: error => console.log('error save', error),
    onSettled: () => {
      setDraftpopup(false), setSavepopup(false);
    },
  });
  const {mutate: edit_landholding} = useMutation({
    mutationKey: ['edit_landholding'],
    mutationFn: async data => {
      editLandholding(data);
      queryClient.invalidateQueries();
    },
    onSuccess: data => {
      navigation.replace('landSpecificationQuestioner');
    },
    onError: error => console.log('error save', error),
    onSettled: () => {
      setDraftpopup(false), setSavepopup(false);
    },
  });

  const scheme = yup.object().shape({
    land_under_use: yup.boolean().required(t('Land used is required')),
    purpose_status_of_land: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string().required('Type is required'),
          type_category: yup.array().required(t('Category is required')),
          total_land_area_utilised: yup
            .number()
            .required(t('Total land area utilised is required')),
        }),
      )
      .test(
        'status-of-land-is-required',
        t('purpose status of land for is required'),
        function (value) {
          const {land_under_use} = this.parent; // Accessing other field values
          if (!land_under_use && (!value || value.length === 0)) {
            return this.createError({
              path: 'purpose_status_of_land',
              message: t('At least one status of land is required'),
            });
          }
          return true; // Otherwise, no validation
        },
      ),
    purpose_land_utilised_for: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string().required('Type is required'),
          type_category: yup
            .array()
            .required(t('Category is required'))
            .max(20, 'Category cannot be greater than 20!')
            .min(1, t('At least one Category is required')),
          total_land_area_utilised: yup
            .number()
            .required(t('Total land area utilised is required')),
        }),
      )
      .test(
        'land-under-used-is-required',
        t('Purpose utilised for is required'),
        function (value) {
          const {land_under_use} = this.parent; // Accessing other field values
          if (land_under_use && (!value || value.length === 0)) {
            return this.createError({
              path: 'purpose_land_utilised_for',
              message: t('At least one Purpose utilised for is required'),
            });
          }
          return true; // Otherwise, no validation
        },
      ),
  });

  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    setFieldTouched,
    touched,
    resetForm,
    setFieldValue,
    setValues,
  } = useFormik({
    initialValues: {
      land_under_use: false,
      purpose_land_utilised_for: [],
      purpose_status_of_land: [],
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      // navigation.navigate('landholdingLandRequirement', { landholding, land, specification: values })
      if (selectedStatus.length > 0 || selectedStatusSecond.length > 0) {
        setSavepopup(true);
      } else {
        ToastAndroid.show('Please select one value', ToastAndroid.BOTTOM);
      }
    },
  });
  const [selectedStatus, setSelectedStatus] = useState([]);
  const [selectedStatusSecond, setSelectedStatusSecond] = useState([]);
  const handleFieldChange = (index, field, value) => {
    const newDetailsOfLand = [...values.purpose_land_utilised_for];
    newDetailsOfLand[index][field] = value;
    setValues({...values, purpose_land_utilised_for: newDetailsOfLand});
  };
  const handleFieldChangeSecond = (index, field, value) => {
    const newDetailsOfLand = [...values.purpose_status_of_land];
    newDetailsOfLand[index][field] = value;
    setValues({...values, purpose_status_of_land: newDetailsOfLand});
  };
  const handleDraft = () => {
    if (landholding_id) {
      console.log('here2');
      let data = {
        ...landholding,
        landholding_id: landholding_id,
        land_under_use: values.land_under_use,
        purpose_land_utilised_for: values.purpose_land_utilised_for,
        purpose_status_of_land: values.purpose_status_of_land,
      };
      edit_landholding({...data, status: 0});
    } else {
      console.log('herew4');
      let data = {
        ...landholding,
        land_under_use: values.land_under_use,
        purpose_status_of_land: values.purpose_status_of_land,
        purpose_land_utilised_for: values.purpose_land_utilised_for,
      };
      add_landholding({...data, status: 0});
    }
  };
  const onSubmit = () => {
    if (landholding_id) {
      let data = {
        ...landholding,
        landholding_id: landholding_id,
        land_under_use: values.land_under_use,
        purpose_land_utilised_for: values.purpose_land_utilised_for,
        purpose_status_of_land: values.purpose_status_of_land,
      };
      edit_landholding({...data, status: 1});
    } else {
      let data = {
        ...landholding,
        land_under_use: values.land_under_use,
        purpose_status_of_land: values.purpose_status_of_land,
        purpose_land_utilised_for: values.purpose_land_utilised_for,
      };
      add_landholding({...data, status: 1});
    }
  };
  useEffect(() => {
    resetForm({
      values: {
        land_under_use: data?.land_under_use || false,
        purpose_land_utilised_for: data?.purpose_land_utilised_for
          ? data?.purpose_land_utilised_for.map(item => {
              return {
                type: item.type,
                total_land_area_utilised: String(item.total_land_area_utilised),
                type_category: item.type_category,
              };
            })
          : [],
        purpose_status_of_land: data?.purpose_status_of_land
          ? data?.purpose_status_of_land.map(item => {
              return {
                type: item.type,
                total_land_area_utilised: String(item.total_land_area_utilised),
                type_category: item.type_category,
              };
            })
          : [],
      },
    });
    setSelectedStatus(
      data?.purpose_status_of_land
        ? data?.purpose_status_of_land.map(item => item.type)
        : [],
    );
    setSelectedStatusSecond(
      data?.purpose_land_utilised_for
        ? data?.purpose_land_utilised_for.map(item => item.type)
        : [],
    );
  }, [data]);
  const handleStatusChange = selectedItems => {
    setSelectedStatus(selectedItems);

    // Update `purpose_status_of_land` based on the selected items
    const updatedPurposeStatusOfLand = selectedItems.map(item => {
      // Check if this `type` already exists in `purpose_status_of_land`
      const existingEntry = values.purpose_status_of_land.find(
        entry => entry.type === item,
      );

      return (
        existingEntry || {
          type: item || '', // set `type` as the item's `key`
          total_land_area_utilised: '',
          type_category: [],
        }
      );
    });
    // Update the form's purpose_status_of_land field
    setFieldValue('purpose_status_of_land', updatedPurposeStatusOfLand);
  };
  const handleStatusChangeSecond = selectedItems => {
    setSelectedStatusSecond(selectedItems);

    // Update `purpose_status_of_land` based on the selected items
    const updatedPurposeStatusOfLand = selectedItems.map(item => {
      // Check if this `type` already exists in `purpose_status_of_land`
      const existingEntry = values.purpose_land_utilised_for.find(
        entry => entry.type === item,
      );

      return (
        existingEntry || {
          type: item || '', // set `type` as the item's `key`
          total_land_area_utilised: '',
          type_category: [],
        }
      );
    });
    // Update the form's purpose_status_of_land field
    setFieldValue('purpose_land_utilised_for', updatedPurposeStatusOfLand);
  };
  console.log('datatatata', data);
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
        <ActivityIndicator size={'large'} color={primaryColor} />
      </View>
    );
  }
  console.log('herererrereer', values.purpose_land_utilised_for);
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={`${t('landholding')}(${land})`}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 140, paddingHorizontal: 22}}>
        <View style={[styles.subArea, {marginTop: '3%'}]}>
          <Text
            style={[
              Styles.fieldLabel,
              {marginTop: 4, alignSelf: 'center', color: '#000'},
            ]}>
            {t('landholding specification')}
          </Text>
          <Divider
            bold={true}
            style={[styles.divider, {width: '54%'}]}
            horizontalInset={true}
          />
        </View>
        <CustomDropdown
          data={[
            {id: 1, label: 'Yes', value: true},
            {id: 2, label: 'No', value: false},
          ]}
          value={values.land_under_use}
          label={t('Is the Land under use?')}
          onChange={value => {
            if (value?.value === true) {
              setValues(prevValues => ({
                ...prevValues,
                land_under_use: value?.value,
                purpose_status_of_land: [],
              }));
              setSelectedStatus([]);
            } else {
              setValues(prevValues => ({
                ...prevValues,
                land_under_use: value?.value,
                purpose_land_utilised_for: [],
              }));
              setSelectedStatusSecond([]);
            }
          }}
        />
        {touched?.land_under_use && errors?.land_under_use && (
          <Text style={Styles.error2}>{String(errors?.land_under_use)}</Text>
        )}
        {values?.land_under_use ? (
          <>
            <MultiselectDropdown
              containerStyle={{marginTop: '5%', paddingTop: 0}}
              data={landholding_dropdown?.purpose.map(item => {
                return {
                  name: item?.name?.[USER_PREFERRED_LANGUAGE],
                  key: item?._id,
                };
              })}
              setSelectedd={handleStatusChangeSecond}
              selectedd={selectedStatusSecond}
              infoName={t('What are the purposes land utilised for?')}
            />
            {values?.purpose_land_utilised_for.length > 0 && (
              <View style={styles.innerInputView}>
                <Divider style={styles.divider2} />
                <View style={{width: '100%'}}>
                  {values.purpose_land_utilised_for.map((item, index) => (
                    <>
                      <MultiselectDropdown
                        containerStyle={{marginTop: '5%', paddingTop: 0}}
                        data={landholding_dropdown?.[item?.type].map(item => {
                          return {
                            name: item?.name?.[USER_PREFERRED_LANGUAGE],
                            key: item?._id,
                          };
                        })}
                        setSelectedd={item => {
                          handleFieldChange(index, 'type_category', item);
                        }}
                        selectedd={item.type_category}
                        infoName={t(
                          `${t('What type of')} ${
                            landholding_dropdown?.purpose.find(
                              i => item?.type == i?._id,
                            )
                              ? landholding_dropdown?.purpose.find(
                                  i => item?.type == i?._id,
                                )?.name[USER_PREFERRED_LANGUAGE]
                              : item?.type
                          }?`,
                        )}
                      />
                      {errors.purpose_land_utilised_for &&
                        errors.purpose_land_utilised_for[index]
                          ?.type_category && (
                          <Text style={Styles.error2}>
                            {
                              errors.purpose_land_utilised_for[index]
                                .type_category
                            }
                          </Text>
                        )}
                    </>
                  ))}
                </View>
              </View>
            )}
            {values?.purpose_land_utilised_for.length > 0 ? (
              <View style={[styles.subArea, {marginTop: '3%'}]}>
                <Text
                  style={[
                    Styles.fieldLabel,
                    {marginTop: 4, alignSelf: 'center', color: '#000'},
                  ]}>
                  {t('land area specification')}
                </Text>
                <Divider
                  bold={true}
                  style={[styles.divider, {width: '54%'}]}
                  horizontalInset={true}
                />
              </View>
            ) : null}
            {values?.purpose_land_utilised_for.length > 0 && (
              <View>
                {values.purpose_land_utilised_for.map((item, index) => (
                  <>
                    <Input
                      label={t(
                        `${t(
                          'Kindly mention the total land area utilised by',
                        )} ${
                          landholding_dropdown?.purpose.find(
                            i => item?.type == i?._id,
                          )
                            ? landholding_dropdown?.purpose.find(
                                i => item?.type == i?._id,
                              )?.name[USER_PREFERRED_LANGUAGE]
                            : item?.type
                        }`,
                      )}
                      value={item.total_land_area_utilised}
                      placeholder={'0'}
                      fullLength={true}
                      keyboardType="numeric"
                      onChangeText={text =>
                        handleFieldChange(
                          index,
                          'total_land_area_utilised',
                          parseInt(text),
                        )
                      }
                      isRight={
                        <AcresElement title={'sq ft'} />
                      }
                    />
                    {errors.purpose_land_utilised_for &&
                      errors.purpose_land_utilised_for[index]
                        ?.total_land_area_utilised && (
                        <Text style={Styles.error2}>
                          {
                            errors.purpose_land_utilised_for[index]
                              .total_land_area_utilised
                          }
                        </Text>
                      )}
                  </>
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <MultiselectDropdown
              containerStyle={{marginTop: '5%', paddingTop: 0}}
              data={landholding_dropdown?.status.map(item => {
                return {
                  name: item?.name?.[USER_PREFERRED_LANGUAGE],
                  key: item?._id,
                };
              })}
              setSelectedd={handleStatusChange}
              selectedd={selectedStatus}
              infoName={t('What is the status of the land?')}
            />
            {values?.purpose_status_of_land.length > 0 && (
              <View style={styles.innerInputView}>
                <Divider style={styles.divider2} />
                <View style={{width: '100%'}}>
                  {values.purpose_status_of_land.map((item, index) => {
                    return (
                      <>
                        <MultiselectDropdown
                          containerStyle={{marginTop: '5%', paddingTop: 0}}
                          data={landholding_dropdown?.[item?.type].map(item => {
                            return {
                              name: item?.name?.[USER_PREFERRED_LANGUAGE],
                              key: item?._id,
                            };
                          })}
                          setSelectedd={item => {
                            handleFieldChangeSecond(
                              index,
                              'type_category',
                              item,
                            );
                          }}
                          selectedd={item.type_category}
                          infoName={t(
                            `If ${
                              landholding_dropdown?.status.find(
                                i => item?.type == i?._id,
                              )
                                ? landholding_dropdown?.status.find(
                                    i => item?.type == i?._id,
                                  )?.name[USER_PREFERRED_LANGUAGE]
                                : item?.type
                            } ${t('then why')} ?`,
                          )}
                        />
                        {errors.purpose_status_of_land &&
                          errors.purpose_status_of_land[index]
                            ?.type_category && (
                            <Text style={Styles.error2}>
                              {
                                errors.purpose_status_of_land[index]
                                  .type_category
                              }
                            </Text>
                          )}
                      </>
                    );
                  })}
                </View>
              </View>
            )}
            {values?.purpose_status_of_land.length > 0 ? (
              <View style={[styles.subArea, {marginTop: '3%'}]}>
                <Text
                  style={[
                    Styles.fieldLabel,
                    {marginTop: 4, alignSelf: 'center', color: '#000'},
                  ]}>
                  {t('land area specification')}
                </Text>
                <Divider
                  bold={true}
                  style={[styles.divider, {width: '54%'}]}
                  horizontalInset={true}
                />
              </View>
            ) : null}
            {values?.purpose_status_of_land.length > 0 && (
              <View>
                {values.purpose_status_of_land.map((item, index) => {
                  return (
                    <>
                      <Input
                        label={t(
                          `${t(
                            'Kindly mention the total land area not utilised by',
                          )} ${
                            landholding_dropdown?.status.find(
                              i => item?.type == i?._id,
                            )
                              ? landholding_dropdown?.status.find(
                                  i => item?.type == i?._id,
                                )?.name[USER_PREFERRED_LANGUAGE]
                              : item?.type
                          } `,
                        )}
                        value={
                          item.total_land_area_utilised ||
                          String(item.total_land_area_utilised) ||
                          ''
                        }
                        placeholder={'0'}
                        fullLength={true}
                        keyboardType="numeric"
                        onChangeText={text =>
                          handleFieldChangeSecond(
                            index,
                            'total_land_area_utilised',
                            parseInt(text),
                          )
                        }
                        isRight={
                          <AcresElement title={'sq ft'} />
                        }
                      />
                      {errors.purpose_status_of_land &&
                        errors.purpose_status_of_land[index]
                          ?.total_land_area_utilised && (
                          <Text style={Styles.error2}>
                            {
                              errors.purpose_status_of_land[index]
                                .total_land_area_utilised
                            }
                          </Text>
                        )}
                    </>
                  );
                })}
              </View>
            )}
          </>
        )}
      </KeyboardAwareScrollView>
      <View
        style={[
          Styles.bottomBtn,
          {flexDirection: 'row', justifyContent: 'space-between'},
        ]}>
        <CustomButton
          btnText={t('submit')}
          style={{width: '48%', height: 60}}
          onPress={handleSubmit}
        />
        <CustomButton
          btnText={t('save as draft')}
          style={{width: '48%', height: 60, backgroundColor: borderColor}}
          onPress={() => {
            setDraftpopup(true);
          }}
          btnStyle={{color: 'black'}}
        />
      </View>
      {/* submit popup */}
      <PopupModal
        modalVisible={savePopup}
        setBottomModalVisible={setSavepopup}
        styleInner={[Styles.savePopup, {width: '90%'}]}>
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
              onPress={() => {
                onSubmit();
              }}
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
        styleInner={[Styles.savePopup, {width: '90%'}]}>
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
  );
};

export default LandSpecification;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 12,
    },
    mainContainer: {
      paddingHorizontal: 10,
      paddingVertical: 12,
    },
    subArea: {
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
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
  });
