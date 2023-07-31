import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';

const AddAndDeleteCropButton = ({onPress, add, cropName}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.addButtonText}>{cropName}</Text>
      <TouchableOpacity onPress={onPress}>
        {add ? (
          <Image source={require('../../../assets/plus.png')} />
        ) : (
          <Image source={require('../../../assets/delete.png')} />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default AddAndDeleteCropButton;

const styles = StyleSheet.create({
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
    fontSize: 14,
    fontWeight: '500',
    alignSelf: 'center',
    fontFamily: 'ubuntu_medium',
  },
});
