import {Box, Text} from '@react-native-material/core';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {storage} from '../../Helper/Storage';
import {useUser} from '../../Hooks/useUser';
import {prefetchQuery} from '@tanstack/react-query';
import '../../i18next';
import axiosInstance from '../../Helper/Helper';
import {endpoints} from '../../Endpoints/endpoints';
import {useFocusEffect} from '@react-navigation/native';

// function prefetchUser() {
//   prefetchQuery({
//     queryKey: ['user'],
//     queryFn: async () => {
//       const res = await axiosInstance.get(endpoints.auth.getUser);
//       return res.data;
//     },
//   });
// }

export default function Home({navigation, route}) {
  // const user = JSON.parse(storage.getString('user') ?? '{}');
  const [lang, setLang] = useState('en');
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {t} = useTranslation();

  const {data: user, isLoading} = useUser();

  const data_available = useMemo(() => user, [user]);

  useEffect(() => {
    if (!data_available) {
      navigation.replace('startup');
    }
  }, [data_available, navigation]);

  // useFocusEffect(
  //   useCallback(() => {
  //     storage.set('user', JSON.stringify(user_data));
  //   }, [user_data]),
  // );

  console.log(user, 'USERRRR');

  // useEffect(() => {
  //   StringsOfLanguages.setLanguage(lang);
  // }, [lang, StringsOfLanguages]);

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator color="#268C43" size={16} />
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#fff'}}
      edges={['top', 'left', 'right']}>
      <ScrollView contentContainerStyle={{flex: 1}}>
        <Box style={styles.container}>
          {/* <Box>
            <Text variant="h2">Hello from {route?.name}</Text>
          </Box> */}

          <Box style={styles.user}>
            <Box style={styles.user_name}>
              <Text variant="h2" style={styles.user_name_txt}>
                {user?.first_name?.charAt(0)}
                {user?.last_name?.charAt(0)}
              </Text>
            </Box>
            <AnimatedCircularProgress
              size={105}
              width={4}
              fill={30}
              tintColor="#000000"
              // onAnimationComplete={() => console.log('onAnimationComplete')}
              backgroundColor="#ECECEC"
              style={styles.circular}
            />

            <TouchableOpacity
              style={styles.usr_btn}
              onPress={() =>
                navigation.navigate('registerdetails', {edit: true})
              }>
              <Text style={styles.usr_btn_txt}>{user?.first_name}</Text>
              <Image
                style={[styles.tinyLogo1, {width: 16, height: 16}]}
                source={require('../../../assets/edit2.png')}
                // height={100}
              />
            </TouchableOpacity>
            <Text variant="body1" style={styles.phone}>
              {user?.country_code} {user?.phone}
            </Text>

            <Box style={styles.user_land}>
              {/* <Box style={styles.usr_land_lft}> */}
              <Box style={styles.usr_land}>
                <Text variant="body1" style={styles.usr_txt}>
                  {/* Land allocated */}
                  {t('land allocated')}
                </Text>
                <Text variant="body1" style={styles.land_txt}>
                  {user?.total_land}{' '}
                  {user?.land_measurement_symbol !== '-'
                    ? user?.land_measurement_symbol
                    : user?.land_measurement}
                </Text>
              </Box>
              {/* </Box> */}
              <Box
                // h={30}
                w={3}
                style={{
                  backgroundColor: '#dddddd99',
                  // marginRight: 40,
                }}
              />
              <Box style={[styles.usr_land, {paddingLeft: 17}]}>
                <Text variant="body1" style={styles.usr_txt}>
                  {/* Used land */}
                  {t('used land')}
                </Text>
                <Text variant="body1" style={styles.land_txt2}>
                  {user?.sub_area &&
                    Object.keys(user?.sub_area).reduce((prev, new_value) => {
                      if (typeof user?.sub_area[new_value] === 'object') {
                        return prev + user?.sub_area[new_value].land || 0;
                      }
                      return prev + user?.sub_area[new_value] || 0;
                    }, 0)}{' '}
                  {user?.land_measurement_symbol !== '-'
                    ? user?.land_measurement_symbol
                    : user?.land_measurement}
                </Text>
              </Box>
            </Box>
          </Box>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductionStack', {
                screen: user?.total_land > 0 ? 'production' : 'totalLand',
              })
            }>
            <Box style={styles.home_box}>
              <Box style={styles.home_box_lft_upr}>
                <Box style={styles.hme_box_lft}>
                  <Image
                    style={styles.tinyLogo1}
                    source={require('../../../assets/e2.png')}
                    // height={100}
                  />
                </Box>
                <Text variant="h3" style={styles.hme_box_txt}>
                  {t('production')}
                </Text>
              </Box>
              <Box style={styles.hme_box_rgt}>
                <Image
                  style={styles.tinyIcon}
                  source={require('../../../assets/e4.png')}
                  // height={100}
                />
              </Box>
            </Box>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ConsumptionStack', {
                screen: 'consumptionMain',
              })
            }>
            <Box style={styles.home_box}>
              <Box style={styles.home_box_lft_upr}>
                <Box style={styles.hme_box_lft2}>
                  <Image
                    style={styles.tinyLogo1}
                    source={require('../../../assets/e3.png')}
                    // height={100}
                  />
                </Box>
                <Text variant="h3" style={styles.hme_box_txt2}>
                  {t('consumption')}
                </Text>
              </Box>
              <Box style={styles.hme_box_rgt}>
                <Image
                  style={styles.tinyIcon}
                  source={require('../../../assets/e4.png')}
                  // height={100}
                />
              </Box>
            </Box>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => setLang('en')}>
            <Text>Italian</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setLang('it')}>
            <Text>English</Text>
          </TouchableOpacity> */}
          {/* <Text onPress={()=>navigation.navigate("countryCheck")}>Country Check</Text> */}
          <View style={{marginTop: 'auto', marginBottom: 20}}>
            <CustomButton
              btnText={t('logout')}
              onPress={() => {
                storage.clearAll();
                navigation.replace('startup');
              }}
            />
          </View>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
const makeStyles = fontScale =>
  StyleSheet.create({
    circular: {
      marginTop: -95,
    },
    user: {
      borderColor: '#ddd',
      borderWidth: 1,
      marginBottom: 16,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 70,
      padding: 15,
      borderRadius: 8,
    },
    usr_btn_txt: {
      color: '#268C43',
      fontWeight: 700,
      fontSize: 13 / fontScale,
      marginRight: 1,
      marginLeft: 4,
    },
    phone: {
      color: '#263238',
      fontSize: 13 / fontScale,
    },
    user_name: {
      backgroundColor: '#EB7735',
      height: 85,
      width: 85,
      borderRadius: 85,
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: 'auto',
      marginTop: -60,
    },
    usr_btn: {
      backgroundColor: 'rgba(38, 140, 67, .2)',
      borderRadius: 200,
      // width: 75,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      marginVertical: 10,
      padding: 5,
      paddingHorizontal: 10,
    },
    user_name_txt: {
      color: '#fff',
      fontSize: 36 / fontScale,
      fontWeight: 700,
    },
    user_land: {
      flexDirection: 'row',
      borderColor: '#ddd',
      borderWidth: 1,
      padding: 8,
      borderRadius: 8,
      marginTop: 20,
      width: '100%',
    },
    usr_txt: {
      fontSize: 12 / fontScale,
      color: '#263238',
      marginBottom: 5,
      fontFamily: 'ubuntu-regular',
    },
    land_txt: {
      color: '#268C43',
      fontSize: 12 / fontScale,
      fontFamily: 'ubuntu-medium',
    },
    land_txt2: {
      color: '#E5C05E',
      fontSize: 12 / fontScale,
      fontFamily: 'ubuntu-medium',
    },

    home_box: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#268C43',
      paddingVertical: 8,
      paddingLeft: 8,
      paddingRight: 20,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 16,
    },
    home_box_lft_upr: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    usr_land: {
      flex: 1,
      padding: 10,
    },
    hme_box_txt: {
      color: '#268C43',
      fontSize: 16 / fontScale,
      fontWeight: 500,
      marginLeft: 20,
    },
    hme_box_txt2: {
      color: '#263238',
      fontSize: 16 / fontScale,
      fontWeight: 500,
      marginLeft: 20,
    },
    // tinyLogo1:{
    //   // alignItems: 'center',
    //   // justifyContent: 'center',
    //   // flexDirection:"row",
    //   width:"auto"
    // },
    hme_box_lft: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: 5,
      backgroundColor: '#22863F',
      // backgroundColor: '#22863e58',

      height: 80,
      width: 80,
    },
    hme_box_lft2: {
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      borderRadius: 5,
      backgroundColor: '#263238',

      height: 80,
      width: 80,
    },

    tinyLogo1: {
      width: 30,
      height: 30,
    },

    container: {
      flex: 1,
      paddingHorizontal: 20,
    },
  });
