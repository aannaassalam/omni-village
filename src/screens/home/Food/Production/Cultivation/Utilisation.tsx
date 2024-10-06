import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {white} from '../../../../../styles/colors';
import {Styles} from '../../../../../styles/globalStyles';
import StackHeader from '../../../../../Components/CustomHeader/StackHeader';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Input from '../../../../../Components/Inputs/Input';
import AcresElement from '../../../../../Components/ui/AcresElement';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';

const Utilisation = ({navigation, route}: {navigation: any; route: any}) => {
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
  let treesSchema = Yup.object()
    .shape({
      area_allocated: Yup.number()
        .min(1, 'Area allocated must be greater than equal to 1')
        .required('Area allocated is required'),
      output: Yup.number()
        .min(1, 'Output must be greater than equal to 1')
        .required('Output is required'),
      self_consumed: Yup.number().required('Self consumed is required'),
      fed_to_livestock: Yup.number().required('Fed to livestock is required'),
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
    })
    .test(
      'land-limit',
      'Sum of self consumed sold for industrial use,sold to neighbours,wastage,output and others value should not exceed Total land',
      function (values) {
        const {
          self_consumed,
          sold_for_industrial_use,
          sold_to_neighbours,
          fed_to_livestock,
          wastage,
          output,
          others_value = 0,
        } = values;

        const totalAllocatedLand =
          self_consumed +
          sold_for_industrial_use +
          sold_to_neighbours +
          fed_to_livestock +
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
      area_allocated: 0,
      output: 0,
      self_consumed: 0,
      fed_to_livestock: 0,
      sold_to_neighbours: 0,
      sold_for_industrial_use: 0,
      wastage: 0,
      others: '',
      others_value: 0,
    },
    // validationSchema: treesSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      navigation.navigate('cultivationImportantInfo', {
        crop_name: crop_name,
        utilInfo: values,
      });
    },
  });
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('area_allocated')}
              value={String(values?.area_allocated)}
              fullLength={true}
              label={'Area allocated'}
              keyboardType={'numeric'}
              isRight={<AcresElement title={'kg'} />}
            />
            {touched?.area_allocated && errors?.area_allocated && (
              <Text style={Styles.error}>{String(errors?.area_allocated)}</Text>
            )}
            <Input
              onChangeText={handleChange('output')}
              value={String(values?.output)}
              fullLength={true}
              label={'Output'}
              keyboardType={'numeric'}
              isRight={<AcresElement title={'kg'} />}
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
              isRight={<AcresElement title={'kg'} />}
            />
            {touched?.self_consumed && errors?.self_consumed && (
              <Text style={Styles.error}>{String(errors?.self_consumed)}</Text>
            )}
            <Input
              onChangeText={handleChange('fed_to_livestock')}
              value={String(values?.fed_to_livestock)}
              fullLength={true}
              label={'Fed to livestock'}
              keyboardType={'numeric'}
              isRight={<AcresElement title={'kg'} />}
            />
            {touched?.fed_to_livestock && errors?.fed_to_livestock && (
              <Text style={Styles.error}>
                {String(errors?.fed_to_livestock)}
              </Text>
            )}
            <Input
              onChangeText={handleChange('sold_to_neighbours')}
              value={String(values?.sold_to_neighbours)}
              fullLength={true}
              label={'Sold to neighbours'}
              keyboardType={'numeric'}
              isRight={<AcresElement title={'kg'} />}
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
              label={'Sold for industrial use'}
              keyboardType={'numeric'}
              isRight={<AcresElement title={'kg'} />}
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
              label={'Wastage'}
              keyboardType={'numeric'}
              isRight={<AcresElement title={'kg'} />}
            />
            {touched?.wastage && errors?.wastage && (
              <Text style={Styles.error}>{String(errors?.wastage)}</Text>
            )}
            <Input
              onChangeText={handleChange('others')}
              value={String(values?.others)}
              fullLength={true}
              label={'Others'}
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
                  keyboardType={'default'}
                  isRight={<AcresElement title={'kg'} />}
                />
                {touched?.others_value && errors?.others_value && (
                  <Text style={Styles.error}>
                    {String(errors?.others_value)}
                  </Text>
                )}
              </>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <CustomButton
          onPress={handleSubmit}
          btnText={'Next'}
        />
      </View>
    </View>
  );
};

export default Utilisation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
});
