import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import HomeHeader from '../../Components/CustomHeader/HomeHeader'

const Home = () => {
  const {fontScale} = useWindowDimensions()
  const styles= makeStyles(fontScale)
  return (
    <View style={styles.container}>
      <HomeHeader/>
    </View>
  )
}

export default Home

const makeStyles = (fontScale:any) => StyleSheet.create({
  container:{
    flex:1,
  }
})