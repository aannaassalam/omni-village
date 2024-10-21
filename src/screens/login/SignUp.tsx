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
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import countryToCurrency, {Currencies, Countries} from 'country-to-currency';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Geolocation from 'react-native-geolocation-service';
import DocumentPicker, {types} from 'react-native-document-picker';
import {Styles, width} from '../../styles/globalStyles';
import {fontFamilyBold, fontFamilyRegular} from '../../styles/fontStyle';
import {borderColor, dark_grey, primary} from '../../styles/colors';
import Input from '../../Components/Inputs/Input';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CountryPicker} from 'react-native-country-codes-picker';
import Customdropdown from '../../Components/CustomDropdown/Customdropdown';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {
  edit_user_details,
  get_land_measurement,
  get_user_details,
  get_village,
  send_otp,
  signup_otp,
} from '../../apis/auth';
import {useMutation, useQuery} from '@tanstack/react-query';
import {useDispatch, useSelector} from 'react-redux';
import {land, reqSuccess} from '../../redux/auth/actions';
import EncryptedStorage from 'react-native-encrypted-storage';
import { useTranslation } from 'react-i18next';

const SignUp = ({navigation}: {navigation: any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const dispatch = useDispatch();
  const authState = useSelector((state:any)=>state.authState)
  const [show, setShow] = useState(false);
  const [countryCode, setCountryCode] = useState('+91');
  const [countryInfo, setCoutryInfo] = useState(null);
  const [fileSelected, setFileSelected] = useState('');
  const {t} = useTranslation()
  const [messages, setMessages] = useState({
    verify_msg: '',
  });
  const [collapsible, setCollapsible] = useState({
    personalInfoVisible: true,
    registrationInfo: false,
    familyVisible: false,
    attachmentsVisible: true,
  });
  const [documents, setDocuments] = useState({
    address_proof: null,
    field_officer_document: null,
  });
  const [dropdown, setDropdown] = useState({
    sendtOtp: false,
    verifyOtp: false,
    otpLoading: false,
    otp: '',
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
  const {data} = useQuery({
    queryKey: ['measurement'],
    queryFn: () => get_land_measurement(),
  })
   const {data: village,  dataUpdatedAt} = useQuery({
     queryKey: ['village', countryInfo?.name?.en || 'India'],
     queryFn: () => get_village({country: countryInfo?.name?.en || 'India'}),
     enabled: true,
   });
  useEffect(()=>{
    dispatch(land(data))
  },[data])
  const {mutate: otp} = useMutation({
    mutationFn: (data: any) => send_otp(data),
    onSuccess: data => {
    },
    onError: error => {
      ToastAndroid.show(error?.response?.data?.message, ToastAndroid.BOTTOM);
      console.log(
        'error?.response?.data?.message',error,
        error?.response?.data?.message,
      );
    },
  });
  const {mutate: otp_verify} = useMutation({
    mutationFn: (data: any) => signup_otp(data),
    onSuccess: data => {
      setDropdown({
        ...dropdown,
        sendtOtp: false,
        verifyOtp: true,
        otpLoading: false,
      });
    },
    onError: error => {
      setDropdown({...dropdown, otpLoading: false});
      setMessages({
        ...messages,
        verify_msg: error?.response?.data?.message || 'Invalid OTP',
      });
      ToastAndroid.show('Invalid OTP', ToastAndroid.TOP);
      console.log(
        'error?.response?.data?.message',
        error,
        error?.response?.data?.message,
      );
    },
  });
  const {mutate: register} = useMutation({
    mutationFn: (data: any) => edit_user_details(data),
    onSuccess: async(data) => {
      await get_user_details().then(async profile => {
        console.log('profileee', profile);
        const userData = JSON.stringify({
          token: null,
          id: profile?._id,
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          email: profile?.email,
          phone: profile?.phone,
          gender: profile?.gender,
          address: profile?.address,
          country: profile?.country,
          country_code: profile?.country_code,
          currency: profile?.currency,
          document_type: profile?.document_type,
          social_security_number: profile?.social_security_number,
          village_name: profile?.village_name,
          village_governing_body: profile?.village_governing_body,
          street_address: profile?.street_address,
          land_measurement: profile?.land_measurement,
          land_measurement_symbol: profile?.land_measurement_symbol,
          members: profile?.members,
          number_of_members: profile?.number_of_members,
          total_land: profile?.total_land,
          sub_area: profile?.sub_area,
        });
        await EncryptedStorage.setItem('omniVillageToken', userData);
        dispatch(
          reqSuccess(
            null,
            profile?._id,
            profile?.first_name,
            profile?.last_name,
            profile?.email,
            profile?.phone,
            profile?.gender,
            profile?.address,
            profile?.country,
            profile?.country_code,
            profile?.currency,
            profile?.document_type,
            profile?.social_security_number,
            profile?.village_name,
            profile?.village_governing_body,
            profile?.street_address,
            profile?.land_measurement,
            profile?.land_measurement_symbol,
            profile?.members,
            profile?.number_of_members,
            profile?.total_land,
            profile?.sub_area,
          ),
        );
      });
    },
    onError: error => {
      console.log(
        'error?.response?.data?.message register',error,
        error?.response?.data?.message,
      );
      // setMessage(error?.response?.data?.message);
      //  navigation.navigate('verifyOtp', {mobile: values?.phone});
    },
  });
  const handleDocumentSelection = async (document_name: any) => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.images],
        allowMultiSelection: false,
      });
      console.log('filsss', fileSelected);
      if (document_name === 'address_proof') {
        console.log('hereree');
        setDocuments({...documents, address_proof: response[0]});
      } else if (document_name === 'field_officer_document') {
        console.log('first');
        setDocuments({...documents, field_officer_document: response[0]});
      }
    } catch (err) {
      console.warn(err);
    }
  };
  let signupSchema = Yup.object().shape({
    first_name: Yup.string().required(t('first_name is required')),
    last_name: Yup.string().required(t('last_name is required')),
    village_name: Yup.string().required(t('village_name is required')),
    land_measurement: Yup.string().required(t('Land measurement is required')),
    land_measurement_symbol: Yup.string().required(
      'Land measurement unit symbol is required',
    ),
    phone: Yup.string().required(t('phone number is required')),
    number_of_members: Yup.number()
      .max(20, 'Number of members cannot be greater than 20!')
      .min(1, 'At least one member is required')
      .required(t('number_of_members is required')),
    members: Yup.array()
      .of(
        Yup.object().shape({
          name: Yup.string().required(`${t('member name')} is required`),
          age: Yup.number()
            .required(`${t('member age')} is required`)
            .positive('Age must be a positive number'),
          gender: Yup.string().required(`${t('member gender')} is required`),
        }),
      )
      .when('number_of_members', {
        is: num => num > 0, // Only validate if the number_of_members is greater than 0
        then: schema =>
          schema
            .min(
              Yup.ref('number_of_members'),
              'You must provide details for each member',
            )
            .max(
              Yup.ref('number_of_members'),
              'You have provided more members than specified',
            ),
        otherwise: schema => schema.strip(), // Remove validation if no members are needed
      }),
    document_type: Yup.string().required('Document Type is required!'),
    social_security_number: Yup.string().required(
      t('social_security_number is required'),
    ),
    address: Yup.string().required(t('address is required')),
    street_address: Yup.string().required(t('street address is required')),
    village_governing_body: Yup.boolean().required(
      t('Village governing body required'),
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
      phone: '',
      address: '',
      first_name: '',
      land_measurement: '',
      land_measurement_symbol: '',
      last_name: '',
      members: [],
      number_of_members: 0,
      document_type: '',
      social_security_number: '',
      village_name: '',
      village_governing_body: false,
      street_address: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      // Here you can call your API to register the user
      // Reset form after successful registration
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key === 'members') {
          formData.append('members', JSON.stringify(values[key]));
        } else {
          formData.append(key, values[key]);
        }
      });
      
      if(values?.village_governing_body){
         formData.append('field_officer_document', {
           uri: documents?.field_officer_document?.uri || '',
           type: documents?.field_officer_document?.type || '',
           filename: documents?.field_officer_document?.name || '',
           name: 'field_officer_document',
         });
          formData.append('address_proof', {
            uri: documents?.address_proof?.uri || '',
            type: documents?.address_proof?.type || '',
            filename: documents?.address_proof?.name || '',
            name: 'address_proof',
          });
      }else{
        formData.append('address_proof', {
          uri: documents?.address_proof?.uri || '',
          type: documents?.address_proof?.type || '',
          filename: documents?.address_proof?.name || '',
          name: 'address_proof',
        });
      }
      if (dropdown?.verifyOtp) {
        // resetForm();
        ToastAndroid.show(t('successfully registered'), ToastAndroid.SHORT);
        register(formData);
      } else if (!documents?.address_proof || values?.village_governing_body ===true && !documents?.field_officer_document) {
        ToastAndroid.show(t('add proof attachments'), ToastAndroid.SHORT);
      } else {
        ToastAndroid.show(
          t('Please verify you mobile number first!'),
          ToastAndroid.SHORT,
        );
      }
    },
  });
  const openCollapsible = useCallback(async () => {
    console.log('errorrrrr', errors);
    const keysToCheck = [
      'first_name',
      'last_name',
      'phone',
      'address',
    ];
    const keysToCheckReg = [
      'village_name',
      'street_address',
      'land_measurement',
      'land_measurement_symbol',
      'social_security_number',
      'document_type',
    ];
    const keysToFamily = ['number_of_members', 'members'];
    const hasPersonalKey = await keysToCheck.some(key => key in errors);
    const hasRegisterKey = await keysToCheckReg.some(key => key in errors);
    const hasFamilyKey = await keysToFamily.some(key => key in errors);
    setCollapsible({
      ...collapsible,
      personalInfoVisible: !!hasPersonalKey,
      registrationInfo: !!hasRegisterKey,
      familyVisible: !!hasFamilyKey,
      attachmentsVisible:
        documents?.address_proof == null ||
        (values?.village_governing_body &&
          documents?.field_officer_document == null)
          ? true
          : false,
    });
    handleSubmit();
  }, [errors]);
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
              <Text style={styles.collapsibleHeaderText}>
                {t('personal info')}
              </Text>
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
                      // placeholder="Enter first name"
                      fullLength={false}
                      label={t('first name')}
                      width_={width / 2.38}
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
                      // placeholder="Enter last name"
                      fullLength={false}
                      label={t('last name')}
                      width_={width / 2.39}
                    />
                    {touched?.last_name && errors?.last_name && (
                      <Text style={Styles.error}>
                        {String(errors?.last_name)}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  style={[Styles.twoFieldsContainer, {marginTop: 0, gap: 4}]}>
                  <View>
                    <Input
                      onChangeText={handleChange('phone')}
                      value={values?.phone}
                      // placeholder="Enter phone"
                      fullLength={false}
                      phone={() => setShow(true)}
                      countryCode={countryCode}
                      label={t('phone')}
                      editable={dropdown?.verifyOtp ? false : true}
                      style={{
                        backgroundColor: dropdown?.verifyOtp
                          ? borderColor
                          : 'white',
                        borderRadius: 8,
                        width: '100%',
                      }}
                      keyboardType="numeric"
                      width_={dropdown?.verifyOtp ? width / 1.3 : width / 1.6}
                      maxLength={15}
                      // isRight={
                      //   <AntDesign
                      //     name="down"
                      //     size={20}
                      //     color={primary}
                      //     style={{marginRight: 90}}
                      //   />
                      // }
                    />
                    {touched?.phone && errors?.phone && (
                      <Text style={Styles.error}>{String(errors?.phone)}</Text>
                    )}
                  </View>
                  {dropdown?.verifyOtp ? (
                    <AntDesign
                      name="checkcircle"
                      size={30}
                      color={primary}
                      style={{marginTop: '10%', marginLeft: '5%'}}
                    />
                  ) : (
                    <View style={{marginTop: '10%'}}>
                      <CustomButton
                        onPress={() => {
                          if (values.phone) {
                            setDropdown({...dropdown, sendtOtp: true});
                            otp({
                              country_code: countryCode,
                              phone: values?.phone,
                              type: 'register',
                            });
                          } else {
                            ToastAndroid.show(
                              t('enter phone number'),
                              ToastAndroid.SHORT,
                            );
                          }
                        }}
                        btnText={t('send otp')}
                        style={{
                          width: '80%',
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  )}
                </View>
                {dropdown?.sendtOtp ? (
                  <View
                    style={[Styles.twoFieldsContainer, {marginTop: 0, gap: 4}]}>
                    <View>
                      <Input
                        onChangeText={e => setDropdown({...dropdown, otp: e})}
                        value={dropdown?.otp}
                        // placeholder="Enter otp"
                        fullLength={false}
                        label={'OTP'}
                        keyboardType="numeric"
                        maxLength={4}
                        width_={width / 1.6}
                      />
                    </View>
                    <View style={{marginTop: '10%'}}>
                      <CustomButton
                        onPress={() => {
                          if (dropdown.otp) {
                            setDropdown({...dropdown, otpLoading: true});
                            otp_verify({
                              country_code: countryCode,
                              phone: parseInt(values?.phone),
                              currency:
                                countryToCurrency[countryInfo?.code || 'IN'],
                              country: countryInfo?.name?.en || 'India',
                              otp: dropdown?.otp,
                            });
                          } else {
                            ToastAndroid.show(
                              t('enter otp recieved in'),
                              ToastAndroid.SHORT,
                            );
                          }
                        }}
                        loading={dropdown?.otpLoading}
                        btnText={t('verify otp')}
                        style={{
                          width: '80%',
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  </View>
                ) : null}
                <Input
                  onChangeText={handleChange('address')}
                  value={values?.address}
                  // placeholder="Enter address"
                  fullLength={true}
                  label={t('address')}
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
              <Text style={styles.collapsibleHeaderText}>
                {t('family info')}
              </Text>
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
                  // placeholder="Enter number of members"
                  fullLength={true}
                  keyboardType="numeric"
                  label={t('number of family members')}
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
                        // placeholder={`Enter name for member ${index + 1}`}
                        fullLength={true}
                        label={`${t('member name')} ${index + 1}`}
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
                        // placeholder={`Enter age for member ${index + 1}`}
                        fullLength={true}
                        keyboardType="numeric"
                        label={`${t('member age')} ${index + 1}`}
                      />
                      {touched.members?.[index]?.age &&
                        errors.members?.[index]?.age && (
                          <Text style={Styles.error}>
                            {String(errors.members[index].age)}
                          </Text>
                        )}

                      <Customdropdown
                        data={[
                          {id: 1, label: t('Male'), value: 'Male'},
                          {id: 2, label: t('Female'), value: 'Female'},
                          {id: 3, label: t('Other'), value: 'Others'},
                        ]}
                        value={values.members[index]?.gender}
                        label={`${t('member gender')} ${index + 1}`}
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
                {t('household info')}
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
                <Customdropdown
                  data={village.map((item: any) => {
                    return {id: item._id, label: item.name, value: item.name};
                  })}
                  value={values.village_name}
                  label={t('village name')}
                  // onChange={handleChange(`members[${index}].gender`)}
                  onChange={(value: any) => {
                    setValues({
                      ...values,
                      village_name: value?.value,
                    });
                  }}
                />
                {touched?.village_name && errors?.village_name && (
                  <Text style={Styles.error}>
                    {String(errors?.village_name)}
                  </Text>
                )}
                <Input
                  onChangeText={handleChange('street_address')}
                  value={values?.street_address}
                  // placeholder="Enter street address"
                  fullLength={true}
                  label={t('street address')}
                />
                {touched?.street_address && errors?.street_address && (
                  <Text style={Styles.error}>
                    {String(errors?.street_address)}
                  </Text>
                )}
                <Customdropdown
                  data={authState?.land_measurements}
                  value={values.land_measurement_symbol}
                  label={t('land measurement')}
                  // onChange={handleChange(`members[${index}].gender`)}
                  onChange={(value: any) => {
                    setValues({
                      ...values,
                      land_measurement: value?.label,
                      land_measurement_symbol: value?.value,
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
                  // placeholder="Enter social security number"
                  fullLength={true}
                  keyboardType="default"
                  label={t('social security number')}
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
                  label={t('document type')}
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
                <Text style={[Styles.fieldLabel]}>
                  {t('village governing body')}
                </Text>
                <View style={{flexDirection: 'row', gap: 8, marginTop: 10}}>
                  <TouchableOpacity
                    onPress={() =>
                      setValues({
                        ...values,
                        village_governing_body: !values?.village_governing_body,
                      })
                    }>
                    <Image
                      source={
                        values?.village_governing_body === true
                          ? require('../../../assets/checked.png')
                          : require('../../../assets/unchecked.png')
                      }
                      style={{height: 22, width: 22}}
                    />
                  </TouchableOpacity>
                  <Text style={[styles?.subheading, {marginTop: 0}]}>Yes</Text>
                  <TouchableOpacity
                    onPress={() =>
                      setValues({
                        ...values,
                        village_governing_body: !values?.village_governing_body,
                      })
                    }>
                    <Image
                      source={
                        values?.village_governing_body === false
                          ? require('../../../assets/checked.png')
                          : require('../../../assets/unchecked.png')
                      }
                      style={{height: 22, width: 22}}
                    />
                  </TouchableOpacity>
                  <Text style={[styles?.subheading, {marginTop: 0}]}>No</Text>
                </View>
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
              <Text style={styles.collapsibleHeaderText}>
                {t('attachments')}
              </Text>
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
              <View>
                <View style={[styles.middleContainer]}>
                  <Text
                    style={[
                      styles.subheading,
                      {marginBottom: 20, color: primary},
                    ]}>
                    {t('address proof')}
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
                        handleDocumentSelection('address_proof');
                      } else {
                        setDocuments({...documents, address_proof: null});
                      }
                    }}>
                    {documents?.address_proof == null ? (
                      <>
                        <AntDesign name="upload" size={18} color={primary} />
                        <Text style={styles.butnText}>{t('Add File')}</Text>
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
                            setDocuments({...documents, address_proof: null})
                          }
                        />
                      </>
                    )}
                  </TouchableOpacity>
                </View>
                {values?.village_governing_body ? (
                  <View style={[styles.middleContainer]}>
                    <Text
                      style={[
                        styles.subheading,
                        {marginBottom: 20, color: primary},
                      ]}>
                      {t('field officer')}
                    </Text>
                    <TouchableOpacity
                      style={[
                        styles.addFileButton,
                        {
                          justifyContent:
                            documents?.field_officer_document == null
                              ? 'center'
                              : 'space-between',
                        },
                      ]}
                      onPress={() => {
                        if (documents.field_officer_document == null) {
                          handleDocumentSelection('field_officer_document');
                        } else {
                          setDocuments({
                            ...documents,
                            field_officer_document: null,
                          });
                        }
                      }}>
                      {documents?.field_officer_document == null ? (
                        <>
                          <AntDesign name="upload" size={18} color={primary} />
                          <Text style={styles.butnText}>{t('Add File')}</Text>
                        </>
                      ) : (
                        <>
                          <Text
                            style={[
                              Styles.fieldLabel,
                              {
                                marginBottom: 0,
                                marginTop: 0,
                                width: width / 1.6,
                              },
                            ]}>
                            {documents?.field_officer_document?.name || ''}
                          </Text>
                          <AntDesign
                            name="close"
                            size={18}
                            color={primary}
                            onPress={() =>
                              setDocuments({
                                ...documents,
                                field_officer_document: null,
                              })
                            }
                          />
                        </>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : null}
              </View>
            )}
          </View>
          <Text style={[styles.subheading, {bottom: 10, alignSelf: 'center'}]}>
            {t('already have an account')}
            <Text
              style={{color: primary}}
              onPress={() => navigation.navigate('login')}>
              {' '}
              {t('login')}
            </Text>{' '}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <CustomButton onPress={openCollapsible} btnText={t('register')} />
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
          console.log('itemmm', item);
          setCountryCode(item.dial_code);
          setCoutryInfo(item);
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
