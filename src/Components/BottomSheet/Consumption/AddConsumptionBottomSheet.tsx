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
import { get_consumption_crop } from '../../../apis/crops';
import { USER_PREFERRED_LANGUAGE } from './../../../i18next/index';

const AddConsumptionBottomSheet = ({
  modalVisible,
  setModalVisible,
  data,
  setData,
  id
}: {
  modalVisible?: any;
  setModalVisible?: any;
  data?: any;
  setData?: any;
  id:any
}) => {
  const bottomsheetRef = useRef(null);
  const [crop_name, setCrop_name] = useState(null);
  const [extra_crop_name, setExtra_crop_name] = useState(null);
  const [onFocus, setOnFocus] = useState(false);
  const snapPoints = React.useMemo(() => ['70%'], []);
  const authState = useSelector((state: any) => state.authState);
  const queryClient = useQueryClient();
   const {data: consumption_crop} = useQuery({
     queryKey: ['comsumption_crop'],
     queryFn: () =>
       get_consumption_crop({lang: USER_PREFERRED_LANGUAGE,country: authState?.country, label: id}),
   });
  return (
    <AddBottomSheet
      snap={onFocus && snapPoints}
      bottomSheetRef={bottomsheetRef}
      modalVisible={modalVisible}
      setModal={setModalVisible}>
      <View style={styles.container}>
        <View style={styles.inner_container}>
          <Text style={styles.headerText}>Select Type</Text>
          <TouchableOpacity
            onPress={() => {
              {
                setModalVisible(!modalVisible),
                  bottomsheetRef.current.close(),
                  setOnFocus(false),
                  Keyboard.dismiss();
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
            consumption_crop?.length > 0
              ? [
                  ...consumption_crop?.map((item: any) => {
                    return {
                      id: item?._id,
                      label: item?.name,
                      value: item?.name,
                    };
                  })
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
        {crop_name === 'others' ? (
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
        ) : null}
        <CustomButton
          btnText={'Select Type'}
          onPress={async () => {
            setModalVisible(!modalVisible), bottomsheetRef.current.close();
            await setData({
              crop_id: crop_name?._id,
              crop_name: crop_name?.name == 'others' ? extra_crop_name : crop_name?.name,
            });
            setOnFocus(false), Keyboard.dismiss();
            await setCrop_name(null), await setExtra_crop_name(null);
          }}
          style={{marginTop: '6%', width: '100%'}}
        />
      </View>
    </AddBottomSheet>
  );
};

export default AddConsumptionBottomSheet;

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
