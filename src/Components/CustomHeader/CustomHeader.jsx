import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';

const CustomHeader = ({headerName, backIcon, goBack}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {backIcon ? (
          <TouchableOpacity onPress={goBack}>
            <Image
              style={styles.tinyIcon}
              source={require('../../../assets/arrowright2.jpg')}
              // height={100}
            />
          </TouchableOpacity>
        ) : null}
        <View>
          <Text style={styles.headerText}>{headerName}</Text>
        </View>
        <View />
      </View>
    </View>
  );
};

export default CustomHeader;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      padding: 5,
      margin: '5%',
    },
    header: {
      justifyContent: 'space-between',
      alignItems: 'center',
      flexDirection: 'row',
    },
    headerText: {
      alignSelf: 'center',
      color: '#000',
      fontWeight: '600',
      textAlign: 'center',
      fontSize: 18 / fontScale,
      fontFamily: 'ubuntu_medium',
    },
  });
