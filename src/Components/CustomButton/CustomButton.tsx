import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';

const makeStyles = (fontScale:any) =>
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
      fontFamily: 'ubuntu-medium',
      fontSize: 14 / fontScale,
      color: '#FFF',
    },
  });

export default function CustomButton({
  btnText,
  onPress,
  style,
  loading = false,
}:{
  btnText:any,
  onPress:any,
  style?:any,
  loading?:boolean,
}) {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  return (
    <TouchableOpacity
      style={[styles.cmn_btn, style]}
      onPress={onPress}
      disabled={loading}>
      <Text style={styles.cmn_btn_text}>
        {loading ? <ActivityIndicator color="#fff" /> : btnText}
      </Text>
    </TouchableOpacity>
  );
}
