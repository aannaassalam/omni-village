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
import AddHuntingBottomSheet from '../../../../../Components/BottomSheet/Production/AddhuntingBottomSheet';
import Itemlist from '../../../../../Components/Card/Itemlist';
import NoData from '../../../../../Components/Nodata/NoData';
import AddAndDeleteCropButton from '../../../../../Components/CropButtons/AddAndDeleteCropButton';
import { useSelector } from 'react-redux';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { delete_hunting, get_hunting } from '../../../../../apis/food';

const Hunting = ({navigation}:{navigation:any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
   const [modalVisible, setModalVisible] = useState(false);
   const [data, setData] = useState([]);
    const authState = useSelector((state: any) => state.authState);
    const queryClient = useQueryClient();
 const {data: hunting, isLoading} = useQuery({
   queryKey: ['get_hunting'],
   queryFn: () => get_hunting(),
 });
 const {mutate: deleteHunting} = useMutation({
   mutationFn: (data: any) => delete_hunting(data),
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
   setData(hunting);
 }, [hunting]);
 const handleRemoveItem = async (itm: any) => {
   setData(data.filter((item: any) => item._id !== itm?._id));
   deleteHunting(itm?._id);
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
              Hunting
            </Text>
            <View style={{flexDirection: 'row', gap: 26}}>
              <View>
                <Text style={styles.sub_text}>Hunted</Text>
                <Text
                  style={[
                    styles.sub_text,
                    {color: primary, marginVertical: 4},
                  ]}>
                  {data?.length} Animals
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
              screen={'hunting'}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <NoData
              title={'Add Hunting'}
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
                  cropName={'Add Hunting'}
                  onPress={() => setModalVisible(true)}
                />
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
      <AddHuntingBottomSheet
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        data={data}
        setData={async (item: any) => {
         const find_crop = await data.find(
           (itm: any) =>
             itm.crop_name === item?.crop_name ||
             itm?.crop_id === item?.crop_id,
         );
         if (find_crop) {
           return ToastAndroid.show('Hunting already exists', ToastAndroid.SHORT);
         } else {
           setData([...data, item]);
           navigation.navigate('huntingInfo', {
             crop_name: item?.crop_name,
             crop_id: item?.crop_id,
           });
         }
        }}
      />
    </View>
  );
};

export default Hunting;

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
