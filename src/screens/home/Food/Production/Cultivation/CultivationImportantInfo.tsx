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
const CultivationImportantInfo = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {crop_name, utilInfo} = route.params;
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
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
  let treesSchema = Yup.object().shape({
    soil_health: Yup.string().required('Soil health is required'),
    decreasing_yield: Yup.number().test(
      'decreasing-yield-required',
      'Decreasing yield is required',
      function (value) {
        const {soil_health} = this.parent; // Accessing other field values
        if (soil_health === 'Decreasing Yield') {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    type_of_fertiliser: Yup.string().required('Type of fertiliser is required'),
    type_of_pesticide: Yup.string().required('Type of pesticide is required'),
    income_from_sale: Yup.number()
      .min(1, 'Income from sale must be greater than equal to 1')
      .required('Income from sale is required'),
    expenditure_on_inputs: Yup.number()
      .min(1, 'Expenditure on inputs must be greater than equal to 1')
      .required('Expenditure on inputs is required'),
    yield: Yup.string().required('yield is required'),
    month_harvested: Yup.string().required('Month harvested is required'),
    month_planted: Yup.string().required('Month planted is required'),
    required_processing: Yup.boolean().required(
      'Required processing is required',
    ),
    processing_method: Yup.number().test(
      'processing_method-required',
      'Processing Method is required',
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
      decreasing_yield: 0,
      type_of_fertiliser: '',
      type_of_pesticide: '',
      income_from_sale: 0,
      expenditure_on_inputs: 0,
      yield: 0,
      month_planted: new Date(),
      month_harvested: new Date(),
      required_processing: false,
      processing_method: '',
    },
    // validationSchema: treesSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      setModalVisible(true);
    },
  });
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
    setShow(false);
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
  }, [utilInfo.area_allocated, utilInfo?.output]);
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Customdropdown
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.soil_health}
              label={'Soil health'}
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
            {values?.soil_health === 'Decreasing Yield' && (
              <>
                <Input
                  onChangeText={handleChange('decreasing_yield')}
                  value={String(values?.decreasing_yield)}
                  fullLength={true}
                  label={'How much from first planting'}
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
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.type_of_fertiliser}
              label={'Type of fertiliser used'}
              onChange={(value: any) => {
                setValues({
                  ...values,
                  type_of_fertiliser: value?.value,
                });
              }}
            />
            {touched?.type_of_fertiliser && errors?.type_of_fertiliser && (
              <Text style={Styles.error}>
                {String(errors?.type_of_fertiliser)}
              </Text>
            )}
            <Customdropdown
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.type_of_pesticide}
              label={'Type of pesticide used'}
              onChange={(value: any) => {
                setValues({
                  ...values,
                  type_of_pesticide: value?.value,
                });
              }}
            />
            {touched?.type_of_pesticide && errors?.type_of_pesticide && (
              <Text style={Styles.error}>
                {String(errors?.type_of_pesticide)}
              </Text>
            )}
            <Input
              onChangeText={handleChange('income_from_sale')}
              value={String(values?.income_from_sale)}
              fullLength={true}
              label={'Income from sale'}
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
              label={'Yield'}
              isRight={<AcresElement title={'acres'} />}
              style={{backgroundColor: '#ebeced', borderRadius: 8}}
            />
            <Pressable onPress={() => setShow(true)}>
              <Input
                onChangeText={handleChange('month_planted')}
                value={moment(values?.month_planted).format('DD-MM-YYYY')}
                fullLength={true}
                label={'Month plnated'}
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
                label={'Month harvested'}
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
