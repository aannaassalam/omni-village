import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {addFisherycrop, getFisheryCrops} from '../../Redux/FisheryCropSlice';
import {deleteFishery, getFishery} from '../../Redux/FisherySlice';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import {getFishFeed, getMeasurement} from '../../Redux/OthersSlice';
import {ActivityIndicator} from 'react-native-paper';

const Fishery = ({navigation, route}) => {
  const {user} = useSelector(state => state.auth);
  const totalLand = user.sub_area.fishery;
  const {screenName} = route.params;
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [loading, setLoading] = useState(false);
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
        dispatch(getFishery('pond'));
      })
      .catch(err => console.log('error delete hunting', err));
  };
  const addCrop = () => {
    setCropType([...cropType, otherCrop]);
    setCropModal(!cropModal);
    setFocusOther(false);
    setDropdownVal('');
    setOtherCrop('');
  };
  // console.log("dropdonw value", cropType)
  const addingHuntingCrop = () => {
    addCrop();
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
      dispatch(getFisheryCrops());
      dispatch(getMeasurement());
      dispatch(getFishery('pond')).then(res => {
        setLoading(false);
      });
      dispatch(getFishery('river')).then(res => {
        setLoading(false);
      });
      dispatch(getFishery('pond')).then(res => {
        setLoading(false);
      });
      dispatch(getFishFeed());
    }, []),
  );
  useEffect(() => {
    setCropType(Object.keys(fishery));
  }, [fishery]);

  // console.log("croptype", cropType)
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={screenName}
        goBack={() => navigation.goBack()}
      />
      {/*Top Dashboard  */}
      <CustomDashboard
        first={'Production'}
        second={'Fishery'}
        third={screenName}
      />
      {/* Next Dashboard */}
      {/* <CustomDashboard2 allocatedFor={screenName} usedLand={totalLand} /> */}
      {loading ? (
        <View style={{marginTop: '40%'}}>
          <ActivityIndicator size={'small'} color="black" />
        </View>
      ) : (
        <>
          {/* Crop adding */}
          {cropType?.map((element, i) => {
            return (
              <TouchableOpacity
                style={styles.addAndDeleteButtonSection}
                onPress={() => {
                  navigation.navigate('subArea', {
                    type: element,
                    screenName: element,
                    data: fishery !== '' ? fishery[element] : null,
                  });
                }}>
                <AddAndDeleteCropButton
                  add={false}
                  cropName={element}
                  onPress={() => {
                    let findId = Object.values(fishery).flatMap(i =>
                      i.filter(i => (i.pond_name == element ? i?._id : 0)),
                    );
                    // console.log("idddd", Object.values(fishery).flatMap((i) => i.filter((i) => i.pond_name == element?i?._id:0)))
                    console.log('id', findId[0]?._id);
                    handleRemoveClick(
                      fishery ? findId[0]?._id : element?.id,
                      i,
                    );
                  }}
                  // handleRemoveClick(fishery!==""?Object.values(fishery)[0].find((i) => i.pond_name == element)._id : element?.id, i)}
                />
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={styles.addAndDeleteButtonSection}
            onPress={() => setCropModal(true)}>
            <AddAndDeleteCropButton
              add={true}
              cropName={'Add Pond Name'}
              onPress={() => setCropModal(true)}
            />
          </TouchableOpacity>
        </>
      )}
      {cropModal && (
        <AddBottomSheet>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>Add Pond Name</Text>
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
            <InputWithoutRightElement
              label={'Pond Name'}
              placeholder={'Eg: Pond 1'}
              onChangeText={e => setOtherCrop(e)}
              value={otherCrop}
              onFocus={() => setFocusOther(true)}
            />
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
      // flex:1,
    },
    addCropIcon: {
      height: 50,
      width: 50,
    },
  });
