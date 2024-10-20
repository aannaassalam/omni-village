import { Keyboard, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import { Styles, width } from '../../styles/globalStyles'
import Customdropdown from '../CustomDropdown/Customdropdown'
import Input from '../Inputs/Input'
import AcresElement from '../ui/AcresElement'
import AddstorageBottomSheet from '../BottomSheet/Production/AddstorageMethodBottomSheet'
import { useSelector } from 'react-redux'

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
  const authState = useSelector((state:any)=>state.authState)
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
              <AcresElement title={authState?.land_measurement_symbol} />
            }
          />
        </View>
        <View>
          <Customdropdown
            data={[
              {id: 1, label: 'Cold Storage', value: 'Cold Storage'},
              {id: 2, label: 'Hot Storage', value: 'Hot Storage'},
              {id: 3, label: 'Dry Storage', value: 'Dry Storage'},
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