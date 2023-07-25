import React, {useCallback, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Button,
} from 'react-native';
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper';
import InputTextComponent from '../../Components/InputTextComponent/InputTextComponent';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {Box, TextInput, Wrap} from '@react-native-material/core';
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
import {EditUser} from '../../Redux/AuthSlice';
import axiosInstance from '../../Helper/Helper';

// const FormData = global.FormData;

export default function RegisterDetails({navigation, route}) {
  // const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
  const [fileResponse, setFileResponse] = useState([]);
  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.images],
        allowMultiSelection: false,
      });
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const {user} = useSelector(state => state.auth);

  const schema = yup
    .object()
    .shape({
      first_name: yup.string().required(validation?.error?.first_name),
      last_name: yup.string().required(validation?.error?.last_name),
      village_name: yup.string().required(validation?.error?.village_name),
      phone: yup.string().required(validation?.error?.phone),
      family_name: yup.string().required(validation?.error?.family_name),
      username: yup.string().required(validation?.error?.username),
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
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      phone: user.phone,
    },
  });

  const [inputVal, setInputVal] = useState('');

  const [dropdownVal, setDropdownVal] = useState('');

  const InputValueCallback = data => {
    setInputVal(data);
  };

  const DropdownSelectedValue = data => {
    setDropdownVal(data);
    setValue('village_name', data);
  };

  const dispatch = useDispatch();

  const FormSubmit = data => {
    // console.log(formData.getParts());
    dispatch(EditUser({data, file: fileResponse[0]}))
      .unwrap()
      .then(res => navigation.navigate('registersuccess'))
      .catch(err => console.log(err, 'err from register details'));
  };

  return (
    <LoginWrapper no_gap>
      <View style={styles.form_section}>
        <View style={styles.form_head}>
          <Text style={styles.LoginHead}>Register</Text>
          <Text>Enter Details</Text>
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
              <Text style={{color: 'red'}}>{errors?.first_name?.message}</Text>
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
              <Text style={{color: 'red'}}>{errors?.last_name?.message}</Text>
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
            <Text style={{color: 'red'}}>{errors?.phone?.message}</Text>
          </View>
        </Box>
        <View style={styles.form_btm_text}>
          <Text style={styles.login_text}>Household Informations</Text>
          <View style={styles.line_border}></View>
        </View>
        <Box style={styles.cmn_wrp}>
          <Controller
            control={control}
            name="village_name"
            render={({field: {onChange, onBlur, value, name, ref}}) => (
              <CustomDropdown1
                placeholder={'Village Name'}
                selectedValue={DropdownSelectedValue}
              />
            )}
          />
        </Box>
        {errors?.village_name && (
          <Text style={{color: 'red', width: '100%', marginBottom: 15}}>
            {errors?.village_name?.message}
          </Text>
        )}

        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <Controller
              control={control}
              name="family_name"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputTextComponent
                  placeholder={'Family Name'}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors?.family_name && (
              <Text style={{color: 'red'}}>{errors?.family_name?.message}</Text>
            )}
          </View>
        </Box>
        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <Controller
              control={control}
              name="username"
              render={({field: {onChange, onBlur, value, name, ref}}) => (
                <InputTextComponent
                  placeholder={'User Name'}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            <Text style={{color: 'red'}}>{errors?.username?.message}</Text>
          </View>
        </Box>
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
            <Text style={{color: 'red'}}>
              {errors?.social_security_number?.message}
            </Text>
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
            <Text style={{color: 'red'}}>{errors?.address?.message}</Text>
          </View>
          <Image
            style={styles.tinyLogo1}
            source={require('../../../assets/gps.png')}
            // height={100}
          />
        </Box>
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
            {fileResponse.map((file, index) => (
              <Text
                key={index.toString()}
                style={styles.uri}
                numberOfLines={1}
                ellipsizeMode={'middle'}>
                {file?.name}
              </Text>
            ))}
            {/* <Button title="Browse" style={styles.btn} onPress={handleDocumentSelection} /> */}
            <TouchableOpacity
              style={styles.btn}
              onPress={handleDocumentSelection}>
              <Text style={styles.cmn_btn_text}>Browse</Text>
            </TouchableOpacity>
          </Box>
        </Box>
        <Box style={styles.file_box2}>
          <Box style={styles.file_box_lft}>
            <Image
              style={styles.tinyLogo}
              source={require('../../../assets/file_img.png')}
              // height={100}
            />
            {fileResponse.length > 0 ? (
              <>
                {fileResponse.map((file, index) => (
                  <Text
                    varint="body1"
                    style={styles.upload_txt}
                    key={index.toString()}>
                    {file?.name}
                  </Text>
                ))}
              </>
            ) : (
              <Text varint="body1" style={styles.upload_txt}>
                Document.jpg
              </Text>
            )}
          </Box>
          <Box style={styles.file_box_rgt2}>
            <Box
              h={30}
              w={4}
              style={{
                backgroundColor: 'rgba(38, 50, 56, 0.09)',
                marginRight: 40,
              }}
            />
            <CustomProgress color={'#268C43'} />
          </Box>
        </Box>
        <View style={styles.login_submit}>
          <CustomButton btnText={'Submit'} onPress={handleSubmit(FormSubmit)} />
        </View>
      </View>
    </LoginWrapper>
  );
}

const styles = StyleSheet.create({
  tinyLogo1: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
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
    fontSize: 13,
    marginBottom: 4,
    color: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  file_box2: {
    // border: 1px solid #C6F1D3,
    borderWidth: 1,
    borderColor: '#C6F1D3',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
  file_box: {
    flexDirection: 'row',
    backgroundColor: 'rgba(38, 140, 67, .2)',
    width: '100%',
    justifyContent: 'space-between',
    padding: 20,
    borderRadius: 8,
  },
  file_box_lft: {
    flexDirection: 'row',
  },
  upload_txt: {
    color: '#268C43',
    fontSize: 13,
    marginLeft: 7,
  },
  cmn_wrp: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  form_section: {
    alignItems: 'center',
  },
  LoginHead: {
    color: '#36393B',
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
    fontFamily: 'ubuntu_medium',
  },
  subtitle: {
    fontFamily: 'ubuntu',
    color: '#36393B',
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
  login_text: {
    textAlign: 'left',
    position: 'relative',
    zIndex: 5,
    height: 30,
    backgroundColor: '#fff',
    width: 160,
  },
  form_btm_text: {
    width: '100%',
    marginBottom: 40,
    // alignItems: 'center',
  },
  line_border: {
    flexDirection: 'row',
    height: 2,
    backgroundColor: '#EBEBEB',
    marginTop: -20,
    width: '100%',
  },
});
