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

const HouseSpecificationQuestioner = ({ navigation, route }) => {
    const { t } = useTranslation()
    const { data: housing, isLoading, refetch } = useQuery({
        queryKey: ['housing_by_user'],
        queryFn: () => getHousingByUser(),
        refetchOnWindowFocus: true,
    })
    useFocusEffect(
        useCallback(() => {
            refetch()
        }, [refetch])
    )
    if (isLoading) {
        return <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <ActivityIndicator size={'large'} color={primaryColor} />
        </View>
    }
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
                            productionName={item?.name_of_the_house == "" ? `${t('House')} ${index + 1}` : item?.name_of_the_house}
                            style={{ width: '100%' }}
                            progressBar={false}
                            onPress={() => {
                                navigation.navigate('housingDetails', { house: item?.name_of_the_house == "" ? `${t('House')} ${index + 1}` : item?.name_of_the_house, data: { house_id: item?._id } })
                                // console.log("valyesssss", values)
                            }}
                        />
                    })}
                    {housing[0]?.house_requirements ?
                        <CustomShowcaseInput
                            key={1}
                            productionName={t(`House Requirements`)}
                            style={{ width: '100%', }}
                            progressBar={false}
                            onPress={() => {
                                navigation.navigate('housingRequirement')
                            }}
                        />
                        : null
                    }
                </View>
            </ScrollView>
        </View>
    )
}

export default HouseSpecificationQuestioner

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