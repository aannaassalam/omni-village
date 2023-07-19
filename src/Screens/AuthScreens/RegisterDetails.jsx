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
import {
  faChevronCircleDown,
  faChevronDown,
  faChevronLeft,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';

export default function RegisterDetails({navigation, route}) {
  const countries = ['Egypt', 'Canada', 'Australia', 'Ireland'];
  const [fileResponse, setFileResponse] = useState([]);
  console.log(fileResponse);
  const handleDocumentSelection = useCallback(async () => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.pdf],
      });
      setFileResponse(response);
    } catch (err) {
      console.warn(err);
    }
  }, []);
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
              <InputTextComponent placeholder={'First Name'} />
            </View>

            <View style={styles.half_input}>
              <InputTextComponent placeholder={'Last Name'} />
            </View>
          </Box>
        </Box>
        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <InputTextComponent placeholder={'Last Name'} />
          </View>
        </Box>
        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <InputTextComponent placeholder={'Last Name'} />
          </View>
        </Box>
        <View style={styles.form_btm_text}>
          <Text style={styles.login_text}>Household Informations</Text>
          <View style={styles.line_border}></View>
        </View>
        <Box style={styles.cmn_wrp}>
          <View style={styles.login_input}>
            <InputTextComponent placeholder={'Family Name'} />
          </View>
        </Box>

        {/* <SelectDropdown
          data={countries}
          onSelect={(selectedItem, index) => {
            console.log(selectedItem, index);
          }}
          buttonTextAfterSelection={(selectedItem, index) => {
            // text represented after item is selected
            // if data array is an array of objects then return selectedItem.property to render after item is selected
            return selectedItem;
          }}
          rowTextForSelection={(item, index) => {
            // text represented for each item in dropdown
            // if data array is an array of objects then return item.property to represent item in dropdown
            return item;
          }}
        /> */}
        <CustomDropdown1 />
        <Box style={styles.file_box}>
          <Box style={styles.file_box_lft}>
            <Image
              style={styles.tinyLogo}
              source={require('../../../assets/file_img.png')}
              // height={100}
            />
            <Text varint="body1">Upload address proof</Text>
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
            <Button title="Browse" onPress={handleDocumentSelection} />
          </Box>
        </Box>
        <View style={styles.login_submit}>
          <CustomButton
            btnText={'Submit'}
            onPress={() => navigation.navigate('registersuccess')}
          />
        </View>
      </View>
    </LoginWrapper>
  );
}

const styles = StyleSheet.create({
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
