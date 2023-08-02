import {StyleSheet, Text, View, Image, useWindowDimensions} from 'react-native';
import React, {useState} from 'react';
import CustomDropdown3 from '../CustomDropdown/CustomDropdown3';
import {fertilisers, pesticides, soilHealth} from '../../MockData/Mockdata';
import {Divider} from 'react-native-paper';
import InputWithoutBorder from '../CustomInputField/InputWithoutBorder';
import InputLikeButton from '../CustomButton/InputLikeButton';
import moment from 'moment';
import PopupModal from '../Popups/PopupModal';
import CalendarPicker from 'react-native-calendar-picker';
import CustomButton from '../CustomButton/CustomButton';

const ImportantInformation = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [soilHeal, setSoilHeal] = useState('');
  const [fertili, setFertili] = useState('');
  const [pesti, setPesti] = useState('');
  const [income, setIncome] = useState('');
  const [expenditure, setExpenditure] = useState('');
  const [proccessing, setProccessing] = useState(true);
  const [popup, setPopup] = useState(false);
  const [harvestedPopup, setHarvestedPopup] = useState(false);
  const [savepopup, setSavepopup] = useState(false);
  const [draftpopup, setDraftpopup] = useState(false);
  const [harvestedDate, setHarvestedDate] = useState(new Date());
  const [plantedDate, setplantedDate] = useState(new Date());

  return (
    <View style={styles.container}>
      <CustomDropdown3
        data={soilHealth}
        selectedValue={e => setSoilHeal(e)}
        infoName={'Soil Health'}
      />
      {soilHeal === 'Decreasing Yield' && (
        <View style={styles.innerInputView}>
          <Divider style={styles.divider} />
          <View style={{width: '100%'}}>
            <InputWithoutBorder
              measureName={'%'}
              productionName={'how much from first planting'}
              value={'10'}
              onChangeText={e => {}}
            />
          </View>
        </View>
      )}
      <CustomDropdown3
        data={fertilisers}
        selectedValue={e => setFertili(e)}
        infoName={'Type of fertiliser used'}
      />
      <CustomDropdown3
        data={pesticides}
        selectedValue={e => setPesti(e)}
        infoName={'Type of pesticides used'}
      />
      <InputWithoutBorder
        measureName={'USD'}
        productionName={'Income from sale'}
        value={income}
        onChangeText={e => {
          setIncome(e);
        }}
      />
      <InputWithoutBorder
        measureName={'USD'}
        productionName={'Expenditure on inputs'}
        value={expenditure}
        onChangeText={e => {
          setExpenditure(e);
        }}
      />
      <InputLikeButton
        text={'Proccessing Method'}
        onPress={() => setProccessing(!proccessing)}
      />
      {proccessing && (
        <View style={styles.innerInputView}>
          <Divider style={styles.divider} />
          <View style={{width: '100%'}}>
            <InputWithoutBorder
              notRightText={true}
              productionName={'Description'}
              value={'Lorem ipsum'}
              multiline={true}
              onChangeText={e => {}}
            />
          </View>
        </View>
      )}
      <InputWithoutBorder
        measureName={'acres'}
        productionName={'Yeild'}
        value={'10'}
        editable={true}
      />
      <InputLikeButton
        text={'Month Planted'}
        rightIcon={true}
        calendarPress={() => setPopup(true)}
        date={moment(plantedDate).format('MMMM DD,YYYY')}
      />
      <InputLikeButton
        text={'Month Harvested'}
        rightIcon={true}
        calendarPress={() => setHarvestedPopup(true)}
        date={moment(harvestedDate).format('MMMM DD,YYYY')}
      />
      <View style={styles.bottomPopupbutton}>
        <CustomButton
          style={styles.submitButton}
          btnText={'Submit'}
          onPress={() => setSavepopup(true)}
        />
        <CustomButton
          style={styles.draftButton}
          btnText={'Save as draft'}
          onPress={() => setDraftpopup(true)}
        />
      </View>
      {/* planted popup */}
      <PopupModal
        modalVisible={popup}
        setBottomModalVisible={setPopup}
        styleInner={styles.savePopup}>
        <View>
          <CalendarPicker onDateChange={date => setplantedDate(date)} />
          <CustomButton
            btnText={'Done'}
            onPress={() => setPopup(false)}
            style={styles.popupButton}
          />
        </View>
      </PopupModal>
      {/* harvested popup */}
      <PopupModal
        modalVisible={harvestedPopup}
        setBottomModalVisible={setHarvestedPopup}
        styleInner={styles.savePopup}>
        <View>
          <CalendarPicker onDateChange={date => setHarvestedDate(date)} />
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
          <Text style={styles.confirmText}>Confirm</Text>
          <Text style={styles.nextText}>
            Lorem Ipsum is simply dummy text of the.Lorem Ipsum.
          </Text>
          <View style={styles.bottomPopupbutton}>
            <CustomButton
              style={styles.submitButton}
              btnText={'Submit'}
              onPress={() => {
                setSavepopup(false), navigation.goBack();
              }}
            />
            <CustomButton
              style={styles.draftButton}
              btnText={'Cancel'}
              onPress={() => {
                setSavepopup(false), navigation.goBack();
              }}
            />
          </View>
        </View>
      </PopupModal>
      {/* draft popup */}
      <PopupModal
        modalVisible={draftpopup}
        setBottomModalVisible={setDraftpopup}
        styleInner={[styles.savePopup, {width: '90%'}]}>
        <View style={styles.submitPopup}>
          <View style={styles.noteImage}>
            <Image
              source={require('../../../assets/note.png')}
              style={styles.noteImage}
            />
          </View>
          <Text style={styles.confirmText}>Save as Draft</Text>
          <Text style={styles.nextText}>
            Lorem Ipsum is simply dummy text of the.Lorem Ipsum.
          </Text>
          <View style={styles.bottomPopupbutton}>
            <CustomButton
              style={styles.submitButton}
              btnText={'Save'}
              onPress={() => setDraftpopup(false)}
            />
            <CustomButton
              style={styles.draftButton}
              btnText={'Cancel'}
              onPress={() => setDraftpopup(false)}
            />
          </View>
        </View>
      </PopupModal>
    </View>
  );
};

export default ImportantInformation;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      width: '93%',
      alignSelf: 'center',
      marginBottom: '5%',
    },
    divider: {
      // backgroundColor: 'grey',
      alignSelf: 'flex-start',
      height: '100%',
      marginTop: 9,
      width: '1%',
      borderRadius: 10,
    },
    innerInputView: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-between',
      width: '95%',
      marginBottom: '5%',
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
    bottomPopupbutton: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-between',
      marginTop: '5%',
    },
    submitButton: {
      width: '45%',
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
      fontFamily: 'ubuntu_medium',
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
  });
