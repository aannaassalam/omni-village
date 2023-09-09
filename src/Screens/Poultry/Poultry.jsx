import { StyleSheet, Text, View,useWindowDimensions,TouchableOpacity,Image } from 'react-native'
import React,{useCallback, useEffect, useState} from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import CustomButton from '../../Components/CustomButton/CustomButton'
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard'
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2'
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton'
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement'
import { useFocusEffect } from '@react-navigation/native'
import { addPoultryCrops, getPoultryCrops } from '../../Redux/PoultryCropSlice'
import { deletePoultry, getPoultry } from '../../Redux/PoultrySlice'
import { useDispatch, useSelector } from 'react-redux'
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet'
import { getFeed } from '../../Redux/OthersSlice'

const Poultry = ({navigation, route}) => {
  const {totalLand}=route.params
  const {fontScale} = useWindowDimensions()
  const styles = makeStyles(fontScale)
  const dispatch = useDispatch()
  const [cropType, setCropType] = useState([]);
  const { poultryCrops } = useSelector((state) => state?.poultryCrop)
  const { poultry } = useSelector((state) => state?.poultry)
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState('');
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const handleRemoveClick = (id,index) => {
    const list = [...cropType];
    list.splice(index, 1);
    setCropType(list);
    dispatch(deletePoultry(id))
  };
  const addCrop = () => {
    setCropType([
      ...cropType,
      {
        name: dropdownVal.name == 'Others' ? otherCrop.name : dropdownVal.name?.name,
        id: dropdownVal.name == 'Others' ? otherCrop._id : dropdownVal.name?.id,
        progress: '',
      },
    ]);
    setCropModal(!cropModal);
    setFocusOther(false);
    setDropdownVal('');
    setOtherCrop('');
  };
  const addingTreesCrop = () => {
    if (dropdownVal.name === 'Others') {
      dispatch(addPoultryCrops({ name: otherCrop?.name }))
      dispatch(getPoultryCrops())
      setDropdownVal([])
      setOtherCrop('')
    } else {
      addCrop()
    }
  }
  const DropdownSelectedValue = data => {
    setDropdownVal(data);
    if (data !== 'Others') {
      setFocusOther(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      dispatch(getPoultryCrops())
      dispatch(getPoultry())
      dispatch(getFeed())
    }, []))
  useEffect(() => {
    setCropType(poultry?.map((i) => i?.poultry_crop))
  }, [poultry])
  // console.log("poultryCrops", poultry)
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Livestock, feed & produce'}
        goBack={() => navigation.goBack()}
      />
      {/*Top Dashboard  */}
      <CustomDashboard
        first={'production'}
        second={'Poultry'}
      />
      {/* Next Dashboard */}
      <CustomDashboard2
        allocatedFor={'Livestock, feed & produce'}
        usedLand={totalLand}
      />
      {/* Crop adding */}
      {cropType?.map((element, i) => {
        return (
          <TouchableOpacity
            style={styles.addAndDeleteButtonSection}
            onPress={() =>
             { 
               let poultry_crop_id = poultry.find((j) => j?.poultry_crop?.name == element?.name)
              // poultry[0] !== undefined? poultry.find((i) => i?.poultry_crop?.name == element?.name) : element?.id)
              navigation.navigate('poultryType', {
                cropType: element?.name,
                cropId: poultry[0] !== undefined && poultry.find((j) => j?.poultry_crop?.name == element?.name) ? poultry.find((i) => i?.poultry_crop?.name == element?.name)._id : element?.id,
               data: poultry.find((i) => i?.poultry_crop_id == element?._id)
              })
            }
            }>
            <AddAndDeleteCropButton
              add={false}
              cropName={element?.name}
              onPress={() => handleRemoveClick(poultry[0] !== undefined && poultry.find((j) => j?.poultry_crop?.name == element?.name) ? poultry.find((i) => i?.poultry_crop?.name == element?.name)._id : element?.id,i)}
            />
          </TouchableOpacity>
        );
      })}
      {cropType[0] === undefined ? (
        <View style={styles.addAndDeleteButtonSection}>
          <AddAndDeleteCropButton
            add={true}
            cropName={'Add Crop'}
            onPress={() => setCropModal(true)}
          />
        </View>
      ) : (
        <View style={styles.addAndDeleteButtonSection}>
          <AddAndDeleteCropButton
            add={true}
            cropName={'Add Crop'}
            onPress={() => setCropModal(true)}
          />
        </View>
      )}
      {cropModal &&
      <AddBottomSheet>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>Add Crop</Text>
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
            <CustomDropdown2 selectedValue={e => {
              DropdownSelectedValue({ name: e, _id: e._id })
            }}
              data={[...poultryCrops, { _id: 0, name: 'Others' }]} 
              valu={dropdownVal?.name}
              />
            {dropdownVal.name === 'Others' ? (
              <InputWithoutRightElement
                label={'Crop Name'}
                placeholder={'Crop 01'}
                onChangeText={e => setOtherCrop({ name: e, _id: 0 })}
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
              btnText={'Create'}
              style={{ width: '80%' }}
              onPress={() => addingTreesCrop()}
            />
          </View>
      </AddBottomSheet>
    }
    </View>
  )
}

export default Poultry

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
      justifyContent:'center',
      alignSelf:'center'
    },
    addCropIcon: {
      height: 50,
      width: 50,
    },
  });