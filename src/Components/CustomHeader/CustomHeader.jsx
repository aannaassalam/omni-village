import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  Pressable,
} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';

const CustomHeader = ({headerName, backIcon, goBack, rightIcon}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {backIcon ? (
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Image
              style={styles.tinyIcon}
              source={require('../../../assets/arrowright2.png')}
              // height={100}
            />
          </TouchableOpacity>
        ) : null}
        <View>
          <Text style={styles.headerText} numberOfLines={1}>
            {headerName}
          </Text>
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
      // padding: 3,
      margin: '4%',
    },
    header: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    headerText: {
      alignSelf: 'center',
      color: '#333',
      fontWeight: '600',
      textAlign: 'center',
      fontSize: 18 / fontScale,
      fontFamily: 'ubuntu-medium',
      textTransform: 'capitalize',
      width: 220,
    },
    backButton: {
      position: 'absolute',
      // top: 0,
      left: 0,
      height: 30,
      width: 30,
    },
    tinyIcon: {
      width: '100%',
      height: '100%',
      // resizeMode
    },
  });
