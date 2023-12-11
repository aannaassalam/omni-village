import React from 'react';
import {useTranslation} from 'react-i18next';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {useUser} from '../../Hooks/useUser';
import '../../i18next/index';

const CustomDashboard2 = ({allocatedFor, usedLand}) => {
  const {data: user} = useUser();
  const {t} = useTranslation();
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={styles.container}>
      <View style={styles.top_container}>
        <View style={[styles.top_container_inner, {flex: 1}]}>
          <Text style={styles.land_allocated_text}>
            {t('land allocated for')}
          </Text>
          <Text style={styles.value_text}>{allocatedFor}</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={[styles.top_container_inner, {flexDirection: 'row'}]}>
          <Text
            style={[
              styles.value_text,
              {
                color: '#fff',
                flex: 1,
                flexWrap: 'wrap',
                justifyContent: 'center',
              },
            ]}>
            {usedLand}{' '}
            {user.land_measurement_symbol !== '-'
              ? user.land_measurement_symbol
              : user.land_measurement}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CustomDashboard2;
const width = Dimensions.get('window').width;
const makeStyles = fontScale =>
  StyleSheet.create({
    top_container: {
      width: width / 1.1,
      alignSelf: 'center',
      justifyContent: 'space-between',
      backgroundColor: '#268C43',
      borderRadius: 10,
      paddingVertical: 20,
      paddingHorizontal: 10,
      margin: 5,
      flexDirection: 'row',
      // alignItems: 'center',
    },
    top_container_inner: {
      padding: 5,
      alignSelf: 'center',
      flex: 0.4,
      // verticalAlign: 'middle',
      // justifyContent: 'center',
    },
    land_allocated_text: {
      fontSize: 12 / fontScale,
      color: '#C1D8C7',
      fontFamily: 'ubuntu-medium',
      marginBottom: 3,
    },
    value_text: {
      fontSize: 13 / fontScale,
      color: '#fff',
      fontFamily: 'ubuntu-medium',
      // marginVertical: 'auto',
    },
    divider: {
      height: '70%',
      width: 2,
      borderRadius: 10,
      alignSelf: 'center',
      color: '#FFFFFF17',
      marginHorizontal: 10,
    },
  });
