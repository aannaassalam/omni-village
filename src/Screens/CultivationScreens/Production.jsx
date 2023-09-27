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
import {useDispatch, useSelector} from 'react-redux';
import {getTree} from '../../Redux/TreesSlice';
import { useTranslation } from 'react-i18next';
import '../../i18next';

const Production = ({navigation, route}) => {
  // const {totalLand, usedLand, data} = route.params;
  const {userDetails} = useSelector(state => state.auth);
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {user} = useSelector(s => s.auth);

  const goToNext = name => {
    if (name === 'cultivation') {
      if (
        Object.values(user?.sub_area.cultivation.distribution || {}).filter(
          d => d !== 0,
        ).length > 0
      ) {
        navigation.navigate('season1', { seasonName: 'Cultivation' });
      } else {
        navigation.navigate('landAllocation');
      }
    } else if (name === 'trees') {
      navigation.navigate('treesShrubGrassland');
    } else if (name == 'poultry') {
      navigation.navigate('poultry', {totalLand: '50'});
    } else if (name === 'fishery') {
      navigation.navigate('fisheryIndex', {totalLand: '80'});
    } else if (name == 'hunting') {
      navigation.navigate('hunting');
    } else if (name == 'storage') {
      navigation.navigate('storage');
    } else if (name == 'sellingChannel') {
      navigation.navigate('sellingChannel');
    }
  };

  const usedLand = useMemo(() => {
    const data = Object.keys(userDetails?.sub_area).reduce((acc, key) => {
      if (key === 'cultivation') {
        return acc + userDetails?.sub_area[key].land;
      }
      return acc + userDetails?.sub_area[key];
    }, 0);
    return data;
  }, [userDetails?.sub_area]);

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t('production')}
        goBack={() => navigation.goBack()}
      />
      {/* top container for used and allocated land */}
      <View style={styles.top_container}>
        <View style={styles.top_container_inner}>
          <Text style={styles.land_allocated_text}>{t('land allocated')}</Text>
          <Text style={styles.value_text}>
            {userDetails?.total_land}{' '}
            {userDetails.land_measurement_symbol
              ? userDetails.land_measurement_symbol
              : userDetails.land_measurement}
          </Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.top_container_inner}>
          <Text style={styles.land_allocated_text}>{t('used land')}</Text>
          <Text style={[styles.value_text, {color: '#E5C05E'}]}>
            {usedLand}{' '}
            {userDetails.land_measurement_symbol
              ? userDetails.land_measurement_symbol
              : userDetails.land_measurement}
          </Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.top_container_inner}>
          <Text
            style={[styles.land_allocated_text, {fontSize: 14 / fontScale}]}
            onPress={() => navigation.navigate('totalLand')}>
            {t('modify')}
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
                productionName={t(item)}
                productionArea={
                  item === 'cultivation'
                    ? userDetails?.sub_area[item].land
                    : userDetails?.sub_area[item]
                }
                progressBar={false}
                onPress={() => goToNext(item)}
              />
            );
          })}
          <CustomShowcaseInput
            productionName={t('hunting')}
            productionArea={''}
            onPress={() => goToNext('hunting')}
          />
          <CustomShowcaseInput
            productionName={t('selling channel')}
            productionArea={''}
            onPress={() => goToNext('sellingChannel')}
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
