import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import CustomButton from '../../Components/CustomButton/CustomButton';

const LandAllocation = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {totalLand} = route.params;
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
      console.log('go ahead');
      navigation.navigate('cultivationDashboard', {totalLand: totalLand});
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView>
        <CustomHeader
          backIcon={true}
          headerName={'Land Allocation'}
          goBack={() => navigation.goBack()}
        />
        <View style={styles.textInputArea}>
          {cultivation.map((item, indx) => {
            return (
              <InputWithoutBorder
                productionName={item?.name}
                placeholder={'0'}
                value={item?.area}
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
              />
            );
          })}
        </View>
      </KeyboardAvoidingView>
      <View style={styles.save}>
        <CustomButton
          btnText={'Save'}
          onPress={() => {
            onSave();
          }}
        />
      </View>
    </View>
  );
};

export default LandAllocation;

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
    save: {
      marginTop: '5%',
      width: '90%',
      position: 'absolute',
      bottom: 10,
      alignSelf: 'center',
    },
  });
