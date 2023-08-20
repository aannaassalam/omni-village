import {
  Image,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomInputField from '../../Components/CustomInputField/CustomInputField';
import {Divider} from 'react-native-paper';
import UtilisationAccordion from '../../Components/Accordion/UtilisationAccordion';
import ImportantInformation from '../../Components/Accordion/ImportantInformation';

const CropDescription = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {cropType} = route.params;
  const [area, setArea] = useState('');
  const [utilisation, setUtilisation] = useState(true);
  const [impInfo, setImpInfo] = useState(true);
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={cropType}
        goBack={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.textInputArea}>
          <CustomInputField
            label={'Area allocated'}
            value={'10'}
            onChangeText={e => setArea(e)}
          />
        </View>
        {/* utilisation section */}
        <View style={styles.subArea}>
          <Text style={styles.subAreaText}>Utilisation</Text>
          <Divider bold={true} style={styles.divider} horizontalInset={true} />
          <TouchableOpacity onPress={() => setUtilisation(!utilisation)}>
            {utilisation ? (
              <Image
                source={require('../../../assets/arrowUp.png')}
                style={styles.uparrow}
              />
            ) : (
              <Image
                source={require('../../../assets/arrowDown.png')}
                style={styles.uparrow}
              />
            )}
          </TouchableOpacity>
        </View>
        {utilisation ? <UtilisationAccordion /> : null}
        {/* important information section */}
        <View style={styles.subArea}>
          <Text style={styles.subAreaText}>Important Information</Text>
          <Divider
            bold={true}
            style={[styles.divider, {width: '45%'}]}
            horizontalInset={true}
          />
          <TouchableOpacity onPress={() => setImpInfo(!impInfo)}>
            {impInfo ? (
              <Image
                source={require('../../../assets/arrowUp.png')}
                style={styles.uparrow}
              />
            ) : (
              <Image
                source={require('../../../assets/arrowDown.png')}
                style={styles.uparrow}
              />
            )}
          </TouchableOpacity>
        </View>
        {impInfo ? <ImportantInformation navigation={navigation} /> : null}
      </ScrollView>
    </View>
  );
};

export default CropDescription;
const width = Dimensions.get('window').width;
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
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      margin: 10,
      marginTop: '5%',
      width: width / 1,
    },
    divider: {
      alignSelf: 'center',
      height: 1,
      width: '67%',
      marginTop: 5,
      color: 'grey',
    },
    subAreaText: {
      alignSelf: 'center',
      fontSize: 14 / fontScale,
      color: '#000',
      fontFamily: 'ubuntu',
    },
    uparrow: {
      height: 20,
      width: 20,
    },
  });
