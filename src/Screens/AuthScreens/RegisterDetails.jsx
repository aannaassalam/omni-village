import React, {useCallback, useEffect, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
  useWindowDimensions,
} from 'react-native';
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper';
import InputTextComponent from '../../Components/InputTextComponent/InputTextComponent';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {Box, Pressable, TextInput, Wrap} from '@react-native-material/core';
import SelectDropdown from 'react-native-select-dropdown';
import CustomDropdown1 from '../../Components/CustomDropdown/CustomDropdown1';
import DocumentPicker, {types} from 'react-native-document-picker';
import {Controller, useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  faChevronCircleDown,
  faChevronDown,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import CustomProgress from '../../Components/CustomProgress/CustomProgress';
import {validation} from '../../Validation/Validation';
import {useDispatch, useSelector} from 'react-redux';
import {EditUser, getUser} from '../../Redux/AuthSlice';
import axiosInstance from '../../Helper/Helper';
import {Scale} from '../../Helper/utils';
import {useFocusEffect} from '@react-navigation/native';
import {getLandmeasurement, getVillage} from '../../Redux/OthersSlice';
import CustomDropdown2 from '../../Components/CustomDropdown/CustomDropdown2';

// const FormData = global.FormData;

export default function RegisterDetails({navigation, route}) {
  // const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
  const isEdit = route?.params?.edit || false;
  const [fileResponse, setFileResponse] = useState([]);
  const [file_err, setFile_err] = useState('');
  const {village} = useSelector(state => state.Others);
  const {landmeasurement} = useSelector(state => state.Others);

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

  const {user} = useSelector(state => state.auth);

  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

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
        .string()
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
      social_security_number: yup
        .string()
        .required(validation?.error?.social_security_number),
      address: yup.string().required(validation?.error?.address),
    })
    .required();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: {errors},
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: user?.phone || '',
      country_name: user?.country,
      address: isEdit ? user?.address : '',
      first_name: isEdit ? user?.first_name : '',
      land_measurement: isEdit ? user?.land_measurement : '',
      last_name: isEdit ? user?.last_name : '',
      members: isEdit ? user?.members : '',
      number_of_members: isEdit ? user?.number_of_members : '',
      social_security_number: isEdit ? user?.social_security_number : '',
      village_name: isEdit ? user?.village_name : '',
      // number_of_members: '',
    },
  });
  const [numMembers, setNumMembers] = useState(
    isEdit ? user?.number_of_members : 0,
  );
  const [familyMembers, setFamilyMembers] = useState([]);
  const [inputVal, setInputVal] = useState('');

  const handleMemberChange = value => {
    setNumMembers(value);
    if (value > familyMembers.length) {
      const newMembers = Array.from(
        {length: value - familyMembers.length},
        (_, index) => ({
          id: familyMembers.length + index + 1,
          member_name: '',
          member_gender: '',
          member_age: '',
        }),
      );
      setFamilyMembers([...familyMembers, ...newMembers]);
    } else {
      const updatedMembers = familyMembers.slice(0, value);
      setFamilyMembers(updatedMembers);
    }
  };

  const handleMemberNameChange = (index, newName, member) => {
    const updatedNames = [...familyMembers];
    updatedNames[index][member] = newName;
    setFamilyMembers(updatedNames);
  };

  const [dropdownVal, setDropdownVal] = useState('');

  const InputValueCallback = data => {
    setInputVal(data);
  };

  const DropdownSelectedValue = data => {
    // setDropdownVal(data);
    setValue('village_name', data);
  };

  const dispatch = useDispatch();

  const FormSubmit = data => {
    if (fileResponse.length === 0 && !isEdit) {
      console.log('in');
      setFile_err('Please select a document!');
      return;
    }
    console.log('out', data);
    dispatch(
      EditUser({
        data: {
          ...data,
          land_measurement_symbol: landmeasurement.find(
            lm => lm.name === data.land_measurement,
          ).symbol,
          edit: isEdit,
        },
        file: fileResponse[0] || {},
      }),
    )
      .unwrap()
      .then(res =>
        isEdit ? navigation.goBack() : navigation.replace('registersuccess'),
      )
      .catch(err => console.log(err, 'err from register details'));
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getVillage(user?.country));
      dispatch(getLandmeasurement());
    }, [user.country]),
  );

  return (
    <LoginWrapper no_gap>
      <View style={styles.form_section}>
        <View style={styles.form_head}>
          <Text style={styles.LoginHead}>Register</Text>
          <Text style={styles.subtitle}>Enter Details</Text>
        </View>
        <Box style={styles.cmn_wrp}>
          <Box style={styles.input_wrap}>
            <View style={styles.half_input}>
              <Controller
                control={control}
                name="first_name"
                render={({field: {onChange, onBlur, value, name, ref}}) => (
                  <InputTextComponent
                    placeholder={'First Name'}
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
                  <InputTextComponent
                    placeholder={'Last Name'}
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
                <InputTextComponent
                  placeholder={'Phone No'}
                  onChangeText={onChange}
                  value={value}
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
          <Text style={styles.login_text}>Household Informations</Text>
          <View style={styles.line_border} />
        </View>
        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <Controller
              control={control}
              name="country_name"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputTextComponent
                  placeholder={'Country Name'}
                  onChangeText={onChange}
                  value={user?.country}
                  editable={false}
                />
              )}
            />
          </View>
        </Box>
        <Box style={styles.cmn_wrp}>
          <Controller
            control={control}
            name="village_name"
            render={({field: {onChange, onBlur, value, name, ref}}) => (
              <CustomDropdown1
                data={village}
                value={value}
                placeholder={'Village Name'}
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
        <Box style={styles.cmn_wrp}>
          <Controller
            control={control}
            name="land_measurement"
            render={({field: {onChange, onBlur, value, name, ref}}) => (
              <CustomDropdown1
                data={landmeasurement}
                value={value}
                placeholder={'Land Measurement'}
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
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputTextComponent
                  placeholder={'Number of Family Members'}
                  keyboardType="number-pad"
                  onChangeText={e => {
                    onChange(e);
                    if (e !== '' && parseInt(e) !== 0)
                      setNumMembers(parseInt(e));
                  }}
                  value={value}
                />
              )}
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
                  Member #{index + 1}
                </Text>
                <Box style={styles.cmn_wrp}>
                  <View style={styles.login_input}>
                    <Controller
                      control={control}
                      name={`members[${index}].name`}
                      render={({
                        field: {onChange, onBlur, value, name, ref},
                      }) => (
                        <InputTextComponent
                          placeholder={'Member Name'}
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
                              placeholder={'Member Gender'}
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
                            field: {onChange, onBlur, value, name, ref},
                          }) => (
                            <InputTextComponent
                              placeholder={'Member Age'}
                              keyboardType={'numeric'}
                              onChangeText={onChange}
                              value={value}
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
        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <Controller
              control={control}
              name="social_security_number"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputTextComponent
                  placeholder={'Social Security number'}
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
                <InputTextComponent
                  placeholder={'Address'}
                  onChangeText={onChange}
                  value={value}
                />
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
                  Upload address proof
                </Text>
              </Box>
              <Box style={styles.file_box_rgt}>
                {/* <Button title="Browse" style={styles.btn} onPress={handleDocumentSelection} /> */}
                <TouchableOpacity
                  style={styles.btn}
                  onPress={handleDocumentSelection}>
                  <Text style={styles.cmn_btn_text}>Browse</Text>
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
                      Remove
                    </Text>
                  </Pressable>
                </Box>
              </Box>
            ))}
          </>
        )}
        <View style={styles.login_submit}>
          <CustomButton btnText={'Submit'} onPress={handleSubmit(FormSubmit)} />
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
      fontFamily: 'ubuntu_medium',
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
      fontFamily: 'ubuntu_regular',
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
      fontFamily: 'ubuntu_medium',
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
      fontFamily: 'ubuntu_regular',
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
      fontFamily: 'ubuntu_regular',
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
  });
