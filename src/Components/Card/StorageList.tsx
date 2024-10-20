import { Keyboard, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import { Styles, width } from '../../styles/globalStyles'
import Customdropdown from '../CustomDropdown/Customdropdown'
import Input from '../Inputs/Input'
import AcresElement from '../ui/AcresElement'
import AddstorageBottomSheet from '../BottomSheet/Production/AddstorageMethodBottomSheet'
import { useSelector } from 'react-redux'
import { useQuery } from '@tanstack/react-query'
import { get_storage_method } from '../../apis/food'

const StorageList = ({
  title,
  setValue,
  storage_method_name,
  storage_value,
  onStorageValue,
  id,
  isVisible,
  storage_name,
}: {
  title: any;
  setValue: any;
  onStorageValue: any;
  storage_method_name: any;
  storage_value: any;
  id: any;
  isVisible?: any;
  storage_name: any;
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const authState = useSelector((state: any) => state.authState);
  const {data: getStorageMethod, isLoading} = useQuery({
    queryKey: ['get_storage_method'],
    queryFn: () => get_storage_method(),
  });
  return (
    <View>
      <View style={Styles.twoFieldsContainer}>
        <View>
          <Input
            value={String(storage_value)}
            onChangeText={(val: any) => onStorageValue(val, id)}
            label={title}
            inner_width={'65%'}
            keyboardType="numeric"
            main_width={width / 2.37}
            isRight={
              <AcresElement title={'Kilogram'} />
            }
          />
        </View>
        <View>
          <Customdropdown
            data={getStorageMethod?.[storage_name].map((item)=>{
              return{
                id: item._id,
                label: item.name,
                value: item.name,
              }
            })}
            value={storage_method_name}
            style={{width: width / 2.3}}
            label={'Storage Method'}
            onChange={(value: any) => {
              setValue(value?.value, id, value?.id);
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default StorageList

const makeStyles = (fontScale:any) => StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#fff'
    }
})