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

export default function Home({navigation, route}) {
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
                JD
              </Text>
            </Box>
            <AnimatedCircularProgress
            size={105}
            width={4}
            fill={30}
            tintColor="#000000"
            onAnimationComplete={() => console.log('onAnimationComplete')}
            backgroundColor="#ECECEC"
            style={styles.circular}
          />

            <TouchableOpacity style={styles.usr_btn}>
              <Text style={styles.usr_btn_txt}>Doe</Text>
              <Image
                style={styles.tinyLogo1}
                source={require('../../../assets/edit2.png')}
                // height={100}
              />
            </TouchableOpacity>
            <Text variant="body1" style={styles.phone}>
              0+ 000 111 1212
            </Text>

            <Box style={styles.user_land}>
              <Box style={styles.usr_land_lft}>
                <Box style={styles.usr_land_lft_txt}>
                  <Text variant="body1" style={styles.usr_txt}>
                    Land allocated
                  </Text>
                  <Text variant="body1" style={styles.land_txt}>
                    50 acres
                  </Text>
                </Box>
              </Box>
              <Box
                h={30}
                w={4}
                style={{
                  backgroundColor: 'rgba(38, 50, 56, 0.09)',
                  marginRight: 40,
                }}
              />
              <Box style={styles.usr_land_rgt}>
                <Text variant="body1" style={styles.usr_txt}>
                  Used land
                </Text>
                <Text variant="body1" style={styles.land_txt2}>
                  20 acres
                </Text>
              </Box>
            </Box>
          </Box>
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
                Production
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

          <View style={StyleSheet.login_submit}>
            <CustomButton btnText={'Submit'} />
          </View>
        </Box>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  circular:{
    marginTop:-95,
  },
  user: {
    borderColor: '#ECECEC',
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
    borderColor: '#ECECEC',
    borderWidth: 1,
    padding: 4,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
  },
  usr_txt: {
    fontSize: 12,
    color: '#263238',
  },
  land_txt: {
    color: '#268C43',
    fontSize: 12,
  },
  land_txt2: {
    color: '#E5C05E',
    fontSize: 12,
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
