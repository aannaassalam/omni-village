import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'
import { Styles, width } from '../../styles/globalStyles'
import { ActivityIndicator, Divider } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { getHousingByUser, getHousingDropdown } from '../../functions/housing'
import { useQuery } from '@tanstack/react-query'
import { useFocusEffect } from '@react-navigation/native'
import { primaryColor } from '../../styles/colors'

const VehicleCount = ({ navigation, route }) => {
    const { t } = useTranslation()
    // const { data: housing, isLoading, refetch } = useQuery({
    //     queryKey: ['housing_by_user'],
    //     queryFn: () => getHousingByUser(),
    //     refetchOnWindowFocus: true,
    // })
    // useFocusEffect(
    //     useCallback(() => {
    //         refetch()
    //     }, [refetch])
    // )
    // if (isLoading) {
    //     return <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
    //         <ActivityIndicator size={'large'} color={primaryColor} />
    //     </View>
    // }
    const housing = [
        {
            housings: [
                {
                    _id: '1',
                    name_of_the_house: 'House 1'
                },
                {
                    _id: '2',
                    name_of_the_house: 'House 2'
                },
                {
                    _id: '3',
                    name_of_the_house: 'House 3'
                },
                {
                    _id: '4',
                    name_of_the_house: 'House 4'
                },
                {
                    _id: '5',
                    name_of_the_house: 'House 5'
                },
            ],
            house_requirements: true
        }
    ]
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('housing')}
                goBack={() => navigation.goBack()}
            />
            <ScrollView>

                {housing?.total_numbers_of_house > 0 ?
                    <View style={styles.subArea}>
                        <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Fill in details for')}</Text>
                        <Divider
                            bold={true}
                            style={[styles.divider, { width: '65%' }]}
                            horizontalInset={true}
                        />
                    </View>
                    : null
                }
                <View style={styles.mainContainer}>
                    {/* {Array.from({ length: total_numbers_of_house }, (_, index) => { */}
                    {housing[0].housings.map((item, index) => {
                        return <CustomShowcaseInput
                            key={index}
                            productionName={`${t('Vehicle')} ${index + 1}`}
                            style={{ width: '100%' }}
                            progressBar={false}
                            onPress={() => {
                                navigation.navigate('vehicleDetails', { name: `${t('Vehicle')} ${index + 1}`, data: { vehicle_id: item?._id } })
                                // console.log("valyesssss", values)
                            }}
                        />
                    })}
                    {housing[0]?.house_requirements ?
                        <CustomShowcaseInput
                            key={1}
                            productionName={t(`On Vehicle Requirements`)}
                            style={{ width: '100%', }}
                            progressBar={false}
                            onPress={() => {
                                navigation.navigate('vehicleRequirements',{name:'Vehicle Requirement',})
                            }}
                        />
                        : null
                    }
                </View>
            </ScrollView>
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
})