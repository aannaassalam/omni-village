import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {Styles} from '../../../styles/globalStyles';

const Mobility = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [modalViisble, setModalVisible] = useState(false);
  const village = true
  let HousingSchema = Yup.object().shape({
    no_of_vehicles_owned: Yup.number().required(
      'Number of vehicle owned is required',
    ),
    type: Yup.string().required('Type is required'),
    total_travelled_within_a_village_in_a_year: Yup.string().required(
      'Total travelled within a village in a year is required',
    ),
    kms_travelled_outside: Yup.number().required(
      'Kms travelled outside is required',
    ),
    purpose: Yup.string().required('Purpose is required'),
    frequency_of_usage: Yup.string().required('Frequency of usage is required'),
    vehicle_requirement: Yup.boolean().required(
      'Vehicle requirement is required',
    ),
    type_of_vehicle: Yup.string().test(
      'type-of-vehicle-required',
      'type-of-vehicle is required',
      function (value) {
        const {vehicle_requirement} = this.parent; // Accessing other field values
        if (vehicle_requirement) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    how_many: Yup.number().test(
      'how-many-required',
      'how-many is required',
      function (value) {
        const {vehicle_requirement} = this.parent; // Accessing other field values
        if (vehicle_requirement) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    purpose_of_vehicle: Yup.string().test(
      'purpose-of-vehicle-required',
      'purpose-of-vehicle is required',
      function (value) {
        const {vehicle_requirement} = this.parent; // Accessing other field values
        if (vehicle_requirement) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    urgency: Yup.string().test(
      'urgency-required',
      'urgency is required',
      function (value) {
        const {vehicle_requirement} = this.parent; // Accessing other field values
        if (vehicle_requirement) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    houses_connected_to_internal_road: Yup.number().test(
      'houses-connected-to-internal-road-required',
      'houses-connected-to-internal-road is required',
      function (value) {
        if (village) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    houses_not_connected_to_internal_road: Yup.number().test(
      'houses-not-connected-to-internal-road-required',
      'houses-not-connected-to-internal-road is required',
      function (value) {
        if (village) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    village_connectivity_to_highway: Yup.boolean().test(
      'village-connectivity-to-highway-required',
      'village-connectivity-to-highway is required',
      function (value) {
        if (village) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    number_of_bridges_needed: Yup.number().test(
      'number-of-bridges-needed-required',
      'number-of-bridges-needed is required',
      function (value) {
        if (village) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    reason: Yup.string().test(
      'reason-required',
      'reason is required',
      function (value) {
        if (village) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
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
      no_of_vehicles_owned: 0,
      type: '',
      total_travelled_within_a_village_in_a_year: '',
      kms_travelled_outside: 0,
      purpose: '',
      frequency_of_usage: '',
      vehicle_requirement: false,
      type_of_vehicle: '',
      how_many: 0,
      purpose_of_vehicle: '',
      urgency: '',
      houses_connected_to_internal_road: 0,
      houses_not_connected_to_internal_road: 0,
      village_connectivity_to_highway: false,
      number_of_bridges_needed: 0,
      reason: '',
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
          <View style={Styles.mainContainer}></View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default Mobility;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
