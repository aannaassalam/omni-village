import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';

const ProductDescription = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={styles.container}>
      <Text>ProductDescription</Text>
    </View>
  );
};

export default ProductDescription;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      marginTop: '2%',
      backgroundColor: '#268C43',
      width: '93%',
      borderRadius:5,
      alignSelf: 'center',
    },
  });
