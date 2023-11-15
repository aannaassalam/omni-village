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
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import {deleteHunting, getHunting} from '../../Redux/HuntingSlice';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import {getMeasurement} from '../../Redux/OthersSlice';
import CustomDrodown4 from '../../Components/CustomDropdown/CustomDropdown4';
import CustomDropdown4 from '../../Components/CustomDropdown/CustomDropdown4';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {deleteConsumption, getConsumption} from '../../Redux/ConsumptionSlice';
import {useFocusEffect} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import '../../i18next';

const Consumption = ({route, navigation}) => {
  const {typeId, typeName} = route.params;
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {consumptionCrops} = useSelector(state => state.consumptionCrop);
  const {consumption} = useSelector(state => state.consumption);
  const [cropType, setCropType] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const dispatch = useDispatch();
  const {t} = useTranslation();
  const handleRemoveClick = (id, index) => {
    const list = [...cropType];
    list.splice(index, 1);
    setCropType(list);
    dispatch(deleteConsumption(id))
      .unwrap()
      .then(res => {
        console.log(`delted consumption ${id}`, res);
      })
      .catch(err => console.log('error delete consumption', err));
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
      console.log('hereeee i am');
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
      navigation.navigate('consumptionInput', {
        typeName: typeName,
        cropType: dropdownVal.name?.label,
        cropId:
          consumption[0] !== undefined &&
          consumption.find(
            j => j?.consumption_crop?.name == dropdownVal.name?.label,
          )
            ? consumption.find(
                i => i?.consumption_crop?.name == dropdownVal.name?.label,
              )._id
            : dropdownVal.name?.value,
        data: consumption.find(
          i => i?.consumption_crop_id == dropdownVal.name?.value,
        ),
      });
      setCropModal(!cropModal);
      setFocusOther(false);
      setDropdownVal('');
      setOtherCrop('');
    }
  };
  const addingHuntingCrop = () => {
    if (dropdownVal.name?.label === 'Others') {
      // dispatch(addHuntingCrops({ name: otherCrop?.name }));
      // dispatch(getHuntingCrops());
      setCropType([
        ...cropType,
        {
          name: otherCrop.name,
          id: otherCrop._id,
          progress: '',
        },
      ]);
      setCropModal(!cropModal);
      setDropdownVal([]);
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
      dispatch(getMeasurement());
      dispatch(getConsumption(typeName)).then(() => setLoading(false));
    }, [typeName]),
  );
  // console.log("type ifd", typeId, consumption)
  useEffect(() => {
    setCropType(consumption.map(i => i?.consumption_crop));
  }, [consumption]);
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t('consumption')}
        goBack={() => navigation.goBack()}
      />
      <CustomDashboard first={t('consumption')} second={t(typeName)} />
      {loading ? (
        <View style={{marginTop: '50%'}}>
          <ActivityIndicator size={'large'} color="green" />
        </View>
      ) : (
        <>
          {cropType?.map((element, i) => {
            return (
              <TouchableOpacity
                style={styles.addAndDeleteButtonSection}
                key={i}
                onPress={() =>
                  navigation.navigate('consumptionInput', {
                    cropType: element?.name,
                    typeName: typeName,
                    cropId:
                      consumption[0] !== undefined &&
                      consumption.find(
                        j => j?.consumption_crop?.name == element?.name,
                      )
                        ? consumption.find(
                            i => i?.consumption_crop?.name == element?.name,
                          )._id
                        : element?.id,
                    data: consumption.find(
                      i => i?.consumption_crop_id == element?._id,
                    ),
                  })
                }>
                <AddAndDeleteCropButton
                  add={false}
                  darftStyle={{
                    borderColor:
                      consumption[0] !== undefined &&
                      consumption?.find(
                        i => i?.consumption_crop?.name == element?.name,
                      )?.status == 1
                        ? 'grey'
                        : '#e5c05e',
                  }}
                  drafted={
                    consumption[0] !== undefined &&
                    consumption?.find(
                      i => i?.consumption_crop?.name == element?.name,
                    )?.status == 1
                      ? false
                      : true
                  }
                  cropName={element?.name}
                  onPress={() =>
                    handleRemoveClick(
                      consumption[0] !== undefined &&
                        consumption.find(
                          j => j?.consumption_crop?.name == element?.name,
                        )
                        ? consumption.find(
                            i => i?.consumption_crop?.name == element?.name,
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
        </>
      )}
      {cropModal && (
        <AddBottomSheet>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>{t('add type')}</Text>
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
              selectedValue={e => DropdownSelectedValue({name: e, _id: e._id})}
              data={[...consumptionCrops, {_id: 0, name: 'Others'}]}
              valu={dropdownVal?.name}
            />
            {dropdownVal.name?.label === 'Others' ? (
              <InputWithoutRightElement
                label={t('consumption name')}
                placeholder={t('eg nuts')}
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
              btnText={t('create')}
              style={{width: '80%'}}
              onPress={() => addingHuntingCrop()}
            />
          </View>
        </AddBottomSheet>
      )}
    </View>
  );
};

export default Consumption;

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
