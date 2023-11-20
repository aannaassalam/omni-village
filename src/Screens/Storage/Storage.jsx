import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Divider} from 'react-native-paper';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2';
import InputWithStorage from '../../Components/CustomInputField/InputWithStorage';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDropdown2 from '../../Components/CustomDropdown/CustomDropdown2';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {
  addStorageMethod,
  getStorageMethod,
} from '../../Redux/StorageMethodSlice';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import {addStorage, editStorage, getStorage} from '../../Redux/StorageSlice';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';
import {useTranslation} from 'react-i18next';
import '../../i18next';

const Storage = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {storageMethod} = useSelector(state => state.storageMethod);
  const {storage} = useSelector(state => state.storage);
  const {user} = useSelector(state => state.auth);
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
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const [cropType, setCropType] = useState('');
  const [loading, setLoading] = useState(false);
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
        name: dropdownVal.name == 'Others' ? otherCrop.name : dropdownVal.name,
        id: dropdownVal.name == 'Others' ? otherCrop._id : dropdownVal._id,
        progress: '',
      },
    ]);
    updateItemById(index, name, stockId);
    setCropModal(!cropModal);
    setFocusOther(false);
    setDropdownVal('');
    setOtherCrop('');
  };
  const addingCrop = (index, name, stockId) => {
    if (dropdownVal.name === 'Others') {
      dispatch(addStorageMethod({name: otherCrop?.name})).then(res => {
        console.log('ress', res);
      });
      dispatch(getStorageMethod());
      setDropdownVal([]);
      setOtherCrop('');
    } else {
      addCrop(index, name, stockId);
    }
  };
  const DropdownSelectedValue = data => {
    setDropdownVal(data);
    console.log('data', data);
    if (data !== 'Others') {
      setFocusOther(false);
    }
  };
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      dispatch(getStorageMethod());
      dispatch(getStorage()).then(res => {
        setLoading(false);
        console.log(res);
        if (res?.payload?.data[0] == undefined) {
          return;
        } else {
          setStorageId(res?.payload?.data[0]?._id);
          setStorageList(
            res?.payload?.data.map(i => {
              console.log('first', i.stock_quantity);
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
      });
    }, []),
  );

  const onContinue = () => {
    if (storageId) {
      let formData = storageList.map(i => {
        return {
          storage_id: i?.storage_id,
          storage_method_name: i?.storage_method_name,
          stock_quantity: parseInt(i?.stock_quantity),
        };
      });
      dispatch(editStorage(formData))
        .unwrap()
        .then(res => {
          navigation.goBack();
        });
    } else {
      let formData = storageList.map(i => {
        return {
          storage_method_name: i?.storage_method_name,
          stock_name: i?.stock_name,
          stock_quantity: parseInt(i?.stock_quantity),
        };
      });
      dispatch(addStorage(formData))
        .unwrap()
        .then(res => {
          navigation.goBack();
        });
    }
  };
  // console.log('storage method', storageList);
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <CustomHeader
          backIcon={true}
          headerName={t('storage')}
          goBack={() => navigation.goBack()}
        />
        <ScrollView>
          {loading ? (
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
                />
              </View>
            </>
          )}
        </ScrollView>
        {cropModal && (
          <AddBottomSheet
            modalVisible={cropModal}
            setBottomModalVisible={setCropModal}
            styleInner={{height: focusOther ? '80%' : '35%'}}>
            <View style={styles.BottomTopContainer}>
              <Text style={styles.headerText}>Add Storage Method</Text>
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
              <CustomDropdown3
                style={{
                  height: 50,
                  marginTop: -10,
                }}
                selectedValue={e => {
                  DropdownSelectedValue({
                    name: e,
                    _id: storageMethod[storageItem?.storage_method_name].find(
                      cp => cp.name == e,
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
                data={storageMethod[storageItem?.storage_method_name]}
                valu={dropdownVal?.name?.name}
              />
              {dropdownVal.name === 'Others' ? (
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
                onPress={() => setCropModal(!cropModal)}>
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
                    dropdownVal.name == 'Others'
                      ? otherCrop.name
                      : dropdownVal.name,
                    dropdownVal.name == 'Others'
                      ? otherCrop._id
                      : dropdownVal._id,
                  )
                }
              />
            </View>
          </AddBottomSheet>
        )}
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
