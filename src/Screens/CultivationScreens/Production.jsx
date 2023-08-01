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
import React, {useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput';
import CustomButton from '../../Components/CustomButton/CustomButton';

const Production = ({navigation, route}) => {
  const {totalLand, usedLand, data} = route.params;
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Production'}
        goBack={() => navigation.goBack()}
      />
      {/* top container for used and allocated land */}
      <View style={styles.top_container}>
        <View style={styles.top_container_inner}>
          <Text style={styles.land_allocated_text}>Land allocated</Text>
          <Text style={styles.value_text}>{totalLand} acres</Text>
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
          {data.map(item => {
            return (
              <CustomShowcaseInput
                productionName={item?.name}
                productionArea={`${item?.area} acres`}
                progressBar={true}
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
          <View style={styles.continue}>
            <CustomButton
              btnText={'Continue'}
              onPress={() => {
                navigation.navigate('landAllocation', {totalLand: totalLand});
              }}
            />
          </View>
        </>
      </ScrollView>
    </View>
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
    continue: {
      marginTop: '5%',
      width: '90%',
      alignSelf: 'center',
      marginBottom: '5%',
    },
  });
