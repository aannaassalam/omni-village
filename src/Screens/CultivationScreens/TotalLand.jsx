import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {Divider} from 'react-native-paper';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomInputField from '../../Components/CustomInputField/CustomInputField';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import CustomButton from '../../Components/CustomButton/CustomButton';

const TotalLand = ({navigation}) => {
  const [totalLand, setTotalLand] = useState(0);
  const [land, setLand] = useState({});
  console.log('land', land);
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Total Land'}
        goBack={() => navigation.goBack()}
      />
      <View style={styles.textInputArea}>
        <CustomInputField
          label={'Total Land area'}
          value={totalLand}
          onChangeText={e => setTotalLand(e)}
        />
      </View>
      <View style={styles.subArea}>
        <Text style={styles.subAreaText}>Sub area</Text>
        <Divider bold={true} style={styles.divider} horizontalInset={true} />
      </View>
      <View style={styles.textInputArea}>
        <InputWithoutBorder
          productionName={'Cultivation'}
          placeholder={'0'}
          value={land?.cultivation ? land?.cultivation : 0}
          onChangeText={e => setLand({...land, cultivation: e})}
        />
        <InputWithoutBorder
          productionName={'Trees, Shrubs & Grasslands'}
          placeholder={'0'}
          value={land?.treeShrubGrassland ? land?.treeShrubGrassland : 0}
          onChangeText={e => setLand({...land, treeShrubGrassland: e})}
        />
        <InputWithoutBorder
          productionName={'Poultry'}
          placeholder={'0'}
          value={land?.poultry ? land?.poultry : 0}
          onChangeText={e => setLand({...land, poultry: e})}
        />
        <InputWithoutBorder
          productionName={'Fishery'}
          placeholder={'0'}
          value={land?.fishery ? land?.fishery : 0}
          onChangeText={e => setLand({...land, fishery: e})}
        />
        <InputWithoutBorder
          productionName={'Storage'}
          placeholder={'0'}
          value={land?.storage ? land?.storage : 0}
          onChangeText={e => setLand({...land, storage: e})}
        />
      </View>
      <View style={styles.save}>
        <CustomButton btnText={'Save'} />
      </View>
    </View>
  );
};

export default TotalLand;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  textInputArea: {
    alignSelf: 'center',
    width: '95%',
  },
  subArea: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 5,
    margin: 10,
  },
  divider: {
    alignSelf: 'center',
    height: 1,
    width: '80%',
    marginTop: 5,
    color: 'grey',
  },
  subAreaText: {
    alignSelf: 'center',
    fontSize: 14,
    color: '#000',
    fontFamily: 'ubuntu_medium',
  },
  save: {
    marginTop: '5%',
    width: '90%',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
  },
});
