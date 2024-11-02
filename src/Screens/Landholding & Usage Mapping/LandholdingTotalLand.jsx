import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import ItemHeader from '../../Components/CustomHeader/ItemHeader';
import { Styles, width } from '../../styles/globalStyles';
import Input from '../../Components/Inputs/Input';
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput';
import { Divider } from 'react-native-paper';
import CustomButton from '../../Components/CustomButton/CustomButton';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';

const LandholdingTotalLand = ({ navigation }) => {
  const { t } = useTranslation()
  const scheme = yup.object().shape({
    total_numbers_of_lands: yup
      .number()
      .required(t('Total number of lands owned is required'))
      .max(20, 'Total number of lands owned cannot be greater than 20!')
      .min(1, 'At least one total number of lands owned is required'),
      land_requirements: yup.boolean().required(t('Land requirements is required')),
    //  details_of_land: yup.array().of(
    //    yup.object().shape({
    //      land_located: yup.string().required('Land located is required'),
    //      total_land_area_owned: yup
    //        .number()
    //        .required('Total land area owned is required'),
    //      location: yup.string().required('Location is required'),
    //      area_utilised_for: yup
    //        .string()
    //        .required('Area utilised for is required'),
    //      total_land_area_utilised: yup
    //        .number()
    //        .required('Total land area utilised for is required'),
    //      area_under_utilised: yup
    //        .string()
    //        .required('Area under utilised is required'),
    //      total_land_area_under_utilised: yup
    //        .number()
    //        .required('Total area under utilised is required'),
    //      year_purchased: yup.number().required('Year purchased is required'),
    //    }),
    //  ),
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
      total_numbers_of_lands: '',
      land_requirements: false,
      //  details_of_land: [],
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      navigation.navigate('landSpecificationQuestioner', {
        total_numbers_of_lands: values.total_numbers_of_lands,
        land_requirements: values.land_requirements,
      })
    },
  });
  //  useEffect(() => {
  //    const totalLands = parseInt(values.total_numbers_of_lands || 0);
  //    const newDetailsOfLand = Array(totalLands)
  //      .fill()
  //      .map((_, index) => ({
  //        land_located: '',
  //        total_land_area_owned: '',
  //        location: '',
  //        area_utilised_for: '',
  //        total_land_area_utilised: '',
  //        area_under_utilised: '',
  //        total_land_area_under_utilised: '',
  //        year_purchased: '',
  //      }));

  //    setValues(prevValues => ({
  //      ...prevValues,
  //      details_of_land: newDetailsOfLand,
  //    }));
  //  }, [values.total_numbers_of_lands]);
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t('landholding')}
        goBack={() => navigation.goBack()}
      />
      <ItemHeader title={t('landholding')} />
      <View style={styles.mainContainer}>
        <Input
          label={t('Total number of lands owned')}
          value={values.total_numbers_of_lands}
          placeholder={''}
          fullLength={true}
          keyboardType='numeric'
          onChangeText={handleChange('total_numbers_of_lands')}
        />
        {touched?.total_numbers_of_lands && errors?.total_numbers_of_lands && (
          <Text style={Styles.error2}>{String(errors?.total_numbers_of_lands)}</Text>
        )}
        <SwitchButton
        nolabel={false}
        label={t('Do have any more land requirements?')}
        selected={values?.land_requirements}
        firstBtnPress={()=> setValues({...values, land_requirements: true})}
        secondBtnPress={()=> setValues({...values, land_requirements: false})}
        firstBtnText={t('yes')}
        secondBtntext={t('no')}
        />
        {touched?.land_requirements && errors?.land_requirements && (
          <Text style={Styles.error2}>{String(errors?.land_requirements)}</Text>
        )}
      </View>
      <View style={Styles.bottomBtn}>
        <CustomButton
          btnText={t('next')}
          style={{ width: '100%' }}
          onPress={handleSubmit}
        />
      </View>
    </View>
  )
}

export default LandholdingTotalLand

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    paddingHorizontal: 22,
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
});

// {
//   values.details_of_land.map((land, index) => {
//     return (
//       <>
//         <View style={[styles.subArea, { marginTop: '3%' }]}>
//           <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Details of land')}:{index + 1}</Text>
//           <Divider
//             bold={true}
//             style={[styles.divider, { width: '50%' }]}
//             horizontalInset={true}
//           />
//           <TouchableOpacity onPress={() => toggleCollapse(index)}>
//             <Image
//               source={collapsed[index] ?
//                 require('../../../assets/arrowUp.png') : require('../../../assets/arrowDown.png')}
//               style={styles.uparrow}
//             />
//           </TouchableOpacity>
//         </View>
//         {collapsed[index] ?
//           <>
//             <SwitchButton
//               firstBtnPress={() => { handleFieldChange(index, 'land_located', 'Inside village') }}
//               firstBtnText='Inside village'
//               secondBtnPress={() => { handleFieldChange(index, 'land_located', 'Outside village') }}
//               secondBtntext='Outside village'
//               label={`Where is Land : ${index + 1} located ?`}
//               selected={land?.land_located}
//             />
//             {errors.details_of_land && errors.details_of_land[index]?.land_located && (
//               <Text style={Styles.error2}>{errors.details_of_land[index].land_located}</Text>
//             )}
//             <Input
//               label={t('Kindly mention the total land area owned')}
//               value={land.total_land_area_owned}
//               placeholder={'0'}
//               fullLength={true}
//               keyboardType='numeric'
//               onChangeText={(text) => handleFieldChange(index, 'total_land_area_owned', parseInt(text))}
//               isRight={<AcresElement title={user?.land_measurement_symbol} />}
//             />
//             {errors.details_of_land && errors.details_of_land[index]?.total_land_area_owned && (
//               <Text style={Styles.error2}>{errors.details_of_land[index].total_land_area_owned}</Text>
//             )}
//             <MultiselectDropdown
//               containerStyle={{
//                 marginTop: '5%',
//                 paddingTop: 0,
//               }}
//               data={[]}
//               setSelectedd={(item) =>
//                 handleFieldChange(index, 'area_utilised_for', item)
//               }
//               selectedd={land?.area_utilised_for}
//               infoName={t('Area utilised for')}
//             />
//             {errors.details_of_land && errors.details_of_land[index]?.area_utilised_for && (
//               <Text style={Styles.error2}>{errors.details_of_land[index].area_utilised_for}</Text>
//             )}
//             <Input
//               label={t('Kindly mention the total land area utilised for')}
//               value={land.total_land_area_utilised}
//               placeholder={'0'}
//               fullLength={true}
//               keyboardType='numeric'
//               onChangeText={(text) => handleFieldChange(index, 'total_land_area_utilised', parseInt(text))}
//               isRight={<AcresElement title={user?.land_measurement_symbol} />}
//             />
//             {errors.details_of_land && errors.details_of_land[index]?.total_land_area_utilised && (
//               <Text style={Styles.error2}>{errors.details_of_land[index].total_land_area_utilised}</Text>
//             )}
//             <MultiselectDropdown
//               containerStyle={{
//                 marginTop: '5%',
//                 paddingTop: 0,
//               }}
//               data={[]}
//               setSelectedd={(item) =>
//                 handleFieldChange(index, 'area_under_utilised', item)
//               }
//               selectedd={land?.area_under_utilised}
//               infoName={t('Area under utilised')}
//             />
//             {errors.details_of_land && errors.details_of_land[index]?.area_under_utilised && (
//               <Text style={Styles.error2}>{errors.details_of_land[index].area_under_utilised}</Text>
//             )}
//             <Input
//               label={t('Kindly mention the total land area under utilised')}
//               value={land.total_land_area_under_utilised}
//               placeholder={'0'}
//               fullLength={true}
//               keyboardType='numeric'
//               onChangeText={(text) => handleFieldChange(index, 'total_land_area_under_utilised', parseInt(text))}
//               isRight={<AcresElement title={user?.land_measurement_symbol} />}
//             />
//             {errors.details_of_land && errors.details_of_land[index]?.total_land_area_under_utilised && (
//               <Text style={Styles.error2}>{errors.details_of_land[index].total_land_area_under_utilised}</Text>
//             )}
//             <YearPicker
//               onYearChange={(year) => {
//                 handleFieldChange(index, 'year_purchased', parseInt(year))
//               }}
//               selectedYear={land?.year_purchased}
//               label={'Kindly mention the year of land purchase'}
//             />
//             {errors.details_of_land && errors.details_of_land[index]?.year_purchased && (
//               <Text style={Styles.error2}>{errors.details_of_land[index].year_purchased}</Text>
//             )}
//           </>
//           : null
//         }
//       </>
//     )
//   })
// }