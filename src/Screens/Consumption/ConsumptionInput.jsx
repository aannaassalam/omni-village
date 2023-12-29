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
import * as yup from 'yup';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import PopupModal from '../../Components/Popups/PopupModal';
// import {addConsumption, editConsumption} from '../../Redux/ConsumptionSlice';
import {useMutation} from '@tanstack/react-query';
import {useTranslation} from 'react-i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useMeasurement} from '../../Hooks/cms';
import {
  addConsumption,
  editConsumption,
} from '../../functions/consumptionScreen';
import '../../i18next';

const ConsumptionInput = ({route, navigation}) => {
  const {cropType, data, cropId, typeName, type_id} = route.params;
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {data: measurement} = useMeasurement();
  const [impInfo, setImpInfo] = useState(true);
  const [savepopup, setSavepopup] = useState(false);
  const [message, setMessage] = useState('');
  const [draftpopup, setDraftpopup] = useState(false);
  const {t} = useTranslation();

  const schema = yup.object().shape({
    total_quantity: yup.string().required(t('total_land is required')),
    purchased_from_market: yup
      .string()
      .required(t('purchased_from_market is required')),
    purchased_from_neighbours: yup
      .string()
      .required(t('purchased_from_neighbour is required')),
    self_grown: yup.string().required(t('self_grown is required')),
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
      total_quantity: String(data?.total_quantity || ''),
      weight_measurement: String(data?.weight_measurement || 'kilogram'),
      purchased_from_market: String(data?.purchased_from_market || ''), // TODO: add validation for this field
      purchased_from_neighbours: String(data?.purchased_from_neighbours || ''),
      self_grown: String(data?.self_grown || ''),
    },
  });

  const {mutate: addConsumptionData, isPending: isAddFisheryPending} =
    useMutation({
      mutationFn: addConsumption,
      onSuccess: _data => {
        console.log(_data, 'added successfully ');
        _data.status === 0
          ? navigation.goBack()
          : navigation.navigate('consumptionSuccessfull');
      },
      onError: () =>
        Toast.show({
          type: 'error',
          text1: 'Error Occurred',
          text2: 'Something Went wrong, Please try again later!',
        }),
      onSettled: () => setSavepopup(false),
    });

  const {mutate: editConsumptionData, isPending: isEditFisheryPending} =
    useMutation({
      mutationFn: editConsumption,
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

  const onSubmit = data2 => {
    let total = parseInt(data2.total_quantity);
    let purchased_from_market = parseInt(data2.purchased_from_market);
    let purchased_from_neighbours = parseInt(data2.purchased_from_neighbours);
    let self_grown = parseInt(data2.self_grown);
    if (
      purchased_from_market + purchased_from_neighbours + self_grown !==
      total
    ) {
      setMessage(
        t('Total amount should be equal to output') +
          '/' +
          'Total amount should be equal to output',
      );
      Toast.show({
        type: 'error',
        text1:
          t('Total amount should be equal to output') +
          '/' +
          'Total amount should be equal to output',
      });
      setSavepopup(false);
    } else {
      if (data?._id) {
        let formData = {
          weight_measurement: watch('weight_measurement'),
          consumption_id: cropId,
          consumption_type_name: typeName,
          total_quantity: watch('total_quantity'),
          purchased_from_market: watch('purchased_from_market'),
          purchased_from_neighbours: watch('purchased_from_neighbours'),
          self_grown: watch('self_grown'),
          status: 1,
        };
        editConsumptionData(formData);
      } else {
        let formData = {
          weight_measurement: watch('weight_measurement'),
          consumption_crop_id: cropId,
          consumption_type_name: typeName,
          consumption_type_id: type_id,
          total_quantity: watch('total_quantity'),
          purchased_from_market: watch('purchased_from_market'),
          purchased_from_neighbours: watch('purchased_from_neighbours'),
          self_grown: watch('self_grown'),
          status: 1,
        };
        addConsumptionData(formData);
      }
    }
    // }
  };
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSavepopup(false);
    }
  }, [errors]);

  const handleDraft = () => {
    if (data?._id) {
      let formData = {
        weight_measurement: watch('weight_measurement'),
        consumption_id: cropId,
        consumption_type_name: typeName,
        total_quantity: watch('total_quantity'),
        purchased_from_market: watch('purchased_from_market'),
        purchased_from_neighbours: watch('purchased_from_neighbours'),
        self_grown: watch('self_grown'),
        status: 0,
      };
      editConsumptionData(formData);
    } else {
      let formData = {
        weight_measurement: watch('weight_measurement'),
        consumption_crop_id: cropId,
        consumption_type_name: typeName,
        total_quantity: watch('total_quantity'),
        purchased_from_market: watch('purchased_from_market'),
        purchased_from_neighbours: watch('purchased_from_neighbours'),
        self_grown: watch('self_grown'),
        status: 0,
      };
      addConsumptionData(formData);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        goBack={() => navigation.goBack()}
        headerName={cropType}
        backIcon={true}
      />
      <ScrollView>
        <View style={styles.subArea}>
          <Text style={styles.subAreaText}>{t('consumption information')}</Text>
          <Divider
            bold={true}
            style={[styles.divider, {width: '40%'}]}
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
              name="total_quantity"
              render={({field}) => {
                const {onChange, value} = field;
                return (
                  <InputWithoutBorder
                    measureName={
                      watch('weight_measurement')
                        ? watch('weight_measurement')
                        : 'kg'
                    }
                    productionName={t('total quantity')}
                    value={value}
                    onChangeText={onChange}
                    notRightText={false}
                  />
                );
              }}
            />
            {errors?.total_quantity?.message ? (
              <Text style={styles.error}>
                {errors?.total_quantity?.message}
              </Text>
            ) : null}
            <View style={styles.innerInputView}>
              <Divider style={styles.divider2} />
              <View style={{width: '100%'}}>
                <Controller
                  name="purchased_from_market"
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
                        productionName={t('purchased from market')}
                        value={value}
                        multiline={false}
                        notRightText={false}
                        onChangeText={onChange}
                      />
                    );
                  }}
                />
                {errors?.purchased_from_market?.message ? (
                  <Text style={styles.error}>
                    {errors?.purchased_from_market?.message}
                  </Text>
                ) : null}
                <Controller
                  name="purchased_from_neighbours"
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
                        productionName={t('purchased from neighbour')}
                        value={value}
                        multiline={false}
                        notRightText={false}
                        onChangeText={onChange}
                      />
                    );
                  }}
                />
                {errors?.purchased_from_neighbours?.message ? (
                  <Text style={styles.error}>
                    {errors?.purchased_from_neighbours?.message}
                  </Text>
                ) : null}
                <Controller
                  name="self_grown"
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
                        productionName={t('self grown')}
                        value={value}
                        multiline={false}
                        notRightText={false}
                        onChangeText={onChange}
                      />
                    );
                  }}
                />
                {errors?.self_grown?.message ? (
                  <Text style={styles.error}>
                    {errors?.self_grown?.message}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        ) : null}
      </ScrollView>
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
          <Text style={styles.nextText}>{t('')}</Text>
          <View style={styles.bottomPopupbutton}>
            <CustomButton
              style={styles.submitButton}
              btnText={t('submit')}
              onPress={handleSubmit(onSubmit)}
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
          <Text style={styles.nextText}>{t('')}</Text>
          <View style={styles.bottomPopupbutton}>
            <CustomButton
              style={styles.submitButton}
              btnText={t('save')}
              onPress={handleDraft}
              loading={isAddFisheryPending || isEditFisheryPending}
            />
            <CustomButton
              style={styles.draftButton}
              btnText={t('cancel')}
              onPress={() => setDraftpopup(false)}
            />
          </View>
        </View>
      </PopupModal>
    </SafeAreaView>
  );
};

export default ConsumptionInput;
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
      width: width / 1.04,
    },
    divider: {
      alignSelf: 'center',
      height: 1,
      width: '67%',
      marginTop: 5,
      color: 'grey',
    },
    divider2: {
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
      width: '95%',
      alignSelf: 'center',
    },
    perContainer: {
      width: '95%',
      alignSelf: 'center',
    },
  });
