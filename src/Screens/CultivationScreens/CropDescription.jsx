import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useMemo, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomInputField from '../../Components/CustomInputField/CustomInputField';
import {Divider} from 'react-native-paper';
import UtilisationAccordion from '../../Components/Accordion/UtilisationAccordion';
import ImportantInformation from '../../Components/Accordion/ImportantInformation';
import * as yup from 'yup';
import {validation} from '../../Validation/Validation';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {fertilisers, pesticides, soilHealth} from '../../MockData/Mockdata';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';
import InputLikeButton from '../../Components/CustomButton/InputLikeButton';
import moment from 'moment';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import CalendarPicker from 'react-native-calendar-picker';
import {useDispatch, useSelector} from 'react-redux';
import {
  addCultivation,
  editCultivation,
  getCurrentCrop,
} from '../../Redux/CultivationSlice';
import {Toast} from 'react-native-toast-message/lib/src/Toast';

const CropDescription = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {cropName} = route.params;
  const [area, setArea] = useState('');
  const [utilisation, setUtilisation] = useState(true);
  const [impInfo, setImpInfo] = useState(true);
  const [proccessing, setProccessing] = useState(true);
  const [popup, setPopup] = useState(false);
  const [harvestedPopup, setHarvestedPopup] = useState(false);
  const [savepopup, setSavepopup] = useState(false);
  const [draftpopup, setDraftpopup] = useState(false);
  const [status, setStatus] = useState(-1);
  const [globalError, setGlobalError] = useState('');

  const dispatch = useDispatch();

  const {currentCrop} = useSelector(s => s.cultivation);

  const schema = yup.object().shape({
    area_allocated: yup.string().required(validation.error.area_allocated),
    output: yup.string().required(validation.error.output),
    utilization: yup.object().shape({
      self_consumed: yup.string().required(validation.error.self_consumed),
      fed_to_livestock: yup
        .string()
        .required(validation.error.fed_to_livestock),
      sold_to_neighbours: yup
        .string()
        .required(validation.error.sold_to_neighbours),
      sold_for_industrial_use: yup
        .string()
        .required(validation.error.sold_for_industrial_use),
      wastage: yup.string().required(validation.error.wastage),
      other: yup.string(),
      other_value: yup.string(),
    }),
    important_information: yup.object().shape({
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
        .required(validation.error.expenditure_on_inputs),
      description: yup.string(),
      yeild: yup.string(),
      month_planted: yup.date().required(validation.error.month_planted),
      month_harvested: yup.date().required(validation.error.month_harvested),
    }),
    // ultilization,
    // important_information,
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
      area_allocated: String(currentCrop?.area_allocated || ''),
      output: String(currentCrop?.output || ''),
      utilization: {
        fed_to_livestock: String(
          currentCrop?.utilization?.fed_to_livestock || '',
        ),
        other: currentCrop?.utilization?.other || '',
        other_value: currentCrop?.utilization?.other_value
          ? String(currentCrop?.utilization?.other_value)
          : '',
        self_consumed: String(currentCrop?.utilization?.self_consumed || ''),
        sold_for_industrial_use: String(
          currentCrop?.utilization?.sold_for_industrial_use || '',
        ),
        sold_to_neighbours: String(
          currentCrop?.utilization?.sold_to_neighbours || '',
        ),
        wastage: String(currentCrop?.utilization?.wastage || ''),
      },
      important_information: {
        decreasing_rate: String(
          currentCrop?.important_information?.decreasing_rate || '',
        ),
        description: currentCrop?.important_information?.description || '',
        expenditure_on_inputs: String(
          currentCrop?.important_information?.expenditure_on_inputs || '',
        ),
        income_from_sale: String(
          currentCrop?.important_information?.income_from_sale || '',
        ),
        soil_health: currentCrop?.important_information?.soil_health,
        type_of_fertilizer_used:
          currentCrop?.important_information?.type_of_fertilizer_used,
        type_of_pesticide_used:
          currentCrop?.important_information?.type_of_pesticide_used,
        yeild: String(currentCrop?.important_information?.yeild || ''),
        month_harvested:
          currentCrop?.important_information?.month_harvested || new Date(),
        month_planted:
          currentCrop?.important_information?.month_planted ||
          new Date(new Date().setDate(new Date().getDate() - 1)).toString(),
      },
    },
  });

  useEffect(() => {
    setValue(
      'important_information.yeild',
      String(
        parseInt(getValues('output'), 10) /
          parseInt(getValues('area_allocated'), 10) || '0',
      ),
    );
  }, [watch('area_allocated'), watch('output')]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSavepopup(false);
    }
  }, [errors]);

  console.log(errors);

  const onSubmit = data => {
    const output = parseInt(data.output) || 0;
    const fed_to_livestock = parseInt(data.utilization.fed_to_livestock) || 0;
    const other_value =
      data.utilization.other.length > 0
        ? parseInt(data.utilization.other_value) || 0
        : 0;
    const self_consumed = parseInt(data.utilization.self_consumed) || 0;
    const sold_for_industrial_use =
      parseInt(data.utilization.sold_for_industrial_use) || 0;
    const sold_to_neighbours =
      parseInt(data.utilization.sold_to_neighbours) || 0;
    const wastage = parseInt(data.utilization.wastage) || 0;
    if (
      output >=
      fed_to_livestock +
        other_value +
        self_consumed +
        sold_for_industrial_use +
        sold_to_neighbours +
        wastage
    ) {
      if (currentCrop._id) {
        dispatch(
          editCultivation({
            ...data,
            status: 1,
            utilization: {
              ...data.utilization,
              other_value:
                data.utilization.other.length > 0
                  ? data.utilization.other_value
                  : '',
            },
            cultivation_id: currentCrop._id,
          }),
        )
          .unwrap()
          .then(
            () =>
              Toast.show({
                text1: 'Success',
                text2: 'Cultivation updated successfully!',
              }),
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
          .finally(() => setSavepopup(false));
      } else {
        dispatch(
          addCultivation({
            ...data,
            status: 1,
            utilization: {
              ...data.utilization,
              other_value:
                data.utilization.other.length > 0
                  ? data.utilization.other_value
                  : '',
            },
          }),
        )
          .unwrap()
          .then(
            () =>
              Toast.show({
                text1: 'Success',
                text2: 'Cultivation added successfully!',
              }),
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
          .finally(() => setSavepopup(false));
      }
    } else {
      setSavepopup(false);
      setGlobalError('Sum of Utilisation must not be greather than Output');
    }
  };

  const handleDraft = () => {
    const data = watch();
    if (currentCrop._id) {
      dispatch(
        editCultivation({
          ...data,
          status: 0,
          utilization: {
            ...data.utilization,
            other_value:
              data.utilization.other.length > 0
                ? data.utilization.other_value
                : '',
          },
          cultivation_id: currentCrop._id,
        }),
      )
        .unwrap()
        .then(
          () =>
            Toast.show({
              text1: 'Success',
              text2: 'Cultivation drafted successfully!',
            }),
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
        .finally(() => setSavepopup(false));
    } else {
      dispatch(
        addCultivation({
          ...data,
          status: 0,
          utilization: {
            ...data.utilization,
            other_value:
              data.utilization.other.length > 0
                ? data.utilization.other_value
                : '',
          },
        }),
      )
        .unwrap()
        .then(
          () =>
            Toast.show({
              text1: 'Success',
              text2: 'Cultivation drafted successfully!',
            }),
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
        .finally(() => setSavepopup(false));
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={cropName}
        goBack={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.textInputArea}>
          <Controller
            control={control}
            name="area_allocated"
            render={({field}) => {
              const {onChange, value} = field;
              return (
                <CustomInputField
                  label={'Area allocated'}
                  value={value}
                  onChangeText={onChange}
                />
              );
            }}
          />
          {errors?.area_allocated?.message ? (
            <Text style={styles.error}>{errors?.area_allocated?.message}</Text>
          ) : null}
        </View>
        <View style={styles.ultilisation_container}>
          <Controller
            control={control}
            name="output"
            render={({field}) => {
              const {onChange, value} = field;
              return (
                <InputWithoutBorder
                  measureName={'kg'}
                  productionName={'Output'}
                  value={value}
                  onChangeText={onChange}
                />
              );
            }}
          />
          {errors?.output?.message ? (
            <Text style={styles.error}>{errors?.output?.message}</Text>
          ) : null}
        </View>
        {/* utilisation section */}
        <View style={styles.subArea}>
          <Text style={styles.subAreaText}>Utilisation</Text>
          <Divider bold={true} style={styles.divider} horizontalInset={true} />
          <TouchableOpacity onPress={() => setUtilisation(!utilisation)}>
            {utilisation ? (
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
        {utilisation ? (
          <View style={styles.ultilisation_container}>
            <View style={styles.innerInputView}>
              <Divider style={styles.input_divider} />
              <View style={{width: '100%'}}>
                {/* {utilisationArray?.map((item, index) => {
            return (
              <> */}
                <Controller
                  name="utilization.self_consumed"
                  control={control}
                  render={({field}) => {
                    const {onChange, value} = field;
                    return (
                      <InputWithoutBorder
                        measureName={'kg'}
                        productionName="Self consumed"
                        value={value}
                        multiline={false}
                        notRightText={false}
                        onChangeText={onChange}
                      />
                    );
                  }}
                />
                {errors?.utilization?.self_consumed?.message ? (
                  <Text style={styles.error}>
                    {errors?.utilization?.self_consumed?.message}
                  </Text>
                ) : null}
                <Controller
                  name="utilization.fed_to_livestock"
                  control={control}
                  render={({field}) => {
                    const {onChange, value} = field;
                    return (
                      <InputWithoutBorder
                        measureName={'kg'}
                        productionName="Fed to Livestock"
                        value={value}
                        multiline={false}
                        notRightText={false}
                        onChangeText={onChange}
                      />
                    );
                  }}
                />
                {errors?.utilization?.fed_to_livestock?.message ? (
                  <Text style={styles.error}>
                    {errors?.utilization?.fed_to_livestock?.message}
                  </Text>
                ) : null}
                <Controller
                  name="utilization.sold_to_neighbours"
                  control={control}
                  render={({field}) => {
                    const {onChange, value} = field;
                    return (
                      <InputWithoutBorder
                        measureName={'kg'}
                        productionName="Sold to Neighbours"
                        value={value}
                        multiline={false}
                        notRightText={false}
                        onChangeText={onChange}
                      />
                    );
                  }}
                />
                {errors?.utilization?.sold_to_neighbours?.message ? (
                  <Text style={styles.error}>
                    {errors?.utilization?.sold_to_neighbours?.message}
                  </Text>
                ) : null}
                <Controller
                  name="utilization.sold_for_industrial_use"
                  control={control}
                  render={({field}) => {
                    const {onChange, value} = field;
                    return (
                      <InputWithoutBorder
                        measureName={'kg'}
                        productionName="Sold for Industrial Use"
                        value={value}
                        multiline={false}
                        notRightText={false}
                        onChangeText={onChange}
                      />
                    );
                  }}
                />
                {errors?.utilization?.sold_for_industrial_use?.message ? (
                  <Text style={styles.error}>
                    {errors?.utilization?.sold_for_industrial_use?.message}
                  </Text>
                ) : null}
                <Controller
                  name="utilization.wastage"
                  control={control}
                  render={({field}) => {
                    const {onChange, value} = field;
                    return (
                      <InputWithoutBorder
                        measureName={'kg'}
                        productionName="Wastage"
                        value={value}
                        multiline={false}
                        notRightText={false}
                        onChangeText={onChange}
                      />
                    );
                  }}
                />
                {errors?.utilization?.wastage?.message ? (
                  <Text style={styles.error}>
                    {errors?.utilization?.wastage?.message}
                  </Text>
                ) : null}
                <Controller
                  name="utilization.other"
                  control={control}
                  render={({field}) => {
                    const {onChange, value} = field;
                    return (
                      <InputWithoutBorder
                        measureName={'kg'}
                        productionName="Others"
                        value={value}
                        multiline={false}
                        notRightText={true}
                        onChangeText={onChange}
                        d
                      />
                    );
                  }}
                />
                <View style={styles.innerInputView}>
                  <Divider style={styles.input_divider} />
                  <View style={{width: '100%'}}>
                    <Controller
                      name="utilization.other_value"
                      control={control}
                      render={({field}) => {
                        const {onChange, value} = field;
                        return (
                          <InputWithoutBorder
                            measureName={'kg'}
                            productionName={
                              watch('utilization.other')
                                ? watch('utilization.other')
                                : 'Other Value'
                            }
                            value={value}
                            multiline={false}
                            notRightText={false}
                            editable={watch('utilization.other').length > 0}
                            onChangeText={onChange}
                          />
                        );
                      }}
                    />
                    {errors?.utilization?.other_value?.message ? (
                      <Text style={styles.error}>
                        {errors?.utilization?.other_value?.message}
                      </Text>
                    ) : null}
                  </View>
                </View>
              </View>
              <Text
                style={{
                  fontFamily: 'ubuntu_regular',
                  fontSize: 14 / fontScale,
                  marginTop: 5,
                  color: '#ff000e',
                  marginLeft: 5,
                }}>
                {globalError}
              </Text>
            </View>
            {/* </>
            );
          })} */}
            {/* </View>
            </View> */}
          </View>
        ) : null}
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
          <View style={styles.important_container}>
            <Controller
              control={control}
              name="important_information.soil_health"
              render={({field}) => {
                const {onChange, value} = field;
                return (
                  <CustomDropdown3
                    data={soilHealth}
                    value={value}
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
              render={({field}) => {
                const {onChange, value} = field;
                return (
                  <CustomDropdown3
                    data={fertilisers}
                    selectedValue={onChange}
                    value={value}
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
              render={({field}) => {
                const {onChange, value} = field;
                return (
                  <CustomDropdown3
                    data={pesticides}
                    selectedValue={onChange}
                    value={value}
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
              render={({field}) => {
                const {onChange, value} = field;
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
              render={({field}) => {
                const {onChange, value} = field;
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
            <InputLikeButton
              text={'Proccessing Method'}
              onPress={() => setProccessing(!proccessing)}
            />
            {proccessing && (
              <View style={styles.innerInputView}>
                <Divider style={styles.input_divider} />
                <View style={{width: '100%'}}>
                  <Controller
                    control={control}
                    name="important_information.description"
                    render={({field}) => {
                      const {onChange, value} = field;
                      return (
                        <InputWithoutBorder
                          notRightText={true}
                          productionName={'Description'}
                          value={value}
                          multiline={true}
                          onChangeText={onChange}
                          keyboardType="default"
                        />
                      );
                    }}
                  />
                </View>
              </View>
            )}
            <Controller
              control={control}
              name="important_information.yeild"
              render={({field}) => {
                const {value} = field;
                return (
                  <InputWithoutBorder
                    measureName={'acres'}
                    productionName={'Yeild'}
                    value={value}
                    editable={false}
                  />
                );
              }}
            />
            <InputLikeButton
              text={'Month Planted'}
              rightIcon={true}
              onPress={() => setPopup(true)}
              date={moment(watch('important_information.month_planted')).format(
                'MMMM DD,YYYY',
              )}
            />
            <InputLikeButton
              text={'Month Harvested'}
              rightIcon={true}
              onPress={() => setHarvestedPopup(true)}
              date={moment(
                watch('important_information.month_harvested'),
              ).format('MMMM DD,YYYY')}
            />
          </View>
        ) : null}
        <View style={styles.bottomPopupbutton}>
          <CustomButton
            style={styles.submitButton}
            btnText={'Submit'}
            onPress={() => {
              setStatus(1);
              setSavepopup(true);
            }}
          />
          <CustomButton
            style={styles.draftButton}
            btnText={'Save as draft'}
            onPress={() => {
              setStatus(0);
              setDraftpopup(true);
            }}
          />
        </View>
      </ScrollView>

      {/* planted popup */}
      <PopupModal
        modalVisible={popup}
        setBottomModalVisible={setPopup}
        styleInner={styles.savePopup}>
        <View>
          <Controller
            control={control}
            name="important_information.month_planted"
            render={({field}) => {
              const {onChange, value} = field;
              return (
                <CalendarPicker
                  onDateChange={onChange}
                  selectedStartDate={value}
                />
              );
            }}
          />
          <CustomButton
            btnText={'Done'}
            onPress={() => setPopup(false)}
            style={styles.popupButton}
          />
        </View>
      </PopupModal>
      {/* harvested popup */}
      <PopupModal
        modalVisible={harvestedPopup}
        setBottomModalVisible={setHarvestedPopup}
        styleInner={styles.savePopup}>
        <View>
          <Controller
            control={control}
            name="important_information.month_harvested"
            render={({field}) => {
              const {onChange, value} = field;
              return (
                <CalendarPicker
                  onDateChange={onChange}
                  selectedStartDate={value}
                />
              );
            }}
          />
          <CustomButton
            btnText={'Done'}
            onPress={() => setHarvestedPopup(false)}
            style={styles.popupButton}
          />
        </View>
      </PopupModal>
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
            Do you want to submit this cultivation?
          </Text>
          <View style={styles.bottomPopupbutton}>
            <CustomButton
              style={styles.submitButton}
              btnText={'Submit'}
              onPress={handleSubmit(onSubmit)}
            />
            <CustomButton
              style={styles.draftButton}
              btnText={'Cancel'}
              onPress={() => {
                setStatus(-1);
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
            Do you want to save this crop as draft?
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
              onPress={() => {
                setStatus(-1);
                setDraftpopup(false);
              }}
            />
          </View>
        </View>
      </PopupModal>
      <Toast
        positionValue={30}
        style={{height: 'auto', minHeight: 70}}
        width={300}
      />
    </View>
  );
};

export default CropDescription;
const width = Dimensions.get('window').width;
const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    ultilisation_container: {
      width: '95%',
      alignSelf: 'center',
    },
    important_container: {
      width: '93%',
      alignSelf: 'center',
      marginBottom: '5%',
    },
    textInputArea: {
      alignSelf: 'center',
      width: '95%',
    },
    input_divider: {
      // backgroundColor: 'grey',
      alignSelf: 'flex-start',
      height: '100%',
      marginTop: 9,
      width: '1%',
      borderRadius: 10,
    },
    innerInputView: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-between',
      width: '95%',
      marginBottom: '5%',
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
      width: '93%',
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
    error: {
      fontFamily: 'ubuntu_regular',
      fontSize: 14 / fontScale,
      marginTop: 5,
      color: '#ff000e',
      marginLeft: 15,
    },
  });
