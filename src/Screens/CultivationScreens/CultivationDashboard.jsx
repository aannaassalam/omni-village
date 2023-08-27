import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Divider} from 'react-native-paper';
import {Box, Button} from '@react-native-material/core';
import CustomButton from '../../Components/CustomButton/CustomButton';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import BottomModal from '../../Components/BottomSheet/BottomModal';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import {BlurView} from '@react-native-community/blur';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {setCultivationType, setSeason} from '../../Redux/CultivationSlice';

const CultivationDashboard = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  // const {totalLand = 20} = route.params;
  const {userDetails} = useSelector(s => s.auth);
  const totalLand = userDetails?.totalLand;
  const dispatch = useDispatch();
  const [modify, setModify] = useState(false);
  const [focus, setFocus] = useState(false);

  const [cultivation, setCultivation] = useState([
    {name: 'Cultivated once in a year', area: 0},
    {name: 'Cultivated twice in a year', area: 0},
    {name: 'Cultivated thrice in a year', area: 0},
  ]);
  const onSave = () => {
    let sumofAreas = cultivation.reduce((accumulator, currentObject) => {
      return accumulator + currentObject?.area;
    }, 0);
    if (sumofAreas > totalLand) {
      alert('Your  cultivation area acres are greater than total land area');
    } else {
      navigation.navigate('cultivationDashboard', {totalLand: totalLand});
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Cultivation'}
        goBack={() => navigation.goBack()}
      />
      <CustomDashboard first={'production'} second={'cultivation'} />
      {/* land allocated and modify section */}
      <View style={styles.secondTopContainer}>
        <View style={styles.secondTopContainerInner}>
          <Text style={[styles.acresText]}>Land allocated for</Text>
          <Text
            style={[
              styles.acresText,
              {color: '#000', alignSelf: 'flex-start', marginTop: 5},
            ]}>
            Cultivation
          </Text>
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.acresText}>10 acres</Text>
        <CustomButton
          btnText={'Modify'}
          style={styles.modifyButton}
          onPress={() => setModify(!modify)}
        />
      </View>
      {/* options */}
      <View style={styles.optionsContainer}>
        {/* once in a year */}
        <TouchableOpacity
          onPress={() => {
            dispatch(setSeason(1));
            dispatch(setCultivationType(1))
              .unwrap()
              .then(() => {
                navigation.navigate('season1');
              });
          }}>
          <Box style={styles.home_box}>
            <Box style={styles.home_box_lft_upr}>
              <Text variant="h3" style={styles.hme_box_txt}>
                Cultivation Once in a year
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
        {/* twice in a year */}
        <TouchableOpacity
          onPress={() => {
            dispatch(setCultivationType(2))
              .unwrap()
              .then(() => {
                navigation.navigate('cultivationTwice');
              });
          }}>
          <Box style={[styles.home_box, {borderColor: '#E5C05E'}]}>
            <Box style={styles.exclamationMark}>
              <Image
                style={styles.tinyIcon2}
                source={require('../../../assets/infocircle.png')}
                // height={100}
              />
            </Box>
            <Box style={styles.home_box_lft_upr}>
              <Text variant="h3" style={styles.hme_box_txt2}>
                Cultivation twice in a year
              </Text>
            </Box>
            <Box style={styles.hme_box_rgt}>
              <Image
                style={styles.tinyIcon}
                source={require('../../../assets/e6.png')}
                // height={100}
              />
            </Box>
          </Box>
        </TouchableOpacity>
        {/* thrice in a year */}
        <TouchableOpacity
          onPress={() => {
            dispatch(setCultivationType(3))
              .unwrap()
              .then(() => {
                navigation.navigate('cultivationThrice');
              });
          }}>
          <Box style={[styles.home_box, {borderColor: 'grey'}]}>
            <Box style={styles.home_box_lft_upr}>
              <Text variant="h3" style={styles.hme_box_txt2}>
                Cultivation thrice in a year
              </Text>
            </Box>
            <Box style={styles.hme_box_rgt}>
              <Image
                style={styles.tinyIcon}
                source={require('../../../assets/e5.png')}
                // height={100}
              />
            </Box>
          </Box>
        </TouchableOpacity>
      </View>
      <View style={styles.save}>
        {/* <CustomButton
          btnText={'Continue'}
          onPress={() => {
            // onSave();
          }}
        /> */}
      </View>
      <BottomModal
        modalVisible={modify}
        setModalVisible={setModify}
        styleInner={{height: focus ? '83%' : '50%'}}>
        <View style={styles.BottomTopContainer}>
          <Text style={styles.headerText}>Land Allocation</Text>
          <TouchableOpacity
            onPress={() => {
              setModify(!modify);
              setFocus(false);
            }}>
            <Image
              source={require('../../../assets/close.png')}
              style={styles.closeIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.textInputArea}>
          {cultivation.map((item, indx) => {
            return (
              <InputWithoutBorder
                productionName={item?.name}
                placeholder={'0'}
                value={item?.area}
                key={indx}
                onChangeText={e => {
                  let targetedArea = cultivation.findIndex(
                    lan => lan?.name == item?.name,
                  );
                  if (targetedArea !== -1) {
                    const updatedDataArray = [...cultivation];
                    updatedDataArray[targetedArea].area = parseInt(e);
                    setCultivation(updatedDataArray);
                  }
                }}
                onFocus={() => setFocus(true)}
              />
            );
          })}
        </View>
        <View style={styles.BottomSheetButton}>
          <TouchableOpacity
            style={styles.crossButton}
            onPress={() => setModify(!modify)}>
            <Image
              source={require('../../../assets/cross.png')}
              style={{width: 50, height: 50}}
            />
          </TouchableOpacity>
          <CustomButton
            btnText={'Modify'}
            style={{width: '80%'}}
            onPress={() => setModify(!modify)}
          />
        </View>
      </BottomModal>
    </SafeAreaView>
  );
};

export default CultivationDashboard;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    topContainer: {
      padding: 20,
      margin: 10,
      alignSelf: 'center',
      justifyContent: 'flex-start',
      flexDirection: 'row',
      backgroundColor: '#D9D9D9',
      width: '90%',
      borderRadius: 5,
    },
    topText: {
      fontSize: 14 / fontScale,
      color: '#576A74',
      fontFamily: 'ubuntu_medium',
      width: '25%',
      marginLeft: 5,
    },
    arrow: {
      alignSelf: 'center',
      height: 10,
      width: 8,
    },
    secondTopContainer: {
      marginTop: 10,
      flexDirection: 'row',
      alignSelf: 'center',
      backgroundColor: '#d4e8d9',
      width: '90%',
      borderRadius: 10,
      padding: 5,
      justifyContent: 'space-around',
    },
    secondTopContainerInner: {
      padding: 10,
    },
    divider: {
      alignSelf: 'center',
      height: 40,
      width: '1%',
      marginTop: 5,
      color: 'grey',
    },
    acresText: {
      alignSelf: 'center',
      fontFamily: 'ubuntu_medium',
      color: 'green',
      fontSize: 14 / fontScale,
    },
    modifyButton: {
      height: 35,
      alignSelf: 'center',
      padding: 5,
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
    BottomTopContainer: {
      justifyContent: 'space-between',
      alignSelf: 'flex-start',
      margin: 10,
      padding: 5,
      flexDirection: 'row',
    },
    headerText: {
      fontFamily: 'ubuntu_medium',
      fontSize: 16 / fontScale,
      color: '#000',
      alignSelf: 'center',
      width: '90%',
    },
    closeIcon: {
      height: 30,
      width: 30,
      alignSelf: 'center',
    },
    textInputArea: {
      alignSelf: 'center',
      width: '95%',
    },
    BottomSheetButton: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: '5%',
      padding: 10,
      margin: 5,
      alignSelf: 'center',
    },
    crossButton: {
      marginRight: 10,
    },
    save: {
      marginTop: '5%',
      width: '90%',
      position: 'absolute',
      bottom: 10,
      alignSelf: 'center',
    },
    tinyIcon2: {
      // position: 'absolute',
      height: 20,
      width: 20,
      // top: 0,
      // left: 0,
    },
  });
