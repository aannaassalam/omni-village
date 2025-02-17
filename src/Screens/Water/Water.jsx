import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import {Styles, width} from '../../styles/globalStyles';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {useTranslation} from 'react-i18next';
import ItemHeader from '../../Components/CustomHeader/ItemHeader';
import {Divider} from 'react-native-paper';
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput';
import {getWaterByUser} from '../../functions/water';
import {useQuery} from '@tanstack/react-query';
import {useFocusEffect} from '@react-navigation/native';
import {USER_PREFERRED_LANGUAGE} from '../../i18next';

const Water = ({navigation}) => {
  const {t} = useTranslation();
  const [usageVisible, setUsagesVisible] = useState(true);
  const [harvestVisible, setHarvestVisible] = useState(true);
  const [generalVisible, setGeneralVisible] = useState(true);
  const {
    data: water,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['water_by_user'],
    queryFn: () => getWaterByUser(),
    refetchOnWindowFocus: true,
  });
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t('water')}
        goBack={() => navigation.goBack()}
      />
      <ScrollView>
        <ItemHeader title={t('Water Usage Information')} />
        {/* Usage */}
        <View style={[styles.subArea, {marginTop: '3%'}]}>
          <Text
            style={[Styles.fieldLabel, {marginTop: 4, alignSelf: 'center'}]}>
            {t('Usage Information')}
          </Text>
          <Divider
            bold={true}
            style={[
              styles.divider,
              {width: USER_PREFERRED_LANGUAGE === 'ms' ? '48%' : '54%'},
            ]}
            horizontalInset={true}
          />
          <TouchableOpacity onPress={() => setUsagesVisible(!usageVisible)}>
            {usageVisible ? (
              <Image
                source={require('../../../assets/arrowUp.png')}
                style={styles.uparrow}
              />
            ) : (
              <Image
                source={require('../../../assets/arrowDown.png')}
                style={styles.uparrow}
              />
            )}
          </TouchableOpacity>
        </View>
        {usageVisible ? (
          <>
            <CustomShowcaseInput
              productionName={t('Cooking and Drinking')}
              isDrafted={water?.['cooking_and_drinking']?.isDrafted}
              id={water?.['cooking_and_drinking']?.water_id}
              onPress={() =>
                navigation.navigate('cooking', {
                  name: 'Cooking and Drinking',
                  water_id: water?.['cooking_and_drinking']?.water_id,
                  type: 'cooking_and_drinking',
                })
              }
            />
            <CustomShowcaseInput
              isDrafted={water?.['sanitation_and_bathing']?.isDrafted}
              id={water?.['sanitation_and_bathing']?.water_id}
              productionName={t('Sanitation and Bathing')}
              onPress={() =>
                navigation.navigate('sanitation', {
                  name: 'Sanitation and Bathing',
                  water_id: water?.['sanitation_and_bathing']?.water_id,
                  type: 'sanitation_and_bathing',
                })
              }
            />
            <CustomShowcaseInput
              isDrafted={water?.['cleaning']?.isDrafted}
              id={water?.['cleaning']?.water_id}
              productionName={t('Cleaning')}
              onPress={() =>
                navigation.navigate('cleaning', {
                  name: 'Cleaning',
                  water_id: water?.['cleaning']?.water_id,
                  type: 'cleaning',
                })
              }
            />
            <CustomShowcaseInput
              isDrafted={water?.['irrigation']?.isDrafted}
              id={water?.['irrigation']?.water_id}
              productionName={t('Irrigation')}
              onPress={() =>
                navigation.navigate('irrigation', {
                  name: 'Irrigation',
                  water_id: water?.['irrigation']?.water_id,
                  type: 'irrigation',
                })
              }
            />
            {water?.others.map(item => {
              return (
                <CustomShowcaseInput
                  isDrafted={item?.status === 1 ? false : true}
                  id={item?._id}
                  productionName={item?.other_name}
                  onPress={() =>
                    navigation.navigate('others', {
                      name: 'Add other purpose if any',
                      water_id: item?._id,
                      type: 'others',
                    })
                  }
                />
              );
            })}
            <CustomShowcaseInput
              productionName={t('Add other purpose if any')}
              onPress={() =>
                navigation.navigate('others', {
                  name: 'Add other purpose if any',
                  water_id: null,
                  type: 'others',
                })
              }
            />
          </>
        ) : null}
        {/* Harvesting */}
        <View style={[styles.subArea, {marginTop: '3%'}]}>
          <Text
            style={[Styles.fieldLabel, {marginTop: 4, alignSelf: 'center'}]}>
            {t('Harvest & Wastewater Information')}
          </Text>
          <Divider
            bold={true}
            style={[styles.divider, {width: '28%'}]}
            horizontalInset={true}
          />
          <TouchableOpacity onPress={() => setHarvestVisible(!harvestVisible)}>
            {harvestVisible ? (
              <Image
                source={require('../../../assets/arrowUp.png')}
                style={styles.uparrow}
              />
            ) : (
              <Image
                source={require('../../../assets/arrowDown.png')}
                style={styles.uparrow}
              />
            )}
          </TouchableOpacity>
        </View>
        {harvestVisible ? (
          <>
            <CustomShowcaseInput
              productionName={t('Water Harvesting')}
              isDrafted={water?.['water_harvesting_capacity']?.isDrafted}
              id={water?.['water_harvesting_capacity']?.water_id}
              onPress={() =>
                navigation.navigate('waterHarvesting', {
                  name: 'Water Harvesting',
                  water_id: water?.['water_harvesting_capacity']?.water_id,
                  type: 'water_harvesting_capacity',
                })
              }
            />
            <CustomShowcaseInput
              productionName={t('Water Disposal')}
              isDrafted={water?.['waste_water_disposal']?.isDrafted}
              id={water?.['waste_water_disposal']?.water_id}
              onPress={() =>
                navigation.navigate('waterDisposal', {
                  name: 'Water Disposal',
                  water_id: water?.['waste_water_disposal']?.water_id,
                  type: 'waste_water_disposal',
                })
              }
            />
          </>
        ) : null}
        {/* general information */}
        <View style={[styles.subArea, {marginTop: '3%'}]}>
          <Text
            style={[Styles.fieldLabel, {marginTop: 4, alignSelf: 'center'}]}>
            {t('General Information')}
          </Text>
          <Divider
            bold={true}
            style={[styles.divider, {width: '50%'}]}
            horizontalInset={true}
          />
          <TouchableOpacity onPress={() => setGeneralVisible(!generalVisible)}>
            {generalVisible ? (
              <Image
                source={require('../../../assets/arrowUp.png')}
                style={styles.uparrow}
              />
            ) : (
              <Image
                source={require('../../../assets/arrowDown.png')}
                style={styles.uparrow}
              />
            )}
          </TouchableOpacity>
        </View>
        {generalVisible ? (
          <CustomShowcaseInput
            isDrafted={water?.['general_information']?.isDrafted}
            id={water?.['general_information']?.water_id}
            productionName={t('General Information')}
            onPress={() =>
              navigation.navigate('generalInfo', {
                name: 'General Information',
                water_id: water?.['general_information']?.water_id,
                type: 'general_information',
              })
            }
          />
        ) : null}
      </ScrollView>
    </View>
  );
};

export default Water;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    paddingHorizontal: 22,
  },
  subArea: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    // margin: 10,
    marginTop: '5%',
    width: width / 1.04,
    alignItems: 'center',
  },
  divider: {
    alignSelf: 'center',
    height: 1,
    width: '67%',
    color: 'grey',
  },
  uparrow: {
    height: 20,
    width: 20,
  },
});
