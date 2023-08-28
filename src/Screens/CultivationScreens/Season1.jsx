import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {ActivityIndicator, Divider} from 'react-native-paper';
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
  saveCrop,
} from '../../Redux/CropSlice';
import {
  deleteCultivation,
  getCultivation,
  setCropId,
} from '../../Redux/CultivationSlice';
import Toast from 'react-native-toast-message';
import {useFocusEffect} from '@react-navigation/native';
import PopupModal from '../../Components/Popups/PopupModal';

const Season1 = ({navigation, route}) => {
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
  const [deletePopup, setDeletePopup] = useState(false);
  const [delete_id, setDelete_id] = useState('');
  const [deleteCrop, setDeleteCrop] = useState('');

  const dispatch = useDispatch();
  const {seasonName = 'Season 1'} = route.params;

  const {userDetails} = useSelector(s => s.auth);
  const {cultivations, cultivationType, status} = useSelector(
    s => s.cultivation,
  );
  const {crops, cropCategories, addedCrop} = useSelector(s => s.crop);

  useFocusEffect(
    useCallback(() => {
      setSelectCrops(prev =>
        cultivations.map(c => ({
          name: c.cultivation_crop.name,
          _id: c.cultivation_crop._id,
          cultivation_id: c._id,
        })),
      );
      return () => {
        setSelectCrops([]);
      };
    }, [cultivations]),
  );

  const handleRemoveClick = id => {
    setSelectCrops(prev => prev.filter(el => el._id !== id));
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getCropCategories());
      dispatch(getCultivation());
    }, []),
  );

  const addCrop = () => {
    if (cultivations.find(c => c.crop_id === selectedCrop._id)) {
      setCropModal(false);
      setFocusOther(false);
      setOtherCrop('');
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Crop is already added!',
      });
    } else {
      if (selectedCrop.name === 'Others' && otherCrop.length > 0) {
        if (selectedCategory?.length > 0) {
          const cat = cropCategories.find(c => c.name === selectedCategory);
          dispatch(saveCrop({name: otherCrop, categoryId: cat._id}))
            .unwrap()
            .then(res => {
              setSelectCrops(prev => [...prev, res.data]);
              setCropModal(false);
              setCropModal(!cropModal);
              setFocusOther(false);
              setOtherCrop('');
            })
            .catch(err => console.log(err));
        } else {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Please select a Category!',
          });
        }
      } else {
        setSelectCrops(prev => [...prev, selectedCrop]);
        setCropModal(false);
        setFocusOther(false);
        setOtherCrop('');
      }
    }
  };

  const handleDelete = () => {
    if (delete_id) {
      dispatch(deleteCultivation(delete_id))
        .unwrap()
        .then(() => {
          setDelete_id('');
          setDeleteCrop('');
          setDeletePopup(false);
        })
        .catch(err => console.log(err));
    } else {
      setSelectCrops(prev => prev.filter(p => p._id !== deleteCrop));
      setDeleteCrop('');
      setDeletePopup(false);
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={seasonName}
        goBack={() => navigation.goBack()}
      />
      {/* top container for land allocated and modify */}
      <View style={styles.top_container}>
        <View style={styles.top_container_inner}>
          <Text style={styles.land_allocated_text}>Land allocated</Text>
        </View>
        <View style={styles.top_container_inner}>
          <Text style={styles.value_text}>
            {
              userDetails.sub_area.cultivation.distribution[
                cultivationType === 1
                  ? 'once'
                  : cultivationType === 2
                  ? 'twice'
                  : 'thrice'
              ]
            }{' '}
            acres
          </Text>
        </View>
        {/* <Divider style={styles.divider} />
        <View style={styles.top_container_inner}>
          <Text
            style={[styles.land_allocated_text, {fontSize: 14 / fontScale}]}
            onPress={() => navigation.goBack()}>
            Modify
          </Text>
        </View> */}
      </View>
      {status === 'idle' ? (
        <>
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
                  onPress={() => {
                    setDelete_id(element.cultivation_id);
                    setDeleteCrop(element._id);
                    setDeletePopup(true);
                  }}
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
        </>
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator animating size="large" color="#268C43" />
        </View>
      )}
      <BottomModal
        modalVisible={cropModal}
        setBottomModalVisible={toggle => {
          setCropModal(toggle);
          setSelectedCategory({name: ''});
          setSelectedCrop({});
          setOtherCrop('');
        }}
        styleInner={{height: focusOther ? '80%' : '35%'}}>
        <View style={styles.BottomTopContainer}>
          <Text style={styles.headerText}>Add Crop</Text>
          <TouchableOpacity
            onPress={() => {
              setCropModal(false);
              setSelectedCategory({name: ''});
              setSelectedCrop({});
              setOtherCrop('');
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
          <View style={{marginBottom: 15}}>
            <CustomDropdown2
              selectedValue={e => {
                setSelectedCategory(e);
                // setSelectCrops({name: ''});
                dispatch(
                  getCrops(cropCategories.find(cp => cp.name === e)._id),
                );
              }}
              // value={selectedCategory.name}
              placeholder="Select a category"
              data={cropCategories}
            />
          </View>
          <CustomDropdown2
            selectedValue={e => {
              setSelectedCrop(
                crops.find(cp => cp.name === e) || {_id: 0, name: 'Others'},
              );
              setOtherCrop('');
              // dispatch(setCropId(crops.find(cp => cp.name === e)._id));
              // DropdownSelectedValue(e);
            }}
            // value={selectCrop.name}
            placeholder="Select a crop"
            data={[...crops, {_id: 0, name: 'Others'}]}
          />
          {selectedCrop?.name === 'Others' ? (
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
            onPress={() => {
              setCropModal(false);
              setSelectedCategory({name: ''});
              setSelectedCrop({});
              setOtherCrop('');
            }}>
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
      <PopupModal
        modalVisible={deletePopup}
        setBottomModalVisible={toggle => {
          setDelete_id('');
          setDeleteCrop('');
          setDeletePopup(toggle);
        }}
        styleInner={[styles.savePopup, {width: '90%'}]}>
        <View style={styles.submitPopup}>
          <View style={styles.noteImage}>
            <Image
              source={require('../../../assets/note.png')}
              style={styles.noteImage}
            />
          </View>
          <Text style={styles.confirmText}>Confirm</Text>
          <Text style={styles.nextText}>Do you want to delete this crop?</Text>
          <View style={styles.bottomPopupbutton}>
            <CustomButton
              style={styles.submitButton}
              btnText={'Yes, Delete'}
              onPress={handleDelete}
            />
            <CustomButton
              style={styles.draftButton}
              btnText={'No'}
              onPress={() => {
                setDelete_id('');
                setDeleteCrop('');
                setDeletePopup(false);
              }}
            />
          </View>
        </View>
      </PopupModal>
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
      // backgroundColor: 'red',
    },
    addCropIcon: {
      height: 50,
      width: 50,
    },
    savePopup: {
      justifyContent: 'center',
      width: '97%',
      borderRadius: 20,
    },
    popupButton: {
      width: '70%',
      alignSelf: 'center',
    },
    bottomPopupbutton: {
      width: '93%',
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-between',
      marginTop: '5%',
    },
    submitButton: {
      width: '45%',
      margin: 10,
    },
    draftButton: {
      width: '45%',
      margin: 10,
      backgroundColor: 'grey',
    },
    confirmText: {
      alignSelf: 'center',
      fontSize: 18 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu_medium',
      fontWeight: '500',
      padding: 10,
      textAlign: 'center',
    },
    nextText: {
      alignSelf: 'center',
      fontSize: 18 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu',
      textAlign: 'center',
    },
    submitPopup: {
      alignItems: 'center',
      padding: 10,
    },
    noteImage: {
      padding: 10,
    },
  });
