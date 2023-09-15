import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, {useCallback} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import {Box, Button} from '@react-native-material/core';
import {useFocusEffect} from '@react-navigation/native';
import {getFisheryCrops} from '../../Redux/FisheryCropSlice';
import {useDispatch, useSelector} from 'react-redux';
import CustomDashboard2 from '../../Components/CustomDashboard/CustomDashboard2';

const Index = ({navigation, route}) => {
  // const { totalLand } = route.params;
  const {user} = useSelector(state => state.auth);
  const {fontScale} = useWindowDimensions();
  const dispatch = useDispatch();
  const styles = makeStyles(fontScale);
  useFocusEffect(
    useCallback(() => {
      dispatch(getFisheryCrops());
    }, []),
  );
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Fishery'}
        goBack={() => navigation.goBack()}
      />
      <CustomDashboard first={'Production'} second={'Fishery'} />
      <CustomDashboard2
        allocatedFor="Fishery"
        usedLand={user.sub_area.fishery}
      />
      <View style={styles.optionsContainer}>
        {/* Harvested From Pond */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('fishery', {screenName: 'Harvested From Pond'})
          }>
          <Box style={styles.home_box}>
            <Box style={styles.home_box_lft_upr}>
              <Text variant="h3" style={styles.hme_box_txt}>
                Harvested From Pond
              </Text>
            </Box>
            <Box style={styles.hme_box_rgt}>
              <Image
                style={styles.tinyIcon}
                source={require('../../../assets/e4.png')}
                // height={100}
              />
            </Box>
          </Box>
        </TouchableOpacity>
        {/*  Harvested From River */}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('fisheryRiver', {
              screenName: 'Harvested From River',
            })
          }>
          <Box style={[styles.home_box]}>
            {/* <Box style={styles.exclamationMark}>
              <Image
                style={styles.tinyIcon2}
                source={require('../../../assets/infocircle.png')}
              />
            </Box> */}
            <Box style={styles.home_box_lft_upr}>
              <Text variant="h3" style={styles.hme_box_txt}>
                Harvested From River/Lake/Ocean
              </Text>
            </Box>
            <Box style={styles.hme_box_rgt}>
              <Image
                style={styles.tinyIcon}
                source={require('../../../assets/e4.png')}
              />
            </Box>
          </Box>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Index;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    optionsContainer: {
      alignSelf: 'center',
      width: '90%',
      marginTop: '5%',
    },
    home_box: {
      borderRadius: 8,
      borderWidth: 1,
      borderColor: '#268C43',
      paddingVertical: 20,
      paddingLeft: 5,
      paddingRight: 20,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '100%',
      marginBottom: 16,
      alignSelf: 'center',
    },
    home_box_lft_upr: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 10,
    },
    hme_box_txt: {
      color: '#268C43',
      fontSize: 16 / fontScale,
      fontWeight: '500',
      marginLeft: 20,
    },
    hme_box_txt2: {
      color: '#263238',
      fontSize: 16 / fontScale,
      fontWeight: '500',
      marginLeft: 20,
    },
    exclamationMark: {
      position: 'absolute',
      right: 6,
      top: 5,
    },
    tinyIcon2: {
      // position: 'absolute',
      height: 20,
      width: 20,
      // top: 0,
      // left: 0,
    },
  });
