import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import { Styles } from '../../../../../styles/globalStyles';
import { fontFamilyBold, fontFamilyRegular } from '../../../../../styles/fontStyle';
import { black, borderColor, dark_grey, draft_color, primary } from '../../../../../styles/colors';
import HeaderCard from '../../../../../Components/Card/HeaderCard';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';

const SellingChannel = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  // Initialize state with the data object
  const [data, setData] = useState({
    local_market: false,
    broker: false,
    ecommerce: false,
    export: false,
    none: false,
  });

  // Toggle the value of the selected key
  const toggleValue = (key:any) => {
    setData(prevState => ({
      ...prevState,
      [key]: !prevState[key], // Toggle the value of the selected key
    }));
  };
  return (
    <View style={styles.container}>
      <View style={Styles.mainContainer}>
        <HeaderCard disabled={true}>
          <View style={styles.inner_container}>
            <View>
              <Text
                style={[
                  styles.header_text,
                  {marginBottom: 16, marginTop: 6, color: black},
                ]}>
                Selling Channel
              </Text>
            </View>
            <View style={styles.box_inner_container}>
              <Image
                source={require('../../../../../../assets/e2.png')}
                style={styles.image}
              />
            </View>
          </View>
        </HeaderCard>
        <View style={{marginTop: '5%'}}>
          {Object.entries(data).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={styles.row}
              onPress={() => toggleValue(key)}>
              <Text style={styles.text}>
                {key.charAt(0).toUpperCase()}
                {key.replace('_', ' ').slice(1)}
              </Text>
              <TouchableOpacity>
                <Image
                  source={
                    value === true
                      ? require('../../../../../../assets/checked.png')
                      : require('../../../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22, alignSelf: 'center'}}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={Styles.bottomBtn}>
        <CustomButton btnText={'Submit'} onPress={() => {}} />
      </View>
    </View>
  );
}

export default SellingChannel

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    inner_container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems:'center'
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
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 18,
      borderColor: borderColor,
      borderWidth: 1,
      marginVertical: 8,
      borderRadius: 8,
      alignItems:'center'
    },
    text: {
      fontSize: 16 / fontScale,
      fontFamily: fontFamilyRegular,
      color: '#000',
    },
  });