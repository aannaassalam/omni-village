import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Styles, width } from '../../styles/globalStyles'
import { Divider } from 'react-native-paper'
import * as yup from 'yup';
import { useFormik } from 'formik';
import Input from '../../Components/Inputs/Input'
import AcresElement from '../../Components/ui/AcresElement'
import { useUser } from '../../Hooks/useUser'
import YearPicker from '../../Components/YearPicker/YearPicker'
import CustomButton from '../../Components/CustomButton/CustomButton'
const FarmhouseDetails = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const { house } = route.params
  const [houseDetails, setHouseDetails] = useState(true)
  const scheme = yup.object().shape({
    land_utilised_for_family_farmhouse: yup
      .number()
      .required(t('Land utilised for family housing is required')),
    no_of_units_built_farmhouse: yup.number().required(t('No of units built is required')),
    total_built_area_farmhouse: yup.number().required(t('Total built area is required')),
    no_of_floors_farmhouse: yup.number().required(t('No of floors is required')),
    living_area_farmhouse: yup.number().required(t('Living area is required')),
    year_built_farmhouse: yup.number().required(t('Year built is required')),
    year_renovated_farmhouse: yup.number().required(t('Year renovated is required')),
    year_last_expanded_farmhouse: yup.number().required(t('Year last expanded is required')),
    type_farmhouse: yup.string().required(t('Type is required')),
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
      land_utilised_for_family_farmhouse: '',
      no_of_units_built_farmhouse: '',
      total_built_area_farmhouse: '',
      no_of_floors_farmhouse: '',
      living_area_farmhouse: '',
      year_built_farmhouse: '',
      year_renovated_farmhouse: '',
      year_last_expanded_farmhouse: '',
      type_farmhouse: ''
    },
    // validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      navigation.navigate('farmhousePhoto', { housingData: values, house })
    },
  });
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={`${t('housing')} (${house})`}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <View style={styles.subArea}>
          <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Farmhouse Details')}</Text>
          <Divider
            bold={true}
            style={[styles.divider, { width: '55%' }]}
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
        {houseDetails ?
          <>
            <Input
              label={t('Land utilised for farmhouse')}
              value={values.land_utilised_for_family_farmhouse}
              placeholder={'0'}
              fullLength={true}
              keyboardType='numeric'
              onChangeText={handleChange('land_utilised_for_family_farmhouse')}
              isRight={<AcresElement title={user?.land_measurement_symbol} />}
            />
            {touched?.land_utilised_for_family_farmhouse && errors?.land_utilised_for_family_farmhouse && (
              <Text style={Styles.error2}>{String(errors?.land_utilised_for_family_farmhouse)}</Text>
            )}
            <View style={styles.innerInputView}>
              <Divider style={styles.divider2} />
              <View style={{ width: '100%' }}>
                <Input
                  label={t('Number of units built')}
                  value={values.no_of_units_built_farmhouse}
                  placeholder={'0'}
                  fullLength={true}
                  keyboardType='numeric'
                  onChangeText={handleChange('no_of_units_built_farmhouse')}
                  isRight={<AcresElement title={user?.land_measurement_symbol} />}
                />
                {touched?.no_of_units_built_farmhouse && errors?.no_of_units_built_farmhouse && (
                  <Text style={Styles.error2}>{String(errors?.no_of_units_built_farmhouse)}</Text>
                )}
                <Input
                  label={t('Total Built Up Area')}
                  value={values.total_built_area_farmhouse}
                  placeholder={'0'}
                  fullLength={true}
                  keyboardType='numeric'
                  onChangeText={handleChange('total_built_area')}
                  isRight={<AcresElement title={user?.land_measurement_symbol} />}
                />
                {touched?.total_built_area_farmhouse && errors?.total_built_area_farmhouse && (
                  <Text style={Styles.error2}>{String(errors?.total_built_area_farmhouse)}</Text>
                )}
                <Input
                  label={t('No. of floors')}
                  value={values.no_of_floors}
                  placeholder={'0'}
                  fullLength={true}
                  keyboardType='numeric'
                  onChangeText={handleChange('no_of_floors_farmhouse')}
                />
                {touched?.no_of_floors_farmhouse && errors?.no_of_floors_farmhouse && (
                  <Text style={Styles.error2}>{String(errors?.no_of_floors_farmhouse)}</Text>
                )}
                <Input
                  label={t('Living area')}
                  value={values.living_area_farmhouse}
                  placeholder={'0'}
                  fullLength={true}
                  keyboardType='numeric'
                  onChangeText={handleChange('living_area_farmhouse')}
                />
                {touched?.living_area_farmhouse && errors?.living_area_farmhouse && (
                  <Text style={Styles.error2}>{String(errors?.living_area_farmhouse)}</Text>
                )}
                <YearPicker
                  onYearChange={(year) => {
                    setValues({ ...values, year_built_farmhouse: parseInt(year) })
                  }}
                  selectedYear={values?.year_built_farmhouse}
                  label={t('Year built')}
                />
                {errors.year_built_farmhouse && errors.year_built_farmhouse && (
                  <Text style={Styles.error2}>{errors.year_built_farmhouse}</Text>
                )}
                <YearPicker
                  onYearChange={(year) => {
                    setValues({ ...values, year_renovated_farmhouse: parseInt(year) })
                  }}
                  selectedYear={values?.year_renovated_farmhouse}
                  label={t('Year last renovated')}
                />
                {errors.year_renovated_farmhouse && errors.year_renovated_farmhouse && (
                  <Text style={Styles.error2}>{errors.year_renovated_farmhouse}</Text>
                )}
                <YearPicker
                  onYearChange={(year) => {
                    setValues({ ...values, year_last_expanded_farmhouse: parseInt(year) })
                  }}
                  selectedYear={values?.year_last_expanded_farmhouse}
                  label={t('Year last expanded')}
                />
                {errors.year_last_expanded_farmhouse && errors.year_last_expanded_farmhouse && (
                  <Text style={Styles.error2}>{errors.year_last_expanded_farmhouse}</Text>
                )}
              </View>
            </View>
          </>
          : null
        }
      </KeyboardAwareScrollView>
      <View style={Styles.bottomBtn}>
        <CustomButton
          btnText={'Next'}
          style={{ width: '100%', }}
          onPress={handleSubmit}
        />
      </View>
    </View>
  )
}

export default FarmhouseDetails

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
    paddingHorizontal: 12
  },
  divider2: {
    // backgroundColor: 'grey',
    alignSelf: 'flex-start',
    height: '100%',
    marginTop: 9,
    width: '1%',
    borderRadius: 10,
  },
})