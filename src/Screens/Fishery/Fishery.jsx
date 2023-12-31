import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {addHuntingCrops, getHuntingCrops} from '../../Redux/HuntingCropSlice';
import {deleteHunting, getHunting} from '../../Redux/HuntingSlice';
import CustomDropdown2 from '../../Components/CustomDropdown/CustomDropdown2';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import {addFisherycrop, getFisheryCrops} from '../../Redux/FisheryCropSlice';
import {deleteFishery, getFishery} from '../../Redux/FisherySlice';
import {ActivityIndicator} from 'react-native-paper';
import {getFeed, getFishFeed, getMeasurement} from '../../Redux/OthersSlice';
import CustomDropdown4 from '../../Components/CustomDropdown/CustomDropdown4';
import {useTranslation} from 'react-i18next';
import '../../i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const Fishery = ({navigation, route}) => {
  const [loading, setLoading] = useState(false);
  const {screenName} = route.params;
  const {t} = useTranslation();
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {fisheryCrop} = useSelector(state => state.fisheryCrop);
  const {fishery} = useSelector(state => state.fishery);
  const [cropType, setCropType] = useState([]);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);

  const bottomSheetRef = useRef(null);

  const dispatch = useDispatch();
  const handleRemoveClick = (id, index) => {
    const list = [...cropType];
    list.splice(index, 1);
    setCropType(list);
    dispatch(deleteFishery(id))
      .unwrap()
      .then(res => {
        console.log(`delted hunting ${id}`, res);
      })
      .catch(err => console.log('error delete hunting', err));
  };
  const addCrop = () => {
    let ids = cropType.map(i => i.id || i?._id);
    if (ids.includes(dropdownVal?.name?.value)) {
      Alert.alert('Crop Already exists');
      setCropModal(!cropModal);
      setFocusOther(false);
      setDropdownVal('');
      setOtherCrop('');
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
      navigation.navigate('fishTypeInput', {
        cropType: dropdownVal.name?.label,
        cropId:
          fishery[0] !== undefined &&
          fishery.find(j => j?.fishery_crop?.name == dropdownVal.name?.label)
            ? fishery.find(
                i => i?.fishery_crop?.name == dropdownVal.name?.label,
              )._id
            : dropdownVal.name?.value,
        data: fishery.find(i => i?.fishery_crop_id == dropdownVal.name?.label),
      });
      setCropModal(!cropModal);
      setFocusOther(false);
      setDropdownVal('');
      setOtherCrop('');
    }
  };
  const addingHuntingCrop = () => {
    if (dropdownVal.name?.label === 'Others') {
      dispatch(addFisherycrop({name: otherCrop?.name})).then(res => {
        navigation.navigate('fishTypeInput', {
          cropType: res?.payload?.data?.name,
          cropId: res?.payload?.data?._id,
          data: null,
        });
      });
      setFocusOther(false);
      dispatch(getFisheryCrops());
      setDropdownVal([]);
      setOtherCrop('');
      setCropModal(!cropModal);
    } else {
      addCrop();
    }
    bottomSheetRef.current.close();
  };
  const DropdownSelectedValue = data => {
    setDropdownVal(data);
    console.log('data', data);
    if (data !== 'Others') {
      setFocusOther(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      dispatch(getFisheryCrops());
      dispatch(getFishery('pond')).then(res => {
        console.log(res);
        setCropType(res?.payload.data.map(i => i?.fishery_crop));
        setLoading(false);
      });
      dispatch(getFishFeed());
      dispatch(getMeasurement());
    }, []),
  );
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <CustomHeader
          backIcon={true}
          headerName={t('harvested from pond')}
          goBack={() => navigation.goBack()}
        />
        {/*Top Dashboard  */}
        <CustomDashboard
          first={t('production')}
          second={t('fishery')}
          third={t('harvested from pond')}
        />
        {loading ? (
          <View style={{marginTop: '70%'}}>
            <ActivityIndicator animating size="large" color="#268C43" />
          </View>
        ) : (
          <>
            {/* Crop adding */}
            {cropType?.map((element, i) => {
              return (
                <TouchableOpacity
                  style={styles.addAndDeleteButtonSection}
                  kdy={i}
                  onPress={() =>
                    navigation.navigate('fishTypeInput', {
                      cropType: element?.name,
                      cropId:
                        fishery[0] !== undefined &&
                        fishery.find(
                          j => j?.fishery_crop?.name == element?.name,
                        )
                          ? fishery.find(
                              i => i?.fishery_crop?.name == element?.name,
                            )._id
                          : element?.id,
                      data: fishery.find(
                        i => i?.fishery_crop_id == element?._id,
                      ),
                    })
                  }>
                  <AddAndDeleteCropButton
                    darftStyle={{
                      borderColor:
                        fishery[0] !== undefined &&
                        fishery.find(
                          j => j?.fishery_crop?.name == element?.name,
                        )?.status == 1
                          ? 'grey'
                          : '#e5c05e',
                    }}
                    drafted={
                      fishery[0] !== undefined &&
                      fishery.find(j => j?.fishery_crop?.name == element?.name)
                        ?.status == 1
                        ? false
                        : true
                    }
                    add={false}
                    cropName={element?.name}
                    onPress={() =>
                      handleRemoveClick(
                        fishery[0] !== undefined &&
                          fishery.find(
                            j => j?.fishery_crop?.name == element?.name,
                          )
                          ? fishery.find(
                              i => i?.fishery_crop?.name == element?.name,
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
              <AddAndDeleteCropButton
                add={true}
                cropName={t('add fish')}
                onPress={() => setCropModal(true)}
              />
            </TouchableOpacity>
          </>
        )}
        <AddBottomSheet
          modalVisible={cropModal}
          setModal={setCropModal}
          bottomSheetRef={bottomSheetRef}>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>{t('add fish')}</Text>
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
              selectedValue={e =>
                DropdownSelectedValue({
                  name: e,
                  _id: fisheryCrop.find(cp => cp.name === e)?._id,
                })
              }
              data={[...fisheryCrop, {_id: 0, name: 'Others'}]}
              valu={dropdownVal?.name}
            />
            {dropdownVal.name?.label === 'Others' ? (
              <InputWithoutRightElement
                label={t('fish name')}
                placeholder={t('eg fish')}
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
              onPress={() => addingHuntingCrop()}
            />
          </View>
        </AddBottomSheet>
      </View>
    </SafeAreaView>
  );
};

export default Fishery;

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
