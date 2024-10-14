import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Styles} from '../../../styles/globalStyles';

const Water = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [modalViisble, setModalVisible] = useState(false);
  let HousingSchema = Yup.object().shape({
    yearly_water_consumption: Yup.number().required(
      'Yearly water consumption is required',
    ),
    sourced_from_each_of_the_purpose_above: Yup.string().required(
      'Sourced from each of the purpose above is required',
    ),
    expenditure_incured_if_any_for_each_of_the_source: Yup.string().required(
      'Expenditure incurred if any for each of the source is required',
    ),
    rainwater_harvesting_capacity: Yup.string().required(
      'Rainwater harvesting capacity is required',
    ),
    wastewater_disposal_methos: Yup.array().required(
      'Wastewater disposal method is required',
    ),
    water_sources_stock_condition_at_the_village_level: Yup.array().required(
      'Water sources stock condition at the village level is required',
    ),
    available_water_sources: Yup.array().required(
      'Available water sources is required',
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
      yearly_water_consumption: 0,
      sourced_from_each_of_the_purpose_above:'',
      expenditure_incured_if_any_for_each_of_the_source:'',
      rainwater_harvesting_capacity:'',
      wastewater_disposal_methos:[],
      water_sources_stock_condition_at_the_village_level:[],
      available_water_sources:[]
    },
    validationSchema: HousingSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
    },
  });
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Water;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
