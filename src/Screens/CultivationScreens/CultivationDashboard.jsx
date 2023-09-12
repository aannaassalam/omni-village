import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Text,
  Modal,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Divider} from 'react-native-paper';
import {Box, Button} from '@react-native-material/core';
import CustomButton from '../../Components/CustomButton/CustomButton';
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import {BlurView} from '@react-native-community/blur';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useDispatch, useSelector} from 'react-redux';
import {setCultivationType, setSeason} from '../../Redux/CultivationSlice';
import * as yup from 'yup';
import {yupResolver} from '@hookform/resolvers/yup';
import {Controller, useForm} from 'react-hook-form';
import Toast from 'react-native-toast-message';
import {cultivationLandAllocation, getUser} from '../../Redux/AuthSlice';

const CultivationDashboard = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  // const {totalLand = 20} = route.params;
  const {userDetails} = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [modify, setModify] = useState(false);
  const [focus, setFocus] = useState(false);
  const [globalError, setGobalError] = useState('');

  yup.addMethod(yup.object, 'atLeastOneOf', function (list) {
    return this.test({
      name: 'Validation Error',
      message: 'Atleast one the field is required!',
      exclusive: true,
      params: {keys: list.join(', ')},
      test: value => list.some(f => value[f] !== '0' && value[f] !== ''),
    });
  });

  const schema = yup
    .object()
    .shape({
      once: yup.mixed(),
      twice: yup.mixed(),
      thrice: yup.mixed(),
    })
    .atLeastOneOf(['once', 'twice', 'thrice']);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      once: String(userDetails.sub_area.cultivation.distribution.once || 0),
      twice: String(userDetails.sub_area.cultivation.distribution.twice || 0),
      thrice: String(userDetails.sub_area.cultivation.distribution.thrice || 0),
    },
  });

  const onSave = async data => {
    try {
      console.log(data, 'asd');
      await schema.validate(data);
      dispatch(cultivationLandAllocation(data))
        .unwrap()
        .then(() => {
          dispatch(getUser())
            .unwrap()
            .then(() => {
              setModify(false);
            })
            .catch(err => console.log(err));
        })
        .catch(err => {
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: 'Something went wrong, Try again later!',
          });
          console.log(err);
        });
    } catch (err) {
      console.log(err, 'err');
    }
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setGobalError(errors[''].message);
    }
  }, [errors]);

  console.log(userDetails.sub_area.cultivation.distribution);

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
          <Text style={[styles.acresText, {flex: 0}]}>Land allocated for</Text>
          <Text
            style={[
              styles.acresText,
              {color: '#000', alignSelf: 'flex-start', marginTop: 5, flex: 0},
            ]}>
            Cultivation
          </Text>
        </View>
        <Divider style={styles.divider} />
        <Text style={styles.acresText}>
          {userDetails.sub_area.cultivation.land}{' '}
          {userDetails.land_measurement_symbol !== '-'
            ? userDetails.land_measurement_symbol
            : userDetails.land_measurement}
        </Text>
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
            if (userDetails.sub_area.cultivation.distribution.once > 0) {
              dispatch(setSeason(1));
              dispatch(setCultivationType(1))
                .unwrap()
                .then(() => {
                  navigation.navigate('season1', {seasonNmae: 'Season 1'});
                });
            } else {
              setGobalError('No Land Allocated for Cultivated once in a year');
            }
          }}>
          <Box
            style={[
              styles.home_box,
              !userDetails.sub_area.cultivation.distribution.once ||
              userDetails.sub_area.cultivation.distribution.once === ''
                ? {borderColor: 'grey'}
                : {},
            ]}>
            <Box style={styles.home_box_lft_upr}>
              <Text
                variant="h3"
                style={
                  !userDetails.sub_area.cultivation.distribution.once ||
                  userDetails.sub_area.cultivation.distribution.once === ''
                    ? styles.hme_box_txt2
                    : styles.hme_box_txt
                }>
                Cultivation once in a year
              </Text>
            </Box>
            <Box style={styles.hme_box_rgt}>
              <Image
                style={styles.tinyIcon}
                source={
                  !userDetails.sub_area.cultivation.distribution.once ||
                  userDetails.sub_area.cultivation.distribution.once === ''
                    ? require('../../../assets/e5.png')
                    : require('../../../assets/e4.png')
                }
                // height={100}
              />
            </Box>
          </Box>
        </TouchableOpacity>
        {/* twice in a year */}
        <TouchableOpacity
          onPress={() => {
            if (userDetails.sub_area.cultivation.distribution.twice > 0) {
              dispatch(setCultivationType(2))
                .unwrap()
                .then(() => {
                  navigation.navigate('cultivationTwice');
                });
            } else {
              setGobalError('No Land Allocated for Cultivated twice in a year');
            }
          }}>
          <Box
            style={[
              styles.home_box,
              !userDetails.sub_area.cultivation.distribution.twice ||
              userDetails.sub_area.cultivation.distribution.twice === ''
                ? {borderColor: 'grey'}
                : {},
            ]}>
            {/* <Box style={styles.exclamationMark}>
              <Image
                style={styles.tinyIcon2}
                source={require('../../../assets/infocircle.png')}
                // height={100}
              />
            </Box> */}
            <Box style={styles.home_box_lft_upr}>
              <Text
                variant="h3"
                style={
                  !userDetails.sub_area.cultivation.distribution.twice ||
                  userDetails.sub_area.cultivation.distribution.twice === ''
                    ? styles.hme_box_txt2
                    : styles.hme_box_txt
                }>
                Cultivation twice in a year
              </Text>
            </Box>
            <Box style={styles.hme_box_rgt}>
              <Image
                style={styles.tinyIcon}
                source={
                  !userDetails.sub_area.cultivation.distribution.twice ||
                  userDetails.sub_area.cultivation.distribution.twice === ''
                    ? require('../../../assets/e5.png')
                    : require('../../../assets/e4.png')
                }
                // height={100}
              />
            </Box>
          </Box>
        </TouchableOpacity>
        {/* thrice in a year */}
        <TouchableOpacity
          onPress={() => {
            if (userDetails.sub_area.cultivation.distribution.thrice > 0) {
              dispatch(setCultivationType(3))
                .unwrap()
                .then(() => {
                  navigation.navigate('cultivationThrice');
                });
            } else {
              setGobalError('No Land Allocated for Cultivated once in a year');
            }
          }}>
          <Box
            style={[
              styles.home_box,
              !userDetails.sub_area.cultivation.distribution.thrice ||
              userDetails.sub_area.cultivation.distribution.thrice === ''
                ? {borderColor: 'grey'}
                : {},
            ]}>
            <Box style={styles.home_box_lft_upr}>
              <Text
                variant="h3"
                style={
                  !userDetails.sub_area.cultivation.distribution.thrice ||
                  userDetails.sub_area.cultivation.distribution.thrice === ''
                    ? styles.hme_box_txt2
                    : styles.hme_box_txt
                }>
                Cultivation thrice in a year
              </Text>
            </Box>
            <Box style={styles.hme_box_rgt}>
              <Image
                style={styles.tinyIcon}
                source={
                  !userDetails.sub_area.cultivation.distribution.thrice ||
                  userDetails.sub_area.cultivation.distribution.thrice === ''
                    ? require('../../../assets/e5.png')
                    : require('../../../assets/e4.png')
                }
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
      {modify && (
        <AddBottomSheet>
          <View style={styles.BottomTopContainer}>
            <Text style={styles.headerText}>Land Allocation</Text>
            <TouchableOpacity
              onPress={() => {
                setModify(!modify);
                reset({
                  once: String(
                    userDetails.sub_area.cultivation.distribution.once || 0,
                  ),
                  twice: String(
                    userDetails.sub_area.cultivation.distribution.twice || 0,
                  ),
                  thrice: String(
                    userDetails.sub_area.cultivation.distribution.thrice || 0,
                  ),
                });
                setFocus(false);
              }}>
              <Image
                source={require('../../../assets/close.png')}
                style={styles.closeIcon}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.textInputArea}>
            {/* {cultivation.map((item, indx) => {
            return ( */}
            <Controller
              control={control}
              name="once"
              render={({field}) => {
                const {onChange, value} = field;
                return (
                  <InputWithoutBorder
                    productionName="Cultivated once in a year"
                    placeholder={'0'}
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocus(true)}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="twice"
              render={({field}) => {
                const {onChange, value} = field;
                return (
                  <InputWithoutBorder
                    productionName="Cultivated twice in a year"
                    placeholder={'0'}
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocus(true)}
                  />
                );
              }}
            />
            <Controller
              control={control}
              name="thrice"
              render={({field}) => {
                const {onChange, value} = field;
                return (
                  <InputWithoutBorder
                    productionName="Cultivated once in a year"
                    placeholder={'0'}
                    value={value}
                    onChangeText={onChange}
                    onFocus={() => setFocus(true)}
                  />
                );
              }}
            />
            {/* //   );
          // })} */}
            <Text
              style={{
                fontFamily: 'ubuntu_regular',
                fontSize: 14 / fontScale,
                marginTop: 5,
                color: '#ff000e',
                marginLeft: 5,
              }}>
              {globalError}
            </Text>
          </View>
          <View style={styles.BottomSheetButton}>
            <TouchableOpacity
              style={styles.crossButton}
              onPress={() => {
                setModify(!modify);
                reset({
                  once: String(
                    userDetails.sub_area.cultivation.distribution.once || 0,
                  ),
                  twice: String(
                    userDetails.sub_area.cultivation.distribution.twice || 0,
                  ),
                  thrice: String(
                    userDetails.sub_area.cultivation.distribution.thrice || 0,
                  ),
                });
              }}>
              <Image
                source={require('../../../assets/cross.png')}
                style={{width: 50, height: 50}}
              />
            </TouchableOpacity>
            <CustomButton
              btnText={'Modify'}
              style={{width: '80%'}}
              onPress={handleSubmit(onSave)}
            />
          </View>
        </AddBottomSheet>
      )}
      <Toast
        positionValue={30}
        style={{height: 'auto', minHeight: 70}}
        width={300}
      />
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
      paddingHorizontal: 10,
      justifyContent: 'space-around',
    },
    secondTopContainerInner: {
      padding: 10,
      paddingLeft: 3,
      // paddingVertical: 7,
    },
    divider: {
      alignSelf: 'center',
      height: 40,
      width: '1%',
      marginTop: 5,
      color: 'grey',
      marginRight: 10,
    },
    acresText: {
      alignSelf: 'center',
      fontFamily: 'ubuntu_medium',
      color: 'green',
      fontSize: 14 / fontScale,
      flex: 1,
      flexWrap: 'wrap',
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
