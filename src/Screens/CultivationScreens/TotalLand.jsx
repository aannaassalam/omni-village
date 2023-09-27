import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import Toast from 'react-native-toast-message';
import {Divider} from 'react-native-paper';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomInputField from '../../Components/CustomInputField/CustomInputField';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {validation} from '../../Validation/Validation';
import {useDispatch, useSelector} from 'react-redux';
import {LandAllocation} from '../../Redux/AuthSlice';
import {useFocusEffect} from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import '../../i18next';

const landSchema = yup
  .object()
  .shape({
    total_land: yup.string().required(validation?.error?.total_land),
    cultivation: yup.string().required(validation?.error?.cultivation),
    trees: yup.string().required(validation?.error?.trees),
    poultry: yup.string().required(validation?.error?.poultry),
    fishery: yup.string().required(validation?.error?.fishery),
    storage: yup.string().required(validation?.error?.storage),
  })
  .required();

const TotalLand = ({navigation}) => {
  const {userDetails} = useSelector(s => s.auth);
  const { t } = useTranslation();
  const [globalError, setGlobalError] = useState('');

  // console.log(userDetails.sub_area);
  useFocusEffect(
    useCallback(() => {
      setGlobalError('');
    }, []),
  );

  const {
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(landSchema),
    defaultValues: {
      total_land: String(userDetails?.total_land || ''),
      cultivation: String(userDetails?.sub_area.cultivation.land || ''),
      trees: String(userDetails?.sub_area.trees || ''),
      poultry: String(userDetails?.sub_area.poultry || ''),
      fishery: String(userDetails?.sub_area.fishery || ''),
      storage: String(userDetails?.sub_area.storage || ''),
    },
  });

  const dispatch = useDispatch();

  const onSave = data => {
    let sumofAreas = Object.keys(data).reduce((accumulator, currentObject) => {
      if (currentObject !== 'total_land') {
        return accumulator + parseInt(data[currentObject]);
      }
      return accumulator;
    }, 0);
    if (sumofAreas > parseInt(data?.total_land)) {
      setGlobalError(t('Your sub area acres are greater than total land area'));
      // Toast.show({
      //   type: 'error',
      //   text1: 'Error',
      //   text2: 'Your sub area acres are greater than total land area',
      // });
    } else {
      dispatch(LandAllocation(data))
        .unwrap()
        .then(() => {
          navigation.replace('production');
        })
        .catch(err => console.log(err));
    }
  };
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  return (
    <ScrollView style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t('total land')}
        goBack={() => navigation.goBack()}
      />
      <View style={styles.textInputArea}>
        {/* <CustomInputField
          label={'Total Land area'}
          value={totalLand}
          onChangeText={e => setTotalLand(e)}
        /> */}
        <Controller
          control={control}
          name="total_land"
          render={({field: {onChange, onBlur, value, name, ref}}) => (
            <CustomInputField
              placeholder={'0'}
              label={t('total land area')}
              onChangeText={onChange}
              value={value}
              productionName={t('total land area')}
            />
          )}
        />
        {errors?.total_land?.message ? (
          <Text style={styles.error}>{errors?.total_land?.message}</Text>
        ) : null}
      </View>
      <ScrollView>
        <>
          <View style={styles.subArea}>
            <Text style={styles.subAreaText}>{t('sub area')}</Text>
            <Divider
              bold={true}
              style={styles.divider}
              horizontalInset={true}
            />
          </View>
          <View style={styles.textInputArea}>
            <Controller
              control={control}
              name="cultivation"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputWithoutBorder
                  placeholder={'0'}
                  onChangeText={onChange}
                  value={value}
                  productionName={t('cultivation')}
                />
              )}
            />
            {errors?.cultivation?.message ? (
              <Text style={styles.error}>{errors?.cultivation?.message}</Text>
            ) : null}
          </View>
          <View style={styles.textInputArea}>
            <Controller
              control={control}
              name="trees"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputWithoutBorder
                  placeholder={'0'}
                  onChangeText={onChange}
                  value={value}
                  productionName={t('trees')}
                />
              )}
            />
            {errors?.trees?.message ? (
              <Text style={styles.error}>{errors?.trees?.message}</Text>
            ) : null}
          </View>
          <View style={styles.textInputArea}>
            <Controller
              control={control}
              name="poultry"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputWithoutBorder
                  placeholder={'0'}
                  onChangeText={onChange}
                  value={value}
                  productionName={t('poultry')}
                />
              )}
            />
            {errors?.poultry?.message ? (
              <Text style={styles.error}>{errors?.poultry?.message}</Text>
            ) : null}
          </View>

          <View style={styles.textInputArea}>
            <Controller
              control={control}
              name="fishery"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputWithoutBorder
                  placeholder={'0'}
                  onChangeText={onChange}
                  value={value}
                  productionName={t('fishery')}
                />
              )}
            />
            {errors?.fishery?.message ? (
              <Text style={styles.error}>{errors?.fishery?.message}</Text>
            ) : null}
          </View>

          <View style={styles.textInputArea}>
            <Controller
              control={control}
              name="storage"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputWithoutBorder
                  placeholder={'0'}
                  onChangeText={onChange}
                  value={value}
                  productionName={t('storage')}
                />
              )}
            />
            {errors?.storage?.message ? (
              <Text style={styles.error}>{errors?.storage?.message}</Text>
            ) : null}
          </View>
          <Text
            style={{
              fontFamily: 'ubuntu_regular',
              fontSize: 14 / fontScale,
              marginTop: 5,
              color: '#ff000e',
              marginLeft: 20,
            }}>
            {globalError}
          </Text>

          {/* <InputWithoutBorder
                  productionName={item?.name}
                  placeholder={'0'}
                  value={item?.area}
                  onChangeText={e => {
                    let targetedArea = land.findIndex(
                      lan => lan?.name == item?.name,
                    );
                    if (targetedArea !== -1) {
                      const updatedDataArray = [...land];
                      updatedDataArray[targetedArea].area = parseInt(e);
                      setLand(updatedDataArray);
                    }
                  }}
                /> */}

          <View style={styles.save}>
            <CustomButton btnText={t('save')} onPress={handleSubmit(onSave)} />
          </View>
        </>
      </ScrollView>
      <Toast
        positionValue={30}
        style={{height: 'auto', minHeight: 70}}
        width={300}
      />
    </ScrollView>
  );
};

export default TotalLand;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      // paddingBottom: 20,
    },
    textInputArea: {
      alignSelf: 'center',
      width: '95%',
    },
    subArea: {
      alignSelf: 'flex-start',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 13,
      margin: 10,
      marginTop: '5%',
    },
    divider: {
      alignSelf: 'center',
      height: 1,
      width: '74%',
      margin: 5,
      color: 'grey',
    },
    subAreaText: {
      alignSelf: 'center',
      fontSize: 14 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu_medium',
    },
    save: {
      marginTop: '5%',
      width: '90%',
      alignSelf: 'center',
      marginBottom: 20,
    },
    error: {
      fontFamily: 'ubuntu_regular',
      fontSize: 14 / fontScale,
      marginTop: 5,
      color: '#ff000e',
      marginLeft: 5,
    },
  });
