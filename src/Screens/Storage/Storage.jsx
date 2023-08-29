import { StyleSheet, Text, View,useWindowDimensions,Dimensions,ScrollView,TouchableOpacity,Image } from 'react-native'
import React, { useState } from 'react'
import { Divider } from 'react-native-paper'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard'
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2'
import InputWithStorage from '../../Components/CustomInputField/InputWithStorage'
import CustomButton from '../../Components/CustomButton/CustomButton'
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement'
import BottomModal from '../../Components/BottomSheet/BottomModal'

const Storage = ({navigation}) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const [storageList,setStorageList]=useState([
        {
            id:1,
            name: 'For grains',
            storageMethod: 'Cold Storage'
        },
        {
            id: 2,
            name: 'For Poultry',
            storageMethod: 'Cold Storage'
        },
        {
            id: 3,
            name: 'For Fish',
            storageMethod: 'Cold Storage'
        },
        {
            id: 4,
            name: 'For Fruits & Vegetables',
            storageMethod: 'Cold Storage'
        },
    ])
    const [cropModal, setCropModal] = useState(false);
    const [dropdownVal, setDropdownVal] = useState('');
    const [otherCrop, setOtherCrop] = useState('');
    const [focusOther, setFocusOther] = useState(false);
    const [cropType,setCropType]=useState('')
    const addCrop = () => {
        setCropType([
            ...cropType,
            {
                cropName: dropdownVal == 'Others' ? otherCrop : dropdownVal,
                progress: '',
            },
        ]);
        setCropModal(!cropModal);
        setFocusOther(false);
        setDropdownVal('');
        setOtherCrop('');
    };
    const DropdownSelectedValue = data => {
        setDropdownVal(data);
        if (data !== 'Others') {
            setFocusOther(false);
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

      <CustomDashboard
      first={'Production'}
      second={'Storage'}
      />
      <CustomDashboard2
      allocatedFor={'Storage'}
      usedLand={20}
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
          {storageList.map((item)=>{
            return(
                <InputWithStorage
                productionName={item?.name}
                storageMethod={item?.storageMethod}
                storagePress={()=>{console.log("eekfijjvjjiji",item?.id),setCropModal(true)}}
                />
            )
          })}
          </View>
              <BottomModal
                  modalVisible={cropModal}
                  setBottomModalVisible={setCropModal}
                  styleInner={{ height: focusOther ? '80%' : '35%' }}>
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
                      <CustomDropdown2 selectedValue={e => DropdownSelectedValue(e)} />
                      {dropdownVal === 'Others' ? (
                          <InputWithoutRightElement
                              label={'Crop Name'}
                              placeholder={'Crop 01'}
                              onChangeText={e => setOtherCrop(e)}
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
                          onPress={() => addCrop()}
                      />
                  </View>
              </BottomModal>
      </ScrollView>
          <View style={styles.buttonContainer}>
          <CustomButton
          btnText={'Continue'}
          />
          </View>
    </View>
  )
}

export default Storage
const width = Dimensions.get('window').width;
const makeStyles = fontScale => StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    },
    subArea: {
        alignSelf: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        margin: 10,
        marginTop: '5%',
        width: width/1,
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
    storageInput:{
        width:'94%',
        alignSelf:'center'
    },
    buttonContainer:{
        width:'90%',
        position:'absolute',
        bottom:10,
        alignSelf:'center',
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
    },
    addCropIcon: {
        height: 50,
        width: 50,
    },
})