import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import {borderColor} from '../../styles/colors';

const HeaderCard = ({
  onPress,
  disabled,
  children,
}: {
  onPress?: any;
  disabled?: any;
  children: any;
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      disabled={disabled}>
      {children}
    </TouchableOpacity>
  );
};

export default HeaderCard;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 22,
      paddingVertical: 22,
      backgroundColor: '#f4f4f4',
      borderColor: borderColor,
      borderWidth: 1,
      borderRadius: 10,
    },
  });
