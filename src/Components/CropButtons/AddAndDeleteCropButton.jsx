import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';

const AddAndDeleteCropButton = ({onPress, add, cropName}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={styles.container}>
      <Text style={styles.addButtonText}>{cropName}</Text>
      <TouchableOpacity onPress={onPress}>
        {add ? (
          <Image
            source={require('../../../assets/plus.png')}
            style={styles.addCropIcon}
          />
        ) : (
          <Image
            source={require('../../../assets/delete.png')}
            style={styles.addCropIcon}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddAndDeleteCropButton;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      width: '90%',
      borderColor: 'grey',
      borderWidth: 1,
      borderRadius: 10,
      alignSelf: 'center',
      padding: 20,
      justifyContent: 'space-between',
      flexDirection: 'row',
    },
    addButtonText: {
      color: '#000',
      fontSize: 16 / fontScale,
      fontWeight: '500',
      alignSelf: 'center',
      fontFamily: 'ubuntu_medium',
    },
    addCropIcon: {
      height: 30,
      width: 30,
    },
  });
