import {useState} from 'react';
import {
  StyleSheet,
  TouchableNativeFeedback,
  Text,
  View,
  Alert,
  ToastAndroid,
  useWindowDimensions,
} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {logout} from '../../redux/auth/actions';


// styles
import {dark_grey, primary} from '../../styles/colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { fontFamilyRegular } from '../../styles/fontStyle';
import AlertModal from '../Popups/AlertModal';

const NavigationRow = ({
  item,
  selectedValue,
  setSelectedValue,
  navigation,
}: {
  item: any;
  selectedValue: any;
  setSelectedValue: any;
  navigation: any;
}) => {
  const authState = useSelector((state:any) => state.authState);
  const dispatch = useDispatch();
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleNavItemPress = () => {
    setSelectedValue(item.navigate);

    switch (item.value) {
      case 'Logout':
        setShowLogoutModal(true);
        break;
      case 'Consultation':
        // if (authState?.role === 'Therapist' || authState?.role === 'Doctor') {
        if (authState?.role === 'Doctor') {
          navigation.navigate(item.navigate);
        } else {
          ToastAndroid.show(
            'This can be only accessed by Doctors',
            ToastAndroid.SHORT,
          );
        }
        break;
      default:
        navigation.navigate(item.navigate);
        break;
    }
  };

  return (
    <TouchableNativeFeedback onPress={handleNavItemPress}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginVertical: 8,
        }}>
        <View
          style={[
            styles.navigationItem,
            {
              borderColor: 'transparent',
            },
          ]}>
          {selectedValue === item.navigate ? item.iconSelected : item.icon}
          <Text
            style={[
              styles.navigationTxt,
              {
                color:
                  selectedValue === item.navigate ? primary : dark_grey,
              },
            ]}>
            {item.value}
          </Text>
        </View>
        <View style={{alignSelf: 'center', marginRight: '8%'}}>
          <AntDesign name="right" size={20} color={primary} />
        </View>
        <AlertModal
          cancel
          visible={showLogoutModal}
          onHide={() => setShowLogoutModal(false)}
          onSubmit={() => {
            setShowLogoutModal(false);
            dispatch(logout());
          }}
          hideText="No"
          confirmText="Yes"
          comments="Are you sure you want to logout?"
          title="Logout"
        />
      </View>
    </TouchableNativeFeedback>
  );
};

export default NavigationRow;

const makeStyles = (fontScale:any) => StyleSheet.create({
  navigationItem: {
    width: '70%',
    gap: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderLeftWidth: 4,
    paddingHorizontal: 28,
  },
  navigationTxt: {
    fontSize: 16/fontScale,
    fontFamily: fontFamilyRegular,
    textTransform: 'capitalize',
  },
});
