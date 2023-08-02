import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Dimensions,
} from 'react-native';
import React from 'react';
import {Divider} from 'react-native-paper';

const CustomDashboard2 = ({allocatedFor, usedLand}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={styles.container}>
      <View style={styles.top_container}>
        <View style={styles.top_container_inner}>
          <Text style={styles.land_allocated_text}>Land allocated for</Text>
          <Text style={styles.value_text}>{allocatedFor}</Text>
        </View>
        <Divider style={styles.divider} />
        <View style={styles.top_container_inner}>
          <Text style={[styles.value_text, {color: '#fff'}]}>
            {usedLand} acres
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
  });
