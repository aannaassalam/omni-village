import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  Image,
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
import CustomDropdown4 from '../../Components/CustomDropdown/CustomDropdown4';

const Storage = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {storageMethod} = useSelector(state => state.storageMethod);
  const {storage} = useSelector(state => state.storage);
  const {user} = useSelector(state => state.auth);
  const [storageList, setStorageList] = useState([]);
  const [storageItem, setStorageItem] = useState(null);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const [cropType, setCropType] = useState('');
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState('');

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

  const updateValueById = (item, value) => {
    var local_storage_list = storageList;
    local_storage_list.map(ls => {
      if (ls.stock_name === item) {
        ls.stock_quantity = value;
      }
      return ls;
    });
    setStorageList([...local_storage_list]);
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
    if (dropdownVal.name?.label === 'Others') {
      dispatch(
        addStorageMethod({
          name: otherCrop?.name,
          type: storageItem?.stock_name.includes('vegetables' || 'grain')
            ? 'grain'
            : storageItem?.stock_name.includes('meat')
            ? 'meat'
            : storageItem?.stock_name.includes('poultry')
            ? 'poultry'
            : '',
        }),
      ).then(res => {
        // console.log('ress', res);
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
      });
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      const processed_data = [];
      Object.keys(storageMethod)
        .sort()
        .forEach(local_storage => {
          const current_user_storage = storage.find(
            st => st?.stock_name === local_storage,
          );
          processed_data.push({
            storage_id: current_user_storage?._id,
            stock_name: local_storage,
            storage_dropdown: storageMethod[local_storage],
            stock_quantity: current_user_storage?.stock_quantity || '',
            storage_name: current_user_storage?.storage_method?.name,
            storage_method_id: current_user_storage?.storage_method?._id,
          });
        });
      setStorageList(processed_data);
    }, [storage, storageMethod]),
  );

  const onContinue = () => {
    const total_quant = storageList.reduce((prev, current) => {
      return prev + parseInt(current.stock_quantity || "0");
    }, 0);
    if (total_quant <= user.sub_area.storage) {
      if (!storage.length) {
        dispatch(
          addStorage(
            storageList.map(st =>
              st.stock_quantity === '' ? {...st, stock_quantity: 0} : st,
            ),
          ),
        )
          .then(() => navigation.goBack())
          .catch(err => console.log(err));
      } else {
        dispatch(
          editStorage(
            storageList.map(st =>
              st.stock_quantity === '' ? {...st, stock_quantity: 0} : st,
            ),
          ),
        )
          .then(() => navigation.goBack())
          .catch(err => console.log(err));
      }
    } else {
      setGlobalError(
        'Storage biforcation cannot be greater than Storage land allocated',
      );
    }
  };

  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Storage'}
        goBack={() => navigation.goBack()}
      />
      <ScrollView>
        {loading ? (
          <View style={{padding: 50, marginTop: '80%'}}>
            <ActivityIndicator animating size="large" color="#268C43" />
          </View>
        ) : (
          <>
            <CustomDashboard first={'Production'} second={'Storage'} />
            <CustomDashboard2
              allocatedFor={'Storage'}
              usedLand={user.sub_area.storage}
            />
            <View style={styles.subArea}>
              <Text style={styles.subAreaText}>Storage</Text>
              <Divider
                bold={true}
                style={[styles.divider]}
                horizontalInset={true}
              />
            </View>
            <View style={styles.storageInput}>
              {storageList.map((item, index) => {
                console.log(item?.stock_quantity, 'quan');
                return (
                  <InputWithStorage
                    productionName={`For ${item?.stock_name}`}
                    onChangeText={e => updateValueById(item?.stock_name, e)}
                    val={item?.stock_quantity.toString()}
                    keyboardType="numeric"
                    storageMethod={item?.storage_name || 'Add Storage'}
                    storagePress={() => {
                      setStorageItem({...item, index: index});
                      setCropModal(true);
                    }}
                    key={item?.stock_name}
                  />
                );
              })}
            </View>
            <Text style={styles.error}>{globalError}</Text>
            <View style={styles.buttonContainer}>
              <CustomButton btnText={'Continue'} onPress={onContinue} />
            </View>
          </>
        )}
      </ScrollView>
      {cropModal && (
        <AddBottomSheet>
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
            <CustomDropdown4
              style={{
                height: 50,
                marginTop: -10,
              }}
              selectedValue={e => {
                DropdownSelectedValue({
                  name: e,
                  _id: storageItem?.stock_name.includes('grain' || 'Grain')
                    ? storageMethod?.grain.find(cp => cp.name === e)?._id
                    : storageItem?.stock_name.includes('poultry' || 'Poultry')
                    ? storageMethod?.poultry.find(cp => cp.name === e)?._id
                    : storageItem?.stock_name.includes('hunting' || 'Hunting')
                    ? storageMethod?.meat.find(cp => cp.name === e)?._id
                    : storageMethod?.grain.find(cp => cp.name === e)?._id,
                });
              }}
              data={storageMethod[storageItem.stock_name]}
              valu={dropdownVal?.name?.value}
            />
            {dropdownVal.name?.label === 'Others' ? (
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
              onPress={() => {
                var local_storage_list = storageList;
                local_storage_list.map(ls => {
                  if (ls.stock_name === storageItem.stock_name) {
                    ls.storage_name = dropdownVal.name.label;
                    ls.storage_method_id = dropdownVal.name.value;
                  }
                  return ls;
                });
                console.log(local_storage_list, 'local');
                setStorageList(local_storage_list);
                setCropModal(false);
              }}
            />
          </View>
        </AddBottomSheet>
      )}
    </View>
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
      // marginTop: 'auto',
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
      backgroundColor: 'pink',
    },
    addCropIcon: {
      height: 50,
      width: 50,
    },
    error: {
      fontFamily: 'ubuntu_regular',
      fontSize: 14 / fontScale,
      // marginTop: 5,
      color: '#ff000e',
      marginLeft: 20,
      marginBottom: 20,
    },
  });
