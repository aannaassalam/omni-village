import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const styles = StyleSheet.create({
  cmn_btn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 10,
    backgroundColor: '#268C43',
    height: 50,
    paddingHorizontal: 20,
  },
  cmn_btn_text: {
    fontSize: 14,
    color: '#FFF',
  },
});

export default function CustomButton({btnText,onPress}) {
  return (
    <TouchableOpacity style={styles.cmn_btn} onPress={onPress}>
      <Text style={styles.cmn_btn_text}>{btnText}</Text>
    </TouchableOpacity>
  );
}
