import { ActivityIndicator, StyleSheet, TouchableOpacity, useWindowDimensions, View, Image, Dimensions, ScrollView } from 'react-native'
import React, { useEffect, useMemo, useState } from 'react'
import { Box, Text } from '@react-native-material/core'
import { useUser } from '../Hooks/useUser'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { storage } from '../Helper/Storage';
import CustomButton from '../Components/CustomButton/CustomButton'
import { useTranslation } from 'react-i18next'
import { borderColor, primaryColor, unSelected } from '../styles/colors'
import { fontFamilyMedium } from '../styles/fontStyle'

const Home = ({ navigation }) => {
  const { fontScale } = useWindowDimensions()
  const styles = makeStyles(fontScale)
  const { t } = useTranslation();
  const [onItemSeleted, setOnItemSelected] = useState(null)

  const { data: user, isLoading } = useUser();

  const data_available = useMemo(() => user, [user]);

  useEffect(() => {
    if (!data_available) {
      navigation.replace('startup');
    }
  }, [data_available, navigation]);
  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fff',
        }}>
        <ActivityIndicator color="#268C43" size={'large'} />
      </View>
    );
  }
  const ITEMS = [
    {
      title: 'Food',
      navigation: 'foodHome',
      image: require('../../assets/food.png'),
    },
    {
      title: 'Demographic Information',
      navigation: 'demographic',
      image: require('../../assets/demographic.png'),
    },
    {
      title: 'Landholding & Usage mapping',
      navigation: 'landholdingUsage',
      image: require('../../assets/landhold.png'),
    },
    {
      title: 'Housing',
      navigation: 'housing',
      image: require('../../assets/housing.png'),
    },
    {
      title: 'Water',
      navigation: 'water',
      image: require('../../assets/water.png'),
    },
    {
      title: 'Energy & Fuel',
      navigation: 'energyFuel',
      image: require('../../assets/fuel.png'),
    },
    {
      title: 'Mobility',
      navigation: 'mobility',
      image: require('../../assets/mobility.png'),
    },
    {
      title: 'Forestry & Timber',
      navigation: 'forestryTimber',
      image: require('../../assets/forestry.png'),
    },
    {
      title: 'Other personal & Household Items',
      navigation: 'others',
      image: require('../../assets/household.png'),
    },
    {
      title: 'Business & Commercial Establishments/Organisations',
      navigation: 'busniess',
      image: require('../../assets/business.png'),
    },
    {
      title: 'Community Infrastructure (Only for Village level)',
      navigation: 'community',
      image: require('../../assets/community.png'),
    },
  ]
  return (
    <View
      style={styles.container}
      edges={['top', 'left', 'right']}>
      <ScrollView>
        <View style={styles.mainContainer}>
          <Box style={[styles.user]}>
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
                navigation.navigate('registerdetails', { edit: true })
              }>
              <Text style={styles.usr_btn_txt}>{user?.first_name}</Text>
              <Image
                style={[styles.tinyLogo1, { width: 16, height: 16 }]}
                source={require('../../assets/edit2.png')}
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
              <Box style={[styles.usr_land, { paddingLeft: 17 }]}>
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
          {ITEMS.map((item, i) => {
            return (
              <TouchableOpacity onPress={() => { setOnItemSelected(i),navigation.navigate(item?.navigation) }} style={[styles?.itemContainer, { borderColor: onItemSeleted == i ? primaryColor : borderColor }]} key={i}>
                <View style={[styles.itemImageContainer, { backgroundColor: onItemSeleted == i ? primaryColor : unSelected }]}>
                  <Image source={item.image}
                    style={styles.itemImage} />
                </View>
                <View style={styles.itemInnerContainer}>
                  <Text style={[styles.itemTxt, { color: onItemSeleted == i ? primaryColor : unSelected }]}>{item?.title}</Text>
                  <Image source={onItemSeleted == i ? require('../../assets/e4.png') : require('../../assets/e5.png')} style={{ alignSelf: 'center' }} />
                </View>
              </TouchableOpacity>
            )
          })}
        </View>
      </ScrollView>
      <View style={{ marginTop: 'auto', marginBottom: 20 }}>
        <CustomButton
          btnText={t('logout')}
          onPress={() => {
            storage.clearAll();
            navigation.replace('startup');
          }}
        />
      </View>
    </View>
  )
}

export default Home
const { width } = Dimensions.get('window')
const makeStyles = fontScale => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 22
  },
  mainContainer: {
    flex: 1,
  },
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
  itemContainer: {
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent:'space-between',
    gap: 12,
    borderColor: borderColor,
    borderWidth: 1,
    borderRadius: 6,
    width: '100%',
    marginVertical: 8,
  },
  itemInnerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemImage: {
    height: 38, width: 38, alignSelf:'center'
  },
  arrowIcon: {
    height: 8, width: 8
  },
  itemImageContainer: {
    backgroundColor: unSelected,
    borderRadius: 6,
    padding: 14,
    justifyContent: 'center',
    alignSelf: 'center',
    height: 80,
    width: 80
  },
  itemTxt: {
    color: unSelected,
    fontSize: 16 / fontScale,
    fontFamily: fontFamilyMedium,
    alignSelf: 'center',
    width: '65%',
    flexWrap: 'wrap'
  },
})