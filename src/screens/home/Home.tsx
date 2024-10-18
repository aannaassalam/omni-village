import {
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  ScrollView,
  FlatList,
} from 'react-native';
import React, {useState} from 'react';
import HomeHeader from '../../Components/CustomHeader/HomeHeader';
import HeaderCard from '../../Components/Card/HeaderCard';
import {Avatar, Divider} from 'react-native-paper';
import {
  fontFamilyBold,
  fontFamilyMedium,
  fontFamilyRegular,
} from '../../styles/fontStyle';
import {Styles} from '../../styles/globalStyles';
import {draft_color, primary} from '../../styles/colors';
import HomeCardOptions from '../../Components/Card/HomeCardOptions';
import {home_data} from '../../../assets/mockdata/Data';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { useDispatch, useSelector } from 'react-redux';
import { logUserOut } from '../../redux/auth/actions';

const Home = ({navigation}:{navigation:any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const [active, setActive] = useState('');
  const dispatch = useDispatch()
  const authState = useSelector((state)=>state.authState)
  return (
    <View style={styles.container}>
      <HomeHeader />
      <ScrollView>
        <View style={styles.mainContainer}>
          <HeaderCard
            onPress={() => {
              navigation.navigate('profile');
            }}>
            <View style={styles.header_container}>
              <Avatar.Text
                size={54}
                label={`${authState?.first_name[0]}${authState?.last_name[0]}`}
              />
              <View style={{gap: 6}}>
                <Text style={styles.header_text}>
                  {authState?.first_name} {authState?.last_name}
                </Text>
                <Text style={styles.sub_text}>
                  {authState?.country_code}
                  {authState?.phone}
                </Text>
              </View>
            </View>
            {/* <Divider style={Styles.divider} />
            <View
              style={[
                styles.header_container,
                {justifyContent: 'space-around'},
              ]}>
              <View style={{gap: 6}}>
                <Text style={styles.second_header_text}>Land allocated</Text>
                <Text style={styles.second_sub_text}>50 acres</Text>
              </View>
              <View style={Styles.verticalLine} />
              <View style={{gap: 6}}>
                <Text style={styles.second_header_text}>Land used</Text>
                <Text style={[styles.second_sub_text, {color: draft_color}]}>
                  40 acres
                </Text>
              </View>
            </View> */}
          </HeaderCard>
          <View style={styles.flatlist}>
            <View style={styles.card_container}>
              {home_data.map((item: any, index: any) => {
                return (
                  <HomeCardOptions
                    item={item}
                    active={active}
                    setActive={(item: any) => setActive(item)}
                    key={index}
                  />
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
      <View style={Styles.bottomBtn}>
        <CustomButton
          btnText={'Logout'}
          onPress={() => dispatch(logUserOut())}
        />
      </View>
    </View>
  );
};

export default Home;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    mainContainer: {
      paddingHorizontal: 22,
      paddingVertical: 32,
    },
    header_container: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'center',
    },
    header_text: {
      fontSize: 18 / fontScale,
      fontFamily: fontFamilyBold,
      color: '#000',
    },
    sub_text: {
      fontSize: 14 / fontScale,
      fontFamily: fontFamilyMedium,
      color: '#000',
    },
    second_header_text: {
      fontSize: 16 / fontScale,
      fontFamily: fontFamilyRegular,
      color: '#000',
      textAlign: 'left',
    },
    second_sub_text: {
      fontSize: 12 / fontScale,
      fontFamily: fontFamilyRegular,
      color: primary,
      textAlign: 'left',
    },
    items_container: {
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    flatlist: {
      marginVertical: 26,
    },
    card_container: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      width: '100%',
      justifyContent:'space-between',
    },
  });
