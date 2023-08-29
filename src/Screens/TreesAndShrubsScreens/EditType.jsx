import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import UtilisationAccordion from '../../Components/Accordion/UtilisationAccordion'
import InputLikeButton from '../../Components/CustomButton/InputLikeButton'
import moment from 'moment'
import PopupModal from '../../Components/Popups/PopupModal'
import CustomButton from '../../Components/CustomButton/CustomButton'
import CalendarPicker from 'react-native-calendar-picker';
import { Divider } from 'react-native-paper'
import CheckBox from '@react-native-community/checkbox';

const EditType = ({ navigation, route }) => {
  const { cropType } = route.params
  const { fontScale } = useWindowDimensions()
  const styles = makeStyles(fontScale);
  const [harvestedPopup, setHarvestedPopup] = useState(false);
  const [harvestedDate, setHarvestedDate] = useState(new Date());
  const [toggleCheckBox, setToggleCheckBox] = useState('')
  const [savepopup, setSavepopup] = useState(false);
  const [draftpopup, setDraftpopup] = useState(false);

  return (
    <View style={styles.container}>
      <CustomHeader
        goBack={() => navigation.goBack()}
        headerName={cropType}
        backIcon={true}
      />
      <ScrollView>
        <View style={[styles.utilisation_container, { marginTop: 10 }]}>
          <UtilisationAccordion />
        </View>
        {/* Harvest date */}
        <View style={[styles.utilisation_container, { width: '93%', alignSelf: 'center', marginTop: 2 }]}>
          <InputLikeButton
            text={'Month Harvested'}
            rightIcon={true}
            calendarPress={() => setHarvestedPopup(true)}
            date={moment(harvestedDate).format('MMMM DD,YYYY')}
          />
          <Divider
            style={styles.divider}
          />
          <Text style={styles.processing_text}>Required Processing method if any for the outputs</Text>
          <View style={styles.processing_container}>
            <TouchableOpacity onPress={() => setToggleCheckBox('yes')}>
              {toggleCheckBox === 'yes' ?
                <Image
                  source={require('../../../assets/checked.png')}
                  style={{ height: 30, width: 30 }} />
                :
                <Image
                  source={require('../../../assets/unchecked.png')}
                  style={{ height: 30, width: 30 }} />
              }
            </TouchableOpacity>
            <Text style={styles.yes_text}>Yes</Text>
            <TouchableOpacity onPress={() => setToggleCheckBox('no')}>
              {toggleCheckBox === 'no' ?
                <Image
                  source={require('../../../assets/checked.png')}
                  style={{ height: 30, width: 30 }} />
                :
                <Image
                  source={require('../../../assets/unchecked.png')}
                  style={{ height: 30, width: 30 }} />

              }
            </TouchableOpacity>
            <Text style={styles.yes_text}>No</Text>
          </View>
        </View>
        <View style={styles.bottomPopupbutton}>
          <CustomButton
            style={styles.submitButton}
            btnText={'Submit'}
            onPress={() => { setSavepopup(true) }}
          />
          <CustomButton
            style={styles.draftButton}
            btnText={'Save as draft'}
            onPress={() => { setDraftpopup(true) }}
          />
        </View>
      </ScrollView>
      {/* harvest popup */}
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
        styleInner={[styles.savePopup, { width: '90%' }]}>
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
        styleInner={[styles.savePopup, { width: '90%' }]}>
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
  )
}

export default EditType

const makeStyles = fontScale => StyleSheet.create({
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
  processing_container: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    marginBottom: 10
  },
  processing_text: {
    fontSize: 14 / fontScale,
    fontFamily: 'ubuntu_medium',
    textAlign: 'left',
    color: '#000',
    marginTop: 10,
    padding: 10
  },
  yes_text: {
    alignSelf: 'center',
    paddingHorizontal: 10,
    color: '#000',
    fontSize: 14 / fontScale,
    fontFamily: 'ubuntu_medium'
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
})