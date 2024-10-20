import {
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
import React, { useState } from 'react';
import {Styles, width} from '../../../../../styles/globalStyles';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';
import {
  black,
  borderColor,
  dark_grey,
  draft_color,
  primary,
  unSelected,
  white,
} from '../../../../../styles/colors';
import HeaderCard from '../../../../../Components/Card/HeaderCard';
import {
  fontFamilyBold,
  fontFamilyMedium,
  fontFamilyRegular,
} from '../../../../../styles/fontStyle';
import { useSelector } from 'react-redux';

const Fishery = ({navigation}: {navigation: any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [onItemSeleted, setOnItemSelected] = useState(null);
  const authState = useSelector((state)=>state.authState)
  const ITEMS = [
    {
      title: 'Harvested from Pond',
      navigation: 'pond',
      image: require('../../../../../../assets/pond.png'),
    },
    {
      title: 'Harvested from River',
      navigation: 'river',
      image: require('../../../../../../assets/river.png'),
    },
  ];
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
              Fishery
            </Text>
            <View style={{flexDirection: 'row', gap: 26}}>
              <View>
                <Text style={styles.sub_text}>Used land</Text>
                <Text
                  style={[
                    styles.sub_text,
                    {color: draft_color, marginVertical: 4},
                  ]}>
                  {authState?.sub_area?.fishery} {authState?.land_measurement_symbol}
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
      <View style={{marginTop: '10%'}}>
        {ITEMS.map((item: any, i: any) => {
          return (
            <TouchableOpacity
              onPress={() => {
                setOnItemSelected(i), navigation.navigate(item?.navigation);
              }}
              style={[
                styles?.itemContainer,
                {borderColor: onItemSeleted == i ? primary : borderColor},
              ]}
              key={i}>
              <View
                style={[
                  styles.itemImageContainer,
                  {backgroundColor: onItemSeleted == i ? primary : unSelected},
                ]}>
                <Image source={item.image} style={styles.itemImage} />
              </View>
              <View style={styles.itemInnerContainer}>
                <Text
                  style={[
                    styles.itemTxt,
                    {color: onItemSeleted == i ? primary : unSelected},
                  ]}>
                  {item?.title}
                </Text>
                <Image
                  source={
                    onItemSeleted == i
                      ? require('../../../../../../assets/e4.png')
                      : require('../../../../../../assets/e5.png')
                  }
                  style={{alignSelf: 'center'}}
                />
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Fishery;

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
      height: 38,
      width: 38,
      alignSelf: 'center',
    },
    itemImageContainer: {
      backgroundColor: unSelected,
      borderRadius: 6,
      padding: 14,
      justifyContent: 'center',
      alignSelf: 'center',
      height: 80,
      width: 80,
    },
    itemTxt: {
      color: unSelected,
      fontSize: 16 / fontScale,
      fontFamily: fontFamilyMedium,
      alignSelf: 'center',
      width: '65%',
      flexWrap: 'wrap',
    },
    bottomInner: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
  });
