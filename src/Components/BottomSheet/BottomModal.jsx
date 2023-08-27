import {
  StyleSheet,
  Text,
  View,
  Modal,
  KeyboardAvoidingView,
  useWindowDimensions,
} from 'react-native';
import React, {useState} from 'react';
import Toast from 'react-native-toast-message';

const BottomModal = ({
  noTopDvd,
  modalVisible,
  setBottomModalVisible,
  style,
  styleInner,
  children,
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        alert('Modal has been closed.');
        setBottomModalVisible(!modalVisible);
      }}
      statusBarTranslucent={true}>
      <View style={[styles.modalTopContainer, style]}>
        <View style={[styles.modalInnerContainer, styleInner]}>
          {/* {!noTopDvd && <View style={styles.topDiv} />} */}
          {children}
        </View>
        <Toast style={{height: 'auto', minHeight: 70}} width={300} />
      </View>
    </Modal>
  );
};

export default BottomModal;

const makeStyles = fontScale =>
  StyleSheet.create({
    modalContainer: {
      position: 'absolute',
      bottom: -10,
      margin: 0,
      width: '100%',
      // backgroundColor: 'pink',
    },
    modalTopContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalInnerContainer: {
      width: '100%',
      backgroundColor: 'white',
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      paddingVertical: 10,
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
      position: 'absolute',
      bottom: 0,
    },
    topDiv: {
      width: 50,
      height: 50,
      backgroundColor: 'green',
      position: 'absolute',
      top: 50,
    },
  });
