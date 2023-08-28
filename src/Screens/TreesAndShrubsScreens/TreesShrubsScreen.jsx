import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import BottomModal from '../../Components/BottomSheet/BottomModal';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDropdown2 from '../../Components/CustomDropdown/CustomDropdown2';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import {useSelector} from 'react-redux';

const TreesShrubsScreen = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {userDetails} = useSelector(s => s.auth);
  const totalLand = userDetails.total_land;
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <CustomHeader
        goBack={() => navigation.goBack()}
        headerName={'Trees, Shrubs & Grasslands'}
        backIcon={true}
      />
      {/*Top Dashboard  */}
      <CustomDashboard
        first={'production'}
        second={'Trees,Shrubs & Grasslands'}
      />
      {/* Next Dashboard */}
      <CustomDashboard2
        allocatedFor={'Trees, Shrubs & Grasslands'}
        usedLand={totalLand}
      />
      {/* Crop adding */}
      {cropType?.map((element, i) => {
        return (
          <TouchableOpacity
            style={styles.addAndDeleteButtonSection}
            onPress={() =>
              navigation.navigate('type', {
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
            <Image
              source={require('../../../assets/cross.png')}
              style={styles.addCropIcon}
            />
          </TouchableOpacity>
          <CustomButton
            btnText={'Create'}
            style={{width: '80%'}}
            onPress={() => addCrop()}
          />
        </View>
      </BottomModal>
    </SafeAreaView>
  );
};

export default TreesShrubsScreen;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
    addCropIcon: {
      height: 50,
      width: 50,
    },
  });
