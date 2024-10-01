import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import StackHeader from '../../../../../Components/CustomHeader/StackHeader';
import {Styles} from '../../../../../styles/globalStyles';
import Input from '../../../../../Components/Inputs/Input';
import Customdropdown from '../../../../../Components/CustomDropdown/Customdropdown';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';

const PoultryImportantInfo = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {crop_name} = route.params;
  useEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <StackHeader
          title={crop_name.charAt(0).toUpperCase() + crop_name.slice(1)}
        />
      ),
    });
  }, [crop_name]);
  let poultrySchema = Yup.object().shape({
    number: Yup.number()
      .min(1, 'Number of trees must be greater than equal to 1')
      .required('Number of trees is required'),
    average_age_of_livestocks: Yup.string().required(
      'Average age of livestocks is required',
    ),
    type_of_fed_required: Yup.string().required('Type of fed is required'),
    create_type: Yup.number().test(
      'create-type-required',
      'Create type is required',
      function (value) {
        const {type_of_fed_required} = this.parent; // Accessing other field values
        if (type_of_fed_required === 'Others') {
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
      number: 0,
      average_age_of_livestocks: '',
      type_of_fed_required: '',
      create_type: '',
    },
    // validationSchema: poultrySchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      navigation.navigate('poultryProductioninfo', {
        crop_name: crop_name,
        impVal: values,
      });
    },
  });
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('number')}
              value={String(values?.number)}
              fullLength={true}
              label={'Number'}
            />
            {touched?.number && errors?.number && (
              <Text style={Styles.error}>{String(errors?.number)}</Text>
            )}
            <Customdropdown
              data={[
                {id: 1, label: 'Less than a year', value: 'Less than a year'},
                {id: 2, label: '1 to 2 years', value: '1 to 2 years'},
                {id: 3, label: '2 to 3 years', value: '2 to 3 years'},
                {id: 3, label: '3 to 5 years', value: '3 to 5 years'},
              ]}
              value={values.average_age_of_livestocks}
              label={'Average age of livestocks'}
              onChange={(value: any) => {
                setValues({
                  ...values,
                  average_age_of_livestocks: value?.value,
                });
              }}
            />
            {touched?.average_age_of_livestocks &&
              errors?.average_age_of_livestocks && (
                <Text style={Styles.error}>
                  {String(errors?.average_age_of_livestocks)}
                </Text>
              )}
            <Customdropdown
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
                {id: 3, label: 'Others', value: 'Others'},
              ]}
              value={values.type_of_fed_required}
              label={'Type of fed required apart from grassland grassing'}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  type_of_fed_required: value?.value,
                });
              }}
            />
            {touched?.type_of_fed_required && errors?.type_of_fed_required && (
              <Text style={Styles.error}>
                {String(errors?.type_of_fed_required)}
              </Text>
            )}
            {values?.type_of_fed_required === 'Others' && (
              <>
                <Input
                  onChangeText={handleChange('create_type')}
                  value={String(values?.create_type)}
                  fullLength={true}
                  label={'Create Type'}
                />
                {touched?.create_type && errors?.create_type && (
                  <Text style={Styles.error}>
                    {String(errors?.create_type)}
                  </Text>
                )}
              </>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <CustomButton onPress={handleSubmit} btnText={'Next'} />
      </View>
    </View>
  );
};

export default PoultryImportantInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
