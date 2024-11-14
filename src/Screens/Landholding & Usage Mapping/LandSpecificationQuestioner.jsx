import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect } from 'react'
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'
import { Styles, width } from '../../styles/globalStyles'
import { ActivityIndicator, Divider } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { useQuery } from '@tanstack/react-query'
import { getLandholdingByUser } from '../../functions/landholding'
import { primaryColor } from '../../styles/colors'
import { useUser } from '../../Hooks/useUser'
import { useFocusEffect } from '@react-navigation/native'

const LandSpecificationQuestioner = ({ navigation }) => {
    const { t } = useTranslation()
    const { data: landholding , isLoading, refetch} = useQuery({
        queryKey: ['landholding'],
        queryFn: () => getLandholdingByUser(),
        refetchOnWindowFocus: true,
    })
useFocusEffect(
    useCallback(()=>{
        refetch()
    },[refetch])
)

    if(isLoading){
        return <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <ActivityIndicator size={'large'} color={primaryColor} />
        </View>
    }

    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('landholding')}
                goBack={() => navigation.goBack()}
            />
            <ScrollView>

                {landholding?.total_numbers_of_lands > 0 ?
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
                    {/* {Array.from({ length: landholding?.landholdings?.length }, (item, index) => { */}
                    {landholding?.landholdings?.map((item, index) =>{
                    return <CustomShowcaseInput
                        key={index}
                        productionName={`${t('Land')} ${index + 1}`}
                        style={{ width: '100%', }}
                        progressBar={false}
                        onPress={() => {
                            navigation.navigate('landholdingUsage', { land: `Land ${index + 1}`, data:{land_id: item } })
                        }}
                    />
                })}
                    {landholding?.land_requirements ?
                    <CustomShowcaseInput
                        key={1}
                        productionName={t(`Land Requirements`)}
                        style={{ width: '100%', }}
                        progressBar={false}
                        onPress={() => {
                            navigation.navigate('landholdingLandRequirement')
                        }}
                    />
                    : null
                }
            </View>
            </ScrollView>
        </View>
    )
}

export default LandSpecificationQuestioner

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