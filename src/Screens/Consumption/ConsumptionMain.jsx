import {
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput';
import {useDispatch, useSelector} from 'react-redux';
import {getConsumptionType} from '../../Redux/ConsumptionTypeSlice';
import {getConsumptionCrops} from '../../Redux/ConsumptionCropSlice';
import {useTranslation} from 'react-i18next';
import '../../i18next';
import {SafeAreaView} from 'react-native-safe-area-context';
import {ActivityIndicator} from 'react-native-paper';
import {useQuery} from '@tanstack/react-query';
import {fetchConsumptionTypes} from '../../functions/consumptionScreen';

const ConsumptionMain = ({navigation}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {data: consumptionType, isLoading} = useQuery({
    queryKey: ['consumption_type'],
    queryFn: fetchConsumptionTypes,
  });
  const dispatch = useDispatch();
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <CustomHeader
        backIcon={true}
        headerName={t('consumption')}
        goBack={() => navigation.goBack()}
      />
      {isLoading ? (
        <View style={{marginTop: '60%'}}>
          <ActivityIndicator size={'large'} color={'green'} />
        </View>
      ) : (
        <ScrollView>
          {consumptionType.map((item, indx) => {
            return (
              <CustomShowcaseInput
                key={indx}
                productionName={t(`${item?.name}`)}
                progressBar={false}
                onPress={() => {
                  navigation.navigate('consumption', {
                    typeId: item?._id,
                    typeName: item?.name,
                  });
                }}
              />
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ConsumptionMain;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });
