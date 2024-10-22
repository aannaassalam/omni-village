import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useState, useMemo, useCallback} from 'react';
import {Styles, width} from '../../styles/globalStyles';
import Customdropdown from '../CustomDropdown/Customdropdown';
import Input from '../Inputs/Input';
import AcresElement from '../ui/AcresElement';
import {useSelector} from 'react-redux';
import {useQuery} from '@tanstack/react-query';
import {get_storage_method} from '../../apis/food';
import { useTranslation } from 'react-i18next';

const StorageList = React.memo(
  ({
    title,
    setValue,
    storage_method_name,
    storage_value,
    onStorageValue,
    id,
    storage_name,
  }: {
    title: any;
    setValue: any;
    onStorageValue: any;
    storage_method_name: any;
    storage_value: any;
    id: any;
    storage_name: any;
  }) => {
    const {fontScale} = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const authState = useSelector((state: any) => state.authState);
    const {data: getStorageMethod} = useQuery({
      queryKey: ['get_storage_method'],
      queryFn: () => get_storage_method(),
    });
const {t} = useTranslation()
    const dropdownData = useMemo(() => {
      return getStorageMethod?.[storage_name]?.map(item => {
        return {
          id: item._id,
          label: item.name,
          value: item.name,
        };
      });
    }, [getStorageMethod, storage_name]);

    const handleDropdownChange = useCallback(
      (value: any) => {
        setValue(value?.value, id, value?.id);
      },
      [setValue, id],
    );

    return (
      <View>
        <View style={Styles.twoFieldsContainer}>
          <View>
            <Input
              value={String(storage_value)}
              onChangeText={(val: any) => onStorageValue(val, id)}
              label={title}
              inner_width={'65%'}
              txtStyle={{width:width/2.5}}
              keyboardType="numeric"
              main_width={width / 2.37}
              isRight={<AcresElement title={'Kilogram'} />}
            />
          </View>
          <View>
            <Customdropdown
              data={dropdownData}
              value={storage_method_name}
              style={{width: width / 2.3}}
              label={t('storage method')}
              onChange={handleDropdownChange}
            />
          </View>
        </View>
      </View>
    );
  },
);

export default StorageList;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
