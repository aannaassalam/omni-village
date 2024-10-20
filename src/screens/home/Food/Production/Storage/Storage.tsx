import {
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
import React, {useEffect, useState} from 'react';
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
import {add_storage, edit_storage, get_storage} from '../../../../../apis/food';
import AlertModal from '../../../../../Components/Popups/AlertModal';

const Storage = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [data, setData] = useState(storage_data);
  const [visible, setVisible] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState({});
  const authState = useSelector((state: any) => state.authState);
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
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
      setModalVisible(false)
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
      setModalVisible(false)
      console.log(
        'error?.response?.data?.message edit',
        error,
        error?.response?.data?.message,
      );
    },
  });
  const handleSelectStorageMethod = (methodId: any, methodName: any) => {
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
  };
  useEffect(() => {
    if (getStorage?.length > 0) {
      setData(getStorage);
    } else {
      setData(storage_data);
    }
  }, [getStorage, storage_data]);
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
                Storage
              </Text>
              <View style={{flexDirection: 'row', gap: 26}}>
                <View>
                  <Text style={styles.sub_text}>Used land</Text>
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
            {data.map((item: any, index: any) => {
              return (
                <StorageList
                  key={index}
                  id={item?._id || index}
                  storage_name={item?.storage_name}
                  title={`For ${item?.storage_name}`}
                  storage_method_name={item?.storage_method_name}
                  storage_value={item?.storage_quantity}
                  onStorageValue={(value: any, id: any) => {
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
                  }}
                  isVisible={visible}
                  setValue={(value: any, id: any, storage_method_id: any) => {
                    setSelectedStorage(item);
                    // if (value == 'Others') {
                    //   setData(prevData =>
                    //     prevData.map(item =>
                    //       item._id === id
                    //         ? {
                    //             ...item,
                    //             storage_method_name: value,
                    //           }
                    //         : item,
                    //     ),
                    //   );
                    //   Keyboard.dismiss()
                    //   setVisible(true);
                    // } else {
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
                    // }
                  }}
                />
              );
            })}
          </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <View style={Styles.bottomBtn}>
        <CustomButton
          btnText={'Submit'}
          onPress={() => {
            // const totalQuantity = data.reduce(
            //   (acc, item) => acc + item.storage_quantity,
            //   0,
            // );
            const allHaveMethod = data.every(
              item => item.storage_method_name !== '',
            );
            // if (totalQuantity > authState?.sub_area?.storage) {
            //   ToastAndroid.show(
            //     'Total storage quantity exceeds sub-area storage capacity',
            //     ToastAndroid.BOTTOM,
            //   );
            // } else {

              if (allHaveMethod) {
                if (getStorage.length > 0) {
                  console.log('hereee', data);
                  editStorage(data.map((item)=>{
                    return{
                      _id: item._id,
                      storage_name: item?.storage_name,
                      storage_method_id: item.storage_method_id,
                      storage_method_name: item.storage_method_name,
                      storage_quantity: item.storage_quantity,
                    }
                  }));
                } else {
                  console.log('heereree2', data);
                  addStorage(
                    data.map(item => {
                      return {
                        storage_name: item?.storage_name,
                        storage_method_id: item.storage_method_id,
                        storage_method_name: item.storage_method_name,
                        storage_quantity: item.storage_quantity,
                      };
                    }),
                  );
                }
              } else {
                ToastAndroid.show(
                  'Please select storage method for all crops',
                  ToastAndroid.BOTTOM,
                );
              }
            }
          // }
          }
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
          setModalVisible(false)
        }}
        confirmText="Okay"
        title="Successful"
        comments={`Form updated successfully`}
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
