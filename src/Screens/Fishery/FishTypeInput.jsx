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
import UtilisationAccordion from '../../Components/Accordion/UtilisationAccordion';
import Toast from 'react-native-toast-message';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {useDispatch, useSelector} from 'react-redux';
import {validation} from '../../Validation/Validation';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import {addFishery, editFishery, getFishery} from '../../Redux/FisherySlice';
import {Others} from '../../MockData/Mockdata';
import {getFishFeed} from '../../Redux/OthersSlice';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';

const FishTypeInput = ({navigation, route}) => {
  const {cropType, screenName, data, cropId, type} = route.params;
  const [impInfo, setImpInfo] = useState(true);
  const [harvestedProduct, setHarvestedProduct] = useState(true);
  const {fishFeed} = useSelector(state => state.Others);
  const {measurement} = useSelector(state => state.Others);
  const { userDetails } = useSelector(state => state.auth);
  const [productionInfo, setProductionInfo] = useState(true);
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
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
      number_of_fishes: yup.string().required(validation.error.number),
      type_of_feed: yup.string().required(validation.error.type_of_feed),
    }),
    utilisation_information: yup.object().shape({
      total_feed: yup.string().required(validation.error.total_feed),
      production_output: yup.string().required(validation.error.output),
      self_consumed: yup.string().required(validation.error.self_consumed),
      sold_to_neighbours: yup
        .string()
        .required(validation.error.sold_to_neighbours),
      sold_for_industrial_use: yup
        .string()
        .required(validation.error.sold_for_industrial_use),
      wastage: yup.string().required(validation.error.wastage),
      other: yup.string().required(validation.error.other),
      other_value: yup.string().required(validation.error.other_value),
      income_from_sale: yup
        .string()
        .required(validation.error.income_from_sale),
      expenditure_on_inputs: yup
        .string()
        .required(validation.error.expenditure_on_inputs),
      yeild: yup.string().required(validation.error.yeild),
    }),
    processing_method: yup
      .string()
      .required(validation.error.processing_method),
    weight_measurement: yup
      .string()
      .required(validation.error.weight_measurement),
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
        total_feed: String(data?.production_information?.total_feed || ''),
        production_output: String(
          data?.production_information?.production_output || '',
        ),
        self_consumed: String(data?.production_information?.self_consumed || ''),
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
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSavepopup(false);
    }
  }, [errors]);
  
  const onSubmit = data2 => {
    console.log(data2);
    if (
      data2.important_information.type_of_feed === '' ||
      data2.utilisation_information.expenditure_on_inputs === '' ||
      data2.utilisation_information.income_from_sale === ''
    ) {
      setMessage('Input all fields');
      Toast.show({
        type: 'error',
        text1: 'All input fields fields',
      })
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
        addFishery({
          ...data2,
          status: 1,
          crop_id: cropId,
          fishery_type: 'pond',
          pond_name: type,
        }),
      )
        .unwrap()
        .then(
          () => {
            Toast.show({
              text1: 'Success',
              text2: 'Fishery added successfully!',
            }),
              setSavepopup(false),
              // navigation.goBack()
              navigation.navigate('fishery', {
                totalLand: null,
                screenName: 'Harvested from Pond',
              });
          },
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
  // console.log("watch import", watch('important_information'))
  // console.log("watch personal", watch('utilisation_information'))
  const handleDraft = () => {
    if (data?._id) {
      dispatch(
        editFishery({
          important_information: watch('important_information'),
          utilisation_information: watch('utilisation_information'),
          processing_method: watch('processing_method'),
          weight_measurement: watch('weight_measurement')
            ? watch('weight_measurement')
            : 'kg',
          status: 0,
          crop_id: cropId,
        }),
      )
        .unwrap()
        .then(() => {
          Toast.show({
            text1: 'Success',
            text2: 'Fishery drafted successfully!',
          }),
            dispatch(getFishery()),
            navigation.goBack();
        })
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
        addFishery({
          important_information: watch('important_information'),
          utilisation_information: watch('utilisation_information'),
          processing_method: watch('processing_method'),
          weight_measurement: watch('weight_measurement')
            ? watch('weight_measurement')
            : 'kg',
          status: 0,
          crop_id: cropId,
          fishery_type: 'pond',
          pond_name: type,
        }),
      )
        .unwrap()
        .then(
          () => {
            Toast.show({
              text1: 'Success',
              text2: 'Fishery added successfully!',
            }),
              setDraftpopup(false),
              navigation.navigate('fishery', {
                totalLand: null,
                screenName: 'Harvested from Pond',
              });
          },
          // dispatch(getFishery('pond')),
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

  // console.log('data', data);

  return (
    <View style={styles.container}>
      <CustomHeader
        goBack={() => navigation.goBack()}
        headerName={data?.fishery_crop?.name?data?.fishery_crop?.name:cropType}
        backIcon={true}
      />
      <ScrollView>
        <View style={styles.textInputArea}>
          {/* important information section */}
          <View style={styles.subArea}>
            <Text style={styles.subAreaText}>Important Information</Text>
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
                      measureName={'kg'}
                      productionName={'Number'}
                      value={value}
                      onChangeText={onChange}
                      notRightText={true}
                    />
                  );
                }}
              />
              {errors?.important_information?.number_of_fishes?.message ? (
                <Text style={styles.error}>
                  {errors?.important_information?.number_of_fishes?.message}
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
                      defaultVal={{ key: value, value: value }}
                      // defaultVal={{ key: 1, value: value }}
                      selectedValue={onChange}
                      infoName={'Weight Measuremnt'}
                    />
                  );
                }}
              />
              <Controller
                control={control}
                name="utilisation_information.total_feed"
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <InputWithoutBorder
                      measureName={
                        watch('weight_measurement')
                          ? watch('weight_measurement')
                          : 'kg'
                      }
                      productionName={'Total Feed'}
                      value={value}
                      onChangeText={onChange}
                    />
                  );
                }}
              />
              {errors?.utilisation_information?.total_feed?.message ? (
                <Text style={styles.error}>
                  {errors?.utilisation_information?.total_feed.message}
                </Text>
              ) : null}
              <Controller
                control={control}
                name="important_information.type_of_feed"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <CustomDropdown3
                      data={[...fishFeed, {id: 0, name: 'Others'}]}
                      selectedValue={onChange}
                      value={value}
                      defaultVal={{key: value, value: value}}
                      infoName={
                        'Type of feed required apart from grassland grazing'
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
                            measureName={watch('weight_measurement')
                              ? watch('weight_measurement')
                              : 'kg'}
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
            </View>
          ) : null}
          {/* production information */}
          <View style={styles.subArea}>
            <Text style={styles.subAreaText}>Production Information</Text>
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
                      measureName={
                        watch('weight_measurement')
                          ? watch('weight_measurement')
                          : 'kg'
                      }
                      productionName={'Total Feed'}
                      value={value}
                      onChangeText={onChange}
                    />
                  );
                }}
              />
              {errors?.utilisation_information?.total_feed?.message ? (
                <Text style={styles.error}>
                  {errors?.utilisation_information?.total_feed.message}
                </Text>
              ) : null} */}

              <Controller
                control={control}
                name="utilisation_information.production_output"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <InputWithoutBorder
                      measureName={
                        watch('weight_measurement')
                          ? watch('weight_measurement')
                          : 'kg'
                      }
                      productionName={'Output'}
                      value={value}
                      onChangeText={onChange}
                    />
                  );
                }}
              />
              {errors?.utilisation_information?.output?.message ? (
                <Text style={styles.error}>
                  {errors?.utilisation_information?.output?.message}
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
                          measureName={
                            watch('weight_measurement')
                              ? watch('weight_measurement')
                              : 'kg'
                          }
                          productionName={'Self Comsumed'}
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
                          measureName={
                            watch('weight_measurement')
                              ? watch('weight_measurement')
                              : 'kg'
                          }
                          productionName="Sold to Neighbours"
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
                          measureName={
                            watch('weight_measurement')
                              ? watch('weight_measurement')
                              : 'kg'
                          }
                          productionName="Sold for Industrial Use"
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
                          measureName={
                            watch('weight_measurement')
                              ? watch('weight_measurement')
                              : 'kg'
                          }
                          productionName="Wastage"
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
                          measureName={
                            watch('weight_measurement')
                              ? watch('weight_measurement')
                              : 'kg'
                          }
                          productionName="Others(Specify if any)"
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
                              measureName={
                                watch('weight_measurement')
                                  ? watch('weight_measurement')
                                  : 'kg'
                              }
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
                  productionName={'Income from sale of Output'}
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
            name="utilisation_information.expenditure_on_inputs"
            control={control}
            render={({field}) => {
              const {onChange, value} = field;
              return (
                <InputWithoutBorder
                  measureName={userDetails?.currency}
                  productionName={'Expenditure on inputs'}
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

          <Controller
            name="utilisation_information.yeild"
            control={control}
            render={({field}) => {
              const {onChange, value} = field;
              return (
                <InputWithoutBorder
                  measureName={watch('weight_measurement') + '/' + userDetails?.land_measurement_symbol}
                  productionName={'Yields'}
                  value={value}
                  onChangeText={onChange}
                  notRightText={false}
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
          <Text style={styles.processing_text}>
            Required Processing method if any for the outputs
          </Text>
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
            <Text style={styles.yes_text}>Yes</Text>
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
            <Text style={styles.yes_text}>No</Text>
          </View>
        </View>
        {message && (
          <Text
            style={styles.error}>
            {message}
          </Text>
        )}
        <View style={styles.bottomPopupbutton}>
          <CustomButton
            style={styles.submitButton}
            btnText={'Submit'}
            onPress={() => {
              setSavepopup(true);
            }}
          />
          <CustomButton
            style={styles.draftButton}
            btnText={'Save as draft'}
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
            <Text style={styles.confirmText}>Confirm</Text>
            <Text style={styles.nextText}>
              Lorem Ipsum is simply dummy text of the.Lorem Ipsum.
            </Text>
            <View style={styles.bottomPopupbutton}>
              <CustomButton
                style={styles.submitButton}
                btnText={'Submit'}
                onPress={
                  // setSavepopup(false), navigation.goBack();
                  handleSubmit(onSubmit)
                }
              />
              <CustomButton
                style={styles.draftButton}
                btnText={'Cancel'}
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
            <Text style={styles.confirmText}>Save as Draft</Text>
            <Text style={styles.nextText}>
              Lorem Ipsum is simply dummy text of the.Lorem Ipsum.
            </Text>
            <View style={styles.bottomPopupbutton}>
              <CustomButton
                style={styles.submitButton}
                btnText={'Save'}
                onPress={handleDraft}
              />
              <CustomButton
                style={styles.draftButton}
                btnText={'Cancel'}
                onPress={() => setDraftpopup(false)}
              />
            </View>
          </View>
        </PopupModal>
      </ScrollView>
    </View>
  );
};

export default FishTypeInput;

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
      marginBottom: 20,
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
      fontFamily: 'ubuntu_regular',
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
