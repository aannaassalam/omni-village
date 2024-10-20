import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Styles, width} from '../../../../styles/globalStyles';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Input from '../../../../Components/Inputs/Input';
import {KeyboardAvoidingView} from 'react-native';
import {Divider} from 'react-native-paper';
import {dark_grey, white} from '../../../../styles/colors';
import CustomButton from '../../../../Components/CustomButton/CustomButton';
import AcresElement from '../../../../Components/ui/AcresElement';
import { useMutation } from '@tanstack/react-query';
import { add_total_land } from '../../../../apis/food';
import { useDispatch, useSelector } from 'react-redux';
import EncryptedStorage from 'react-native-encrypted-storage';
import { reqSuccess } from '../../../../redux/auth/actions';
import { get_user_details } from '../../../../apis/auth';
import { useTranslation } from 'react-i18next';
import '../../../../i18next'

const TotalLand = ({navigation}:{navigation:any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [isFocused, setIsFocused] = useState(false);
  const [loading,setLoading] = useState(false);
  const authState= useSelector((state)=>state.authState)
  const dispatch = useDispatch()
  const {t} = useTranslation()
  const {mutate: addLand} = useMutation({
    mutationFn: (data: any) => add_total_land(data),
    onSuccess: async(data) => {
      setLoading(false);
      await get_user_details().then(async profile => {
        console.log('profileee', profile);
        const userData = JSON.stringify({
          token: null,
          id: profile?._id,
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          email: profile?.email,
          phone: profile?.phone,
          gender: profile?.gender,
          address: profile?.address,
          country: profile?.country,
          country_code: profile?.country_code,
          currency: profile?.currency,
          document_type: profile?.document_type,
          social_security_number: profile?.social_security_number,
          village_name: profile?.village_name,
          village_governing_body: profile?.village_governing_body,
          street_address: profile?.street_address,
          land_measurement: profile?.land_measurement,
          land_measurement_symbol: profile?.land_measurement_symbol,
          members: profile?.members,
          number_of_members: profile?.number_of_members,
          total_land: profile?.total_land,
          sub_area: profile?.sub_area,
        });
        await EncryptedStorage.setItem('omniVillageToken', userData);
        dispatch(
          reqSuccess(
            null,
            profile?._id,
            profile?.first_name,
            profile?.last_name,
            profile?.email,
            profile?.phone,
            profile?.gender,
            profile?.address,
            profile?.country,
            profile?.country_code,
            profile?.currency,
            profile?.document_type,
            profile?.social_security_number,
            profile?.village_name,
            profile?.village_governing_body,
            profile?.street_address,
            profile?.land_measurement,
            profile?.land_measurement_symbol,
            profile?.members,
            profile?.number_of_members,
            profile?.total_land,
            profile?.sub_area,
          ),
        );
      });
      navigation.navigate('production');

    },
    onError: error => {
      console.log("errorrrrrr", error)
      setLoading(false);
    },
  });
  let land_schema = Yup.object()
    .shape({
      total_land: Yup.number()
        .required(t('total_land is required'))
        .min(1, 'Total land must be greater than zero'),
      cultivation: Yup.number().required(t('cultivation is required')),
      trees: Yup.number().required(t('trees is required')),
      poultry: Yup.number().required(t('poultry is required')),
      fishery: Yup.number().required(t('fishery is required')),
      storage: Yup.number().required(t('storage is required')),
    })
    .test(
      'land-limit',
      'Sum of Cultivation,Poultry, Fishery, Trees, Shrubs & Grassland, and Storage should not exceed Total land',
      function (values) {
        const {total_land, cultivation, poultry, fishery, trees, storage} =
          values;

        const totalAllocatedLand =
          cultivation + poultry + fishery + trees + storage;

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
      total_land: '',
      cultivation: '',
      poultry: '',
      fishery: '',
      trees: '',
      storage: '',
    },
    validationSchema: land_schema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      setLoading(true);
      let val = {
        total_land: parseInt(values?.total_land),
        cultivation: parseInt(values?.cultivation),
        trees: parseInt(values?.trees),
        poultry: parseInt(values?.poultry),
        fishery: parseInt(values?.fishery),
        storage: parseInt(values?.storage),
      };
      addLand(val);
    },
  });
  useEffect(() => {
    resetForm({
      values: {
        total_land: authState?.total_land,
        cultivation: authState?.sub_area?.cultivation,
        poultry: authState?.sub_area?.poultry,
        fishery: authState?.sub_area?.fishery,
        trees: authState?.sub_area?.trees,
        storage: authState?.sub_area?.storage,
      },
    });
  }, [authState?.sub_area, authState?.total_land]);
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'android' ? 'height' : 'position'}
        keyboardVerticalOffset={120}>
        <ScrollView contentContainerStyle={{paddingBottom: 120}}>
          <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('total_land')}
              value={String(values?.total_land)}
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              label={t('total_land')}
              keyboardType="numeric"
              onBlur={() => setIsFocused(false)}
              isRight={
                <AcresElement title={authState?.land_measurement_symbol} />
              }
            />
            {touched?.total_land && errors?.total_land && (
              <Text style={Styles.error}>{String(errors?.total_land)}</Text>
            )}
            <View style={{flexDirection: 'row', gap: 8, alignItems: 'center'}}>
              <Text style={[Styles.fieldLabel, {color: dark_grey}]}>
                {t('sub area')}
              </Text>
              <View
                style={[Styles.horizontalLine, {width: '84%', marginTop: 16}]}
              />
            </View>
            <Input
              onChangeText={handleChange('cultivation')}
              value={String(values?.cultivation)}
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
              label={t('cultivation')}
              isRight={
                <AcresElement title={authState?.land_measurement_symbol} />
              }
            />
            {touched?.cultivation && errors?.cultivation && (
              <Text style={Styles.error}>{String(errors?.cultivation)}</Text>
            )}
            <Input
              onChangeText={handleChange('trees')}
              value={String(values?.trees)}
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
              label={t('tree shrub grassland')}
              isRight={
                <AcresElement title={authState?.land_measurement_symbol} />
              }
            />
            {touched?.trees && errors?.trees && (
              <Text style={Styles.error}>{String(errors?.trees)}</Text>
            )}
            <Input
              onChangeText={handleChange('poultry')}
              value={String(values?.poultry)}
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
              label={t('poultry')}
              isRight={
                <AcresElement title={authState?.land_measurement_symbol} />
              }
            />
            {touched?.poultry && errors?.poultry && (
              <Text style={Styles.error}>{String(errors?.poultry)}</Text>
            )}
            <Input
              onChangeText={handleChange('fishery')}
              value={String(values?.fishery)}
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              keyboardType="numeric"
              label={t('fishery')}
              isRight={
                <AcresElement title={authState?.land_measurement_symbol} />
              }
            />
            {touched?.fishery && errors?.fishery && (
              <Text style={Styles.error}>{String(errors?.fishery)}</Text>
            )}
            <Input
              onChangeText={handleChange('storage')}
              value={String(values?.storage)}
              fullLength={true}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              label={t('storage')}
              keyboardType="numeric"
              isRight={
                <AcresElement title={authState?.land_measurement_symbol} />
              }
            />
            {touched?.storage && errors?.storage && (
              <Text style={Styles.error}>{String(errors?.storage)}</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <CustomButton
          onPress={handleSubmit}
          btnText={t('submit')}
          loading={loading}
        />
      </View>
    </View>
  );
};

export default TotalLand;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:white
    },
  });
