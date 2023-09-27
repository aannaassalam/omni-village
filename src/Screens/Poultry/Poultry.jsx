import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import {useFocusEffect} from '@react-navigation/native';
import {addPoultryCrops, getPoultryCrops} from '../../Redux/PoultryCropSlice';
import {deletePoultry, getPoultry} from '../../Redux/PoultrySlice';
import {useDispatch, useSelector} from 'react-redux';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import {getFeed} from '../../Redux/OthersSlice';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';
import CustomDropdown2 from '../../Components/CustomDropdown/CustomDropdown2';
import CustomDropdown4 from '../../Components/CustomDropdown/CustomDropdown4';
import {ActivityIndicator} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import '../../i18next';

const Poultry = ({navigation, route}) => {
  const {user} = useSelector(state => state.auth);
  const totalLand = user.sub_area.poultry;
  const {t} = useTranslation();
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [cropType, setCropType] = useState([]);
  const {poultryCrops} = useSelector(state => state?.poultryCrop);
  const {poultry} = useSelector(state => state?.poultry);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const handleRemoveClick = (id, index) => {
    const list = [...cropType];
    list.splice(index, 1);
    setCropType(list);
    dispatch(deletePoultry(id));
  };
  const addCrop = () => {
    let ids = cropType.map(i => i?.id || i?._id);
    if (ids?.includes(dropdownVal?.name?.value)) {
      Alert.alert('Crop Already exists');
      setCropModal(!cropModal);
      setFocusOther(false);
      setDropdownVal('');
    } else {
      setCropType([
        ...cropType,
        {
          name:
            dropdownVal.name == 'Others'
              ? otherCrop.name
              : dropdownVal.name?.label,
          id:
            dropdownVal.name == 'Others'
              ? otherCrop._id
              : dropdownVal.name?.value,
          progress: '',
        },
      ]);
      navigation.navigate('poultryType', {
        cropType: dropdownVal.name?.label,
        cropId:
          poultry[0] !== undefined &&
          poultry.find(j => j?.poultry_crop?.name == dropdownVal.name?.label)
            ? poultry.find(
                i => i?.poultry_crop?.name == dropdownVal.name?.label,
              )._id
            : dropdownVal.name?.value,
        data: poultry.find(i => i?.poultry_crop_id == dropdownVal.name?.value),
      });
      setCropModal(!cropModal);
      setFocusOther(false);
      setDropdownVal('');
      setOtherCrop('');
    }
  };
  const addingTreesCrop = () => {
    if (dropdownVal.name?.label === 'Others') {
      dispatch(addPoultryCrops({name: otherCrop?.name})).then(res => {
        navigation.navigate('poultryType', {
          cropType: res?.payload?.data?.name,
          cropId: res?.payload?.data?._id,
          data: null,
        });
      });
      dispatch(getPoultryCrops());
      setDropdownVal([]);
      setCropModal(!cropModal);
      setOtherCrop('');
      setFocusOther(false);
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
      setLoading(true);
      dispatch(getPoultryCrops());
      dispatch(getPoultry()).then(res => {
        setLoading(false);
        console.log('res', res);
      });
      dispatch(getFeed());
    }, []),
  );
  useEffect(() => {
    setCropType(poultry?.map(i => i?.poultry_crop));
  }, [poultry]);
  // console.log("poultryCrops", poultry)
  return (
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
      {loading ? (
        <View style={{marginTop: '60%'}}>
          <ActivityIndicator size={'small'} color="black" />
        </View>
      ) : (
        <>
          {/* Crop adding */}
          {cropType?.map((element, i) => {
            return (
              <TouchableOpacity
                style={styles.addAndDeleteButtonSection}
                key={i}
                onPress={() => {
                  let poultry_crop_id = poultry.find(
                    j => j?.poultry_crop?.name == element?.name,
                  );
                  // poultry[0] !== undefined? poultry.find((i) => i?.poultry_crop?.name == element?.name) : element?.id)
                  navigation.navigate('poultryType', {
                    cropType: element?.name,
                    cropId:
                      poultry[0] !== undefined &&
                      poultry.find(j => j?.poultry_crop?.name == element?.name)
                        ? poultry.find(
                            i => i?.poultry_crop?.name == element?.name,
                          )._id
                        : element?.id,
                    data: poultry.find(i => i?.poultry_crop_id == element?._id),
                  });
                }}>
                <AddAndDeleteCropButton
                  add={false}
                  cropName={element?.name}
                  onPress={() =>
                    handleRemoveClick(
                      poultry[0] !== undefined &&
                        poultry.find(
                          j => j?.poultry_crop?.name == element?.name,
                        )
                        ? poultry.find(
                            i => i?.poultry_crop?.name == element?.name,
                          )._id
                        : element?.id,
                      i,
                    )
                  }
                />
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={styles.addAndDeleteButtonSection}
            onPress={() => setCropModal(true)}>
            <View style={styles.addAndDeleteButtonSection}>
              <AddAndDeleteCropButton
                add={true}
                cropName={t('add livestock')}
                onPress={() => setCropModal(true)}
              />
            </View>
          </TouchableOpacity>
          {cropModal && (
            <AddBottomSheet>
              <View style={styles.BottomTopContainer}>
                <Text style={styles.headerText}>{t('add livestock')}</Text>
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
                  selectedValue={e => {
                    DropdownSelectedValue({name: e, _id: e._id});
                  }}
                  data={[...poultryCrops, {_id: 0, name: 'Others'}]}
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
                  onPress={() => setCropModal(!cropModal)}>
                  <Image
                    source={require('../../../assets/cross.png')}
                    style={styles.addCropIcon}
                  />
                </TouchableOpacity>
                <CustomButton
                  btnText={t('create')}
                  style={{width: '80%'}}
                  onPress={() => addingTreesCrop()}
                />
              </View>
            </AddBottomSheet>
          )}
        </>
      )}
    </View>
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
    },
    addCropIcon: {
      height: 50,
      width: 50,
    },
  });
