import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import {Divider} from 'react-native-paper';
import React, {useMemo, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const Production = ({navigation, route}) => {
  // const {totalLand, usedLand, data} = route.params;
  const {userDetails} = useSelector((state) => state.auth)
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const goToNext = (item) => {
    console.log(item,"item")
    if (item == 'cultivation') {
      navigation.navigate('landAllocation',{totalLand:userDetails?.total_land});
    } else if (item == 'trees') {
      navigation.navigate('treesShrubGrassland',{totalLand:userDetails?.total_land});
    }
  };

  const usedLand = useMemo(()=>{
    const data = Object.keys(userDetails?.sub_area).reduce((acc,key)=>{
      if(key === 'cultivation'){
        return acc + userDetails?.sub_area[key].land
      }
      return acc + userDetails?.sub_area[key]
    },0)
    return data
  },[userDetails?.sub_area])
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Production'}
        goBack={() => navigation.goBack()}
      />
      {/* top container for used and allocated land */}
      <View style={styles.top_container}>
        <View style={styles.top_container_inner}>
          <Text style={styles.land_allocated_text}>Land allocated</Text>
          <Text style={styles.value_text}>{userDetails?.total_land} acres</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.top_container_inner}>
          <Text style={styles.land_allocated_text}>Used Land</Text>
          <Text style={[styles.value_text, {color: '#E5C05E'}]}>
            {usedLand} acres
          </Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.top_container_inner}>
          <Text
            style={[styles.land_allocated_text, {fontSize: 14 / fontScale}]}
            onPress={() => navigation.goBack()}>
            Modify
          </Text>
        </View>
      </View>
      {/* showcase input of used land */}
      <ScrollView>
        <>
          {Object.keys(userDetails?.sub_area).map(item => {
            return (
              <CustomShowcaseInput
              key={item}
                productionName={item}
                productionArea={`${item === 'cultivation' ? userDetails?.sub_area[item].land : userDetails?.sub_area[item]} acres`}
                progressBar={true}
                onPress={() => goToNext(item)}
              />
            );
          })}
          <CustomShowcaseInput
            productionName={'Hunting'}
            productionArea={''}
            progressBar={true}
          />
          <CustomShowcaseInput
            productionName={'Selling Channel'}
            productionArea={''}
            progressBar={true}
          />
        </>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Production;
const width = Dimensions.get('window').width;
const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    top_container: {
      width: width / 1.1,
      alignSelf: 'center',
      justifyContent: 'space-around',
      backgroundColor: '#268C43',
      borderRadius: 10,
      paddingVertical: 20,
      paddingHorizontal: 5,
      margin: 5,
      flexDirection: 'row',
    },
    top_container_inner: {
      padding: 5,
      alignSelf: 'center',
    },
    land_allocated_text: {
      fontSize: 14 / fontScale,
      color: '#C1D8C7',
      fontFamily: 'ubuntu_medium',
    },
    value_text: {
      fontSize: 14 / fontScale,
      color: '#fff',
      fontFamily: 'ubuntu_medium',
    },
    divider: {
      height: '70%',
      width: 2,
      borderRadius: 10,
      alignSelf: 'center',
      color: '#FFFFFF17',
    },
    continue: {
      marginTop: '5%',
      width: '90%',
      alignSelf: 'center',
      marginBottom: '5%',
    },
  });
