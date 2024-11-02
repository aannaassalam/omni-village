import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'
import { Styles, width } from '../../styles/globalStyles'
import { Divider } from 'react-native-paper'
import { useTranslation } from 'react-i18next'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'

const LandSpecificationQuestioner = ({ navigation, route }) => {
    const { t } = useTranslation()
    const { total_numbers_of_lands, land_requirements } = route.params

    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('landholding')}
                goBack={() => navigation.goBack()}
            />
            <ScrollView>

            {total_numbers_of_lands > 0 ?
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
                {Array.from({ length: total_numbers_of_lands }, (_, index) => {
                    return <CustomShowcaseInput
                        key={index}
                        productionName={`${t('Land')} ${index + 1}`}
                        style={{ width: '100%', }}
                        progressBar={false}
                        onPress={() => {
                            navigation.navigate('landholdingUsage', { land: `Land ${index + 1}`, data:[] })
                        }}
                    />
                })}
                {land_requirements ?
                    <CustomShowcaseInput
                        key={1}
                        productionName={t(`Land Requirements`)}
                        style={{ width: '100%', }}
                        progressBar={false}
                        onPress={() => {
                            navigation.navigate('landholdingLandRequirement',{data:[]})
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