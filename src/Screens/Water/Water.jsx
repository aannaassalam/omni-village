import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { width } from '../../styles/globalStyles'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { useTranslation } from 'react-i18next'
import ItemHeader from '../../Components/CustomHeader/ItemHeader'

const Water = ({navigation}) => {
    const {t} = useTranslation()
  return (
      <View style={styles.container}>
          <CustomHeader
              backIcon={true}
              headerName={t('housing')}
              goBack={() => navigation.goBack()}
          />
          <ItemHeader title={t('Water Usage Information')} />
    </View>
  )
}

export default Water

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
})