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

const Housing = ({navigation}: {navigation: any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [modalViisble, setModalVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  let HousingSchema = Yup.object().shape({
    land_utilised_for_main_family_housing: Yup.number().required(
      'Land utilised for main family housing is required',
    ),
    number_of_units_built: Yup.number().required(
      'Number of units built is required',
    ),
    total_built_up_area: Yup.string().required(
      'Total built up area is required',
    ),
    no_of_floors: Yup.number().required('No of floors is required'),
    year_built: Yup.number().required('Year built is required'),
    year_last_renovated: Yup.number().required(
      'Year last renovated is required',
    ),
    year_last_expanded: Yup.number().required('Year last expanded is required'),
    front_photo: Yup.object().required('Front photo is required'),
    back_photo: Yup.object().required('Back photo is required'),
    neighbourhood_photo: Yup.object().required(
      'Neighbourhood photo is required',
    ),
    inside_living_photo: Yup.object().required(
      'Inside living photo is required',
    ),
    kitchen_photo: Yup.object().required('Kitchen photo is required'),
    amenities: Yup.array()
      .min(1, 'Atleast one amenities is required')
      .required('Amenities is required'),
    household_needs: Yup.string(),
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
      land_utilised_for_main_family_housing: 0,
      number_of_units_built: 0,
      total_built_up_area: '',
      no_of_floors: 0,
      year_built: 0,
      year_last_renovated: 0,
      year_last_expanded: 0,
      front_photo: '',
      back_photo: '',
      neighbourhood_photo: '',
      inside_living_photo: '',
      kitchen_photo: '',
      amenities: [],
      household_needs: '',
    },
    validationSchema: HousingSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      navigation.navigate('housingFarmhouse', {
        housing: values,
      });
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
      if (document_name === 'front_photo') {
        console.log('hereree');
        setValues({...values, front_photo: response[0]});
      } else if (document_name === 'back_photo') {
        console.log('first');
        setValues({...values, back_photo: response[0]});
      } else if (document_name === 'neighbourhood_photo') {
        console.log('first');
        setValues({...values, neighbourhood_photo: response[0]});
      } else if (document_name === 'inside_living_photo') {
        console.log('first');
        setValues({...values, inside_living_photo: response[0]});
      } else if (document_name === 'kitchen_photo') {
        console.log('first');
        setValues({...values, kitchen_photo: response[0]});
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
              onChangeText={handleChange(
                'land_utilised_for_main_family_housing',
              )}
              value={String(values?.land_utilised_for_main_family_housing)}
              fullLength={true}
              label={'Land utilised for main family housing'}
              keyboardType={'numeric'}
            />
            {touched?.land_utilised_for_main_family_housing &&
              errors?.land_utilised_for_main_family_housing && (
                <Text style={Styles.error}>
                  {String(errors?.land_utilised_for_main_family_housing)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('number_of_units_built')}
              value={String(values?.number_of_units_built)}
              fullLength={true}
              label={'Number of units built'}
              keyboardType={'numeric'}
            />
            {touched?.number_of_units_built &&
              errors?.number_of_units_built && (
                <Text style={Styles.error}>
                  {String(errors?.number_of_units_built)}
                </Text>
              )}
            <Input
              onChangeText={handleChange('total_built_up_area')}
              value={String(values?.total_built_up_area)}
              fullLength={true}
              label={'Total built up area'}
              keyboardType={'default'}
            />
            {touched?.total_built_up_area && errors?.total_built_up_area && (
              <Text style={Styles.error}>
                {String(errors?.total_built_up_area)}
              </Text>
            )}
            <Input
              onChangeText={handleChange('no_of_floors')}
              value={String(values?.no_of_floors)}
              fullLength={true}
              label={'No of floors'}
              keyboardType={'numeric'}
            />
            {touched?.no_of_floors && errors?.no_of_floors && (
              <Text style={Styles.error}>{String(errors?.no_of_floors)}</Text>
            )}
            <Text style={Styles.fieldLabel}>Year built</Text>
            <YearPicker
              onYearChange={(year: any) => {
                setValues({...values, year_built: year});
              }}
              selectedYear={values?.year_built}
            />
            {touched?.year_built && errors?.year_built && (
              <Text style={Styles.error}>{String(errors?.year_built)}</Text>
            )}
            <Text style={Styles.fieldLabel}>Year last renovated</Text>
            <YearPicker
              onYearChange={(year: any) => {
                setValues({...values, year_last_renovated: year});
              }}
              selectedYear={values?.year_last_renovated}
            />
            {touched?.year_last_renovated && errors?.year_last_renovated && (
              <Text style={Styles.error}>
                {String(errors?.year_last_renovated)}
              </Text>
            )}
            <Text style={Styles.fieldLabel}>Year last expanded</Text>
            <YearPicker
              onYearChange={(year: any) => {
                setValues({...values, year_last_expanded: year});
              }}
              selectedYear={values?.year_last_expanded}
            />
            {touched?.year_last_expanded && errors?.year_last_expanded && (
              <Text style={Styles.error}>
                {String(errors?.year_last_expanded)}
              </Text>
            )}
            <Text style={Styles.fieldLabel}>Front Photo</Text>
            <TouchableOpacity
              style={[
                styles.addFileButton,
                {
                  justifyContent:
                    values?.front_photo == '' ? 'center' : 'space-between',
                },
              ]}
              onPress={() => {
                if (values?.front_photo == '') {
                  handleDocumentSelection('front_photo');
                } else {
                  setSelectedImage([
                    {
                      uri:
                        values?.front_photo?.fileCopyUri || values.front_photo,
                    },
                  ]);
                  setModalVisible(true);
                }
              }}>
              {values?.front_photo == '' ? (
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
                    {values?.front_photo?.name || ''}
                  </Text>
                  <AntDesign
                    name="close"
                    size={18}
                    color={primary}
                    onPress={() => setValues({...values, front_photo: ''})}
                  />
                </>
              )}
            </TouchableOpacity>
            {touched?.front_photo && errors?.front_photo && (
              <Text style={Styles.error}>{String(errors?.front_photo)}</Text>
            )}
            <Text style={Styles.fieldLabel}>Back Photo</Text>
            <TouchableOpacity
              style={[
                styles.addFileButton,
                {
                  justifyContent:
                    values?.back_photo == '' ? 'center' : 'space-between',
                },
              ]}
              onPress={() => {
                if (values?.back_photo == '') {
                  handleDocumentSelection('back_photo');
                } else {
                  setSelectedImage([
                    {
                      uri: values?.back_photo?.uri || values.back_photo,
                    },
                  ]);
                  setModalVisible(true);
                }
              }}>
              {values?.back_photo == '' ? (
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
                    {values?.back_photo?.name || ''}
                  </Text>
                  <AntDesign
                    name="close"
                    size={18}
                    color={primary}
                    onPress={() => setValues({...values, back_photo: ''})}
                  />
                </>
              )}
            </TouchableOpacity>
            {touched?.back_photo && errors?.back_photo && (
              <Text style={Styles.error}>{String(errors?.back_photo)}</Text>
            )}
            <Text style={Styles.fieldLabel}>Neightbourhood Photo</Text>
            <TouchableOpacity
              style={[
                styles.addFileButton,
                {
                  justifyContent:
                    values?.neighbourhood_photo == ''
                      ? 'center'
                      : 'space-between',
                },
              ]}
              onPress={() => {
                if (values?.neighbourhood_photo == '') {
                  handleDocumentSelection('neighbourhood_photo');
                } else {
                  setSelectedImage([
                    {
                      uri:
                        values?.neighbourhood_photo?.uri ||
                        values.neighbourhood_photo,
                    },
                  ]);
                  setModalVisible(true);
                }
              }}>
              {values?.neighbourhood_photo == '' ? (
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
                    {values?.neighbourhood_photo?.name || ''}
                  </Text>
                  <AntDesign
                    name="close"
                    size={18}
                    color={primary}
                    onPress={() =>
                      setValues({...values, neighbourhood_photo: ''})
                    }
                  />
                </>
              )}
            </TouchableOpacity>
            {touched?.neighbourhood_photo && errors?.neighbourhood_photo && (
              <Text style={Styles.error}>
                {String(errors?.neighbourhood_photo)}
              </Text>
            )}
            <Text style={Styles.fieldLabel}>Inside living Photo</Text>
            <TouchableOpacity
              style={[
                styles.addFileButton,
                {
                  justifyContent:
                    values?.inside_living_photo == ''
                      ? 'center'
                      : 'space-between',
                },
              ]}
              onPress={() => {
                if (values?.inside_living_photo == '') {
                  handleDocumentSelection('inside_living_photo');
                } else {
                  setSelectedImage([
                    {
                      uri:
                        values?.inside_living_photo?.uri ||
                        values.inside_living_photo,
                    },
                  ]);
                  setModalVisible(true);
                }
              }}>
              {values?.inside_living_photo == '' ? (
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
                    {values?.inside_living_photo?.name || ''}
                  </Text>
                  <AntDesign
                    name="close"
                    size={18}
                    color={primary}
                    onPress={() =>
                      setValues({...values, inside_living_photo: ''})
                    }
                  />
                </>
              )}
            </TouchableOpacity>
            {touched?.inside_living_photo && errors?.inside_living_photo && (
              <Text style={Styles.error}>
                {String(errors?.inside_living_photo)}
              </Text>
            )}
            <Text style={Styles.fieldLabel}>Kitchen Photo</Text>
            <TouchableOpacity
              style={[
                styles.addFileButton,
                {
                  justifyContent:
                    values?.kitchen_photo == '' ? 'center' : 'space-between',
                },
              ]}
              onPress={() => {
                if (values?.kitchen_photo == '') {
                  handleDocumentSelection('kitchen_photo');
                } else {
                  setSelectedImage([
                    {
                      uri: values?.kitchen_photo?.uri || values.kitchen_photo,
                    },
                  ]);
                  setModalVisible(true);
                }
              }}>
              {values?.kitchen_photo == '' ? (
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
                    {values?.kitchen_photo?.name || ''}
                  </Text>
                  <AntDesign
                    name="close"
                    size={18}
                    color={primary}
                    onPress={() => setValues({...values, kitchen_photo: ''})}
                  />
                </>
              )}
            </TouchableOpacity>
            {touched?.kitchen_photo && errors?.kitchen_photo && (
              <Text style={Styles.error}>{String(errors?.kitchen_photo)}</Text>
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
                setValues({...values, amenities: item})
              }
              selectedd={values?.amenities}
              infoName={'Amenities'}
            />
            {touched?.amenities && errors?.amenities && (
              <Text style={Styles.error}>{String(errors?.amenities)}</Text>
            )}
            <Input
              onChangeText={handleChange('household_needs')}
              value={String(values?.household_needs)}
              fullLength={true}
              label={'Household Needs'}
              keyboardType={'default'}
            />
            {touched?.household_needs && errors?.household_needs && (
              <Text style={Styles.error}>
                {String(errors?.household_needs)}
              </Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <CustomButton onPress={handleSubmit} btnText={'Next'} />
      </View>
      <ImageView
        images={selectedImage !== null ? selectedImage : []}
        imageIndex={0}
        visible={modalViisble}
        onRequestClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default Housing;

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
