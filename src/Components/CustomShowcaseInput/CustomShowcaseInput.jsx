import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Divider} from 'react-native-paper';
import * as Progress from 'react-native-progress';
import {useSelector} from 'react-redux';

const CustomShowcaseInput = ({
  productionName,
  productionArea,
  progressBar,
  onPress,
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  const {user} = useSelector(state => state.auth);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        progressBar
          ? {justifyContent: 'space-evenly'}
          : {justifyContent: 'flex-start'},
      ]}>
      <View style={styles.areaProduction}>
        <Text style={styles.productionName}>
          {productionName === 'trees'
            ? 'trees, grass & shrubs'
            : productionName}
        </Text>
        {productionArea ? (
          <Text style={styles.productionArea}>
            {productionArea}{' '}
            {user.land_measurement_symbol
              ? user.land_measurement_symbol
              : user.land_measurement}
          </Text>
        ) : null}
      </View>
      {progressBar ? (
        <>
          <Divider style={styles.divider} />
          <View style={styles.progressSection}>
            <Text style={styles.progressText}>100</Text>
            <View style={styles.progressBarView}>
              <Progress.Bar progress={0.3} width={50} color="green" />
            </View>
          </View>
        </>
      ) : null}
    </TouchableOpacity>
  );
};

export default CustomShowcaseInput;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      width: '90%',
      borderColor: 'grey',
      borderWidth: 1,
      borderRadius: 10,
      alignSelf: 'center',
      marginTop: '3%',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      marginBottom: '2%',
    },
    areaProduction: {
      // width: '70%',
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 10,
      margin: 10,
      alignSelf: 'center',
    },
    divider: {
      height: '70%',
      width: 2,
      borderRadius: 10,
      alignSelf: 'center',
      color: '#FFFFFF17',
    },
    productionName: {
      fontSize: 16 / fontScale,
      color: '#333',
      fontFamily: 'ubuntu_medium',
      textTransform: 'capitalize',
    },
    productionArea: {
      color: 'green',
      fontSize: 16 / fontScale,
      fontFamily: 'ubuntu_medium',
    },
    progressSection: {
      paddingHorizontal: 10,
      flexDirection: 'row',
    },
    progressBarView: {
      alignSelf: 'center',
    },
    progressText: {
      alignSelf: 'center',
      fontSize: 16 / fontScale,
      fontFamily: 'ubuntu_medium',
      color: 'green',
      padding: 5,
    },
  });
