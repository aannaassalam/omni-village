import { KeyboardAvoidingView, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import {useFormik} from 'formik';
import * as Yup from 'yup';
import { Styles } from '../../../styles/globalStyles';

const Energy = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [modalViisble, setModalVisible] = useState(false);
    let HousingSchema = Yup.object().shape({
      connected_to_electric_grid: Yup.boolean().required(
        'Connected to electric grid is required',
      ),
      yearly_household_electricity_consumption: Yup.number().required(
        'Yearly household electricity consumption is required',
      ),
      yearly_expenditure_on_the_electricity: Yup.number().required(
        'Yearly expenditure on the electricity is required',
      ),
      yearly_consumption_of_petrol: Yup.number().required(
        'Yearly consumption of petrol is required',
      ),
      yearly_expenditure_of_petrol: Yup.number().required(
        'Yearly expenditure of petrol is required',
      ),
      yearly_consumption_of_diesel: Yup.number().required(
        'Yearly consumption of diesel is required',
      ),
      yearly_expenditure_of_diesel: Yup.number().required(
        'Yearly expenditure of diesel is required',
      ),
      yearly_consumption_of_natural_gas_for_cooking: Yup.number().required(
        'Yearly consumption of natural gas for cooking is required',
      ),
      yearly_expenditure_of_natural_gas_for_cooking: Yup.number().required(
        'Yearly expenditure of natural gas for cooking is required',
      ),
      others_sources_of_fuels_used: Yup.array().min(1,'Atleast one other source of fuels used is required').required(
        'Others sources of fuels used is required',
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
         connected_to_electric_grid: false,
         yearly_household_electricity_consumption: 0,
         yearly_expenditure_on_the_electricity: 0,
         yearly_consumption_of_petrol: 0,
         yearly_expenditure_of_petrol:0,
         yearly_consumption_of_diesel: 0,
         yearly_expenditure_of_diesel: 0,
         yearly_consumption_of_natural_gas_for_cooking: 0,
         yearly_expenditure_of_natural_gas_for_cooking: 0,
         others_sources_of_fuels_used:[],
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
          <View style={Styles.mainContainer}>
            </View>
            </ScrollView>
            </KeyboardAvoidingView>
    </View>
  )
}

export default Energy

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });