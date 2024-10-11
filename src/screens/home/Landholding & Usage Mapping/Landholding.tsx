import {
  Image,
  KeyboardAvoidingView,
  PermissionsAndroid,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
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
import Geolocation from 'react-native-geolocation-service';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {dark_grey, primary} from '../../../styles/colors';
import {fontFamilyRegular} from '../../../styles/fontStyle';
import MultiselectDropdown from '../../../Components/CustomDropdown/MultiselectDropdown';
import YearPicker from '../../../Components/YearPicker/YearPicker';
import {Picker} from '@react-native-picker/picker';
import CustomButton from '../../../Components/CustomButton/CustomButton';

const Landholding = ({navigation}: {navigation: any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [modalViisble, setModalVisible] = useState(false);
  const [yeaModalVisible, setYearModalVisible] = useState(false);
  const VILLAGE = true;
  const [tempYear, setTempYear] = useState(new Date().getFullYear());

  const years = [];
  for (let i = 1900; i <= new Date().getFullYear(); i++) {
    years.push(i);
  }
  let landholdSchema = Yup.object()
    .shape({
      total_number: Yup.number().required(
        'Total number of land owned is required',
      ),
      land_owned_inside_village: Yup.number().required(
        'Land owned inside village is required',
      ),
      land_owned_outside_village: Yup.number().required(
        'Land owned outside village is required',
      ),
      geotag: Yup.string().required('Geotag is required'),
      total_area: Yup.number().required('Total area is required'),
      purpose_utilised_for: Yup.array()
        .required('Purpose is required')
        .min(1, 'At least one purpose utilised for is required'),
      division_area_allocated: Yup.number().required(
        'Division of area allocated is required',
      ),
      year_purchase: Yup.number().required('Year of purchase is required'),
      land_requirement: Yup.boolean().required('Land requirement is required'),
      area: Yup.number().test(
        'area-required',
        'Area is required',
        function (value) {
          const {land_requirement} = this.parent; // Accessing other field values
          if (land_requirement) {
            return value ? true : false;
          }
          return true;
        },
      ),
      purpose: Yup.string().test(
        'purpose-required',
        'Purpose is required',
        function (value) {
          const {land_requirement} = this.parent; // Accessing other field values
          if (land_requirement) {
            return value ? true : false;
          }
          return true;
        },
      ),
      urgency: Yup.string().test(
        'urgency-required',
        'Urgency is required',
        function (value) {
          const {land_requirement} = this.parent; // Accessing other field values
          if (land_requirement) {
            return value ? true : false;
          }
          return true;
        },
      ),
      total_area_allocated_to_the_village: Yup.number().test(
        'total_area_allocated_to_the_village-required',
        'Total area allocated to the village is required',
        function (value) {
          if (VILLAGE) {
            return value ? true : false;
          }
          return true;
        },
      ),
      total_area_allocated_for_community: Yup.number().test(
        'total_area_allocated_for_community-required',
        'Total area allocated for community is required',
        function (value) {
          if (VILLAGE) {
            return value ? true : false;
          }
          return true;
        },
      ),
      land_owned_by_non_residents: Yup.number().test(
        'land_owned_by_non_residents-required',
        'Land owned by non residents is required',
        function (value) {
          if (VILLAGE) {
            return value ? true : false;
          }
          return true;
        },
      ),
      freehold_village_land: Yup.number().test(
        'freehold_village_land-required',
        'Freehold village land is required',
        function (value) {
          if (VILLAGE) {
            return value ? true : false;
          }
          return true;
        },
      ),
    })
    .test(
      'land-limit',
      'Sum of land owned inside village, land owned outside village should not exceed Total land',
      function (values) {
        const {
          total_number,
          land_owned_inside_village,
          land_owned_outside_village,
        } = values;

        const totalAllocatedLand =
          land_owned_inside_village + land_owned_outside_village;

        // Validate that the total allocated land does not exceed total land
        if (totalAllocatedLand > total_number) {
          return this.createError({
            path: 'output',
            message: `The output (${totalAllocatedLand}) exceeds the available total numbers of land owned (${total_number})`,
          });
        }
        return true;
      },
    );
  const requestLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const granted = await Geolocation.requestAuthorization('whenInUse');
      Geolocation.setRNConfiguration({
        skipPermissionRequests: false,
        authorizationLevel: 'whenInUse',
      });

      if (granted === 'granted') {
        navigation.navigate('MapScreen', {
          setCoordinates: (coords: any) =>
            setValues({
              ...values,
              address: `${coords.latitude},${coords.longitude}`,
            }),
          my_location: {
            lat: parseFloat(values?.address.split(',')[0]) || null,
            lng: parseFloat(values?.address.split(',')[1]) || null,
          },
        });
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }
    } else if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Access Required!',
            message: 'We need to access your location for address related data',
            // buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === 'granted') {
          navigation.navigate('MapScreen', {
            setCoordinates: (coords: any) =>
              setValues({
                ...values,
                address: `${coords.latitude},${coords.longitude}`,
              }),
            my_location: {
              lat: parseFloat(values?.address.split(',')[0]) || null,
              lng: parseFloat(values?.address.split(',')[1]) || null,
            },
          });
          return true;
        } else {
          console.log('You cannot use Geolocation');
          return false;
        }
      } catch (err) {
        return false;
      }
    }
  };

  const getLocation = async () => {
    const result = requestLocationPermission();
    result.then(res => {
      if (res) {
        Geolocation.getCurrentPosition(
          (position: any) => {
            console.log(position);
            if (!values?.address.length)
              setValues({
                ...values,
                address: `${position.coords.latitude},${position.coords.longitude}`,
              });
          },
          (error: any) => {
            // See error code charts below.
            console.log(error.code, error.message);
            setValues({...values, address: ''});
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  };
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
      total_number: 0,
      land_owned_inside_village: 0,
      land_owned_outside_village: 0,
      geotag: '',
      total_area: 0,
      purpose_utilised_for: [],
      division_area_allocated: 0,
      year_purchase: '',
      land_requirement: false,
      area: 0,
      purpose: '',
      urgency: '',
      total_area_allocated_to_the_village: 0,
      total_area_allocated_for_community: 0,
      land_owned_by_non_residents: 0,
      freehold_village_land: 0,
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
          <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('total_number')}
              value={String(values?.total_number)}
              fullLength={true}
              label={'Total number of land owned'}
              keyboardType={'numeric'}
            />
            {touched?.total_number && errors?.total_number && (
              <Text style={Styles.error}>{String(errors?.total_number)}</Text>
            )}
            <Input
              onChangeText={handleChange('land_owned_inside_village')}
              value={String(values?.land_owned_inside_village)}
              fullLength={true}
              label={'Land owned inside the village'}
              keyboardType={'numeric'}
            />
            {touched?.land_owned_inside_village &&
              errors?.land_owned_inside_village && (
                <Text style={Styles.error}>
                  {String(errors?.land_owned_inside_village)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('land_owned_outside_village')}
              value={String(values?.land_owned_outside_village)}
              fullLength={true}
              label={'Land owned outside the village'}
              keyboardType={'numeric'}
            />
            {touched?.land_owned_outside_village &&
              errors?.land_owned_outside_village && (
                <Text style={Styles.error}>
                  {String(errors?.land_owned_outside_village)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('geotag')}
              value={values?.geotag}
              fullLength={true}
              label={'Location'}
              editable={false}
              isRight={
                <TouchableOpacity
                  style={{marginRight: 10}}
                  onPress={getLocation}>
                  <MaterialCommunityIcons
                    name="crosshairs-gps"
                    size={26}
                    color={primary}
                  />
                </TouchableOpacity>
              }
            />
            {touched?.geotag && errors?.geotag && (
              <Text style={Styles.error}>{String(errors?.geotag)}</Text>
            )}
            <Input
              onChangeText={handleChange('total_area')}
              value={String(values?.total_area)}
              fullLength={true}
              label={'Total area'}
              keyboardType={'numeric'}
            />
            {touched?.total_area && errors?.total_area && (
              <Text style={Styles.error}>{String(errors?.total_area)}</Text>
            )}
            <MultiselectDropdown
              containerStyle={{
                width: width / 1.12,
                marginTop: '5%',
                paddingTop: 0,
              }}
              data={[
                {key: 'Cricket', name: 'Cricket'},
                {key: 'Football', name: 'Football'},
                {key: 'Story Books', name: 'Story Books'},
              ]}
              setSelectedd={(item: any) =>
                setValues({...values, purpose_utilised_for: item})
              }
              selectedd={values?.purpose_utilised_for}
              infoName={'Purpose utilised for'}
            />
            {touched?.purpose_utilised_for && errors?.purpose_utilised_for && (
              <Text style={Styles.error}>
                {String(errors?.purpose_utilised_for)}
              </Text>
            )}
            {values?.purpose_utilised_for?.length > 0 && (
              <>
                <Input
                  onChangeText={handleChange('division_area_allocated')}
                  value={String(values?.division_area_allocated)}
                  fullLength={true}
                  label={'Division area allocated'}
                  keyboardType={'numeric'}
                />
                {touched?.division_area_allocated &&
                  errors?.division_area_allocated && (
                    <Text style={Styles.error}>
                      {String(errors?.division_area_allocated)}
                    </Text>
                  )}
                <Text style={Styles.fieldLabel}>Year Purchased</Text>
                <YearPicker
                  onYearChange={(year: any) => {
                    setValues({...values, year_purchase: year});
                  }}
                  selectedYear={values?.year_purchase}
                />
                {touched?.year_purchase && errors?.year_purchase && (
                  <Text style={Styles.error}>
                    {String(errors?.year_purchase)}
                  </Text>
                )}
              </>
            )}
            <Text style={[Styles.fieldLabel]}>
              Do have any land requirement?
            </Text>
            <View style={{flexDirection: 'row', gap: 8, marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  setValues({
                    ...values,
                    land_requirement: !values?.land_requirement,
                  })
                }>
                <Image
                  source={
                    values?.land_requirement === true
                      ? require('../../../../assets/checked.png')
                      : require('../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>Yes</Text>
              <TouchableOpacity
                onPress={() =>
                  setValues({
                    ...values,
                    land_requirement: !values?.land_requirement,
                  })
                }>
                <Image
                  source={
                    values?.land_requirement === false
                      ? require('../../../../assets/checked.png')
                      : require('../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>No</Text>
            </View>
            {values?.land_requirement && (
              <>
                <Input
                  onChangeText={handleChange('area')}
                  value={String(values?.area)}
                  fullLength={true}
                  label={'Area'}
                  keyboardType={'numeric'}
                />
                {touched?.area && errors?.area && (
                  <Text style={Styles.error}>{String(errors?.area)}</Text>
                )}
                <Customdropdown
                  data={[
                    {id: 1, label: 'Stable', value: 'Stable'},
                    {
                      id: 2,
                      label: 'Decreasing Yield',
                      value: 'Decreasing Yield',
                    },
                    {id: 3, label: 'Others', value: 'Others'},
                  ]}
                  value={values.purpose}
                  label={'Purpose'}
                  onChange={(value: any) => {
                    console.log('valueee', value);
                    setValues({
                      ...values,
                      purpose: value?.value,
                    });
                  }}
                />
                {touched?.purpose && errors?.purpose && (
                  <Text style={Styles.error}>{String(errors?.purpose)}</Text>
                )}
                <Customdropdown
                  data={[
                    {id: 1, label: 'Stable', value: 'Stable'},
                    {
                      id: 2,
                      label: 'Decreasing Yield',
                      value: 'Decreasing Yield',
                    },
                    {id: 3, label: 'Others', value: 'Others'},
                  ]}
                  value={values.urgency}
                  label={'Urgency'}
                  onChange={(value: any) => {
                    console.log('valueee', value);
                    setValues({
                      ...values,
                      urgency: value?.value,
                    });
                  }}
                />
                {touched?.urgency && errors?.urgency && (
                  <Text style={Styles.error}>{String(errors?.urgency)}</Text>
                )}
              </>
            )}
            {VILLAGE && (
              <>
                <Input
                  onChangeText={handleChange(
                    'total_area_allocated_to_the_village',
                  )}
                  value={String(values?.total_area_allocated_to_the_village)}
                  fullLength={true}
                  label={'Total area allocated to the village'}
                  keyboardType={'numeric'}
                />
                {touched?.total_area_allocated_to_the_village &&
                  errors?.total_area_allocated_to_the_village && (
                    <Text style={Styles.error}>
                      {String(errors?.total_area_allocated_to_the_village)}
                    </Text>
                  )}
                <Input
                  onChangeText={handleChange(
                    'total_area_allocated_for_community',
                  )}
                  value={String(values?.total_area_allocated_for_community)}
                  fullLength={true}
                  label={'Total area allocated for community'}
                  keyboardType={'numeric'}
                />
                {touched?.total_area_allocated_for_community &&
                  errors?.total_area_allocated_for_community && (
                    <Text style={Styles.error}>
                      {String(errors?.total_area_allocated_for_community)}
                    </Text>
                  )}
                <Input
                  onChangeText={handleChange('land_owned_by_non_residents')}
                  value={String(values?.land_owned_by_non_residents)}
                  fullLength={true}
                  label={'Land owned by non-residents'}
                  keyboardType={'numeric'}
                />
                {touched?.land_owned_by_non_residents &&
                  errors?.land_owned_by_non_residents && (
                    <Text style={Styles.error}>
                      {String(errors?.land_owned_by_non_residents)}
                    </Text>
                  )}
                <Input
                  onChangeText={handleChange('freehold_village_land')}
                  value={String(values?.freehold_village_land)}
                  fullLength={true}
                  label={'Freehold village land'}
                  keyboardType={'numeric'}
                />
                {touched?.freehold_village_land &&
                  errors?.freehold_village_land && (
                    <Text style={Styles.error}>
                      {String(errors?.freehold_village_land)}
                    </Text>
                  )}
              </>
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

export default Landholding;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
