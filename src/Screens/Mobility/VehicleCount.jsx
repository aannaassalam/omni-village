import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'
import { Styles, width } from '../../styles/globalStyles'
import { ActivityIndicator, Divider } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useFocusEffect } from '@react-navigation/native'
import { primaryColor } from '../../styles/colors'
import { deleteMobility, getMobilityByUser, getMobilityDropdown, getNumberOfMobility } from '../../functions/mobility'
import ItemHeader from '../../Components/CustomHeader/ItemHeader'
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton'

const VehicleCount = ({ navigation }) => {
    const { t } = useTranslation()
    const queryClient = useQueryClient()
    const { data: get_mobility_by_user, isLoading, refetch } = useQuery({
        queryKey: ['get_mobility_by_user'],
        queryFn: () => getMobilityByUser(),
        refetchOnWindowFocus: true,
    })
    const { data: get_number_of_mobility, isLoading: number_of_mobility_loading, refetch: number_of_mobility_loading_refetch, isFetching } = useQuery({
        queryKey: ['get_number_of_mobility'],
        queryFn: () => getNumberOfMobility(),
        refetchOnWindowFocus: true,
    })
    const { mutate: delete_mobility } = useMutation({
        mutationKey: ['delete_mobility'],
        mutationFn: async id => {
            deleteMobility(id);
            queryClient.invalidateQueries();
        },
        onSuccess: () => {
            number_of_mobility_loading_refetch();
        },
        onError: error => console.log('error save', error),
        onSettled: () => { },
    });
    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [refetch])
    )
    if (isLoading || number_of_mobility_loading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <ActivityIndicator size={'large'} color={primaryColor} />
        </View>
    }
    return (
        <View style={styles.container}>
            <ItemHeader
                title={t('mobility')}
                onPress={() => navigation.replace('mobility')}
                edit
            />
                <View style={styles.mainContainer}>
                    {/* {Array.from({ length: total_numbers_of_house }, (_, index) => { */}
                    {/* {get_mobility_by_user?.mobilities.map((item, index) => {
                        return <CustomShowcaseInput
                            key={index}
                            productionName={`${t('Vehicle')} ${index + 1}`}
                            style={{ width: '100%' }}
                            progressBar={false}
                            onPress={() => {
                                navigation.navigate('vehicleDetails', { name: `${t('Vehicle')} ${index + 1}`,  mobility_id: item  })
                                // console.log("valyesssss", values)
                            }}
                        />
                    })} */}
                <FlatList
                    data={get_number_of_mobility}
                    keyExtractor={item => item._id}
                    onRefresh={number_of_mobility_loading_refetch}
                    refreshing={isFetching}
                    contentContainerStyle={{ paddingBottom: 8 }}
                    renderItem={({ item, index }) => (
                        <TouchableOpacity
                            style={styles.addAndDeleteButtonSection}
                            onPress={() => {
                                navigation.navigate('vehicleDetails', { name: `${t('Vehicle')} ${index + 1}`, mobility_id: item?._id });
                            }}>
                            <AddAndDeleteCropButton
                                darftStyle={{
                                    borderColor: item.status === 1 ? 'grey' : '#e5c05e',
                                }}
                                drafted={item.status === 0}
                                add={false}
                                cropName={
                                    `${t('Vehicle')} ${index + 1}`
                                }
                                onPress={() => {
                                    delete_mobility(item._id);
                                }}
                            />
                        </TouchableOpacity>
                    )}
                    ListFooterComponent={
                        <TouchableOpacity
                            style={styles.addAndDeleteButtonSection}
                            onPress={() => {
                                navigation.navigate('vehicleDetails', { name: `${t('Vehicle')}`, mobility_id: null })
                            }}>
                            <AddAndDeleteCropButton
                                add={true}
                                cropName={t('add mobility')}
                                onPress={() => {
                                    navigation.navigate('vehicleDetails', { name: `${t('Vehicle')}`, mobility_id: null })
                                }}
                            />
                        </TouchableOpacity>
                    }
                />
                    {get_mobility_by_user?.vehicle_requirement ?
                        <CustomShowcaseInput
                            key={1}
                            productionName={t(`On Vehicle Requirements`)}
                            progressBar={false}
                            onPress={() => {
                                navigation.navigate('vehicleRequirements',{name:t('Vehicle Requirement'),})
                            }}
                        />
                        : null
                    }
                </View>
        </View>
    )
}

export default VehicleCount

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
})