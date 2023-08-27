import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Divider} from 'react-native-paper';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import BottomModal from '../../Components/BottomSheet/BottomModal';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDropdown2 from '../../Components/CustomDropdown/CustomDropdown2';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAllCrop,
  getCrop,
  getCropCategories,
  getCrops,
} from '../../Redux/CropSlice';
import {getCultivation, setCropId} from '../../Redux/CultivationSlice';
import Toast from 'react-native-toast-message';

const Season1 = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [cropType, setCropType] = useState([]);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({name: ''});
  const [selectCrops, setSelectCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState({});

  const dispatch = useDispatch();

  const {cultivations} = useSelector(s => s.cultivation);
  const {crops, cropCategories} = useSelector(s => s.crop);

  useEffect(() => {
    setSelectCrops(prev => [
      ...prev,
      ...cultivations.map(c => ({
        name: c.cultivation_crop.name,
        _id: c.cultivation_crop._id,
      })),
    ]);
  }, [cultivations.length]);

  const handleRemoveClick = id => {
    setSelectCrops(prev => prev.filter(el => el._id !== id));
  };

  useEffect(() => {
    dispatch(getCropCategories());
    dispatch(getCultivation());
  }, []);

  const addCrop = () => {
    if (cultivations.find(c => c.crop_id !== selectedCrop._id)) {
      setSelectCrops(prev => [...prev, selectedCrop]);
      setCropModal(!cropModal);
      setFocusOther(false);
      setOtherCrop('');
    } else {
      setCropModal(false);
      setFocusOther(false);
      setOtherCrop('');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Crop is already added!',
      });
    }
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
      {selectCrops?.map((element, i) => {
        return (
          <TouchableOpacity
            style={styles.addAndDeleteButtonSection}
            key={element._id}
            onPress={() => {
              dispatch(setCropId(element._id))
                .unwrap()
                .then(() => {
                  navigation.navigate('cropDescription', {
                    cropName: element?.name,
                  });
                });
            }}>
            <AddAndDeleteCropButton
              add={false}
              cropName={element?.name}
              onPress={() => handleRemoveClick(element._id)}
            />
          </TouchableOpacity>
        );
      })}
      {/* {cropType[0] === undefined ? ( */}
      <TouchableOpacity
        style={styles.addAndDeleteButtonSection}
        onPress={() => setCropModal(true)}>
        <AddAndDeleteCropButton
          add={true}
          cropName={'Add Crop'}
          onPress={() => null}
        />
      </TouchableOpacity>
      {/* // ) : (
      //   <View style={styles.addAndDeleteButtonSection}>
      //     <AddAndDeleteCropButton
      //       add={true}
      //       cropName={'Add Crop'}
      //       onPress={() => setCropModal(true)}
      //     /> */}
      {/* </View> */}
      {/* )} */}
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
          <CustomDropdown2
            selectedValue={e => {
              setSelectedCategory(e);
              dispatch(getCrops(cropCategories.find(cp => cp.name === e)._id));
            }}
            // value={selectedCategory.name}
            data={cropCategories}
          />
          <CustomDropdown2
            selectedValue={e => {
              setSelectedCrop(crops.find(cp => cp.name === e));
              // dispatch(setCropId(crops.find(cp => cp.name === e)._id));
              // DropdownSelectedValue(e);
            }}
            // value={selectCrop.name}
            data={[...crops, {_id: 0, name: 'Others'}]}
          />
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
            onPress={addCrop}
          />
        </View>
      </BottomModal>
      <Toast
        positionValue={30}
        style={{height: 'auto', minHeight: 70}}
        width={300}
      />
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
    addCropIcon: {
      height: 50,
      width: 50,
    },
  });
