import {Box, Button, Text} from '@react-native-material/core';
import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
} from 'react-native';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {useSelector} from 'react-redux';

export default function Home({navigation, route}) {
  const {userToken, userDetails} = useSelector(s => s.auth);

  console.log(userDetails, 'userDetails');
  return (
    <SafeAreaView>
      <ScrollView>
        <Box style={styles.container}>
          {/* <Box>
            <Text variant="h2">Hello from {route?.name}</Text>
          </Box> */}

          <Box style={styles.user}>
            <Box style={styles.user_name}>
              <Text variant="h2" style={styles.user_name_txt}>
                {userDetails.first_name?.charAt(0)}
                {userDetails.last_name?.charAt(0)}
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

            <TouchableOpacity style={styles.usr_btn}>
              <Text style={styles.usr_btn_txt}>{userDetails.first_name}</Text>
              <Image
                style={styles.tinyLogo1}
                source={require('../../../assets/edit2.png')}
                // height={100}
              />
            </TouchableOpacity>
            <Text variant="body1" style={styles.phone}>
              {userDetails.country_code} {userDetails.phone}
            </Text>

            <Box style={styles.user_land}>
              {/* <Box style={styles.usr_land_lft}> */}
              <Box style={styles.usr_land}>
                <Text variant="body1" style={styles.usr_txt}>
                  Land allocated
                </Text>
                <Text variant="body1" style={styles.land_txt}>
                  {userDetails.total_land}{' '}
                  {userDetails.land_measurement_symbol ||
                    userDetails.land_measurement}
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
                  Used land
                </Text>
                <Text variant="body1" style={styles.land_txt2}>
                  {Object.keys(userDetails.sub_area).reduce(
                    (prev, new_value) => {
                      if (userDetails.sub_area[new_value].land) {
                        return prev + userDetails.sub_area[new_value].land || 0;
                      }
                      return prev + userDetails.sub_area[new_value] || 0;
                    },
                    0,
                  )}{' '}
                  {userDetails.land_measurement_symbol ||
                    userDetails.land_measurement}
                </Text>
              </Box>
            </Box>
          </Box>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ProductionStack', {
                screen:
                  userDetails?.total_land > 0 ? 'production' : 'totalLand',
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
                  Production
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
          <TouchableOpacity>
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
                  Consumption
                </Text>
              </Box>
              <Box style={styles.hme_box_rgt}>
                <Image
                  style={styles.tinyIcon}
                  source={require('../../../assets/e5.png')}
                  // height={100}
                />
              </Box>
            </Box>
          </TouchableOpacity>
          {/* <Text onPress={()=>navigation.navigate("countryCheck")}>Country Check</Text> */}
          {/* <View style={StyleSheet.login_submit}>
            <CustomButton btnText={'Submit'} />
          </View> */}
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
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
    fontSize: 13,
    marginRight: 1,
    marginLeft: 4,
  },
  phone: {
    color: '#263238',
    fontSize: 13,
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
    width: 75,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginVertical: 10,
    padding: 5,
  },
  user_name_txt: {
    color: '#fff',
    fontSize: 36,
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
    fontSize: 12,
    color: '#263238',
    marginBottom: 5,
    fontFamily: 'ubuntu_regular',
  },
  land_txt: {
    color: '#268C43',
    fontSize: 12,
    fontFamily: 'ubuntu_medium',
  },
  land_txt2: {
    color: '#E5C05E',
    fontSize: 12,
    fontFamily: 'ubuntu_medium',
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
    fontSize: 16,
    fontWeight: 500,
    marginLeft: 20,
  },
  hme_box_txt2: {
    color: '#263238',
    fontSize: 16,
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

  container: {
    paddingHorizontal: 20,
  },
});
