import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {Styles, width} from '../../../styles/globalStyles';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Input from '../../../Components/Inputs/Input';
import {KeyboardAvoidingView} from 'react-native';
import {Divider} from 'react-native-paper';
import {dark_grey} from '../../../styles/colors';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import AcresElement from '../../../Components/ui/AcresElement';

const TotalLand = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [isFocused, setIsFocused] = useState(false);
  let land_schema = Yup.object()
    .shape({
      total_land: Yup.number()
        .required('Total land is required')
        .min(1, 'Total land must be greater than zero')
        .typeError('Total land must be a number'),
      cultivation: Yup.number()
        .required('Cultivation is required')
        .typeError('Cultivation must be a number'),
      trees_shrubs_grassland: Yup.number()
        .required('Trees,shrubs & Grassland is required')
        .typeError('Trees,shrubs & Grassland must be a number'),
      poultry: Yup.number()
        .required('Poultry is required')
        .typeError('Poultry must be a number'),
      fishery: Yup.number()
        .required('Fishery is required')
        .typeError('Fishery must be a number'),
      storage: Yup.number()
        .required('Storage is required')
        .typeError('Storage must be a number'),
    })
    .test(
      'land-limit',
      'Sum of Cultivation,Poultry, Fishery, Trees, Shrubs & Grassland, and Storage should not exceed Total land',
      function (values) {
        const {
          total_land,
          cultivation,
          poultry,
          fishery,
          trees_shrubs_grassland,
          storage,
        } = values;

        const totalAllocatedLand =
          cultivation + poultry + fishery + trees_shrubs_grassland + storage;

        // Validate that the total allocated land does not exceed total land
        if (totalAllocatedLand > total_land) {
          return this.createError({
            path: 'total_land',
            message: `The total allocated land (${totalAllocatedLand}) exceeds the available total land (${total_land})`,
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
      total_land: 0,
      cultivation: 0,
      poultry: 0,
      fishery: 0,
      trees_shrubs_grassland: 0,
      storage: 0,
    },
    validationSchema: land_schema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
    },
  });
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'android' ? 'height' : 'position'}
        keyboardVerticalOffset={80}>
        <ScrollView>
          <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('total_land')}
              value={String(values?.total_land)}
              placeholder="Enter total land"
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              label={'Total land'}
              keyboardType="numeric"
              onBlur={() => setIsFocused(false)}
              isRight={<AcresElement title={'acres'} />}
            />
            {touched?.total_land && errors?.total_land && (
              <Text style={Styles.error}>{String(errors?.total_land)}</Text>
            )}
            <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
              <Text style={[Styles.fieldLabel, {color: dark_grey}]}>
                Sub area
              </Text>
              <View
                style={[Styles.horizontalLine, {width: '84%', marginTop: 16}]}
              />
            </View>
            <Input
              onChangeText={handleChange('cultivation')}
              value={String(values?.cultivation)}
              placeholder="Enter cultivation"
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
              label={'Cultivation'}
              isRight={<AcresElement title={'acres'} />}
            />
            {touched?.cultivation && errors?.cultivation && (
              <Text style={Styles.error}>{String(errors?.cultivation)}</Text>
            )}
            <Input
              onChangeText={handleChange('trees_shrubs_grassland')}
              value={String(values?.trees_shrubs_grassland)}
              placeholder="Enter trees,shrubs&grassland"
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
              label={'Trees,shrubs & grassland'}
              isRight={<AcresElement title={'acres'} />}
            />
            {touched?.trees_shrubs_grassland &&
              errors?.trees_shrubs_grassland && (
                <Text style={Styles.error}>
                  {String(errors?.trees_shrubs_grassland)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('poultry')}
              value={String(values?.poultry)}
              placeholder="Enter poultry"
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
              label={'Poultry'}
              isRight={<AcresElement title={'acres'} />}
            />
            {touched?.poultry && errors?.poultry && (
              <Text style={Styles.error}>{String(errors?.poultry)}</Text>
            )}
            <Input
              onChangeText={handleChange('fishery')}
              value={String(values?.fishery)}
              placeholder="Enter fishery"
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
              label={'Fishery'}
              isRight={<AcresElement title={'acres'} />}
            />
            {touched?.fishery && errors?.fishery && (
              <Text style={Styles.error}>{String(errors?.fishery)}</Text>
            )}
            <Input
              onChangeText={handleChange('storage')}
              value={String(values?.storage)}
              placeholder="Enter storage"
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              label={'Storage'}
              keyboardType="numeric"
              isRight={<AcresElement title={'acres'} />}
            />
            {touched?.storage && errors?.storage && (
              <Text style={Styles.error}>{String(errors?.storage)}</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <CustomButton onPress={handleSubmit} btnText={'Submit'} />
      </View>
    </View>
  );
};

export default TotalLand;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });
