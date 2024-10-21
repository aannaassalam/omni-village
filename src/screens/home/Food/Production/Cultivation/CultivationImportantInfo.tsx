import {
  Image,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import StackHeader from '../../../../../Components/CustomHeader/StackHeader';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Input from '../../../../../Components/Inputs/Input';
import Customdropdown from '../../../../../Components/CustomDropdown/Customdropdown';
import AcresElement from '../../../../../Components/ui/AcresElement';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import {fontScale, Styles, width} from '../../../../../styles/globalStyles';
import {dark_grey} from '../../../../../styles/colors';
import {fontFamilyRegular} from '../../../../../styles/fontStyle';
import AlertModal from '../../../../../Components/Popups/AlertModal';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {add_cultivation, edit_cultivation} from '../../../../../apis/food';
import {useTranslation} from 'react-i18next';
import {useSelector} from 'react-redux';
const CultivationImportantInfo = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {crop_name, utilInfo, crop_id, data} = route.params;
  const authState = useSelector(state => state.authState);
  const queryClient = useQueryClient();
  const {t} = useTranslation();
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [modalViisble, setModalVisible] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [message, setMessage] = useState('');
  const soilHealth = [
    {label: 'stable', value: 'stable'},
    {label: 'decreasing yield', value: 'decreasing yield'},
  ];
  const fertilisers = [
    {label: 'organic self made', value: 'organic self made'},
    {label: 'organic purchased', value: 'organic purchased'},
    {label: 'chemical based', value: 'chemical based'},
    {label: 'none', value: 'none'},
  ];
  const pesticides = [
    {label: 'organic self made', value: 'organic self made'},
    {label: 'organic purchased', value: 'organic purchased'},
    {label: 'chemical based', value: 'chemical based'},
    {label: 'none', value: 'none'},
  ];
  const {mutate: addCultivation} = useMutation({
    mutationFn: (data: any) => add_cultivation(data),
    onSuccess: data => {
      setSuccessModal(true);
      queryClient.invalidateQueries();
    },
    onError: error => {
      console.log(
        'error?.response?.data?.message',
        error,
        error?.response?.data?.message,
      );
    },
    onSettled:()=>setModalVisible(false)
  });
  const {mutate: updateCultivation} = useMutation({
    mutationFn: (data: any) => edit_cultivation(data),
    onSuccess: data => {
      setSuccessModal(true);
      queryClient.invalidateQueries();
    },
    onError: error => {
      console.log(
        'error?.response?.data?.message edit',
        error,
        error?.response?.data?.message,
      );
    },
    onSettled: () => setModalVisible(false),
  });
  useEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <StackHeader
          title={crop_name.charAt(0).toUpperCase() + crop_name.slice(1)}
        />
      ),
    });
  }, [crop_name]);
  let treesSchema = Yup.object().shape({
    soil_health: Yup.string().required(t('soil_health is required')),
    decreasing_yield: Yup.number().test(
      'decreasing-yield-required',
      t('decreasing_rate is required'),
      function (value) {
        const {soil_health} = this.parent; // Accessing other field values
        if (soil_health === 'decreasing Yield') {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    type_of_fertilizer_used: Yup.string().required(
      t('type_of_fertilizer_used is required'),
    ),
    type_of_pesticide_used: Yup.string().required(
      t('type_of_pesticide_used is required'),
    ),
    income_from_sale: Yup.number()
      .min(1, 'Income from sale must be greater than equal to 1')
      .required(t('income_from_sale is required')),
    expenditure_on_inputs: Yup.number()
      .min(1, 'Expenditure on inputs must be greater than equal to 1')
      .required(t('expenditure_on_inputs is required')),
    yield: Yup.string().required(t('yeild is required')),
    month_harvested: Yup.string().required(t('month_harvested is required')),
    month_planted: Yup.string().required(t('month_planted is required')),
    required_processing: Yup.boolean().required(
      'Required processing is required',
    ),
    processing_method: Yup.string().test(
      'processing_method-required',
      t('processing_method is required'),
      function (value) {
        const {required_processing} = this.parent; // Accessing other field values
        if (required_processing) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
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
    setValues,
    resetForm,
  } = useFormik({
    initialValues: {
      soil_health: '',
      decreasing_yield: '',
      type_of_fertilizer_used: '',
      type_of_pesticide_used: '',
      income_from_sale: '',
      expenditure_on_inputs: '',
      yield: '',
      month_planted: new Date(),
      month_harvested: new Date(),
      required_processing: false,
      processing_method: '',
    },
    validationSchema: treesSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);

      setModalVisible(true);
    },
  });
  const onSubmit = () =>{
     const new_data = {
       ...utilInfo,
       crop_id: crop_id,
       soil_health: values?.soil_health,
       decreasing_yield: parseInt(values?.decreasing_yield || 0),
       type_of_fertilizer_used: values?.type_of_fertilizer_used,
       type_of_pesticide_used: values?.type_of_pesticide_used,
       income_from_sale: parseInt(values?.income_from_sale),
       expenditure_on_inputs: parseInt(values?.expenditure_on_inputs),
       yield: parseInt(values?.yield),
       month_planted: values?.month_planted,
       month_harvested: values?.month_harvested,
       required_processing: values?.required_processing,
       processing_method: values?.processing_method,
       status: 1,
     };
     if (data?._id) {
       setMessage(t('updated'));
       updateCultivation({...new_data, cultivation_id: data?._id});
     } else {
       console.log('here2');
       setMessage(t('submitted'));
       addCultivation({...new_data});
     }
  }
  const onChange = (selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setValues({
      ...values,
      month_planted: new Date(currentDate?.nativeEvent?.timestamp),
    });
  };
  const onChange2 = (selectedDate: any) => {
    const currentDate = selectedDate;
    setShow2(false);
    setValues({
      ...values,
      month_harvested: new Date(currentDate?.nativeEvent?.timestamp),
    });
  };
  useEffect(() => {
    setValues({
      ...values,
      yield: String(
        parseFloat(utilInfo?.output) / parseFloat(utilInfo?.area_allocated),
      ),
    });
    resetForm({
      values: {
        soil_health: data?.soil_health || '',
        decreasing_yield: data?.decreasing_yield || '',
        type_of_fertilizer_used: data?.type_of_fertilizer_used || '',
        type_of_pesticide_used: data?.type_of_pesticide_used || '',
        income_from_sale: data?.income_from_sale || '',
        expenditure_on_inputs: data?.expenditure_on_inputs || '',
        yield:
          data?.yield ||
          String(
            parseFloat(utilInfo?.output) / parseFloat(utilInfo?.area_allocated),
          ),
        month_planted: data?.month_planted
          ? new Date(data?.month_planted)
          : new Date(),
        month_harvested: data?.month_planted
          ? new Date(data?.month_harvested)
          : new Date(),
        required_processing: data?.required_processing || false,
        processing_method: data?.processing_method || '',
      },
    });
  }, [utilInfo.area_allocated, utilInfo?.output, data]);
  const onDraft = async () => {
    if (data?._id) {
      const new_data = {
        ...utilInfo,
        soil_health: values?.soil_health,
        decreasing_yield: parseInt(values?.decreasing_yield || 0),
        type_of_fertilizer_used: values?.type_of_fertilizer_used,
        type_of_pesticide_used: values?.type_of_pesticide_used,
        income_from_sale: parseInt(values?.income_from_sale),
        expenditure_on_inputs: parseInt(values?.expenditure_on_inputs),
        yield: parseInt(values?.yield),
        month_planted: values?.month_planted,
        month_harvested: values?.month_harvested,
        required_processing: values?.required_processing,
        processing_method: values?.processing_method,
        status: 0,
      };
      setMessage(t('drafted'))
      updateCultivation({...new_data, cultivation_id: data?._id});
    } else {
      console.log("croppp", crop_id)
      const new_data = {
        ...utilInfo,
        crop_id: crop_id,
        soil_health: values?.soil_health,
        decreasing_yield: parseInt(values?.decreasing_yield || 0),
        type_of_fertilizer_used: values?.type_of_fertilizer_used,
        type_of_pesticide_used: values?.type_of_pesticide_used,
        income_from_sale: parseInt(values?.income_from_sale),
        expenditure_on_inputs: parseInt(values?.expenditure_on_inputs),
        yield: parseInt(values?.yield),
        month_planted: values?.month_planted,
        month_harvested: values?.month_harvested,
        required_processing: values?.required_processing,
        processing_method: values?.processing_method,
        status: 0,
      };
      setMessage(t('drafted'))
      addCultivation(new_data);
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Customdropdown
              data={soilHealth}
              value={values.soil_health}
              label={t('soil health')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  soil_health: value?.value,
                });
              }}
            />
            {touched?.soil_health && errors?.soil_health && (
              <Text style={Styles.error}>{String(errors?.soil_health)}</Text>
            )}
            {values?.soil_health === 'decreasing yield' && (
              <>
                <Input
                  onChangeText={handleChange('decreasing_yield')}
                  value={String(values?.decreasing_yield)}
                  fullLength={true}
                  label={t('how much from first planting')}
                  keyboardType="numeric"
                  isRight={<AcresElement title={'    %'} />}
                />
                {touched?.decreasing_yield && errors?.decreasing_yield && (
                  <Text style={Styles.error}>
                    {String(errors?.decreasing_yield)}
                  </Text>
                )}
              </>
            )}
            <Customdropdown
              data={fertilisers}
              value={values.type_of_fertilizer_used}
              label={t('type of fertilizer')}
              onChange={(value: any) => {
                setValues({
                  ...values,
                  type_of_fertilizer_used: value?.value,
                });
              }}
            />
            {touched?.type_of_fertilizer_used &&
              errors?.type_of_fertilizer_used && (
                <Text style={Styles.error}>
                  {String(errors?.type_of_fertilizer_used)}
                </Text>
              )}
            <Customdropdown
              data={pesticides}
              value={values.type_of_pesticide_used}
              label={t('type of pesticides')}
              onChange={(value: any) => {
                setValues({
                  ...values,
                  type_of_pesticide_used: value?.value,
                });
              }}
            />
            {touched?.type_of_pesticide_used &&
              errors?.type_of_pesticide_used && (
                <Text style={Styles.error}>
                  {String(errors?.type_of_pesticide_used)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('income_from_sale')}
              value={String(values?.income_from_sale)}
              fullLength={true}
              label={t('income from sale')}
              keyboardType="numeric"
              isRight={<AcresElement title={authState?.currency} />}
            />
            {touched?.income_from_sale && errors?.income_from_sale && (
              <Text style={Styles.error}>
                {String(errors?.income_from_sale)}
              </Text>
            )}
            <Input
              onChangeText={handleChange('expenditure_on_inputs')}
              value={String(values?.expenditure_on_inputs)}
              fullLength={true}
              keyboardType="numeric"
              label={t('expenditure on input')}
              isRight={<AcresElement title={authState?.currency} />}
            />
            {touched?.expenditure_on_inputs &&
              errors?.expenditure_on_inputs && (
                <Text style={Styles.error}>
                  {String(errors?.expenditure_on_inputs)}
                </Text>
              )}
            <Text style={[Styles.fieldLabel]}>{t('required processing')}</Text>
            <View style={{flexDirection: 'row', gap: 8, marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  setValues({
                    ...values,
                    required_processing: !values?.required_processing,
                  })
                }>
                <Image
                  source={
                    values?.required_processing === true
                      ? require('../../../../../../assets/checked.png')
                      : require('../../../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>Yes</Text>
              <TouchableOpacity
                onPress={() =>
                  setValues({
                    ...values,
                    required_processing: !values?.required_processing,
                  })
                }>
                <Image
                  source={
                    values?.required_processing === false
                      ? require('../../../../../../assets/checked.png')
                      : require('../../../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>No</Text>
            </View>
            {values?.required_processing ? (
              <>
                <Input
                  onChangeText={handleChange('processing_method')}
                  value={String(values?.processing_method)}
                  fullLength={true}
                  label={'Processing Method'}
                  multiline={true}
                  numberOfLines={4}
                  longText={true}
                  textAlignVertical={'top'}
                />
                {touched?.processing_method && errors?.processing_method && (
                  <Text style={Styles.error}>
                    {String(errors?.processing_method)}
                  </Text>
                )}
              </>
            ) : null}
            <Input
              onChangeText={handleChange('yield')}
              value={String(values?.yield)}
              fullLength={true}
              editable={false}
              label={t('yields')}
              isRight={<AcresElement title={authState?.land_measurement} />}
              style={{backgroundColor: '#ebeced', borderRadius: 8}}
            />
            <Pressable onPress={() => setShow(true)}>
              <Input
                onChangeText={handleChange('month_planted')}
                value={moment(values?.month_planted).format('DD-MM-YYYY')}
                fullLength={true}
                label={t('Month Planted')}
                isDate={true}
              />
            </Pressable>
            {touched?.month_planted && errors?.month_planted && (
              <Text style={Styles.error}>{String(errors?.month_planted)}</Text>
            )}
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode={'date'}
                onChange={onChange}
              />
            )}
            <Pressable onPress={() => setShow2(true)}>
              <Input
                onChangeText={handleChange('month_harvested')}
                value={moment(values?.month_harvested).format('DD-MM-YYYY')}
                fullLength={true}
                label={t('month harvested')}
                isDate={true}
              />
            </Pressable>
            {touched?.month_harvested && errors?.month_harvested && (
              <Text style={Styles.error}>
                {String(errors?.month_harvested)}
              </Text>
            )}
            {show2 && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date()}
                mode={'date'}
                onChange={onChange2}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <View style={{flexDirection: 'row', gap: 16}}>
          <CustomButton
            // onPress={() => setModalVisible(true)}
            onPress={handleSubmit}
            btnText={t('submit')}
            style={{width: width / 2.5}}
          />
          <CustomButton
            onPress={() => {
              onDraft();
            }}
            btnText={t('save as draft')}
            btnStyle={{color: dark_grey}}
            style={{width: width / 2.5, backgroundColor: '#ebeced'}}
          />
        </View>
      </View>
      <AlertModal
        visible={modalViisble}
        cancel={true}
        hideText={t('cancel')}
        onSubmit={() => onSubmit()}
        confirmText={t('submit')}
        onHide={() => setModalVisible(false)}
        title={t('confirm')}
        comments={t('Are you sure you want to submit this form?')}
      />
      <AlertModal
        visible={successModal}
        successModal={true}
        onSubmit={() => {
          setSuccessModal(false), navigation.goBack(), navigation.goBack();
        }}
        confirmText={t('okay')}
        title={t('Successful')}
        comments={`${t('form')} ${message} ${t('Successful')}`}
      />
    </View>
  );
};

export default CultivationImportantInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subheading: {
    fontSize: 16 / fontScale,
    color: dark_grey,
    fontFamily: fontFamilyRegular,
    alignSelf: 'flex-start',
    textAlign: 'left',
    marginTop: '2%',
  },
});
