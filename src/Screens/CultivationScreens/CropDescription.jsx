import {yupResolver} from '@hookform/resolvers/yup';
import {useMutation} from '@tanstack/react-query';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {useTranslation} from 'react-i18next';
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
import CalendarPicker from 'react-native-calendar-picker';
import {Divider} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Toast} from 'react-native-toast-message/lib/src/Toast';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
import CustomButton from '../../Components/CustomButton/CustomButton';
import InputLikeButton from '../../Components/CustomButton/InputLikeButton';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomInputField from '../../Components/CustomInputField/CustomInputField';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import PopupModal from '../../Components/Popups/PopupModal';
import {useUser} from '../../Hooks/useUser';
import {
  addCultivation,
  editCultivation,
} from '../../functions/CultivationScreen';
import '../../i18next';

const CropDescription = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const {data: userDetails} = useUser();
  const styles = makeStyles(fontScale);
  const {cropName, crop_id, cultivation} = route.params;
  const {t} = useTranslation();
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

  const schema = yup.object().shape({
    area_allocated: yup.string().required(t('area_allocated is required')),
    output: yup.string().required(t('output is required')),
    utilization: yup.object().shape({
      self_consumed: yup.string().required(t('self_consumed is required')),
      fed_to_livestock: yup
        .string()
        .required(t('fed_to_livestock is required')),
      sold_to_neighbours: yup
        .string()
        .required(t('sold_to_neighbours is required')),
      sold_for_industrial_use: yup
        .string()
        .required(t('sold_for_industrial_use is required')),
      wastage: yup.string().required(t('wastage is required')),
      other: yup.string(),
      other_value: yup.string(),
    }),
    important_information: yup.object().shape({
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
      description: yup.string(),
      yeild: yup.string(),
      month_planted: yup.date().required(t('month_planted is required')),
      month_harvested: yup.date().required(t('month_harvested is required')),
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
      area_allocated: String(cultivation?.area_allocated || ''),
      output: String(cultivation?.output || ''),
      utilization: {
        fed_to_livestock: String(
          cultivation?.utilization?.fed_to_livestock || '',
        ),
        other: cultivation?.utilization?.other || '',
        other_value: cultivation?.utilization?.other_value
          ? String(cultivation?.utilization?.other_value)
          : '',
        self_consumed: String(cultivation?.utilization?.self_consumed || ''),
        sold_for_industrial_use: String(
          cultivation?.utilization?.sold_for_industrial_use || '',
        ),
        sold_to_neighbours: String(
          cultivation?.utilization?.sold_to_neighbours || '',
        ),
        wastage: String(cultivation?.utilization?.wastage || ''),
      },
      important_information: {
        decreasing_rate: String(
          cultivation?.important_information?.decreasing_rate || '',
        ),
        description: cultivation?.important_information?.description || '',
        expenditure_on_inputs: String(
          cultivation?.important_information?.expenditure_on_inputs || '',
        ),
        income_from_sale: String(
          cultivation?.important_information?.income_from_sale || '',
        ),
        soil_health: cultivation?.important_information?.soil_health,
        type_of_fertilizer_used:
          cultivation?.important_information?.type_of_fertilizer_used,
        type_of_pesticide_used:
          cultivation?.important_information?.type_of_pesticide_used,
        yeild: String(cultivation?.important_information?.yeild || ''),
        month_harvested:
          cultivation?.important_information?.month_harvested || new Date(),
        month_planted:
          cultivation?.important_information?.month_planted ||
          new Date(new Date().setDate(new Date().getDate() - 1)).toString(),
      },
    },
  });

  const {mutate: addCultivationData, isPending: addCultivationPending} =
    useMutation({
      mutationFn: addCultivation,
      onSuccess: data => {
        console.log(data);
        data.status === 0
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

  const {mutate: editCultivationData, isPending: editCultivationPending} =
    useMutation({
      mutationFn: editCultivation,
      onSuccess: () => navigation.goBack(),
      onError: () =>
        Toast.show({
          type: 'error',
          text1: 'Error Occurred',
          text2: 'Something Went wrong, Please try again later!',
        }),
      onSettled: () => setSavepopup(false),
    });

  useEffect(() => {
    setValue(
      'important_information.yeild',
      String(
        parseFloat(watch('output')) / parseFloat(watch('area_allocated')) ||
          '0',
      ),
    );
  }, [watch('area_allocated'), watch('output')]);

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSavepopup(false);
    }
  }, [errors]);

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
      if (cultivation) {
        editCultivationData({
          ...data,
          important_information: {
            ...data.important_information,
          },
          utilization: {
            ...data.utilization,
            other_value:
              data.utilization.other.length > 0
                ? data.utilization.other_value
                : '',
          },
          status: 1,
          cultivation_id: cultivation._id,
        });
      } else {
        addCultivationData({
          ...data,
          important_information: {
            ...data.important_information,
          },
          utilization: {
            ...data.utilization,
            other_value:
              data.utilization.other.length > 0
                ? data.utilization.other_value
                : '',
          },
          status: 1,
          crop_id,
        });
      }
    } else {
      setSavepopup(false);
      setGlobalError('Sum of Utilisation must not be greather than Output');
    }
  };

  const handleDraft = () => {
    const data = watch();
    if (cultivation) {
      editCultivationData(
        {
          ...data,
          important_information: {
            ...data.important_information,
          },
          utilization: {
            ...data.utilization,
            other_value:
              data.utilization.other.length > 0
                ? data.utilization.other_value
                : '',
          },
          status: 0,
          cultivation_id: cultivation._id,
        },
        {
          onSettled: () => setDraftpopup(false),
        },
      );
    } else {
      addCultivationData(
        {
          ...data,
          important_information: {
            ...data.important_information,
          },
          utilization: {
            ...data.utilization,
            other_value:
              data.utilization.other.length > 0
                ? data.utilization.other_value
                : '',
          },
          status: 0,
          crop_id,
        },
        {
          onSettled: () => setDraftpopup(false),
        },
      );
    }
  };

  console.log(savepopup, 'popup');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* <View style={styles.container}> */}
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
                  label={t('area allocated')}
                  value={value}
                  onChangeText={onChange}
                  keyboardType="number-pad"
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
                  productionName={t('output')}
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
          <Text style={styles.subAreaText}>{t('utilisation')}</Text>
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
                        productionName={t('self consumed')}
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
                        productionName={t('fed to livestock')}
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
                        productionName={t('sold to neighbour')}
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
                        productionName={t('sold for industrial use')}
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
                        productionName={t('wastage')}
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
                                : t('other value')
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
                  fontFamily: 'ubuntu-regular',
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
                    defaultVal={{key: value, value: t(value)}}
                    infoName={t('type of fertilizer')}
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
                    defaultVal={{key: value, value: t(value)}}
                    infoName={t('type of pesticides')}
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
                {errors?.important_information?.expenditure_on_inputs?.message}
              </Text>
            ) : null}
            <InputLikeButton
              text={t('Proccessing Method')}
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
                          productionName={t('Description(if applicable)')}
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
                    measureName={`${
                      userDetails?.land_measurement_symbol
                        ? userDetails.land_measurement_symbol
                        : userDetails.land_measurement
                    } / kg`}
                    productionName={t('yields')}
                    value={value}
                    editable={false}
                  />
                );
              }}
            />
            <InputLikeButton
              text={t('Month Planted')}
              rightIcon={true}
              calendarPress={() => setPopup(true)}
              date={moment(watch('important_information.month_planted')).format(
                'MMMM DD, YYYY',
              )}
            />

            <InputLikeButton
              text={t('month harvested')}
              rightIcon={true}
              calendarPress={() => setHarvestedPopup(true)}
              date={moment(
                watch('important_information.month_harvested'),
              ).format('MMMM DD, YYYY')}
            />
          </View>
        ) : null}
        <View style={styles.bottomPopupbutton}>
          <CustomButton
            style={styles.submitButton}
            btnText={t('submit')}
            onPress={() => {
              setStatus(1);
              setSavepopup(true);
            }}
          />
          <CustomButton
            style={styles.draftButton}
            btnText={t('save as draft')}
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
            btnText={t('done')}
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
            btnText={t('done')}
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
          <Text style={styles.confirmText}>{t('confirm')}</Text>
          <Text style={styles.nextText}>
            {t('Do you want to submit this cultivation?')}
          </Text>
          <View style={styles.bottomPopupbutton}>
            <CustomButton
              style={styles.submitButton}
              btnText={t('submit')}
              onPress={handleSubmit(onSubmit)}
              loading={addCultivationPending || editCultivationPending}
            />
            <CustomButton
              style={styles.draftButton}
              btnText={t('cancel')}
              onPress={() => {
                setStatus(-1);
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
          <Text style={styles.confirmText}>{t('save as Draft')}</Text>
          <Text style={styles.nextText}>
            {t('Do you want to save this crop as draft?')}
          </Text>
          <View style={styles.bottomPopupbutton}>
            <CustomButton
              style={styles.submitButton}
              btnText={t('save')}
              onPress={handleDraft}
              loading={addCultivationPending || editCultivationPending}
            />
            <CustomButton
              style={styles.draftButton}
              btnText={t('cancel')}
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
      {/* </View> */}
    </SafeAreaView>
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
    error: {
      fontFamily: 'ubuntu-regular',
      fontSize: 14 / fontScale,
      marginTop: 5,
      color: '#ff000e',
      marginLeft: 15,
    },
  });
