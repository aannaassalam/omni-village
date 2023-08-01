import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import React from 'react';

const InputLikeButton = ({text, onPress, rightIcon, date, calendarPress}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <View
      style={[
        styles.button,
        {
          flexDirection: rightIcon ? 'row' : null,
          justifyContent: rightIcon ? 'space-between' : null,
        },
      ]}>
      {!rightIcon ? (
        <TouchableOpacity onPress={onPress}>
          <Text style={styles.text}>{text}</Text>
        </TouchableOpacity>
      ) : (
        <>
          <View>
            <Text style={[styles.text, {paddingHorizontal: 5, padding: 0}]}>
              {text}
            </Text>
            <Text
              style={[
                styles.text,
                {color: '#000', paddingHorizontal: 5, padding: 0},
              ]}>
              {date}
            </Text>
          </View>
          <TouchableOpacity style={styles.calendar} onPress={calendarPress}>
            <Image source={require('../../../assets/calendar.png')} />
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default InputLikeButton;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      width: '100%',
    },
    button: {
      width: '95%',
      borderColor: '#268C43',
      borderWidth: 0.5,
      borderRadius: 10,
      alignSelf: 'center',
      padding: 10,
      marginTop: '5%',
    },
    text: {
      padding: 5,
      fontFamily: 'ubuntu',
      fontSize: 14 / fontScale,
      color: 'green',
    },
    calendar: {
      alignSelf: 'center',
    },
  });
