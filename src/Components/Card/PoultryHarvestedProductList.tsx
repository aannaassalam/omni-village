import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {black, borderColor, dark_grey} from '../../styles/colors';
import {fontFamilyMedium, fontFamilyRegular} from '../../styles/fontStyle';
import {Image} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Styles, width} from '../../styles/globalStyles';
import AcresElement from '../ui/AcresElement';
import Input from '../Inputs/Input';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import CustomButton from '../CustomButton/CustomButton';

const PoultryHarvestedProductList = ({
  item,
  index,
  setRemove,
  setData,
  weight
}: {
  item: any;
  index?: any;
  setRemove?: any;
  setData?: any;
  weight?:any
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  let treesSchema = Yup.object()
    .shape({
      product_name: Yup.string().required('Product name is required'),
      output: Yup.number()
        .min(1, 'Output must be greater than equal to 1')
        .required('Output is required'),
      self_consumed: Yup.number().required('Self consumed is required'),
      sold_to_neighbours: Yup.number().required(
        'Sold to neighbours is required',
      ),
      sold_for_industrial_use: Yup.number().required(
        'Sold for industrial use is required',
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
      month_harvested: Yup.string().required('Month harvested is required'),
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
      product_name: '',
      output: '',
      self_consumed: '',
      sold_to_neighbours: '',
      sold_for_industrial_use: '',
      wastage: '',
      others: '',
      others_value: '',
      month_harvested: new Date(),
      required_processing: false,
    },
    validationSchema: treesSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      setData(
        {
          product_name: values.product_name,
          output: parseInt(values.output),
          self_consumed: parseInt(values.self_consumed),
          sold_to_neighbours: parseInt(values.sold_to_neighbours),
          sold_for_industrial_use: parseInt(values.sold_for_industrial_use),
          wastage: parseInt(values.wastage),
          others: values.others,
          others_value: parseInt(values.others_value || 0) ,
          month_harvested: values?.month_harvested,
          required_processing: values.required_processing,
        },
        index,
      );
    },
  });
  useEffect(() => {
    resetForm({
      values: {
        product_name: item?.product_name || '',
        output: item?.output || '',
        self_consumed: item?.self_consumed || '',
        sold_to_neighbours: item?.sold_to_neighbours || '',
        sold_for_industrial_use: item?.sold_for_industrial_use || '',
        wastage: item?.wastage || '',
        others: item?.others || '',
        others_value: item?.others_value || '',
        month_harvested: item?.month_harvested || new Date(),
        required_processing: item?.required_processing || false,
      },
    });
  }, []);
  const onChange = (selectedDate: any) => {
    const currentDate = selectedDate;
    setShow(false);
    setValues({
      ...values,
      month_harvested: new Date(currentDate?.nativeEvent?.timestamp),
    });
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.inner_conatiner}
        onPress={async () => {
          setVisible(!visible);
        }}>
        <Text style={styles.header_text}>
          {item?.product_name || `Product ${index + 1}`}
        </Text>
        <TouchableOpacity onPress={() => setRemove(index)}>
          <Image
            source={require('../../../assets/delete.png')}
            style={{height: 30, width: 30, alignSelf: 'center'}}
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'android' ? 'height' : 'position'}
        keyboardVerticalOffset={120}>
        <ScrollView>
          {visible && (
            <>
              <Input
                onChangeText={handleChange('product_name')}
                value={String(values?.product_name)}
                fullLength={true}
                label={'Production Name'}
                keyboardType={'default'}
              />
              {touched?.product_name && errors?.product_name && (
                <Text style={Styles.error}>{String(errors?.product_name)}</Text>
              )}
              <Input
                onChangeText={handleChange('output')}
                value={String(values?.output)}
                fullLength={true}
                label={'Production Output'}
                keyboardType={'numeric'}
                isRight={<AcresElement title={weight} />}
              />
              {touched?.output && errors?.output && (
                <Text style={Styles.error}>{String(errors?.output)}</Text>
              )}
              <Input
                onChangeText={handleChange('self_consumed')}
                value={String(values?.self_consumed)}
                fullLength={true}
                label={'Self Consumed'}
                keyboardType={'numeric'}
                isRight={<AcresElement title={weight} />}
              />
              {touched?.self_consumed && errors?.self_consumed && (
                <Text style={Styles.error}>
                  {String(errors?.self_consumed)}
                </Text>
              )}
              <View style={[Styles.twoFieldsContainer, {gap: 8, marginTop: 0}]}>
                <View>
                  <Input
                    onChangeText={handleChange('sold_to_neighbours')}
                    value={String(values?.sold_to_neighbours)}
                    fullLength={false}
                    label={'Sold to neighbours'}
                    keyboardType={'numeric'}
                    inner_width={'40%'}
                    main_width={'90%'}
                    isRight={<AcresElement title={weight} />}
                  />
                  {touched?.sold_to_neighbours &&
                    errors?.sold_to_neighbours && (
                      <Text style={Styles.error}>
                        {String(errors?.sold_to_neighbours)}
                      </Text>
                    )}
                </View>
                <View>
                  <Input
                    onChangeText={handleChange('sold_for_industrial_use')}
                    value={String(values?.sold_for_industrial_use)}
                    fullLength={false}
                    inner_width={'40%'}
                    main_width={'90%'}
                    label={'Sold for industrial use'}
                    keyboardType={'numeric'}
                    isRight={<AcresElement title={weight} />}
                  />
                  {touched?.sold_for_industrial_use &&
                    errors?.sold_for_industrial_use && (
                      <Text style={Styles.error}>
                        {String(errors?.sold_for_industrial_use)}
                      </Text>
                    )}
                </View>
              </View>
              <View style={[Styles.twoFieldsContainer, {gap: 8, marginTop: 0}]}>
                <View>
                  <Input
                    onChangeText={handleChange('wastage')}
                    value={String(values?.wastage)}
                    fullLength={false}
                    label={'Wastage'}
                    keyboardType={'numeric'}
                    inner_width={'40%'}
                    main_width={'90%'}
                    isRight={<AcresElement title={weight} />}
                  />
                  {touched?.wastage && errors?.wastage && (
                    <Text style={Styles.error}>{String(errors?.wastage)}</Text>
                  )}
                </View>
                <View>
                  <Input
                    onChangeText={handleChange('others')}
                    value={String(values?.others)}
                    fullLength={false}
                    inner_width={'60%'}
                    main_width={'90%'}
                    label={'Others'}
                    keyboardType={'default'}
                  />
                  {touched?.others && errors?.others && (
                    <Text style={Styles.error}>{String(errors?.others)}</Text>
                  )}
                </View>
              </View>
              {values?.others !== '' ? (
                <>
                  <Input
                    onChangeText={handleChange('others_value')}
                    value={String(values?.others_value)}
                    fullLength={true}
                    label={values?.others}
                    keyboardType={'numeric'}
                    isRight={<AcresElement title={weight} />}
                  />
                  {touched?.others_value && errors?.others_value && (
                    <Text style={Styles.error}>
                      {String(errors?.others_value)}
                    </Text>
                  )}
                </>
              ) : null}
              <Pressable onPress={() => setShow(true)}>
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
              {show && (
                <DateTimePicker
                  testID="dateTimePicker"
                  value={new Date()}
                  mode={'date'}
                  onChange={onChange}
                />
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
                        ? require('../../../assets/checked.png')
                        : require('../../../assets/unchecked.png')
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
                        ? require('../../../assets/checked.png')
                        : require('../../../assets/unchecked.png')
                    }
                    style={{height: 22, width: 22}}
                  />
                </TouchableOpacity>
                <Text style={[styles?.subheading, {marginTop: 0}]}>No</Text>
              </View>
              <CustomButton
                onPress={handleSubmit}
                btnText={'Save'}
                style={{width: '100%', alignSelf: 'center', marginTop: '8%'}}
              />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default PoultryHarvestedProductList;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      borderColor: borderColor,
      borderWidth: 1,
      padding: 22,
      borderRadius: 8,
      marginVertical: 8,
    },
    inner_conatiner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    header_text: {
      fontSize: 18 / fontScale,
      fontFamily: fontFamilyMedium,
      color: black,
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
