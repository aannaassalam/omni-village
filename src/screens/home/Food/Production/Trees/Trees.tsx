import {
  ActivityIndicator,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import AddTreesBottomSheet from '../../../../../Components/BottomSheet/Production/AddTreesBottomSheet';
import Itemlist from '../../../../../Components/Card/Itemlist';
import AddAndDeleteCropButton from '../../../../../Components/CropButtons/AddAndDeleteCropButton';
import {TouchableOpacity} from 'react-native';
import NoData from '../../../../../Components/Nodata/NoData';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { delete_trees, get_trees } from '../../../../../apis/food';
import { useSelector } from 'react-redux';
import { USER_PREFERRED_LANGUAGE } from '../../../../../i18next';

const Trees = ({navigation}:{navigation:any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [modalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState([]);
  const authState = useSelector((state)=>state.authState)
  const queryClient = useQueryClient()
  const {data: trees, isLoading} = useQuery({
    queryKey: ['get_trees'],
    queryFn: () => get_trees(),
  });
   const {mutate: deleteTrees} = useMutation({
     mutationFn: (data: any) => delete_trees(data),
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
    setData(trees);
  }, [trees]);
 const handleRemoveItem = async (itm: any) => {
   setData(data.filter((item: any) => item._id !== itm?._id));
   deleteTrees(itm?._id);
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
              Trees , Shrubs {'\n'} & Grasslands
            </Text>
            <View style={{flexDirection: 'row', gap: 26}}>
              <View>
                <Text style={styles.sub_text}>Used land</Text>
                <Text
                  style={[
                    styles.sub_text,
                    {color: draft_color, marginVertical: 4},
                  ]}>
                  {authState?.sub_area?.trees} {authState?.land_measurement}
                </Text>
              </View>
              <View>
                <Text style={styles.sub_text}>Planted</Text>
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
      <View style={styles.flatlist_container}>
        <FlatList
          data={data}
          renderItem={({item}) => (
            <Itemlist
              item={item}
              setRemove={(crop: any) => handleRemoveItem(crop)}
              screen={'trees'}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <NoData
              title={'Add Trees shrubs'}
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
                  cropName={'Add Trees shrubs'}
                  onPress={() => setModalVisible(true)}
                />
              </TouchableOpacity>
            ) : null
          }
        />
      </View>
      <AddTreesBottomSheet
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        data={data}
        setData={async (item: any) => {
           const find_crop = await data.find(
             (itm: any) => itm.crop_name  === item?.crop_name || itm?.crop_id === item?.crop_id,
           )
           if (find_crop) {
             return ToastAndroid.show(
               'Trees already exists',
               ToastAndroid.SHORT,
             );
           } else {
             setData([...data, item]);
             navigation.navigate('treesImportantinfo', {
               crop_name: item?.crop_name,
               crop_id: item?.crop_id,
             });
           }
        }}
      />
    </View>
  );
};

export default Trees;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: white,
    },
    flatlist_container: {
      marginBottom: '40%',
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
  });
