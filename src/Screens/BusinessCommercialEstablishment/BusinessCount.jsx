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
import { getMobilityByUser } from '../../functions/mobility'

const BusinessCount = ({ navigation, route }) => {
    const { t } = useTranslation()
    // const { data: get_business_by_user, isLoading, refetch } = useQuery({
    //     queryKey: ['get_business_by_user'],
    //     queryFn: () => getMobilityByUser(),
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
    const get_mobility_by_user={
        mobilities:[1,2,3],
        vehicle_requirement: true
    }
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('business')}
                goBack={() => navigation.goBack()}
            />
            <ScrollView>

                {get_mobility_by_user?.mobilities > 0 ?
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
                    {get_mobility_by_user.mobilities.map((item, index) => {
                        return <CustomShowcaseInput
                            key={index}
                            productionName={`${t('Business')} ${index + 1}`}
                            style={{ width: '100%' }}
                            progressBar={false}
                            onPress={() => {
                                navigation.navigate('businessName', { name: item?.name? item?.name:`${t('Business')} ${index + 1}`, id: item })
                                // console.log("valyesssss", values)
                            }}
                        />
                    })}
                    {get_mobility_by_user?.vehicle_requirement ?
                        <CustomShowcaseInput
                            key={1}
                            productionName={t(`New Business Details`)}
                            style={{ width: '100%', }}
                            progressBar={false}
                            onPress={() => {
                                navigation.navigate('newBusinessDetails', { name: t('New Business Details'), })
                            }}
                        />
                        : null
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default BusinessCount

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