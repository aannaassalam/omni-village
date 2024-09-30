import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import {Styles, width} from '../../../../../styles/globalStyles';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';
import {
  black,
  dark_grey,
  draft_color,
  primary,
  white,
} from '../../../../../styles/colors';
import HeaderCard from '../../../../../Components/Card/HeaderCard';
import {
  fontFamilyBold,
  fontFamilyRegular,
} from '../../../../../styles/fontStyle';

const Fishery = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const DATA = [];
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
                  50 acres
                </Text>
              </View>
              <View>
                <Text style={styles.sub_text}>Fished</Text>
                <Text
                  style={[
                    styles.sub_text,
                    {color: primary, marginVertical: 4},
                  ]}>
                  12 Species
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
      <View>
        {DATA.length > 0 ? (
          <></>
        ) : (
          <View
            style={{
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../../../../../../assets/illustration.png')}
              style={styles.illustration}
            />
            <CustomButton
              btnText={'Add Crop'}
              onPress={() => {}}
              style={{width: width / 2, marginTop: 16}}
            />
          </View>
        )}
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
    illustration: {
      marginTop: '30%',
      height: 300,
      width: 300,
      resizeMode: 'contain',
    },
  });
