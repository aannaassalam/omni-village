import {
  ActivityIndicator,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {Styles, width} from '../../../../../styles/globalStyles';
import HeaderCard from '../../../../../Components/Card/HeaderCard';
import {
  fontFamilyBold,
  fontFamilyRegular,
} from '../../../../../styles/fontStyle';
import {
  black,
  dark_grey,
  draft_color,
  primary,
} from '../../../../../styles/colors';
import {storage_data} from '../../../../../../assets/mockdata/Data';
import StorageList from '../../../../../Components/Card/StorageList';
import AddstorageBottomSheet from '../../../../../Components/BottomSheet/Production/AddstorageMethodBottomSheet';
import Input from '../../../../../Components/Inputs/Input';
import AcresElement from '../../../../../Components/ui/AcresElement';
import Customdropdown from '../../../../../Components/CustomDropdown/Customdropdown';
import {TextInput} from 'react-native-paper';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useSelector} from 'react-redux';
import {
  add_storage,
  edit_storage,
  get_storage,
  get_storage_method,
} from '../../../../../apis/food';
import AlertModal from '../../../../../Components/Popups/AlertModal';
import {useTranslation} from 'react-i18next';

const Storage = ({navigation, route}: {navigation: any; route: any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [data, setData] = useState(storage_data);
  const [visible, setVisible] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState({});
  const authState = useSelector((state: any) => state.authState);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const {t} = useTranslation();

  const {data: getStorageMethod} = useQuery({
    queryKey: ['get_storage_method'],
    queryFn: () => get_storage_method(),
  });

  const {data: getStorage, isLoading} = useQuery({
    queryKey: ['get_storage'],
    queryFn: () => get_storage(),
  });

  const {mutate: addStorage} = useMutation({
    mutationFn: (data: any) => add_storage(data),
    onSuccess: data => {
      setModalVisible(true);
      queryClient.invalidateQueries();
    },
    onError: error => {
      setModalVisible(false);
      console.log(
        'error?.response?.data?.message edit',
        error,
        error?.response?.data?.message,
      );
    },
  });

  const {mutate: editStorage} = useMutation({
    mutationFn: (data: any) => edit_storage(data),
    onSuccess: data => {
      setModalVisible(true);
      queryClient.invalidateQueries();
    },
    onError: error => {
      setModalVisible(false);
      console.log(
        'error?.response?.data?.message edit',
        error,
        error?.response?.data?.message,
      );
    },
  });

  const handleSelectStorageMethod = useCallback(
    (methodId: any, methodName: any) => {
      setData(prevData =>
        prevData.map(item =>
          item._id === methodId
            ? {
                ...item,
                storage_method_id: methodId + 12,
                storage_method_name: methodName,
              }
            : item,
        ),
      );
    },
    [],
  );

  useEffect(() => {
    if (getStorage?.length > 0) {
      setData(getStorage);
    } else {
      setData([
        {
          _id: 1,
          storage_quantity: '',
          storage_method_name: '',
          storage_method_id: '',
          storage_name: 'grain',
        },
        {
          _id: 2,
          storage_quantity: '',
          storage_method_name: '',
          storage_method_id: '',
          storage_name: 'poultry',
        },
        {
          _id: 3,
          storage_quantity: '',
          storage_method_name: '',
          storage_method_id: '',
          storage_name: 'meat',
        },
        {
          _id: 4,
          storage_quantity: '',
          storage_method_name: '',
          storage_method_id: '',
          storage_name: 'vegetables & fruits',
        },
      ]);
    }
  }, [getStorage]);

  const onStorageValue = useCallback((value: any, id: any) => {
    setData(prevData =>
      prevData.map(item =>
        item._id === id
          ? {
              ...item,
              storage_quantity: parseInt(value) || 0,
            }
          : item,
      ),
    );
  }, []);

  const setValue = useCallback(
    (value: any, id: any, storage_method_id: any) => {
      setSelectedStorage(item => item);
      Keyboard.dismiss();
      setData(prevData =>
        prevData.map(item =>
          item._id === id
            ? {
                ...item,
                storage_method_name: value,
                storage_method_id: storage_method_id,
              }
            : item,
        ),
      );
    },
    [],
  );
if(isLoading){
  return <ActivityIndicator style={{marginTop:'50%'}} size={'large'} color={primary}/>
}
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={Styles.mainContainer}>
        <HeaderCard disabled={true}>
          <View style={styles.inner_container}>
            <View>
              <Text
                style={[
                  styles.header_text,
                  {marginBottom: 16, marginTop: 6, color: black},
                ]}>
                {t('storage')}
              </Text>
              <View style={{flexDirection: 'row', gap: 26}}>
                <View>
                  <Text style={styles.sub_text}>{t('used land')}</Text>
                  <Text
                    style={[
                      styles.sub_text,
                      {color: draft_color, marginVertical: 4},
                    ]}>
                    {authState?.sub_area?.storage}{' '}
                    {authState?.land_measurement_symbol}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.box_inner_container}>
              <Image
                source={require('../../../../../../assets/e2.png')}
                style={styles.image}
              />
            </View>
          </View>
        </HeaderCard>
        <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
          <ScrollView contentContainerStyle={{paddingBottom: 100}}>
            <View>
              {data.map((item: any) => {
                return (
                  <StorageList
                    key={item._id}
                    id={item._id}
                    storage_name={item.storage_name}
                    title={`For ${t(`${item.storage_name}`)}`}
                    storage_method_name={item.storage_method_name}
                    storage_value={item.storage_quantity}
                    onStorageValue={onStorageValue}
                    setValue={setValue}
                  />
                );
              })}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View style={Styles.bottomBtn}>
        <CustomButton
          btnText={t('submit')}
          onPress={() => {
            const allHaveMethod = data.every(
              item => item.storage_method_name !== '',
            );
            if (allHaveMethod) {
              if (getStorage.length > 0) {
                editStorage(
                  data.map(item => ({
                    _id: item._id,
                    storage_name: item.storage_name,
                    storage_method_id: item.storage_method_id,
                    storage_method_name: item.storage_method_name,
                    storage_quantity: item.storage_quantity,
                  })),
                );
              } else {
                addStorage(
                  data.map(item => ({
                    storage_name: item.storage_name,
                    storage_method_id: item.storage_method_id,
                    storage_method_name: item.storage_method_name,
                    storage_quantity: item.storage_quantity,
                  })),
                );
              }
            } else {
              ToastAndroid.show(
                'Please select storage method for all crops',
                ToastAndroid.BOTTOM,
              );
            }
          }}
        />
      </View>
      {visible && (
        <AddstorageBottomSheet
          modalVisible={visible}
          setModalVisible={setVisible}
          setData={(item: any) => {
            handleSelectStorageMethod(
              item?.crop_id || selectedStorage._id,
              item?.crop_name,
            );
          }}
        />
      )}
      <AlertModal
        visible={modalVisible}
        successModal={true}
        onSubmit={() => {
          setModalVisible(false);
        }}
        confirmText={t('Okay')}
        title={t('Successful')}
        comments={`${t('Form')} ${t('submitted')} ${t('Successful')}`}
      />
    </View>
  );
};

export default Storage;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    inner_container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    box_inner_container: {
      backgroundColor: primary,
      padding: 22,
      borderRadius: 8,
    },
    image: {
      height: 50,
      width: 50,
      resizeMode: 'contain',
    },
    header_text: {
      fontSize: 24 / fontScale,
      fontFamily: fontFamilyBold,
      color: primary,
    },
    sub_text: {
      fontSize: 14 / fontScale,
      fontFamily: fontFamilyRegular,
      color: dark_grey,
    },
    topContainer: {
      backgroundColor: '#d8f2df',
      borderRadius: 20,
      padding: 10,
      alignSelf: 'center',
      width: 100,
    },
    illustration: {
      marginTop: '30%',
      height: 300,
      width: 300,
      resizeMode: 'contain',
    },
  });
