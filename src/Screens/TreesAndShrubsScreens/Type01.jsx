import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  ScrollView,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import ImportantInformationTress from '../../Components/Accordion/ImportantInformationTress';
import {Divider} from 'react-native-paper';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import ProductDescription from '../../Components/CustomDashboard/ProductDescription';
import BottomModal from '../../Components/BottomSheet/BottomModal';
import Checkbox from '../../Components/Checkboxes/Checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import {validation} from '../../Validation/Validation';
import {useDispatch, useSelector} from 'react-redux';
import {getTree} from '../../Redux/TreesSlice';
import Toast from 'react-native-toast-message';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {fertilisers, pesticides, soilHealth} from '../../MockData/Mockdata';
import moment from 'moment';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';
import {useTranslation} from 'react-i18next';
import '../../i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useMutation} from '@tanstack/react-query';
import {addTree, editTree} from '../../functions/TreesAndShrubsScreen';
import {useUser} from '../../Hooks/useUser';

const Type01 = ({navigation, route}) => {
  const {t} = useTranslation();
  const soilHealth = [
    {key: 'stable', name: t('stable')},
    {key: 'decreasing yield', name: t('decreasing yield')},
  ];
  const fertilisers = [
    {key: 'organic self made', name: t('organic self made')},
    {key: 'organic purchased', name: t('organic purchased')},
    {key: 'chemical based', name: t('chemical based')},
    {key: 'none', name: t('none')},
  ];
  const pesticides = [
    {key: 'organic self made', name: t('organic self made')},
    {key: 'organic purchased', name: t('organic purchased')},
    {key: 'chemical based', name: t('chemical based')},
    {key: 'none', name: t('none')},
  ];
  const {cropName, edit, crop_id, data} = route.params;
  const [impInfo, setImpInfo] = useState(true);
  const [harvestedProduct, setHarvestedProduct] = useState(true);
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {data: userDetails} = useUser();
  const [treeAge, setTreeAge] = useState(false);
  const [harvestProdAdd, setHarvestProdAdd] = useState(false);
  const [focus, setFocus] = useState(false);
  const [savepopup, setSavepopup] = useState(false);
  const [draftpopup, setDraftpopup] = useState(false);
  const [productName, setProductName] = useState('');
  const {currentTree} = useSelector(state => state.treeShrub);
  const dispatch = useDispatch();
  const [averageAge, setAverageAge] = useState([
    {
      id: 1,
      name: '0 to 5 years',
      age: t('0 to 5 years'),
      checked: false,
    },
    {
      id: 2,
      name: '5 to 10 years',
      age: t('5 to 10 years'),
      checked: false,
    },
    {
      id: 3,
      name: '10 to 20 years',
      age: t('10 to 20 years'),
      checked: false,
    },
    {
      id: 4,
      name: '20 to 30 years',
      age: t('20 to 30 years'),
      checked: false,
    },
    {
      id: 5,
      name: '30 to 50 years',
      age: t('30 to 50 years'),
      checked: false,
    },
    {
      id: 6,
      name: '50 to 70 years',
      age: t('50 to 70 years'),
      checked: false,
    },
    {
      id: 7,
      name: 'Above 70',
      age: t('Above 70'),
      checked: false,
    },
  ]);
  const [globalError, setGlobalError] = useState('');
  const [harvestedError, setHarvestedError] = useState('');
  const [harvestedProductList, setHarvestedProductList] = useState([]);
  const [productList, setProductlist] = useState([]);
  const [age, setAge] = useState('');

  const bottomSheetRef = React.useRef(null);
  const bottomSheetRef2 = React.useRef(null);

  const schema = yup.object().shape({
    important_information: yup.object().shape({
      number_of_trees: yup.string().required(t('trees is required')),
      avg_age_of_trees: yup
        .string()
        .required(t('avg_age_of_trees is required')),
      soil_health: yup.string().required(t('soil_health is required')),
      decreasing_rate: yup
        .string()
        .when('soil_health', (soil_health, schema2) =>
          soil_health === 'decreasing yield'
            ? yup.string().required(t('decreasing_rate is required'))
            : schema2,
        ),
      type_of_fertilizer_used: yup
        .string()
        .required(t('type_of_fertilizer_used is required')),
      type_of_pesticide_used: yup
        .string()
        .required(t('type_of_pesticide_used is required')),
      income_from_sale: yup
        .string()
        .required(t('income_from_sale is required')),
      expenditure_on_inputs: yup
        .string()
        .required(t('expenditure_on_inputs is required')),
    }),
  });

  useEffect(() => {
    if (data) {
      setHarvestedProductList(data?.products);
    } else {
      setHarvestedProductList([]);
    }
  }, [data]);

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
        number_of_trees: String(data?.number_of_trees || ''),
        avg_age_of_trees: String(data?.avg_age_of_trees || ''),
        decreasing_rate: String(data?.decreasing_rate || ''),
        expenditure_on_inputs: String(data?.expenditure_on_inputs || ''),
        income_from_sale: String(data?.income_from_sale || ''),
        soil_health: String(data?.soil_health || ''),
        type_of_fertilizer_used: String(data?.type_of_fertilizer_used || ''),
        type_of_pesticide_used: String(data?.type_of_pesticide_used || ''),
      },
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSavepopup(false);
    }
  }, [errors]);

  const {mutate: addTreeData, isPending: isAddTreePending} = useMutation({
    mutationFn: addTree,
    onSuccess: _data => {
      console.log(_data);
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

  const {mutate: editTreeData, isPending: isEditTreePending} = useMutation({
    mutationFn: editTree,
    onSuccess: () => navigation.goBack(),
    onError: () =>
      Toast.show({
        type: 'error',
        text1: 'Error Occurred',
        text2: 'Something Went wrong, Please try again later!',
      }),
    onSettled: () => setSavepopup(false),
  });

  const onSubmit = data2 => {
    if (data?._id) {
      if (harvestedProductList.length > 0) {
        editTreeData({
          ...watch('important_information'),
          products: harvestedProductList.map(itm => {
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
              tree_crop_id: crop_id,
            };
          }),
          status: 1,
          tree_id: data?._id,
        });
      } else {
        setGlobalError('Please add a harvested product!');
        setSavepopup(false);
      }
    } else {
      if (harvestedProductList.length > 0) {
        console.log('tree_crop_id', crop_id);
        addTreeData({
          ...watch('important_information'),
          products: harvestedProductList,
          status: 1,
          tree_crop_id: crop_id,
        });
      } else {
        setGlobalError('Please add a harvested product!');
        setSavepopup(false);
      }
    }
  };

  console.log(harvestedProductList);

  const handleDraft = () => {
    if (data?._id) {
      editTreeData(
        {
          ...watch('important_information'),
          products: harvestedProductList.map(itm => {
            return {
              _id: itm?._id,
              name: itm?.name || '',
              production_output: itm?.production_output || '',
              self_consumed: itm?.self_consumed || '',
              fed_to_livestock: itm?.fed_to_livestock || '',
              sold_to_neighbours: itm?.sold_to_neighbours || '',
              sold_for_industrial_use: itm?.sold_for_industrial_use || '',
              wastage: itm?.wastage || '',
              other: itm?.other || '',
              other_value: itm?.other_value || '',
              month_harvested: moment(itm?.month_harvested).format(
                'YYYY-MM-DD',
              ),
              processing_method: itm?.processing_method,
              tree_crop_id: crop_id,
            };
          }),
          status: 0,
          tree_id: data?._id,
        },
        {
          onSettled: () => setDraftpopup(false),
        },
      );
    } else {
      addTreeData(
        {
          ...watch('important_information'),
          products: harvestedProductList,
          status: 0,
          tree_crop_id: crop_id,
        },
        {
          onSettled: () => setDraftpopup(false),
        },
      );
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
    }
  }, [edit]);

  const addProduct = () => {
    if (productName.length === 0) {
      setHarvestedError('Please enter a harvested product name!');
    } else {
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
      navigation.navigate('editType', {
        cropType: productName,
        edit: {},
        cropId: crop_id,
        data: data,
      });
      setHarvestProdAdd(false);
      bottomSheetRef2.current.close();
      setProductName('');
    }
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
          checked: true,
        };
        return item;
      }
      return checkbox;
    });
    setAverageAge(newValue);
    setTreeAge(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        goBack={() => navigation.goBack()}
        headerName={cropName}
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
            <View style={styles.container}>
              <Controller
                control={control}
                name="important_information.number_of_trees"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <InputWithoutBorder
                      measureName={'kg'}
                      productionName={t('number trees')}
                      value={value}
                      onChangeText={onChange}
                      notRightText={true}
                    />
                  );
                }}
              />
              {errors?.important_information?.number_of_trees?.message ? (
                <Text style={styles.error}>
                  {errors?.important_information?.number_of_trees?.message}
                </Text>
              ) : null}

              <Controller
                control={control}
                name="important_information.avg_age_of_trees"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <TouchableHighlight onPress={() => setTreeAge(true)}>
                      <InputWithoutBorder
                        measureName={'kg'}
                        productionName={t('average of tree')}
                        value={value}
                        onChangeText={onChange}
                        notRightText={true}
                        editable={false}
                        placeholder={t('Select Average age of tree')}
                      />
                    </TouchableHighlight>
                  );
                }}
              />
              {errors?.important_information?.avg_age_of_trees?.message ? (
                <Text style={styles.error}>
                  {errors?.important_information?.avg_age_of_trees?.message}
                </Text>
              ) : null}

              <Controller
                control={control}
                name="important_information.soil_health"
                render={({field}) => {
                  const {onChange, value} = field;
                  console.log('soil health', value);
                  return (
                    <CustomDropdown3
                      data={soilHealth}
                      value={value}
                      defaultVal={{key: value, value: t(value)}}
                      selectedValue={onChange}
                      infoName={t('soil health')}
                    />
                  );
                }}
              />
              {errors?.important_information?.soil_health?.message ? (
                <Text style={styles.error}>
                  {errors?.important_information?.soil_health?.message}
                </Text>
              ) : null}
              {watch('important_information.soil_health') ===
                'decreasing yield' && (
                <View style={styles.innerInputView}>
                  <Divider style={styles.input_divider} />
                  <View style={{width: '100%'}}>
                    <Controller
                      control={control}
                      name="important_information.decreasing_rate"
                      render={({field}) => {
                        const {onChange, value} = field;
                        return (
                          <InputWithoutBorder
                            measureName={'%'}
                            productionName={t('how much from first planting')}
                            value={value}
                            onChangeText={onChange}
                          />
                        );
                      }}
                    />
                    {errors?.important_information?.decreasing_rate?.message ? (
                      <Text style={styles.error}>
                        {
                          errors?.important_information?.decreasing_rate
                            ?.message
                        }
                      </Text>
                    ) : null}
                  </View>
                </View>
              )}
              <Controller
                control={control}
                name="important_information.type_of_fertilizer_used"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <CustomDropdown3
                      data={fertilisers}
                      selectedValue={onChange}
                      value={value}
                      defaultVal={{key: value, value: t(value)}}
                      infoName={t('type of fertilizer')}
                    />
                  );
                }}
              />
              {errors?.important_information?.type_of_fertilizer_used
                ?.message ? (
                <Text style={styles.error}>
                  {
                    errors?.important_information?.type_of_fertilizer_used
                      ?.message
                  }
                </Text>
              ) : null}
              <Controller
                control={control}
                name="important_information.type_of_pesticide_used"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    <CustomDropdown3
                      data={pesticides}
                      selectedValue={onChange}
                      value={value}
                      defaultVal={{key: value, value: t(value)}}
                      infoName={t('type of pesticides')}
                    />
                  );
                }}
              />
              {errors?.important_information?.type_of_pesticide_used
                ?.message ? (
                <Text style={styles.error}>
                  {
                    errors?.important_information?.type_of_pesticide_used
                      ?.message
                  }
                </Text>
              ) : null}
              <Controller
                control={control}
                name="important_information.income_from_sale"
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
              {errors?.important_information?.income_from_sale?.message ? (
                <Text style={styles.error}>
                  {errors?.important_information?.income_from_sale?.message}
                </Text>
              ) : null}
              <Controller
                control={control}
                name="important_information.expenditure_on_inputs"
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
              {errors?.important_information?.expenditure_on_inputs?.message ? (
                <Text style={styles.error}>
                  {
                    errors?.important_information?.expenditure_on_inputs
                      ?.message
                  }
                </Text>
              ) : null}
            </View>
          ) : null}
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
                {harvestedProductList[0] !== undefined &&
                harvestedProductList.length >= 0 ? (
                  <>
                    {harvestedProductList.map(item => {
                      return (
                        <ProductDescription
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
                            navigation.navigate('editType', {
                              cropType: item?.name,
                              edit: item,
                              cropId: crop_id,
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
            onPress={() => {
              setHarvestProdAdd(true);
              setGlobalError('');
            }}>
            <Text style={styles.add_button_text}>{t('add')}</Text>
            <AntDesign name="plus" size={15} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text
          style={{
            fontFamily: 'ubuntu-regular',
            fontSize: 14 / fontScale,
            marginTop: 5,
            color: '#ff000e',
            marginLeft: 25,
          }}>
          {globalError}
        </Text>
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
      </ScrollView>
      <AddBottomSheet
        modalVisible={treeAge}
        bottomSheetRef={bottomSheetRef}
        setModal={setTreeAge}>
        <View style={styles.BottomTopContainer}>
          <Text style={styles.headerText}>{t('average of tree')}</Text>
          <TouchableOpacity
            onPress={() => {
              setTreeAge(!treeAge);
              bottomSheetRef.current.close();
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
                key={indx}
                name="important_information.avg_age_of_trees"
                render={({field}) => {
                  const {onChange, value} = field;
                  return (
                    // <CalendarPicker
                    //   onDateChange={onChange}
                    //   selectedStartDate={value}
                    // />
                    <Checkbox
                      name={item?.age}
                      checked={item?.checked}
                      checking={() => {
                        onChange(item?.name), toggleItem(item?.age, indx);
                      }}
                    />
                  );
                }}
              />
            );
          })}
        </View>
      </AddBottomSheet>
      <AddBottomSheet
        modalVisible={harvestProdAdd}
        setModal={setHarvestProdAdd}
        bottomSheetRef={bottomSheetRef2}>
        <View style={styles.BottomTopContainer}>
          <Text style={styles.headerText}>{t('add harvested product')}</Text>
          <TouchableOpacity
            onPress={() => {
              setHarvestProdAdd(!harvestProdAdd);
              setFocus(!focus);
              bottomSheetRef2.current.close();
            }}>
            <Image
              source={require('../../../assets/close.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.harvested_prod_container}>
          <InputWithoutBorder
            measureName={'kg'}
            productionName={t('name of harvested product')}
            value={productName}
            keyboardType="default"
            onChangeText={e => {
              setProductName(e);
              setHarvestedError('');
              if (e.endsWith('\n')) {
                setProductName(e);
                setHarvestProdAdd(!harvestProdAdd);
                setFocus(!focus);
                addProduct();
              }
            }}
            multiline={true}
            notRightText={true}
            onFocus={() => setFocus(true)}
          />
          <Text
            style={{
              fontFamily: 'ubuntu-regular',
              fontSize: 14 / fontScale,
              marginTop: 5,
              color: '#ff000e',
              marginLeft: 12,
            }}>
            {harvestedError}
          </Text>
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
              onPress={handleSubmit(onSubmit)}
              loading={isAddTreePending || isEditTreePending}
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
              loading={isAddTreePending || isEditTreePending}
            />
            <CustomButton
              style={styles.draftButton}
              btnText={t('cancel')}
              onPress={() => setDraftpopup(false)}
            />
          </View>
        </View>
      </PopupModal>
      <Toast
        positionValue={30}
        style={{height: 'auto', minHeight: 70}}
        width={300}
      />
    </SafeAreaView>
  );
};

export default Type01;
const width = Dimensions.get('window').width;
const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    error: {
      color: 'red',
      fontSize: 14 / fontScale,
      fontFamily: 'ubuntu',
      marginLeft: 15,
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
      fontFamily: 'ubuntu-regular',
      fontSize: 14 / fontScale,
      color: '#fff',
      alignSelf: 'center',
      paddingHorizontal: 5,
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
  });
