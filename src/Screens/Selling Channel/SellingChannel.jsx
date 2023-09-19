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
import { useTranslation } from 'react-i18next';
import '../../i18next';

const SellingChannel = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const {sellingChannelMethod} = useSelector(
    state => state.sellingChannelMethod,
  );
  const { t } = useTranslation();
  const {sellingChannel} = useSelector(state => state.sellingChannel);
  const styles = makeStyles(fontScale);
  let idMatch = sellingChannel;
  const [toggleCheckBox, setToggleCheckBox] = useState(
    idMatch?.selling_channel_methods ? idMatch?.selling_channel_methods : [],
  );
  const dispatch = useDispatch();
  const [averageAge, setAverageAge] = useState([]);
  useFocusEffect(
    useCallback(() => {
      dispatch(getSellingChannelMethod());
      dispatch(getSellingChannel())
    }, []),
  );
  useEffect(() => {
    setAverageAge(sellingChannelMethod);
    setToggleCheckBox(sellingChannel?.selling_channel_methods ? sellingChannel?.selling_channel_methods : [])
  }, [sellingChannelMethod, sellingChannel]);
  const save = () => {
    if (idMatch?.selling_channel_methods) {
      let formData = {
        selling_channel_id: sellingChannel?._id,
        selling_channel_methods: toggleCheckBox,
      };
      dispatch(editSellingChannel(formData)).then(() => navigation.goBack());
    } else {
      dispatch(addSellingChannel(toggleCheckBox)).then(() =>
        navigation.goBack(),
      );
    }
  };

  const addRemoveId  = (id) =>{
    if(toggleCheckBox.includes(id)){
      setToggleCheckBox(toggleCheckBox.filter((item) => item !== id));
    }else{
      setToggleCheckBox([...toggleCheckBox, id]);
    }
  }
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t('selling channel')}
        goBack={() => navigation.goBack()}
      />
      <CustomDashboard first={t('production')} second={t('selling channel')} />
      {averageAge.map(item => {
        return (
          <View key={item._id} style={styles.mainContainer}>
            <Text style={[styles.text, {fontSize: 14 / fontScale}]}>
              {item?.name}
            </Text>
            <TouchableOpacity onPress={() => addRemoveId(item?._id)}>
              {toggleCheckBox.includes(item?._id)?(
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
      fontFamily: 'ubuntu_medium',
    },
    buttonContainer: {
      width: '90%',
      position: 'absolute',
      bottom: 10,
      alignSelf: 'center',
    },
  });
