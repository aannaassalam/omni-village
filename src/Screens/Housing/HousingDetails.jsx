import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Styles, width} from '../../styles/globalStyles';
import {ActivityIndicator, Divider} from 'react-native-paper';
import * as yup from 'yup';
import {useFormik} from 'formik';
import Input from '../../Components/Inputs/Input';
import AcresElement from '../../Components/ui/AcresElement';
import {useUser} from '../../Hooks/useUser';
import YearPicker from '../../Components/YearPicker/YearPicker';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import {useQuery} from '@tanstack/react-query';
import {
  getHousing,
  getHousingById,
  getHousingDropdown,
} from '../../functions/housing';
import {primaryColor} from '../../styles/colors';
import {USER_PREFERRED_LANGUAGE} from '../../i18next';
const HousingDetails = ({navigation, route}) => {
  const {t} = useTranslation();
  const {data: user} = useUser();
  const {house, data} = route.params;
  const [houseDetails, setHouseDetails] = useState(true);
  const {
    data: housing,
    isLoading: loading,
    refetch: refetchHousing,
  } = useQuery({
    queryKey: [`housing_data_${data?.house_id}`],
    enabled: Boolean(data?.house_id),
    queryFn: () => getHousingById(data?.house_id),
    refetchOnWindowFocus: true,
  });
  const {
    data: housing_dropdown,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['housing'],
    queryFn: () => getHousingDropdown(),
    refetchOnWindowFocus: true,
  });
  const scheme = yup.object().shape({
    name_of_the_house: yup
      .string()
      .required(t('Name of the house is required')),
    type_of_house: yup.string().required(t('Type of house is required')),
    land_utilised_for_family_housing: yup
      .number()
      .required(t('Land utilised for family housing is required')),
    no_of_units_built: yup
      .number()
      .required(t('No of units built is required')),
    total_built_area: yup.number().required(t('Total built area is required')),
    no_of_floors: yup.number().required(t('No of floors is required')),
    living_area: yup.number(),
    year_built: yup.number().required(t('Year built is required')),
    year_renovated: yup.number().optional(),
    // .required(t('Year renovated is required')),
    year_last_expanded: yup.number().optional(),
    // .required(t('Year last expanded is required'))
    type: yup.string().required(t('Type is required')),
  });
  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    setFieldTouched,
    touched,
    resetForm,
    setValues,
  } = useFormik({
    initialValues: {
      name_of_the_house: '',
      type_of_house: '',
      land_utilised_for_family_housing: '',
      no_of_units_built: '',
      total_built_area: '',
      no_of_floors: '',
      living_area: '',
      year_built: '',
      year_renovated: '',
      year_last_expanded: '',
      type: '',
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      let new_data = {
        name_of_the_house: values.name_of_the_house,
        type_of_house: values.type_of_house,
        land_utilised_for_family_housing: parseInt(
          values.land_utilised_for_family_housing,
        ),
        no_of_units_built: parseInt(values.no_of_units_built),
        total_built_area: parseInt(values.total_built_area),
        no_of_floors: parseInt(values.no_of_floors),
        living_area: parseInt(values.living_area || 0),
        year_built: values.year_built,
        year_renovated: values.year_renovated,
        year_last_expanded: values.year_last_expanded,
        type: values.type,
      };
      navigation.navigate('housingPhoto', {
        housingData: new_data,
        house,
        house_id: data.house_id,
        housing_data: housing,
      });
    },
  });

  useEffect(() => {
    resetForm({
      values: {
        name_of_the_house: housing?.name_of_the_house,
        type_of_house: housing?.type_of_house,
        land_utilised_for_family_housing:
          housing?.land_utilised_for_family_housing === null ||
          housing?.land_utilised_for_family_housing === undefined
            ? ''
            : String(housing?.land_utilised_for_family_housing) || '',
        no_of_units_built:
          housing?.no_of_units_built === null || housing?.no_of_units_built === undefined
            ? ''
            : String(housing?.no_of_units_built) || '',
        total_built_area:
          housing?.total_built_area === null || housing?.total_built_area === undefined
            ? ''
            : String(housing?.total_built_area) || '',
        no_of_floors:
          housing?.no_of_floors === null || housing?.no_of_floors === undefined
            ? ''
            : String(housing?.no_of_floors) || '',
        living_area:
          housing?.living_area === null || housing?.living_area === undefined
            ? ''
            : String(housing?.living_area) || '',
        year_built: housing?.year_built > 0 ? housing?.year_built : null,
        year_renovated:
          housing?.year_renovated > 0 ? housing?.year_renovated : null,
        year_last_expanded:
          housing?.year_last_expanded > 0 ? housing?.year_last_expanded : null,
        type: housing?.type,
      },
    });
  }, [housing]);
  console.log('living ', housing);
  if (isLoading || loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
        <ActivityIndicator size={'large'} color={primaryColor} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={`${t('housing')} (${house})`}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 140, paddingHorizontal: 22}}>
        <View style={styles.subArea}>
          <Text
            style={[Styles.fieldLabel, {marginTop: 4, alignSelf: 'center'}]}>
            {t('House Details')}
          </Text>
          <Divider
            bold={true}
            style={[styles.divider, {width: '55%'}]}
            horizontalInset={true}
          />
          <TouchableOpacity onPress={() => setHouseDetails(!houseDetails)}>
            {houseDetails ? (
              <Image
                source={require('../../../assets/arrowUp.png')}
                style={styles.uparrow}
              />
            ) : (
              <Image
                source={require('../../../assets/arrowDown.png')}
                style={styles.uparrow}
              />
            )}
          </TouchableOpacity>
        </View>
        {houseDetails ? (
          <>
            <Input
              label={t('Name of the house')}
              value={values.name_of_the_house}
              placeholder={''}
              fullLength={true}
              keyboardType="default"
              onChangeText={handleChange('name_of_the_house')}
            />
            {touched?.name_of_the_house && errors?.name_of_the_house && (
              <Text style={Styles.error2}>
                {String(errors?.name_of_the_house)}
              </Text>
            )}
            <CustomDropdown
              data={[
                {label: 'Family House', value: 'Family House'},
                {label: 'Farm House', value: 'Farm House'},
              ]}
              value={values.type_of_house}
              label={t('Type of House')}
              onChange={value => {
                setValues({
                  ...values,
                  type_of_house: value?.value,
                });
              }}
            />
            {touched?.type_of_house && errors?.type_of_house && (
              <Text style={Styles.error2}>{String(errors?.type_of_house)}</Text>
            )}
            <Input
              label={t('Land utilised for main family housing')}
              value={values.land_utilised_for_family_housing}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('land_utilised_for_family_housing')}
              isRight={<AcresElement title={'sq ft'} />}
            />
            {touched?.land_utilised_for_family_housing &&
              errors?.land_utilised_for_family_housing && (
                <Text style={Styles.error2}>
                  {String(errors?.land_utilised_for_family_housing)}
                </Text>
              )}

            <Input
              label={t('Number of units built')}
              value={values.no_of_units_built}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('no_of_units_built')}
              // isRight={<AcresElement title={user?.land_measurement_symbol} />}
            />
            {touched?.no_of_units_built && errors?.no_of_units_built && (
              <Text style={Styles.error2}>
                {String(errors?.no_of_units_built)}
              </Text>
            )}
            <Input
              label={t('Total Built Up Area')}
              value={values.total_built_area}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('total_built_area')}
              isRight={<AcresElement title={'sq ft'} />}
            />
            {touched?.total_built_area && errors?.total_built_area && (
              <Text style={Styles.error2}>
                {String(errors?.total_built_area)}
              </Text>
            )}
            <Input
              label={t('No. of floors')}
              value={values.no_of_floors}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('no_of_floors')}
            />
            {touched?.no_of_floors && errors?.no_of_floors && (
              <Text style={Styles.error2}>{String(errors?.no_of_floors)}</Text>
            )}
            {/* <Input
                  label={t('Living area')}
                  value={values.living_area}
                  placeholder={'0'}
                  fullLength={true}
                  keyboardType='numeric'
                  onChangeText={handleChange('living_area')}
                />
                {touched?.living_area && errors?.living_area && (
                  <Text style={Styles.error2}>{String(errors?.living_area)}</Text>
                )} */}
            <YearPicker
              onYearChange={year => {
                setValues({...values, year_built: parseInt(year)});
              }}
              selectedYear={values?.year_built}
              label={t('Year built')}
            />
            {errors.year_built && touched.year_built && (
              <Text style={Styles.error2}>{errors.year_built}</Text>
            )}
            <YearPicker
              onYearChange={year => {
                setValues({...values, year_renovated: parseInt(year)});
              }}
              selectedYear={values?.year_renovated}
              label={t('Year last renovated')}
            />
            {errors.year_renovated && touched.year_renovated && (
              <Text style={Styles.error2}>{errors.year_renovated}</Text>
            )}
            <YearPicker
              onYearChange={year => {
                setValues({...values, year_last_expanded: parseInt(year)});
              }}
              selectedYear={values?.year_last_expanded}
              label={t('Year last expanded')}
            />
            {errors.year_last_expanded && touched.year_last_expanded && (
              <Text style={Styles.error2}>{errors.year_last_expanded}</Text>
            )}
            <CustomDropdown
              data={housing_dropdown?.type.map(item => {
                return {
                  label: item?.name?.[USER_PREFERRED_LANGUAGE],
                  value: item?._id,
                };
              })}
              value={values.type}
              label={t('Type')}
              onChange={value => {
                setValues({
                  ...values,
                  type: value?.value,
                });
              }}
            />
            {touched?.type && errors?.type && (
              <Text style={Styles.error2}>{String(errors?.type)}</Text>
            )}
          </>
        ) : null}
      </KeyboardAwareScrollView>
      <View style={Styles.bottomBtn}>
        <CustomButton
          btnText={t('next')}
          style={{width: '100%'}}
          onPress={handleSubmit}
        />
      </View>
    </View>
  );
};

export default HousingDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  subArea: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    // margin: 10,
    marginTop: '5%',
    width: width / 1.04,
    alignItems: 'center',
  },
  divider: {
    alignSelf: 'center',
    height: 1,
    width: '67%',
    color: 'grey',
  },
  uparrow: {
    height: 20,
    width: 20,
  },
  innerInputView: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'space-between',
    marginBottom: '5%',
    gap: 12,
    paddingHorizontal: 12,
  },
  divider2: {
    // backgroundColor: 'grey',
    alignSelf: 'flex-start',
    height: '100%',
    marginTop: 9,
    width: '1%',
    borderRadius: 10,
  },
});
