import { Keyboard, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import { Styles, width } from '../../styles/globalStyles'
import Customdropdown from '../CustomDropdown/Customdropdown'
import Input from '../Inputs/Input'
import AcresElement from '../ui/AcresElement'
import AddstorageBottomSheet from '../BottomSheet/Production/AddstorageMethodBottomSheet'

const StorageList = ({
  title,
  setValue,
  storage_method_name,
  storage_value,
  onStorageValue,
  id,
  isVisible
}: {
  title: any;
  setValue: any;
  onStorageValue: any;
  storage_method_name: any;
  storage_value: any;
  id:any;
  isVisible?:any
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View>
      <View style={Styles.twoFieldsContainer}>
        <View>
          <Input
            value={String(storage_value)}
            onChangeText={(val:any)=>onStorageValue(val,id)}
            label={title}
            inner_width={'65%'}
            keyboardType="numeric"
            main_width={width / 2.37}
            isRight={<AcresElement title={'acres'} />}
          />
        </View>
        <View>
          <Customdropdown
            data={[
              {id: 1, label: 'Stable', value: 'Stable'},
              {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              {id: 3, label: 'Others', value: 'Others'},
            ]}
            value={storage_method_name}
            style={{width: width / 2.3}}
            label={'Storage Method'}
            onChange={(value: any) => {
              setValue(value?.value, id);
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