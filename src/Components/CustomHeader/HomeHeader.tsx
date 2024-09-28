import {
  Dimensions,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Image
} from 'react-native';
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import {primary, white} from '../../styles/colors';
import { useNavigation } from '@react-navigation/native';
import { height } from '../../styles/globalStyles';
import { fontFamilyMedium } from '../../styles/fontStyle';

const HomeHeader = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.inner_container}>
        <Feather
          name="menu"
          color={white}
          size={28}
          style={styles.menu_icon}
          onPress={() => {
            navigation.openDrawer()
          }}
        />
        <View style={styles.header_txt_container}>
          <Image
            style={styles.logo_mini}
            source={require('../../../assets/logo-white.png')}
          />
        </View>
      </View>
      {/* <Ionicons
        name="notifications-outline"
        color={white}
        size={28}
        style={styles.menu_icon}
        onPress={() => {navigation.navigate('notification')}}
      /> */}
      <Image
        source={{
          uri: '',
        }}
        style={styles.profile_image}
      />
    </View>
  );
};

export default HomeHeader;
const {width} = Dimensions.get('window');
const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      width: width / 1,
      paddingHorizontal: 22,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 16,
      backgroundColor: primary,
      paddingVertical: 8
    },
    inner_container: {
      width: width / 1.6,
      flexDirection: 'row',
      gap: 18,

    },
    menu_icon: {
      alignSelf: 'center',
      padding:6
    },
    header_txt_container: {
      // alignSelf: 'center',
      backgroundColor: 'pink',
    },
    header_txt: {
      fontSize: 24 / fontScale,
      fontFamily: fontFamilyMedium,
      color: white,
    },
    profile_image: {
      borderRadius: 100 / 2,
      height: 40,
      width: 40,
    },
    logo_mini: {
      height: height / 14,
      width: width / 3,
      resizeMode: 'contain',
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: primary,
    },
  });
