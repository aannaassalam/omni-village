import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import ItemHeader from '../../Components/CustomHeader/ItemHeader'
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'

const OtherPersonalHousehold = ({ navigation }) => {
    const { t } = useTranslation()
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('other personal')}
                goBack={() => navigation.goBack()}
            />
            <ScrollView>

                <ItemHeader title={t('Personal & Household Items')} />
                <CustomShowcaseInput
                    productionName={t('Personal Care Items')}
                    onPress={() => navigation.navigate('personalCare', { name: t('Personal Care Items'), type: 'personal_care_items', })}
                />
                <CustomShowcaseInput
                    productionName={t('Cleaning Products')}
                    onPress={() => navigation.navigate('cleaningProduct', { name: t('Cleaning Products'), type: 'cleaning_products', })}
                />
                <CustomShowcaseInput
                    productionName={t('Office Supplies')}
                    onPress={() => navigation.navigate('officeSupplies', { name: t('Office Supplies'), type: 'office_supplies',})}
                />
                <CustomShowcaseInput
                    productionName={t('Medicine')}
                    onPress={() => navigation.navigate('medicine', { name: t('Medicine'), type: 'medicine' })}
                />
                <CustomShowcaseInput
                    productionName={t('Kitchen Items')}
                    onPress={() => navigation.navigate('kitchenItems', { name: t('Kitchen Items'), type: 'kitchen_items',})}
                />
                <CustomShowcaseInput
                    productionName={t('Other Items')}
                    onPress={() => navigation.navigate('otherItems', { name: t('Other Items'), type: 'other_items',})}
                />
            </ScrollView>

        </View>
    )
}

export default OtherPersonalHousehold

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
})