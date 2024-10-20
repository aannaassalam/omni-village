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
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { get_feeds } from '../../../../../apis/crops';

const PoultryImportantInfo = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {crop_name, crop_id,data} = route.params;
  const authState = useSelector((state: any) => state.authState);
  const {t} = useTranslation()
   const average_age = [
     {
       id: 1,
       label: 'Less than a year',
       value:'1',
     },
     {
       id: 2,
       label: '1 to 2 years',
       value: '2',
     },
     {
       id: 3,
       label: '2 to 3 years',
       value: '3',
     },
     {
       id: 4,
       label: '3 to 5 years',
       value: '5',
     },
   ];
      const {data: feeds} = useQuery({
        queryKey: ['feeds'],
        queryFn: () => get_feeds({country: authState?.country, category:'normal'}),
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
  let poultrySchema = Yup.object().shape({
    number: Yup.number()
      .min(1, 'Number of trees must be greater than equal to 1')
      .required('Number of trees is required'),
    average_age_of_livestocks: Yup.string().required(
      'Average age of livestocks is required',
    ),
    type_of_feed: Yup.string().required('Type of feed is required'),
    create_type: Yup.string().test(
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
    weight_measurement: Yup.string().required(
      'Weight measurement required is required',
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
      number: '',
      average_age_of_livestocks: '',
      type_of_feed: '',
      create_type: '',
      weight_measurement: '',
    },
    validationSchema: poultrySchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      navigation.navigate('poultryProductioninfo', {
        crop_name: crop_name,
        crop_id: crop_id,
        data: data,
        impVal: {
          ...values,
          number: parseInt(values?.number),
          avg_age_time_period: 'months',
        },
      });
    },
  });
   useEffect(() => {
     resetForm({
       values: {
         number: data?.number || '',
         average_age_of_livestocks: String(data?.average_age_of_livestocks) || '',
         type_of_feed: data?.type_of_feed || '',
         create_type: data?.create_type || '',
         weight_measurement: data?.weight_measurement || '',
       },
     });
   }, [data]);
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
              keyboardType="numeric"
            />
            {touched?.number && errors?.number && (
              <Text style={Styles.error}>{String(errors?.number)}</Text>
            )}
            <Customdropdown
              data={average_age}
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
              label={'Type of fed required apart from grassland grassing'}
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
                  label={'Create Type'}
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
              label={'Weight measuremnt'}
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
