import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import {Scale} from '../../Helper/utils';

const makeStyles = fontScale =>
  StyleSheet.create({
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
      fontFamily: 'ubuntu_medium',
      fontSize: 14 / fontScale,
      color: '#FFF',
    },
  });

export default function CustomButton({btnText, onPress, style}) {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  return (
    <TouchableOpacity style={[styles.cmn_btn, style]} onPress={onPress}>
      <Text style={styles.cmn_btn_text}>{btnText}</Text>
    </TouchableOpacity>
  );
}
