import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import {Divider} from 'react-native-paper';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomInputField from '../../Components/CustomInputField/CustomInputField';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import CustomButton from '../../Components/CustomButton/CustomButton';

const TotalLand = ({navigation}) => {
  const [totalLand, setTotalLand] = useState(0);
  const [land, setLand] = useState([
    {name: 'Cultivation', area: 0},
    {name: 'Trees, Shrubs & Grasslands', area: 0},
    {name: 'Poultry', area: 0},
    {name: 'Fishery', area: 0},
    {name: 'Storage', area: 0},
  ]);
  const onSave = () => {
    let sumofAreas = land.reduce((accumulator, currentObject) => {
      return accumulator + currentObject?.area;
    }, 0);
    if (sumofAreas > totalLand) {
      Alert.alert('Your sub area acres are greater than total land area');
    } else {
      console.log('go ahead');
      navigation.navigate('production', {
        totalLand: totalLand,
        usedLand: sumofAreas,
        data: land,
      });
    }
  };
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
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
      <ScrollView>
        <>
          <View style={styles.subArea}>
            <Text style={styles.subAreaText}>Sub area</Text>
            <Divider
              bold={true}
              style={styles.divider}
              horizontalInset={true}
            />
          </View>
          <View style={styles.textInputArea}>
            {land.map((item, indx) => {
              return (
                <InputWithoutBorder
                  productionName={item?.name}
                  placeholder={'0'}
                  value={item?.area}
                  onChangeText={e => {
                    let targetedArea = land.findIndex(
                      lan => lan?.name == item?.name,
                    );
                    if (targetedArea !== -1) {
                      const updatedDataArray = [...land];
                      updatedDataArray[targetedArea].area = parseInt(e);
                      setLand(updatedDataArray);
                    }
                  }}
                />
              );
            })}
          </View>
          <View style={styles.save}>
            <CustomButton
              btnText={'Save'}
              onPress={() => {
                onSave();
              }}
            />
          </View>
        </>
      </ScrollView>
    </View>
  );
};

export default TotalLand;

const makeStyles = fontScale =>
  StyleSheet.create({
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
      paddingHorizontal: 13,
      margin: 10,
      marginTop: '5%',
    },
    divider: {
      alignSelf: 'center',
      height: 1,
      width: '74%',
      margin: 5,
      color: 'grey',
    },
    subAreaText: {
      alignSelf: 'center',
      fontSize: 16 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu_medium',
    },
    save: {
      marginTop: '5%',
      width: '90%',
      alignSelf: 'center',
    },
  });
