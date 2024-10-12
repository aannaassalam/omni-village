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
    land_utilised_for_main_family_housing: Yup.number().required(
      'Land utilised for main family housing is required',
    ),})
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
         land_utilised_for_main_family_housing: 0,
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