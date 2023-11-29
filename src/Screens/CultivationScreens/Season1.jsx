import {useFocusEffect} from '@react-navigation/native';
import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {useDispatch} from 'react-redux';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomDropdown4 from '../../Components/CustomDropdown/CustomDropdown4';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import PopupModal from '../../Components/Popups/PopupModal';
import {useUser} from '../../Hooks/useUser';
import {setCropId} from '../../Redux/CultivationSlice';
import {addCultivationCorp, fetchCultivationCorp} from '../../functions/Corps';
import {
  deleteCultivation,
  fetchCultivations,
} from '../../functions/CultivationScreen';
import '../../i18next';

const Season1 = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {t} = useTranslation();
  const [cropModal, setCropModal] = useState(false);
  const [otherCrop, setOtherCrop] = useState('');
  const [selectCrops, setSelectCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState({});
  const [deletePopup, setDeletePopup] = useState(false);
  const [delete_id, setDelete_id] = useState('');
  const [globalError, setGlobalError] = useState('');

  const bottomSheetRef = React.useRef(null);

  const dispatch = useDispatch();
  const {data: userDetails} = useUser();
  const {data: crops = []} = useQuery({
    queryKey: ['cultivation_crop'],
    queryFn: fetchCultivationCorp,
    refetchOnWindowFocus: true,
  });
  const {
    data: cultivations,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['cultivations'],
    queryFn: fetchCultivations,
    refetchOnWindowFocus: true,
  });

  const {mutate: saveCrop, isPending} = useMutation({
    mutationFn: addCultivationCorp,
    onSuccess: data => {
      setSelectCrops(prev => [...prev, data]);
      setCropModal(false);
      setCropModal(!cropModal);
      setOtherCrop('');
      navigation.navigate('cropDescription', {
        cropName: data?.name,
        crop_id: data?._id,
      });
    },
    onError: err => console.log(err),
  });

  const {mutate: deleteCultivationData, isPending: deleteCultivationPending} =
    useMutation({
      mutationFn: deleteCultivation,
      onSuccess: () => {
        setDeletePopup(false);
        setDelete_id('');
        refetch();
      },
      onError: () =>
        Toast.show({
          type: 'error',
          text1: 'Error Occurred',
          text2: 'Something Went wrong, Please try again later!',
        }),
    });

  const {seasonName = 'Season 1'} = route.params;
  useFocusEffect(
    useCallback(() => {
      // queryClient.invalidateQueries();
      refetch();
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      setSelectCrops(prev =>
        cultivations?.map(c => ({
          name: c.cultivation_crop.name,
          _id: c.cultivation_crop._id,
          cultivation: c,
          status: c.important_information.status,
        })),
      );
      return () => {
        setSelectCrops([]);
        setSelectedCrop({});
        setGlobalError('');
      };
    }, [cultivations]),
  );

  const addCrop = () => {
    if (!selectedCrop.name) {
      setGlobalError('Please Select a Corp!');
      return;
    }
    if (cultivations.find(c => c.crop_id === selectedCrop._id)) {
      setGlobalError('Crop is already added!');
    } else {
      if (selectedCrop.name === 'Others' && otherCrop.length > 0) {
        saveCrop({name: otherCrop, categoryId: ''});
      } else {
        setCropModal(false);
        setOtherCrop('');
        navigation.navigate('cropDescription', {
          cropName: crops.find(i => i?.name === selectedCrop.name).name,
          crop_id: crops.find(i => i?.name === selectedCrop.name)._id,
        });
      }
      bottomSheetRef.current.close();
    }
  };

  const handleDelete = () => {
    deleteCultivationData(delete_id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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
            <Text style={styles.land_allocated_text}>
              {t('land allocated')}
            </Text>
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
        {!isLoading ? (
          <FlatList
            data={selectCrops}
            keyExtractor={item => item._id}
            onRefresh={refetch}
            refreshing={isFetching}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.addAndDeleteButtonSection}
                onPress={() => {
                  navigation.navigate('cropDescription', {
                    cropName: item?.name,
                    crop_id: item?._id,
                    cultivation: item?.cultivation,
                  });
                }}>
                <AddAndDeleteCropButton
                  darftStyle={{
                    borderColor: item.status === 1 ? 'grey' : '#e5c05e',
                  }}
                  drafted={item.status === 0}
                  add={false}
                  cropName={item?.name}
                  onPress={() => {
                    setDelete_id(item.cultivation._id);
                    setDeletePopup(true);
                  }}
                />
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.addAndDeleteButtonSection}
                onPress={() => setCropModal(true)}>
                <AddAndDeleteCropButton
                  add={true}
                  cropName={t('add crop')}
                  onPress={() => setCropModal(true)}
                />
              </TouchableOpacity>
            }
          />
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator animating size="large" color="#268C43" />
          </View>
        )}

        {/* {cropModal && ( */}
        <AddBottomSheet
          modalVisible={cropModal}
          setBottomModalVisible={toggle => {
            setCropModal(toggle);
            setSelectedCrop({});
            setOtherCrop('');
            setGlobalError('');
            bottomSheetRef.current.close();
          }}
          setModal={setCropModal}
          bottomSheetRef={bottomSheetRef}>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>{t('add crop')}</Text>
            <TouchableOpacity
              onPress={() => {
                setCropModal(false);
                setSelectedCrop({});
                setOtherCrop('');
                setGlobalError('');
                bottomSheetRef.current.close();
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
              data={isLoading ? [] : [...crops, {_id: 0, name: 'Others'}]}
              placeholder="Select a crop"
              valu={{label: selectedCrop.name, value: selectedCrop._id}}
            />
            {selectedCrop?.name === 'Others' ? (
              <InputWithoutRightElement
                label={t('crop name')}
                placeholder={t('crop 01')}
                onChangeText={e => setOtherCrop(e)}
                value={otherCrop}
              />
            ) : null}
            <Text
              style={{
                fontFamily: 'ubuntu-regular',
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
                setSelectedCrop({});
                setOtherCrop('');
                setGlobalError('');
                bottomSheetRef.current.close();
              }}>
              <Image
                source={require('../../../assets/cross.png')}
                style={styles.addCropIcon}
              />
            </TouchableOpacity>
            <CustomButton
              btnText={t('create')}
              style={{width: '80%'}}
              onPress={addCrop}
              loading={isPending}
            />
          </View>
        </AddBottomSheet>
        {/* // )} */}
        <PopupModal
          modalVisible={deletePopup}
          setBottomModalVisible={toggle => {
            setDelete_id('');
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
            <Text style={styles.confirmText}>{t('confirm')}</Text>
            <Text style={styles.nextText}>
              {t('Do you want to delete this corp?')}
            </Text>
            <View style={styles.bottomPopupbutton}>
              <CustomButton
                style={styles.submitButton}
                btnText={t('yes delete')}
                onPress={handleDelete}
                loading={deleteCultivationPending}
              />
              <CustomButton
                style={styles.draftButton}
                btnText={t('no')}
                onPress={() => {
                  setDelete_id('');
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
    </SafeAreaView>
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
      fontFamily: 'ubuntu-medium',
    },
    value_text: {
      fontSize: 14 / fontScale,
      color: '#fff',
      fontFamily: 'ubuntu-medium',
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
      fontFamily: 'ubuntu-medium',
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
      fontFamily: 'ubuntu-medium',
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
