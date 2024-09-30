import {Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View} from 'react-native';
import React from 'react';
import {Styles, width} from '../../../../styles/globalStyles';
import HeaderCard from '../../../../Components/Card/HeaderCard';
import {
  black,
  borderColor,
  dark_grey,
  draft_color,
  primary,
  white,
} from '../../../../styles/colors';
import {fontFamilyBold, fontFamilyRegular} from '../../../../styles/fontStyle';

const Production = ({navigation}:{navigation:any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const ITEMS = [
    {
      title: 'Cultivation',
      navigation: 'cultivation',
      value: 10,
    },
    {
      title: 'Trees,shrubs & grassland',
      navigation: 'trees',
      value: 10,
    },
    {
      title: 'Poultry',
      navigation: 'poultry',
      value: 10,
    },
    {
      title: 'Fishery',
      navigation: 'fishery',
      value: 10,
    },

    {
      title: 'Hunting',
      navigation: 'hunting',
      value: 10,
    },
    {
      title: 'Storage',
      navigation: 'storage',
      value: 10,
    },
    {
      title: 'Selling Channel',
      navigation: 'total_land',
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
              Production
            </Text>
            <View style={{flexDirection: 'row', gap: 16}}>
              <View>
                <Text style={styles.sub_text}>Land allocated</Text>
                <Text
                  style={[
                    styles.sub_text,
                    {color: primary, marginVertical: 4},
                  ]}>
                  50 acres
                </Text>
              </View>
              <View>
                <Text style={styles.sub_text}>Used land</Text>
                <Text
                  style={[
                    styles.sub_text,
                    {color: draft_color, marginVertical: 4},
                  ]}>
                  50 acres
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.box_inner_container}>
            <Image
              source={require('../../../../../assets/e2.png')}
              style={styles.image}
            />
          </View>
        </View>
      </HeaderCard>
      <View style={styles.inner_content_container}>
        {ITEMS.map((item: any, index: any) => {
          return (
            <TouchableOpacity
              key={index}
              style={styles.box_container}
              onPress={() => navigation.navigate(item?.navigation)}>
              <View style={styles.inner_container}>
                <View>
                  {item?.title === 'Selling Channel' ? null : (
                    <Text style={styles.header_text}>{item.value}</Text>
                  )}
                  <Text style={[styles.sub_text, {marginVertical: 6}]}>
                    {item?.title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

export default Production;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
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
    inner_content_container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      marginVertical:'8%'
    },
    box_container: {
      borderColor: borderColor,
      borderWidth: 1,
      padding: 22,
      width: width / 2.4,
      backgroundColor: white,
      borderRadius: 8,
      marginVertical: 10,
    },
  });
