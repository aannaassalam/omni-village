import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import React from 'react';

const AddAndDeleteCropButton = ({
  onPress,
  add,
  cropName,
  darftStyle,
  drafted,
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View style={[styles.container, darftStyle]}>
      <Text style={styles.addButtonText}>{cropName}</Text>
      {drafted ? (
        <Image
          source={require('../../../assets/infocircle.png')}
          style={styles.draftIcon}
        />
      ) : null}
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
            onPress={onPress}
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
      fontSize: 14 / fontScale,
      fontWeight: '500',
      alignSelf: 'center',
      fontFamily: 'ubuntu-medium',
      textTransform: 'capitalize',
    },
    addCropIcon: {
      height: 30,
      width: 30,
    },
    draftIcon: {
      height: 10,
      width: 10,
      top: 5,
      right: 10,
      position: 'absolute',
    },
  });
