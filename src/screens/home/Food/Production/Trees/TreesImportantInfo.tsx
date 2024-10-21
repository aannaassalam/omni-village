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
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

const TreesImportantInfo = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {crop_name, crop_id, data} = route.params;
  const {t} = useTranslation();
  const authState = useSelector((state)=>state.authState)
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
  const average_age = [
    {
      id: 1,
      label: '0 to 5 years',
      value: '0 to 5 years'
    },
    {
      id: 2,
      label: '5 to 10 years',
      value: '5 to 10 years'
    },
    {
      id: 3,
      label: '10 to 20 years',
      value: '10 to 20 years'
    },
    {
      id: 4,
      label: '20 to 30 years',
      value: '20 to 30 years'
    },
    {
      id: 5,
      label: '30 to 50 years',
      value: '30 to 50 years'
    },
    {
      id: 6,
      label: '50 to 70 years',
      value: '50 to 70 years'
    },
    {
      id: 7,
      label: 'Above 70',
      value: 'Above 70'
    },
  ];
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
      .required(t('number trees')),
    average_age_of_trees: Yup.string().required(t('average of tree')),
    soil_health: Yup.string().required(t('soil health')),
    decreasing_yield: Yup.number().test(
      'decreasing-yield-required',
      t('decreasing_rate is required'),
      function (value) {
        const {soil_health} = this.parent; // Accessing other field values
        if (soil_health === 'Decreasing Yield') {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    type_of_fertiliser: Yup.string().required(
      t('type_of_fertilizer_used is required'),
    ),
    type_of_pesticide: Yup.string().required(
      t('type_of_pesticide_used is required'),
    ),
    income_from_sale: Yup.number()
      .min(1, 'Income from sale must be greater than equal to 1')
      .required(t('income_from_sale is required')),
    expenditure_on_inputs: Yup.number()
      .min(1, 'Expenditure on inputs must be greater than equal to 1')
      .required(t('expenditure_on_inputs is required')),
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
      number_of_trees: '',
      average_age_of_trees: '',
      soil_health: '',
      decreasing_yield: '',
      type_of_fertiliser: '',
      type_of_pesticide: '',
      income_from_sale: '',
      expenditure_on_inputs: '',
    },
    validationSchema: treesSchema,
    onSubmit: async (values: any) => {
      let parseVal={
        number_of_trees: parseInt(values.number_of_trees),
        average_age_of_trees: values.average_age_of_trees,
        soil_health: values.soil_health,
        decreasing_yield: parseFloat(values.decreasing_yield || 0),
        type_of_fertiliser: values.type_of_fertiliser,
        type_of_pesticide: values.type_of_pesticide,
        income_from_sale: parseInt(values.income_from_sale),
        expenditure_on_inputs: parseInt(values.expenditure_on_inputs)
      }
      navigation.navigate('treesHarvestedProduct', {
        crop_name: crop_name,
        crop_id: crop_id,
        impInfo: parseVal,
        edit_data: data,
      });
    },
  });
    useEffect(() => {
      resetForm({
        values: {
          number_of_trees: data?.number_of_trees || '',
          average_age_of_trees: data?.average_age_of_trees || '',
          soil_health: data?.soil_health || '',
          decreasing_yield: data?.decreasing_yield || '',
          type_of_fertiliser: data?.type_of_fertiliser || '',
          type_of_pesticide: data?.type_of_pesticide || '',
          income_from_sale: data?.income_from_sale || '',
          expenditure_on_inputs: data?.expenditure_on_inputs||'',
        },
      });
    }, [data]);
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('number_of_trees')}
              value={String(values?.number_of_trees)}
              fullLength={true}
              keyboardType="numeric"
              label={t('number trees')}
            />
            {touched?.number_of_trees && errors?.number_of_trees && (
              <Text style={Styles.error}>
                {String(errors?.number_of_trees)}
              </Text>
            )}
            <Customdropdown
              data={average_age}
              value={values.average_age_of_trees}
              label={t('average of tree')}
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
              value={values.type_of_fertiliser}
              label={t('type of fertilizer')}
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
              data={pesticides}
              value={values.type_of_pesticide}
              label={t('type of pesticides')}
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
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <CustomButton
          onPress={handleSubmit}
          btnText={t('expenditure on input')}
        />
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
