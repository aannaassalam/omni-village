import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Styles, width} from '../../../styles/globalStyles';
import AlertModal from '../../../Components/Popups/AlertModal';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Customdropdown from '../../../Components/CustomDropdown/Customdropdown';
import Input from '../../../Components/Inputs/Input';

const Housing = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [modalViisble, setModalVisible] = useState(false);
  let landholdSchema = Yup.object().shape({
    marital_status: Yup.string().required('Marital status is required'),
    diet: Yup.string().required('Diet is required'),
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
      marital_status: '',
    },
    validationSchema: landholdSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      setModalVisible(true);
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

export default Housing;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
