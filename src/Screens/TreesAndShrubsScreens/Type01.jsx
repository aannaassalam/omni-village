import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import React, { useState } from 'react';
import ImportantInformationTress from '../../Components/Accordion/ImportantInformationTress';
import { Divider } from 'react-native-paper';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import ProductDescription from '../../Components/CustomDashboard/ProductDescription';
import BottomModal from '../../Components/BottomSheet/BottomModal';
import Checkbox from '../../Components/Checkboxes/Checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';

const Type01 = ({ navigation, route }) => {
  const { cropType } = route.params;
  const [impInfo, setImpInfo] = useState(true);
  const [harvestedProduct, setHarvestedProduct] = useState(true);
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [treeAge, setTreeAge] = useState(false)
  const [harvestProdAdd, setHarvestProdAdd] = useState(false)
  const [focus,setFocus]=useState(false)
  const [averageAge, setAverageAge] = useState([
    {
      id: 1,
      age: 'Less than a year',
      checked: true
    },
    {
      id: 2,
      age: '1 to 2 years',
      checked: false
    },
    {
      id: 3,
      age: '2 to 3 years',
      checked: false
    },
    {
      id: 4,
      age: '3 to 5 year',
      checked: false
    },
  ])
  const toggleItem = (value, index) => {
    const newValue = averageAge.map((checkbox, i) => {
      if (i !== index)
        return {
          ...checkbox,
          checked: false,
        }
      if (i === index) {
        const item = {
          ...checkbox,
          checked: !checkbox.checked,
        }
        return item
      }
      return checkbox
    })
    setAverageAge(newValue)
  }
  return (
    <View style={styles.container}>
      <CustomHeader
        goBack={() => navigation.goBack()}
        headerName={cropType}
        backIcon={true}
      />
      <ScrollView>
        <View style={styles.textInputArea}>
          {/* important information section */}
          <View style={styles.subArea}>
            <Text style={styles.subAreaText}>Important Information</Text>
            <Divider
              bold={true}
              style={[styles.divider, { width: '45%' }]}
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
          {impInfo ? <ImportantInformationTress
            treeAgePress={() => setTreeAge(true)}
          /> : null}
          <View style={styles.subArea}>
            <Text style={styles.subAreaText}>Harvested Product</Text>
            <Divider
              bold={true}
              style={[styles.divider, { width: '45%' }]}
              horizontalInset={true}
            />
            <TouchableOpacity
              onPress={() => setHarvestedProduct(!harvestedProduct)}>
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
          {harvestedProduct ? <ProductDescription /> : null}
          <TouchableOpacity style={styles.add_button} onPress={() => setHarvestProdAdd(true)}>
            <Text style={styles.add_button_text}>Add</Text>
            <AntDesign
              name="plus" size={15} color="#fff"
            />
          </TouchableOpacity>
        </View>
        {
          treeAge &&
          <BottomModal
            modalVisible={treeAge}
            setBottomModalVisible={setTreeAge}
            styleInner={{ height: '45%' }}
          >
            <View style={styles.BottomTopContainer}>
              <Text style={styles.headerText}>Average Age of the tree</Text>
              <TouchableOpacity
                onPress={() => {
                  setTreeAge(!treeAge);
                }}>
                <Image
                  source={require('../../../assets/close.png')}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.chck_container}>
              {averageAge.map((item, indx) => {
                return (
                  <Checkbox
                    name={item?.age}
                    checked={item?.checked}
                    checking={(value) => toggleItem(value, indx)}
                  />
                )
              })}
            </View>
          </BottomModal>
        }
        {harvestProdAdd &&
          <BottomModal
            modalVisible={harvestProdAdd}
            setBottomModalVisible={setHarvestProdAdd}
            styleInner={{ height: focus?'70%':'35%' }}
          >
            <View style={styles.BottomTopContainer}>
              <Text style={styles.headerText}>Add Harvested Product</Text>
              <TouchableOpacity
                onPress={() => {
                  setHarvestProdAdd(!harvestProdAdd);
                  setFocus(!focus)
                }}>
                <Image
                  source={require('../../../assets/close.png')}
                  style={styles.closeIcon}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.harvested_prod_container}>
              <InputWithoutBorder
                measureName={'kg'}
                productionName={'Name Of harvested Product'}
                value={''}
                onChangeText={e => console.log(e)}
                notRightText={true}
                onFocus={()=>setFocus(true)}
              />
            </View>
          </BottomModal>
        }
      </ScrollView>
    </View>
  );
};

export default Type01;
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
    closeIcon: {
      height: 30,
      width: 30,
      alignSelf: 'center',
    },
    BottomTopContainer: {
      justifyContent: 'space-between',
      alignSelf: 'center',
      margin: 10,
      padding: 5,
      flexDirection: 'row',
    },
    headerText: {
      fontFamily: 'ubuntu_medium',
      fontSize: 16 / fontScale,
      color: '#000',
      alignSelf: 'center',
      width: '87%',
    },
    chck_container: {
      alignSelf: 'center',
      width: '90%',
    },
    add_button: {
      width: '20%',
      padding: 8,
      alignSelf: 'flex-start',
      justifyContent: 'space-around',
      backgroundColor: '#263238',
      flexDirection: 'row',
      marginLeft: 13,
      borderRadius: 8,
      marginTop: '5%'
    },
    add_button_text: {
      fontFamily: 'ubuntu_regular',
      fontSize: 14 / fontScale,
      color: '#fff',
      alignSelf: 'center',
    },
    harvested_prod_container: {
      alignSelf: 'center',
      width: '90%',
      marginBottom: 10
    }
  });
