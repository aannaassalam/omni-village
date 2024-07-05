import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'

const Demographic = ({ navigation }) => {
  const { fontScale } = useWindowDimensions()
  const styles = makeStyles(fontScale)
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Demographic Info'}
        goBack={() => navigation.goBack()}
      />
    </View>
  )
}

export default Demographic

const makeStyles = fontScale => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 12
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 22,

  }
})