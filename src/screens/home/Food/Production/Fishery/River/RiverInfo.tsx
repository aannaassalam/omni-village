import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {dark_grey, white} from '../../../../../../styles/colors';
import {
  fontScale,
  Styles,
  width,
} from '../../../../../../styles/globalStyles';
import StackHeader from '../../../../../../Components/CustomHeader/StackHeader';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Input from '../../../../../../Components/Inputs/Input';
import AcresElement from '../../../../../../Components/ui/AcresElement';
import CustomButton from '../../../../../../Components/CustomButton/CustomButton';
import Customdropdown from '../../../../../../Components/CustomDropdown/Customdropdown';
import {fontFamilyRegular} from '../../../../../../styles/fontStyle';
import AlertModal from '../../../../../../Components/Popups/AlertModal';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {add_fishery, edit_fishery} from './../../../../../../apis/food';
import {get_feeds} from '../../../../../../apis/crops';
import {useSelector} from 'react-redux';
import { useTranslation } from 'react-i18next';
const RiverInfo = ({navigation, route}: {navigation: any; route: any}) => {
  const {crop_name,crop_id,data} = route.params;
  const [modalViisble, setModalVisible] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [message, setMessage] = useState('');
    const authState = useSelector(state => state.authState);
    const queryClient = useQueryClient();
    const {t}=useTranslation()
    const {data: feeds} = useQuery({
      queryKey: ['feeds_fishery'],
      queryFn: () =>
        get_feeds({country: authState?.country, category: 'fishery'}),
    });
    const {mutate: addFishery} = useMutation({
      mutationFn: (data: any) => add_fishery(data),
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
      onSettled: () => setModalVisible(false),
    });
    const {mutate: updateFishery} = useMutation({
      mutationFn: (data: any) => edit_fishery(data),
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
  let treesSchema = Yup.object()
    .shape({
      number: Yup.number()
        .min(1, 'Number must be greater than equal to 1')
        .required(t('number is required')),
      type_of_feed: Yup.string().required(t('type_of_feed is required')),
      create_type: Yup.string().test(
        'create-type-required',
        'Create type is required',
        function (value) {
          const {type_of_feed} = this.parent; // Accessing other field values
          if (type_of_feed == 'Others') {
            return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
          }
          return true; // Otherwise, no validation on decreasing_yield
        },
      ),
      weight_measurement: Yup.string().required(
        t('weight_measurement is required'),
      ),
      output: Yup.number()
        .min(1, 'Output must be greater than equal to 1')
        .required(t('output is required')),
      self_consumed: Yup.number().required(t('self_consumed is required')),
      sold_to_neighbours: Yup.number().required(
        t('sold_to_neighbours is required'),
      ),
      sold_for_industrial_use: Yup.number().required(
        t('sold_for_industrial_use is required'),
      ),
      wastage: Yup.number().required('wastage is required'),
      others: Yup.string(),
      others_value: Yup.number().test(
        'other-value-required',
        t('other_value is required'),
        function (value) {
          const {others} = this.parent; // Accessing other field values
          if (others) {
            return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
          }
          return true; // Otherwise, no validation on decreasing_yield
        },
      ),
      income_from_sale: Yup.number()
        .min(1, 'Income from sale must be greater than equal to 1')
        .required(t('income_from_sale is required')),
      expenditure_on_inputs: Yup.number()
        .min(1, 'Expenditure on inputs must be greater than equal to 1')
        .required(t('expenditure_on_inputs is required')),
      yield: Yup.string().required(t('yeild is required')),
      required_processing: Yup.boolean().required(
        'Required processing is required',
      ),
    })
    .test(
      'land-limit',
      'Sum of self consumed sold for industrial use,sold to neighbours,wastage,output and others value should not exceed Total land',
      function (values) {
        const {
          self_consumed,
          sold_for_industrial_use,
          sold_to_neighbours,
          wastage,
          output,
          others_value = 0,
        } = values;

        const totalAllocatedLand =
          self_consumed +
          sold_for_industrial_use +
          sold_to_neighbours +
          wastage +
          others_value;

        // Validate that the total allocated land does not exceed total land
        if (totalAllocatedLand > output) {
          return this.createError({
            path: 'output',
            message: `The output (${totalAllocatedLand}) exceeds the available output (${output})`,
          });
        }
        return true;
      },
    );
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
      number: '',
      type_of_feed: '',
      create_type: '',
      weight_measurement:'',
      output: '',
      self_consumed: '',
      sold_to_neighbours: '',
      sold_for_industrial_use: '',
      wastage: '',
      others: '',
      others_value: '',
      yield: '',
      income_from_sale: '',
      expenditure_on_inputs: '',
      required_processing: false,
    },
    validationSchema: treesSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      setModalVisible(true);
    },
  });
    useEffect(() => {
      setValues({
        ...values,
        yield:
          values?.output === '' || values?.number === ''
            ? 0
            : String(parseFloat(values?.output) / parseFloat(values?.number)),
      });
    }, [values?.output, values?.number]);
    useEffect(()=>{
        resetForm({
          values: {
            number: data?.number || '',
            type_of_feed: data?.type_of_feed || '',
            weight_measurement: data?.weight_measurement || '',
            create_type: data?.create_type || '',
            output: data?.output || '',
            self_consumed: data?.self_consumed || '',
            sold_to_neighbours: data?.sold_to_neighbours || '',
            sold_for_industrial_use: data?.sold_for_industrial_use || '',
            wastage: data?.wastage || '',
            others: data?.others || '',
            others_value: data?.others_value || '',
            yield:
              data?.yield || values?.output === '' || values?.number === ''
                ? 0
                : String(
                    parseFloat(values?.output) / parseFloat(values?.number),
                  ),
            income_from_sale: data?.income_from_sale || '',
            expenditure_on_inputs: data?.expenditure_on_inputs || '',
            required_processing: data?.required_processing || false,
          },
        });
    },[data])
    const onSubmit = () =>{
        let new_data = {
          number: parseInt(values?.number),
          type_of_feed: values?.type_of_feed,
          create_type: values?.create_type,
          total_feed: parseInt(values?.total_feed || 0),
          weight_measurement: values?.weight_measurement || '',
          output: parseInt(values?.output),
          self_consumed: parseInt(values?.self_consumed),
          sold_to_neighbours: parseInt(values?.sold_to_neighbours),
          sold_for_industrial_use: parseInt(values?.sold_for_industrial_use),
          wastage: parseInt(values?.wastage),
          others: values?.others,
          others_value: parseInt(values?.others_value),
          yield: parseFloat(values?.yield),
          income_from_sale: parseInt(values?.income_from_sale),
          expenditure_on_inputs: parseInt(values?.expenditure_on_inputs),
          required_processing: values?.required_processing,
          status: 1,
          fishery_type: 'river',
        };
        if (data?._id) {
          setMessage(t('updated'));
          updateFishery({...new_data, fishery_id: data?._id});
        } else {
          console.log('here2');
          setMessage(t('submitted'));
          addFishery({...new_data, crop_id: crop_id});
        }
    }
     const onDraft = async () => {
       if (data?._id) {
         const new_data = {
           number: parseInt(values?.number),
           type_of_feed: values?.type_of_feed,
           create_type: values?.create_type,
           total_feed: parseInt(values?.total_feed),
           weight_measurement: values?.weight_measurement || '',
           output: parseInt(values?.output),
           self_consumed: parseInt(values?.self_consumed),
           sold_to_neighbours: parseInt(values?.sold_to_neighbours),
           sold_for_industrial_use: parseInt(values?.sold_for_industrial_use),
           wastage: parseInt(values?.wastage),
           others: values?.others,
           others_value: parseInt(values?.others_value),
           yield: parseFloat(values?.yield),
           income_from_sale: parseInt(values?.income_from_sale),
           expenditure_on_inputs: parseInt(values?.expenditure_on_inputs),
           required_processing: values?.required_processing,
           status: 0,
           fishery_type: 'river',
         };
         setMessage(t('drafted'));
         updateFishery({...new_data, fishery_id: data?._id});
       } else {
         console.log('croppp', crop_id);
         const new_data = {
           number: parseInt(values?.number),
           type_of_feed: values?.type_of_feed,
           create_type: values?.create_type,
           weight_measurement: values?.weight_measurement || '',
           total_feed: parseInt(values?.total_feed),
           output: parseInt(values?.output),
           self_consumed: parseInt(values?.self_consumed),
           sold_to_neighbours: parseInt(values?.sold_to_neighbours),
           sold_for_industrial_use: parseInt(values?.sold_for_industrial_use),
           wastage: parseInt(values?.wastage),
           others: values?.others,
           others_value: parseInt(values?.others_value),
           yield: parseFloat(values?.yield),
           income_from_sale: parseInt(values?.income_from_sale),
           expenditure_on_inputs: parseInt(values?.expenditure_on_inputs),
           required_processing: values?.required_processing,
           status: 0,
           fishery_type: 'river',
         };
         setMessage(t('drafted'));
         addFishery({...new_data, crop_id: crop_id});
       }
     }
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('number')}
              value={String(values?.number)}
              fullLength={true}
              label={t('number')}
              keyboardType={'numeric'}
            />
            {touched?.number && errors?.number && (
              <Text style={Styles.error}>{String(errors?.number)}</Text>
            )}
            <Customdropdown
              data={
                feeds?.length > 0
                  ? [
                      ...feeds?.map((item: any) => {
                        return {
                          id: item?._id,
                          label: item.name,
                          value: item.name,
                        };
                      }),
                      {
                        id: 'others',
                        label: 'Others',
                        value: 'Others',
                      },
                    ]
                  : []
              }
              value={values.type_of_feed}
              label={t('type of feed')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  type_of_feed: value?.value,
                });
              }}
            />
            {touched?.type_of_feed && errors?.type_of_feed && (
              <Text style={Styles.error}>{String(errors?.type_of_feed)}</Text>
            )}
            {values?.type_of_feed === 'Others' && (
              <>
                <Input
                  onChangeText={handleChange('create_type')}
                  value={String(values?.create_type)}
                  fullLength={true}
                  label={t('create type')}
                  keyboardType="default"
                />
                {touched?.create_type && errors?.create_type && (
                  <Text style={Styles.error}>
                    {String(errors?.create_type)}
                  </Text>
                )}
              </>
            )}
            <Customdropdown
              data={authState?.weight_measurements}
              value={values.weight_measurement}
              label={t('weight measurement')}
              onChange={(value: any) => {
                setValues({
                  ...values,
                  weight_measurement: value?.value,
                });
              }}
            />
            {touched?.weight_measurement && errors?.weight_measurement && (
              <Text style={Styles.error}>
                {String(errors?.weight_measurement)}
              </Text>
            )}
            <Input
              onChangeText={handleChange('output')}
              value={String(values?.output)}
              fullLength={true}
              label={t('output')}
              keyboardType={'numeric'}
              isRight={<AcresElement title={values?.weight_measurement} />}
            />
            {touched?.output && errors?.output && (
              <Text style={Styles.error}>{String(errors?.output)}</Text>
            )}
            <Input
              onChangeText={handleChange('self_consumed')}
              value={String(values?.self_consumed)}
              fullLength={true}
              label={t('self consumed')}
              keyboardType={'numeric'}
              isRight={<AcresElement title={values?.weight_measurement} />}
            />
            {touched?.self_consumed && errors?.self_consumed && (
              <Text style={Styles.error}>{String(errors?.self_consumed)}</Text>
            )}
            <Input
              onChangeText={handleChange('sold_to_neighbours')}
              value={String(values?.sold_to_neighbours)}
              fullLength={true}
              label={t('sold to neighbour')}
              keyboardType={'numeric'}
              isRight={<AcresElement title={values?.weight_measurement} />}
            />
            {touched?.sold_to_neighbours && errors?.sold_to_neighbours && (
              <Text style={Styles.error}>
                {String(errors?.sold_to_neighbours)}
              </Text>
            )}
            <Input
              onChangeText={handleChange('sold_for_industrial_use')}
              value={String(values?.sold_for_industrial_use)}
              fullLength={true}
              label={t('sold to industrial')}
              keyboardType={'numeric'}
              isRight={<AcresElement title={values?.weight_measurement} />}
            />
            {touched?.sold_for_industrial_use &&
              errors?.sold_for_industrial_use && (
                <Text style={Styles.error}>
                  {String(errors?.sold_for_industrial_use)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('wastage')}
              value={String(values?.wastage)}
              fullLength={true}
              label={t('wastage')}
              keyboardType={'numeric'}
              isRight={<AcresElement title={values?.weight_measurement} />}
            />
            {touched?.wastage && errors?.wastage && (
              <Text style={Styles.error}>{String(errors?.wastage)}</Text>
            )}
            <Input
              onChangeText={handleChange('others')}
              value={String(values?.others)}
              fullLength={true}
              label={t('Other')}
              keyboardType={'default'}
            />
            {touched?.others && errors?.others && (
              <Text style={Styles.error}>{String(errors?.others)}</Text>
            )}
            {values?.others !== '' ? (
              <>
                <Input
                  onChangeText={handleChange('others_value')}
                  value={String(values?.others_value)}
                  fullLength={true}
                  label={values?.others}
                  keyboardType={'numeric'}
                  isRight={<AcresElement title={values?.weight_measurement} />}
                />
                {touched?.others_value && errors?.others_value && (
                  <Text style={Styles.error}>
                    {String(errors?.others_value)}
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
              isRight={
                <AcresElement title={authState?.land_measurement_symbol} />
              }
              style={{backgroundColor: '#ebeced', borderRadius: 8}}
            />
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
              label={t('expenditure on input')}
              keyboardType="numeric"
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
                      ? require('../../../../../../../assets/checked.png')
                      : require('../../../../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>
                {t('yes')}
              </Text>
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
                      ? require('../../../../../../../assets/checked.png')
                      : require('../../../../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>
                {t('no')}
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <View style={{flexDirection: 'row', gap: 16}}>
          <CustomButton
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
          setSuccessModal(false), navigation.goBack();
        }}
        confirmText="Okay"
        title={t('Successful')}
        comments={`${t('Form')} ${message} ${t('Successful')}`}
      />
    </View>
  );
};

export default RiverInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
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
