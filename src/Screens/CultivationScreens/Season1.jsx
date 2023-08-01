import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Divider} from 'react-native-paper';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import BottomModal from '../../Components/BottomSheet/BottomModal';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDropdown1 from '../../Components/CustomDropdown/CustomDropdown1';
import CustomDropdown2 from '../../Components/CustomDropdown/CustomDropdown2';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';

const Season1 = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [cropType, setCropType] = useState([]);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const handleRemoveClick = index => {
    const list = [...cropType];
    list.splice(index, 1);
    setCropType(list);
  };
  const addCrop = () => {
    setCropType([
      ...cropType,
      {
        cropName: dropdownVal == 'Others' ? otherCrop : dropdownVal,
        progress: '',
      },
    ]);
    setCropModal(!cropModal);
    setFocusOther(false);
    setDropdownVal('');
    setOtherCrop('');
  };
  const DropdownSelectedValue = data => {
    setDropdownVal(data);
    if (data !== 'Others') {
      setFocusOther(false);
    }
  };
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Season 1'}
        goBack={() => navigation.goBack()}
      />
      {/* top container for land allocated and modify */}
      <View style={styles.top_container}>
        <View style={styles.top_container_inner}>
          <Text style={styles.land_allocated_text}>Land allocated</Text>
        </View>
        <View style={styles.top_container_inner}>
          <Text style={styles.value_text}>10 acres</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.top_container_inner}>
          <Text
            style={[styles.land_allocated_text, {fontSize: 14 / fontScale}]}
            onPress={() => navigation.goBack()}>
            Modify
          </Text>
        </View>
      </View>
      {cropType?.map((element, i) => {
        return (
          <TouchableOpacity
            style={styles.addAndDeleteButtonSection}
            onPress={() =>
              navigation.navigate('cropDescription', {
                cropType: element?.cropName,
              })
            }>
            <AddAndDeleteCropButton
              add={false}
              cropName={element?.cropName}
              onPress={() => handleRemoveClick(i)}
            />
          </TouchableOpacity>
        );
      })}
      {cropType[0] === undefined ? (
        <View style={styles.addAndDeleteButtonSection}>
          <AddAndDeleteCropButton
            add={true}
            cropName={'Add Crop'}
            onPress={() => setCropModal(true)}
          />
        </View>
      ) : (
        <View style={styles.addAndDeleteButtonSection}>
          <AddAndDeleteCropButton
            add={true}
            cropName={'Add Crop'}
            onPress={() => setCropModal(true)}
          />
        </View>
      )}
      <BottomModal
        modalVisible={cropModal}
        setBottomModalVisible={setCropModal}
        styleInner={{height: focusOther ? '80%' : '35%'}}>
        <View style={styles.BottomTopContainer}>
          <Text style={styles.headerText}>Add Crop</Text>
          <TouchableOpacity
            onPress={() => {
              setCropModal(!cropModal);
              setFocusOther(false);
              setDropdownVal('');
            }}>
            <Image
              source={require('../../../assets/close.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.dropdownSection}>
          <CustomDropdown2 selectedValue={e => DropdownSelectedValue(e)} />
          {dropdownVal === 'Others' ? (
            <InputWithoutRightElement
              label={'Crop Name'}
              placeholder={'Crop 01'}
              onChangeText={e => setOtherCrop(e)}
              value={otherCrop}
              onFocus={() => setFocusOther(true)}
            />
          ) : null}
        </View>
        <View style={styles.BottomSheetButton}>
          <TouchableOpacity
            style={styles.crossButton}
            onPress={() => setCropModal(!cropModal)}>
            <Image source={require('../../../assets/cross.png')} />
          </TouchableOpacity>
          <CustomButton
            btnText={'Create'}
            style={{width: '80%'}}
            onPress={() => addCrop()}
          />
        </View>
      </BottomModal>
    </View>
  );
};

export default Season1;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    top_container: {
      width: '90%',
      alignSelf: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#268C43',
      borderRadius: 10,
      paddingVertical: 20,
      paddingHorizontal: 10,
      flexDirection: 'row',
    },
    top_container_inner: {
      padding: 10,
      alignSelf: 'center',
    },
    land_allocated_text: {
      fontSize: 14 / fontScale,
      color: '#C1D8C7',
      fontFamily: 'ubuntu_medium',
    },
    value_text: {
      fontSize: 14 / fontScale,
      color: '#fff',
      fontFamily: 'ubuntu_medium',
    },
    divider: {
      height: '70%',
      width: 2,
      borderRadius: 10,
      alignSelf: 'center',
      color: '#FFFFFF17',
    },
    addAndDeleteButtonSection: {
      marginTop: '5%',
    },
    BottomTopContainer: {
      justifyContent: 'space-between',
      alignSelf: 'center',
      margin: 10,
      padding: 5,
      flexDirection: 'row',
    },
    headerText: {
      fontFamily: 'ubuntu_medium',
      fontSize: 16 / fontScale,
      color: '#000',
      alignSelf: 'center',
      width: '87%',
    },
    closeIcon: {
      height: 30,
      width: 30,
      alignSelf: 'center',
    },
    BottomSheetButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: '5%',
      padding: 10,
      margin: 5,
      alignSelf: 'center',
    },
    crossButton: {
      marginRight: 10,
    },
    dropdownSection: {
      width: '90%',
    },
  });
