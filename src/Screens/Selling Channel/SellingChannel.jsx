import { StyleSheet, Text, View, useWindowDimensions,TouchableOpacity,Image } from 'react-native'
import React, { useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import CustomDashboard from '../../Components/CustomDashboard/CustomDashboard'
import CustomButton from '../../Components/CustomButton/CustomButton'

const SellingChannel = ({ navigation }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const [toggleCheckBox, setToggleCheckBox] = useState('')
    const [averageAge, setAverageAge] = useState([
        {
            id: 1,
            age: 'Local Market',
            checked: true
        },
        {
            id: 2,
            age: 'Broker',
            checked: false
        },
        {
            id: 3,
            age: 'Ecommerce',
            checked: false
        },
        {
            id: 4,
            age: 'Export',
            checked: false
        },
        {
            id: 4,
            age: 'None',
            checked: false
        },
    ])
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={'Selling Channel'}
                goBack={() => navigation.goBack()}
            />
            <CustomDashboard
                first={'Production'}
                second={'Selling Channel'}
            />
            {averageAge.map((item)=>{
                return(
                    <View key={item.id} style={styles.mainContainer}>
                    <Text style={[styles.text, {fontSize: 14 / fontScale}]}>
                        {item?.age}
                    </Text>
                    <TouchableOpacity onPress={() => setToggleCheckBox(item?.age)}>
                        {toggleCheckBox === item?.age ?
                            <Image
                                source={require('../../../assets/checked.png')}
                                style={{ height: 30, width: 30 }} />
                            :
                            <Image
                                source={require('../../../assets/unchecked.png')}
                                style={{ height: 30, width: 30 }} />
                        }
                    </TouchableOpacity>
                    </View>
                )
            })}
            <View style={styles.buttonContainer}>
                <CustomButton
                    btnText={'Save'}
                />
            </View>
        </View>
    )
}

export default SellingChannel

const makeStyles = fontScale => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    mainContainer: {
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: 10,
        borderRadius:10,
        borderWidth:1,
        borderColor:'grey',
        width:'90%',
        marginTop:10,
        alignSelf:'center'
    },
    text:{
        color:'#000',
        fontFamily:'ubuntu_medium'
    },
    buttonContainer: {
        width: '90%',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
    },
})