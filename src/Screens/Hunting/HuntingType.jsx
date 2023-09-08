import {
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
    Image,
    TouchableOpacity,
    Dimensions,
    ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import ImportantInformationTress from '../../Components/Accordion/ImportantInformationTress';
import { Divider } from 'react-native-paper';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import ProductDescription from '../../Components/CustomDashboard/ProductDescription';
import Checkbox from '../../Components/Checkboxes/Checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign'
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import ImportantInformationHunting from '../../Components/Accordion/ImportantInformationHunting';
import ProductionInformation from '../../Components/Accordion/ProductionInformation';
import UtilisationAccordion from '../../Components/Accordion/UtilisationAccordion';
import { validation } from '../../Validation/Validation';
import Toast from 'react-native-toast-message';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { addHunting, editHunting, getHunting } from '../../Redux/HuntingSlice';
import { useDispatch } from 'react-redux';
const HuntingType = ({ navigation, route }) => {
    const { cropType, data, cropId } = route.params;
    const [impInfo, setImpInfo] = useState(true);
    const [harvestedProduct, setHarvestedProduct] = useState(true);
    const [productionInfo, setProductionInfo] = useState(true)
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    const [income, setIncome] = useState('');
    const [expenditure, setExpenditure] = useState('');
    const [treeAge, setTreeAge] = useState(false)
    const [harvestProdAdd, setHarvestProdAdd] = useState(false)
    const [focus, setFocus] = useState(false)
    const [savepopup, setSavepopup] = useState(false);
    const [draftpopup, setDraftpopup] = useState(false);
    const [productName, setProductName] = useState('')
    const [yields, setYields] = useState('')
    const dispatch = useDispatch()
    const [others, setOthers] = useState('');
    const [toggleCheckBox, setToggleCheckBox] = useState('')
    const addProduct = () => {
        setHarvestedProductList([...harvestedProductList, { productName: productName }])
        setProductName('')
    }
    const toggleItem = (value, index) => {
        const newValue = averageAge.map((checkbox, i) => {
            if (i !== index)
                return {
                    ...checkbox,
                    checked: false,
                }
            if (i === index) {
                const item = {
                    ...checkbox,
                    checked: !checkbox.checked,
                }
                return item
            }
            return checkbox
        })
        setAverageAge(newValue)
    }
    const schema = yup.object().shape({
        important_information: yup.object().shape({
            number_hunted: yup.string().required(validation.error.number_hunted),
        }),
        utilisation_information: yup.object().shape({
            meat: yup.string().required(validation.error.meat),
            self_consumed: yup.string().required(validation.error.self_consumed),
            sold_to_neighbours: yup.string().required(validation.error.sold_to_neighbours),
            sold_in_consumer_market: yup.string().required(validation.error.sold_for_industrial_use),
            wastage: yup.string().required(validation.error.wastage),
            other: yup.string().required(validation.error.other),
            other_value: yup.string().required(validation.error.other_value),
        }),
        income_from_sale: yup.string().required(validation.error.income_from_sale),
        expenditure_on_inputs: yup.string().required(validation.error.expenditure_on_inputs),
        yeild: yup.string().required(validation.error.yeild),
        processing_method: yup.string().required(validation.error.processing_method),
    });
// console.log("cropid", cropId)
    const {
        handleSubmit,
        setValue,
        getValues,
        watch,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            important_information: {
                number_hunted: String(data?.number_hunted || 0),
            },
            utilisation_information: {
                meat: String(data?.meat || 0),
                self_consumed: String(data?.self_consumed || 0),
                sold_in_consumer_market: String(data?.sold_in_consumer_market || 0),
                sold_to_neighbours: String(data?.sold_in_consumer_market || 0),
                wastage: String(data?.wastage || 0),
                other: String(data?.other || ''),
                other_value: String(data?.other_value || 0)
            },
            expenditure_on_inputs: String(data?.expenditure_on_inputs || 0),
            income_from_sale: String(data?.income_from_sale || 0), // TODO: add validation for this field
            yeild: String(data?.yeild || 0),
            processing_method: Boolean(data?.processing_method || false),
        },
    });
    useEffect(() => {
        setValue(
            'yeild',
            String(
                parseInt(getValues('utilisation_information.meat'), 10) /
                parseInt(getValues('important_information.number_hunted'), 10) || '0',
            ),
        );
    }, [watch('important_information.number_hunted'), watch('utilisation_information.meat')]);

    const onSubmit = () => {
        if (data?._id) {
            dispatch(
                editHunting({
                    number_hunted: watch('important_information.number_hunted'),
                    utilisation_information: watch('utilisation_information'),
                    income_from_sale: watch('income_from_sale'),
                    expenditure_on_inputs: watch('expenditure_on_inputs'),
                    yeild: watch('yeild'),
                    processing_method: watch('processing_method'),
                    status: 1,
                    crop_id: cropId,
                }),
            )
                .unwrap()
                .then(
                    () =>
                        Toast.show({
                            text1: 'Success',
                            text2: 'Trees updated successfully!',
                        }),
                    dispatch(getHunting()),
                    navigation.goBack(),
                )
                .catch(err => {
                    console.log('err', err);
                    Toast.show({
                        type: 'error',
                        text1: 'Error Occurred',
                        text2: 'Something Went wrong, Please try again later!',
                    });
                })
                .finally(() => setSavepopup(false));
        } else {
            dispatch(
                addHunting({
                    number_hunted: watch('important_information.number_hunted'),
                    utilisation_information: watch('utilisation_information'),
                    income_from_sale: watch('income_from_sale'),
                    expenditure_on_inputs: watch('expenditure_on_inputs'),
                    yeild: watch('yeild'),
                    processing_method: watch('processing_method'),
                    status: 1,
                    crop_id: cropId
                }),
            )
                .unwrap()
                .then(
                    () =>
                        Toast.show({
                            text1: 'Success',
                            text2: 'Trees added successfully!',
                        }),
                    dispatch(getHunting()),
                    navigation.goBack(),
                )
                .catch(err => {
                    console.log('err at add', err);
                    Toast.show({
                        type: 'error',
                        text1: 'Error Occurred',
                        text2: 'Something Went wrong, Please try again later!',
                    });
                })
                .finally(() => setSavepopup(false));
        }
    };

    // console.log("watch and check", watch('utilisation_information'), watch('important_information'), watch('processing_method'))

    return (
        <View style={styles.container}>
            <CustomHeader
                goBack={() => navigation.goBack()}
                headerName={cropType}
                backIcon={true}
            />
            <ScrollView>
                <View style={styles.textInputArea}>
                    {/* important information section */}
                    <View style={styles.subArea}>
                        <Text style={styles.subAreaText}>Important Information</Text>
                        <Divider
                            bold={true}
                            style={[styles.divider, { width: '45%' }]}
                            horizontalInset={true}
                        />
                        <TouchableOpacity onPress={() => setImpInfo(!impInfo)}>
                            {impInfo ? (
                                <Image
                                    source={require('../../../assets/arrowUp.png')}
                                    style={styles.uparrow}
                                />
                            ) : (
                                <Image
                                    source={require('../../../assets/arrowDown.png')}
                                    style={styles.uparrow}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    {impInfo ? <View style={styles.impContainer}>
                        <Controller
                            control={control}
                            name='important_information.number_hunted'
                            render={({ field }) => {
                                const { onChange, value } = field;
                                return (
                                    <InputWithoutBorder
                                        measureName={'kg'}
                                        productionName={'Number'}
                                        value={value}
                                        onChangeText={onChange}
                                        notRightText={true}
                                    />
                                );
                            }}
                        />
                        {errors?.important_information?.number_hunted.message ? (
                            <Text style={styles.error}>{errors?.important_information?.number_hunted.message}</Text>
                        ) : null}
                    </View> : null}
                    {/* production information */}
                    <View style={styles.subArea}>
                        <Text style={styles.subAreaText}>Production Information</Text>
                        <Divider
                            bold={true}
                            style={[styles.divider, { width: '45%' }]}
                            horizontalInset={true}
                        />
                        <TouchableOpacity
                            onPress={() => setProductionInfo(!productionInfo)}>
                            {productionInfo ? (
                                <Image
                                    source={require('../../../assets/arrowUp.png')}
                                    style={styles.uparrow}
                                />
                            ) : (
                                <Image
                                    source={require('../../../assets/arrowDown.png')}
                                    style={styles.uparrow}
                                />
                            )}
                        </TouchableOpacity>
                    </View>
                    {productionInfo ?
                        <View style={styles.perContainer}>
                            <Controller
                                control={control}
                                name='utilisation_information.meat'
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <InputWithoutBorder
                                            measureName={'kg'}
                                            productionName={'Meat'}
                                            value={value}
                                            onChangeText={onChange}
                                        />
                                    );
                                }}
                            />
                            {errors?.utilisation_information?.meat.message ? (
                                <Text style={styles.error}>{errors?.utilisation_information?.meat.message}</Text>
                            ) : null}
                            <View style={styles.innerInputView}>
                                <Divider style={styles.divider2} />
                                <View style={{ width: '100%' }} >
                                    <Controller
                                        control={control}
                                        name='utilisation_information.self_consumed'
                                        render={({ field }) => {
                                            const { onChange, value } = field;
                                            return (
                                                <InputWithoutBorder
                                                    measureName={'kg'}
                                                    productionName={'Self Comsumed'}
                                                    value={value}
                                                    onChangeText={onChange}
                                                />
                                            )
                                        }}
                                    />
                                    {errors?.utilisation_information?.self_consumed.message ? (
                                        <Text style={styles.error}>{errors?.utilisation_information?.self_consumed.message}</Text>
                                    ) : null}
                                    <Controller
                                        name="utilisation_information.sold_to_neighbours"
                                        control={control}
                                        render={({ field }) => {
                                            const { onChange, value } = field;
                                            return (
                                                <InputWithoutBorder
                                                    measureName={'kg'}
                                                    productionName="Sold to Neighbours"
                                                    value={value}
                                                    multiline={false}
                                                    notRightText={false}
                                                    onChangeText={onChange}
                                                />
                                            );
                                        }}
                                    />
                                    {errors?.utilisation_information?.sold_to_neighbours?.message ? (
                                        <Text style={styles.error}>
                                            {errors?.utilisation_information?.sold_to_neighbours?.message}
                                        </Text>
                                    ) : null}
                                    <Controller
                                        name="utilisation_information.sold_in_consumer_market"
                                        control={control}
                                        render={({ field }) => {
                                            const { onChange, value } = field;
                                            return (
                                                <InputWithoutBorder
                                                    measureName={'kg'}
                                                    productionName="Sold for Industrial Use"
                                                    value={value}
                                                    multiline={false}
                                                    notRightText={false}
                                                    onChangeText={onChange}
                                                />
                                            );
                                        }}
                                    />
                                    {errors?.utilisation_information?.sold_in_consumer_market?.message ? (
                                        <Text style={styles.error}>
                                            {errors?.utilisation_information?.sold_in_consumer_market?.message}
                                        </Text>
                                    ) : null}
                                    <Controller
                                        name="utilisation_information.wastage"
                                        control={control}
                                        render={({ field }) => {
                                            const { onChange, value } = field;
                                            return (
                                                <InputWithoutBorder
                                                    measureName={'kg'}
                                                    productionName="Wastage"
                                                    value={value}
                                                    multiline={false}
                                                    notRightText={false}
                                                    onChangeText={onChange}
                                                />
                                            );
                                        }}
                                    />
                                    {errors?.utilisation_information?.wastage?.message ? (
                                        <Text style={styles.error}>
                                            {errors?.utilisation_information?.wastage?.message}
                                        </Text>
                                    ) : null}
                                    <Controller
                                        name="utilisation_information.other"
                                        control={control}
                                        render={({ field }) => {
                                            const { onChange, value } = field;
                                            return (
                                                <InputWithoutBorder
                                                    measureName={'kg'}
                                                    productionName="Others"
                                                    value={value}
                                                    multiline={false}
                                                    notRightText={true}
                                                    onChangeText={onChange}
                                                    keyboardType='default'
                                                />
                                            );
                                        }}
                                    />
                                    <View style={styles.innerInputView}>
                                        <Divider style={styles.divider2} />
                                        <View style={{ width: '100%' }}>
                                            <Controller
                                                name="utilisation_information.other_value"
                                                control={control}
                                                render={({ field }) => {
                                                    const { onChange, value } = field;
                                                    return (
                                                        <InputWithoutBorder
                                                            measureName={'kg'}
                                                            productionName={
                                                                watch('utilisation_information.other')
                                                                    ? watch('utilisation_information.other')
                                                                    : 'Other Value'
                                                            }
                                                            value={value}
                                                            multiline={false}
                                                            notRightText={false}
                                                            editable={watch('utilisation_information.other').length > 0}
                                                            onChangeText={onChange}
                                                        />
                                                    );
                                                }}
                                            />
                                            {errors?.utilisation_information?.other_value?.message ? (
                                                <Text style={styles.error}>
                                                    {errors?.utilisation_information?.other_value?.message}
                                                </Text>
                                            ) : null}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        : null} 
                        <View style={{width:'95%', alignSelf:'center'}}>

                    <Controller
                        name='income_from_sale'
                        control={control}
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <InputWithoutBorder
                                    measureName={'USD'}
                                    productionName={'Income from sale'}
                                    value={value}
                                    onChangeText={onChange}
                                />
                            );
                        }}
                    />
                    {errors?.income_from_sale?.message ? (
                        <Text style={styles.error}>
                            {errors?.income_from_sale?.message}
                        </Text>
                    ) : null}
                    <Controller
                        name='expenditure_on_inputs'
                        control={control}
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <InputWithoutBorder
                                    measureName={'USD'}
                                    productionName={'Expenditure on inputs'}
                                    value={value}
                                    onChangeText={onChange}
                                />
                            );
                        }}
                    />
                    {errors?.expenditure_on_inputs?.message ? (
                        <Text style={styles.error}>
                            {errors?.expenditure_on_inputs?.message}
                        </Text>
                    ) : null}
                    <Controller
                        name='yeild'
                        control={control}
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <InputWithoutBorder
                                    measureName={'USD'}
                                    productionName={'Yields'}
                                    value={value}
                                    onChangeText={onChange}
                                    notRightText={true}
                                    editable={false}
                                />
                            );
                        }}
                    />
                    {errors?.yeild?.message ? (
                        <Text style={styles.error}>
                            {errors?.yeild?.message}
                        </Text>
                    ) : null}
                    <Text style={styles.processing_text}>Required Processing method if any for the outputs</Text>
                    <View style={styles.processing_container}>
                        <Controller
                            name='processing_method'
                            control={control}
                            render={({ field }) => {
                                const { onChange, value } = field;
                                return (
                                    <TouchableOpacity onPress={() =>onChange(true)}>
                                        {value === true ?
                                            <Image
                                                source={require('../../../assets/checked.png')}
                                                style={{ height: 30, width: 30 }} />
                                            :
                                            <Image
                                                source={require('../../../assets/unchecked.png')}
                                                style={{ height: 30, width: 30 }} />
                                        }
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        <Text style={styles.yes_text}>Yes</Text>
                        <Controller
                            name='processing_method'
                            control={control}
                            render={({ field }) => {
                                const { onChange, value } = field;
                                return (
                                    <TouchableOpacity onPress={() => onChange(false)}>
                                        {value === false?
                                            <Image
                                                source={require('../../../assets/checked.png')}
                                                style={{ height: 30, width: 30 }} />
                                            :
                                            <Image
                                                source={require('../../../assets/unchecked.png')}
                                                style={{ height: 30, width: 30 }} />

                                        }
                                    </TouchableOpacity>
                                );
                            }}
                        />
                        <Text style={styles.yes_text}>No</Text>
                    </View>
                </View>
                <View style={styles.bottomPopupbutton}>
                    <CustomButton
                        style={styles.submitButton}
                        btnText={'Submit'}
                        onPress={() => { setSavepopup(true) }}
                    />
                    <CustomButton
                        style={styles.draftButton}
                        btnText={'Save as draft'}
                        onPress={() => { setDraftpopup(true) }}
                    />
                </View>
                        </View>
                {/* submit popup */}
                <PopupModal
                    modalVisible={savepopup}
                    setBottomModalVisible={setSavepopup}
                    styleInner={[styles.savePopup, { width: '90%' }]}>
                    <View style={styles.submitPopup}>
                        <View style={styles.noteImage}>
                            <Image
                                source={require('../../../assets/note.png')}
                                style={styles.noteImage}
                            />
                        </View>
                        <Text style={styles.confirmText}>Confirm</Text>
                        <Text style={styles.nextText}>
                            Lorem Ipsum is simply dummy text of the.Lorem Ipsum.
                        </Text>
                        <View style={styles.bottomPopupbutton}>
                            <CustomButton
                                style={styles.submitButton}
                                btnText={'Submit'}
                                onPress={() => {
                                    setSavepopup(false), 
                                    onSubmit()
                                }}
                            />
                            <CustomButton
                                style={styles.draftButton}
                                btnText={'Cancel'}
                                onPress={() => {
                                    setSavepopup(false), navigation.goBack();
                                }}
                            />
                        </View>
                    </View>
                </PopupModal>
                {/* draft popup */}
                <PopupModal
                    modalVisible={draftpopup}
                    setBottomModalVisible={setDraftpopup}
                    styleInner={[styles.savePopup, { width: '90%' }]}>
                    <View style={styles.submitPopup}>
                        <View style={styles.noteImage}>
                            <Image
                                source={require('../../../assets/note.png')}
                                style={styles.noteImage}
                            />
                        </View>
                        <Text style={styles.confirmText}>Save as Draft</Text>
                        <Text style={styles.nextText}>
                            Lorem Ipsum is simply dummy text of the.Lorem Ipsum.
                        </Text>
                        <View style={styles.bottomPopupbutton}>
                            <CustomButton
                                style={styles.submitButton}
                                btnText={'Save'}
                                onPress={() => setDraftpopup(false)}
                            />
                            <CustomButton
                                style={styles.draftButton}
                                btnText={'Cancel'}
                                onPress={() => setDraftpopup(false)}
                            />
                        </View>
                    </View>
                </PopupModal>
            </ScrollView>
            <Toast
                positionValue={30}
                style={{ height: 'auto', minHeight: 70 }}
                width={300}
            />
        </View>
    )
}

export default HuntingType

const width = Dimensions.get('window').width;
const makeStyles = fontScale =>
    StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#fff',
        },
        textInputArea: {
            alignSelf: 'center',
            width: '95%',
        },
        subArea: {
            alignSelf: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            margin: 10,
            marginTop: '5%',
            width: width / 1.04,
        },
        divider: {
            alignSelf: 'center',
            height: 1,
            width: '67%',
            marginTop: 5,
            color: 'grey',
        },
        divider2: {
            // backgroundColor: 'grey',
            alignSelf: 'flex-start',
            height: '100%',
            marginTop: 9,
            width: '1%',
            borderRadius: 10,
        },
        innerInputView: {
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
            width: '95%',
            marginBottom: '5%',
        },
        subAreaText: {
            alignSelf: 'center',
            fontSize: 14 / fontScale,
            color: '#000',
            fontFamily: 'ubuntu',
        },
        uparrow: {
            height: 20,
            width: 20,
        },
        closeIcon: {
            height: 30,
            width: 30,
            alignSelf: 'center',
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
        chck_container: {
            alignSelf: 'center',
            width: '90%',
        },
        add_button: {
            width: '20%',
            padding: 8,
            alignSelf: 'flex-start',
            justifyContent: 'space-around',
            backgroundColor: '#263238',
            flexDirection: 'row',
            marginLeft: 13,
            borderRadius: 8,
            marginTop: '5%'
        },
        add_button_text: {
            fontFamily: 'ubuntu_regular',
            fontSize: 14 / fontScale,
            color: '#fff',
            alignSelf: 'center',
        },
        harvested_prod_container: {
            alignSelf: 'center',
            width: '90%',
            marginBottom: 10
        },
        savePopup: {
            justifyContent: 'center',
            width: '97%',
            borderRadius: 20,
        },
        popupButton: {
            width: '70%',
            alignSelf: 'center',
        },
        bottomPopupbutton: {
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'space-between',
            marginTop: '5%',
        },
        submitButton: {
            width: '45%',
            margin: 10,
        },
        draftButton: {
            width: '45%',
            margin: 10,
            backgroundColor: 'grey',
        },
        confirmText: {
            alignSelf: 'center',
            fontSize: 18 / fontScale,
            color: '#000',
            fontFamily: 'ubuntu_medium',
            fontWeight: '500',
            padding: 10,
            textAlign: 'center',
        },
        nextText: {
            alignSelf: 'center',
            fontSize: 18 / fontScale,
            color: '#000',
            fontFamily: 'ubuntu',
            textAlign: 'center',
        },
        submitPopup: {
            alignItems: 'center',
            padding: 10,
        },
        noteImage: {
            padding: 10,
        },
        processing_container: {
            flexDirection: 'row',
            paddingHorizontal: 10,
            marginBottom: 10
        },
        processing_text: {
            fontSize: 14 / fontScale,
            fontFamily: 'ubuntu_medium',
            textAlign: 'left',
            color: '#000',
            marginTop: 10,
            padding: 10
        },
        yes_text: {
            alignSelf: 'center',
            paddingHorizontal: 10,
            color: '#000',
            fontSize: 14 / fontScale,
            fontFamily: 'ubuntu_medium'
        },
        impContainer: {
            width: '95%',
            alignSelf: 'center',
        },
        perContainer: {
            width: '95%',
            alignSelf: 'center',
        }
    });