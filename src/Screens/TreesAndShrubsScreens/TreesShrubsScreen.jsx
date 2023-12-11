import {useMutation, useQuery} from '@tanstack/react-query';
import React, {useCallback, useEffect, useState} from 'react';
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
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2';
import CustomDropdown4 from '../../Components/CustomDropdown/CustomDropdown4';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import PopupModal from '../../Components/Popups/PopupModal';
import {useUser} from '../../Hooks/useUser';
import {addTreeCorp, fetchTreeCorp} from '../../functions/Corps';
import {fetchTrees, deleteTree} from '../../functions/TreesAndShrubsScreen';
import '../../i18next';
import {useFocusEffect} from '@react-navigation/native';

const TreesShrubsScreen = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const dispatch = useDispatch();
  const {data: userDetails} = useUser();
  const {t} = useTranslation();
  const totalLand = userDetails.sub_area.trees;
  const [cropType, setCropType] = useState([]);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState({});
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const [delete_id, setDelete_id] = useState('');
  const [deletePopup, setDeletePopup] = useState(false);
  const [globalError, setGlobalError] = useState('');

  const bottomSheetRef = React.useRef(null);

  const {data: treeCrops = [], isLoading} = useQuery({
    queryKey: ['treeCrop'],
    queryFn: fetchTreeCorp,
    refetchOnWindowFocus: true,
  });

  const {
    data: trees,
    isLoading: isTreesLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['trees'],
    queryFn: fetchTrees,
    refetchOnWindowFocus: true,
  });

  useFocusEffect(
    useCallback(() => {
      // queryClient.invalidateQueries();
      refetch();
    }, []),
  );

  const {mutate: saveCrop, isPending} = useMutation({
    mutationFn: addTreeCorp,
    onSuccess: data => {
      // setCropType(prev => [...prev, data]);
      setCropModal(false);
      setOtherCrop('');
      navigation.navigate('type', {
        cropName: data?.name,
        crop_id: data?._id,
      });
      bottomSheetRef.current.close();
    },
  });

  const {mutate: deleteTreeData, isPending: deleteTreePending} = useMutation({
    mutationFn: deleteTree,
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

  const addCrop = () => {
    if (!dropdownVal.name) {
      setGlobalError('Please Select a Corp!');
      return;
    }
    if (trees.find(c => c.tree_crop_id === dropdownVal._id)) {
      setGlobalError('Crop is already added!');
    } else {
      if (dropdownVal.name.label === 'Others' && otherCrop.length > 0) {
        saveCrop({name: otherCrop, country: [userDetails.country]});
      } else {
        setCropModal(false);
        setOtherCrop('');
        navigation.navigate('type', {
          cropName: treeCrops.find(i => i?.name === dropdownVal.name?.label)
            .name,
          crop_id: treeCrops.find(i => i?.name === dropdownVal.name?.label)._id,
        });
        bottomSheetRef.current.close();
      }
    }
  };

  const DropdownSelectedValue = data => {
    setDropdownVal(data);
    if (data !== 'Others') {
      setFocusOther(false);
    }
  };

  const handleDelete = () => {
    deleteTreeData(delete_id);
  };

  useEffect(() => {
    setCropType(
      trees?.map(i => ({
        name: i.tree_crop.name,
        _id: i.tree_crop._id,
        data: i,
        status: i.status,
      })),
    );
  }, [trees]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <CustomHeader
        goBack={() => navigation.goBack()}
        headerName={t('tree shrub grassland')}
        backIcon={true}
      />
      {/*Top Dashboard  */}
      <CustomDashboard
        first={t('production')}
        second={t('tree shrub grassland')}
      />
      {/* Next Dashboard */}
      <CustomDashboard2
        allocatedFor={t('tree shrub grassland')}
        usedLand={totalLand}
      />

      {!isTreesLoading ? (
        <FlatList
          data={cropType}
          keyExtractor={item => item._id}
          onRefresh={refetch}
          refreshing={isFetching}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.addAndDeleteButtonSection}
              onPress={() => {
                navigation.navigate('type', {
                  cropName: item?.name,
                  crop_id: item?._id,
                  data: item.data,
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
                cropName={t('add tree shrub')}
                onPress={() => setCropModal(true)}
              />
            </TouchableOpacity>
          }
        />
      ) : (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator animating size="large" color="#268C43" />
        </View>
      )}
      {/* Crop adding */}
      <AddBottomSheet
        modalVisible={cropModal}
        bottomSheetRef={bottomSheetRef}
        setModal={setCropModal}>
        <View style={styles.BottomTopContainer}>
          <Text style={styles.headerText}>{t('add tree shrub')}</Text>
          <TouchableOpacity
            onPress={() => {
              setCropModal(!cropModal);
              setFocusOther(false);
              setDropdownVal({});
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
              DropdownSelectedValue({name: e, _id: e.value});
            }}
            data={isLoading ? [] : [...treeCrops, {_id: 0, name: 'Others'}]}
            valu={dropdownVal?.name}
          />
          {dropdownVal.name?.label === 'Others' ? (
            <InputWithoutRightElement
              label={t('tree shrub name')}
              placeholder={t('eg banyan')}
              onChangeText={e => setOtherCrop(e)}
              value={otherCrop}
              onFocus={() => setFocusOther(true)}
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
            onPress={addCrop}
            loading={isPending}
          />
        </View>
      </AddBottomSheet>
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
              loading={deleteTreePending}
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
