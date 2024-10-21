import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import {dark_grey, white} from '../../../../../styles/colors';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import StackHeader from '../../../../../Components/CustomHeader/StackHeader';
import {fontScale, Styles} from '../../../../../styles/globalStyles';
import Input from '../../../../../Components/Inputs/Input';
import AcresElement from '../../../../../Components/ui/AcresElement';
import { fontFamilyRegular } from '../../../../../styles/fontStyle';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

const PoultryProductionInfo = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {crop_name, impVal, crop_id,data} = route.params;
  const authState = useSelector((state:any)=>state.authState)
  const {t} = useTranslation()
  useEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <StackHeader
          title={crop_name.charAt(0).toUpperCase() + crop_name.slice(1)}
        />
      ),
    });
  }, [crop_name]);
  let poultrySchema = Yup.object()
    .shape({
      total_feed: Yup.number()
        .min(1, 'Total feed must be greater than equal to 1')
        .required(t('total_feed is required')),
      self_produced: Yup.number().required(t('self_produced is required')),
      neighbours: Yup.number().required(t('neighbours required')),
      purchased_from_market: Yup.number().required(
        t('purchased_from_market is required'),
      ),
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
      steroids: Yup.boolean().required(t('steroids is required')),
    })
    .test(
      'land-limit',
      'Sum of self consumed sold for industrial use,sold to neighbours,wastage,output and others value should not exceed Total land',
      function (values) {
        const {
          neighbours,
          purchased_from_market,
          total_feed,
          self_produced,
          others_value = 0,
        } = values;

        const totalAllocatedLand =
          self_produced + neighbours + purchased_from_market + others_value;

        // Validate that the total allocated land does not exceed total land
        if (totalAllocatedLand > total_feed) {
          return this.createError({
            path: 'total_feed',
            message: `The output (${totalAllocatedLand}) exceeds the available total feed (${total_feed})`,
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
      total_feed: '',
      self_produced: '',
      neighbours: '',
      purchased_from_market: '',
      others: '',
      others_value: '',
      income_from_sale: '',
      expenditure_on_inputs: '',
      steroids: false,
    },
    validationSchema: poultrySchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      let new_val = {
        total_feed: parseInt(values.total_feed),
        self_produced: parseInt(values.self_produced),
        neighbours: parseInt(values.neighbours),
        purchased_from_market: parseInt(values.purchased_from_market),
        others: values.others,
        others_value: parseInt(values.others_value || 0),
        income_from_sale: parseInt(values.income_from_sale),
        expenditure_on_inputs: parseInt(values.expenditure_on_inputs),
        steroids: values.steroids,
      };
      navigation.navigate('poultryHarvestedProduct', {
        crop_name: crop_name,
        crop_id: crop_id,
        impVal: impVal,
        proVal: new_val,
        get_data: data,
      });
    },
  });
   useEffect(() => {
     resetForm({
       values: {
         total_feed: data?.total_feed || '',
         self_produced: data?.self_produced || '',
         neighbours: data?.neighbours || '',
         purchased_from_market: data?.purchased_from_market || '',
         others: data?.others || '',
         others_value: data?.others_value || '',
         income_from_sale: data?.income_from_sale || '',
         expenditure_on_inputs: data?.expenditure_on_inputs || '',
         steroids: data?.steroids || false,
       },
     });
   }, [data]);
   console.log('errrrrr', typeof impVal?.average_age_of_livestocks);
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('total_feed')}
              value={String(values?.total_feed)}
              fullLength={true}
              keyboardType="numeric"
              label={t('total feed')}
              isRight={<AcresElement title={impVal?.weight_measurement} />}
            />
            {touched?.total_feed && errors?.total_feed && (
              <Text style={Styles.error}>{String(errors?.total_feed)}</Text>
            )}
            <Input
              onChangeText={handleChange('self_produced')}
              value={String(values?.self_produced)}
              fullLength={true}
              keyboardType="numeric"
              label={t('self produced')}
              isRight={<AcresElement title={impVal?.weight_measurement} />}
            />
            {touched?.self_produced && errors?.self_produced && (
              <Text style={Styles.error}>{String(errors?.self_produced)}</Text>
            )}
            <Input
              onChangeText={handleChange('neighbours')}
              value={String(values?.neighbours)}
              fullLength={true}
              keyboardType="numeric"
              label={t('neighbour')}
              isRight={<AcresElement title={impVal?.weight_measurement} />}
            />
            {touched?.neighbours && errors?.neighbours && (
              <Text style={Styles.error}>{String(errors?.neighbours)}</Text>
            )}
            <Input
              onChangeText={handleChange('purchased_from_market')}
              value={String(values?.purchased_from_market)}
              fullLength={true}
              keyboardType="numeric"
              label={t('purchased from market')}
              isRight={<AcresElement title={impVal?.weight_measurement} />}
            />
            {touched?.purchased_from_market &&
              errors?.purchased_from_market && (
                <Text style={Styles.error}>
                  {String(errors?.purchased_from_market)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('others')}
              value={String(values?.others)}
              fullLength={true}
              label={t('Other')}
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
                  isRight={<AcresElement title={impVal?.weight_measurement} />}
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
              keyboardType="numeric"
              label={t('income from sale')}
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
            <Text style={[Styles.fieldLabel]}>
              {t(
                'any hormones/ artificial productivity enhancing mechanism applied',
              )}
            </Text>
            <View style={{flexDirection: 'row', gap: 8, marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  setValues({
                    ...values,
                    steroids: !values?.steroids,
                  })
                }>
                <Image
                  source={
                    values?.steroids === true
                      ? require('../../../../../../assets/checked.png')
                      : require('../../../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>{t('yes')}</Text>
              <TouchableOpacity
                onPress={() =>
                  setValues({
                    ...values,
                    steroids: !values?.steroids,
                  })
                }>
                <Image
                  source={
                    values?.steroids === false
                      ? require('../../../../../../assets/checked.png')
                      : require('../../../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>{t('no')}</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <CustomButton onPress={handleSubmit} btnText={t('Next')} />
      </View>
    </View>
  );
};

export default PoultryProductionInfo;

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
