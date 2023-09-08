import { StyleSheet, Text, View, useWindowDimensions, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';

const ProductInner = ({ date }) => {
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={{flexDirection:'row', flexWrap:'wrap', justifyContent:'center'}}>
    <View style={{ width: '33%', marginVertical: '2%', alignSelf: 'center', justifyContent: 'center', }}>
      <Text style={styles.main_text}>Self Consumed</Text>
        <Text style={styles.main_text_value}>{date?.self_consumed}</Text>
      <Text style={styles.main_text}>Feed To livestock</Text>
        <Text style={styles.main_text_value}>{date?.fed_to_livestock}</Text>
    </View>
      <View style={{ width: '33%', marginVertical: '2%', alignSelf: 'center', justifyContent: 'center', }}>
        <Text style={styles.main_text}>Sold to Neighbour</Text>
        <Text style={styles.main_text_value}>{date?.sold_to_neighbours}</Text>
        <Text style={styles.main_text}>Sold to Industrial</Text>
        <Text style={styles.main_text_value}>{date?.sold_for_industrial_use}</Text>
      </View>
      <View style={{ width: '33%', marginVertical: '2%', alignSelf: 'center', justifyContent: 'center', }}>
        <Text style={styles.main_text}>Wastage</Text>
        <Text style={styles.main_text_value}>{date?.wastage}</Text>
        <Text style={styles.main_text}>Retain</Text>
        <Text style={styles.main_text_value}>{date?.other_value}</Text>
      </View>
    </View>
  )
}
const ProductDescription = ({ productName, productNameValue, dateValue, date, qtyValue, qty, data, edit, del }) => {
  // console.log("date", data)
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={styles.container}>
      <View style={styles.top_container}>
        <View style={{ width: '40%' }}>
          <Text style={styles.main_text_value}>{productNameValue}</Text>
          <Text style={styles.main_text}>{productName}</Text>
        </View>
        <Divider
          bold={true}
          style={styles.divider}
        />
        <View>
          <Text style={styles.main_text}>{date}</Text>
          <Text style={styles.main_text_value}>{dateValue}</Text>
        </View>
        <View>
          <Text style={styles.main_text}>{qty}</Text>
          <Text style={[styles.main_text_value, { alignSelf: 'center' }]}>{qtyValue}</Text>
        </View>
      </View>
      <View style={styles.second_container}>
        <ProductInner
          date={data}
        />
      </View>
      <View style={styles.edit_del_button}>
        <TouchableOpacity onPress={del}>
          <Image
            source={require('../../../assets/delete.png')}
            style={styles.addCropIcon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={edit}>
          <Image
            source={require('../../../assets/edit.png')}
            style={styles.addCropIcon}
          />
        </TouchableOpacity>
      </View>
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
      borderRadius: 5,
      alignSelf: 'center',
      paddingHorizontal: 10
    },
    top_container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10
    },
    second_container: {
      marginTop: '2%',
      backgroundColor: '#1F7E3A',
      flexDirection: 'row',
      justifyContent: 'center',
      alignContent: 'center',
      flexWrap: 'wrap',
      width: '95%',
      borderRadius: 5,
      alignSelf: 'center',
      padding: 10,
      marginBottom: '2%'
    },
    main_text: {
      color: '#B4B4B4',
      fontSize: 14 / fontScale,
      paddingVertical: 5,
      fontFamily: 'ubuntu_regular',
    },
    main_text_value: {
      color: '#fff',
      fontSize: 16 / fontScale,
      fontFamily: 'ubuntu_medium',
    },
    divider: {
      height: '90%',
      width: '1%',
      alignSelf: 'center',
      color: '#E7E7E7',
      borderRadius: 10,
      marginRight: '5%'
    },
    addCropIcon: {
      height: 30,
      width: 30,
      marginLeft: 10
    },
    edit_del_button: {
      flexDirection: 'row',
      alignSelf: 'flex-end',
      margin: 10
    }
  });
