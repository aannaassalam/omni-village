import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {primaryColor} from '../../styles/colors';
import {fontScale} from '../../styles/globalStyles';
import {fontFamilyMedium, fontFamilyRegular} from '../../styles/fontStyle';

const ItemHeader = ({
  title,
  onPress,
  edit,
}: {
  title: string;
  onPress: () => void;
  edit?: boolean;
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subText}>Dashboard</Text>
      {edit && (
        <TouchableOpacity style={styles.editButton} onPress={onPress}>
          <Text style={styles.editText}>{'Edit'}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ItemHeader;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ececec',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 32,
    marginVertical: 30,
  },
  title: {
    color: primaryColor,
    fontSize: 18 / fontScale,
    fontFamily: fontFamilyMedium,
    textAlign: 'center',
  },
  subText: {
    color: '#000',
    fontSize: 14 / fontScale,
    fontFamily: fontFamilyRegular,
    marginTop: 8,
  },
  editButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 8,
    marginHorizontal: 22,
    padding: 10,
    position: 'absolute',
    bottom: 0,
    right: 0,
    marginBottom: 6,
    alignSelf: 'flex-end',
  },
  editText: {
    color: primaryColor,
    fontSize: 16 / fontScale,
    fontFamily: fontFamilyRegular,
    textAlign: 'center',
  },
});
