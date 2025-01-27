import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput';
import {Styles, width} from '../../styles/globalStyles';
import {ActivityIndicator, Divider} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {
  deleteHousing,
  getHousingByUser,
  getHousingDropdown,
  getNumberOfHousing,
} from '../../functions/housing';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useFocusEffect} from '@react-navigation/native';
import {primaryColor} from '../../styles/colors';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import ItemHeader from '../../Components/CustomHeader/ItemHeader';

const HouseSpecificationQuestioner = ({navigation, route}) => {
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const {
    data: housing,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['housing_by_user'],
    queryFn: () => getHousingByUser(),
    refetchOnWindowFocus: true,
  });
  const {
    data: get_number_of_housing,
    isLoading: housing_number_loading,
    refetch: housing_number_refetch,
    isFetching: housing_number_isFetching,
  } = useQuery({
    queryKey: ['get_number_of_housing'],
    queryFn: () => getNumberOfHousing(),
    refetchOnWindowFocus: true,
  });
  const {mutate: delete_housing} = useMutation({
    mutationKey: ['delete_housing'],
    mutationFn: async id => {
      deleteHousing(id);
      queryClient.invalidateQueries();
    },
    onSuccess: () => {
      housing_number_refetch();
    },
    onError: error => console.log('error save', error),
    onSettled: () => {},
  });
  useFocusEffect(
    useCallback(() => {
      housing_number_refetch();
    }, [housing_number_refetch]),
  );
  if (isLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
        <ActivityIndicator size={'large'} color={primaryColor} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
          <ItemHeader
              title={t('housing')}
              onPress={() => navigation.replace('housing')}
              edit
          />
        <View style={styles.mainContainer}>
          <FlatList
            data={get_number_of_housing}
            keyExtractor={item => item._id}
            onRefresh={housing_number_refetch}
            refreshing={housing_number_isFetching}
            contentContainerStyle={{paddingBottom: 8}}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={styles.addAndDeleteButtonSection}
                onPress={() => {
                  navigation.navigate('housingDetails', {
                    house:
                      item?.name_of_the_house == ''
                        ? `${t('House')} ${index + 1}`
                        : item?.name_of_the_house,
                    data: {house_id: item?._id},
                  });
                }}>
                <AddAndDeleteCropButton
                  darftStyle={{
                    borderColor: item.status === 1 ? 'grey' : '#e5c05e',
                  }}
                  drafted={item.status === 0}
                  add={false}
                  cropName={
                    item?.name_of_the_house == ''
                      ? `${t('House')} ${index + 1}`
                      : item?.name_of_the_house
                  }
                  onPress={() => {
                    delete_landholding(item._id);
                  }}
                />
              </TouchableOpacity>
            )}
            ListFooterComponent={
              <TouchableOpacity
                style={styles.addAndDeleteButtonSection}
                onPress={() => {
                    navigation.navigate('housingDetails', {
                        house: `${t('House')}`,
                        data: { house_id: null },
                    });
                }}>
                <AddAndDeleteCropButton
                  add={true}
                  cropName={t('add housing')}
                  onPress={() => {
                      navigation.navigate('housingDetails', {
                          house: `${t('House')}`,
                          data: { house_id: null },
                      });
                  }}
                />
              </TouchableOpacity>
            }
          />
          {housing?.house_requirements ? (
            <CustomShowcaseInput
              key={1}
              productionName={t(`House Requirements`)}
              // style={{ width: '100%', }}
              progressBar={false}
              onPress={() => {
                navigation.navigate('housingRequirement');
              }}
            />
          ) : null}
        </View>
    </View>
  );
};

export default HouseSpecificationQuestioner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    // paddingHorizontal: 22,
  },
    addAndDeleteButtonSection: {
        marginTop: '5%',
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
});
