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
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ImportantInformationTress from '../../Components/Accordion/ImportantInformationTress';
import { Divider } from 'react-native-paper';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import ProductDescription from '../../Components/CustomDashboard/ProductDescription';
import BottomModal from '../../Components/BottomSheet/BottomModal';
import Checkbox from '../../Components/Checkboxes/Checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import { validation } from '../../Validation/Validation';
import { useDispatch, useSelector } from 'react-redux';
import { addTree, editTree, getTree } from '../../Redux/TreesSlice';
import Toast from 'react-native-toast-message';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { fertilisers, pesticides, soilHealth } from '../../MockData/Mockdata';
import moment from 'moment';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';

const Type01 = ({ navigation, route }) => {
  const { cropType, edit, cropId, data } = route.params;
  const [impInfo, setImpInfo] = useState(true);
  const [harvestedProduct, setHarvestedProduct] = useState(true);
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [treeAge, setTreeAge] = useState(false)
  const [harvestProdAdd, setHarvestProdAdd] = useState(false)
  const [focus, setFocus] = useState(false)
  const [savepopup, setSavepopup] = useState(false);
  const [draftpopup, setDraftpopup] = useState(false);
  const [productName, setProductName] = useState('')
  const { currentTree } = useSelector((state) => state.treeShrub)
  const dispatch = useDispatch()
  const [averageAge, setAverageAge] = useState([
    {
      id: 1,
      age: 'Less than a year',
      checked: true
    },
    {
      id: 2,
      age: '1 to 2 years',
      checked: false
    },
    {
      id: 3,
      age: '2 to 3 years',
      checked: false
    },
    {
      id: 4,
      age: '3 to 5 year',
      checked: false
    },
  ])
  const [harvestedProductList, setHarvestedProductList] = useState([])
  const [productList, setProductlist] = useState([])
  const [age, setAge] = useState('')
  const schema = yup.object().shape({
    important_information: yup.object().shape({
      number_of_trees: yup.string().required(validation.error.number_of_trees),
      avg_age_of_trees: yup.string().required(validation.error.avg_age_of_trees),
      soil_health: yup.string().required(validation.error.soil_health),
      decreasing_rate: yup
        .string()
        .when('soil_health', (soil_health, schema2) =>
          soil_health === 'decreasing yield'
            ? yup.string().required(validation.error.decreasing_rate)
            : schema2,
        ),
      type_of_fertilizer_used: yup
        .string()
        .required(validation.error.type_of_fertilizer_used),
      type_of_pesticide_used: yup
        .string()
        .required(validation.error.type_of_pesticide_used),
      income_from_sale: yup
        .string()
        .required(validation.error.income_from_sale),
      expenditure_on_inputs: yup
        .string()
        .required(validation.error.expenditure_on_inputs)
    }),
  });
  useEffect(()=>{
    if(data){
      setHarvestedProductList(data?.products)
    }else{
      setHarvestedProductList([])
    }
  },[data])
  const {
    handleSubmit,
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      important_information: {
        number_of_trees: String(data?.number_of_trees || 0),
        avg_age_of_trees: String(data?.avg_age_of_trees || ''),
        decreasing_rate: String(
          data?.decreasing_rate || '',
        ),
        expenditure_on_inputs: String(
          data?.expenditure_on_inputs || '',
        ),
        income_from_sale: String(
          data?.income_from_sale || '',
        ),
        soil_health: data?.soil_health,
        type_of_fertilizer_used:
          data?.type_of_fertilizer_used,
        type_of_pesticide_used:
          data?.type_of_pesticide_used,
      },
    },
  });
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSavepopup(false);
    }
  }, [errors]);
  // console.log("data", data?.number_of_trees)
  const onSubmit = () => {
    if (data?._id) {
      dispatch(
        editTree({
          data: watch('important_information'),
          productDetails: harvestedProductList.map((itm) => {
            return {
              _id: itm?._id,
              production_output: itm?.production_output,
              self_consumed: itm?.self_consumed,
              fed_to_livestock: itm?.fed_to_livestock,
              sold_to_neighbours: itm?.sold_to_neighbours,
              sold_for_industrial_use: itm?.sold_for_industrial_use,
              wastage: itm?.wastage,
              other: itm?.other,
              other_value: itm?.other_value,
              month_harvested: moment(itm?.month_harvested).format("YYYY-MM-DD") ,
              processing_method: itm?.processing_method
            }
          }),
          status: 1,
          crop_id: cropId
        }),
      )
        .unwrap()
        .then(
          () =>
            Toast.show({
              text1: 'Success',
              text2: 'Trees updated successfully!',
            }),
          dispatch(getTree()),
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
        .finally(() => {setSavepopup(false), navigation.goBack()});
    } else {
      dispatch(
        addTree({
          data: watch('important_information'),
          productDetails: harvestedProductList,
          status: 1,
          crop_id: cropId
        }),
      )
        .unwrap()
        .then(
          () =>
            Toast.show({
              text1: 'Success',
              text2: 'Trees added successfully!',
            }),
          dispatch(getTree()),
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
  };
  const replaceObjectById = (array, newObj) => {
    const newArray = array.map(obj => (obj.name === newObj.name ? newObj : obj));
    return newArray;
  };
  useEffect(() => {
    if (edit) {
      const updatedArray = replaceObjectById(harvestedProductList, edit);
      setHarvestedProductList(updatedArray)
      console.log("check", updatedArray)
    }
  }, [edit])
  const addProduct = () => {
    setHarvestedProductList([...harvestedProductList, { name: productName }])
    setProductName('')
  }
  const removeList = (name) => {
    let newList = harvestedProductList.filter(obj => obj.name !== name)
    setHarvestedProductList(newList)
  }
  const toggleItem = (value, index) => {
    setAge(value)
    const newValue = averageAge.map((checkbox, i) => {
      if (i !== index)
        return {
          ...checkbox,
          checked: false,
        }
      if (i === index) {
        const item = {
          ...checkbox,
          checked: !checkbox.checked,
        }
        return item
      }
      return checkbox
    })
    setAverageAge(newValue)
    setTreeAge(false)
  }
  // console.log("form", watch('important_information'))
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
            <Text style={styles.subAreaText}>Important Information</Text>
            <Divider
              bold={true}
              style={[styles.divider, { width: '45%' }]}
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
          {impInfo ?
            <View style={styles.container}>
              <Controller
                control={control}
                name="important_information.number_of_trees"
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <InputWithoutBorder
                      measureName={'kg'}
                      productionName={'Number of trees'}
                      value={value}
                      onChangeText={onChange}
                      notRightText={true}
                    />
                  );
                }}
              />
              {errors?.important_information?.number_of_trees?.message ? (
                <Text style={styles.error}>{errors?.important_information?.number_of_trees?.message}</Text>
              ) : null}

              <Controller
                control={control}
                name="important_information.avg_age_of_trees"
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <TouchableHighlight onPress={() => setTreeAge(true)}>
                      <InputWithoutBorder
                        measureName={'kg'}
                        productionName={'Average age of the tree'}
                        value={value}
                        onChangeText={onChange}
                        notRightText={true}
                        editable={false}
                        placeholder={'Select Average age of tree'}
                      />
                    </TouchableHighlight>
                  );
                }}
              />
              {errors?.important_information?.tree_age?.message ? (
                <Text style={styles.error}>{errors?.important_information?.tree_age?.message}</Text>
              ) : null}

              <Controller
                control={control}
                name="important_information.soil_health"
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <CustomDropdown3
                      data={soilHealth}
                      value={value}
                      defaultVal={{ key: 1, value: value }}
                      selectedValue={onChange}
                      infoName={'Soil Health'}
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
                'decreasing yield'&& (
                  <View style={styles.innerInputView}>
                    <Divider style={styles.input_divider} />
                    <View style={{ width: '100%' }}>
                      <Controller
                        control={control}
                        name="important_information.decreasing_rate"
                        render={({ field }) => {
                          const { onChange, value } = field;
                          return (
                            <InputWithoutBorder
                              measureName={'%'}
                              productionName={'how much from first planting'}
                              value={value}
                              onChangeText={onChange}
                            />
                          );
                        }}
                      />
                      {errors?.important_information?.decreasing_rate?.message ? (
                        <Text style={styles.error}>
                          {errors?.important_information?.decreasing_rate?.message}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                )}
              <Controller
                control={control}
                name="important_information.type_of_fertilizer_used"
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <CustomDropdown3
                      data={fertilisers}
                      selectedValue={onChange}
                      value={value}
                      defaultVal={{ key: 1, value: value }}
                      infoName={'Type of fertiliser used'}
                    />
                  );
                }}
              />
              {errors?.important_information?.type_of_fertilizer_used?.message ? (
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
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <CustomDropdown3
                      data={pesticides}
                      selectedValue={onChange}
                      value={value}
                      defaultVal={{ key: 1, value: value }}
                      infoName={'Type of pesticides used'}
                    />
                  );
                }}
              />
              {errors?.important_information?.type_of_pesticide_used?.message ? (
                <Text style={styles.error}>
                  {errors?.important_information?.type_of_pesticide_used?.message}
                </Text>
              ) : null}
              <Controller
                control={control}
                name="important_information.income_from_sale"
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <InputWithoutBorder
                      measureName={'USD'}
                      productionName={'Income from sale'}
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
                render={({ field }) => {
                  const { onChange, value } = field;
                  return (
                    <InputWithoutBorder
                      measureName={'USD'}
                      productionName={'Expenditure on inputs'}
                      value={value}
                      onChangeText={onChange}
                    />
                  );
                }}
              />
              {errors?.important_information?.expenditure_on_inputs?.message ? (
                <Text style={styles.error}>
                  {errors?.important_information?.expenditure_on_inputs?.message}
                </Text>
              ) : null}
            </View>
            : null}
          <View style={styles.subArea}>
            <Text style={styles.subAreaText}>Harvested Product</Text>
            <Divider
              bold={true}
              style={[styles.divider, { width: '45%' }]}
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
            {harvestedProduct ?
              <>
                {harvestedProductList[0] !== undefined && harvestedProductList.length >= 0 ?
                  <>
                    {harvestedProductList.map((item) => {
                      return <ProductDescription
                        productName={'Product Type'}
                        productNameValue={item?.name}
                        date={'Harvested On'}
                        dateValue={data !== null || data !== undefined ? moment(item?.month_harvested).format('YYYY-MM-DD') : item?.month_harvested}
                        qty={'Qty'}
                        qtyValue={item?.production_output}
                        del={() => removeList(item?.name)}
                        data={item ? item : []}
                        edit={() => navigation.navigate('editType', { cropType: item?.name, edit: item, cropId: cropId, data: data })}
                      />
                    })}
                  </>
                  : null}
              </>
              :
              null
            }
          </>
          {data?
          null
          :
          <TouchableOpacity style={styles.add_button} onPress={() => setHarvestProdAdd(true)}>
            <Text style={styles.add_button_text}>Add</Text>
            <AntDesign
              name="plus" size={15} color="#fff"
            />
          </TouchableOpacity>
        }
        </View>
        <View style={styles.bottomPopupbutton}>
          <CustomButton
            style={styles.submitButton}
            btnText={'Submit'}
            onPress={() => {
              setSavepopup(true) 
            }}
          />
          <CustomButton
            style={styles.draftButton}
            btnText={'Save as draft'}
            onPress={() => { setDraftpopup(true) }}
          />
        </View>
      </ScrollView>
        {
          treeAge &&
          <AddBottomSheet
          >
            <View style={styles.BottomTopContainer}>
              <Text style={styles.headerText}>Average Age of the tree</Text>
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
                    name="important_information.avg_age_of_trees"
                    render={({ field }) => {
                      const { onChange, value } = field;
                      return (
                        // <CalendarPicker
                        //   onDateChange={onChange}
                        //   selectedStartDate={value}
                        // />
                        <Checkbox
                          name={item?.age}
                          checked={item?.checked}
                          checking={() => { onChange(item?.age), toggleItem(item?.age, indx) }}
                        />
                      );
                    }}
                  />

                )
              })}
            </View>
            </AddBottomSheet>
        }
        {harvestProdAdd &&
          <AddBottomSheet
          >
            <View style={styles.BottomTopContainer}>
              <Text style={styles.headerText}>Add Harvested Product</Text>
              <TouchableOpacity
                onPress={() => {
                  setHarvestProdAdd(!harvestProdAdd);
                  setFocus(!focus)
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
                productionName={'Name Of harvested Product'}
                value={productName}
                keyboardType='default'
                onChangeText={e => {
                  if (e.endsWith("\n")) {
                    setHarvestProdAdd(!harvestProdAdd)
                    setFocus(!focus)
                    addProduct()
                  } else {
                    setProductName(e)
                  }
                }}
                multiline={true}
                notRightText={true}
                onFocus={() => setFocus(true)}
              />
            </View>
          </AddBottomSheet>
        }
        {/* submit popup */}
        <PopupModal
          modalVisible={savepopup}
          setBottomModalVisible={setSavepopup}
          styleInner={[styles.savePopup, { width: '90%' }]}>
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
                onPress={() => {
                  setSavepopup(false),
                    handleSubmit(onSubmit())

                }}
              />
              <CustomButton
                style={styles.draftButton}
                btnText={'Cancel'}
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
          styleInner={[styles.savePopup, { width: '90%' }]}>
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
                onPress={() => setDraftpopup(false)}
              />
              <CustomButton
                style={styles.draftButton}
                btnText={'Cancel'}
                onPress={() => setDraftpopup(false)}
              />
            </View>
          </View>
        </PopupModal>
      <Toast
        positionValue={30}
        style={{ height: 'auto', minHeight: 70 }}
        width={300}
      />
    </View>
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
      fontFamily: 'ubuntu'
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
      marginTop: '5%'
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
      marginBottom: 10
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
  });
