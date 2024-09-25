import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useWindowDimensions,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Geolocation from 'react-native-geolocation-service';
import DocumentPicker, {types} from 'react-native-document-picker';
import {Styles, width} from '../../styles/globalStyles';
import {fontFamilyBold, fontFamilyRegular} from '../../styles/fontStyle';
import {dark_grey, primary} from '../../styles/colors';
import Input from '../../Components/Inputs/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CountryPicker} from 'react-native-country-codes-picker';
import Customdropdown from '../../Components/CustomDropdown/Customdropdown';
import CustomButton from '../../Components/CustomButton/CustomButton';

const SignUp = ({navigation}: {navigation: any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [collapsible, setCollapsible] = useState({
    personalInfoVisible: true,
    registrationInfo: false,
    familyVisible: false,
    attachmentsVisible: false,
  });
  const [documents, setDocuments] = useState({address_proof: null});
  const [dropdown, setDropdown] = useState({
    gender: false,
    maritalStatus: false,
    dob: false,
    dlexpiry: false,
    country: false,
    state: false,
    city: false,
    tandc: false,
    documentType: false,
  });
  const documentType = [
    {
      label: 'Kad Pengenalan / MyKad (Identity Card)',
      value: 'Kad Pengenalan / MyKad (Identity Card)',
    },
    {label: 'Pasport (Passport)', value: 'Pasport (Passport)'},
    {
      label: 'Lesen Memandu (Driving Licence)',
      value: 'Lesen Memandu (Driving Licence)',
    },
  ];
  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.images],
        allowMultiSelection: false,
      });
      console.log('responseeee', response);
      setDocuments({...documents, address_proof: response[0]});
    } catch (err) {
      console.warn(err);
    }
  }, []);
  let signupSchema = Yup.object().shape({
    first_name: Yup.string().required('First Name is required'),
    last_name: Yup.string().required('Last Name is required'),
    village_name: Yup.string().required('Village name is required'),
    country_name: Yup.string().required('Country name is required'),
    email: Yup.string().required('Email ID is required').label('Email'),
    land_measurement: Yup.string().required('Land measurement is required'),
    phone: Yup.string().required('Mobile number is required'),
    number_of_members: Yup.number()
      .max(20, 'Number of members cannot be greater than 20!')
      .min(1, 'At least one member is required')
      .required('Number of member is required'),
    members: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required('Member name is required'),
          age: Yup.string().required('Member age is required'),
          gender: Yup.string().required('Member gender is required'),
        }),
      )
      .required('Members is required')
      .min(1, 'At least one member is required'),
    document_type: Yup.string().required('Document Type is required!'),
    social_security_number: Yup.string().required(
      'Social security number is required',
    ),
    address: Yup.string().required('Address is required'),
    street_address: Yup.string().required('Street Address is required'),
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
      phone: '',
      country_name: '',
      email: '',
      address: '',
      first_name: '',
      land_measurement: '',
      last_name: '',
      members: [],
      number_of_members: 0,
      document_type: '',
      social_security_number: '',
      village_name: '',
      street_address: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      // Here you can call your API to register the user
      // Reset form after successful registration
      resetForm();
      ToastAndroid.show('Registration successful!', ToastAndroid.SHORT);
    },
  });
  const openCollapsible = async () => {
    const keysToCheck = [
      'first_name',
      'last_name',
      'email',
      'phone',
      'address',
    ];
    const keysToCheckReg = [
      'country_name',
      'village_name',
      'street_address',
      'land_measurement',
      'social_security_number',
      'document_type',
    ];
    const keysToFamily = ['number_of_members'];
    const hasPersonalKey = await keysToCheck.some(key => key in errors);
    const hasRegisterKey = await keysToCheckReg.some(key => key in errors);
    const hasFamilyKey = await keysToFamily.some(key => key in errors);
    setCollapsible({
      ...collapsible,
      personalInfoVisible: !!hasPersonalKey,
      registrationInfo: !!hasRegisterKey,
      familyVisible: !!hasFamilyKey,
      attachmentsVisible: documents?.address_proof == null ? true : false,
    });
    if(documents?.address_proof==null){
        return;
    }else{
        handleSubmit();
    }
  };
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
          position => {
            console.log(position);
            if (!values?.address.length)
              setValues({
                ...values,
                address: `${position.coords.latitude},${position.coords.longitude}`,
              });
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setValues({...values, address: ''});
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 120}}>
          <View style={Styles.mainContainer}>
            <TouchableOpacity
              style={[styles.headerContainer]}
              onPress={() =>
                setCollapsible({
                  ...collapsible,
                  personalInfoVisible: !collapsible.personalInfoVisible,
                })
              }>
              <Text style={styles.collapsibleHeaderText}>Personal Info</Text>
              <AntDesign
                name={collapsible.personalInfoVisible ? 'up' : 'down'}
                size={20}
                color={'#133040'}
                style={{alignSelf: 'center'}}
                onPress={() =>
                  setCollapsible({
                    ...collapsible,
                    personalInfoVisible: !collapsible.personalInfoVisible,
                  })
                }
              />
            </TouchableOpacity>
            {collapsible?.personalInfoVisible && (
              <View>
                <View
                  style={[Styles.twoFieldsContainer, {marginTop: 0, gap: 20}]}>
                  <View>
                    <Input
                      onChangeText={handleChange('first_name')}
                      value={values?.first_name}
                      placeholder="Enter first name"
                      fullLength={false}
                      label={'First name'}
                      width_={width / 2.5}
                    />
                    {touched?.first_name && errors?.first_name && (
                      <Text style={Styles.error}>
                        {String(errors?.first_name)}
                      </Text>
                    )}
                  </View>
                  <View>
                    <Input
                      onChangeText={handleChange('last_name')}
                      value={values?.last_name}
                      placeholder="Enter last name"
                      fullLength={false}
                      label={'Last name'}
                      width_={width / 2.5}
                    />
                    {touched?.last_name && errors?.last_name && (
                      <Text style={Styles.error}>
                        {String(errors?.last_name)}
                      </Text>
                    )}
                  </View>
                </View>
                <Input
                  onChangeText={handleChange('email')}
                  value={values?.email}
                  placeholder="Enter email"
                  fullLength={true}
                  label={'Email Address'}
                />
                {touched?.email && errors?.email && (
                  <Text style={Styles.error}>{String(errors?.email)}</Text>
                )}
                <Input
                  onChangeText={handleChange('phone')}
                  value={values?.phone}
                  placeholder="Enter phone"
                  fullLength={true}
                  phone={() => setShow(true)}
                  countryCode={countryCode}
                  label={'Phone Number'}
                />
                {touched?.phone && errors?.phone && (
                  <Text style={Styles.error}>{String(errors?.phone)}</Text>
                )}
                <Input
                  onChangeText={handleChange('address')}
                  value={values?.address}
                  placeholder="Enter address"
                  fullLength={true}
                  label={'Address'}
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
                {touched?.address && errors?.address && (
                  <Text style={Styles.error}>{String(errors?.address)}</Text>
                )}
              </View>
            )}
            <TouchableOpacity
              style={[styles.headerContainer, {marginTop: '8%'}]}
              onPress={() =>
                setCollapsible({
                  ...collapsible,
                  familyVisible: !collapsible.familyVisible,
                })
              }>
              <Text style={styles.collapsibleHeaderText}>Family Info</Text>
              <AntDesign
                name={collapsible.familyVisible ? 'up' : 'down'}
                size={20}
                color={'#133040'}
                style={{alignSelf: 'center'}}
                onPress={() =>
                  setCollapsible({
                    ...collapsible,
                    familyVisible: !collapsible.familyVisible,
                  })
                }
              />
            </TouchableOpacity>
            {collapsible?.familyVisible && (
              <View>
                <Input
                  onChangeText={handleChange('number_of_members')}
                  value={values?.number_of_members}
                  placeholder="Enter number of members"
                  fullLength={true}
                  keyboardType="numeric"
                  label={'Number of members'}
                />
                {touched?.number_of_members && errors?.number_of_members && (
                  <Text style={Styles.error}>
                    {String(errors?.number_of_members)}
                  </Text>
                )}
                {Array.from({
                  length: parseInt(values?.number_of_members || 0),
                }).map((_, index) => {
                  return (
                    <View key={index}>
                      <Input
                        onChangeText={handleChange(`members[${index}].name`)}
                        value={values.members[index]?.name}
                        placeholder={`Enter name for member ${index + 1}`}
                        fullLength={true}
                        label={`Name for member ${index + 1}`}
                      />
                      {touched.members?.[index]?.name &&
                        errors.members?.[index]?.name && (
                          <Text style={Styles.error}>
                            {String(errors.members[index].name)}
                          </Text>
                        )}

                      <Input
                        onChangeText={handleChange(`members[${index}].age`)}
                        value={values.members[index]?.age}
                        placeholder={`Enter age for member ${index + 1}`}
                        fullLength={true}
                        keyboardType="numeric"
                        label={`Age for member ${index + 1}`}
                      />
                      {touched.members?.[index]?.age &&
                        errors.members?.[index]?.age && (
                          <Text style={Styles.error}>
                            {String(errors.members[index].age)}
                          </Text>
                        )}

                      <Customdropdown
                        data={[
                          {id: 1, label: 'Male', value: 'Male'},
                          {id: 2, label: 'Female', value: 'Female'},
                          {id: 3, label: 'Others', value: 'Others'},
                        ]}
                        value={values.members[index]?.gender}
                        label={'Gender for member' + ' ' + (index + 1)}
                        // onChange={handleChange(`members[${index}].gender`)}
                        onChange={(value: any) => {
                          setValues({
                            ...values,
                            members: [
                              ...values.members.slice(0, index),
                              {...values.members[index], gender: value?.value},
                              ...values.members.slice(index + 1),
                            ],
                          });
                        }}
                      />
                      {touched.members?.[index]?.gender &&
                        errors.members?.[index]?.gender && (
                          <Text style={Styles.error}>
                            {String(errors.members[index].gender)}
                          </Text>
                        )}
                    </View>
                  );
                })}
                {/* {touched?.members && errors?.members && (
                  <Text style={Styles.error}>{String(errors?.members)}</Text>
                )} */}
              </View>
            )}
            <TouchableOpacity
              style={[styles.headerContainer, {marginTop: '8%'}]}
              onPress={() =>
                setCollapsible({
                  ...collapsible,
                  registrationInfo: !collapsible.registrationInfo,
                })
              }>
              <Text style={styles.collapsibleHeaderText}>
                Registration Info
              </Text>
              <AntDesign
                name={collapsible.registrationInfo ? 'up' : 'down'}
                size={20}
                color={'#133040'}
                style={{alignSelf: 'center'}}
                onPress={() =>
                  setCollapsible({
                    ...collapsible,
                    registrationInfo: !collapsible.registrationInfo,
                  })
                }
              />
            </TouchableOpacity>
            {collapsible?.registrationInfo && (
              <View>
                <Input
                  onChangeText={handleChange('country_name')}
                  value={values?.country_name}
                  placeholder="Enter country name"
                  fullLength={true}
                  label={'Country name'}
                />
                {touched?.country_name && errors?.country_name && (
                  <Text style={Styles.error}>
                    {String(errors?.country_name)}
                  </Text>
                )}
                <Input
                  onChangeText={handleChange('village_name')}
                  value={values?.village_name}
                  placeholder="Enter village name"
                  fullLength={true}
                  label={'Village name'}
                />
                {touched?.village_name && errors?.village_name && (
                  <Text style={Styles.error}>
                    {String(errors?.village_name)}
                  </Text>
                )}
                <Input
                  onChangeText={handleChange('street_address')}
                  value={values?.street_address}
                  placeholder="Enter street address"
                  fullLength={true}
                  label={'Street address'}
                />
                {touched?.street_address && errors?.street_address && (
                  <Text style={Styles.error}>
                    {String(errors?.street_address)}
                  </Text>
                )}
                <Customdropdown
                  data={[
                    {id: 1, label: 'Hecter', value: 'hc'},
                    {id: 2, label: 'Acres', value: 'ac'},
                    {id: 3, label: 'Bigha', value: 'bigha'},
                  ]}
                  value={values.land_measurement}
                  label={'Land measurement'}
                  // onChange={handleChange(`members[${index}].gender`)}
                  onChange={(value: any) => {
                    setValues({
                      ...values,
                      land_measurement: value?.value,
                    });
                  }}
                />
                {touched?.land_measurement && errors?.land_measurement && (
                  <Text style={Styles.error}>
                    {String(errors?.land_measurement)}
                  </Text>
                )}
                <Input
                  onChangeText={handleChange('social_security_number')}
                  value={values?.social_security_number}
                  placeholder="Enter social security number"
                  fullLength={true}
                  keyboardType="numeric"
                  label={'Social security number'}
                />
                {touched?.social_security_number &&
                  errors?.social_security_number && (
                    <Text style={Styles.error}>
                      {String(errors?.social_security_number)}
                    </Text>
                  )}
                <Customdropdown
                  data={documentType}
                  value={values.document_type}
                  label={'Document Type'}
                  onChange={(value: any) => {
                    setValues({
                      ...values,
                      document_type: value?.value,
                    });
                  }}
                />
                {touched?.document_type && errors?.document_type && (
                  <Text style={Styles.error}>
                    {String(errors?.document_type)}
                  </Text>
                )}
              </View>
            )}
            <TouchableOpacity
              style={[styles.headerContainer, {marginTop: '8%'}]}
              onPress={() =>
                setCollapsible({
                  ...collapsible,
                  attachmentsVisible: !collapsible.attachmentsVisible,
                })
              }>
              <Text style={styles.collapsibleHeaderText}>Attachments</Text>
              <AntDesign
                name={collapsible.attachmentsVisible ? 'up' : 'down'}
                size={20}
                color={'#133040'}
                style={{alignSelf: 'center'}}
                onPress={() =>
                  setCollapsible({
                    ...collapsible,
                    attachmentsVisible: !collapsible.attachmentsVisible,
                  })
                }
              />
            </TouchableOpacity>
            {collapsible.attachmentsVisible && (
              <View style={[styles.middleContainer]}>
                <Text
                  style={[
                    styles.subheading,
                    {marginBottom: 20, color: primary},
                  ]}>
                  Address Proof
                </Text>
                <TouchableOpacity
                  style={[
                    styles.addFileButton,
                    {
                      justifyContent:
                        documents?.address_proof == null
                          ? 'center'
                          : 'space-between',
                    },
                  ]}
                  onPress={() => {
                    if (documents.address_proof == null) {
                      handleDocumentSelection();
                    } else {
                      setDocuments({...documents, address_proof: null});
                    }
                  }}>
                  {documents?.address_proof == null ? (
                    <>
                      <AntDesign name="upload" size={18} color={primary} />
                      <Text style={styles.butnText}>Add File</Text>
                    </>
                  ) : (
                    <>
                      <Text
                        style={[
                          Styles.fieldLabel,
                          {marginBottom: 0, marginTop: 0, width: width / 1.6},
                        ]}>
                        {documents?.address_proof?.name || ''}
                      </Text>
                      <AntDesign
                        name="close"
                        size={18}
                        color={primary}
                        onPress={() =>
                          setDocuments({...documents, address_proof: ''})
                        }
                      />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn, {elevation: 5}]}>
        <CustomButton onPress={openCollapsible} btnText={'SignUp'} />
      </View>
      <CountryPicker
        show={show}
        lang={'en'}
        showOnly={['IN', 'MY', 'BT']}
        onBackdropPress={() => setShow(false)}
        style={{
          // Styles for whole modal [View]
          modal: {
            height: 500,
            // backgroundColor: 'red',
          },
          textInput: {
            height: 50,
            color: '#000',
            // borderRadius: 0,
          },
          // Styles for country button [TouchableOpacity]
          countryButtonStyles: {
            height: 70,
          },
          dialCode: {
            color: 'black',
          },
          countryName: {
            color: 'black',
          },
          searchMessageText: {
            color: 'black',
          },
        }}
        pickerButtonOnPress={(item: any) => {
          setCountryCode(item.dial_code);
          setShow(false);
        }}
      />
    </View>
  );
};

export default SignUp;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    heading: {
      fontSize: 20 / fontScale,
      fontFamily: fontFamilyBold,
      color: dark_grey,
      textAlign: 'left',
    },
    subheading: {
      fontSize: 16 / fontScale,
      color: dark_grey,
      fontFamily: fontFamilyRegular,
      alignSelf: 'flex-start',
      textAlign: 'left',
      marginTop: '2%',
    },
    headerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignContent: 'center',
    },
    collapsibleHeaderText: {
      fontSize: 18 / fontScale,
      fontFamily: fontFamilyBold,
      color: '#133040',
    },
    middleContainer: {
      marginTop: '3%',
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
      borderColor: '#c9ccd3',
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
  });
