import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {dark_grey, white} from '../../../../styles/colors';
import {
  fontScale,
  Styles,
  width,
} from './../../../../styles/globalStyles';
import StackHeader from '../../../../Components/CustomHeader/StackHeader';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Input from '../../../../Components/Inputs/Input';
import AcresElement from '../../../../Components/ui/AcresElement';
import CustomButton from '../../../../Components/CustomButton/CustomButton';
import {fontFamilyRegular} from '../../../../styles/fontStyle';
import AlertModal from '../../../../Components/Popups/AlertModal';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { add_consumption, edit_consumption } from '../../../../apis/food';
import { useSelector } from 'react-redux';
import Customdropdown from '../../../../Components/CustomDropdown/Customdropdown';
import { useTranslation } from 'react-i18next';
const ConsumptionInfo = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {crop_name, crop_id, data,id} = route.params;
  const [modalViisble, setModalVisible] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [message, setMessage] = useState('');
    const {t} = useTranslation()
    const authState = useSelector(state => state.authState);
    const queryClient = useQueryClient();
    const {mutate: addConsumption} = useMutation({
      mutationFn: (data: any) => add_consumption(data),
      onSuccess: data => {
        console.log("daat added consump", data)
        setSuccessModal(true);
        queryClient.invalidateQueries();
      },
      onError: error => {
        setModalVisible(false);
        console.log(
          'error?.response?.data?.message',
          error,
          error?.response?.data?.message,
        );
      },
      onSettled: () => setModalVisible(false),
    });
    const {mutate: updateConsumption} = useMutation({
      mutationFn: (data: any) => edit_consumption(data),
      onSuccess: data => {
        setSuccessModal(true);
        queryClient.invalidateQueries();
      },
      onError: error => {
        setModalVisible(false);
        console.log(
          'error?.response?.data?.message edit',
          error,
          error?.response?.data?.message,
        );
      },
      onSettled: () => setModalVisible(false),
    });
  useEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <StackHeader
          title={crop_name.charAt(0).toUpperCase() + crop_name.slice(1)}
        />
      ),
    });
  }, [crop_name]);
  let treesSchema = Yup.object()
    .shape({
      quantity: Yup.number()
        .min(1, 'Quantity must be greater than equal to 1')
        .required(t('quantity_required')),
      weight_measurement: Yup.string().required(t('weight measurement')),
      self_grown: Yup.number().required(t('self_grown is required')),
      purchased_from_neighbours: Yup.number().required(
        t('purchased_from_neighbour is required'),
      ),
      purchased_from_market: Yup.number().required(
        t('purchased_from_market is required'),
      ),
    })
    .test(
      'land-limit',
      'Sum of self consumed sold for industrial use,sold to neighbours,wastage,output and others value should not exceed Total land',
      function (values) {
        const {
          quantity,
          self_grown,
          purchased_from_neighbours,
          purchased_from_market,
        } = values;

        const totalAllocatedLand =
          self_grown + purchased_from_neighbours + purchased_from_market;

        // Validate that the total allocated land does not exceed total land
        if (totalAllocatedLand > quantity) {
          return this.createError({
            path: 'quantity',
            message: `The ${t('quantity')} (${totalAllocatedLand}) exceeds the available ${t('quantity')} (${quantity})`,
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
      quantity: '',
    weight_measurement:'',
      self_grown: '',
      purchased_from_neighbours: '',
      purchased_from_market: '',
    },
    validationSchema: treesSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      setModalVisible(true);
    },
  });
  useEffect(()=>{
      resetForm({
        values:{
        quantity: data?.quantity || '',
        self_grown: data?.self_grown || '',
        weight_measurement: data?.weight_measurement||'',
        purchased_from_neighbours: data?.purchased_from_neighbours || '',
        purchased_from_market: data?.purchased_from_market || '',
    }})
  },[data])
  const onDrafted = async () => {
    if (data?._id) {
      let new_data = {
        consumption_type_id: id, //Get this ID from Consumption Types API
        total_quantity: values?.quantity,
        weight_measurement: values?.weight_measurement,
        purchased_from_market: values?.purchased_from_market,
        purchased_from_neighbours: values?.purchased_from_neighbours,
        self_grown: values?.purchased_from_neighbours,
        status: 0,
      };
      setMessage(t('drafted'));
      updateConsumption({...new_data, consumption_id: data?._id});
    } else {
      let new_data = {
        consumption_type_id: id, //Get this ID from Consumption Types API
        total_quantity: values?.quantity,
        weight_measurement: values?.weight_measurement,
        purchased_from_market: values?.purchased_from_market,
        purchased_from_neighbours: values?.purchased_from_neighbours,
        self_grown: values?.purchased_from_neighbours,
        status: 0,
      };
      setMessage(t('drafted'));
      addConsumption({...new_data, crop_id: crop_id});
    }
  };
  const onSubmit = () => {
    let new_data = {
      consumption_type_id: id, //Get this ID from Consumption Types API
      total_quantity: values?.quantity,
      weight_measurement: values?.weight_measurement,
      purchased_from_market: values?.purchased_from_market,
      purchased_from_neighbours: values?.purchased_from_neighbours,
      self_grown: values?.purchased_from_neighbours,
      status: 1,
    };
    if (data?._id) {
      setMessage(t('updated'));
      updateConsumption({...new_data, consumption_id: data?._id});
    } else {
      console.log('here2');
      setMessage(t('submitted'));
      addConsumption({...new_data, crop_id: crop_id});
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Customdropdown
              data={authState?.weight_measurements}
              value={values.weight_measurement}
              label={t('weight measurement')}
              onChange={(value: any) => {
                setValues({
                  ...values,
                  weight_measurement: value?.value,
                });
              }}
            />
            {touched?.weight_measurement && errors?.weight_measurement && (
              <Text style={Styles.error}>
                {String(errors?.weight_measurement)}
              </Text>
            )}
            <Input
              onChangeText={handleChange('quantity')}
              value={String(values?.quantity)}
              fullLength={true}
              label={t('quantity')}
              keyboardType={'numeric'}
              isRight={<AcresElement title={values?.weight_measurement} />}
            />
            {touched?.quantity && errors?.quantity && (
              <Text style={Styles.error}>{String(errors?.quantity)}</Text>
            )}
            <Input
              onChangeText={handleChange('self_grown')}
              value={String(values?.self_grown)}
              fullLength={true}
              label={t('self grown')}
              keyboardType={'numeric'}
              isRight={<AcresElement title={values?.weight_measurement} />}
            />
            {touched?.self_grown && errors?.self_grown && (
              <Text style={Styles.error}>{String(errors?.self_grown)}</Text>
            )}
            <Input
              onChangeText={handleChange('purchased_from_neighbours')}
              value={String(values?.purchased_from_neighbours)}
              fullLength={true}
              label={t('purchased from neighbour')}
              keyboardType={'numeric'}
              isRight={<AcresElement title={values?.weight_measurement} />}
            />
            {touched?.purchased_from_neighbours &&
              errors?.purchased_from_neighbours && (
                <Text style={Styles.error}>
                  {String(errors?.purchased_from_neighbours)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('purchased_from_market')}
              value={String(values?.purchased_from_market)}
              fullLength={true}
              label={t('purchased from market')}
              keyboardType={'numeric'}
              isRight={<AcresElement title={values?.weight_measurement} />}
            />
            {touched?.purchased_from_market &&
              errors?.purchased_from_market && (
                <Text style={Styles.error}>
                  {String(errors?.purchased_from_market)}
                </Text>
              )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <View style={{flexDirection: 'row', gap: 16}}>
          <CustomButton
            onPress={handleSubmit}
            btnText={t('submit')}
            style={{width: width / 2.5}}
          />
          <CustomButton
            onPress={() => {
              onDrafted();
            }}
            btnText={t('save as draft')}
            btnStyle={{color: dark_grey}}
            style={{width: width / 2.5, backgroundColor: '#ebeced'}}
          />
        </View>
      </View>
      <AlertModal
        visible={modalViisble}
        cancel={true}
        hideText={t('cancel')}
        onSubmit={() => onSubmit()}
        confirmText={t('submit')}
        onHide={() => setModalVisible(false)}
        title={t('confirm')}
        comments="Are you sure you want to submit this form?"
      />
      <AlertModal
        visible={successModal}
        successModal={true}
        onSubmit={() => {
          setSuccessModal(false), navigation.goBack();
        }}
        confirmText={t('okay')}
        title={t('Successful')}
        comments={`${t('Form')} ${message} ${t("Successful")}`}
      />
    </View>
  );
};

export default ConsumptionInfo;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: white,
  },
  subheading: {
    fontSize: 16 / fontScale,
    color: dark_grey,
    fontFamily: fontFamilyRegular,
    alignSelf: 'flex-start',
    textAlign: 'left',
    marginTop: '2%',
  },
});
