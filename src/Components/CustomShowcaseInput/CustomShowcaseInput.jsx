import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import {Divider} from 'react-native-paper';
import * as Progress from 'react-native-progress';

const CustomShowcaseInput = ({productionName, productionArea, progressBar}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View
      style={[
        styles.container,
        progressBar
          ? {justifyContent: 'space-evenly'}
          : {justifyContent: 'flex-start'},
      ]}>
      <View style={styles.areaProduction}>
        <Text style={styles.productionName}>{productionName}</Text>
        <Text style={styles.productionArea}>{productionArea}</Text>
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
    </View>
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
      marginTop: '5%',
      justifyContent: 'flex-start',
      flexDirection: 'row',
    },
    areaProduction: {
      width: '70%',
      paddingHorizontal: 20,
      paddingVertical: 5,
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
      color: '#000',
      fontFamily: 'ubuntu_medium',
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
