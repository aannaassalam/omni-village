import {yupResolver} from '@hookform/resolvers/yup';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Divider} from 'react-native-paper';
import Toast from 'react-native-toast-message';
import {useDispatch, useSelector} from 'react-redux';
import * as yup from 'yup';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import Checkbox from '../../Components/Checkboxes/Checkbox';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import PopupModal from '../../Components/Popups/PopupModal';
// import {addFishery, editFishery, getFishery} from '../../Redux/FisherySlice';
import {useMutation} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';
import {addFishery, editFishery} from '../../functions/fisheryScreen';
import '../../i18next';
import {useUser} from '../../Hooks/useUser';
import {useMeasurement} from '../../Hooks/cms';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const FisheryRiverInput = ({navigation, route}) => {
  const {cropType, screenName, data, cropId, type} = route.params;
  const [impInfo, setImpInfo] = useState(true);
  const [harvestedProduct, setHarvestedProduct] = useState(true);
  const [productionInfo, setProductionInfo] = useState(true);
  const {fishFeed} = useSelector(state => state.Others);
  const {data: measurement} = useMeasurement();
  const {data: userDetails} = useUser();
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {t} = useTranslation();
  const [message, setMessage] = useState('');
  const [income, setIncome] = useState('');
  const [expenditure, setExpenditure] = useState('');
  const [yields, setYields] = useState('');
  const [treeAge, setTreeAge] = useState(false);
  const [fishType, setFishType] = useState(false);
  const dispatch = useDispatch();
  const [harvestProdAdd, setHarvestProdAdd] = useState(false);
  const [focus, setFocus] = useState(false);
  const [savepopup, setSavepopup] = useState(false);
  const [draftpopup, setDraftpopup] = useState(false);
  const [productName, setProductName] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState('');
  const [averageAge, setAverageAge] = useState([
    {
      id: 1,
      age: 'Type 01',
      checked: true,
    },
    {
      id: 2,
      age: 'Type 02',
      checked: false,
    },
    {
      id: 3,
      age: 'Type 03',
      checked: false,
    },
    {
      id: 4,
      age: 'Type 04',
      checked: false,
    },
  ]);

  const schema = yup.object().shape({
    important_information: yup.object().shape({
      number_of_fishes: yup.string().required(t('number is required')),
      type_of_feed: yup.string().required(t('type_of_feed is required')),
    }),
    utilisation_information: yup.object().shape({
      // total_feed: yup.string().required(validation.error.total_feed),
      production_output: yup.string().required(t('output is required')),
      self_consumed: yup.string().required(t('self_consumed is required')),
      sold_to_neighbours: yup
        .string()
        .required(t('sold_to_neighbours is required')),
      sold_for_industrial_use: yup
        .string()
        .required(t('sold_for_industrial_use is required')),
      wastage: yup.string().required(t('wastage is required')),
      other: yup.string(),
      other_value: yup.string(),
      income_from_sale: yup
        .string()
        .required(t('income_from_sale is required')),
      expenditure_on_inputs: yup
        .string()
        .required(t('expenditure_on_inputs is required')),
      yeild: yup.string().required(),
    }),
    processing_method: yup
      .string()
      .required(t('processing_method is required')),
    weight_measurement: yup
      .string()
      .required(t('weight_measurement is required')),
  });
  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),

    defaultValues: {
      important_information: {
        number_of_fishes: String(
          data?.important_information?.number_of_fishes || '',
        ),
        type_of_feed: String(data?.important_information?.type_of_feed || ''),
      },
      utilisation_information: {
        // total_feed: String(data?.production_information?.total_feed || ''),
        production_output: String(
          data?.production_information?.production_output || '',
        ),
        self_consumed: String(
          data?.production_information?.self_consumed || '',
        ),
        sold_for_industrial_use: String(
          data?.production_information?.sold_for_industrial_use || '',
        ),
        sold_to_neighbours: String(
          data?.production_information?.sold_to_neighbours || '',
        ),
        wastage: String(data?.production_information?.wastage || ''),
        other: String(data?.production_information?.other || ''),
        other_value: String(data?.production_information?.other_value || ''),
        expenditure_on_inputs: String(
          data?.production_information?.expenditure_on_inputs || '',
        ),
        income_from_sale: String(
          data?.production_information?.income_from_sale || '',
        ),
        yeild: String(data?.yeilds || ''),
      },
      processing_method: Boolean(data?.processing_method || false),
      weight_measurement: String(data?.weight_measurement || 'kilogram'),
    },
  });
  const {mutate: addFisheryData, isPending: isAddFisheryPending} = useMutation({
    mutationFn: addFishery,
    onSuccess: _data => {
      console.log(_data, 'added successfully ');
      _data.status === 0
        ? navigation.goBack()
        : navigation.navigate('successfull');
    },
    onError: () =>
      Toast.show({
        type: 'error',
        text1: 'Error Occurred',
        text2: 'Something Went wrong, Please try again later!',
      }),
    onSettled: () => setSavepopup(false),
  });

  const {mutate: editFisheryData, isPending: isEditFisheryPending} =
    useMutation({
      mutationFn: editFishery,
      onSuccess: () => {
        console.log('edited success fully');
        navigation.goBack();
      },
      onError: () =>
        Toast.show({
          type: 'error',
          text1: 'Error Occurred',
          text2: 'Something Went wrong, Please try again later!',
        }),
      onSettled: () => setSavepopup(false),
    });
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSavepopup(false);
    }
  }, [errors]);

  const onSubmit = data2 => {
    let production_output = parseInt(
      data2.utilisation_information.production_output,
    );
    let self_consumed = parseInt(data2.utilisation_information.self_consumed);
    let sold_to_neighbours = parseInt(
      data2.utilisation_information.sold_to_neighbours,
    );
    let sold_for_industrial_use = parseInt(
      data2.utilisation_information.sold_for_industrial_use,
    );
    let wastage = parseInt(data2.utilisation_information.wastage);
    let other_value = parseInt(data2.utilisation_information.other_value);
    if (
      data2.important_information.type_of_feed === '' ||
      data2.utilisation_information.expenditure_on_inputs === '' ||
      data2.utilisation_information.income_from_sale === ''
    ) {
      setMessage('Input all fields');
      Toast.show({
        type: 'error',
        text1: 'Input all fields',
      });
      setSavepopup(false);
    } else {
      if (
        self_consumed +
          sold_for_industrial_use +
          sold_to_neighbours +
          wastage +
          other_value >
        production_output
      ) {
        setMessage('Total amount cannot be greater than output');
        Toast.show({
          type: 'error',
          text1: 'Total amount cannot be greater than output',
        });
        setSavepopup(false);
      } else {
        if (data?._id) {
          // dispatch(
          editFisheryData({
            important_information: watch('important_information'),
            utilisation_information: watch('utilisation_information'),
            processing_method: watch('processing_method'),
            weight_measurement: watch('weight_measurement')
              ? watch('weight_measurement')
              : 'kg',
            status: 1,
            crop_id: cropId,
            fishery_type: 'river',
            pond_name: cropType,
          });
        } else {
          // dispatch(
          addFisheryData({
            ...data2,
            status: 1,
            crop_id: cropId,
            fishery_type: 'river',
            pond_name: cropType,
          });
        }
      }
    }
  };

  const toggleItem = (value, index) => {
    const newValue = averageAge.map((checkbox, i) => {
      if (i !== index)
        return {
          ...checkbox,
          checked: false,
        };
      if (i === index) {
        const item = {
          ...checkbox,
          checked: !checkbox.checked,
        };
        return item;
      }
      return checkbox;
    });
    setAverageAge(newValue);
  };

  useEffect(() => {
    setValue(
      'utilisation_information.yeild',
      String(
        parseInt(getValues('utilisation_information.production_output'), 10) /
          parseInt(getValues('important_information.number_of_fishes'), 10) ||
          '0',
      ),
    );
  }, [
    watch('important_information.number_of_fishes'),
    watch('utilisation_information.production_output'),
  ]);

  const handleDraft = () => {
    if (data?._id) {
      // dispatch(
      editFisheryData({
        important_information: watch('important_information'),
        utilisation_information: watch('utilisation_information'),
        processing_method: watch('processing_method'),
        weight_measurement: watch('weight_measurement')
          ? watch('weight_measurement')
          : 'kg',
        status: 0,
        crop_id: cropId,
        fishery_type: 'river',
        pond_name: cropType,
      });
    } else {
      // dispatch(
      addFisheryData({
        important_information: watch('important_information'),
        utilisation_information: watch('utilisation_information'),
        processing_method: watch('processing_method'),
        weight_measurement: watch('weight_measurement')
          ? watch('weight_measurement')
          : 'kg',
        status: 0,
        crop_id: cropId,
        fishery_type: 'river',
        pond_name: cropType,
      });
    }
  };

  // console.log("watch import", watch('important_information'))
  // console.log("watch personal", watch('utilisation_information'))
  // console.log("watch process", watch('processing_method'))
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        goBack={() => navigation.goBack()}
        headerName={cropType}
        backIcon={true}
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={styles.textInputArea}>
          {/* important information section */}
          <View style={styles.subArea}>
            <Text style={styles.subAreaText}>{t('important information')}</Text>
            <Divider
              bold={true}
              style={[styles.divider, {width: '45%'}]}
              horizontalInset={true}
            />
            <TouchableOpacity onPress={() => setImpInfo(!impInfo)}>
              {impInfo ? (
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
          {impInfo ? (
            // <ImportantInformationPoultry
            //     fish={true}
            //     fishType={()=>setFishType(true)}
            // />
            <View style={styles.impContainer}>
              <Controller
                control={control}
                name="important_information.number_of_fishes"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <InputWithoutBorder
                      measureName={watch('weight_measurement')}
                      productionName={t('number')}
                      value={value}
                      onChangeText={onChange}
                      notRightText={true}
                    />
                  );
                }}
              />
              {errors?.important_information?.number?.message ? (
                <Text style={styles.error}>
                  {errors?.important_information?.number?.message}
                </Text>
              ) : null}
              <Controller
                control={control}
                name="weight_measurement"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <CustomDropdown3
                      data={measurement}
                      value={value}
                      defaultVal={{key: value, value: value}}
                      selectedValue={onChange}
                      infoName={t('weight measurement')}
                    />
                  );
                }}
              />
              <Controller
                control={control}
                name="important_information.type_of_feed"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    // <TouchableOpacity onPress={() => { }}>
                    <CustomDropdown3
                      data={[...fishFeed, {id: 0, name: 'Others'}]}
                      selectedValue={onChange}
                      value={value}
                      defaultVal={{key: value, value: value}}
                      infoName={t('type of feed')}
                    />
                    // </TouchableOpacity>
                    // <InputWithoutBorder
                    //     measureName={'kg'}
                    //     productionName={
                    //         'Type Of feed required'
                    //     }
                    //     value={value}
                    //     multiline={false}
                    //     notRightText={false}
                    //     editable={true}
                    //     keyboardType='default'
                    //     onChangeText={onChange}
                    // />
                  );
                }}
              />
              {errors?.important_information?.type_of_feed?.message ? (
                <Text style={styles.error}>
                  {errors?.important_information?.type_of_feed?.message}
                </Text>
              ) : null}
              {watch('important_information.type_of_feed') == 'Others' ? (
                <View style={styles.innerInputView}>
                  <Divider style={styles.divider2} />
                  <View style={{width: '100%'}}>
                    <Controller
                      name="important_information.other_type_of_feed"
                      control={control}
                      render={({field}) => {
                        const {onChange, value} = field;
                        return (
                          <InputWithoutBorder
                            measureName={watch('weight_measurement')}
                            productionName={t('create type')}
                            value={value}
                            multiline={false}
                            notRightText={false}
                            editable={true}
                            keyboardType="default"
                            onChangeText={onChange}
                          />
                        );
                      }}
                    />
                    {errors?.utilisation_information?.other_value?.message ? (
                      <Text style={styles.error}>
                        {errors?.utilisation_information?.other_value?.message}
                      </Text>
                    ) : null}
                  </View>
                </View>
              ) : null}
            </View>
          ) : null}
          {/* production information */}
          <View style={styles.subArea}>
            <Text style={styles.subAreaText}>
              {t('production information')}
            </Text>
            <Divider
              bold={true}
              style={[styles.divider, {width: '45%'}]}
              horizontalInset={true}
            />
            <TouchableOpacity
              onPress={() => setProductionInfo(!productionInfo)}>
              {productionInfo ? (
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
          {productionInfo ? (
            // <UtilisationAccordion
            // fish={true}
            // />
            <View style={styles.perContainer}>
              {/* <Controller
                control={control}
                name="utilisation_information.total_feed"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <InputWithoutBorder
                      measureName={watch('weight_measurement')}
                      productionName={'Total Feed'}
                      value={value}
                      onChangeText={onChange}
                    />
                  );
                }}
              />
              {errors?.utilisation_information?.total_feed ? (
                <Text style={styles.error}>
                  {errors?.utilisation_information?.total_feed?.message}
                </Text>
              ) : null} */}

              <Controller
                control={control}
                name="utilisation_information.production_output"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <InputWithoutBorder
                      measureName={watch('weight_measurement')}
                      productionName={t('output')}
                      value={value}
                      onChangeText={onChange}
                    />
                  );
                }}
              />
              {errors?.utilisation_information?.production_output ? (
                <Text style={styles.error}>
                  {errors?.utilisation_information?.production_output?.message}
                </Text>
              ) : null}
              <View style={styles.innerInputView}>
                <Divider style={styles.divider2} />
                <View style={{width: '100%'}}>
                  <Controller
                    control={control}
                    name="utilisation_information.self_consumed"
                    render={({field}) => {
                      const {onChange, value} = field;
                      return (
                        <InputWithoutBorder
                          measureName={watch('weight_measurement')}
                          productionName={t('self consumed')}
                          value={value}
                          onChangeText={onChange}
                        />
                      );
                    }}
                  />
                  {errors?.utilisation_information?.self_consumed?.message ? (
                    <Text style={styles.error}>
                      {errors?.utilisation_information?.self_consumed?.message}
                    </Text>
                  ) : null}
                  <Controller
                    name="utilisation_information.sold_to_neighbours"
                    control={control}
                    render={({field}) => {
                      const {onChange, value} = field;
                      return (
                        <InputWithoutBorder
                          measureName={watch('weight_measurement')}
                          productionName={t('sold to neighbour')}
                          value={value}
                          multiline={false}
                          notRightText={false}
                          onChangeText={onChange}
                        />
                      );
                    }}
                  />
                  {errors?.utilisation_information?.sold_to_neighbours
                    ?.message ? (
                    <Text style={styles.error}>
                      {
                        errors?.utilisation_information?.sold_to_neighbours
                          ?.message
                      }
                    </Text>
                  ) : null}
                  <Controller
                    name="utilisation_information.sold_for_industrial_use"
                    control={control}
                    render={({field}) => {
                      const {onChange, value} = field;
                      return (
                        <InputWithoutBorder
                          measureName={watch('weight_measurement')}
                          productionName={t('sold for industrial use')}
                          value={value}
                          multiline={false}
                          notRightText={false}
                          onChangeText={onChange}
                        />
                      );
                    }}
                  />
                  {errors?.utilisation_information?.sold_for_industrial_use
                    ?.message ? (
                    <Text style={styles.error}>
                      {
                        errors?.utilisation_information?.sold_for_industrial_use
                          ?.message
                      }
                    </Text>
                  ) : null}
                  <Controller
                    name="utilisation_information.wastage"
                    control={control}
                    render={({field}) => {
                      const {onChange, value} = field;
                      return (
                        <InputWithoutBorder
                          measureName={watch('weight_measurement')}
                          productionName={t('wastage')}
                          value={value}
                          multiline={false}
                          notRightText={false}
                          onChangeText={onChange}
                        />
                      );
                    }}
                  />
                  {errors?.utilisation_information?.wastage?.message ? (
                    <Text style={styles.error}>
                      {errors?.utilisation_information?.wastage?.message}
                    </Text>
                  ) : null}
                  <Controller
                    name="utilisation_information.other"
                    control={control}
                    render={({field}) => {
                      const {onChange, value} = field;
                      return (
                        <InputWithoutBorder
                          measureName={watch('weight_measurement')}
                          productionName={t('Other(Specify if any)')}
                          value={value}
                          multiline={false}
                          notRightText={true}
                          onChangeText={onChange}
                          keyboardType="default"
                        />
                      );
                    }}
                  />
                  <View style={styles.innerInputView}>
                    <Divider style={styles.divider2} />
                    <View style={{width: '100%'}}>
                      <Controller
                        name="utilisation_information.other_value"
                        control={control}
                        render={({field}) => {
                          const {onChange, value} = field;
                          return (
                            <InputWithoutBorder
                              measureName={watch('weight_measurement')}
                              productionName={
                                watch('utilisation_information.other')
                                  ? watch('utilisation_information.other')
                                  : t('other value')
                              }
                              value={value}
                              multiline={false}
                              notRightText={false}
                              editable={
                                watch('utilisation_information.other').length >
                                0
                              }
                              onChangeText={onChange}
                            />
                          );
                        }}
                      />
                      {errors?.utilisation_information?.other_value?.message ? (
                        <Text style={styles.error}>
                          {
                            errors?.utilisation_information?.other_value
                              ?.message
                          }
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
          <Controller
            name="utilisation_information.income_from_sale"
            control={control}
            render={({field}) => {
              const {onChange, value} = field;
              return (
                <InputWithoutBorder
                  measureName={userDetails?.currency}
                  productionName={t('income from sale')}
                  value={value}
                  onChangeText={onChange}
                />
              );
            }}
          />
          {errors?.utilisation_information?.income_from_sale?.message ? (
            <Text style={styles.error}>
              {errors?.utilisation_information?.income_from_sale?.message}
            </Text>
          ) : null}
          <Controller
            name="utilisation_information.expenditure_on_inputs"
            control={control}
            render={({field}) => {
              const {onChange, value} = field;
              return (
                <InputWithoutBorder
                  measureName={userDetails?.currency}
                  productionName={t('expenditure on input')}
                  value={value}
                  onChangeText={onChange}
                />
              );
            }}
          />
          {errors?.utilisation_information?.expenditure_on_inputs?.message ? (
            <Text style={styles.error}>
              {errors?.utilisation_information?.expenditure_on_inputs?.message}
            </Text>
          ) : null}

          <Controller
            name="utilisation_information.yeild"
            control={control}
            render={({field}) => {
              const {onChange, value} = field;
              return (
                <InputWithoutBorder
                  measureName={
                    watch('weight_measurement') +
                    '/' +
                    userDetails?.land_measurement_symbol
                  }
                  productionName={t('yields')}
                  value={value}
                  onChangeText={onChange}
                  notRightText={true}
                  editable={false}
                />
              );
            }}
          />
          {errors?.utilisation_information?.yeild?.message ? (
            <Text style={styles.error}>
              {errors?.utilisation_information?.yeild?.message}
            </Text>
          ) : null}
          <Text style={styles.processing_text}>{t('required processing')}</Text>
          <View style={styles.processing_container}>
            <Controller
              name="processing_method"
              control={control}
              render={({field}) => {
                const {onChange, value} = field;
                return (
                  <TouchableOpacity onPress={() => onChange(true)}>
                    {value === true ? (
                      <Image
                        source={require('../../../assets/checked.png')}
                        style={{height: 30, width: 30}}
                      />
                    ) : (
                      <Image
                        source={require('../../../assets/unchecked.png')}
                        style={{height: 30, width: 30}}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
            <Text style={styles.yes_text}>{t('yes')}</Text>
            <Controller
              name="processing_method"
              control={control}
              render={({field}) => {
                const {onChange, value} = field;
                return (
                  <TouchableOpacity onPress={() => onChange(false)}>
                    {value === false ? (
                      <Image
                        source={require('../../../assets/checked.png')}
                        style={{height: 30, width: 30}}
                      />
                    ) : (
                      <Image
                        source={require('../../../assets/unchecked.png')}
                        style={{height: 30, width: 30}}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
            <Text style={styles.yes_text}>{t('no')}</Text>
          </View>
        </View>
        {message && <Text style={styles.error}>{message}</Text>}
        <View style={styles.bottomPopupbutton}>
          <CustomButton
            style={styles.submitButton}
            btnText={t('submit')}
            onPress={() => {
              setSavepopup(true);
            }}
          />
          <CustomButton
            style={styles.draftButton}
            btnText={t('save as draft')}
            onPress={() => {
              setDraftpopup(true);
            }}
          />
        </View>
        {fishType && (
          <AddBottomSheet>
            <View style={styles.BottomTopContainer}>
              <Text style={styles.headerText}>Average Age of the tree</Text>
              <TouchableOpacity
                onPress={() => {
                  setFishType(!fishType);
                }}>
                <Image
                  source={require('../../../assets/close.png')}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.chck_container}>
              {averageAge.map((item, indx) => {
                return (
                  <Checkbox
                    name={item?.age}
                    key={indx}
                    checked={item?.checked}
                    checking={value => toggleItem(value, indx)}
                  />
                );
              })}
            </View>
          </AddBottomSheet>
        )}
        {/* submit popup */}
        <PopupModal
          modalVisible={savepopup}
          setBottomModalVisible={setSavepopup}
          styleInner={[styles.savePopup, {width: '90%'}]}>
          <View style={styles.submitPopup}>
            <View style={styles.noteImage}>
              <Image
                source={require('../../../assets/note.png')}
                style={styles.noteImage}
              />
            </View>
            <Text style={styles.confirmText}>{t('confirm')}</Text>
            <Text style={styles.nextText}>
              {t('lorem ipsum is simply dummy text of the.Lorem Ipsum.')}
            </Text>
            <View style={styles.bottomPopupbutton}>
              <CustomButton
                style={styles.submitButton}
                btnText={t('submit')}
                onPress={
                  // setSavepopup(false), navigation.goBack();
                  handleSubmit(onSubmit)
                }
                loading={isAddFisheryPending || isEditFisheryPending}
              />
              <CustomButton
                style={styles.draftButton}
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
          modalVisible={draftpopup}
          setBottomModalVisible={setDraftpopup}
          styleInner={[styles.savePopup, {width: '90%'}]}>
          <View style={styles.submitPopup}>
            <View style={styles.noteImage}>
              <Image
                source={require('../../../assets/note.png')}
                style={styles.noteImage}
              />
            </View>
            <Text style={styles.confirmText}>{t('save as draft')}</Text>
            <Text style={styles.nextText}>
              {t('lorem ipsum is simply dummy text of the.Lorem Ipsum.')}
            </Text>
            <View style={styles.bottomPopupbutton}>
              <CustomButton
                style={styles.submitButton}
                btnText={t('save')}
                onPress={handleDraft}
                loading={isEditFisheryPending || isAddFisheryPending}
              />
              <CustomButton
                style={styles.draftButton}
                btnText={t('cancel')}
                onPress={() => setDraftpopup(false)}
              />
            </View>
          </View>
        </PopupModal>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default FisheryRiverInput;

const width = Dimensions.get('window').width;
const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    error: {
      fontFamily: 'ubuntu-regular',
      fontSize: 14 / fontScale,
      // marginTop: 5,
      color: '#ff000e',
      marginLeft: 20,
      marginBottom: 20,
    },
    textInputArea: {
      alignSelf: 'center',
      width: '95%',
    },
    subArea: {
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      margin: 10,
      marginTop: '5%',
      width: width / 1,
    },
    divider: {
      alignSelf: 'center',
      height: 1,
      width: '67%',
      marginTop: 5,
      color: 'grey',
    },
    subAreaText: {
      alignSelf: 'center',
      fontSize: 14 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu',
    },
    uparrow: {
      height: 20,
      width: 20,
    },
    closeIcon: {
      height: 30,
      width: 30,
      alignSelf: 'center',
    },
    BottomTopContainer: {
      justifyContent: 'space-between',
      alignSelf: 'center',
      margin: 10,
      padding: 5,
      flexDirection: 'row',
    },
    headerText: {
      fontFamily: 'ubuntu-medium',
      fontSize: 16 / fontScale,
      color: '#000',
      alignSelf: 'center',
      width: '87%',
    },
    chck_container: {
      alignSelf: 'center',
      width: '90%',
    },
    add_button: {
      width: '20%',
      padding: 8,
      alignSelf: 'flex-start',
      justifyContent: 'space-around',
      backgroundColor: '#263238',
      flexDirection: 'row',
      marginLeft: 13,
      borderRadius: 8,
      marginTop: '5%',
    },
    add_button_text: {
      fontFamily: 'ubuntu-regular',
      fontSize: 14 / fontScale,
      color: '#fff',
      alignSelf: 'center',
    },
    harvested_prod_container: {
      alignSelf: 'center',
      width: '90%',
      marginBottom: 10,
    },
    savePopup: {
      justifyContent: 'center',
      width: '97%',
      borderRadius: 20,
    },
    popupButton: {
      width: '70%',
      alignSelf: 'center',
    },
    bottomPopupbutton: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-between',
      marginTop: '5%',
    },
    submitButton: {
      width: '45%',
      margin: 10,
    },
    draftButton: {
      width: '45%',
      margin: 10,
      backgroundColor: 'grey',
    },
    confirmText: {
      alignSelf: 'center',
      fontSize: 18 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu-medium',
      fontWeight: '500',
      padding: 10,
      textAlign: 'center',
    },
    nextText: {
      alignSelf: 'center',
      fontSize: 18 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu',
      textAlign: 'center',
    },
    submitPopup: {
      alignItems: 'center',
      padding: 10,
    },
    noteImage: {
      padding: 10,
    },
    processing_container: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    processing_text: {
      fontSize: 14 / fontScale,
      fontFamily: 'ubuntu-medium',
      textAlign: 'left',
      color: '#000',
      marginTop: 10,
      padding: 10,
    },
    yes_text: {
      alignSelf: 'center',
      paddingHorizontal: 10,
      color: '#000',
      fontSize: 14 / fontScale,
      fontFamily: 'ubuntu-medium',
    },
    impContainer: {
      width: '100%',
      alignSelf: 'center',
      marginBottom: '5%',
    },
    innerInputView: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-between',
      width: '95%',
      marginBottom: '5%',
    },
    perContainer: {
      width: '95%',
      alignSelf: 'center',
    },
    divider2: {
      // backgroundColor: 'grey',
      alignSelf: 'flex-start',
      height: '100%',
      marginTop: 9,
      width: '1%',
      borderRadius: 10,
    },
  });
