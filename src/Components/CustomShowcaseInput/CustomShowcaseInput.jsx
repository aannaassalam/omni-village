import React from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import { Divider } from 'react-native-paper';
import * as Progress from 'react-native-progress';
import Input from '../Inputs/Input';

const CustomShowcaseInput = ({
  productionName,
  productionArea,
  progressBar,
  onPress,
  style,
  user,
  input,
  inputValue,
  setInputValue,
  isDrafted,
  id
}) => {
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        style,
        progressBar
          ? { justifyContent: 'space-evenly' }
          : { justifyContent: 'flex-start' },
      ]}>
      <View style={[styles.areaProduction, input? {paddingVertical:0}:{paddingVertical:10}]}>
        {input ?
          <TextInput
            onChangeText={(e) => setInputValue(e)}
            value={inputValue}
            noLabel={true}
            style={styles.inputContainer}
            placeholder={productionName}
            placeholderTextColor={'#000'}
          />
          :
          <Text style={styles.productionName}>
            {productionName === 'trees'
              ? 'trees, grass & shrubs'
              : productionName}
          </Text>
        }
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
      {isDrafted? 
        <Image source={require('../../../assets/drafted.png')} style={styles.arrow_right} />
        : id?<Image source={require('../../../assets/checked.png')} style={styles.arrow_right} />:null
    }
      {input ?<>
      <Image source={require('../../../assets/e4.png')} style={styles.arrow_right}/>
      </>:null}
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
      fontFamily: 'ubuntu-medium',
      textTransform: 'capitalize',
    },
    productionArea: {
      color: 'green',
      fontSize: 16 / fontScale,
      fontFamily: 'ubuntu-medium',
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
      fontFamily: 'ubuntu-medium',
      color: 'green',
      padding: 5,
    },
    inputContainer:{
      width: '100%',
      fontSize: 16 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu-medium',
      textTransform: 'capitalize',
    },
    arrow_right:{
      alignContent: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
      marginRight: '5%',
      height: 30,
      width: 30,
      resizeMode: 'contain',
    }
  });
