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
} from 'react-native';

export default function StartupScreen({navigation, route}) {
  const data = [
    {
      img: require('../../../assets/Startup-image.png'),
      text: 'All your Agricultural monitoring needs one tap away',
    },
    {
      img: require('../../../assets/Startup-image.png'),
      text: 'All your Agricultural monitoring needs one tap away',
    },
    {
      img: require('../../../assets/Startup-image.png'),
      text: 'All your Agricultural monitoring needs one tap away',
    },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  console.log(activeIndex);
  return (
    <LoginWrapper>
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
          }}>
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
        <Text style={styles.title}>Welcome to Omni-village</Text>
        <Text style={styles.subtitle}>
          All your Agricultural monitoring needs one tap away
        </Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('register')}>
            <Text style={styles.buttonDarkText}>Register</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, {backgroundColor: '#268C43'}]}
            onPress={() => navigation.navigate('login')}>
            <Text style={styles.buttonLightText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LoginWrapper>
  );
}

const styles = StyleSheet.create({
  contentImageContainer: {
    width: Dimensions.get('window').width - 40,
    alignItems: 'center',
  },
  contentImage: {
    width: '80%',
    height: 300,
    resizeMode: 'contain',
    opacity: 0.3,
  },
  contentText: {
    fontFamily: 'ubuntu_regualar',
    color: '#268C43',
    fontSize: 14,
    width: '65%',
    textAlign: 'center',
    marginTop: 15,
  },
  dotContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    zIndex: 8,
    elevation: 8,
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
    fontFamily: 'ubuntu_bold',
    fontSize: 22,
    color: '#36393B',
    textAlign: 'center',
    marginBottom: 15,
  },
  subtitle: {
    fontFamily: 'ubuntu_regular',
    fontSize: 14,
    color: '#36393B',
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
    minWidth: 105,
    minHeight: 40,
  },
  buttonDarkText: {
    fontFamily: 'ubuntu_bold',
    color: '#263238',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonLightText: {
    fontFamily: 'ubuntu_bold',
    color: '#fff',
    fontSize: 17,
    textAlign: 'center',
  },
});
