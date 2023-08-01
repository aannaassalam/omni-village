import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';

const CustomHeader = ({headerName, backIcon, goBack, rightIcon}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {backIcon ? (
          <TouchableOpacity onPress={goBack}>
            <Image
              style={styles.tinyIcon}
              source={require('../../../assets/arrowright2.png')}
              // height={100}
            />
          </TouchableOpacity>
        ) : null}
        <View>
          <Text style={styles.headerText}>{headerName}</Text>
        </View>
        {rightIcon ? {rightIcon} : <View />}
      </View>
    </View>
  );
};

export default CustomHeader;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      backgroundColor: '#fff',
      padding: 3,
      margin: '4%',
    },
    header: {
      // justifyContent: 'center',
      // alignItems: 'center',
      // flexDirection: 'row',
    },
    headerText: {
      alignSelf: 'center',
      color: '#000',
      fontWeight: '600',
      textAlign: 'center',
      fontSize: 18 / fontScale,
      fontFamily: 'ubuntu_medium',
    },
    tinyIcon: {
      position: 'absolute',
      height: 30,
      width: 30,
      top: 0,
      left: 0,
    },
  });
