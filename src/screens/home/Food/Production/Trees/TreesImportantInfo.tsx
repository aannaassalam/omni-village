import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {Styles} from '../../../../../styles/globalStyles';
import StackHeader from '../../../../../Components/CustomHeader/StackHeader';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Input from '../../../../../Components/Inputs/Input';
import Customdropdown from '../../../../../Components/CustomDropdown/Customdropdown';
import AcresElement from '../../../../../Components/ui/AcresElement';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';
import { white } from '../../../../../styles/colors';

const TreesImportantInfo = ({
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
  let treesSchema = Yup.object().shape({
    number_of_trees: Yup.number()
      .min(1, 'Number of trees must be greater than equal to 1')
      .required('Number of trees is required'),
    average_age_of_trees: Yup.string().required(
      'Average age of trees is required',
    ),
    soil_health: Yup.string().required('Soil health is required'),
    decreasing_yield: Yup.number().test(
      'decreasing-yield-required',
      'Decreasing yield is required',
      function (value) {
        console.log('valueeee', value);
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
      number_of_trees: 0,
      average_age_of_trees: '',
      soil_health: '',
      decreasing_yield: 0,
      type_of_fertiliser: '',
      type_of_pesticide: '',
      income_from_sale: 0,
      expenditure_on_inputs: 0,
    },
    // validationSchema: treesSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      navigation.navigate('treesHarvestedProduct', {
        crop_name: crop_name,
        values: values,
      });
    },
  });
  return (
    <View style={styles.container}>
        <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
          <ScrollView contentContainerStyle={{paddingBottom: 105}}>
      <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('number_of_trees')}
              value={String(values?.number_of_trees)}
              fullLength={true}
              label={'Number of trees'}
            />
            {touched?.number_of_trees && errors?.number_of_trees && (
              <Text style={Styles.error}>
                {String(errors?.number_of_trees)}
              </Text>
            )}
            <Customdropdown
              data={[
                {id: 1, label: 'Less than a year', value: 'Less than a year'},
                {id: 2, label: '1 to 2 years', value: '1 to 2 years'},
                {id: 3, label: '2 to 3 years', value: '2 to 3 years'},
                {id: 3, label: '3 to 5 years', value: '3 to 5 years'},
              ]}
              value={values.average_age_of_trees}
              label={'Average age of trees'}
              onChange={(value: any) => {
                setValues({
                  ...values,
                  average_age_of_trees: value?.value,
                });
              }}
            />
            {touched?.average_age_of_trees && errors?.average_age_of_trees && (
              <Text style={Styles.error}>
                {String(errors?.average_age_of_trees)}
              </Text>
            )}
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
                  label={'Decreasing yield'}
                  keyboardType='numeric'
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
      </View>
          </ScrollView>
        </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <CustomButton onPress={handleSubmit} btnText={'Next'} />
      </View>
    </View>
  );
};

export default TreesImportantInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:white
  },
});
