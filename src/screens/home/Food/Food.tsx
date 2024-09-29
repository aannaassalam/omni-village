import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import { Styles } from '../../../styles/globalStyles';
import { borderColor, dark_grey, draft_color, primary, unSelected, white } from '../../../styles/colors';
import { fontFamilyMedium, fontFamilyRegular } from '../../../styles/fontStyle';

const Food = ({navigation}:{navigation:any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [onItemSeleted, setOnItemSelected] = useState(null);
  const ITEMS = [
    {
      title: 'Production',
      navigation: 'total_land',
      image: require('../../../../assets/e2.png'),
    },
    {
      title: 'Consumption',
      navigation: 'consumption',
      image: require('../../../../assets/e3.png'),
    },
  ];
  return (
    <View style={Styles.mainContainer}>
      <View style={styles.inner_container}>
        {/* Production */}
        <View style={styles.box_container}>
          <View style={styles.box_inner_container}>
            <Image
              source={require('../../../../assets/e2.png')}
              style={styles.image}
            />
          </View>
          <View style={[styles.inner_container, {marginTop: 10}]}>
            <View>
              <Text style={styles.header_text}>50</Text>
              <Text style={styles.sub_text}>Submitted</Text>
            </View>
            <View>
              <Text style={[styles.header_text, {color: draft_color}]}>50</Text>
              <Text style={styles.sub_text}>Drafted</Text>
            </View>
          </View>
        </View>
        {/* Consumption */}
        <View style={styles.box_container}>
          <View style={styles.box_inner_container}>
            <Image
              source={require('../../../../assets/e3.png')}
              style={styles.image}
            />
          </View>
          <View style={[styles.inner_container, {marginTop: 10}]}>
            <View>
              <Text style={styles.header_text}>50</Text>
              <Text style={styles.sub_text}>Submitted</Text>
            </View>
            <View>
              <Text style={[styles.header_text, {color: draft_color}]}>50</Text>
              <Text style={styles.sub_text}>Drafted</Text>
            </View>
          </View>
        </View>
      </View>
      <View style={{marginTop:'10%'}}>
      {ITEMS.map((item:any,i:any)=>{
        return(
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
                ? require('../../../../assets/e4.png')
                : require('../../../../assets/e5.png')
            }
            style={{alignSelf: 'center'}}
          />
        </View>
      </TouchableOpacity>
        )
      })}
      </View>
    </View>
  );
};

export default Food

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    inner_container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    box_container: {
      borderColor: borderColor,
      borderWidth: 1,
      padding: 22,
      backgroundColor: white,
      borderRadius: 8,
    },
    box_inner_container: {
      backgroundColor: dark_grey,
      padding: 42,
      borderRadius: 8,
    },
    image: {
      height: 50,
      width: 50,
      resizeMode: 'contain',
    },
    header_text: {
      fontSize: 18 / fontScale,
      fontFamily: fontFamilyMedium,
      color: primary,
    },
    sub_text: {
      fontSize: 14 / fontScale,
      fontFamily: fontFamilyRegular,
      color: dark_grey,
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
    arrowIcon: {
      height: 8,
      width: 8,
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
  });