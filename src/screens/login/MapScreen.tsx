import React, {useCallback, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {Marker, Circle} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {useFocusEffect} from '@react-navigation/native';
import {Pressable, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Dimensions} from 'react-native';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {useTranslation} from 'react-i18next';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function MapScreen({navigation, route}: {navigation:any; route:any}) {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.09,
    longitudeDelta: 0.02,
  });
  const [marker, setMarker] = useState({latitude: 0, longitude: 0});
  const [current_location, setCurrent_location] = useState({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
  });
  const [loading, setLoading] = useState(true);
  const map = useRef();

  const {t} = useTranslation();

  const {setCoordinates, my_location} = route.params;
  console.log(my_location);

  useFocusEffect(
    useCallback(() => {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          setRegion({
            latitude: my_location.lat ?? position.coords.latitude,
            longitude: my_location.lng ?? position.coords.longitude,
            latitudeDelta: 0.003,
            longitudeDelta: 0.003,
          });
          setCurrent_location({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            radius: position.coords.accuracy,
          });
          setMarker({
            latitude: my_location.lat ?? position.coords.latitude,
            longitude: my_location.lng ?? position.coords.longitude,
          });
        },
        error => {
          // See error code charts below.
          console.log(error.code, error.message);
          setRegion({
            latitude: 0,
            longitude: 0,
            latitudeDelta: 0.09,
            longitudeDelta: 0.02,
          });
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }, [my_location]),
  );

  if (map.current) {
    console.log(Object.keys(map.current.state));
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={{flex: 1}}>
        {Boolean(Object.keys(region).length) && (
          <MapView
            region={region}
            ref={map}
            // provider="google"
            onPress={e => {
              setMarker(e.nativeEvent.coordinate);
              setCoordinates(e.nativeEvent.coordinate);
            }}
            showsUserLocation
            showsMyLocationButton={false}
            loadingEnabled
            // onMapLoaded={() => {
            //   console.log('____LOading');
            //   setLoading(false);
            // }}
            mapType="satellite"
            // customMapStyle={styles.container}
            style={styles.container}>
            <Marker
              draggable
              coordinate={marker}
              onDragEnd={e => {
                setMarker(e.nativeEvent.coordinate);
                setCoordinates(e.nativeEvent.coordinate);
              }}
            />
          </MapView>
        )}
        {map.current?.state?.isReady && (
          <>
            <Pressable
              style={[styles.button, styles.back]}
              onPress={() => navigation.goBack()}>
              <Icon name="arrow-back-outline" size={30} color="#333" />
            </Pressable>
            <Pressable
              style={[styles.button, styles.crosshair]}
              onPress={() => {
                // setMarker({latitude: region.latitude, longitude: region.longitude});
                setCoordinates({
                  latitude: current_location.latitude,
                  longitude: current_location.longitude,
                });
                map.current.animateToRegion(region);
              }}>
              <MaterialIcons name="gps-fixed" size={30} color="#555" />
            </Pressable>
            <View
              style={{
                position: 'absolute',
                bottom: 20,
                left: 0,
                right: 0,
                alignSelf:'center',
                alignItems:'center'
              }}>
              <CustomButton
                btnText={t('confirm')}
                onPress={() => navigation.goBack()}
              />
            </View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  overlay: {
    position: 'absolute',
    pointerEvents: 'none',
    top: 0,
    left: 0,
    width: width,
    height: height,
    // alignItems: 'flex-start',
  },
  button: {
    position: 'absolute',
    padding: 8,
    backgroundColor: '#fff',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 2,
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  back: {top: 10, left: 10},
  crosshair: {
    top: 'auto',
    alignSelf: 'flex-end',
    bottom: 100,
    left: 'auto',
    right: 10,
  },
});
