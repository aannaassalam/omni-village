import {
  Image,
  Keyboard,
  StyleSheet,
  Text,
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
import { useQuery } from '@tanstack/react-query';
import { get_crops } from '../../../apis/crops';
import { useNavigation } from '@react-navigation/native';

const AddCultivationBottomSheet = ({
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
  const navigation = useNavigation()
  const bottomsheetRef = useRef(null);
  const [crop_name, setCrop_name] = useState(null);
  const [extra_crop_name, setExtra_crop_name] = useState(null);
  const [onFocus, setOnFocus] = useState(false);
  const authState = useSelector((state: any) => state.authState);
  const {data: cultivation_crop} = useQuery({
    queryKey: ['cultivation_crop'],
    queryFn: () =>
      get_crops({country: authState?.country, category: 'cultivation'}),
  });
  const snapPoints = React.useMemo(() => ['70%'], []);
  return (
    <AddBottomSheet
      snap={onFocus && snapPoints}
      bottomSheetRef={bottomsheetRef}
      modalVisible={modalVisible}
      setModal={setModalVisible}>
      <View style={styles.container}>
        <View style={styles.inner_container}>
          <Text style={styles.headerText}>Add Crops</Text>
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
          data={cultivation_crop?.length>0?[...cultivation_crop?.map((item: any) => {
            return {
              id: item?._id,
              label: item?.name,
              value: item?.name,
            }
          }),{id:0,label:'Others', value:'others'}]:[]}
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
              placeholder="Ex: Apple"
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
            setModalVisible(!modalVisible), bottomsheetRef.current.close();
            await setData({
              crop_id: crop_name?.name == 'others' ? 0 : crop_name?._id,
              crop_name: crop_name?.name == 'others' ? extra_crop_name : crop_name?.name,
            });
            setOnFocus(false), Keyboard.dismiss();
             setCrop_name(null),  setExtra_crop_name(null);
          }}
          style={{marginTop: '6%', width: '100%'}}
          disabled={crop_name == null}
        />
      </View>
    </AddBottomSheet>
  );
};

export default AddCultivationBottomSheet;

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
