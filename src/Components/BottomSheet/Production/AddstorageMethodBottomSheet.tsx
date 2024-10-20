import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useRef, useState} from 'react';
import AddBottomSheet from '../BottomSheet';
import {fontFamilyMedium} from '../../../styles/fontStyle';
import {fontScale, width} from '../../../styles/globalStyles';
import Customdropdown from '../../CustomDropdown/Customdropdown';
import Input from '../../Inputs/Input';
import CustomButton from '../../CustomButton/CustomButton';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { add_storage_method, get_storage } from '../../../apis/food';

const AddstorageBottomSheet = ({
  modalVisible,
  setModalVisible,
  data,
  setData,
}: {
  modalVisible?: any;
  setModalVisible?: any;
  data?: any;
  setData?: any;
}) => {
  const bottomsheetRef = useRef(null);
  const [extra_crop_name, setExtra_crop_name] = useState('');
  const [onFocus, setOnFocus] = useState(false);
  const snapPoints = React.useMemo(() => ['70%'], []);
  const authState = useSelector((state: any) => state.authState);
  const queryClient  = useQueryClient()
   const {data: cultivation_crop} = useQuery({
     queryKey: ['cultivation_crop'],
     queryFn: () =>
       get_storage({country: authState?.country, category: 'cultivation'}),
   });
   const {mutate: addCrop} = useMutation({
     mutationFn: (data: any) => add_storage_method(data),
     onSuccess: async data => {
       queryClient.invalidateQueries();
       setModalVisible(!modalVisible), bottomsheetRef.current.close();
       await setData({
         crop_id: data?._id,
         crop_name: extra_crop_name,
       });
       setOnFocus(false), Keyboard.dismiss();
        setExtra_crop_name(null);
     },
     onError: error => {
       ToastAndroid.show('Crop exists', ToastAndroid.SHORT);
       console.log(
         'error?.response?.data?.message add crop',
         error,
         error?.response?.data?.message,
       );
     },
   });
  return (
    <AddBottomSheet
      snap={onFocus && snapPoints}
      bottomSheetRef={bottomsheetRef}
      modalVisible={modalVisible}
      setModal={setModalVisible}>
      <View style={styles.container}>
        <View style={styles.inner_container}>
          <Text style={styles.headerText}>Add Storage Method</Text>
          <TouchableOpacity
            onPress={() => {
              {
                setModalVisible(!modalVisible),
                  bottomsheetRef.current.close(),
                  setOnFocus(false),
                  Keyboard.dismiss();
                  setExtra_crop_name(null)
              }
            }}>
            <Image
              source={require('../../../../assets/close.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
        
          <View style={{marginTop: '6%'}}>
            <Input
              onChangeText={(e: any) => setExtra_crop_name(e)}
              value={extra_crop_name}
              placeholder="Ex: Apple"
              fullLength={true}
              noLabel={true}
              onFocus={() => setOnFocus(true)}
              onBlur={() => setOnFocus(false)}
            />
          </View>
        <CustomButton
          btnText={'Submit'}
          onPress={async () => {
            if(extra_crop_name==="" || !extra_crop_name){
              ToastAndroid.show("Add storage method name", ToastAndroid.BOTTOM)
            }else{
              setModalVisible(!modalVisible), bottomsheetRef.current.close();
              await setData({
                crop_name: extra_crop_name 
              });
              setOnFocus(false), Keyboard.dismiss();
              await setExtra_crop_name(null);
            }
          }}
          style={{marginTop: '6%', width: '100%'}}
        />
      </View>
    </AddBottomSheet>
  );
};

export default AddstorageBottomSheet;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    paddingVertical: 22,
  },
  inner_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerText: {
    fontFamily: fontFamilyMedium,
    fontSize: 16 / fontScale,
    color: '#000',
    alignSelf: 'center',
  },
  closeIcon: {
    height: 30,
    width: 30,
    alignSelf: 'center',
  },
});
