import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
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

const FisheryRiver = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {fisheryCrop} = useSelector(state => state.fisheryCrop);
  const {fishery} = useSelector(state => state.fishery);
  const [cropType, setCropType] = useState([]);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
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
    setCropType([
      ...cropType,
      {
        name:
          dropdownVal.name == 'Others'
            ? otherCrop.name
            : dropdownVal.name?.name,
        id: dropdownVal.name == 'Others' ? otherCrop._id : dropdownVal.name?.id,
        progress: '',
      },
    ]);
    setCropModal(!cropModal);
    setFocusOther(false);
    setDropdownVal('');
    setOtherCrop('');
  };
  const addingHuntingCrop = () => {
    if (dropdownVal.name === 'Others') {
      dispatch(addFisherycrop({name: otherCrop?.name}));
      dispatch(getFisheryCrops());
      setDropdownVal([]);
      setOtherCrop('');
    } else {
      addCrop();
    }
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
      dispatch(getFishery('river')).then(res => {
        console.log(res);
        setCropType(res?.payload.data.map(i => i?.fishery_crop));
        setLoading(false);
      });
      dispatch(getFishFeed());
      dispatch(getMeasurement());
    }, []),
  );
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Fishery'}
        goBack={() => navigation.goBack()}
      />
      {/*Top Dashboard  */}
      <CustomDashboard first={'Production'} second={'Fishery'} />
      {loading ? (
        <View style={{marginTop: '70%'}}>
          <ActivityIndicator color={'#000'} size={'small'} />
        </View>
      ) : (
        <>
          {/* Crop adding */}
          {cropType?.map((element, i) => {
            return (
              <TouchableOpacity
                style={styles.addAndDeleteButtonSection}
                onPress={
                  () =>
                    navigation.navigate('fisheryRiverInput', {
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
                  //             huntingid:64f2ead3b994c1b6aa39e802
                  // huntingcropid: 64f2ccd2b994c1b6aa39e76f
                }>
                <AddAndDeleteCropButton
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
          {cropType[0] === undefined ? (
            <View style={styles.addAndDeleteButtonSection}>
              <AddAndDeleteCropButton
                add={true}
                cropName={`Add River Fish`}
                onPress={() => setCropModal(true)}
              />
            </View>
          ) : (
            <View style={styles.addAndDeleteButtonSection}>
              <AddAndDeleteCropButton
                add={true}
                cropName={`Add River Fish`}
                onPress={() => setCropModal(true)}
              />
            </View>
          )}
        </>
      )}
      {cropModal && (
        <AddBottomSheet>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>Select Type</Text>
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
            <CustomDropdown2
              selectedValue={e =>
                DropdownSelectedValue({
                  name: e,
                  _id: fisheryCrop.find(cp => cp.name === e)?._id,
                })
              }
              data={[...fisheryCrop, {_id: 0, name: 'Others'}]}
              valu={dropdownVal?.name}
            />
            {dropdownVal.name === 'Others' ? (
              <InputWithoutRightElement
                label={'Crop Name'}
                placeholder={'Crop 01'}
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
              onPress={() => addingHuntingCrop()}
            />
          </View>
        </AddBottomSheet>
      )}
    </View>
  );
};

export default FisheryRiver;

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
