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
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { add_crops, get_crops } from '../../../apis/crops';
import { useSelector } from 'react-redux';

const AddHuntingBottomSheet = ({
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
  const [crop_name, setCrop_name] = useState(null);
  const [extra_crop_name, setExtra_crop_name] = useState(null);
  const [onFocus, setOnFocus] = useState(false);
  const snapPoints = React.useMemo(() => ['70%'], []);
    const authState = useSelector((state: any) => state.authState);
    const queryClient = useQueryClient();
    const {data: hunting_crop} = useQuery({
      queryKey: ['hunting_crops'],
      queryFn: () =>
        get_crops({country: authState?.country, category: 'hunting'}),
    });
    const {mutate: addCrop} = useMutation({
      mutationFn: (data: any) => add_crops(data),
      onSuccess: async data => {
        console.log('idddd', data);
        queryClient.invalidateQueries();
        setModalVisible(!modalVisible), bottomsheetRef.current.close();
        await setData({
          crop_id: data?._id,
          crop_name: extra_crop_name,
        });
        setOnFocus(false), Keyboard.dismiss();
        setCrop_name(null), setExtra_crop_name(null);
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
          <Text style={styles.headerText}>Add Hunting</Text>
          <TouchableOpacity
            onPress={() => {
              {
                setModalVisible(!modalVisible),
                  bottomsheetRef.current.close(),
                  setOnFocus(false),
                  Keyboard.dismiss();
                setCrop_name(null), setExtra_crop_name(null);
              }
            }}>
            <Image
              source={require('../../../../assets/close.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
        <Customdropdown
          data={
            hunting_crop?.length > 0
              ? [
                  ...hunting_crop?.map((item: any) => {
                    return {
                      id: item?._id,
                      label: item?.name,
                      value: item?.name,
                    };
                  }),
                  {id: 0, label: 'Others', value: 'others'},
                ]
              : []
          }
          value={crop_name?.name}
          noLabel={true}
          onChange={(value: any) => {
            setCrop_name({_id: value?.id, name: value?.value});
          }}
          style={{marginTop: '8%'}}
        />
        {crop_name?.name === 'others' ? (
          <View style={{marginTop: '6%'}}>
            <Input
              onChangeText={(e: any) => setExtra_crop_name(e)}
              value={extra_crop_name}
              placeholder="Ex: Boar"
              fullLength={true}
              noLabel={true}
              onFocus={() => setOnFocus(true)}
              onBlur={() => setOnFocus(false)}
            />
          </View>
        ) : null}
        <CustomButton
          btnText={'Add Crop'}
          onPress={async () => {
             if (crop_name?.name == 'others' && extra_crop_name) {
               let data = {
                 name: {
                   en: extra_crop_name,
                   ms: 'optional',
                   dz: 'optional',
                 },
                 country: ['india', 'bhutan', 'malaysia'],
                 status: 0,
                 ideal_consumption_per_person: 0, //from application,
                 category: 'hunting', //cultivation, fishery, hunting, poultry, tree
               };
               addCrop(data);
             } else if (
               (crop_name?.name == 'others' && extra_crop_name === null) ||
               extra_crop_name == '' ||
               !crop_name?.name
             ) {
               ToastAndroid.show('Please enter crop name', ToastAndroid.SHORT);
             } else {
               setModalVisible(!modalVisible), bottomsheetRef.current.close();
               await setData({
                 crop_id: crop_name?.name == 'others' ? 0 : crop_name?._id,
                 crop_name:
                   crop_name?.name == 'others'
                     ? extra_crop_name
                     : crop_name?.name,
               });
               setOnFocus(false), Keyboard.dismiss();
               setCrop_name(null), setExtra_crop_name(null);
             }
          }}
          style={{marginTop: '6%', width: '100%'}}
        />
      </View>
    </AddBottomSheet>
  );
};

export default AddHuntingBottomSheet;

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
