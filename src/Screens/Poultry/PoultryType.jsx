import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import ImportantInformationTress from '../../Components/Accordion/ImportantInformationTress';
import {Divider} from 'react-native-paper';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import ProductDescription from '../../Components/CustomDashboard/ProductDescription';
import Checkbox from '../../Components/Checkboxes/Checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import ImportantInformationPoultry from '../../Components/Accordion/ImportantInformationPoultry';
import ProductionInformation from '../../Components/Accordion/ProductionInformation';
import {useDispatch, useSelector} from 'react-redux';
import Toast from 'react-native-toast-message';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Others,
  fertilisers,
  pesticides,
  soilHealth,
} from '../../MockData/Mockdata';
import moment from 'moment';
import {validation} from '../../Validation/Validation';
import {addPoultry, editPoultry, getPoultry} from '../../Redux/PoultrySlice';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import {getMeasurement} from '../../Redux/OthersSlice';
import { useTranslation } from 'react-i18next';
import '../../i18next';
import PoultryProductDescription from '../../Components/CustomDashboard/PoultryProductDescription';

const PoultryType = ({navigation, route}) => {
  const {cropType, edit, cropId, data} = route.params;
  const [impInfo, setImpInfo] = useState(true);
  const [harvestedProduct, setHarvestedProduct] = useState(true);
  const [productionInfo, setProductionInfo] = useState(true);
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const { t } = useTranslation();
  const {measurement} = useSelector(state => state.Others);
  const {feed} = useSelector(state => state.Others);
  const [message, setMessage] = useState('');
  const {userDetails} = useSelector(state => state.auth);
  const [income, setIncome] = useState('');
  const [expenditure, setExpenditure] = useState('');
  const [treeAge, setTreeAge] = useState(false);
  const [harvestProdAdd, setHarvestProdAdd] = useState(false);
  const [focus, setFocus] = useState(false);
  const [savepopup, setSavepopup] = useState(false);
  const [draftpopup, setDraftpopup] = useState(false);
  const [productName, setProductName] = useState('');
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [toggleCheckBox, setToggleCheckBox] = useState('');
  const dispatch = useDispatch();
  const [averageAge, setAverageAge] = useState([
    {
      id: 1,
      age: 'Less than a year',
      ageVal: 1,
      checked: true,
    },
    {
      id: 2,
      age: '1 to 2 years',
      ageVal: 2,
      checked: false,
    },
    {
      id: 3,
      ageVal: 3,
      age: '2 to 3 years',
      checked: false,
    },
    {
      id: 4,
      ageVal: 5,
      age: '3 to 5 year',
      checked: false,
    },
  ]);
  const [harvestedProductList, setHarvestedProductList] = useState([]);
  const schema = yup.object().shape({
    important_information: yup.object().shape({
      number: yup.string().required(validation.error.number),
      avg_age_of_live_stocks: yup
        .number()
        .required(validation.error.avg_age_of_live_stocks),
      type_of_feed: yup.string().required(validation.error.type_of_feed),
      other_type_of_feed: yup
        .string(),
    }),
    utilisation_information: yup.object().shape({
      total_feed: yup.string().required(validation.error.total_feed),
      self_produced: yup.string().required(validation.error.self_produced),
      neighbours: yup.string().required(validation.error.sold_to_neighbours),
      purchased_from_market: yup
        .string()
        .required(validation.error.purchased_from_market),
      other: yup.string(),
      other_value: yup.string(),
    }),
    income_from_sale: yup.string().required(validation.error.income_from_sale),
    expenditure_on_inputs: yup
      .string()
      .required(validation.error.expenditure_on_inputs),
    steroids: yup.string().required(validation.error.steroids),
  });
  useEffect(() => {
    if (data) {
      setHarvestedProductList(data?.products);
    } else {
      setHarvestedProductList([]);
    }
  }, [data]);
  // console.log("poultry data", data)
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
        number: String(data?.number || ''),
        avg_age_of_live_stocks: Number(data?.avg_age_of_live_stocks || ''),
        type_of_feed: String(data?.type_of_feed || ''),
        other_type_of_feed: String(data?.other_type_of_feed || ''),
      },
      utilisation_information: {
        total_feed: String(data?.personal_information?.total_feed || ''),
        self_produced: String(data?.personal_information?.self_produced || ''),
        neighbours: String(data?.personal_information?.neighbours || ''),
        purchased_from_market: String(
          data?.personal_information?.purchased_from_market || '',
        ),
        other: String(data?.personal_information?.other || ''),
        other_value: String(data?.personal_information?.other_value || ''),
      },
      expenditure_on_inputs: String(data?.expenditure_on_inputs || ''),
      income_from_sale: String(data?.income_from_sale || ''),
      steroids: Boolean(data?.steroids || false),
    },
  });
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSavepopup(false);
    }
    console.log("erooorrrr", errors)
  }, [errors]);
  const submit = () => {
    console.log("i m here")
    let total_feed = parseInt(watch('utilisation_information.total_feed'));
    let self_produced = parseInt(
      watch('utilisation_information.self_produced'),
    );
    let neighbours = parseInt(watch('utilisation_information.neighbours'));
    let purchased_from_market = parseInt(
      watch('utilisation_information.purchased_from_market'),
    );
    let other_value = parseInt(watch('utilisation_information.other_value'));
    if (
      watch('important_information.type_of_feed') == '' ||
      watch('expenditure_on_inputs') == '' ||
      watch('income_from_sale') == '' ||
      watch('important_information.avg_age_of_live_stocks') == 0
    ) {
      setMessage('Input all fields');
      Toast.show({
        type: 'error',
        text1: 'Input all fields',
      });
      setSavepopup(false);
    } else {
      if (
        self_produced + neighbours + purchased_from_market + other_value >
        total_feed
      ) {
        setMessage('Total amount cannot be greater than output');
        Toast.show({
          type: 'error',
          text1: 'Total amount cannot be greater than output',
        });
        setSavepopup(false);
      } else {
        if (data?._id) {
          dispatch(
            editPoultry({
              important_information: watch('important_information'),
              utilisation_information: watch('utilisation_information'),
              income_from_sale: watch('income_from_sale'),
              expenditure_on_inputs: watch('expenditure_on_inputs'),
              steroids: watch('steroids'),
              crop_id: cropId,
              productDetails: harvestedProductList.map(itm => {
                return {
                  _id: itm?._id,
                  name: itm?.name || '',
                  production_output: itm?.production_output,
                  self_consumed: itm?.self_consumed,
                  fed_to_livestock: itm?.fed_to_livestock,
                  sold_to_neighbours: itm?.sold_to_neighbours,
                  sold_for_industrial_use: itm?.sold_for_industrial_use,
                  wastage: itm?.wastage,
                  other: itm?.other,
                  other_value: itm?.other_value,
                  month_harvested: moment(itm?.month_harvested).format(
                    'YYYY-MM-DD',
                  ),
                  processing_method: itm?.processing_method,
                };
              }),
              status: 1,
            }),
          )
            .unwrap()
            .then(
              () =>
                Toast.show({
                  text1: 'Success',
                  text2: 'Poultry updated successfully!',
                }),
              dispatch(getPoultry()),
              // navigation.goBack(),
            )
            .catch(err => {
              console.log('err', err);
              Toast.show({
                type: 'error',
                text1: 'Error Occurred',
                text2: 'Something Went wrong, Please try again later!',
              });
            })
            .finally(() => {
              setSavepopup(false), navigation.goBack();
            });
        } else {
          dispatch(
            addPoultry({
              important_information: watch('important_information'),
              utilisation_information: watch('utilisation_information'),
              income_from_sale: watch('income_from_sale'),
              expenditure_on_inputs: watch('expenditure_on_inputs'),
              steroids: watch('steroids'),
              productDetails: harvestedProductList,
              status: 1,
              crop_id: cropId,
            }),
          )
            .unwrap()
            .then(
              () =>
                Toast.show({
                  text1: 'Success',
                  text2: 'Poultry added successfully!',
                }),
              dispatch(getPoultry()),
              navigation.goBack(),
            )
            .catch(err => {
              console.log('err at add', err);
              Toast.show({
                type: 'error',
                text1: 'Error Occurred',
                text2: 'Something Went wrong, Please try again later!',
              });
            })
            .finally(() => setSavepopup(false));
        }
      }
    }
  };

  const handleDraft = () => {
    if (data?._id) {
      dispatch(
        editPoultry({
          important_information: watch('important_information'),
          utilisation_information: watch('utilisation_information'),
          income_from_sale: watch('income_from_sale'),
          expenditure_on_inputs: watch('expenditure_on_inputs'),
          steroids: watch('steroids'),
          crop_id: cropId,
          productDetails: harvestedProductList.map(itm => {
            return {
              _id: itm?._id,
              name: itm?.name || '',
              production_output: itm?.production_output,
              self_consumed: itm?.self_consumed,
              fed_to_livestock: itm?.fed_to_livestock,
              sold_to_neighbours: itm?.sold_to_neighbours,
              sold_for_industrial_use: itm?.sold_for_industrial_use,
              wastage: itm?.wastage,
              other: itm?.other,
              other_value: itm?.other_value,
              month_harvested: moment(itm?.month_harvested).format(
                'YYYY-MM-DD',
              ),
              processing_method: itm?.processing_method,
            };
          }),
          status: 0,
        }),
      )
        .unwrap()
        .then(
          () =>
            Toast.show({
              text1: 'Success',
              text2: 'Poultry updated successfully!',
            }),
          dispatch(getPoultry()),
          setDraftpopup(false),
          navigation.goBack(),
        )
        .catch(err => {
          console.log('err', err);
          Toast.show({
            type: 'error',
            text1: 'Error Occurred',
            text2: 'Something Went wrong, Please try again later!',
          });
        })
        .finally(() => {
          setDraftpopup(false), navigation.goBack();
        });
    } else {
      dispatch(
        addPoultry({
          important_information: watch('important_information'),
          utilisation_information: watch('utilisation_information'),
          income_from_sale: watch('income_from_sale'),
          expenditure_on_inputs: watch('expenditure_on_inputs'),
          steroids: watch('steroids'),
          productDetails: harvestedProductList,
          status: 0,
          crop_id: cropId,
        }),
      )
        .unwrap()
        .then(
          () =>
            Toast.show({
              text1: 'Success',
              text2: 'Poultry added successfully!',
            }),
          dispatch(getPoultry()),
          setDraftpopup(false),
          navigation.goBack(),
        )
        .catch(err => {
          console.log('err at add', err);
          Toast.show({
            type: 'error',
            text1: 'Error Occurred',
            text2: 'Something Went wrong, Please try again later!',
          });
        })
        .finally(() => setDraftpopup(false));
    }
  };
  const replaceObjectById = (array, newObj) => {
    const newArray = array.map(obj =>
      obj.name === newObj.name ? newObj : obj,
    );
    return newArray;
  };
  useEffect(() => {
    if (edit) {
      const updatedArray = replaceObjectById(harvestedProductList, edit);
      setHarvestedProductList(updatedArray);
      // console.log("check", updatedArray)
    }
  }, [edit]);
  const addProduct = () => {
    setHarvestedProductList([
      ...harvestedProductList,
      {
        name: productName,
        production_output: '0',
        self_consumed: '0',
        fed_to_livestock: '0',
        sold_to_neighbours: '0',
        sold_for_industrial_use: '0',
        wastage: '0',
        other: 'Retain',
        other_value: '0',
        month_harvested: moment().format('YYYY-MM-DD') || '',
        processing_method: false,
      },
    ]);
    navigation.navigate('poultryEdit', {
      cropType: productName,
      edit: {},
      cropId: cropId,
      data: data,
    })
    setProductName('');
  };
  const removeList = name => {
    let newList = harvestedProductList.filter(obj => obj.name !== name);
    setHarvestedProductList(newList);
  };
  const toggleItem = (value, index) => {
    setAge(value);
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
    setTreeAge(false);
  };
  useEffect(() => {
    dispatch(getMeasurement());
  }, []);
  return (
    <View style={styles.container}>
      <CustomHeader
        goBack={() => navigation.goBack()}
        headerName={cropType}
        backIcon={true}
      />
      <ScrollView>
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
            <View style={styles.impContainer}>
              <Controller
                control={control}
                name="important_information.number"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <InputWithoutBorder
                      measureName={weight ? weight : 'kg'}
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
                name="important_information.avg_age_of_live_stocks"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    // <TouchableOpacity onPress={() => { setTreeAge(true) }}>
                    <InputWithoutBorder
                      measureName={'Years'}
                      productionName={t('average age of the live stocks')}
                      value={value.toString()}
                      onChangeText={onChange}
                      notRightText={false}
                      editable={true}
                      placeholder={'Select Average age of live stocks'}
                    />
                    // </TouchableOpacity>
                  );
                }}
              />
              {errors?.important_information?.type_of_feed?.message ? (
                <Text style={styles.error}>
                  {errors?.important_information?.type_of_feed?.message}
                </Text>
              ) : null}

              <Controller
                control={control}
                name="important_information.type_of_feed"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <CustomDropdown3
                      data={[...feed, {id: 0, name: 'Others'}]}
                      selectedValue={onChange}
                      value={value == 1 ? 'others' : value}
                      defaultVal={{key: value, value: value}}
                      infoName={
                        t('type of feed')
                      }
                    />
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
                            measureName={weight ? weight : 'kg'}
                            productionName={'Create Type'}
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
              {/* */}
            </View>
          ) : null}
          {/* production information */}
          <View style={styles.subArea}>
            <Text style={styles.subAreaText}>{t('feed information')}</Text>
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
            <View style={styles.perContainer}>
              <Controller
                control={control}
                name="utilisation_information.total_feed"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <InputWithoutBorder
                      measureName={weight ? weight : 'kg'}
                      productionName={t('total feed')}
                      value={value}
                      onChangeText={onChange}
                    />
                  );
                }}
              />
              {errors?.utilisation_information?.total_feed?.message ? (
                <Text style={styles.error}>
                  {errors?.utilisation_information?.total_feed?.message}
                </Text>
              ) : null}
              <View style={styles.innerInputView}>
                <Divider style={styles.divider2} />
                <View style={{width: '100%'}}>
                  <Controller
                    control={control}
                    name="utilisation_information.self_produced"
                    render={({field}) => {
                      const {onChange, value} = field;
                      return (
                        <InputWithoutBorder
                          measureName={weight ? weight : 'kg'}
                          productionName={t('self produced')}
                          value={value}
                          onChangeText={onChange}
                        />
                      );
                    }}
                  />
                  {errors?.utilisation_information?.self_produced?.message ? (
                    <Text style={styles.error}>
                      {errors?.utilisation_information?.self_produced?.message}
                    </Text>
                  ) : null}
                  <Controller
                    name="utilisation_information.neighbours"
                    control={control}
                    render={({field}) => {
                      const {onChange, value} = field;
                      return (
                        <InputWithoutBorder
                          measureName={weight ? weight : 'kg'}
                          productionName={t('neighbour')}
                          value={value}
                          multiline={false}
                          notRightText={false}
                          onChangeText={onChange}
                        />
                      );
                    }}
                  />
                  {errors?.utilisation_information?.neighbours?.message ? (
                    <Text style={styles.error}>
                      {errors?.utilisation_information?.neighbours?.message}
                    </Text>
                  ) : null}
                  <Controller
                    name="utilisation_information.purchased_from_market"
                    control={control}
                    render={({field}) => {
                      const {onChange, value} = field;
                      return (
                        <InputWithoutBorder
                          measureName={weight ? weight : 'kg'}
                          productionName={t('purchased from market')}
                          value={value}
                          multiline={false}
                          notRightText={false}
                          onChangeText={onChange}
                        />
                      );
                    }}
                  />
                  {errors?.utilisation_information?.purchased_from_market
                    ?.message ? (
                    <Text style={styles.error}>
                      {
                        errors?.utilisation_information?.purchased_from_market
                          ?.message
                      }
                    </Text>
                  ) : null}
                  <Controller
                    name="utilisation_information.other"
                    control={control}
                    render={({field}) => {
                      const {onChange, value} = field;
                      return (
                        <InputWithoutBorder
                          measureName={weight ? weight : 'kg'}
                          productionName={t("Other(Specify if any)")}
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
                              measureName={weight ? weight : 'kg'}
                              productionName={
                                watch('utilisation_information.other')
                                  ? watch('utilisation_information.other')
                                  : 'Other Value'
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
                      {watch('utilisation_information.other').length > 0 && (
                        <>
                          {errors?.utilisation_information?.other_value
                            ?.message ? (
                            <Text style={styles.error}>
                              {
                                errors?.utilisation_information?.other_value
                                  ?.message
                              }
                            </Text>
                          ) : null}
                        </>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ) : null}
          <View style={{width: '97%', alignSelf: 'center'}}>
            <Controller
              name="income_from_sale"
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
            {errors?.income_from_sale?.message ? (
              <Text style={styles.error}>
                {errors?.income_from_sale?.message}
              </Text>
            ) : null}
            <Controller
              name="expenditure_on_inputs"
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
            {errors?.expenditure_on_inputs?.message ? (
              <Text style={styles.error}>
                {errors?.expenditure_on_inputs?.message}
              </Text>
            ) : null}
            <Text style={styles.processing_text}>
              {t('any hormones/ artificial productivity enhancing mechanism applied')}
            </Text>
            <View style={styles.processing_container}>
              <Controller
                name="steroids"
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
              <Text style={styles.yes_text}>Yes</Text>
              <Controller
                name="steroids"
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
              <Text style={styles.yes_text}>No</Text>
            </View>
            {/* harvested product section */}
            <View style={styles.subArea}>
              <Text style={styles.subAreaText}>{t('harvested product')}</Text>
              <Divider
                bold={true}
                style={[styles.divider, {width: '45%'}]}
                horizontalInset={true}
              />
              <TouchableOpacity
                onPress={() => setHarvestedProduct(!harvestedProduct)}>
                {harvestedProduct ? (
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
            <>
              {harvestedProduct ? (
                <>
                  {harvestedProductList[0] !== undefined ? (
                    <>
                      {harvestedProductList.map(item => {
                        return (
                          <PoultryProductDescription
                            productName={t('product type')}
                            productNameValue={item?.name}
                            date={t('harvested on')}
                            dateValue={
                              data !== null || data !== undefined
                                ? moment(item?.month_harvested).format(
                                    'YYYY-MM-DD',
                                  )
                                : item?.month_harvested
                            }
                            qty={t('quantity')}
                            qtyValue={item?.production_output}
                            del={() => removeList(item?.name)}
                            data={item ? item : []}
                            edit={() =>
                              navigation.navigate('poultryEdit', {
                                cropType: item?.name,
                                edit: item,
                                cropId: cropId,
                                data: data,
                              })
                            }
                          />
                        );
                      })}
                    </>
                  ) : null}
                </>
              ) : null}
            </>
            <TouchableOpacity
              style={styles.add_button}
              onPress={() => setHarvestProdAdd(true)}>
              <Text style={styles.add_button_text}>{t('add')}</Text>
              <AntDesign name="plus" size={15} color="#fff" />
            </TouchableOpacity>
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
        </View>
      </ScrollView>
      {treeAge && (
        <AddBottomSheet>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>{t('average of tree')}</Text>
            <TouchableOpacity
              onPress={() => {
                setTreeAge(!treeAge);
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
                <Controller
                  control={control}
                  name="important_information.avg_age_of_live_stocks"
                  render={({field}) => {
                    const {onChange, value} = field;
                    return (
                      <Checkbox
                        name={item?.age}
                        checked={item?.checked}
                        checking={() => {
                          onChange(item?.ageVal), toggleItem(item?.age, indx);
                        }}
                      />
                    );
                  }}
                />
              );
            })}
          </View>
        </AddBottomSheet>
      )}
      {harvestProdAdd && (
        <AddBottomSheet>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>{t('add harvested product')}</Text>
            <TouchableOpacity
              onPress={() => {
                setHarvestProdAdd(!harvestProdAdd);
                setFocus(!focus);
              }}>
              <Image
                source={require('../../../assets/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.harvested_prod_container}>
            <InputWithoutBorder
              measureName={weight ? weight : 'kg'}
              productionName={t('name of harvested product')}
              value={productName}
              keyboardType="default"
              onChangeText={e => {
                setProductName(e);
                if (e.endsWith("\n")) {
                  setProductName(e);
                  setHarvestProdAdd(!harvestProdAdd);
                  setFocus(!focus);
                  addProduct()
                }
              }}
              multiline={false}
              notRightText={true}
              onFocus={() => setFocus(true)}
            />
          </View>
          <View style={{marginTop: '15%', width: '90%', alignSelf: 'center'}}>
            <CustomButton
              btnText={t('submit')}
              onPress={() => {
                setHarvestProdAdd(!harvestProdAdd);
                setFocus(!focus);
                addProduct();
              }}
            />
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
              onPress={handleSubmit(submit)}
              // onPress={()=>{}}
            />
            <CustomButton
              style={styles.draftButton}
              btnText={t('cancel')}
              onPress={() => {
                setSavepopup(false), navigation.goBack();
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
            />
            <CustomButton
              style={styles.draftButton}
              btnText={t('cancel')}
              onPress={() => setDraftpopup(false)}
            />
          </View>
        </View>
      </PopupModal>
      {/* <Toast
                positionValue={30}
                style={{ height: 'auto', minHeight: 70 }}
                width={300}
            /> */}
    </View>
  );
};

export default PoultryType;

const width = Dimensions.get('window').width;
const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    textInputArea: {
      alignSelf: 'center',
      width: '95%',
    },
    error: {
      fontFamily: 'ubuntu_regular',
      fontSize: 14 / fontScale,
      // marginTop: 5,
      color: '#ff000e',
      marginLeft: 20,
      marginBottom: 5,
      marginTop: 5,
    },
    subArea: {
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      margin: 10,
      marginTop: '5%',
      width: width / 1.04,
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
      fontFamily: 'ubuntu_medium',
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
      width: 'auto',
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
      fontFamily: 'ubuntu_regular',
      fontSize: 14 / fontScale,
      color: '#fff',
      alignSelf: 'center',
      paddingHorizontal:5
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
      fontFamily: 'ubuntu_medium',
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
      fontFamily: 'ubuntu_medium',
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
      fontFamily: 'ubuntu_medium',
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
