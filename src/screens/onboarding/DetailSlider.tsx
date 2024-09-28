import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ScrollView,
  Dimensions,
  Image,
  ImageBackground,
} from 'react-native';
import React, {useState, useRef} from 'react';
import {fontFamilyBold, fontFamilyRegular} from '../../styles/fontStyle';
import {
  borderColor,
  dark_grey,
  light_grey,
  primary,
  white,
} from '../../styles/colors';
import {useDispatch} from 'react-redux';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { reqSuccess } from '../../redux/auth/actions';

const images = [
  {
    uri: require('../../../assets/onboarding1.png'),
    heading: 'Manage Your Land with Ease',
    subheading:
      'Effortlessly add your land details and monitor its health from one dashboard.',
  },
  {
    uri: require('../../../assets/onboarding2.png'),
    heading:
      'Track Your Crops, Maximize Your Harvest',
    subheading:
      "Add and monitor your farm's land and crops with real-time insights.",
  },
  {
    uri: require('../../../assets/onboarding3.png'),
    heading: 'Simplify Farm Management',
    subheading:
      "Stay on top of your farm's productivity with smart tools and alerts.",
  },
  {
    uri: require('../../../assets/onboarding4.png'),
    heading: '',
    subheading: '',
  },
];
const DetailSlider = ({navigation}: {navigation: any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const dispatch = useDispatch();
  const scrollToNext = () => {
    if (currentIndex < images.length - 1 && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: width * (currentIndex + 1),
        animated: false,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('login');
    }
  };
  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / width);
    setCurrentIndex(index);
  };
  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}>
        {images.map((image, index) => (
          <View key={index} style={{}}>
            <Image source={image.uri} style={styles.imageContainer} />
            <View style={styles.textContainer}>
              <Text style={styles.heading}>{image.heading}</Text>
              <Text style={styles.subheading}>{image.subheading}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      {currentIndex === 3 ? (
        <View style={styles.bottomContainer}>
          <Text style={[styles.header_txt, {marginBottom: '5%'}]}>
            Welcome to OmniVillage
          </Text>
          <Text style={[styles.sub_txt, {marginBottom: '5%'}]}>
            All your Agricultural monitoring needs one tap away
          </Text>
          <CustomButton
            onPress={() => {
              // dispatch(reqSuccess());
              navigation.navigate('login');
            }}
            btnText={'Get Started'}
            style={{marginTop: '8%', width: width / 1.1, borderColor: '#fff'}}
          />
        </View>
      ) : (
        <View style={styles.pagination}>
          <Text
            style={styles.skip_next_btn}
            onPress={() => navigation.navigate('login')}>
            Skip
          </Text>
          <View
            style={{flexDirection: 'row', justifyContent: 'center', gap: 10}}>
            {Array.from(Array(3).keys()).map((key, index) => (
              <View
                style={[
                  styles.paginationArray,
                  {
                    width: currentIndex === index ? 24 : 7,
                    height: currentIndex === index ? 5 : 7,
                    backgroundColor:
                      currentIndex === index ? primary : light_grey,
                  },
                ]}
                key={index}
              />
            ))}
          </View>
          <Text style={styles.skip_next_btn} onPress={() => scrollToNext()}>
            Next
          </Text>
        </View>
      )}
    </View>
  );
};

export default DetailSlider;
const {width, height} = Dimensions.get('window');
const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    imageContainer: {
      width,
      height: height / 1.5,
      alignSelf: 'center',
      justifyContent: 'center',
      resizeMode:'cover',
    },
    textContainer: {
      paddingHorizontal: 10,
      paddingVertical: 20,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      bottom: 150,
      width: '100%',
    },
    heading: {
      fontSize: 20 / fontScale,
      fontFamily: fontFamilyBold,
      color: dark_grey,
      textAlign:'center'
    },
    subheading: {
      fontSize: 16 / fontScale,
      color: dark_grey,
      fontFamily: fontFamilyRegular,
      alignSelf: 'center',
      textAlign: 'center',
      paddingHorizontal: 20,
      marginTop: '5%',
      width: width / 1.2,
    },
    pagination: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      marginTop: 0,
      position: 'absolute',
      bottom: 60,
      alignSelf: 'center',
      paddingHorizontal: 20,
    },
    paginationArray: {
      width: 7,
      height: 7,
      borderRadius: 7 / 2,
      gap: 5,
      backgroundColor: light_grey,
      alignSelf: 'center',
    },
    skip_next_btn: {
      fontSize: 18 / fontScale,
      fontFamily: fontFamilyBold,
      color: dark_grey,
      marginTop: '18%',
      padding: 8,
    },
    bottomContainer: {
      position: 'absolute',
      bottom: 20,
      width: width / 1,
      padding: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
    header_txt: {
      fontSize: 28 / fontScale,
      fontFamily: fontFamilyBold,
      color: dark_grey,
    },
    sub_txt: {
      fontSize: 16 / fontScale,
      fontFamily: fontFamilyRegular,
      color: dark_grey,
      marginTop: 5,
      textAlign: 'center',
    },
  });
