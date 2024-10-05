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
import StackHeader from '../../../../../Components/CustomHeader/StackHeader';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {dark_grey, white} from '../../../../../styles/colors';
import {fontScale, Styles, width} from '../../../../../styles/globalStyles';
import Input from '../../../../../Components/Inputs/Input';
import AcresElement from '../../../../../Components/ui/AcresElement';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';
import { fontFamilyRegular } from '../../../../../styles/fontStyle';
import AlertModal from '../../../../../Components/Popups/AlertModal';

const HuntingInfo = ({navigation, route}: {navigation: any; route: any}) => {
  const {crop_name} = route.params;
  const [modalViisble, setModalVisible] = useState(false);
  useEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <StackHeader
          title={crop_name.charAt(0).toUpperCase() + crop_name.slice(1)}
        />
      ),
    });
  }, [crop_name]);
  let huntingSchema = Yup.object()
    .shape({
      number_hunted: Yup.number()
        .min(1, 'Output must be greater than equal to 1')
        .required('Product name is required'),
      meat: Yup.number()
        .min(1, 'Meat must be greater than equal to 1')
        .required('Meat is required'),
      self_consumed: Yup.number().required('Self consumed is required'),
      sold_to_neighbours: Yup.number().required(
        'Sold to neighbours is required',
      ),
      sold_in_consumer_market: Yup.number().required(
        'Sold in consumer market is required',
      ),
      wastage: Yup.number().required('Wastage is required'),
      others: Yup.string(),
      others_value: Yup.number().test(
        'other-value-required',
        'Others value is required',
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
        .required('Income from sale is required'),
      expenditure_on_inputs: Yup.number()
        .min(1, 'Expenditure on inputs must be greater than equal to 1')
        .required('Expenditure on inputs is required'),
      required_processing: Yup.boolean().required(
        'Required processing is required',
      ),
    })
    .test(
      'meat-limit',
      'Sum of self consumed sold for consumer in market,sold to neighbours,wastage,meat and others value should not exceed Total land',
      function (values) {
        const {
          self_consumed,
          sold_in_consumer_market,
          sold_to_neighbours,
          wastage,
          meat,
          others_value = 0,
        } = values;

        const totalAllocatedLand =
          self_consumed +
          sold_in_consumer_market +
          sold_to_neighbours +
          wastage +
          others_value;

        // Validate that the total allocated land does not exceed total land
        if (totalAllocatedLand > meat) {
          return this.createError({
            path: 'output',
            message: `The output (${totalAllocatedLand}) exceeds the available output (${meat})`,
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
      number_hunted: 0,
      meat: 0,
      self_consumed: 0,
      sold_to_neighbours: 0,
      sold_in_consumer_market: 0,
      wastage: 0,
      others: '',
      others_value: 0,
      income_from_sale: 0,
      expenditure_on_inputs: 0,
      required_processing: false,
    },
    validationSchema: huntingSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      setModalVisible(true)
    },
  });
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
          <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('number_hunted')}
              value={String(values?.number_hunted)}
              fullLength={true}
              label={'Number hunted during the year'}
              keyboardType="numeric"
            />
            {touched?.number_hunted && errors?.number_hunted && (
              <Text style={Styles.error}>{String(errors?.number_hunted)}</Text>
            )}
            <Input
              onChangeText={handleChange('meat')}
              value={String(values?.meat)}
              fullLength={true}
              label={'Meat'}
              keyboardType="numeric"
              isRight={<AcresElement title={'kg'} />}
            />
            {touched?.meat && errors?.meat && (
              <Text style={Styles.error}>{String(errors?.meat)}</Text>
            )}
            <View style={[Styles.twoFieldsContainer]}>
              <View>
                <Input
                  onChangeText={handleChange('self_consumed')}
                  value={String(values?.self_consumed)}
                  fullLength={false}
                  label={'Self Consumed'}
                  isRight={<AcresElement title={'kg'} />}
                  inner_width={'75%'}
                  keyboardType="numeric"
                  main_width={width / 2.3}
                />
                {touched?.self_consumed && errors?.self_consumed && (
                  <Text style={Styles.error}>
                    {String(errors?.self_consumed)}
                  </Text>
                )}
              </View>
              <View>
                <Input
                  onChangeText={handleChange('sold_to_neighbours')}
                  value={String(values?.sold_to_neighbours)}
                  fullLength={false}
                  label={'Sold to neighbours'}
                  isRight={<AcresElement title={'kg'} />}
                  inner_width={'70%'}
                  keyboardType="numeric"
                  main_width={width / 2.37}
                />
                {touched?.sold_to_neighbours && errors?.sold_to_neighbours && (
                  <Text style={Styles.error}>
                    {String(errors?.sold_to_neighbours)}
                  </Text>
                )}
              </View>
            </View>
            <View style={[Styles.twoFieldsContainer, {marginTop: 0}]}>
              <View>
                <Input
                  onChangeText={handleChange('sold_in_consumer_market')}
                  value={String(values?.sold_in_consumer_market)}
                  fullLength={false}
                  label={'Sold in Consumer Market'}
                  isRight={<AcresElement title={'kg'} />}
                  inner_width={'75%'}
                  keyboardType="numeric"
                  main_width={width / 2.3}
                />
                {touched?.sold_in_consumer_market &&
                  errors?.sold_in_consumer_market && (
                    <Text style={Styles.error}>
                      {String(errors?.sold_in_consumer_market)}
                    </Text>
                  )}
              </View>
              <View>
                <Input
                  onChangeText={handleChange('wastage')}
                  value={String(values?.wastage)}
                  fullLength={false}
                  label={'Wastage'}
                  keyboardType="numeric"
                  isRight={<AcresElement title={'kg'} />}
                  inner_width={'70%'}
                  main_width={width / 2.37}
                />
                {touched?.wastage && errors?.wastage && (
                  <Text style={Styles.error}>{String(errors?.wastage)}</Text>
                )}
              </View>
            </View>
            <Input
              onChangeText={handleChange('others')}
              value={String(values?.others)}
              fullLength={true}
              label={'Others'}
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
                  keyboardType="numeric"
                  isRight={<AcresElement title={'kg'} />}
                />
                {touched?.others_value && errors?.others_value && (
                  <Text style={Styles.error}>
                    {String(errors?.others_value)}
                  </Text>
                )}
              </>
            ) : null}
            <Input
              onChangeText={handleChange('income_from_sale')}
              value={String(values?.income_from_sale)}
              fullLength={true}
              label={'Income from sale'}
              keyboardType="numeric"
              isRight={<AcresElement title={'Dollar'} />}
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
              label={'Expenditure on inputs'}
              keyboardType="numeric"
              isRight={<AcresElement title={'Dollar'} />}
            />
            {touched?.expenditure_on_inputs &&
              errors?.expenditure_on_inputs && (
                <Text style={Styles.error}>
                  {String(errors?.expenditure_on_inputs)}
                </Text>
              )}
            <Text style={[Styles.fieldLabel]}>
              Required Processing method if any for the outputs
            </Text>
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <View style={{flexDirection: 'row', gap: 16}}>
          <CustomButton
            onPress={handleSubmit}
            btnText={'Submit'}
            style={{width: width / 2.5}}
          />
          <CustomButton
            onPress={() => {}}
            btnText={'Save as draft'}
            btnStyle={{color: dark_grey}}
            style={{width: width / 2.5, backgroundColor: '#ebeced'}}
          />
        </View>
      </View>
      <AlertModal
        visible={modalViisble}
        cancel={true}
        hideText={'Cancel'}
        onSubmit={() => setModalVisible(false)}
        confirmText="Submit"
        onHide={() => setModalVisible(false)}
        title="Confirm Submit"
        comments="Are you sure you want to submit this form?"
      />
    </View>
  );
};

export default HuntingInfo;

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
