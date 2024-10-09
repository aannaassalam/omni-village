import {Image, Keyboard, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import React, {useState} from 'react';
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
import { TextInput } from 'react-native-paper';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';

const Storage = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [data, setData] = useState(storage_data);
  const [visible, setVisible] = useState(false);
  const [selectedStorage, setSelectedStorage] = useState({});
  const handleSelectStorageMethod = (methodId: any, methodName: any) => {
    setData(prevData =>
      prevData.map(item =>
        item.storage_id === methodId
          ? {
              ...item,
              storage_method_id: methodId + 12,
              storage_method_name: methodName,
            }
          : item,
      ),
    );
  };
  return (
    <View style={{flex:1,backgroundColor:'#fff'}}>
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
                  50 acres
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
      <View>
        {data.map((item: any, index: any) => {
          return (
            <StorageList
            key={index}
              id={item?.storage_id}
              title={`For ${item?.storage_name}`}
              storage_method_name={item?.storage_method_name}
              storage_value={item?.storage_quantity}
              onStorageValue={(value: any, id: any) => {
                setData(prevData =>
                  prevData.map(item =>
                    item.storage_id === id
                      ? {
                          ...item,
                          storage_quantity: value,
                        }
                      : item,
                  ),
                );
              }}
              isVisible={visible}
              setValue={(value: any, id: any) => {
                setSelectedStorage(item);
                if (value == 'Others') {
                  Keyboard.dismiss()
                  setVisible(true);
                } else {
                  Keyboard.dismiss();
                  setData(prevData =>
                    prevData.map(item =>
                      item.storage_id === id
                        ? {
                            ...item,
                            storage_method_name: value,
                          }
                        : item,
                    ),
                  );
                }
              }}
            />
          );
        })}
      </View>
    </View>
      <View style={Styles.bottomBtn}>
        <CustomButton btnText={'Submit'} onPress={()=>{}}/>
      </View>
      {visible &&   
      <AddstorageBottomSheet
        modalVisible={visible}
        setModalVisible={setVisible}
        setData={(name: any) =>{
          handleSelectStorageMethod(selectedStorage.storage_id, name?.crop_name)
        }
        }
      />
      }
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
