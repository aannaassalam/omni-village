import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {getSellingChannelMethod} from '../../Redux/SellingChannelMethodSlice';
import {getSellingChannel} from '../../Redux/SellingChannelSlice';
import {useTranslation} from 'react-i18next';
import '../../i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useMutation, useQuery} from '@tanstack/react-query';
import {fetchSellingChannelMethods} from '../../functions/Corps';
import {
  addSellingChannel,
  editSellingChannel,
  fetchSellingChannels,
} from '../../functions/SellingChannelScreen';

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

  const {
    data: sellingChannel,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['selling_channel'],
    queryFn: fetchSellingChannels,
  });

  const styles = makeStyles(fontScale);
  const [toggleCheckBox, setToggleCheckBox] = useState(
    sellingChannel?.selling_channel_names
      ? sellingChannel?.selling_channel_names
      : [],
  );

  useEffect(() => {
    if (!isLoading) {
      setToggleCheckBox(sellingChannel?.selling_channel_names || []);
    }
  }, [isLoading, sellingChannel?.selling_channel_names]);

  const {
    mutate: editSellingChannelData,
    isPending: isEditSellingChannelPending,
  } = useMutation({
    mutationFn: editSellingChannel,
    onSuccess: () => navigation.goBack(),
  });

  const {mutate: addSellingChannelData, isPending: isAddSellingChannelPending} =
    useMutation({
      mutationFn: addSellingChannel,
      onSuccess: () => navigation.goBack(),
    });

  const save = () => {
    if (sellingChannel?.selling_channel_names) {
      let formData = {
        selling_channel_id: sellingChannel?._id,
        selling_channel_names: toggleCheckBox,
      };
      editSellingChannelData(formData);
    } else {
      addSellingChannelData(toggleCheckBox);
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
        {isLoading || isFetching ? (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <ActivityIndicator animating size="large" color="#268C43" />
          </View>
        ) : (
          channelMethod.map(item => {
            return (
              <Pressable
                onPress={() => addRemoveId(item?.name.toLowerCase())}
                key={item.id}
                style={styles.mainContainer}>
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
              </Pressable>
            );
          })
        )}
        <View style={styles.buttonContainer}>
          <CustomButton
            btnText={t('save')}
            onPress={save}
            loading={isAddSellingChannelPending || isEditSellingChannelPending}
          />
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
