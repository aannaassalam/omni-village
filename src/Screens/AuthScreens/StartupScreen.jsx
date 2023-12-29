import React, {useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {CheckToken} from '../../Helper/CheckToken';
import {useTranslation} from 'react-i18next';
import {storage} from '../../Helper/Storage';

export default function StartupScreen({navigation, route}) {
  const {t} = useTranslation();

  const data = [
    {
      img: require('../../../assets/Startup-image.png'),
      text: t('all your agricultural monitoring needs one tap away'),
    },
    {
      img: require('../../../assets/Startup-image.png'),
      text: t('all your agricultural monitoring needs one tap away'),
    },
    {
      img: require('../../../assets/Startup-image.png'),
      text: t('all your agricultural monitoring needs one tap away'),
    },
  ];

  console.log(storage.getString('user'));

  const [activeIndex, setActiveIndex] = useState(0);

  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  return (
    <LoginWrapper>
      <>
        <View>
          <ScrollView
            showsHorizontalScrollIndicator={false}
            horizontal
            pagingEnabled
            alwaysBounceVertical
            onScroll={e => {
              let slide = Math.round(
                e.nativeEvent.contentOffset.x / Dimensions.get('window').width,
              );
              if (slide !== activeIndex) {
                setActiveIndex(slide); //here we will set our active index num
              }
            }}
            style={{height: '50%'}}>
            {data.map((item, idx) => (
              <View key={idx} style={styles.contentImageContainer}>
                <Image source={item.img} alt="" style={styles.contentImage} />
                <Text style={styles.contentText}>{item.text}</Text>
              </View>
            ))}
          </ScrollView>
          <View style={styles.dotContainer}>
            {data.map((item, index) => {
              if (data.length !== 1) {
                return (
                  <View
                    key={index}
                    style={[
                      index === activeIndex ? styles.activeDot : styles.dot,
                    ]}
                  />
                );
              }
            })}
          </View>
        </View>
        <View style={styles.bottomContainer}>
          <Text style={styles.title}>{t('welcome to omnivillage')}</Text>
          <Text style={styles.subtitle}>
            {t('all your agricultural monitoring needs one tap away')}
          </Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate('register')}>
              <Text style={styles.buttonDarkText}>{t('register')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, {backgroundColor: '#268C43'}]}
              onPress={() => navigation.navigate('login')}>
              <Text style={styles.buttonLightText}>{t('login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </>
    </LoginWrapper>
  );
}

const makeStyles = fontScale =>
  StyleSheet.create({
    contentImageContainer: {
      width: Dimensions.get('window').width - 40,
      alignItems: 'center',
    },
    contentImage: {
      width: '80%',
      height: '100%',
      // height: 350,
      resizeMode: 'contain',
      opacity: 0.3,
    },
    contentText: {
      fontFamily: 'ubuntu-regualar',
      color: '#268C43',
      fontSize: 14 / fontScale,
      width: '65%',
      textAlign: 'center',
      marginTop: 15,
    },
    dotContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      zIndex: 8,
      elevation: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 2,
      marginTop: 20,
      alignSelf: 'center',
    },
    dot: {
      width: 10,
      height: 10,
      marginHorizontal: 3,
      marginVertical: 2,
      backgroundColor: '#E9EBEA',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#E9EBEA',
      position: 'relative',
    },
    activeDot: {
      width: 20,
      height: 10,
      marginHorizontal: 3,
      marginVertical: 2,
      backgroundColor: '#268C43',
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#268C43',
      position: 'relative',
    },
    bottomContainer: {
      marginTop: 25,
      flex: 1,
    },
    title: {
      fontFamily: 'ubuntu-bold',
      fontSize: 22 / fontScale,
      color: '#36393B',
      textAlign: 'center',
      marginTop: 'auto',
      marginBottom: 15,
    },
    subtitle: {
      fontFamily: 'ubuntu-regular',
      fontSize: 13 / fontScale,
      color: '#36393B',
      marginBottom: 'auto',
      textAlign: 'center',
    },
    buttonsContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 'auto',
    },
    button: {
      paddingVertical: 10,
      paddingHorizontal: 20,
      backgroundColor: '#EBECED',
      borderRadius: 8,
      elevation: 2,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.3,
      shadowRadius: 2,
      minWidth: 105,
      minHeight: 40,
    },
    buttonDarkText: {
      fontFamily: 'ubuntu-bold',
      color: '#263238',
      fontSize: 18 / fontScale,
      textAlign: 'center',
    },
    buttonLightText: {
      fontFamily: 'ubuntu-bold',
      color: '#fff',
      fontSize: 17 / fontScale,
      textAlign: 'center',
    },
  });
