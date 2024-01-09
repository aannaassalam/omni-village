import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  Alert,
  FlatList,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import {useFocusEffect} from '@react-navigation/native';
import {getPoultryCrops} from '../../Redux/PoultryCropSlice';
import {getPoultry} from '../../Redux/PoultrySlice';
import {useDispatch, useSelector} from 'react-redux';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import {getFeed} from '../../Redux/OthersSlice';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';
import CustomDropdown2 from '../../Components/CustomDropdown/CustomDropdown2';
import CustomDropdown4 from '../../Components/CustomDropdown/CustomDropdown4';
import {ActivityIndicator} from 'react-native';
import {useTranslation} from 'react-i18next';
import '../../i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useUser} from '../../Hooks/useUser';
import {useMutation, useQuery} from '@tanstack/react-query';
import {addPoultryCorp, fetchPoultryCorp} from '../../functions/Corps';
import {deletePoultry, fetchPoultries} from '../../functions/poultryScreen';
import PopupModal from '../../Components/Popups/PopupModal';
import Toast from 'react-native-toast-message';

const Poultry = ({navigation, route}) => {
  const {data: user} = useUser();
  const totalLand = user.sub_area.poultry;
  const {t} = useTranslation();
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [cropType, setCropType] = useState([]);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [delete_id, setDelete_id] = useState('');
  const [globalError, setGlobalError] = useState('');

  const {data: poultryCrops = [], isLoading: isPoultryCropLoading} = useQuery({
    queryKey: ['poultry_crop'],
    queryFn: fetchPoultryCorp,
  });

  const {
    data: poultry,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['poultry'],
    queryFn: fetchPoultries,
  });

  const {mutate, isPending} = useMutation({
    mutationFn: addPoultryCorp,
    onSuccess: data => {
      navigation.navigate('poultryType', {
        cropType: data?.name,
        cropId: data?._id,
        data: null,
      });
      bottomSheetRef.current.close();
    },
    onError: err => {
      console.log(err);
      Toast.show({
        type: 'error',
        text1: 'Error Occurred',
        text2: 'Something Went wrong, Please try again later!',
      });
    },
    onSettled: () => {
      setDropdownVal({});
      setCropModal(!cropModal);
      setOtherCrop('');
    },
  });

  const {mutate: deletePoultryData, isPending: isDeletePoultryPending} =
    useMutation({
      mutationFn: deletePoultry,
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

  const bottomSheetRef = useRef(null);

  const handleRemoveClick = (id, index) => {
    const list = [...cropType];
    list.splice(index, 1);
    setCropType(list);
    dispatch(deletePoultry(id));
  };

  const addCrop = () => {
    let ids = cropType.map(i => i?.id || i?._id);
    if (ids?.includes(dropdownVal?.name?.value)) {
      setGlobalError('Crop already exists!');
    } else {
      // setCropType([
      //   ...cropType,
      //   {
      //     name:
      //       dropdownVal.name == 'Others'
      //         ? otherCrop.name
      //         : dropdownVal.name?.label,
      //     id:
      //       dropdownVal.name == 'Others'
      //         ? otherCrop._id
      //         : dropdownVal.name?.value,
      //     progress: '',
      //   },
      // ]);
      navigation.navigate('poultryType', {
        cropType: dropdownVal.name?.label,
        cropId: dropdownVal.name?.value,
        data: poultry.find(
          i => i?.poultry_crop?._id === dropdownVal.name?.value,
        ),
      });
      setCropModal(!cropModal);
      setDropdownVal({});
      setOtherCrop('');
      bottomSheetRef.current.close();
    }
  };

  const addingTreesCrop = () => {
    if (dropdownVal.name?.label === 'Others') {
      mutate({name: otherCrop?.name, country: [user.country]});
    } else {
      addCrop();
    }
  };

  const DropdownSelectedValue = data => {
    setDropdownVal(data);
    if (data !== 'Others') {
      setFocusOther(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, []),
  );

  useEffect(() => {
    setCropType(
      poultry?.map(c => ({
        name: c.poultry_crop.name,
        _id: c.poultry_crop._id,
        data: c,
        status: c.status,
      })),
    );

    return () => {
      setCropType([]);
      setDropdownVal({});
      setGlobalError('');
    };
  }, [poultry]);

  const handleDelete = () => {
    deletePoultryData(delete_id);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <CustomHeader
          backIcon={true}
          headerName={t('livestock feed produce')}
          goBack={() => navigation.goBack()}
        />
        {/*Top Dashboard  */}
        <CustomDashboard first={t('production')} second={t('poultry')} />
        {/* Next Dashboard */}
        <CustomDashboard2
          allocatedFor={t('livestock feed produce')}
          usedLand={totalLand}
        />
        {isLoading ? (
          <View style={{marginTop: '60%'}}>
            <ActivityIndicator size={'large'} color="black" />
          </View>
        ) : (
          <FlatList
            data={cropType}
            keyExtractor={item => item._id}
            onRefresh={refetch}
            refreshing={isFetching}
            contentContainerStyle={{paddingBottom: 50}}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.addAndDeleteButtonSection}
                onPress={() => {
                  navigation.navigate('poultryType', {
                    cropName: item?.name,
                    crop_id: item?._id,
                    data: item?.data,
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
                    setDelete_id(item.data._id);
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
                  cropName={t('add livestock')}
                  onPress={() => setCropModal(true)}
                />
              </TouchableOpacity>
            }
          />
        )}

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
                loading={isDeletePoultryPending}
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

        <AddBottomSheet
          modalVisible={cropModal}
          setModal={setCropModal}
          bottomSheetRef={bottomSheetRef}>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>{t('add livestock')}</Text>
            <TouchableOpacity
              onPress={() => {
                setCropModal(!cropModal);
                setFocusOther(false);
                setDropdownVal('');
                bottomSheetRef.current.close();
              }}>
              <Image
                source={require('../../../assets/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.dropdownSection}>
            <CustomDropdown4
              selectedValue={e => {
                DropdownSelectedValue({name: e, _id: e._id});
              }}
              data={[...(poultryCrops || []), {_id: 0, name: 'Others'}]}
              valu={dropdownVal?.name}
            />
            {dropdownVal.name?.label === 'Others' ? (
              <InputWithoutRightElement
                label={t('livestock name')}
                placeholder={t('eg hen')}
                onChangeText={e => setOtherCrop({name: e, _id: 0})}
                value={otherCrop}
                onFocus={() => setFocusOther(true)}
              />
            ) : null}
          </View>
          <View style={styles.BottomSheetButton}>
            <TouchableOpacity
              style={styles.crossButton}
              onPress={() => {
                setCropModal(!cropModal);
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
              onPress={addingTreesCrop}
              loading={isPending}
            />
          </View>
        </AddBottomSheet>
      </View>
    </SafeAreaView>
  );
};

export default Poultry;

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
    },
    addCropIcon: {
      height: 50,
      width: 50,
    },
  });
