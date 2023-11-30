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
import {getMeasurement} from '../../Redux/OthersSlice';
import CustomDrodown4 from '../../Components/CustomDropdown/CustomDropdown4';
import CustomDropdown4 from '../../Components/CustomDropdown/CustomDropdown4';
import {useTranslation} from 'react-i18next';
import '../../i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const Hunting = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {t} = useTranslation();
  const {huntingCrops} = useSelector(state => state.huntingCrop);
  const {hunting} = useSelector(state => state.hunting);
  const [cropType, setCropType] = useState([]);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const dispatch = useDispatch();

  const bottomSheetRef = useRef(null);

  const handleRemoveClick = (id, index) => {
    const list = [...cropType];
    list.splice(index, 1);
    setCropType(list);
    dispatch(deleteHunting(id))
      .unwrap()
      .then(res => {
        console.log(`delted hunting ${id}`, res);
      })
      .catch(err => console.log('error delete hunting', err));
  };
  const addCrop = async () => {
    let ids = cropType.map(i => i?.id || i?._id);
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
      navigation.navigate('huntingType', {
        cropType: dropdownVal.name?.label,
        cropId:
          hunting[0] !== undefined &&
          hunting.find(j => j?.hunting_crop?.name == dropdownVal.name?.label)
            ? hunting.find(
                i => i?.hunting_crop?.name == dropdownVal.name?.label,
              )._id
            : dropdownVal.name?.value,
        data: hunting.find(i => i?.hunting_crop_id == dropdownVal.name?.value),
      });
      setCropModal(!cropModal);
      setFocusOther(false);
      setDropdownVal('');
      setOtherCrop('');
    }
  };
  const addingHuntingCrop = () => {
    if (dropdownVal.name?.label === 'Others') {
      dispatch(addHuntingCrops({name: otherCrop?.name})).then(res => {
        navigation.navigate('huntingType', {
          cropType: res?.payload?.data?.name,
          cropId: res?.payload?.data?._id,
          data: null,
        });
        setFocusOther(false);
      });
      dispatch(getHuntingCrops());
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
      dispatch(getHuntingCrops());
      dispatch(getHunting());
      dispatch(getMeasurement());
    }, []),
  );
  useEffect(() => {
    setCropType(hunting?.map(i => i?.hunting_crop));
  }, [hunting]);
  // console.log("hunting", hunting)
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <CustomHeader
          backIcon={true}
          headerName={'Hunting'}
          goBack={() => navigation.goBack()}
        />
        {/*Top Dashboard  */}
        <CustomDashboard first={t('production')} second={t('hunting')} />
        {/* Crop adding */}
        {cropType?.map((element, i) => {
          return (
            <TouchableOpacity
              style={styles.addAndDeleteButtonSection}
              key={i}
              onPress={() =>
                navigation.navigate('huntingType', {
                  cropType: element?.name,
                  cropId:
                    hunting[0] !== undefined &&
                    hunting.find(j => j?.hunting_crop?.name == element?.name)
                      ? hunting.find(
                          i => i?.hunting_crop?.name == element?.name,
                        )._id
                      : element?.id,
                  data: hunting.find(i => i?.hunting_crop_id == element?._id),
                })
              }>
              <AddAndDeleteCropButton
                add={false}
                darftStyle={{
                  borderColor:
                    hunting[0] !== undefined &&
                    hunting.find(j => j?.hunting_crop?.name == element?.name)
                      ?.status == 1
                      ? 'grey'
                      : '#e5c05e',
                }}
                drafted={
                  hunting[0] !== undefined &&
                  hunting.find(j => j?.hunting_crop?.name == element?.name)
                    ?.status == 1
                    ? false
                    : true
                }
                cropName={element?.name}
                onPress={() =>
                  handleRemoveClick(
                    hunting[0] !== undefined &&
                      hunting.find(j => j?.hunting_crop?.name == element?.name)
                      ? hunting.find(
                          i => i?.hunting_crop?.name == element?.name,
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
          onPress={() => setCropModal(true)}
          style={styles.addAndDeleteButtonSection}>
          <AddAndDeleteCropButton
            add={true}
            cropName={t('select type')}
            onPress={() => setCropModal(true)}
          />
        </TouchableOpacity>
        <AddBottomSheet
          modalVisible={cropModal}
          setModal={setCropModal}
          bottomSheetRef={bottomSheetRef}>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>{t('add hunting livestock')}</Text>
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
            {/* <CustomDropdown2
                            selectedValue={e => DropdownSelectedValue({ name: e, _id: e._id })}
                            data={[...huntingCrops, { _id: 0, name: 'Others' }]}
                            valu={dropdownVal?.name}
                        /> */}
            <CustomDropdown4
              selectedValue={e => DropdownSelectedValue({name: e, _id: e._id})}
              data={[...huntingCrops, {_id: 0, name: 'Others'}]}
              valu={dropdownVal?.name}
            />
            {dropdownVal.name?.label === 'Others' ? (
              <InputWithoutRightElement
                label={t('livestock name')}
                placeholder={t('eg boar')}
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

export default Hunting;

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
