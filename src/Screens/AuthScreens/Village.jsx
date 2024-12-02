import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomButton from '../../Components/CustomButton/CustomButton'
import { storage } from '../../Helper/Storage'
import { useQuery } from '@tanstack/react-query'
import { get_villages } from '../../functions/AuthScreens'
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'
import { Styles } from '../../styles/globalStyles'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { useTranslation } from 'react-i18next'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

const Village = ({navigation}) => {
  const {t} = useTranslation()
  const { data: villages, isLoading } = useQuery({
    queryKey: ['villages'],
    queryFn: get_villages,
    refetchOnWindowFocus: true,
  });
console.log("villagesssss", villages)
  return (
    <View style={styles.container}  >
      {/* <CustomHeader
        backIcon={false}
        headerName={t(`Villages`)}
        goBack={() => navigation.goBack()}
      /> */}
      <KeyboardAwareScrollView>
      <CustomShowcaseInput
      productionName={'Village'}
        onPress={() => { navigation.navigate('officerHome')}}
      />
      </KeyboardAwareScrollView>
      <View style={Styles.bottomBtn}>
      <CustomButton 
      style={{width:'100%'}}
      onPress={()=>{
        storage.clearAll();
        navigation.replace('startup');
      }} btnText={'Logout'}/>
      </View>
    </View>
  )
}

export default Village

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:'#fff'
  },
  text:{
    color:'#000'
  }
})