import { StyleSheet, Text, View, useWindowDimensions, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import CustomButton from '../../Components/CustomButton/CustomButton'
import AddAndDeleteCropButton from '../../Components/CropButtons/AddAndDeleteCropButton'
import InputWithoutRightElement from '../../Components/CustomInputField/InputWithoutRightElement'
import AddBottomSheet from '../../Components/BottomSheet/BottomSheet'
import { addFisherycrop, getFisheryCrops } from '../../Redux/FisheryCropSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useFocusEffect } from '@react-navigation/native'
import { getFishery } from '../../Redux/FisherySlice'
import CustomDrodown4 from '../../Components/CustomDropdown/CustomDropdown4'
import CustomDropdown4 from '../../Components/CustomDropdown/CustomDropdown4'
import { getHuntingCrops } from '../../Redux/HuntingCropSlice'

const SubArea = ({ navigation, route }) => {
    const { totalLand, screenName, type, cropId, data } = route.params
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const { fisheryCrop } = useSelector((state) => state.fisheryCrop)
    const { fishery } = useSelector((state) => state.fishery)
    const [cropType, setCropType] = useState([]);
    const [cropModal, setCropModal] = useState(false);
    const [dropdownVal, setDropdownVal] = useState('');
    const [otherCrop, setOtherCrop] = useState({});
    const [focusOther, setFocusOther] = useState(false);
    const dispatch = useDispatch()
    const handleRemoveClick = index => {
        const list = [...cropType];
        list.splice(index, 1);
        setCropType(list);
    };
    const addCrop = () => {
        let ids = cropType.map((i) => i?.fishery_crop?._id||i?._id)
        if (ids.includes(dropdownVal?.name?.value)){
            Alert.alert("Crop Already exists")
            setCropModal(!cropModal);
            setFocusOther(false);
            setDropdownVal('');
        }else{
            setCropType([
                ...cropType,
                {
                    name: dropdownVal.name == 'Others' ? otherCrop.name : dropdownVal.name?.label,
                    _id: dropdownVal.name == 'Others' ? otherCrop._id : dropdownVal.name?.value,
                    progress: '',
                },
            ]);
            setCropModal(!cropModal);
            setFocusOther(false);
            setDropdownVal('');
            setOtherCrop('');
        }
    };
    const addingHuntingCrop = () => {
        if (dropdownVal.name?.label === 'Others') {
            dispatch(addFisherycrop({ name: otherCrop?.name }))
            dispatch(getHuntingCrops())
            setDropdownVal([])
            setOtherCrop('')
        } else {
            addCrop()
        }
    }
    useFocusEffect(
        useCallback(() => {
            dispatch(getFisheryCrops())
            dispatch(getFishery('pond'))
        }, []))
    const DropdownSelectedValue = data => {
        setDropdownVal(data);
        if (data !== 'Others') {
            setFocusOther(false);
        }
    };
    useEffect(() => {
        if (data) {
            setCropType(data)
        } else {
            setCropType([])
        }
    }, [data])
    // console.log("data", cropType)
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={screenName}
                goBack={() => navigation.goBack()}
            />
            <View style={{ marginTop: '5%' }}>
                {cropType[0]!==undefined && 
                cropType?.map((element, i) => {
                    return (
                        <TouchableOpacity
                            style={styles.addAndDeleteButtonSection}
                            onPress={() => {
                                navigation.navigate('fishTypeInput', {
                                    cropType: element?.name,
                                    type: type,
                                    screenName: screenName,
                                    cropId: element?._id,
                                    data: data ? data.find((i) => i?.fishery_crop?.name == element?.name || i?.fishery_crop?.name == element?.fishery_crop?.name) : null
                                })
                            }
                            }>
                            <AddAndDeleteCropButton
                                add={false}
                                cropName={data ? element?.fishery_crop?.name || element?.name : element?.name}
                                onPress={() => handleRemoveClick(i)}
                            />
                        </TouchableOpacity>
                    );
                })}
                {cropType[0] === undefined ? (
                    <View style={styles.addAndDeleteButtonSection}>
                        <AddAndDeleteCropButton
                            add={true}
                            cropName={`Add ${screenName.includes('Pond') ? 'Pond' : 'Sea'} Sub Area`}
                            onPress={() => setCropModal(true)}
                        />
                    </View>
                ) : (
                    <View style={styles.addAndDeleteButtonSection}>
                        <AddAndDeleteCropButton
                            add={true}
                            cropName={`Add ${screenName.includes('Pond') ? 'Pond' : 'Sea'} Sub Area`}
                            onPress={() => setCropModal(true)}
                        />
                    </View>
                )}
            </View>
            {cropModal &&
                <AddBottomSheet>
                    <View style={styles.BottomTopContainer}>
                        <Text style={styles.headerText}>{dropdownVal === 'Others' ? 'Create Fish Type' : 'Add Fish type'}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setCropModal(!cropModal);
                                setFocusOther(false);
                                setDropdownVal('');
                            }}>
                            <Image
                                source={require('../../../assets/close.png')}
                                style={styles.closeIcon}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.dropdownSection}>
                        <CustomDropdown4
                            selectedValue={e => {
                                DropdownSelectedValue({ name: e, _id: e.id })
                            }
                            }
                            data={[...fisheryCrop, { _id: 0, name: 'Others' }]}
                            valu={dropdownVal?.name}
                        />
                        {dropdownVal.name?.label === 'Others' ? (
                            <InputWithoutRightElement
                                label={'Crop Name'}
                                placeholder={'Crop 01'}
                                onChangeText={e => setOtherCrop({ name: e, _id: 0 })}
                                value={otherCrop?.name}
                                onFocus={() => setFocusOther(true)}
                            />
                        ) : null}
                    </View>
                    <View style={styles.BottomSheetButton}>
                        <TouchableOpacity
                            style={styles.crossButton}
                            onPress={() => setCropModal(!cropModal)}>
                            <Image
                                source={require('../../../assets/cross.png')}
                                style={styles.addCropIcon}
                            />
                        </TouchableOpacity>
                        <CustomButton
                            btnText={'Create'}
                            style={{ width: '80%' }}
                            onPress={() => addingHuntingCrop()}
                        />
                    </View>
                </AddBottomSheet>
            }
        </View>
    )
}

export default SubArea

const makeStyles = fontScale => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    addAndDeleteButtonSection: {
        marginTop: '5%',
    },
    BottomTopContainer: {
        justifyContent: 'space-between',
        alignSelf: 'center',
        margin: 10,
        padding: 5,
        flexDirection: 'row',
    },
    headerText: {
        fontFamily: 'ubuntu_medium',
        fontSize: 16 / fontScale,
        color: '#000',
        alignSelf: 'center',
        width: '87%',
    },
    closeIcon: {
        height: 30,
        width: 30,
        alignSelf: 'center',
    },
    BottomSheetButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '5%',
        padding: 10,
        margin: 5,
        alignSelf: 'center',
    },
    crossButton: {
        marginRight: 10,
    },
    dropdownSection: {
        width: '90%',
        justifyContent: 'center',
        alignSelf: 'center'
    },
    addCropIcon: {
        height: 50,
        width: 50,
    },
});