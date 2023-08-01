import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React, {useState} from 'react';
import InputWithoutBorder from '../CustomInputField/InputWithoutBorder';
import {Divider} from 'react-native-paper';

const UtilisationAccordion = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [utilisationArray, setUtilisationArray] = useState([
    {name: 'Self consumed', value: 0},
    {name: 'Fed to Livestock', value: 0},
    {name: 'Sold to Neighbours', value: 0},
    {name: 'Sold for Industrial Use', value: 0},
    {name: 'Wastage', value: 0},
    {name: 'Others', value: ''},
  ]);
  const [others, setOthers] = useState('');
  let findme = utilisationArray.find(i => i?.name == 'Others');
  // console.log('uli', utilisationArray);
  return (
    <View style={styles.container}>
      <InputWithoutBorder
        measureName={'kg'}
        productionName={'Output'}
        value={'10'}
        onChangeText={e => console.log('output kg', e)}
      />
      <View style={styles.innerInputView}>
        <Divider style={styles.divider} />
        <View style={{width: '100%'}}>
          {utilisationArray?.map((item, index) => {
            return (
              <>
                <InputWithoutBorder
                  measureName={'kg'}
                  productionName={item?.name}
                  value={item?.value}
                  onChangeText={e => {
                    let targetedArea = utilisationArray.findIndex(
                      lan => lan?.name == item?.name,
                    );
                    if (targetedArea !== -1) {
                      const updatedDataArray = [...utilisationArray];
                      if (targetedArea === 5) {
                        updatedDataArray[targetedArea].value = e;
                        setUtilisationArray(updatedDataArray);
                      } else {
                        updatedDataArray[targetedArea].value = parseInt(e);
                        setUtilisationArray(updatedDataArray);
                      }
                    }
                  }}
                />
                {index == 5 && findme?.value !== '' ? (
                  <View style={styles.innerInputView}>
                    <Divider style={styles.divider} />
                    <View style={{width: '100%'}}>
                      <InputWithoutBorder
                        measureName={'kg'}
                        productionName={findme?.value}
                        value={others}
                        onChangeText={e => setOthers(e)}
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
  );
};

export default UtilisationAccordion;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      width: '95%',
      alignSelf: 'center',
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
  });
