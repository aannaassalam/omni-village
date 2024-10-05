import {StyleSheet, useWindowDimensions, View,Text} from 'react-native';
import PropTypes from 'prop-types';

import {Overlay} from '@rneui/themed';


import {black, borderColor, dark_grey} from '../../styles/colors';
import {AlertIcon, SuccessIcon} from '../../../assets/index';
import {fontFamilyBold, fontFamilyRegular } from '../../styles/fontStyle';
import CustomButton from './../CustomButton/CustomButton';

const AlertModal = ({
  visible,
  onHide,
  title,
  comments,
  children,
  onSubmit,
  cancel,
  hideText,
  confirmText,
  successModal,
  approval,
  diet,
}: {
  visible?: any;
  onHide?: any;
  title?: any;
  comments?: any;
  children?: any;
  onSubmit?: any;
  cancel?: any;
  hideText?: any;
  confirmText?: any;
  successModal?: any;
  approval?: any;
  diet?:any
}) => {
  const {width, height, fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <Overlay isVisible={visible} overlayStyle={{borderRadius: 10}}>
      <View style={[styles.container, {width: width - 100}]}>
        <View style={styles.iconContainer}>
          {successModal ? <SuccessIcon /> : <AlertIcon />}
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.comment}>{comments}</Text>
          {children}
        </View>
        {cancel ? (
          <View style={styles.twoBtn}>
            <CustomButton
              btnText={hideText}
              onPress={() => onHide()}
              loading={false}
              btnStyle={{color: dark_grey}}
              style={{width: width / 3, backgroundColor: '#ebeced'}}
            />
            <CustomButton
              btnText={confirmText}
              onPress={() => onSubmit()}
              loading={false}
              style={{width: width / 3}}
            />
          </View>
        ) : (
          <CustomButton
            btnText={confirmText}
            onPress={() => onSubmit()}
            loading={false}
            style={{width: width / 1.5}}
          />
        )}
      </View>
    </Overlay>
  );
};

AlertModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onHide: PropTypes.func,
  title: PropTypes.string.isRequired,
  comments: PropTypes.string.isRequired,
  children: PropTypes.node,
  onSubmit: PropTypes.func.isRequired,
  cancel: PropTypes.bool,
  hideText: PropTypes.string,
  confirmText: PropTypes.string.isRequired,
  successModal: PropTypes.bool,
};

export default AlertModal;

const makeStyles = (fontScale:any) =>
  StyleSheet.create({
    container: {
      backgroundColor: 'white',
      alignItems: 'center',
      padding: 24,
    },
    iconContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
    },
    titleContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 32,
    },
    title: {
      color: black,
      fontSize: 20 / fontScale,
      marginBottom: 8,
      lineHeight: 20 * 1.25,
      fontFamily: fontFamilyBold,
    },
    comment: {
      fontWeight: '400',
      textAlign: 'center',
      color: '#646464',
      paddingHorizontal: 2,
      fontSize: 16 / fontScale,
      fontFamily: fontFamilyRegular,
      marginTop: '5%',
    },
    twoBtn: {flexDirection: 'row', gap: 16},
  });
