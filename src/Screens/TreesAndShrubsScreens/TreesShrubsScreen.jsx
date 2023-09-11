import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  Alert,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDropdown2 from '../../Components/CustomDropdown/CustomDropdown2';
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement';
import { useDispatch, useSelector } from 'react-redux';
import { addTreeCrops, getTreeCrops } from '../../Redux/TreeCropSlice';
import { getCrops } from '../../Redux/CropSlice';
import { deleteTree, getTree, setCurrentTree } from '../../Redux/TreesSlice';
import { useFocusEffect } from '@react-navigation/native';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import CustomDropdown4 from '../../Components/CustomDropdown/CustomDropdown4';

const TreesShrubsScreen = ({ navigation, route }) => {
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const dispatch = useDispatch()
  const { userDetails } = useSelector(s => s.auth);
  const { treeCrops } = useSelector((state) => state.treeCrop)
  const { trees } = useSelector((state) => state?.treeShrub)
  const totalLand = userDetails.total_land;
  const [cropType, setCropType] = useState([]);
  const [cropModal, setCropModal] = useState(false);
  const [dropdownVal, setDropdownVal] = useState({});
  const [otherCrop, setOtherCrop] = useState('');
  const [focusOther, setFocusOther] = useState(false);
  const handleRemoveClick = (id, index) => {
    const list = [...cropType];
    list.splice(index, 1);
    setCropType(list);
    dispatch(deleteTree(id))
    .unwrap()
    .then((res)=>{
    })
    .catch((err)=>console.log("error", err))
  };
  const addCrop = () => {
    let ids = cropType.map((i) => i?.id || i?._id)
    if(ids.includes(dropdownVal?.name?.value)){
      Alert.alert("Crop Already exists")
      setCropModal(!cropModal);
      setFocusOther(false);
      setDropdownVal('');
    }else{
      setCropType([
        ...cropType,
        {
          name: dropdownVal.name == 'Others' ? otherCrop.name : dropdownVal.name?.label,
          id: dropdownVal.name == 'Others' ? otherCrop._id : dropdownVal?.name?.value,
          progress: '',
        },
      ]);
      setCropModal(!cropModal);
      setFocusOther(false);
      setDropdownVal('');
      setOtherCrop('');
    }
  };
  const addingTreesCrop = () => {
    if (dropdownVal.name?.label === 'Others') {
      dispatch(addTreeCrops({ name: otherCrop?.name }))
      dispatch(getTreeCrops())
      setDropdownVal([])
      setOtherCrop('')
    } else {
      addCrop()
    }
  }
  // console.log("dropdown", dropdownVal)
  const DropdownSelectedValue = data => {
    setDropdownVal(data);
    if (data !== 'Others') {
      setFocusOther(false);
    }
  };
  useFocusEffect(
    useCallback(() => {
      dispatch(getTreeCrops())
      dispatch(getTree())
    }, []))
  useEffect(() => {
    setCropType(trees?.map((i) => i?.tree_crop))
  }, [trees])
  // console.log("cropty", trees)
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <CustomHeader
        goBack={() => navigation.goBack()}
        headerName={'Trees, Shrubs & Grasslands'}
        backIcon={true}
      />
      {/*Top Dashboard  */}
      <CustomDashboard
        first={'production'}
        second={'Trees,Shrubs & Grasslands'}
      />
      {/* Next Dashboard */}
      <CustomDashboard2
        allocatedFor={'Trees, Shrubs & Grasslands'}
        usedLand={totalLand}
      />
      {/* Crop adding */}
      {cropType?.map((element, i) => {
        return (
          <TouchableOpacity
            style={styles.addAndDeleteButtonSection}
            onPress={() => {
              dispatch(setCurrentTree(trees.find((i) => i?.tree_crop_id == element?._id))),
                navigation.navigate('type', {
                  cropType: element?.name,
                  cropId: trees[0] !== undefined && trees.find((j) => j?.tree_crop?.name == element?.name) ? trees.find((i) => i?.tree_crop?.name == element?.name)._id : element?.id,
                  data: trees.find((i) => i?.tree_crop_id == element?._id)
                })
              // dispatch(deleteTree(trees[0] !== undefined && trees.find((j) => j?.tree_crop?.name == element?.name) ? trees.find((i) => i?.tree_crop?.name == element?.name)._id : element?.id))
              // console.log("iddddd crop", element?._id)
            }}>
            <AddAndDeleteCropButton
              add={false}
              cropName={element?.name}
              onPress={() => handleRemoveClick(trees[0] !== undefined && trees.find((j) => j?.tree_crop?.name == element?.name) ? trees.find((i) => i?.tree_crop?.name == element?.name)._id : element?.id, i)}
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
          <CustomDropdown4 selectedValue={(e) => { 
            DropdownSelectedValue({ name: e, _id: e._id }) }} 
            data={[...treeCrops, { _id: 0, name: 'Others' }]} 
            valu={dropdownVal?.name}
            />
          {dropdownVal.name?.label === 'Others' ? (
            <InputWithoutRightElement
              label={'Crop Name'}
              placeholder={'Crop 01'}
              onChangeText={e => setOtherCrop({ name: e, _id: 0 })}
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
            style={{ width: '80%' }}
            onPress={() => {
              addingTreesCrop()
            }}
          />
        </View>
      </AddBottomSheet>
      }
    </SafeAreaView>
  );
};

export default TreesShrubsScreen;

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
      alignSelf: 'center'
    },
    addCropIcon: {
      height: 50,
      width: 50,
    },
  });