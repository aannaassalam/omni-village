import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import AddAndDeleteCropButton from '../CropButtons/AddAndDeleteCropButton';
import {Styles} from '../../styles/globalStyles';
import { useNavigation } from '@react-navigation/native';

const Itemlist = ({item, setRemove, screen}: {item: any, setRemove?:any, screen:any}) => {
    const navigation = useNavigation()
  return (
    <View>
      <TouchableOpacity
        style={Styles.addAndDeleteButtonSection}
        onPress={() => {
          if(screen=="cultivation"){
            navigation.navigate('utilisation', {
              crop_name: item?.crop_name,
            });
          }else if (screen == 'pond') {
            navigation.navigate('pondInfo', {
              crop_name: item?.crop_name,
            });
          } else if (screen == 'river') {
            navigation.navigate('riverInfo', {
              crop_name: item?.crop_name,
            });
          } else if (screen == 'trees') {
            navigation.navigate('treesImportantinfo', {
              crop_name: item?.crop_name,
            });
          } else if (screen == 'poultry') {
            navigation.navigate('poultryImportantinfo', {
              crop_name: item?.crop_name,
            });
          } else if (screen == 'hunting') {
            navigation.navigate('huntingInfo', {
              crop_name: item?.crop_name,
            });
          }else if (screen == 'consumption'){
            navigation.navigate('consumptionInfo', {
              crop_name: item?.crop_name,
            });
          }
          // navigation.navigate('type');
        }}>
        <AddAndDeleteCropButton
          darftStyle={{
            borderColor: item.status === 1 ? 'grey' : '#e5c05e',
          }}
          drafted={item.status === 0}
          add={false}
          cropName={item?.crop_name}
          onPress={() => {
            // setDelete_id(item.data._id);
            // setDeletePopup(true);
            setRemove(item?.crop_name)
          }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Itemlist;

const styles = StyleSheet.create({});
