import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import React from 'react';
import {Divider} from 'react-native-paper';
import {useSelector} from 'react-redux';

const CustomDashboard2 = ({allocatedFor, usedLand}) => {
  const {user} = useSelector(state => state.auth);

  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={styles.container}>
      <View style={styles.top_container}>
        <View style={[styles.top_container_inner, {flex: 1}]}>
          <Text style={styles.land_allocated_text}>Land allocated for</Text>
          <Text style={styles.value_text}>{allocatedFor}</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.top_container_inner}>
          <Text
            style={[
              styles.value_text,
              {color: '#fff', flex: 1, flexWrap: 'wrap'},
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
    },
    top_container_inner: {
      padding: 5,
      alignSelf: 'center',
      flex: 0.4,
    },
    land_allocated_text: {
      fontSize: 12 / fontScale,
      color: '#C1D8C7',
      fontFamily: 'ubuntu_medium',
      marginBottom: 3,
    },
    value_text: {
      fontSize: 13 / fontScale,
      color: '#fff',
      fontFamily: 'ubuntu_medium',
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
