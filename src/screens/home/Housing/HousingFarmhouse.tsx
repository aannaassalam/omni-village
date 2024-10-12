import {
  KeyboardAvoidingView,
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
import YearPicker from '../../../Components/YearPicker/YearPicker';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {dark_grey, primary} from '../../../styles/colors';
import {fontFamilyRegular} from '../../../styles/fontStyle';
import DocumentPicker, {types} from 'react-native-document-picker';
import ImageView from 'react-native-image-viewing';
import MultiselectDropdown from '../../../Components/CustomDropdown/MultiselectDropdown';
import CustomButton from '../../../Components/CustomButton/CustomButton';

const HousingFarmhouse = ({navigation, route}: {navigation: any, route:any}) => {
    const {housing}  =route.params
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [modalViisble, setModalVisible] = useState(false);
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  let HousingSchema = Yup.object().shape({
    land_utilised_for_farmhouse: Yup.number().required(
      'Land utilised for farmhouse is required',
    ),
    number_of_units_built_farmhouse: Yup.number().required(
      'Number of units built is required',
    ),
    total_built_up_area_farmhouse: Yup.string().required(
      'Total built up area is required',
    ),
    no_of_floors_farmhouse: Yup.number().required('No of floors is required'),
    year_built_farmhouse: Yup.number().required('Year built is required'),
    year_last_renovated_farmhouse: Yup.number().required(
      'Year last renovated is required',
    ),
    year_last_expanded_farmhouse: Yup.number().required(
      'Year last expanded is required',
    ),
    front_photo_farmhouse: Yup.object().required('Front photo is required'),
    back_photo_farmhouse: Yup.object().required('Back photo is required'),
    neighbourhood_photo_farmhouse: Yup.object().required(
      'Neighbourhood photo is required',
    ),
    inside_living_photo_farmhouse: Yup.object().required(
      'Inside living photo is required',
    ),
    kitchen_photo_farmhouse: Yup.object().required('Kitchen photo is required'),
    amenities_farmhouse: Yup.array()
      .min(1, 'Atleast one amenities is required')
      .required('Amenities is required'),
    needs_farmhouse: Yup.string(),
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
      land_utilised_for_farmhouse: 0,
      number_of_units_built_farmhouse: 0,
      total_built_up_area_farmhouse: '',
      no_of_floors_farmhouse: 0,
      year_built_farmhouse: 0,
      year_last_renovated_farmhouse: 0,
      year_last_expanded_farmhouse: 0,
      front_photo_farmhouse: '',
      back_photo_farmhouse: '',
      neighbourhood_photo_farmhouse: '',
      inside_living_photo_farmhouse: '',
      kitchen_photo_farmhouse: '',
      amenities_farmhouse: [],
      needs_farmhouse: '',
    },
    validationSchema: HousingSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      setPopupVisible(true)
    },
  });
  const handleDocumentSelection = async (document_name: any) => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.images],
        allowMultiSelection: false,
        copyTo: 'cachesDirectory',
      });
      if (document_name === 'front_photo_farmhouse') {
        console.log('hereree');
        setValues({...values, front_photo_farmhouse: response[0]});
      } else if (document_name === 'back_photo_farmhouse') {
        console.log('first');
        setValues({...values, back_photo_farmhouse: response[0]});
      } else if (document_name === 'neighbourhood_photo_farmhouse') {
        console.log('first');
        setValues({...values, neighbourhood_photo_farmhouse: response[0]});
      } else if (document_name === 'inside_living_photo_farmhouse') {
        console.log('first');
        setValues({...values, inside_living_photo_farmhouse: response[0]});
      } else if (document_name === 'kitchen_photo_farmhouse') {
        console.log('first');
        setValues({...values, kitchen_photo_farmhouse: response[0]});
      }
    } catch (err) {
      console.warn(err);
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Input
              onChangeText={handleChange('land_utilised_for_farmhouse')}
              value={String(values?.land_utilised_for_farmhouse)}
              fullLength={true}
              label={'Land utilised for farmhouse'}
              keyboardType={'numeric'}
            />
            {touched?.land_utilised_for_farmhouse &&
              errors?.land_utilised_for_farmhouse && (
                <Text style={Styles.error}>
                  {String(errors?.land_utilised_for_farmhouse)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('number_of_units_built_farmhouse')}
              value={String(values?.number_of_units_built_farmhouse)}
              fullLength={true}
              label={'Number of units built'}
              keyboardType={'numeric'}
            />
            {touched?.number_of_units_built_farmhouse &&
              errors?.number_of_units_built_farmhouse && (
                <Text style={Styles.error}>
                  {String(errors?.number_of_units_built_farmhouse)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('total_built_up_area_farmhouse')}
              value={String(values?.total_built_up_area_farmhouse)}
              fullLength={true}
              label={'Total built up area'}
              keyboardType={'default'}
            />
            {touched?.total_built_up_area_farmhouse &&
              errors?.total_built_up_area_farmhouse && (
                <Text style={Styles.error}>
                  {String(errors?.total_built_up_area_farmhouse)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('no_of_floors_farmhouse')}
              value={String(values?.no_of_floors_farmhouse)}
              fullLength={true}
              label={'No of floors & Living area'}
              keyboardType={'numeric'}
            />
            {touched?.no_of_floors_farmhouse &&
              errors?.no_of_floors_farmhouse && (
                <Text style={Styles.error}>
                  {String(errors?.no_of_floors_farmhouse)}
                </Text>
              )}
            <Text style={Styles.fieldLabel}>Year built</Text>
            <YearPicker
              onYearChange={(year: any) => {
                setValues({...values, year_built_farmhouse: year});
              }}
              selectedYear={values?.year_built_farmhouse}
            />
            {touched?.year_built_farmhouse && errors?.year_built_farmhouse && (
              <Text style={Styles.error}>
                {String(errors?.year_built_farmhouse)}
              </Text>
            )}
            <Text style={Styles.fieldLabel}>Year last renovated</Text>
            <YearPicker
              onYearChange={(year: any) => {
                setValues({...values, year_last_renovated_farmhouse: year});
              }}
              selectedYear={values?.year_last_renovated_farmhouse}
            />
            {touched?.year_last_renovated_farmhouse &&
              errors?.year_last_renovated_farmhouse && (
                <Text style={Styles.error}>
                  {String(errors?.year_last_renovated_farmhouse)}
                </Text>
              )}
            <Text style={Styles.fieldLabel}>Year last expanded</Text>
            <YearPicker
              onYearChange={(year: any) => {
                setValues({...values, year_last_expanded_farmhouse: year});
              }}
              selectedYear={values?.year_last_expanded_farmhouse}
            />
            {touched?.year_last_expanded_farmhouse &&
              errors?.year_last_expanded_farmhouse && (
                <Text style={Styles.error}>
                  {String(errors?.year_last_expanded_farmhouse)}
                </Text>
              )}
            <Text style={Styles.fieldLabel}>Front Photo</Text>
            <TouchableOpacity
              style={[
                styles.addFileButton,
                {
                  justifyContent:
                    values?.front_photo_farmhouse == ''
                      ? 'center'
                      : 'space-between',
                },
              ]}
              onPress={() => {
                if (values?.front_photo_farmhouse == '') {
                  handleDocumentSelection('front_photo_farmhouse');
                } else {
                  setSelectedImage([
                    {
                      uri:
                        values?.front_photo_farmhouse?.fileCopyUri ||
                        values.front_photo_farmhouse,
                    },
                  ]);
                  setModalVisible(true);
                }
              }}>
              {values?.front_photo_farmhouse == '' ? (
                <>
                  <AntDesign name="upload" size={18} color={primary} />
                  <Text style={styles.butnText}>Add Front Photo</Text>
                </>
              ) : (
                <>
                  <Text
                    style={[
                      Styles.fieldLabel,
                      {marginBottom: 0, marginTop: 0, width: width / 1.6},
                    ]}>
                    {values?.front_photo_farmhouse?.name || ''}
                  </Text>
                  <AntDesign
                    name="close"
                    size={18}
                    color={primary}
                    onPress={() =>
                      setValues({...values, front_photo_farmhouse: ''})
                    }
                  />
                </>
              )}
            </TouchableOpacity>
            {touched?.front_photo_farmhouse &&
              errors?.front_photo_farmhouse && (
                <Text style={Styles.error}>
                  {String(errors?.front_photo_farmhouse)}
                </Text>
              )}
            <Text style={Styles.fieldLabel}>Back Photo</Text>
            <TouchableOpacity
              style={[
                styles.addFileButton,
                {
                  justifyContent:
                    values?.back_photo_farmhouse == ''
                      ? 'center'
                      : 'space-between',
                },
              ]}
              onPress={() => {
                if (values?.back_photo_farmhouse == '') {
                  handleDocumentSelection('back_photo_farmhouse');
                } else {
                  setSelectedImage([
                    {
                      uri:
                        values?.back_photo_farmhouse?.uri ||
                        values.back_photo_farmhouse,
                    },
                  ]);
                  setModalVisible(true);
                }
              }}>
              {values?.back_photo_farmhouse == '' ? (
                <>
                  <AntDesign name="upload" size={18} color={primary} />
                  <Text style={styles.butnText}>Add Back Photo</Text>
                </>
              ) : (
                <>
                  <Text
                    style={[
                      Styles.fieldLabel,
                      {marginBottom: 0, marginTop: 0, width: width / 1.6},
                    ]}>
                    {values?.back_photo_farmhouse?.name || ''}
                  </Text>
                  <AntDesign
                    name="close"
                    size={18}
                    color={primary}
                    onPress={() =>
                      setValues({...values, back_photo_farmhouse: ''})
                    }
                  />
                </>
              )}
            </TouchableOpacity>
            {touched?.back_photo_farmhouse && errors?.back_photo_farmhouse && (
              <Text style={Styles.error}>
                {String(errors?.back_photo_farmhouse)}
              </Text>
            )}
            <Text style={Styles.fieldLabel}>Neightbourhood Photo</Text>
            <TouchableOpacity
              style={[
                styles.addFileButton,
                {
                  justifyContent:
                    values?.neighbourhood_photo_farmhouse == ''
                      ? 'center'
                      : 'space-between',
                },
              ]}
              onPress={() => {
                if (values?.neighbourhood_photo_farmhouse == '') {
                  handleDocumentSelection('neighbourhood_photo_farmhouse');
                } else {
                  setSelectedImage([
                    {
                      uri:
                        values?.neighbourhood_photo_farmhouse?.uri ||
                        values.neighbourhood_photo_farmhouse,
                    },
                  ]);
                  setModalVisible(true);
                }
              }}>
              {values?.neighbourhood_photo_farmhouse == '' ? (
                <>
                  <AntDesign name="upload" size={18} color={primary} />
                  <Text style={styles.butnText}>Add Neighbourhood Photo</Text>
                </>
              ) : (
                <>
                  <Text
                    style={[
                      Styles.fieldLabel,
                      {marginBottom: 0, marginTop: 0, width: width / 1.6},
                    ]}>
                    {values?.neighbourhood_photo_farmhouse?.name || ''}
                  </Text>
                  <AntDesign
                    name="close"
                    size={18}
                    color={primary}
                    onPress={() =>
                      setValues({...values, neighbourhood_photo_farmhouse: ''})
                    }
                  />
                </>
              )}
            </TouchableOpacity>
            {touched?.neighbourhood_photo_farmhouse &&
              errors?.neighbourhood_photo_farmhouse && (
                <Text style={Styles.error}>
                  {String(errors?.neighbourhood_photo_farmhouse)}
                </Text>
              )}
            <Text style={Styles.fieldLabel}>Inside living Photo</Text>
            <TouchableOpacity
              style={[
                styles.addFileButton,
                {
                  justifyContent:
                    values?.inside_living_photo_farmhouse == ''
                      ? 'center'
                      : 'space-between',
                },
              ]}
              onPress={() => {
                if (values?.inside_living_photo_farmhouse == '') {
                  handleDocumentSelection('inside_living_photo_farmhouse');
                } else {
                  setSelectedImage([
                    {
                      uri:
                        values?.inside_living_photo_farmhouse?.uri ||
                        values.inside_living_photo_farmhouse,
                    },
                  ]);
                  setModalVisible(true);
                }
              }}>
              {values?.inside_living_photo_farmhouse == '' ? (
                <>
                  <AntDesign name="upload" size={18} color={primary} />
                  <Text style={styles.butnText}>Add Inside living Photo</Text>
                </>
              ) : (
                <>
                  <Text
                    style={[
                      Styles.fieldLabel,
                      {marginBottom: 0, marginTop: 0, width: width / 1.6},
                    ]}>
                    {values?.inside_living_photo_farmhouse?.name || ''}
                  </Text>
                  <AntDesign
                    name="close"
                    size={18}
                    color={primary}
                    onPress={() =>
                      setValues({...values, inside_living_photo_farmhouse: ''})
                    }
                  />
                </>
              )}
            </TouchableOpacity>
            {touched?.inside_living_photo_farmhouse &&
              errors?.inside_living_photo_farmhouse && (
                <Text style={Styles.error}>
                  {String(errors?.inside_living_photo_farmhouse)}
                </Text>
              )}
            <Text style={Styles.fieldLabel}>Kitchen Photo</Text>
            <TouchableOpacity
              style={[
                styles.addFileButton,
                {
                  justifyContent:
                    values?.kitchen_photo_farmhouse == ''
                      ? 'center'
                      : 'space-between',
                },
              ]}
              onPress={() => {
                if (values?.kitchen_photo_farmhouse == '') {
                  handleDocumentSelection('kitchen_photo_farmhouse');
                } else {
                  setSelectedImage([
                    {
                      uri:
                        values?.kitchen_photo_farmhouse?.uri ||
                        values.kitchen_photo_farmhouse,
                    },
                  ]);
                  setModalVisible(true);
                }
              }}>
              {values?.kitchen_photo_farmhouse == '' ? (
                <>
                  <AntDesign name="upload" size={18} color={primary} />
                  <Text style={styles.butnText}>Add Kitchen Photo</Text>
                </>
              ) : (
                <>
                  <Text
                    style={[
                      Styles.fieldLabel,
                      {marginBottom: 0, marginTop: 0, width: width / 1.6},
                    ]}>
                    {values?.kitchen_photo_farmhouse?.name || ''}
                  </Text>
                  <AntDesign
                    name="close"
                    size={18}
                    color={primary}
                    onPress={() =>
                      setValues({...values, kitchen_photo_farmhouse: ''})
                    }
                  />
                </>
              )}
            </TouchableOpacity>
            {touched?.kitchen_photo_farmhouse &&
              errors?.kitchen_photo_farmhouse && (
                <Text style={Styles.error}>
                  {String(errors?.kitchen_photo_farmhouse)}
                </Text>
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
                setValues({...values, amenities_farmhouse: item})
              }
              selectedd={values?.amenities_farmhouse}
              infoName={'Amenities'}
            />
            {touched?.amenities_farmhouse && errors?.amenities_farmhouse && (
              <Text style={Styles.error}>
                {String(errors?.amenities_farmhouse)}
              </Text>
            )}
            <Input
              onChangeText={handleChange('needs_farmhouse')}
              value={String(values?.needs_farmhouse)}
              fullLength={true}
              label={'Needs (if any)'}
              keyboardType={'default'}
            />
            {touched?.needs_farmhouse && errors?.needs_farmhouse && (
              <Text style={Styles.error}>
                {String(errors?.needs_farmhouse)}
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
        visible={popupVisible}
        cancel={true}
        hideText={'Cancel'}
        onSubmit={() => setPopupVisible(false)}
        confirmText="Submit"
        onHide={() => setPopupVisible(false)}
        title="Confirm Submit"
        comments="Are you sure you want to submit this form?"
      />
      <ImageView
        images={selectedImage !== null ? selectedImage : []}
        imageIndex={0}
        visible={modalViisble}
        onRequestClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default HousingFarmhouse;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    inputContainer: {
      paddingHorizontal: 25,
      justifyContent: 'flex-start',
      alignSelf: 'flex-start',
      gap: 10,
    },
    addFileButton: {
      backgroundColor: '#fff',
      borderWidth: 1,
      borderColor: primary,
      width: width / 1.14,
      flexDirection: 'row',
      gap: 10,
      alignSelf: 'center',
      justifyContent: 'center',
      padding: 14,
      borderRadius: 5,
    },
    butnText: {
      fontSize: 16 / fontScale,
      fontFamily: fontFamilyRegular,
      color: primary,
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
