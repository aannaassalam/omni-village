import {StyleSheet, Text, TouchableHighlight, View, useWindowDimensions} from 'react-native';
import React, {useState} from 'react';
import CustomDropdown3 from '../CustomDropdown/CustomDropdown3';
import {averageTreeAge, fertilisers, pesticides, soilHealth} from '../../MockData/Mockdata';
import {Divider} from 'react-native-paper';
import InputWithoutBorder from '../CustomInputField/InputWithoutBorder';
import InputLikeButton from '../CustomButton/InputLikeButton';
import InputWithoutRightElement from '../CustomInputField/InputWithoutRightElement';

const ImportantInformationTress = ({ treeAgePress }) => {
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
      <InputWithoutBorder
        measureName={'kg'}
        productionName={'Number of trees'}
        value={'10'}
        onChangeText={e => console.log(e)}
        notRightText={true}
      />
      <TouchableHighlight onPress={treeAgePress}>
      <CustomDropdown3
        data={averageTreeAge}
        selectedValue={e => setPesti(e)}
        infoName={'Average age of the tree'}
      />
      </TouchableHighlight>
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
    </View>
  );
};

export default ImportantInformationTress;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      width: '100%',
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
