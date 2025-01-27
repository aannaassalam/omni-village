import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput';
import {fontScale, Styles, width} from '../../styles/globalStyles';
import {ActivityIndicator, Divider} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  deleteLandholding,
  getLandholding,
  getLandholdingByUser,
  getNumberOfLandholding,
} from '../../functions/landholding';
import {primaryColor} from '../../styles/colors';
import {useUser} from '../../Hooks/useUser';
import {useFocusEffect} from '@react-navigation/native';
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton';
import ItemHeader from '../../Components/CustomHeader/ItemHeader';
import {fontFamilyRegular} from '../../styles/fontStyle';

const LandSpecificationQuestioner = ({navigation}) => {
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const {
    data: landholding,
    isLoading,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['landholding_user'],
    queryFn: () => getLandholdingByUser(),
    refetchOnWindowFocus: true,
  });
  const {
    data: get_number_of_landholding,
    isLoading: landholding_number_loading,
    refetch: landholding_number_refetch,
    isFetching: landholding_number_isFetching,
  } = useQuery({
    queryKey: ['get_number_of_landholding'],
    queryFn: () => getNumberOfLandholding(),
    refetchOnWindowFocus: true,
  });
  const {mutate: delete_landholding} = useMutation({
    mutationKey: ['delete_landholding'],
    mutationFn: async id => {
      deleteLandholding(id);
      queryClient.invalidateQueries();
    },
    onSuccess: () => {
      landholding_number_refetch();
    },
    onError: error => console.log('error save', error),
    onSettled: () => {},
  });
  useFocusEffect(
    useCallback(() => {
      landholding_number_refetch();
    }, [landholding_number_refetch]),
  );

  if (isLoading || landholding_number_loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
        <ActivityIndicator size={'large'} color={primaryColor} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ItemHeader
        title={t('landholding')}
        onPress={() => navigation.replace('landholdingTotalLand', {edit: true})}
        edit
      />
      <View style={styles.mainContainer}>
        {/* {Array.from({ length: landholding?.landholdings?.length }, (item, index) => { */}
        {/* {landholding?.landholdings?.map((item, index) =>{
                    return <CustomShowcaseInput
                        key={index}
                        productionName={`${t('Land')} ${index + 1}`}
                        style={{ width: '100%', }}
                        progressBar={false}
                        onPress={() => {
                            navigation.navigate('landholdingUsage', { land: `Land ${index + 1}`, data:{land_id: item } })
                        }}
                    />
                })} */}
        <FlatList
          data={get_number_of_landholding}
          keyExtractor={item => item._id}
          onRefresh={landholding_number_refetch}
          refreshing={landholding_number_isFetching}
          contentContainerStyle={{paddingBottom: 8}}
          renderItem={({item, index}) => (
            <TouchableOpacity
              style={styles.addAndDeleteButtonSection}
              onPress={() => {
                navigation.navigate('landholdingUsage', {
                  land: `Land ${index + 1}`,
                  data: {land_id: item?._id},
                });
              }}>
              <AddAndDeleteCropButton
                darftStyle={{
                  borderColor: item.status === 1 ? 'grey' : '#e5c05e',
                }}
                drafted={item.status === 0}
                add={false}
                cropName={`Land ${index + 1}`}
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
                navigation.navigate('landholdingUsage', {
                  land: `Land`,
                  data: {land_id: null},
                });
              }}>
              <AddAndDeleteCropButton
                add={true}
                cropName={t('add landholdings')}
                onPress={() => {
                  navigation.navigate('landholdingUsage', {
                    land: `Land`,
                    data: {land_id: null},
                  });
                }}
              />
            </TouchableOpacity>
          }
        />
        {landholding?.land_requirements ? (
          <CustomShowcaseInput
            key={1}
            productionName={t(`Land Requirements`)}
            progressBar={false}
            style={{marginTop: 0}}
            onPress={() => {
              navigation.navigate('landholdingLandRequirement');
            }}
          />
        ) : null}
      </View>
    </View>
  );
};

export default LandSpecificationQuestioner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    // paddingHorizontal: 12,
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
  addAndDeleteButtonSection: {
    marginTop: '5%',
  },
});
