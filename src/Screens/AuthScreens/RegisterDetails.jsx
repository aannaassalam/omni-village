import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
  useWindowDimensions,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {Box, Pressable} from '@react-native-material/core';
import CustomDropdown1 from '../../Components/CustomDropdown/CustomDropdown1';
import DocumentPicker, {types} from 'react-native-document-picker';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {validation} from '../../Validation/Validation';
import {useDispatch, useSelector} from 'react-redux';
import {EditUser} from '../../Redux/AuthSlice';
import {useFocusEffect} from '@react-navigation/native';
import {getLandmeasurement, getVillage} from '../../Redux/OthersSlice';
import {useTranslation} from 'react-i18next';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import Geolocation from 'react-native-geolocation-service';
import {TextInput} from 'react-native-paper';
import {useUser} from '../../Hooks/useUser';
import {useLandMeasurement, useVillages} from '../../Hooks/cms';
import {useMutation} from '@tanstack/react-query';
import {editUser} from '../../functions/AuthScreens';

const schema = yup
  .object()
  .shape({
    first_name: yup.string().required(validation?.error?.first_name),
    last_name: yup.string().required(validation?.error?.last_name),
    village_name: yup.string().required(validation?.error?.village_name),
    country_name: yup.string(),
    land_measurement: yup
      .string()
      .required(validation?.error?.land_measurement),
    phone: yup.string().required(validation?.error?.phone),
    number_of_members: yup
      .number()
      .max(20, 'Number of members cannot be greater than 20!')
      .required(validation.error.number_of_members),
    members: yup
      .array(
        yup.object().shape({
          name: yup.string().required(validation.error.member_name),
          age: yup.string().required(validation.error.member_age),
          gender: yup.string().required(validation.error.member_gender),
        }),
      )
      .required('Members is required'),
    document_type: yup.string().required('Document Type is required!'),
    social_security_number: yup
      .string()
      .required(validation?.error?.social_security_number),
    address: yup.string().required(validation?.error?.address),
    street_address: yup.string().required(validation?.error?.street_address),
  })
  .required();

export default function RegisterDetails({navigation, route}) {
  // const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
  const [fileResponse, setFileResponse] = useState([]);
  const [file_err, setFile_err] = useState('');

  const isEdit = route?.params?.edit || false;
  const documentType = [
    {name: 'Kad Pengenalan / MyKad (Identity Card)'},
    {name: 'Pasport (Passport)'},
    {name: 'Lesen Memandu (Driving Licence)'},
  ];

  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.images],
        allowMultiSelection: false,
      });
      setFile_err('');
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const {data: user} = useUser();
  const {data: landmeasurement} = useLandMeasurement();
  const {data: village} = useVillages(user?.country);
  const {t} = useTranslation();
  const {fontScale} = useWindowDimensions();

  const styles = makeStyles(fontScale);

  const {
    handleSubmit,
    setValue,
    control,
    formState: {errors},
    watch,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: user?.phone || '',
      country_name: user?.country,
      address: isEdit ? user?.address : '',
      first_name: isEdit ? user?.first_name : '',
      land_measurement: isEdit ? user?.land_measurement : '',
      last_name: isEdit ? user?.last_name : '',
      members: isEdit ? user?.members : [],
      number_of_members: isEdit ? parseInt(user?.number_of_members, 10) : 0,
      document_type: isEdit ? user?.document_type : '',
      social_security_number: isEdit ? user?.social_security_number : '',
      village_name: isEdit ? user?.village_name : '',
      street_address: isEdit ? user?.street_address : '',
    },
  });

  const [numMembers, setNumMembers] = useState(
    isEdit ? user?.number_of_members : 0,
  );

  const {mutate, isPending} = useMutation({
    mutationFn: editUser,
    onSuccess: data => {
      isEdit ? navigation.goBack() : navigation.replace('registersuccess');
    },
    onError: err => console.log(err, 'Err from register details'),
  });

  const FormSubmit = data => {
    if (fileResponse.length === 0 && !isEdit) {
      console.log('in');
      setFile_err('Please select a document!');
      return;
    }

    const _data = {
      ...data,
      number_of_members: String(data.number_of_members),
      land_measurement_symbol: landmeasurement.find(
        lm => lm.name === data.land_measurement,
      ).symbol,
      edit: isEdit,
    };
    const _file = fileResponse[0] || {};

    const formData = new FormData();
    Object.keys(_data).forEach(key => {
      if (key === 'members') {
        formData.append('members', JSON.stringify(_data[key]));
      } else {
        formData.append(key, _data[key]);
      }
    });
    formData.append('address_proof', {
      uri: _file?.uri || '',
      type: _file?.type || '',
      filename: _file?.name || '',
      name: 'address_proof',
    });

    const submitable_data = _data.edit ? _data : formData;

    mutate(submitable_data);
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
          setCoordinates: coords =>
            setValue('address', `${coords.latitude},${coords.longitude}`),
          my_location: {
            lat: parseFloat(watch('address').split(',')[0]) || null,
            lng: parseFloat(watch('address').split(',')[1]) || null,
          },
        });
        return true;
      } else {
        console.log('You cannot use Geolocation');
        return false;
      }

      return null;
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
            setCoordinates: coords =>
              setValue('address', `${coords.latitude},${coords.longitude}`),
            my_location: {
              lat: parseFloat(watch('address').split(',')[0]) || null,
              lng: parseFloat(watch('address').split(',')[1]) || null,
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
            if (!watch('address').length)
              setValue(
                'address',
                `${position.coords.latitude},${position.coords.longitude}`,
              );
          },
          error => {
            // See error code charts below.
            console.log(error.code, error.message);
            setValue('address', '');
          },
          {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
        );
      }
    });
  };

  return (
    <LoginWrapper no_gap>
      <View style={styles.form_section}>
        <View style={styles.form_head}>
          <Text style={styles.LoginHead}>{t('register')}</Text>
          <Text style={styles.subtitle}>{t('enter details')}</Text>
        </View>
        <Box style={styles.cmn_wrp}>
          <Box style={styles.input_wrap}>
            <View style={styles.half_input}>
              <Controller
                control={control}
                name="first_name"
                render={({field: {onChange, onBlur, value, name, ref}}) => (
                  <InputWithoutRightElement
                    label={t('first name')}
                    placeholder={t('first name')}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors?.first_name?.message ? (
                <Text style={styles.error}>{errors?.first_name?.message}</Text>
              ) : null}
            </View>

            <View style={styles.half_input}>
              <Controller
                control={control}
                name="last_name"
                render={({field: {onChange, onBlur, value, name, ref}}) => (
                  <InputWithoutRightElement
                    label={t('last name')}
                    placeholder={t('last name')}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors?.last_name?.message ? (
                <Text style={styles.error}>{errors?.last_name?.message}</Text>
              ) : null}
            </View>
          </Box>
        </Box>

        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <Controller
              control={control}
              name="phone"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputWithoutRightElement
                  label={t('phone no')}
                  placeholder={t('phone no')}
                  onChangeText={onChange}
                  value={value.toString() || value}
                  editable={false}
                />
              )}
            />
            {errors?.phone?.message ? (
              <Text style={styles.error}>{errors?.phone?.message}</Text>
            ) : null}
          </View>
        </Box>
        <View style={styles.form_btm_text}>
          <Text style={styles.login_text}>{t('household informations')}</Text>
          <View style={styles.line_border} />
        </View>
        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <Controller
              control={control}
              name="country_name"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputWithoutRightElement
                  label={t('country name')}
                  placeholder={t('country name')}
                  onChangeText={onChange}
                  value={user?.country}
                  editable={false}
                />
              )}
            />
          </View>
        </Box>
        <Text style={styles.cityName}>Village Name</Text>
        <Box style={styles.cmn_wrp}>
          <Controller
            control={control}
            name="village_name"
            render={({field: {onChange, onBlur, value, name, ref}}) => (
              <CustomDropdown1
                data={village}
                value={value}
                placeholder={t('village name')}
                selectedValue={onChange}
                search
              />
            )}
          />
        </Box>
        {errors?.village_name && (
          <Text
            style={{
              ...styles.error,
              width: '100%',
              marginBottom: 15,
              marginTop: -10,
            }}>
            {errors?.village_name?.message}
          </Text>
        )}
        <Text style={styles.cityName}>Land Measurement</Text>
        <Box style={styles.cmn_wrp}>
          <Controller
            control={control}
            name="land_measurement"
            render={({field: {onChange, onBlur, value, name, ref}}) => (
              <CustomDropdown1
                data={landmeasurement}
                value={value}
                placeholder={t('land measurement')}
                selectedValue={onChange}
              />
            )}
          />
        </Box>
        {errors?.land_measurement && (
          <Text
            style={{
              ...styles.error,
              width: '100%',
              marginBottom: 15,
              marginTop: -10,
            }}>
            {errors?.land_measurement?.message}
          </Text>
        )}
        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <Controller
              control={control}
              name="number_of_members"
              render={({field: {onChange, onBlur, value, name, ref}}) => {
                return (
                  <InputWithoutRightElement
                    label={t('number of family members')}
                    placeholder={t('number of family members')}
                    keyboardType="number-pad"
                    onChangeText={e => {
                      onChange(parseInt(e, 10) || 0);
                      e !== '' &&
                        parseInt(e, 10) !== 0 &&
                        setValue(
                          'members',
                          watch('members')?.filter(
                            (_, idx) => idx < parseInt(e, 10),
                          ) || [],
                        );
                      if (e !== '' && parseInt(e, 10) !== 0)
                        setNumMembers(
                          parseInt(e, 10) > 20 ? 20 : parseInt(e, 10),
                        );
                    }}
                    value={value.toString() || value}
                  />
                );
              }}
            />
            {errors?.number_of_members?.message ? (
              <Text style={styles.error}>
                {errors?.number_of_members?.message}
              </Text>
            ) : null}
          </View>
        </Box>
        {Array(numMembers)
          .fill(0)
          .map((item, index) => {
            return (
              <View key={index}>
                <Text
                  style={[
                    styles.LoginHead,
                    {
                      fontSize: 16 / fontScale,
                      alignSelf: 'flex-start',
                      padding: 3,
                    },
                  ]}>
                  {t('member')} #{index + 1}
                </Text>
                <Box style={styles.cmn_wrp}>
                  <View style={styles.login_input}>
                    <Controller
                      control={control}
                      name={`members[${index}].name`}
                      render={({
                        field: {onChange, onBlur, value, name, ref},
                      }) => (
                        <InputWithoutRightElement
                          label={t('member name')}
                          placeholder={t('member name')}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                    {errors?.members?.[index]?.name?.message ? (
                      <Text style={styles.error}>
                        {errors?.members?.[index]?.name?.message}
                      </Text>
                    ) : null}
                    <Text
                      style={[
                        styles.cityName,
                        {marginTop: 15, marginBottom: 0},
                      ]}>
                      Member Gender
                    </Text>
                    <View style={[styles.input_wrap, {marginTop: '4%'}]}>
                      <View style={styles.half_input}>
                        <Controller
                          control={control}
                          name={`members[${index}].gender`}
                          render={({
                            field: {onChange, onBlur, value, name, ref},
                          }) => (
                            <CustomDropdown1
                              data={[
                                {name: 'Male'},
                                {name: 'Female'},
                                {name: 'Other'},
                              ]}
                              value={value}
                              placeholder={t('member gender')}
                              selectedValue={onChange}
                            />
                          )}
                        />
                        {errors?.members?.[index]?.gender?.message ? (
                          <Text style={styles.error}>
                            {errors?.members?.[index]?.gender?.message}
                          </Text>
                        ) : null}
                      </View>
                      <View style={styles.half_input}>
                        <Controller
                          control={control}
                          name={`members[${index}].age`}
                          render={({
                            field: {onChange, onBlur, value = '', name, ref},
                          }) => (
                            <InputWithoutRightElement
                              style={{
                                marginTop: -15,
                              }}
                              label={t('member age')}
                              placeholder={t('member age')}
                              keyboardType={'numeric'}
                              onChangeText={onChange}
                              value={value.toString()}
                            />
                          )}
                        />
                        {errors?.members?.[index]?.age?.message ? (
                          <Text style={styles.error}>
                            {errors?.members?.[index]?.age?.message}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </View>
                </Box>
              </View>
            );
          })}
        <Text style={styles.cityName}>Document Type</Text>
        <Box style={styles.cmn_wrp}>
          <Controller
            control={control}
            name="document_type"
            render={({field: {onChange, onBlur, value, name, ref}}) => (
              <CustomDropdown1
                data={documentType}
                value={value}
                placeholder={t('document type')}
                selectedValue={onChange}
              />
            )}
          />
        </Box>
        {errors?.document_type && (
          <Text
            style={{
              ...styles.error,
              width: '100%',
              marginBottom: 15,
              marginTop: -10,
            }}>
            {errors?.document_type?.message}
          </Text>
        )}
        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <Controller
              control={control}
              name="social_security_number"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputWithoutRightElement
                  label={t('identity proof number')}
                  placeholder={t('identity proof number')}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.social_security_number?.message ? (
              <Text style={styles.error}>
                {errors?.social_security_number?.message}
              </Text>
            ) : null}
          </View>
        </Box>
        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <Controller
              control={control}
              name="address"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <View style={styles.textInputContainer}>
                  <TouchableOpacity onPress={getLocation} activeOpacity={1}>
                    <TextInput
                      onChangeText={onChange}
                      outlineColor="#268C43"
                      underlineColorAndroid="transparent"
                      activeOutlineColor="#268C43"
                      mode="outlined"
                      outlineStyle={{
                        borderRadius: 10,
                      }}
                      label={
                        <Text
                          style={{
                            fontSize: 16 / fontScale,
                            textTransform: 'capitalize',
                          }}>
                          {t('address')}
                        </Text>
                      }
                      value={value}
                      style={styles.textInput}
                      placeholder={t('address')}
                      placeholderTextColor={'#333'}
                      keyboardType="default"
                      editable={false}
                      right={
                        <TextInput.Icon
                          icon="crosshairs-gps"
                          size={24}
                          color="#268C43"
                          onPress={getLocation}
                        />
                        // <Image
                        //   style={{width: 24, height: 24}}
                        //   source={require('../../../assets/gps.svg')}
                        //   // height={100}
                        // />
                      }
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.address?.message ? (
              <Text style={styles.error}>{errors?.address?.message}</Text>
            ) : null}
          </View>
          {/* <Image
            style={styles.tinyLogo1}
            source={require('../../../assets/gps.png')}
            // height={100}
          /> */}
        </Box>
        {Boolean(watch('address').length) && (
          <Box style={styles.cmn_wrp}>
            <View style={styles.login_input}>
              <Controller
                control={control}
                name="street_address"
                render={({field: {onChange, onBlur, value, name, ref}}) => (
                  <InputWithoutRightElement
                    label={t('street address')}
                    placeholder={t('street address')}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.street_address?.message ? (
                <Text style={styles.error}>
                  {errors?.street_address?.message}
                </Text>
              ) : null}
            </View>
          </Box>
        )}
        {!isEdit && (
          <>
            <Box style={styles.file_box}>
              <Box style={styles.file_box_lft}>
                <Image
                  style={styles.tinyLogo}
                  source={require('../../../assets/file_img.png')}
                  // height={100}
                />
                <Text varint="body1" style={styles.upload_txt}>
                  {t('upload address proof')}
                </Text>
              </Box>
              <Box style={styles.file_box_rgt}>
                {/* <Button title="Browse" style={styles.btn} onPress={handleDocumentSelection} /> */}
                <TouchableOpacity
                  style={styles.btn}
                  onPress={handleDocumentSelection}>
                  <Text style={styles.cmn_btn_text}>{t('browse')}</Text>
                </TouchableOpacity>
              </Box>
            </Box>
            {file_err.length > 0 && (
              <Text style={styles.error}>{file_err}</Text>
            )}
            {fileResponse.map((file, index) => (
              <Box style={styles.file_box2} key={file.name}>
                <Box style={styles.file_box_lft}>
                  <Image
                    style={styles.tinyLogo}
                    source={require('../../../assets/file_img.png')}
                    // height={100}
                  />
                  <Text
                    varint="body1"
                    style={styles.upload_txt}
                    key={index.toString()}>
                    {file?.name}
                  </Text>
                  <Pressable onPress={() => setFileResponse([])}>
                    <Text
                      style={{
                        ...styles.error,
                        marginTop: 0,
                        marginRight: 5,
                        marginLeft: 10,
                      }}>
                      {t('remove')}
                    </Text>
                  </Pressable>
                </Box>
              </Box>
            ))}
          </>
        )}
        <View style={styles.login_submit}>
          <CustomButton
            btnText={t('submit')}
            onPress={handleSubmit(FormSubmit)}
            loading={isPending}
          />
        </View>
      </View>
    </LoginWrapper>
  );
}

const makeStyles = fontScale =>
  StyleSheet.create({
    // tinyLogo1: {
    //   position: 'absolute',
    //   top: 10,
    //   right: 10,
    // },
    tinyLogo: {},
    btn: {
      minWidth: 78,
      minHeight: 28,
      borderRadius: 8,
      backgroundColor: '#268C43',
      justifyContent: 'center',
      alignItems: 'center',
    },
    file_box_rgt2: {
      alignItems: 'center',
      flexDirection: 'row',
    },
    file_box_rgt: {},
    cmn_btn_text: {
      fontSize: 14 / fontScale,
      marginBottom: 4,
      color: '#FFF',
      justifyContent: 'center',
      alignItems: 'center',
      fontFamily: 'ubuntu-medium',
    },
    file_box2: {
      // border: 1px solid #C6F1D3,
      borderWidth: 1,
      borderColor: '#C6F1D3',
      borderRadius: 8,
      padding: 8,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      marginTop: 8,
      marginBottom: 16,
    },
    file_box: {
      flexDirection: 'row',
      backgroundColor: 'rgba(38, 140, 67, .2)',
      width: '100%',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 20,
      borderRadius: 8,
    },
    file_box_lft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    upload_txt: {
      color: '#268C43',
      fontSize: 14 / fontScale,
      marginLeft: 7,
      fontFamily: 'ubuntu-regular',
      marginRight: 'auto',
      flex: 1,
      flexWrap: 'wrap',
    },
    cmn_wrp: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 15,
    },
    form_section: {
      alignItems: 'center',
    },
    LoginHead: {
      color: '#36393B',
      fontSize: 22 / fontScale,
      marginBottom: 10,
      textAlign: 'center',
      fontFamily: 'ubuntu-medium',
    },
    subtitle: {
      fontFamily: 'ubuntu',
      color: '#263238',
      fontSize: 14 / fontScale,
    },
    half_input: {
      flexBasis: '50%',
      width: '50%',
      paddingHorizontal: 7,
    },
    login_input: {flexBasis: '100%', width: '100%'},
    input_wrap: {
      flexDirection: 'row',
      marginHorizontal: -7,
    },
    form_head: {
      marginBottom: 35,
    },
    login_submit: {
      marginTop: 20,
      width: '100%',
    },
    form_btm_text: {
      width: '100%',
      marginBottom: 20,
      flexDirection: 'row',
      alignItems: 'center',
      // marginRight: 20,
      // alignItems: 'center',
    },
    login_text: {
      textAlign: 'left',
      position: 'relative',
      // zIndex: 5,
      // height: 15,
      backgroundColor: '#fff',
      // width: 100,
      fontSize: 10 / fontScale,
      fontFamily: 'ubuntu-regular',
      color: '#263238',
    },
    line_border: {
      // flexDirection: 'row',
      height: 1,
      backgroundColor: '#EBEBEB',
      // marginTop: -18,
      marginLeft: 'auto',
      width: '64%',
    },
    error: {
      fontFamily: 'ubuntu-regular',
      fontSize: 14 / fontScale,
      marginTop: 5,
      color: '#ff000e',
      marginLeft: 5,
    },
    memberDetailsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 15,
    },
    cityName: {
      fontFamily: 'ubuntu-regular',
      fontSize: 14 / fontScale,
      alignSelf: 'flex-start',
      marginTop: 5,
      color: 'grey',
      marginLeft: 5,
      marginBottom: 10,
    },
    textInputContainer: {
      paddingTop: 10,
      width: '100%',
      alignSelf: 'center',
    },
    textInput: {
      backgroundColor: '#fff',
      fontFamily: 'ubuntu-medium',
      fontSize: 16 / fontScale,
      textAlign: 'auto',
    },
  });
