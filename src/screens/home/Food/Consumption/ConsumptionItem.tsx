import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Styles, width} from '../../../../styles/globalStyles';
import {
  black,
  dark_grey,
  draft_color,
  primary,
  white,
} from '../../../../styles/colors';
import HeaderCard from '../../../../Components/Card/HeaderCard';
import {
  fontFamilyBold,
  fontFamilyRegular,
} from '../../../../styles/fontStyle';
import AddCultivationBottomSheet from '../../../../Components/BottomSheet/Production/AddCultivationBottomSheet';
import Itemlist from '../../../../Components/Card/Itemlist';
import NoData from '../../../../Components/Nodata/NoData';
import AddAndDeleteCropButton from '../../../../Components/CropButtons/AddAndDeleteCropButton';
import AddConsumptionBottomSheet from '../../../../Components/BottomSheet/Consumption/AddConsumptionBottomSheet';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { get_consumption_crop } from '../../../../apis/crops';
import { delete_consumption, get_consumption } from '../../../../apis/food';
import { useTranslation } from 'react-i18next';

const ConsumptionItem = ({navigation,route}:{navigation:any,route:any}) => {
  const {id} = route.params
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
    const authState = useSelector((state: any) => state.authState);
    const queryClient = useQueryClient();
    const {t} = useTranslation()
    const {data: consumption, isLoading} = useQuery({
      queryKey: ['get_consumption'],
      queryFn: () => get_consumption(id),
    });
    const {mutate: deleteConsumption} = useMutation({
      mutationFn: (data: any) => delete_consumption(data),
      onSuccess: data => {
        queryClient.invalidateQueries();
      },
      onError: error => {
        console.log(
          'error?.response?.data?.message edit',
          error,
          error?.response?.data?.message,
        );
      },
    });
    useEffect(() => {
      setData(consumption);
    }, [consumption]);
    const handleRemoveItem = async (itm: any) => {
      setData(data.filter((item: any) => item._id !== itm?._id));
      deleteConsumption(itm?._id);
    };
    if (isLoading) {
      return (
        <View style={{marginTop: '100%'}}>
          <ActivityIndicator
            size={'large'}
            color={primary}
            style={{alignSelf: 'center'}}
          />
        </View>
      );
    }
  return (
    <View style={Styles.mainContainer}>
      <HeaderCard disabled={true}>
        <View style={styles.inner_container}>
          <View>
            <Text
              style={[
                styles.header_text,
                {marginBottom: 16, marginTop: 6, color: black},
              ]}>
              {t('consumption')}
            </Text>
            <View style={{flexDirection: 'row', gap: 26}}>
              <View>
                <Text style={styles.sub_text}>{t('consumed')}</Text>
                <Text
                  style={[
                    styles.sub_text,
                    {color: primary, marginVertical: 4},
                  ]}>
                  {data?.length} {t('items')}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.box_inner_container}>
            <Image
              source={require('../../../../../assets/e3.png')}
              style={styles.image}
            />
          </View>
        </View>
      </HeaderCard>
      <View>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <Itemlist
              item={item}
              setRemove={(crop: any) => handleRemoveItem(crop)}
              screen={'consumption'}
              id={id}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <NoData
              title={t('select type')}
              onPress={() => setModalVisible(true)}
            />
          }
          ListFooterComponent={
            data?.length > 0 ? (
              <TouchableOpacity
                style={Styles.addAndDeleteButtonSection}
                onPress={() => setModalVisible(true)}>
                <AddAndDeleteCropButton
                  add={true}
                  cropName={t('select type')}
                  onPress={() => setModalVisible(true)}
                />
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
      <AddConsumptionBottomSheet
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        data={data}
        id={id}
        setData={async (item: any) => {
          const find_crop = await data.find(
            (itm: any) =>
              itm.crop_name === item?.crop_name ||
              itm?.crop_id === item?.crop_id,
          );
          if (find_crop) {
            return ToastAndroid.show(t('item exists'), ToastAndroid.SHORT);
          } else {
            setData([...data, item]);
            navigation.navigate('consumptionInfo', {
              id: id,
              crop_name: item?.crop_name,
              crop_id: item?.crop_id,
            });
          }
        }}
      />
    </View>
  );
};

export default ConsumptionItem;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: white,
    },
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
