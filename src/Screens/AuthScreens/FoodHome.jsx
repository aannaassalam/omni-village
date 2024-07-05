import {Box, Text} from '@react-native-material/core';
import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {SafeAreaView} from 'react-native-safe-area-context';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {storage} from '../../Helper/Storage';
import '../../i18next';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import { useUser } from '../../Hooks/useUser';

export default function FoodHome({navigation, route}) {
  const {fontScale} = useWindowDimensions()
  const styles = makeStyles(fontScale);
  const {t} = useTranslation()
  const { data: user, isLoading } = useUser();

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: '#fff'}}
      edges={['top', 'left', 'right']}>
      <CustomHeader
        backIcon={true}
        headerName={'Food Category'}
        goBack={() => navigation.goBack()}
      />
      <ScrollView contentContainerStyle={{flex: 1,paddingTop: 20}}>
        <Box style={styles.container}>
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
