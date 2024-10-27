import { StyleSheet, Text, useWindowDimensions, View } from 'react-native'
import React, { useEffect } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput'
import { useUser } from '../../Hooks/useUser'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { getDemographic } from '../../functions/demographic'
import { get_dropdown_data } from '../../functions/AuthScreens'
import { Styles, width } from '../../styles/globalStyles'
import Input from '../../Components/Inputs/Input'
import { Divider } from 'react-native-paper'
import { primaryColor } from '../../styles/colors'

const Members = ({ navigation }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const { data: user, refetch } = useUser()
    const { t } = useTranslation()
    useEffect(()=>{refetch()},[])
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={t('demographic')}
                goBack={() => navigation.goBack()}
            />
            <View style={styles.mainContainer}>
                <Input
                    label={t('How many members are there in your family?')}
                    editable={false}
                    onChangeText={()=>{}}
                    placeholder={String(user?.members?.length)}
                    fullLength={true}
                />
                <View style={styles.subArea}>
                    <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Fill in details for')}</Text>
                    <Divider
                        bold={true}
                        style={[styles.divider, { width: '65%' }]}
                        horizontalInset={true}
                    />
                    </View>
            </View>
            {user?.members.map((item) => {
                console.log("item", item)
                return <CustomShowcaseInput
                    key={item?._id}
                    productionName={item?.name}
                    progressBar={false}
                    onPress={() => {
                        navigation.navigate('demographic', { member_id: item?._id, demographic_id: item?.demographic_id })
                    }}
                />
            })}
        </View>
    )
}

export default Members

const makeStyles = (fontScale) => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    mainContainer: {
        paddingHorizontal: 22
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