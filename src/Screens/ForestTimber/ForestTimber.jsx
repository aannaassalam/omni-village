import {ScrollView, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useTranslation} from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import ItemHeader from '../../Components/CustomHeader/ItemHeader';
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput';

const ForestTimber = ({navigation}) => {
  const {t} = useTranslation();
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t('forestry')}
        goBack={() => navigation.goBack()}
      />
      <ScrollView>
        <ItemHeader title={t('forestry')} />
        <CustomShowcaseInput
          productionName={t('General Information')}
          onPress={() =>
            navigation.navigate('forestryGeneralInformation', {
              name: t('General Information'),
              type: 'general',
            })
          }
        />
        <CustomShowcaseInput
          productionName={t('Timber Needs')}
          onPress={() =>
            navigation.navigate('timberNeeds', {
              name: t('Timber Needs'),
              type: 'timber_needs',
            })
          }
        />
        <CustomShowcaseInput
          productionName={t('Other Needs')}
          onPress={() =>
            navigation.navigate('forestryOtherNeeds', {
              name: t('Other Needs'),
              type: 'other_needs',
            })
          }
        />
      </ScrollView>
    </View>
  );
};

export default ForestTimber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
