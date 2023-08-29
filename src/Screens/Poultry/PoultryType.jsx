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
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import ImportantInformationPoultry from '../../Components/Accordion/ImportantInformationPoultry';
import ProductionInformation from '../../Components/Accordion/ProductionInformation';

const PoultryType = ({navigation,route}) => {
    const { cropType } = route.params;
    const [impInfo, setImpInfo] = useState(true);
    const [harvestedProduct, setHarvestedProduct] = useState(true);
    const [productionInfo,setProductionInfo]=useState(true)
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const [income, setIncome] = useState('');
    const [expenditure, setExpenditure] = useState('');
    const [treeAge, setTreeAge] = useState(false)
    const [harvestProdAdd, setHarvestProdAdd] = useState(false)
    const [focus, setFocus] = useState(false)
    const [savepopup, setSavepopup] = useState(false);
    const [draftpopup, setDraftpopup] = useState(false);
    const [productName, setProductName] = useState('')
    const [toggleCheckBox, setToggleCheckBox] = useState('')
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
    const [harvestedProductList, setHarvestedProductList] = useState([
        {
            id: 1,
            productName: 'Fur',
            date: 'August 15, 2023',
            qty: '1 kg',
            productDetails: [
                {
                    name: 'Self Consumed',
                    value: '10 kg'
                },
                {
                    name: 'Fed To Livestock',
                    value: '50 kg'
                }, {
                    name: 'Sold To Neighbour',
                    value: '10 kg'
                }, {
                    name: 'Sold To Industry',
                    value: '10 kg'
                }, {
                    name: 'Wastage',
                    value: '10 kg'
                }, {
                    name: 'Retain',
                    value: '10 kg'
                }
            ]
        }
    ])
    const addProduct = () => {
        setHarvestedProductList([...harvestedProductList, { productName: productName }])
        setProductName('')
    }
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
                  {impInfo ? <ImportantInformationPoultry
                      treeAgePress={() => setTreeAge(true)}
                  /> : null}
            {/* production information */}
                  <View style={styles.subArea}>
                      <Text style={styles.subAreaText}>Production Information</Text>
                      <Divider
                          bold={true}
                          style={[styles.divider, { width: '45%' }]}
                          horizontalInset={true}
                      />
                      <TouchableOpacity
                          onPress={() => setProductionInfo(!productionInfo)}>
                          {productionInfo ? (
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
                  {productionInfo ? <ProductionInformation
                  /> : null}
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
                  <Text style={styles.processing_text}>Any hormones/ artificial productivity enhancing mechanism applied</Text>
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
                  {/* harvested product section */}
                  <View style={styles.subArea}>
                      <Text style={styles.subAreaText}>Harvested Product</Text>
                      <Divider
                          bold={true}
                          style={[styles.divider, { width: '45%' }]}
                          horizontalInset={true}
                      />
                      <TouchableOpacity
                          onPress={() => setHarvestedProduct(!harvestedProduct)}>
                          {harvestedProduct ? (
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
                  <>
                  {harvestedProduct?
                  <>
                {harvestedProductList[0] !== undefined ?
                    <>
                        {harvestedProductList.map((item) => {
                            return <ProductDescription
                                productName={'Product Type'}
                                productNameValue={item?.productName}
                                date={'Harvested On'}
                                dateValue={'August 15,2023'}
                                qty={'Qty'}
                                qtyValue={'1'}
                                data={item?.productDetails}
                                edit={() => navigation.navigate('editType', { cropType: item?.productName })}
                            />
                        })}
                    </>
                    : null}
                  </>
                  :
                  null
                }
                  </>
                  <TouchableOpacity style={styles.add_button} onPress={() => setHarvestProdAdd(true)}>
                      <Text style={styles.add_button_text}>Add</Text>
                      <AntDesign
                          name="plus" size={15} color="#fff"
                      />
                  </TouchableOpacity>
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
                      styleInner={{ height: focus ? '70%' : '35%' }}
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
                              value={productName}
                              onChangeText={e => {
                                  if (e.endsWith("\n")) {
                                      setHarvestProdAdd(!harvestProdAdd)
                                      setFocus(!focus)
                                      addProduct()
                                  } else {
                                      setProductName(e)
                                  }
                              }}
                              multiline={true}
                              notRightText={true}
                              onFocus={() => setFocus(true)}
                          />
                      </View>
                  </BottomModal>
              }
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
          </ScrollView>
    </View>
  )
}

export default PoultryType

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
    });