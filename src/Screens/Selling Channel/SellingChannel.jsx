import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {getSellingChannelMethod} from '../../Redux/SellingChannelMethodSlice';
import {
  addSellingChannel,
  editSellingChannel,
  getSellingChannel,
} from '../../Redux/SellingChannelSlice';
import {useTranslation} from 'react-i18next';
import '../../i18next';
import {SafeAreaView} from 'react-native-safe-area-context';

const SellingChannel = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const {t} = useTranslation();
  const [channelMethod, setChannelMethod] = useState([
    {
      id: 0,
      name: 'Local Market',
      value: t('local market'),
    },
    {
      id: 1,
      name: 'Agent',
      value: t('agent'),
    },
    {
      id: 2,
      name: 'Ecommerce',
      value: t('ecommerce'),
    },
    {
      id: 3,
      name: 'Export',
      value: t('export'),
    },
    {
      id: 4,
      name: 'None',
      value: t('none'),
    },
  ]);
  const {sellingChannelMethod} = useSelector(
    state => state.sellingChannelMethod,
  );
  const {sellingChannel} = useSelector(state => state.sellingChannel);
  const styles = makeStyles(fontScale);
  let idMatch = sellingChannel;
  const [toggleCheckBox, setToggleCheckBox] = useState(
    idMatch?.selling_channel_names ? idMatch?.selling_channel_names : [],
  );
  const dispatch = useDispatch();
  const [averageAge, setAverageAge] = useState([]);
  useFocusEffect(
    useCallback(() => {
      dispatch(getSellingChannelMethod());
      dispatch(getSellingChannel()).then(res => {
        // console.log("sellingchannel", res?.payload?.data?.selling_channel_names)
      });
    }, []),
  );
  useEffect(() => {
    setAverageAge(sellingChannelMethod);
    setToggleCheckBox(
      sellingChannel?.selling_channel_names
        ? sellingChannel?.selling_channel_names
        : [],
    );
  }, [sellingChannelMethod, sellingChannel]);
  const save = () => {
    if (idMatch?.selling_channel_names) {
      let formData = {
        selling_channel_id: sellingChannel?._id,
        selling_channel_names: toggleCheckBox,
      };
      dispatch(editSellingChannel(formData)).then(res => {
        navigation.goBack();
      });
    } else {
      dispatch(addSellingChannel(toggleCheckBox)).then(res => {
        // console.log("ressss adding0", res)
        navigation.goBack();
      });
    }
  };
  const addRemoveId = name => {
    if (toggleCheckBox.includes(name)) {
      setToggleCheckBox(toggleCheckBox.filter(item => item !== name));
    } else {
      setToggleCheckBox([...toggleCheckBox, name]);
    }
  };
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.container}>
        <CustomHeader
          backIcon={true}
          headerName={t('selling channel')}
          goBack={() => navigation.goBack()}
        />
        <CustomDashboard
          first={t('production')}
          second={t('selling channel')}
        />
        {channelMethod.map(item => {
          return (
            <View key={item._id} style={styles.mainContainer}>
              <Text style={[styles.text, {fontSize: 14 / fontScale}]}>
                {item?.value}
              </Text>
              <TouchableOpacity
                onPress={() => addRemoveId(item?.name.toLowerCase())}>
                {toggleCheckBox.includes(item?.name.toLowerCase()) ? (
                  <Image
                    source={require('../../../assets/checked.png')}
                    style={{height: 30, width: 30}}
                  />
                ) : (
                  <Image
                    source={require('../../../assets/unchecked.png')}
                    style={{height: 30, width: 30}}
                  />
                )}
              </TouchableOpacity>
            </View>
          );
        })}
        <View style={styles.buttonContainer}>
          <CustomButton btnText={t('save')} onPress={() => save()} />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SellingChannel;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    mainContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 10,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: 'grey',
      width: '90%',
      marginTop: 10,
      alignSelf: 'center',
    },
    text: {
      color: '#000',
      fontFamily: 'ubuntu-medium',
      textTransform: 'capitalize',
    },
    buttonContainer: {
      width: '90%',
      position: 'absolute',
      bottom: 10,
      alignSelf: 'center',
    },
  });
