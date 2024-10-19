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
import React, { useEffect, useState } from 'react';
import {Styles, width} from '../../../../../styles/globalStyles';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';
import {
  black,
  dark_grey,
  draft_color,
  primary,
  white,
} from '../../../../../styles/colors';
import HeaderCard from '../../../../../Components/Card/HeaderCard';
import {
  fontFamilyBold,
  fontFamilyRegular,
} from '../../../../../styles/fontStyle';
import AddCultivationBottomSheet from '../../../../../Components/BottomSheet/Production/AddCultivationBottomSheet';
import Itemlist from '../../../../../Components/Card/Itemlist';
import NoData from '../../../../../Components/Nodata/NoData';
import AddAndDeleteCropButton from '../../../../../Components/CropButtons/AddAndDeleteCropButton';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { get_crops } from '../../../../../apis/crops';
import { get_cultivation } from '../../../../../apis/food';
import { get_weight_measurement } from '../../../../../apis/auth';

const Cultivation = ({navigation}:{navigation:any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
 const [modalVisible, setModalVisible] = useState(false);
 const [data, setData] = useState([]);
 const authState=useSelector((state:any)=>state.authState)
 const {data: cultivation, isLoading} = useQuery({
   queryKey: ['get_cultivation'],
   queryFn: () => get_cultivation(),
 });
 useEffect(() => {
   setData(cultivation);
 },[cultivation])
 const handleRemoveItem = async (name: any) => {
   setData(data.filter((item:any) => item.crop_name !== name));
 };
 if(isLoading){
  return <View style={{marginTop:'50%'}}>
    <ActivityIndicator size={'large'} color={primary} style={{alignSelf:'center'}}/>
  </View>
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
              Cultivation
            </Text>
            <View style={{flexDirection: 'row', gap: 26}}>
              <View>
                <Text style={styles.sub_text}>Used land</Text>
                <Text
                  style={[
                    styles.sub_text,
                    {color: draft_color, marginVertical: 4},
                  ]}>
                  {authState?.sub_area?.cultivation} {authState?.land_measurement_symbol}
                </Text>
              </View>
              <View>
                <Text style={styles.sub_text}>Cultivated</Text>
                <Text
                  style={[
                    styles.sub_text,
                    {color: primary, marginVertical: 4},
                  ]}>
                  {data?.length} Crops
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
        <FlatList
          data={data}
          renderItem={({item}) => (
            <Itemlist
              item={item}
              setRemove={(crop: any) => handleRemoveItem(crop)}
              screen={'cultivation'}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <NoData
              title={'Add Crops'}
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
                  cropName={'Add Crops'}
                  onPress={() => setModalVisible(true)}
                />
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
      <AddCultivationBottomSheet
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        data={data}
        setData={async (item: any) => {
          const find_crop = await data.find(
            (itm: any) => itm.crop_name === item?.crop_name,
          )?.crop_name;
          if (find_crop) {
            return ToastAndroid.show('Crop already exists', ToastAndroid.SHORT);
          } else {
            setData([...data, item]);
            console.log("iteemememe", item)
              navigation.navigate('utilisation', {
                crop_name: item?.crop_name,
                crop_id: item?.crop_id,
              });
          }
        }}
      />
    </View>
  );
};

export default Cultivation;

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
