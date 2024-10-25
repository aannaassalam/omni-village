import { StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import * as yup from 'yup';
import { useFormik } from 'formik';
import Customdropdown from '../../Components/CustomDropdown/CustomDropdown';
import { useTranslation } from 'react-i18next';
import Input from '../../Components/Inputs/Input';
import AcresElement from '../../Components/ui/AcresElement';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { Styles } from '../../styles/globalStyles';

const Demographic = ({ navigation }) => {
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {t} =useTranslation()
  const scheme = yup.object().shape({
    marital_status: yup.string().required('Marital status is required'),
    diet: yup.string().required('Diet is required'),
    height: yup.number().required('Height is required'),
    weight: yup.number().required('Weight is required'),
    language_speak: yup.string().required('Language speak is required'),
    language_read: yup.string().required('Language read is required'),
    language_write: yup.string().required('Language write is required'),
  });
  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    setFieldTouched,
    touched,
    resetForm,
    setValues
  } = useFormik({
    initialValues: {
      marital_status: '',
      diet: '',
      height: '',
      weight: '',
      language_speak: '',
      language_read: '',
      language_write: '',
    },
    // validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
      navigation.navigate('demographicOccupation',{
        demographic: {...values, height: parseInt(values?.height), weight: parseInt(values?.weight)}
      })
    },
  });
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Demographic'}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <Customdropdown
          data={[{ id: 1, label: 'Single', value: 'Single' }, { id: 1, label: 'Married', value: 'Married' }]}
          value={values.diet}
          label={t('marital status')}
          onChange={(value) => {
            setValues({
              ...values,
              diet: value?.value,
            });
          }}
        />
        {touched?.marital_status && errors?.marital_status && (
          <Text style={Styles.error2}>{String(errors?.marital_status)}</Text>
        )}
        <Customdropdown
          data={[{ id: 1, label: 'Single', value: 'Single' }, { id: 1, label: 'Married', value: 'Married' }]}
          value={values.diet}
          label={t('diet')}
          onChange={(value) => {
            setValues({
              ...values,
              diet: value?.value,
            });
          }}
        />
        {touched?.diet && errors?.diet && (
          <Text style={Styles.error2}>{String(errors?.diet)}</Text>
        )}
        <Input
        label={'Height'}
        value={values.height}
        placeholder={'0'}
        fullLength={true}
        onChange={handleChange('height')}
        isRight={<AcresElement title={'Unit'}/>}
        />
        {touched?.height && errors?.height && (
          <Text style={Styles.error2}>{String(errors?.height)}</Text>
        )}
        <Input
          label={'Weight'}
          value={values.weight}
          placeholder={'0'}
          fullLength={true}
          onChange={handleChange('weight')}
          isRight={<AcresElement title={'Unit'} />}
        />
        {touched?.weight && errors?.weight && (
          <Text style={Styles.error2}>{String(errors?.weight)}</Text>
        )}
        <Customdropdown
          data={[{ id: 1, label: 'Single', value: 'Single' }, { id: 1, label: 'Married', value: 'Married' }]}
          value={values.diet}
          label={'Which language can you speak?'}
          onChange={(value) => {
            setValues({
              ...values,
              language_speak: value?.value,
            });
          }}
        />
        {touched?.language_speak && errors?.language_speak && (
          <Text style={Styles.error2}>{String(errors?.language_speak)}</Text>
        )}
        <Customdropdown
          data={[{ id: 1, label: 'Single', value: 'Single' }, { id: 1, label: 'Married', value: 'Married' }]}
          value={values.diet}
          label={'Which language can you read?'}
          onChange={(value) => {
            setValues({
              ...values,
              language_read: value?.value,
            });
          }}
        />
        {touched?.language_read && errors?.language_read && (
          <Text style={Styles.error2}>{String(errors?.language_read)}</Text>
        )}
        <Customdropdown
          data={[{ id: 1, label: 'Single', value: 'Single' }, { id: 1, label: 'Married', value: 'Married' }]}
          value={values.diet}
          label={'Which language can you write?'}
          onChange={(value) => {
            setValues({
              ...values,
              language_write: value?.value,
            });
          }}
        />
        {touched?.language_write && errors?.language_write && (
          <Text style={Styles.error2}>{String(errors?.language_write)}</Text>
        )}
      </KeyboardAwareScrollView>
      <View style={Styles.bottomBtn}>
        <CustomButton btnText={'Next'} style={{width: '100%', height:60}} onPress={handleSubmit}/>
      </View>
    </View>
  );
};

export default Demographic;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
