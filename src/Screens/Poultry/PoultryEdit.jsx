import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import UtilisationAccordion from '../../Components/Accordion/UtilisationAccordion';
import InputLikeButton from '../../Components/CustomButton/InputLikeButton';
import moment from 'moment';
import PopupModal from '../../Components/Popups/PopupModal';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CalendarPicker from 'react-native-calendar-picker';
import {Divider} from 'react-native-paper';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import Toast from 'react-native-toast-message';
import {useTranslation} from 'react-i18next';
import '../../i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const PoultryEdit = ({navigation, route}) => {
  const {cropType, edit, cropId, data} = route.params;
  const {fontScale} = useWindowDimensions();
  const [message, setMessage] = useState('');
  const styles = makeStyles(fontScale);
  const {t} = useTranslation();
  const [harvestedPopup, setHarvestedPopup] = useState(false);
  const [harvestedDate, setHarvestedDate] = useState(
    edit
      ? data
        ? moment(edit?.month_harvested).format('YYYY-MM-DD')
        : new Date()
      : new Date(),
  );
  const [toggleCheckBox, setToggleCheckBox] = useState(
    edit ? (data ? (edit?.processing_method == true ? 'yes' : 'no') : '') : '',
  );
  const [output, setOutput] = useState(0);
  const [utilisationArray, setUtilisationArray] = useState([]);
  const [others, setOthers] = useState(0);
  let findme = utilisationArray.find(
    i => i?.name == t('Other(Specify if any)'),
  );
  const [savepopup, setSavepopup] = useState(false);
  const [draftpopup, setDraftpopup] = useState(false);
  useEffect(() => {
    if (edit) {
      setOthers(edit?.other_value);
      setOutput(edit?.production_output);
      setUtilisationArray([
        {name: t('self consumed'), value: edit?.self_consumed},
        {name: t('sold to neighbour'), value: edit?.sold_to_neighbours},
        {
          name: t('sold for industrial use'),
          value: edit?.sold_for_industrial_use,
        },
        {name: t('wastage'), value: edit?.wastage},
        {name: t('Other(Specify if any)'), value: edit?.other},
      ]);
    } else {
      setUtilisationArray([
        {name: t('self consumed'), value: 0},
        {name: t('sold to neighbour'), value: 0},
        {name: t('sold for industrial use'), value: 0},
        {name: t('wastage'), value: 0},
        {name: t('Other(Specify if any)'), value: ''},
      ]);
    }
  }, [edit]);
  // console.log("edit", edit)
  const submit = () => {
    if (!data) {
      let formData = {
        name: cropType,
        production_output: output,
        self_consumed: utilisationArray[0]?.value,
        sold_to_neighbours: utilisationArray[1]?.value,
        sold_for_industrial_use: utilisationArray[2]?.value,
        wastage: utilisationArray[3]?.value,
        other: utilisationArray[4]?.value,
        other_value: others,
        month_harvested: moment(harvestedDate).format('YYYY-MM-DD'),
        processing_method: toggleCheckBox === 'yes' ? true : false,
      };
      const totalAmount = utilisationArray.reduce((total, item) => {
        if (item.name.includes('Other')) {
          return total;
        }
        return total + parseInt(item?.value || 0);
      }, 0);
      let amount = parseInt(totalAmount) + parseInt(others || 0);
      let out = parseInt(output);
      if (output == '' || output == undefined) {
        setMessage(
          t('Output cannot be empty') + '/' + 'Output cannot be empty',
        );
        Toast.show({
          type: 'error',
          text1: t('Output cannot be empty') + '/' + 'Output cannot be empty',
        });
      } else if (amount !== out) {
        setMessage(
          t('Total amount should be equal to output') +
            '/' +
            'Total amount should be equal to output',
        );
        Toast.show({
          type: 'error',
          text1:
            t('Total amount should be equal to output') +
            '/' +
            'Total amount should be equal to output',
        });
      } else if (
        utilisationArray[0]?.value == 0 ||
        utilisationArray[0]?.value == undefined ||
        utilisationArray[1]?.value == '' ||
        utilisationArray[1]?.value == undefined ||
        utilisationArray[2]?.value == '' ||
        utilisationArray[2]?.value == undefined ||
        utilisationArray[3]?.value == '' ||
        utilisationArray[3]?.value == undefined ||
        (utilisationArray[4]?.value != '' &&
          utilisationArray[4]?.value != undefined &&
          (others == undefined || others == ''))
      ) {
        setMessage(
          t('All fields are required!') + '/' + 'All fields are required!',
        );
      } else {
        navigation.navigate('poultryType', {
          edit: formData,
          cropId: cropId,
          data: data,
        });
      }
    } else {
      // console.log("edit id", edit?._id)
      let formData = {
        name: cropType,
        _id: edit?._id,
        production_output: output,
        self_consumed: utilisationArray[0]?.value,
        // fed_to_livestock: utilisationArray[1]?.value,
        sold_to_neighbours: utilisationArray[1]?.value,
        sold_for_industrial_use: utilisationArray[2]?.value,
        wastage: utilisationArray[3]?.value,
        other: utilisationArray[4]?.value,
        other_value: others,
        month_harvested: moment(harvestedDate).format('YYYY-MM-DD'),
        processing_method: toggleCheckBox === 'yes' ? true : false,
      };
      const totalAmounts = utilisationArray.reduce((total, item) => {
        if (item.name.includes('Other')) {
          return total;
        }
        return total + parseInt(item?.value || 0);
      }, 0);
      let amounts = parseInt(totalAmounts) + parseInt(others || 0);
      let outs = parseInt(output);
      console.log(amounts, outs, 'oop');
      if (output == '' || output == undefined) {
        setMessage(
          t('Output cannot be empty') + '/' + 'Output cannot be empty',
        );
        Toast.show({
          type: 'error',
          text1: t('Output cannot be empty') + '/' + 'Output cannot be empty',
        });
      } else if (amounts !== outs) {
        setMessage(
          t('Total amount should be equal to output') +
            '/' +
            'Total amount should be equal to output',
        );
        Toast.show({
          type: 'error',
          text1:
            t('Total amount should be equal to output') +
            '/' +
            'Total amount should be equal to output',
        });
      } else if (
        utilisationArray[0]?.value == 0 ||
        utilisationArray[0]?.value == undefined ||
        utilisationArray[1]?.value == '' ||
        utilisationArray[1]?.value == undefined ||
        utilisationArray[2]?.value == '' ||
        utilisationArray[2]?.value == undefined ||
        utilisationArray[3]?.value == '' ||
        utilisationArray[3]?.value == undefined ||
        (utilisationArray[4]?.value != '' &&
          utilisationArray[4]?.value != undefined &&
          (others == undefined || others == ''))
      ) {
        setMessage(
          t('All fields are required!') + '/' + 'All fields are required!',
        );
      } else {
        navigation.navigate('poultryType', {
          edit: formData,
          cropId: cropId,
          data: data,
        });
      }
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        goBack={() => navigation.goBack()}
        headerName={cropType}
        backIcon={true}
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 20}}>
        <View style={[styles.utilisation_container, {marginTop: 10}]}>
          <View style={styles.container}>
            <InputWithoutBorder
              measureName={'kg'}
              productionName={t('output')}
              keyboardType="numeric"
              value={output == undefined ? output : output.toString()}
              onChangeText={e => {
                setOutput(e);
              }}
            />
            <View style={styles.innerInputView}>
              <Divider style={styles.divider2} />
              <View style={{width: '100%'}}>
                {utilisationArray?.map((item, index) => {
                  // console.log("typ", typeof item?.value)
                  return (
                    <>
                      <InputWithoutBorder
                        measureName={'kg'}
                        productionName={item?.name}
                        value={item?.value ? item?.value.toString() : ''}
                        keyboardType={
                          item?.name === t('Other(Specify if any)')
                            ? 'default'
                            : 'numeric'
                        }
                        multiline={false}
                        notRightText={
                          item?.name === t('Other(Specify if any)')
                            ? true
                            : false
                        }
                        onChangeText={e => {
                          let targetedArea = utilisationArray.findIndex(
                            lan => lan?.name == item?.name,
                          );
                          if (targetedArea !== -1) {
                            const updatedDataArray = [...utilisationArray];
                            if (targetedArea === 4) {
                              updatedDataArray[targetedArea].value = e;
                              setUtilisationArray(updatedDataArray);
                            } else {
                              updatedDataArray[targetedArea].value =
                                parseInt(e);
                              setUtilisationArray(updatedDataArray);
                            }
                          }
                        }}
                      />
                      {index == 4 && findme?.value !== '' ? (
                        <View style={styles.innerInputView}>
                          <Divider style={styles.divider2} />
                          <View style={{width: '100%'}}>
                            <InputWithoutBorder
                              measureName={'kg'}
                              productionName={findme?.value}
                              value={
                                others == undefined ? others : others.toString()
                              }
                              onChangeText={e => {
                                setOthers(e),
                                  console.log('othersssssss', others);
                              }}
                            />
                          </View>
                        </View>
                      ) : null}
                    </>
                  );
                })}
              </View>
            </View>
          </View>
        </View>
        {/* Harvest date */}
        <View
          style={[
            styles.utilisation_container,
            {width: '93%', alignSelf: 'center', marginTop: 2},
          ]}>
          <InputLikeButton
            text={t('month harvested')}
            rightIcon={true}
            calendarPress={() => {
              setHarvestedPopup(true);
            }}
            date={moment(harvestedDate).format('MMMM DD,YYYY')}
          />
          <Divider style={styles.divider} />
          <Text style={styles.processing_text}>{t('required processing')}</Text>
          <View style={styles.processing_container}>
            <TouchableOpacity onPress={() => setToggleCheckBox('yes')}>
              {toggleCheckBox === 'yes' ? (
                <Image
                  source={require('../../../assets/checked.png')}
                  style={{height: 30, width: 30}}
                />
              ) : (
                <Image
                  source={require('../../../assets/unchecked.png')}
                  style={{height: 30, width: 30}}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.yes_text}>{t('yes')}</Text>
            <TouchableOpacity onPress={() => setToggleCheckBox('no')}>
              {toggleCheckBox === 'no' ? (
                <Image
                  source={require('../../../assets/checked.png')}
                  style={{height: 30, width: 30}}
                />
              ) : (
                <Image
                  source={require('../../../assets/unchecked.png')}
                  style={{height: 30, width: 30}}
                />
              )}
            </TouchableOpacity>
            <Text style={styles.yes_text}>{t('no')}</Text>
          </View>
        </View>
        {message && (
          <Text style={{color: 'red', fontSize: 16, alignSelf: 'center'}}>
            {message}
          </Text>
        )}
        <View style={styles.bottomPopupbutton}>
          <CustomButton
            style={styles.submitButton}
            btnText={t('submit')}
            onPress={() => {
              // setSavepopup(true) ,
              submit();
            }}
          />
          {/* <CustomButton
                        style={styles.draftButton}
                        btnText={'Save as draft'}
                        onPress={() => { setDraftpopup(true) }}
                    /> */}
        </View>
      </KeyboardAwareScrollView>
      {/* harvest popup */}
      <PopupModal
        modalVisible={harvestedPopup}
        setBottomModalVisible={setHarvestedPopup}
        styleInner={styles.savePopup}>
        <View>
          <CalendarPicker
            onDateChange={date => setHarvestedDate(date)}
            initialDate={moment(edit?.month_harvested).format('YYYY-MM-DD')}
          />
          <CustomButton
            btnText={'Done'}
            onPress={() => setHarvestedPopup(false)}
            style={styles.popupButton}
          />
        </View>
      </PopupModal>
      {/* submit popup */}
      <PopupModal
        modalVisible={savepopup}
        setBottomModalVisible={setSavepopup}
        styleInner={[styles.savePopup, {width: '90%'}]}>
        <View style={styles.submitPopup}>
          <View style={styles.noteImage}>
            <Image
              source={require('../../../assets/note.png')}
              style={styles.noteImage}
            />
          </View>
          <Text style={styles.confirmText}>{t('confirm')}</Text>
          <Text style={styles.nextText}>
            {t('lorem ipsum is simply dummy text of the.Lorem Ipsum.')}
          </Text>
          <View style={styles.bottomPopupbutton}>
            <CustomButton
              style={styles.submitButton}
              btnText={t('submit')}
              onPress={() => {
                setSavepopup(false), navigation.goBack();
              }}
            />
            <CustomButton
              style={styles.draftButton}
              btnText={t('cancel')}
              onPress={() => {
                setSavepopup(false), navigation.goBack();
              }}
            />
          </View>
        </View>
      </PopupModal>
      <Toast
        positionValue={30}
        style={{height: 'auto', minHeight: 70}}
        width={300}
      />
    </SafeAreaView>
  );
};

export default PoultryEdit;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    utilisation_container: {
      // marginTop:1
    },
    savePopup: {
      justifyContent: 'center',
      width: '97%',
      borderRadius: 20,
    },
    popupButton: {
      width: '70%',
      alignSelf: 'center',
    },
    divider: {
      alignSelf: 'center',
      height: 1,
      width: '98%',
      marginTop: '5%',
      color: 'grey',
    },
    divider2: {
      alignSelf: 'flex-start',
      height: '100%',
      marginTop: 9,
      width: '1%',
      borderRadius: 10,
    },
    processing_container: {
      flexDirection: 'row',
      paddingHorizontal: 10,
      marginBottom: 10,
    },
    processing_text: {
      fontSize: 14 / fontScale,
      fontFamily: 'ubuntu-medium',
      textAlign: 'left',
      color: '#000',
      marginTop: 10,
      padding: 10,
    },
    yes_text: {
      alignSelf: 'center',
      paddingHorizontal: 10,
      color: '#000',
      fontSize: 14 / fontScale,
      fontFamily: 'ubuntu-medium',
    },
    bottomPopupbutton: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-between',
      marginTop: '5%',
    },
    submitButton: {
      width: '93%',
      margin: 10,
    },
    draftButton: {
      width: '45%',
      margin: 10,
      backgroundColor: 'grey',
    },
    confirmText: {
      alignSelf: 'center',
      fontSize: 18 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu-medium',
      fontWeight: '500',
      padding: 10,
      textAlign: 'center',
    },
    nextText: {
      alignSelf: 'center',
      fontSize: 18 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu',
      textAlign: 'center',
    },
    submitPopup: {
      alignItems: 'center',
      padding: 10,
    },
    noteImage: {
      padding: 10,
    },
    innerInputView: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-between',
      width: '95%',
      marginBottom: '5%',
    },
  });
