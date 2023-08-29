import { StyleSheet, Text, View, useWindowDimensions,Image,TouchableOpacity} from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';

const ProductInner = ({ date, dateValue }) =>{
  const { fontScale } = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return(
        <View style={{width:'33%',marginVertical:'2%',alignSelf:'center',justifyContent:'center'}}>
          <Text style={styles.main_text}>{date}</Text>
          <Text style={styles.main_text_value}>{dateValue}</Text>
        </View>
  )
}
const ProductDescription = ({ productName, productNameValue, dateValue, date, qtyValue, qty,data,edit }) => {
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
      {data.map((item)=>{
        return <ProductInner
        date={item?.name}
        dateValue={item?.value}
        />
      })}
      </View>
      <View style={styles.edit_del_button}>
        <TouchableOpacity>
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
      flexDirection:'row',
      justifyContent: 'flex-start',
      alignContent:'center',
      flexWrap:'wrap',
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
      marginLeft:10
    },
    edit_del_button:{
      flexDirection:'row',
      alignSelf:'flex-end',
      margin:10
    }
  });
