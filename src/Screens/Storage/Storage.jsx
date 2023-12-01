import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {ActivityIndicator, Divider} from 'react-native-paper';
import {useDispatch, useSelector} from 'react-redux';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import InputWithStorage from '../../Components/CustomInputField/InputWithStorage';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import '../../i18next';
import {useUser} from '../../Hooks/useUser';
import {useMutation, useQuery} from '@tanstack/react-query';
import {
  addStorage,
  editStorage,
  fetchStorages,
} from '../../functions/storageScreen';
import {addStorageMethod, fetchStorageMethod} from '../../functions/Corps';

const Storage = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {data: user} = useUser();
  const {data: storageMethod, isMethodLoading} = useQuery({
    queryKey: ['storage_method'],
    queryFn: fetchStorageMethod,
    refetchOnWindowFocus: true,
  });

  const {data: storage, isLoading} = useQuery({
    queryKey: ['storage'],
    queryFn: fetchStorages,
  });
  const {t} = useTranslation();
  const [storageList, setStorageList] = useState([
    {
      storage_id: 1,
      stock_name: 'for grain',
      stock_value: t('for grains'),
      stock_quantity: 0,
      storage_method_name: '',
      storage_name: 'grain',
      storage_method_id: '',
    },
    {
      storage_id: 2,
      stock_name: 'for poultry',
      stock_value: t('for poultry'),
      stock_quantity: 0,
      storage_method_name: '',
      storage_name: 'poultry',
      storage_method_id: '',
    },
    {
      storage_id: 3,
      stock_name: 'for meat',
      stock_value: t('for meat'),
      stock_quantity: 0,
      storage_method_name: '',
      storage_name: 'meat',
      storage_method_id: '',
    },
    {
      storage_id: 4,
      stock_name: 'for vegetables & fruits',
      stock_value: t('for fruits & vegetables'),
      stock_quantity: 0,
      storage_method_name: '',
      storage_name: 'vegetables & fruits',
      storage_method_id: '',
    },
  ]);
  const [storageItem, setStorageItem] = useState(null);
  const [storageId, setStorageId] = useState('');
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState({});
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const [cropType, setCropType] = useState('');
  const [loading, setLoading] = useState(false);

  const bottomSheetRef = useRef(null);

  const {
    mutate: addingStorageMethodData,
    isPending: isAddingStorageMethodPending,
  } = useMutation({
    mutationFn: addStorageMethod,
    onSuccess: data =>
      setCropType(prev => [
        ...prev,
        {
          name: data.name,
          id: data._id,
          progress: '',
        },
      ]),
  });

  const {mutate: addStorageData, isPending: isAddStoragePending} = useMutation({
    mutationFn: addStorage,
    onSuccess: () => navigation.goBack(),
  });

  const {mutate: editStorageData, isPending: isEditStoragePending} =
    useMutation({
      mutationFn: editStorage,
      onSuccess: () => navigation.goBack(),
    });

  const updateItemById = (indx, newName, stockId) => {
    const objectIndex = storageList.findIndex((item, index) => index === indx);
    if (objectIndex === -1) {
      return;
    }
    const newData = [...storageList];
    newData[objectIndex].storage_method_name = newName;
    newData[objectIndex].storage_method_id = stockId;
    setStorageList(newData);
  };

  const updateValueById = (indx, value) => {
    const objectIndex = storageList.findIndex((item, index) => index === indx);
    if (objectIndex === -1) {
      return;
    }
    const newData = [...storageList];
    newData[objectIndex].stock_quantity = value;
    setStorageList(newData);
  };

  const addCrop = (index, name, stockId) => {
    setCropType([
      ...cropType,
      {
        name: dropdownVal.name === 'Others' ? otherCrop.name : dropdownVal.name,
        id: dropdownVal.name === 'Others' ? otherCrop._id : dropdownVal._id,
        progress: '',
      },
    ]);
    updateItemById(index, name, stockId);
    setCropModal(!cropModal);
    setFocusOther(false);
    setDropdownVal(null);
    setOtherCrop('');
  };

  const addingCrop = (index, name, stockId) => {
    if (dropdownVal.name === 'Others') {
      addingStorageMethodData({name: otherCrop?.name});
      setDropdownVal({});
      setOtherCrop('');
    } else {
      addCrop(index, name, stockId);
    }
    bottomSheetRef.current.close();
  };

  const DropdownSelectedValue = data => {
    setDropdownVal(data);
    if (data !== 'Others') {
      setFocusOther(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      if (storage?.[0] === undefined) {
        return;
      } else {
        setStorageId(storage?.[0]?._id);
        setStorageList(
          storage?.map(i => {
            return {
              storage_id: i?._id,
              stock_name: i?.stock_name,
              stock_value: t(i?.stock_name),
              stock_quantity: i?.stock_quantity,
              storage_method_name: i?.storage_method_name,
              storage_name: i?.storage_name,
              storage_method_id: i?.storage_method_id,
            };
          }),
        );
      }
    }, []),
  );

  console.log(storage, 'list');

  const onContinue = () => {
    if (storageId) {
      let formData = storageList.map(i => {
        return {
          storage_id: i?.storage_id,
          storage_method_name: i?.storage_method_name,
          stock_quantity: parseInt(i?.stock_quantity),
        };
      });
      editStorageData(formData);
    } else {
      let formData = storageList.map(i => {
        return {
          stock_name: i?.stock_name,
          storage_method_name: i?.storage_method_name,
          stock_quantity: parseInt(i?.stock_quantity),
        };
      });
      addStorageData(formData);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <CustomHeader
          backIcon={true}
          headerName={t('storage')}
          goBack={() => navigation.goBack()}
        />
        <ScrollView>
          {isMethodLoading ? (
            <View style={{padding: 50, marginTop: '80%'}}>
              <ActivityIndicator
                size={'small'}
                color="black"
                animating={true}
              />
            </View>
          ) : (
            <>
              <CustomDashboard first={t('production')} second={t('storage')} />
              <CustomDashboard2
                allocatedFor={t('storage')}
                usedLand={user.sub_area.storage}
              />
              <View style={styles.subArea}>
                <Text style={styles.subAreaText}>{t('storage')}</Text>
                <Divider
                  bold={true}
                  style={[styles.divider]}
                  horizontalInset={true}
                />
              </View>
              <View style={styles.storageInput}>
                {storageList.map((item, index) => {
                  return (
                    <InputWithStorage
                      key={index}
                      productionName={item?.stock_value}
                      onChangeText={e => updateValueById(index, e)}
                      val={item?.stock_quantity.toString()}
                      keyboardType="numeric"
                      storageMethod={
                        item?.storage_method_name.charAt(0).toUpperCase() +
                        item?.storage_method_name.slice(1)
                      }
                      storagePress={() => {
                        setStorageItem({...item, index: index});
                        setCropModal(true);
                      }}
                    />
                  );
                })}
              </View>
              <View style={styles.buttonContainer}>
                <CustomButton
                  btnText={'Continue'}
                  onPress={() => onContinue()}
                  loading={isAddStoragePending || isEditStoragePending}
                />
              </View>
            </>
          )}
        </ScrollView>
        <AddBottomSheet
          modalVisible={cropModal}
          setModal={setCropModal}
          bottomSheetRef={bottomSheetRef}
          styleInner={{height: focusOther ? '80%' : '35%'}}>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>Add Storage Method</Text>
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
            <CustomDropdown3
              style={{
                height: 50,
                marginTop: -10,
              }}
              selectedValue={e => {
                DropdownSelectedValue({
                  name: e,
                  _id: storageMethod?.[storageItem?.storage_name]?.find(
                    cp => cp.name === e,
                  )?._id,
                  // _id: storageItem?.stock_name.includes('grain' || 'Grains')
                  //   ? storageMethod?.grain.find(cp => cp.name === e)?._id
                  //   : storageItem?.stock_name.includes('poultry' || 'Poultry')
                  //     ? storageMethod?.poultry.find(cp => cp.name === e)?._id
                  //     : storageItem?.stock_name.includes('meat' || 'Meat')
                  //       ? storageMethod?.meat.find(cp => cp.name === e)?._id
                  //       : storageMethod?.grain.find(cp => cp.name === e)?._id,
                });
              }}
              data={storageMethod?.[storageItem?.storage_name]}
              defaultVal={{key: '', value: dropdownVal?.name?.name}}
            />
            {dropdownVal?.name === 'Others' ? (
              <InputWithoutRightElement
                label={'Storage Name'}
                placeholder={'Eg: Racks'}
                onChangeText={e => setOtherCrop({name: e, _id: 0})}
                value={otherCrop?.name}
                onFocus={() => setFocusOther(true)}
              />
            ) : null}
          </View>
          <View style={styles.BottomSheetButton}>
            <TouchableOpacity
              style={styles.crossButton}
              onPress={() => {
                setCropModal(!cropModal);
                setDropdownVal({});
                bottomSheetRef.current.close();
              }}>
              <Image
                source={require('../../../assets/cross.png')}
                style={styles.addCropIcon}
              />
            </TouchableOpacity>
            <CustomButton
              btnText={'Create'}
              style={{width: '80%'}}
              onPress={() =>
                addingCrop(
                  storageItem?.index,
                  dropdownVal.name === 'Others'
                    ? otherCrop.name
                    : dropdownVal.name,
                  dropdownVal.name === 'Others'
                    ? otherCrop._id
                    : dropdownVal._id,
                )
              }
            />
          </View>
        </AddBottomSheet>
      </View>
    </SafeAreaView>
  );
};

export default Storage;

const width = Dimensions.get('window').width;
const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    subArea: {
      alignSelf: 'center',
      flexDirection: 'row',
      paddingHorizontal: 20,
      margin: 10,
      marginTop: '5%',
      width: width / 1,
    },
    divider: {
      alignSelf: 'center',
      height: 1,
      width: '80%',
      marginTop: 5,
      color: 'grey',
    },
    subAreaText: {
      alignSelf: 'center',
      fontSize: 14 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu',
    },
    storageInput: {
      width: '94%',
      alignSelf: 'center',
      marginBottom: '5%',
    },
    buttonContainer: {
      width: '90%',
      // position: 'absolute',
      // bottom: 0,
      justifyContent: 'flex-end',
      alignContent: 'flex-end',
      alignSelf: 'center',
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
