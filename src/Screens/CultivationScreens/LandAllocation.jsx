import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import CustomButton from '../../Components/CustomButton/CustomButton';
import * as yup from 'yup';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {useDispatch} from 'react-redux';
import {cultivationLandAllocation, getUser} from '../../Redux/AuthSlice';
import Toast, {BaseToast} from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';
import '../../i18next';

const LandAllocation = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {t} = useTranslation();
  const {totalLand} = 20;
  const [cultivation, setCultivation] = useState([
    {name: t('cultivated once in a year'), area: 0},
    {name: t('Cultivated twice in a year'), area: 0},
    {name: t('Cultivated thrice in a year'), area: 0},
  ]);

  const [globalError, setGlobalError] = useState('');

  const dispatch = useDispatch();

  yup.addMethod(yup.object, 'atLeastOneOf', function (list) {
    return this.test({
      name: 'Validation Error',
      message: 'Atleast one the field is required!',
      exclusive: true,
      params: {keys: list.join(', ')},
      test: value => list.some(f => value[f] !== '0' && value[f] !== ''),
    });
  });

  const schema = yup
    .object()
    .shape({
      once: yup.mixed(),
      twice: yup.mixed(),
      thrice: yup.mixed(),
    })
    .atLeastOneOf(['once', 'twice', 'thrice']);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      once: '0',
      twice: '0',
      thrice: '0',
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setGlobalError(errors[''].message);
    }
  }, [errors]);

  const onSave = async data => {
    try {
      await schema.validate(data);
      dispatch(cultivationLandAllocation(data))
        .unwrap()
        .then(() => {
          dispatch(getUser())
            .unwrap()
            .then(() => {
              navigation.replace('cultivationDashboard');
            })
            .catch(err => console.log(err));
        })
        .catch(err => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong, Try again later!',
          });
          console.log(err);
        });
    } catch (err) {
      console.log(err, 'err');
    }
    // console.log(errors);
    // let sumofAreas = cultivation.reduce((accumulator, currentObject) => {
    //   return accumulator + currentObject?.area;
    // }, 0);
    // if (sumofAreas > totalLand) {
    //   alert('Your  cultivation area acres are greater than total land area');
    // } else {
    //   console.log('go ahead');
    //   // navigation.navigate('cultivationDashboard', {totalLand: totalLand});
    // }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <CustomHeader
          backIcon={true}
          headerName={t('land allocation')}
          goBack={() => navigation.goBack()}
        />
        <View style={styles.textInputArea}>
          {/* {cultivation.map((item, indx) => {
            return (
              
            );
          })} */}
          <Controller
            control={control}
            name="once"
            render={({field: {onChange, onBlur, value, name, ref}}) => (
              <InputWithoutBorder
                productionName={t('cultivated once in a year')}
                // placeholder={'0'}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="twice"
            render={({field: {onChange, onBlur, value, name, ref}}) => (
              <InputWithoutBorder
                productionName={t('cultivated twice in a year')}
                // placeholder={'0'}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Controller
            control={control}
            name="thrice"
            render={({field: {onChange, onBlur, value, name, ref}}) => (
              <InputWithoutBorder
                productionName={t('cultivated thrice in a year')}
                // placeholder={'0'}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          <Text style={styles.error}>{globalError}</Text>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.save}>
        <CustomButton btnText={'Save'} onPress={handleSubmit(onSave)} />
      </View>
      <Toast
        positionValue={30}
        style={{height: 'auto', minHeight: 70}}
        width={300}
      />
    </View>
  );
};

export default LandAllocation;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    textInputArea: {
      alignSelf: 'center',
      width: '95%',
    },
    save: {
      marginTop: '5%',
      width: '90%',
      position: 'absolute',
      bottom: 10,
      alignSelf: 'center',
    },
    error: {
      fontFamily: 'ubuntu-regular',
      fontSize: 14 / fontScale,
      marginTop: 5,
      color: '#ff000e',
      marginLeft: 20,
    },
  });
