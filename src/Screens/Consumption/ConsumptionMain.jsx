import { StyleSheet, Text, View, useWindowDimensions, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import CustomShowcaseInput from '../../Components/CustomShowcaseInput/CustomShowcaseInput';
import { useDispatch, useSelector } from 'react-redux';
import { getConsumptionType } from '../../Redux/ConsumptionTypeSlice';
import { getConsumptionCrops } from '../../Redux/ConsumptionCropSlice';

const ConsumptionMain = ({ navigation }) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const [loading, setLoading] = useState(false)
    const { consumptionType } = useSelector((state) => state.consumptionType)
    const dispatch = useDispatch()
    useEffect(() => {
        setLoading(true)
        dispatch(getConsumptionType())
            .then(() => {
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={'Consumption'}
                goBack={() => navigation.goBack()}
            />
            {loading ?
                <View style={{marginTop:'60%'}}>
                    <ActivityIndicator size={'large'} color={'#000'} />
                </View>
                :
                <ScrollView>
                    {consumptionType.map((item, indx) => {
                        return (
                            <CustomShowcaseInput
                                key={indx}
                                productionName={item?.name}
                                progressBar={false}
                                onPress={() => {
                                    navigation.navigate('consumption', { typeId: item?._id, typeName: item?.name }),
                                        dispatch(getConsumptionCrops(item?._id))
                                }}
                            />
                        )
                    })}
                </ScrollView>
            }
        </View>
    )
}

export default ConsumptionMain

const makeStyles = fontScale => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    }
})