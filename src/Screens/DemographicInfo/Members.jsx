import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'
import { useUser } from '../../Hooks/useUser'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getDemographic } from '../../functions/demographic'
import { get_dropdown_data } from '../../functions/AuthScreens'

const Members = ({navigation}) => {
    const {fontScale} = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const {data:user} = useUser()
    const {t} = useTranslation()
  return (
      <View style={styles.container}>
          <CustomHeader
              backIcon={true}
              headerName={t('demographic')}
              goBack={() => navigation.goBack()}
          />
          {user?.members.map((item)=>{
              return <CustomShowcaseInput
              key={item?._id}
                    productionName={item?.name}
                    progressBar={false}
                    onPress={() => {
                        navigation.navigate('demographic', { member_id: item?._id, demographic_id: item?.demographic_id })
                    }}
                  />
          })}
    </View>
  )
}

export default Members

const makeStyles = (fontScale) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
})