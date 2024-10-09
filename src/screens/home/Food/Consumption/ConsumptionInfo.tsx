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
const ConsumptionInfo = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {crop_name} = route.params;
  const [modalViisble, setModalVisible] = useState(false);
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
        .required('quantity is required'),
      self_grown: Yup.number().required('Self grown is required'),
      purchased_from_neighbours: Yup.number().required(
        'Purchased from neighbour is required',
      ),
      purchased_from_market: Yup.number().required(
        'Purchased from market use is required',
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
        self_grown
          + purchased_from_neighbours
          + purchased_from_market;

        // Validate that the total allocated land does not exceed total land
        if (totalAllocatedLand > quantity) {
          return this.createError({
            path: 'output',
            message: `The output (${totalAllocatedLand}) exceeds the available output (${quantity})`,
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
      quantity: 0,
      self_grown: 0,
      purchased_from_neighbours: 0,
      purchased_from_market: 0,
    },
    // validationSchema: treesSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      setModalVisible(true);
    },
  });
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('quantity')}
              value={String(values?.quantity)}
              fullLength={true}
              label={'Quantity'}
              keyboardType={'numeric'}
            />
            {touched?.quantity && errors?.quantity && (
              <Text style={Styles.error}>{String(errors?.quantity)}</Text>
            )}
            <Input
              onChangeText={handleChange('self_grown')}
              value={String(values?.self_grown)}
              fullLength={true}
              label={'Self Grown'}
              keyboardType={'numeric'}
              isRight={<AcresElement title={'kg'} />}
            />
            {touched?.self_grown && errors?.self_grown && (
              <Text style={Styles.error}>{String(errors?.self_grown)}</Text>
            )}
            <Input
              onChangeText={handleChange('purchased_from_neighbours')}
              value={String(values?.purchased_from_neighbours)}
              fullLength={true}
              label={'Purchased from neighbours'}
              keyboardType={'numeric'}
              isRight={<AcresElement title={'kg'} />}
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
              label={'Purchased from market'}
              keyboardType={'numeric'}
              isRight={<AcresElement title={'kg'} />}
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
            btnText={'Submit'}
            style={{width: width / 2.5}}
          />
          <CustomButton
            onPress={() => {}}
            btnText={'Save as draft'}
            btnStyle={{color: dark_grey}}
            style={{width: width / 2.5, backgroundColor: '#ebeced'}}
          />
        </View>
      </View>
      <AlertModal
        visible={modalViisble}
        cancel={true}
        hideText={'Cancel'}
        onSubmit={() => setModalVisible(false)}
        confirmText="Submit"
        onHide={() => setModalVisible(false)}
        title="Confirm Submit"
        comments="Are you sure you want to submit this form?"
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
