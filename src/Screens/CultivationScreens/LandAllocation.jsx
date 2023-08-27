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

const LandAllocation = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {totalLand} = 20;
  const [cultivation, setCultivation] = useState([
    {name: 'Cultivated once in a year', area: 0},
    {name: 'Cultivated twice in a year', area: 0},
    {name: 'Cultivated thrice in a year', area: 0},
  ]);

  const dispatch = useDispatch();

  yup.addMethod(yup.object, 'atLeastOneOf', function (list) {
    return this.test({
      name: 'Validation Error',
      message: 'Atleast one the field is required!',
      exclusive: true,
      params: {keys: list.join(', ')},
      test: value => list.some(f => value[f] !== 0 && value[f] !== ''),
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
      once: 0,
      twice: 0,
      thrice: 0,
    },
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: errors[''].message,
        topOffset: 40,
      });
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
          headerName={'Land Allocation'}
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
                productionName="Cultivated once in a year"
                placeholder={'0'}
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
                productionName="Cultivated twice in a year"
                placeholder={'0'}
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
                productionName="Cultivated thrice in a year"
                placeholder={'0'}
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {/* {errors?.first_name?.message ? (
                <Text style={styles.error}>{errors?.first_name?.message}</Text>
              ) : null} */}
        </View>
      </KeyboardAvoidingView>
      <View style={styles.save}>
        <CustomButton btnText={'Save'} onPress={handleSubmit(onSave)} />
      </View>
      <Toast />
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
  });
