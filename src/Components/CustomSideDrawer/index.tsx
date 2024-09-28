import {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Text,
  View,
  Image,
  useWindowDimensions,
} from 'react-native';

// components
import NavigationRow from './NavigationRow';
import {Divider} from '@rneui/themed';

// assets
import {
  AboutIcon,
  BlankIcon,
  EducationIcon,
  FeedbackIcon,
  FoodIcon,
  HelpSupportIcon,
  LegalIcon,
  LogoutIcon,
  ProfileIcon,
  SecurityIcon,
} from '../../../assets/index';

// utilities
import {black, primary, white} from '../../styles/colors';
import {useSelector} from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {fontFamilyRegular} from '../../styles/fontStyle';

const navigationItems = [
  {
    value: 'My Profile',
    navigate: 'editProfile',
    icon: <ProfileIcon />,
    iconSelected: <ProfileIcon />,
  },
  // {
  //   value: 'Food Preference',
  //   navigate: 'foodPreference1',
  //   icon: <FoodIcon />,
  //   iconSelected: <FoodIcon />,
  // },
  {
    value: 'Security',
    navigate: 'security',
    icon: <SecurityIcon />,
    iconSelected: <SecurityIcon />,
  },
  {
    value: 'Educational Resources',
    navigate: 'educational',
    icon: <EducationIcon />,
    iconSelected: <EducationIcon />,
  },
  {
    value: 'Feedback',
    navigate: 'feedback',
    icon: <FeedbackIcon />,
    iconSelected: <FeedbackIcon />,
  },
  {
    value: 'About App',
    navigate: 'about',
    icon: <AboutIcon />,
    iconSelected: <AboutIcon />,
  },
  {
    value: 'Legal Information',
    navigate: 'legalInfo',
    icon: <LegalIcon />,
    iconSelected: <LegalIcon />,
  },
  {
    value: 'Help & Support',
    navigate: 'helpSupport',
    icon: <HelpSupportIcon />,
    iconSelected: <HelpSupportIcon />,
  },
  {
    value: 'Logout',
    navigate: 'logout',
    icon: <LogoutIcon />,
    iconSelected: <LogoutIcon />,
  },
];

const CustomSideDrawer = ({
  navigation,
  state,
}: {
  navigation: any;
  state: any;
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const authState = useSelector((state: any) => state.authState);
  const [selectedValue, setSelectedValue] = useState('');
  const PHOTO_URL = null;
  return (
    <View style={styles.drawerContainer}>
      <View
        style={{
          backgroundColor: primary,
          width: '100%',
          paddingVertical: 26,
        }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.closeDrawer()}>
            <AntDesign name="close" size={25} color={white} />
          </TouchableOpacity>
        </View>
        <View
          style={{
            paddingHorizontal: 32,
            width: '100%',
            alignItems: 'center',
            alignSelf: 'center',
          }}>
          {PHOTO_URL == null ? (
            <BlankIcon height={80} width={80} />
          ) : (
            <Image
              source={{uri: 'https://i.imgur.com/tdi3NGa.png'}}
              style={styles.avatar}
            />
          )}
          <Text style={styles.profileText}>Andalib Quraishi</Text>
        </View>
      </View>

      <View style={{width: '100%', marginTop: 20}}>
        {navigationItems.map((item, idx) => (
          <NavigationRow
            key={idx}
            navigation={navigation}
            item={item}
            selectedValue={selectedValue}
            setSelectedValue={setSelectedValue}
          />
        ))}
      </View>
    </View>
  );
};

export default CustomSideDrawer;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    drawerContainer: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    header: {
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-end',
      position: 'absolute',
      right: 20,
      top: 20,
    },
    logo: {
      color: black,
      fontSize: 24,
      fontWeight: '700',
    },
    divider: {width: '100%', marginVertical: 32},
    navigationItem: {
      width: '100%',
      gap: 16,
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderLeftWidth: 4,
      paddingHorizontal: 28,
    },
    navigationTxt: {
      fontSize: 16,
      fontWeight: '600',
      textTransform: 'capitalize',
    },
    avatar: {
      height: 90,
      width: 90,
      borderRadius: 100 / 2,
      alignSelf: 'center',
      padding: 20,
      backgroundColor: '#ffffff',
    },
    profileText: {
      fontFamily: fontFamilyRegular,
      fontSize: 20 / fontScale,
      color: white,
      paddingHorizontal: 6,
      paddingVertical: 10,
      marginTop: 10,
    },
    idText: {
      fontFamily: fontFamilyRegular,
      fontSize: 16 / fontScale,
      color: '#989696',
      paddingHorizontal: 6,
    },
  });
