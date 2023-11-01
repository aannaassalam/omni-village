import React, {useCallback, useRef, useState} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import MapView, {Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import {useFocusEffect} from '@react-navigation/native';
import {Pressable, StyleSheet, View} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {Dimensions} from 'react-native';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default function MapScreen({navigation, route}) {
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.09,
    longitudeDelta: 0.02,
  });
  const [marker, setMarker] = useState({latitude: 0, longitude: 0});
  const map = useRef();

  const {setCoordinates} = route.params;

  useFocusEffect(
    useCallback(() => {
      Geolocation.getCurrentPosition(
        position => {
          console.log(position);
          setRegion({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.02,
          });
          setMarker({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
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
    }, []),
  );

  return (
    <SafeAreaView style={styles.container}>
      {Boolean(Object.keys(region).length) && (
        <MapView
          region={region}
          ref={map}
          provider="google"
          onPress={e => {
            setMarker(e.nativeEvent.coordinate);
            setCoordinates(e.nativeEvent.coordinate);
          }}
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
      <Pressable
        style={[styles.button, styles.back]}
        onPress={() => navigation.goBack()}>
        <Icon name="arrow-back-outline" size={30} color="#333" />
      </Pressable>
      <Pressable
        style={[styles.button, styles.crosshair]}
        onPress={() => {
          setMarker({latitude: region.latitude, longitude: region.longitude});
          setCoordinates({
            latitude: region.latitude,
            longitude: region.longitude,
          });
          map.current.animateToRegion(region);
        }}>
        <MaterialIcons name="gps-fixed" size={30} color="#555" />
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    borderRadius: 100,
    alignSelf: 'flex-start',
  },
  back: {top: 10, left: 10},
  crosshair: {
    top: 'auto',
    alignSelf: 'flex-end',
    bottom: 80,
    left: 'auto',
    right: 10,
  },
});
