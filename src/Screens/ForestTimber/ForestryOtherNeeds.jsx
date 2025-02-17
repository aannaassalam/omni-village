import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Divider} from 'react-native-paper';
import {borderColor, primaryColor} from '../../styles/colors';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useUser} from '../../Hooks/useUser';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Styles, width} from '../../styles/globalStyles';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import Input from '../../Components/Inputs/Input';
import AcresElement from '../../Components/ui/AcresElement';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import {
  addWaterHarvesting,
  editWaterHarvesting,
  getWaterDropdown,
  getWaterHarvesting,
} from '../../functions/water';
import {USER_PREFERRED_LANGUAGE} from '../../i18next';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';
import {
  addForestryOtherNeeds,
  editForestryOtherNeeds,
  getForestry,
  getForestryDropdown,
} from '../../functions/forestry';
import {fontFamilyRegular} from '../../styles/fontStyle';

const ForestryOtherNeeds = ({navigation, route}) => {
  const {type, name} = route.params;
  const [savePopup, setSavepopup] = useState(false);
  const [draftPopup, setDraftpopup] = useState(false);
  const [enterInfo, setEnterInfo] = useState(true);
  const {t} = useTranslation();
  const {data: user} = useUser();
  const queryClient = useQueryClient();
  const {data: forestry, isLoading} = useQuery({
    queryKey: ['forestry_dropdown'],
    queryFn: () => getForestryDropdown(),
    refetchOnWindowFocus: true,
  });
  const {data: get_forestry, isLoading: isTypeLoading} = useQuery({
    queryKey: [`get_forestry ${type}`],
    queryFn: () => getForestry(type),
    refetchOnWindowFocus: true,
  });
  const {mutate: edit_forestry_other, isPending: isEditing} = useMutation({
    mutationFn: editForestryOtherNeeds,
    onSuccess: data => {
      queryClient.invalidateQueries();
      navigation.replace('forestryTimber'),
        setDraftpopup(false),
        setSavepopup(false);
    },
    onError: error => console.log('error save', error),
  });
  const {mutate: add_forestry_other, isPending: isAdding} = useMutation({
    mutationFn: addForestryOtherNeeds,
    onSuccess: data => {
      queryClient.invalidateQueries();
      navigation.replace('forestryTimber');
      setDraftpopup(false), setSavepopup(false);
    },
    onError: error => console.log('error save', error),
  });
  const [selectedStatus, setSelectedStatus] = useState([]);
  const scheme = yup.object().shape({
    unfulfilled_forest_needs: yup.boolean(),
    forestry_type: yup.array().when(
      'unfulfilled_forest_needs',
      {
        is: true,
        otherwise: () => {
          return yup
            .array()
            .of(
              yup.object().shape({
                type: yup.string().required(t('Type is required')),
                quantity: yup.string().required(t('Quantity is required')),
                purpose: yup.string().required(t('Purpose is required')),
                urgency: yup.string().required(t('Urgency is required')),
                quantity_unit: yup
                  .string()
                  .required(t('Quantity unit is required')),
              }),
            )
            .required(t('Forestry type is required'));
        },
      },
      yup.array().min(1, t('Forestry type is required')),
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
    setValues,
    setFieldValue,
  } = useFormik({
    initialValues: {
      unfulfilled_forest_needs: false,
      forestry_type: [],
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      if (values?.unfulfilled_forest_needs && selectedStatus.length > 0) {
        setSavepopup(true);
      } else if (!values?.unfulfilled_forest_needs) {
        setSavepopup(true);
      } else {
        ToastAndroid.show('Please select one value', ToastAndroid.BOTTOM);
      }
    },
  });

  const handleFieldChange = (index, field, value) => {
    const newDetailsOfLand = [...values.forestry_type];
    newDetailsOfLand[index][field] = value;
    setValues({...values, forestry_type: newDetailsOfLand});
  };

  const handleStatusChange = selectedItems => {
    console.log('selelele', selectedItems);
    setSelectedStatus(selectedItems);

    // Update `purpose_status_of_land` based on the selected items
    const updatedPurposeStatusOfLand = selectedItems.map((item, index) => {
      console.log('value', values?.forestry_type);
      // Check if this `type` already exists in `purpose_status_of_land`
      const existingEntry = values?.forestry_type.find(
        entry => entry.type === index,
      );

      return (
        existingEntry || {
          type: item,
          quantity: '',
          purpose: [],
          urgency: '',
          quantity_unit: '',
        }
      );
    });
    // Update the form's purpose_status_of_land field
    setFieldValue('forestry_type', updatedPurposeStatusOfLand);
  };
  const [collapseStates, setCollapseStates] = useState([]);

  useEffect(() => {
    // Initialize collapseStates with false for all vehicles
    if (values?.forestry_type.length > 0) {
      setCollapseStates(Array(values.forestry_type.length).fill(true));
    }
  }, [values?.forestry_type]);

  const toggleCollapse = index => {
    setCollapseStates(prevStates => {
      // Create a new array to avoid mutating the state directly
      const newStates = [...prevStates];
      newStates[index] = !newStates[index]; // Toggle the specific index
      return newStates;
    });
  };
  useEffect(() => {
    resetForm({
      values: {
        unfulfilled_forest_needs:
          get_forestry?.unfulfilled_forest_needs || false,
        forestry_type:
          get_forestry?.forestry_type.map(item => {
            return {
              type: item.type,
              quantity: String(item.quantity),
              purpose: item.purpose,
              urgency: item.urgency,
              quantity_unit: item?.quantity_unit,
            };
          }) || [],
      },
    });
    setSelectedStatus(get_forestry?.forestry_type.map(item => item.type) || []);
  }, [get_forestry]);
  const handleDraft = () => {
    let newData = {
      unfulfilled_forest_needs: values?.unfulfilled_forest_needs,
      forestry_type: values?.forestry_type,
      status: 0,
    };
    if (get_forestry?._id) {
      edit_forestry_other({...newData, forestry_id: get_forestry?._id});
    } else {
      add_forestry_other({...newData});
    }
  };
  const onSubmit = () => {
    let newData = {
      unfulfilled_forest_needs: values?.unfulfilled_forest_needs,
      forestry_type: values?.forestry_type,
      status: 1,
    };
    if (get_forestry?._id) {
      edit_forestry_other({...newData, forestry_id: get_forestry?._id});
    } else {
      add_forestry_other({...newData});
    }
  };
  if (isTypeLoading || isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
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
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 140, paddingHorizontal: 22}}>
        <SwitchButton
          nolabel={false}
          label={t('Do you have unfulfilled Forest produce needs?')}
          selected={values?.unfulfilled_forest_needs}
          firstBtnPress={() =>
            setValues({...values, unfulfilled_forest_needs: true})
          }
          secondBtnPress={() => {
            setValues({
              ...values,
              unfulfilled_forest_needs: false,
              forestry_type: [],
            }),
              setSelectedStatus([]);
          }}
          firstBtnText={t('yes')}
          secondBtntext={t('no')}
        />
        {values?.unfulfilled_forest_needs && (
          <View>
            <MultiselectDropdown
              containerStyle={{marginTop: '5%', paddingTop: 0}}
              data={forestry?.other_needs_type.map(item => {
                return {
                  name: item?.name?.[USER_PREFERRED_LANGUAGE],
                  key: item?._id,
                };
              })}
              setSelectedd={handleStatusChange}
              selectedd={selectedStatus}
              infoName={t('What is the Type?')}
            />
            {values?.forestry_type?.length > 0 && (
              <>
                {values?.forestry_type.map((item, index) => {
                  return (
                    <>
                      <View style={[styles.subArea, {marginTop: '3%'}]}>
                        <Text
                          style={[
                            Styles.fieldLabel,
                            {
                              marginTop: 4,
                              alignSelf: 'center',
                              textTransform: 'capitalize',
                            },
                          ]}>
                          {/* {t(`${t('Type')} ${index + 1}`)} */}
                          {`${
                            forestry?.other_needs_type
                              ? forestry?.other_needs_type.find(
                                  i => item?.type == i?._id,
                                )
                                ? forestry?.other_needs_type.find(
                                    i => item?.type == i?._id,
                                  )?.name[USER_PREFERRED_LANGUAGE]
                                : item?.type
                              : null
                          }`}
                        </Text>
                        <Divider
                          bold={true}
                          style={[styles.divider, {width: '64%'}]}
                          horizontalInset={true}
                        />
                        <TouchableOpacity onPress={() => toggleCollapse(index)}>
                          {collapseStates[index] ? (
                            <Image
                              source={require('../../../assets/arrowUp.png')}
                              style={styles.uparrow}
                            />
                          ) : (
                            <Image
                              source={require('../../../assets/arrowDown.png')}
                              style={styles.uparrow}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                      {collapseStates[index] && (
                        <View style={styles.innerInputView}>
                          <Divider style={styles.divider2} />
                          <View style={{width: '100%'}}>
                            {/* <CustomDropdown
                            data={
                              [{ label: 'Yes', value: true }, { label: 'No', value: false }]
                            }
                            value={item?.quantity}
                            label={t('Quantity')}
                            onChange={value => {
                              handleFieldChange(
                                index,
                                'quantity',
                                value?.value,
                              )
                            }}
                          /> */}
                            <Input
                              label={t('Quantity')}
                              value={item?.quantity}
                              placeholder={'0'}
                              fullLength={true}
                              keyboardType="numeric"
                              onChangeText={value => {
                                handleFieldChange(index, 'quantity', value);
                              }}
                              isRight={
                                <CustomDropdown
                                  data={
                                    forestry?.dropdown
                                      ? forestry?.dropdown.map(item => {
                                          return {
                                            label:
                                              item?.name?.[
                                                USER_PREFERRED_LANGUAGE
                                              ],
                                            value: item?._id,
                                          };
                                        })
                                      : [
                                          {
                                            label: 'Kg',
                                            value: '6736117ecb51156c2f52683e',
                                          },
                                          {
                                            label: 'Litres',
                                            value: '6736117ecb51156c2f52643e',
                                          },
                                        ]
                                  }
                                  value={item?.quantity_unit}
                                  noLabel={true}
                                  onChange={value => {
                                    handleFieldChange(
                                      index,
                                      'quantity_unit',
                                      value?.value,
                                    );
                                  }}
                                  sideDrop={true}
                                  style={{
                                    height: 30,
                                    borderColor: '#fff',
                                    width: 72,
                                    marginTop: -1,
                                    right: 3,
                                    // backgroundColor:'red'
                                  }}
                                  placeholder={t('Unit')}
                                  placeholderStyle={{
                                    fontSize: 14,
                                    fontFamily: fontFamilyRegular,
                                    marginRight: 2,
                                  }}
                                />
                              }
                            />
                            {errors.forestry_type &&
                              errors.forestry_type[index]?.quantity && (
                                <Text style={Styles.error2}>
                                  {errors.forestry_type[index].quantity}
                                </Text>
                              )}
                            <MultiselectDropdown
                              containerStyle={{marginTop: '5%', paddingTop: 0}}
                              data={
                                forestry?.other_needs_purpose
                                  ? forestry?.other_needs_purpose.map(item => {
                                      return {
                                        name: item?.name?.[
                                          USER_PREFERRED_LANGUAGE
                                        ],
                                        key: item?._id,
                                      };
                                    })
                                  : [
                                      {
                                        name: 'Pharmaceutical',
                                        key: '6736117ecb51156c2f52383e',
                                      },
                                      {
                                        name: 'IT/Telecom',
                                        key: '6736117ecb51156c2f52683e',
                                      },
                                    ]
                              }
                              setSelectedd={value => {
                                handleFieldChange(index, 'purpose', value);
                              }}
                              selectedd={item?.purpose}
                              infoName={t('Purpose')}
                            />
                            {errors.forestry_type &&
                              errors.forestry_type[index]?.purpose && (
                                <Text style={Styles.error2}>
                                  {errors.forestry_type[index].purpose}
                                </Text>
                              )}

                            <CustomDropdown
                              data={
                                forestry?.other_needs_urgency
                                  ? forestry?.other_needs_urgency.map(item => {
                                      return {
                                        label:
                                          item?.name?.[USER_PREFERRED_LANGUAGE],
                                        value: item?._id,
                                      };
                                    })
                                  : [
                                      {
                                        label: 'High',
                                        value: '6736117ecb51156c2f52389e',
                                      },
                                      {
                                        label: 'Medium',
                                        value: '6736117ecb51156c2f52683e',
                                      },
                                      {
                                        label: 'Low',
                                        value: '6736117ecb51156c2f52753e',
                                      },
                                    ]
                              }
                              value={item?.urgency}
                              label={t('Urgency')}
                              onChange={value => {
                                handleFieldChange(
                                  index,
                                  'urgency',
                                  value?.value,
                                );
                              }}
                            />
                            {errors.forestry_type &&
                              errors.forestry_type[index]?.urgency && (
                                <Text style={Styles.error2}>
                                  {errors.forestry_type[index].urgency}
                                </Text>
                              )}
                          </View>
                        </View>
                      )}
                    </>
                  );
                })}
              </>
            )}
          </View>
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
              loading={isAdding || isEditing}
            />
            <CustomButton
              style={Styles.draftButton}
              btnText={t('cancel')}
              onPress={() => {
                setSavepopup(false);
              }}
              disabled={isAdding || isEditing}
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
              loading={isAdding || isEditing}
            />
            <CustomButton
              style={Styles.draftButton}
              btnText={t('cancel')}
              onPress={() => setDraftpopup(false)}
              disabled={isAdding || isEditing}
            />
          </View>
        </View>
      </PopupModal>
    </View>
  );
};

export default ForestryOtherNeeds;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});
