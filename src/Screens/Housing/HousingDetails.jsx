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
const HousingDetails = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { data: user } = useUser()
  const { house } = route.params
  const [houseDetails, setHouseDetails] = useState(true)
  const scheme = yup.object().shape({
    land_utilised_for_family_housing: yup
      .number()
      .required(t('Land utilised for family housing is required')),
    no_of_units_built: yup.number().required(t('No of units built is required')),
    total_built_area: yup.number().required(t('Total built area is required')),
    no_of_floors: yup.number().required(t('No of floors is required')),
    living_area: yup.number().required(t('Living area is required')),
    year_built: yup.number().required(t('Year built is required')),
    year_renovated: yup.number().required(t('Year renovated is required')),
    year_last_expanded: yup.number().required(t('Year last expanded is required')),
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
      land_utilised_for_family_housing: '',
      no_of_units_built: '',
      total_built_area: '',
      no_of_floors: '',
      living_area: '',
      year_built: '',
      year_renovated: '',
      year_last_expanded: '',
      type: ''
    },
    // validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      navigation.navigate('housingPhoto', {housingData: values, house})
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
          <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('House Details')}</Text>
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
              label={t('Land utilised for main family housing')}
              value={values.land_utilised_for_family_housing}
              placeholder={'0'}
              fullLength={true}
              keyboardType='numeric'
              onChangeText={handleChange('land_utilised_for_family_housing')}
              isRight={<AcresElement title={user?.land_measurement_symbol} />}
            />
            {touched?.land_utilised_for_family_housing && errors?.land_utilised_for_family_housing && (
              <Text style={Styles.error2}>{String(errors?.land_utilised_for_family_housing)}</Text>
            )}
            <View style={styles.innerInputView}>
              <Divider style={styles.divider2} />
              <View style={{ width: '100%' }}>
                <Input
                  label={t('Number of units built')}
                  value={values.no_of_units_built}
                  placeholder={'0'}
                  fullLength={true}
                  keyboardType='numeric'
                  onChangeText={handleChange('no_of_units_built')}
                  isRight={<AcresElement title={user?.land_measurement_symbol} />}
                />
                {touched?.no_of_units_built && errors?.no_of_units_built && (
                  <Text style={Styles.error2}>{String(errors?.no_of_units_built)}</Text>
                )}
                <Input
                  label={t('Total Built Up Area')}
                  value={values.total_built_area}
                  placeholder={'0'}
                  fullLength={true}
                  keyboardType='numeric'
                  onChangeText={handleChange('total_built_area')}
                  isRight={<AcresElement title={user?.land_measurement_symbol} />}
                />
                {touched?.total_built_area && errors?.total_built_area && (
                  <Text style={Styles.error2}>{String(errors?.total_built_area)}</Text>
                )}
                <Input
                  label={t('No. of floors')}
                  value={values.no_of_floors}
                  placeholder={'0'}
                  fullLength={true}
                  keyboardType='numeric'
                  onChangeText={handleChange('no_of_floors')}
                />
                {touched?.no_of_floors && errors?.no_of_floors && (
                  <Text style={Styles.error2}>{String(errors?.no_of_floors)}</Text>
                )}
                <Input
                  label={t('Living area')}
                  value={values.living_area}
                  placeholder={'0'}
                  fullLength={true}
                  keyboardType='numeric'
                  onChangeText={handleChange('living_area')}
                />
                {touched?.living_area && errors?.living_area && (
                  <Text style={Styles.error2}>{String(errors?.living_area)}</Text>
                )}
                <YearPicker
                  onYearChange={(year) => {
                    setValues({ ...values, year_built: parseInt(year) })
                  }}
                  selectedYear={values?.year_built}
                  label={t('Year built')}
                />
                {errors.year_built && errors.year_built && (
                  <Text style={Styles.error2}>{errors.year_built}</Text>
                )}
                <YearPicker
                  onYearChange={(year) => {
                    setValues({ ...values, year_renovated: parseInt(year) })
                  }}
                  selectedYear={values?.year_renovated}
                  label={t('Year last renovated')}
                />
                {errors.year_renovated && errors.year_renovated && (
                  <Text style={Styles.error2}>{errors.year_renovated}</Text>
                )}
                <YearPicker
                  onYearChange={(year) => {
                    setValues({ ...values, year_last_expanded: parseInt(year) })
                  }}
                  selectedYear={values?.year_last_expanded}
                  label={t('Year last expanded')}
                />
                {errors.year_last_expanded && errors.year_last_expanded && (
                  <Text style={Styles.error2}>{errors.year_last_expanded}</Text>
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

export default HousingDetails

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