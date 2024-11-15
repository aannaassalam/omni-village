import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import ItemHeader from '../../Components/CustomHeader/ItemHeader'
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'
import { Styles, width } from '../../styles/globalStyles'
import { Divider } from 'react-native-paper'
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'

const EnergyFuel = ({navigation}) => {
  const {t} = useTranslation()
  const [enterInfo, setEnterInfo] = useState(true)
  const [generalInfo, setGeneralInfo] = useState(true)
  const [selectedItems, setSelectedItems] = useState([])
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t('water')}
        goBack={() => navigation.goBack()}
      />
        <ItemHeader title={t('energy')} />
      <ScrollView>
        <View style={styles.mainContainer}>
        <MultiselectDropdown
          containerStyle={{ marginTop: '5%', paddingTop: 0 }}
          data={[
            {
              name: 'Electricity',
              key: 'electricity',
            },
            {
              name: 'Petrol',
              key: 'petrol',
            },
            {
              name: 'Others',
              key: 'othersEnergy',
            },
          ]}
          setSelectedd={(value)=>setSelectedItems(value)}
          selectedd={selectedItems}
          infoName={t('Select all the major energy sources that you use')}
        />
        </View>
          <View style={[styles.subArea, { marginTop: '3%' }]}>
            <Text
              style={[
                Styles.fieldLabel,
                { marginTop: 4, alignSelf: 'center' },
              ]}>
              {t('Enter information for the Selected Energy Sources')}
            </Text>
            <Divider
              bold={true}
              style={[styles.divider, { width: USER_PREFERRED_LANGUAGE === "ms" ? '8%' : '4%' }]}
              horizontalInset={true}
            />
            <TouchableOpacity onPress={() => setEnterInfo(!enterInfo)}>
              {enterInfo ? (
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
          {selectedItems.map((item) => {
            return (
              <CustomShowcaseInput
                // isDrafted={item?.status === 1 ? false : true}
                // id={item?._id}
                productionName={item}
                onPress={() => navigation.navigate(item, { name: item, energy_id: item, type: item })}
              />
            )
          })}
        <View style={[styles.subArea, { marginTop: '3%' }]}>
          <Text
            style={[
              Styles.fieldLabel,
              { marginTop: 4, alignSelf: 'center' },
            ]}>
            {t('General Information')}
          </Text>
          <Divider
            bold={true}
            style={[styles.divider, { width: '60%' }]}
            horizontalInset={true}
          />
        </View>
        <CustomShowcaseInput
          // isDrafted={item?.status === 1 ? false : true}
          // id={item?._id}
          productionName={t('Enter Other Information')}
          onPress={() => navigation.navigate('energyGeneralInformation', { name: 'General information', energy_id: '1', type: 'general_information' })}
        />
        </ScrollView>
    </View>
  )
}

export default EnergyFuel

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    paddingHorizontal: 22,
  },
  subArea: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    // margin: 10,
    marginTop: '5%',
    width: width / 1.04,
    alignItems: 'center',
  },
  divider: {
    alignSelf: 'center',
    height: 1,
    width: '67%',
    color: 'grey',
  },
  uparrow: {
    height: 20,
    width: 20,
  },
})