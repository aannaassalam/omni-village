import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import { ActivityIndicator, Divider } from 'react-native-paper';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDropdown2 from '../../Components/CustomDropdown/CustomDropdown2';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import { useDispatch, useSelector } from 'react-redux';
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
import { useFocusEffect } from '@react-navigation/native';
import PopupModal from '../../Components/Popups/PopupModal';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomDropdown4 from '../../Components/CustomDropdown/CustomDropdown4';
import { useTranslation } from 'react-i18next';
import '../../i18next';

const Season1 = ({ navigation, route }) => {
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const { t } = useTranslation();
  const [cropType, setCropType] = useState([]);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState({ name: '' });
  const [selectCrops, setSelectCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState({});
  const [deletePopup, setDeletePopup] = useState(false);
  const [delete_id, setDelete_id] = useState('');
  const [deleteCrop, setDeleteCrop] = useState('');
  const [globalError, setGlobalError] = useState('');

  const dispatch = useDispatch();
  const { seasonName = 'Season 1' } = route.params;

  const { userDetails } = useSelector(s => s.auth);
  const { cultivations, cultivationType, status } = useSelector(
    s => s.cultivation,
  );
  const { crops, cropCategories, addedCrop } = useSelector(s => s.crop);

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
        setSelectedCrop({});
        setSelectedCategory({ name: '' });
        setGlobalError('');
      };
    }, [cultivations]),
  );

  const handleRemoveClick = id => {
    setSelectCrops(prev => prev.filter(el => el._id !== id));
  };

  useFocusEffect(
    useCallback(() => {
      dispatch(getCrops());
      dispatch(getCultivation());
    }, []),
  );
  const addCrop = () => {
    if (cultivations.find(c => c.crop_id === selectedCrop._id)) {
      // setCropModal(false);
      // setFocusOther(false);
      // setOtherCrop('');
      setGlobalError('Crop is already added!');
    } else {
      if (selectedCrop.name === 'Others' && otherCrop.length > 0) {
        dispatch(saveCrop({ name: otherCrop, categoryId: '' }))
          .unwrap()
          .then(async res => {
            setSelectCrops(prev => [...prev, res.data]);
            setCropModal(false);
            setCropModal(!cropModal);
            setFocusOther(false);
            setOtherCrop('');
            await dispatch(setCropId(res?.data._id));
            navigation.navigate('cropDescription', {
              cropName: res?.data?.name,
            });
          })
          .catch(err => console.log(err));
      } else {
        setSelectCrops(prev => [...prev, selectedCrop]);
        setCropModal(false);
        setFocusOther(false);
        setOtherCrop('');
        console.log(
          'i am here bro',
          crops.find(i => i?.name === selectedCrop.name)._id,
        );
        dispatch(
          setCropId(crops.find(i => i?.name === selectedCrop.name)._id),
        ).then(res => {
          console.log('res say', res);
          navigation.navigate('cropDescription', {
            cropName: crops.find(i => i?.name === selectedCrop.name).name,
          });
        });
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
      <CustomDashboard first={t('production')} second={t('cultivation')} />
      {/* top container for land allocated and modify */}
      <View style={styles.top_container}>
        <View style={styles.top_container_inner}>
          <Text style={styles.land_allocated_text}>{t('land allocated')}</Text>
        </View>
        <View style={styles.top_container_inner}>
          <Text style={styles.value_text}>
            {userDetails.sub_area.cultivation.land}{' '}
            {userDetails.land_measurement_symbol
              ? userDetails.land_measurement_symbol
              : userDetails.land_measurement}
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
                  darftStyle={{
                    borderColor: cultivations[0] !== undefined &&cultivations?.find((i) => i?.cultivation_crop?.name == element?.name)?.important_information?.status == 1 ? 'grey' :'#e5c05e'
                  }}
                  drafted={
                    cultivations[0]!==undefined && cultivations?.find((i) => i?.cultivation_crop?.name == element?.name)?.important_information?.status == 1 ? false : true
                  }
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
              cropName={t('add crop')}
              onPress={() => setCropModal(true)}
            />
          </TouchableOpacity>
        </>
      ) : (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator animating size="large" color="#268C43" />
        </View>
      )}
      {cropModal && (
        <AddBottomSheet
          modalVisible={cropModal}
          setBottomModalVisible={toggle => {
            setCropModal(toggle);
            setSelectedCategory({ name: '' });
            setSelectedCrop({});
            setOtherCrop('');
          }}
          styleInner={{ height: focusOther ? '80%' : '35%' }}>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>{t('add crop')}</Text>
            <TouchableOpacity
              onPress={() => {
                setCropModal(false);
                setSelectedCategory({ name: '' });
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
            {/* <CustomDropdown2
              selectedValue={e => {
                setSelectedCrop(
                  crops.find(cp => cp.name === e.name) || {
                    _id: 0,
                    name: 'Others',
                  },
                );
                setOtherCrop('');
                // dispatch(setCropId(crops.find(cp => cp.name === e)._id));
                // DropdownSelectedValue(e);
              }}
              value={selectedCrop}
              placeholder="Select a crop"
              data={[...crops, {_id: 0, name: 'Others'}]}
            /> */}
            <CustomDropdown4
              selectedValue={e => {
                setSelectedCrop(
                  crops.find(cp => cp.name === e.label) || {
                    _id: 0,
                    name: 'Others',
                  },
                );
                setOtherCrop('');
              }}
              data={[...crops, { _id: 0, name: 'Others' }]}
              placeholder="Select a crop"
              valu={{ label: selectedCrop.name, value: selectedCrop._id }}
            />
            {selectedCrop?.name === 'Others' ? (
              <InputWithoutRightElement
                label={t('crop name')}
                placeholder={t('crop 01')}
                onChangeText={e => setOtherCrop(e)}
                value={otherCrop}
                onFocus={() => setFocusOther(true)}
              />
            ) : null}
            <Text
              style={{
                fontFamily: 'ubuntu_regular',
                fontSize: 14 / fontScale,
                marginTop: 5,
                color: '#ff000e',
                marginLeft: 5,
              }}>
              {globalError}
            </Text>
          </View>
          <View style={styles.BottomSheetButton}>
            <TouchableOpacity
              style={styles.crossButton}
              onPress={() => {
                setCropModal(false);
                setSelectedCategory({ name: '' });
                setSelectedCrop({});
                setOtherCrop('');
              }}>
              <Image
                source={require('../../../assets/cross.png')}
                style={styles.addCropIcon}
              />
            </TouchableOpacity>
            <CustomButton
              btnText={t('create')}
              style={{ width: '80%' }}
              onPress={addCrop}
            />
          </View>
        </AddBottomSheet>
      )}
      <PopupModal
        modalVisible={deletePopup}
        setBottomModalVisible={toggle => {
          setDelete_id('');
          setDeleteCrop('');
          setDeletePopup(toggle);
        }}
        styleInner={[styles.savePopup, { width: '90%' }]}>
        <View style={styles.submitPopup}>
          <View style={styles.noteImage}>
            <Image
              source={require('../../../assets/note.png')}
              style={styles.noteImage}
            />
          </View>
          <Text style={styles.confirmText}>{t('confirm')}</Text>
          <Text style={styles.nextText}>
            {t('Do you want to delete this crop?')}
          </Text>
          <View style={styles.bottomPopupbutton}>
            <CustomButton
              style={styles.submitButton}
              btnText={t('yes delete')}
              onPress={handleDelete}
            />
            <CustomButton
              style={styles.draftButton}
              btnText={t('no')}
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
        style={{ height: 'auto', minHeight: 70 }}
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
      justifyContent: 'center',
      alignSelf: 'center',
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
