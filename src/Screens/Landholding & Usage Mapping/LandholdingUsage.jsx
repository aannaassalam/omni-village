import { Dimensions, Image, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { Styles } from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import { useTranslation } from 'react-i18next';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import Geolocation from 'react-native-geolocation-service';
import { Divider, TextInput } from 'react-native-paper';
import { fontFamilyMedium } from '../../styles/fontStyle';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import { land_pupose, urgency } from '../../MockData/Mockdata';
import InputWithTitle from '../../Components/CustomInputField/InputWithTitle';

const data = {
    total_no_of_land: '',
    land_owned_inside_village: '',
    land_owned_outside_village: '',
    geotag: '',
    purpose_utilised_for: [],
    division_of_area_allocated: '',
    year_purchased: '',
    land_requirement: false,
    area: '',
    purpose: '',
    purpose_other: '',
    urgency: '',
    total_area_allocated_for_village: '',
    total_area_allocated_for_community_infrastaructure_mobility: '',
    land_owned_by_non_resident: '',
    freehold_village_land: ''

}
const LandholdingUsage = ({ navigation }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const { t } = useTranslation()
    const schema = yup.object().shape({
        total_no_of_land: yup.string().required('Required'),
        land_owned_inside_village: yup.string().required('Required'),
        land_owned_outside_village: yup.string().required('Required'),
        geotag: yup.string().required('Required'),
        purpose_utilised_for: yup.array()
            .of(yup.string().required('purpose utilised for is required'))
            .min(1, 'At least one purpose utilised for is required')
            .max(10, 'No more than 10 purpose utilised for are allowed'),
        division_of_area_allocated: yup.string().required('Required'),
        year_purchased: yup.string().required('Required'),
        land_requirement: yup.boolean().required('Required'),
        area: yup.string().required('Required'),
        purpose: yup.string().required('Required'),
        purpose_other: yup.string(),
        urgency: yup.string().required('Required'),
        total_area_allocated_for_village: yup.string(),
        total_area_allocated_for_community_infrastaructure_mobility: yup.string(),
        land_owned_by_non_resident: yup.string(),
        freehold_village_land: yup.string()
    })
    const {
        handleSubmit,
        watch,
        control,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            total_no_of_land: String(data.total_no_of_land || ''),
            land_owned_inside_village: String(data.land_owned_inside_village || ''),
            land_owned_outside_village: String(data.land_owned_outside_village || ''),
            geotag: String(data.geotag || ''),
            purpose_utilised_for: Array(data.purpose_utilised_for),
            division_of_area_allocated: String(data.division_of_area_allocated || ''),
            year_purchased: String(data.year_purchased || ''),
            land_requirement: Boolean(data.land_requirement || false),
            area: String(data.area || ''),
            purpose: String(data.purpose || ''),
            purpose_other: String(data.purpose_other || ''),
            urgency: String(data.urgency || ''),
            total_area_allocated_for_village: String(data.total_area_allocated_for_village || ''),
            total_area_allocated_for_community_infrastaructure_mobility: String(data.total_area_allocated_for_community_infrastaructure_mobility || ''),
            land_owned_by_non_resident: String(data.land_owned_by_non_resident || ''),
            freehold_village_land: String(data.freehold_village_land || ''),
        }
    })
    const requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            const granted = await Geolocation.requestAuthorization('whenInUse');
            Geolocation.setRNConfiguration({
                skipPermissionRequests: false,
                authorizationLevel: 'whenInUse',
            });

            if (granted === 'granted') {
                navigation.navigate('MapScreen', {
                    setCoordinates: coords =>
                        setValue('geotag', `${coords.latitude},${coords.longitude}`),
                    my_location: {
                        lat: parseFloat(watch('geotag').split(',')[0]) || null,
                        lng: parseFloat(watch('geotag').split(',')[1]) || null,
                    },
                });
                return true;
            } else {
                console.log('You cannot use Geolocation');
                return false;
            }

        } else if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    {
                        title: 'Location Access Required!',
                        message: 'We need to access your location for address related data',
                        // buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    },
                );
                if (granted === 'granted') {
                    navigation.navigate('MapScreen', {
                        setCoordinates: coords =>
                            setValue('geotag', `${coords.latitude},${coords.longitude}`),
                        my_location: {
                            lat: parseFloat(watch('geotag').split(',')[0]) || null,
                            lng: parseFloat(watch('geotag').split(',')[1]) || null,
                        },
                    });
                    return true;
                } else {
                    console.log('You cannot use Geolocation');
                    return false;
                }
            } catch (err) {
                return false;
            }
        }
    };

    const getLocation = async () => {
        const result = requestLocationPermission();
        result.then(res => {
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        console.log(position);
                        if (!watch('geotag').length)
                            setValue(
                                'geotag',
                                `${parseFloat(position.coords.latitude).toFixed(7)},${parseFloat(position.coords.longitude).toFixed(7)}`,
                            );
                    },
                    error => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                        setValue('geotag', '');
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            }
        });
    };
    const handleDraft = () => {

    }
    const onSubmit = () => { }
    console.log("watchhhhh", watch('purpose_utilised_for')[0]?.length > 0 ? true : false)
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={'Land Holding & Usage Mapping'}
                goBack={() => navigation.goBack()}
            />
            <ScrollView>
                <View style={styles.mainContainer}>
                    {/* total number of land */}
                    <Controller
                        name="total_no_of_land"
                        control={control}
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <InputWithoutBorder
                                    containerStyle={{ width: width / 1.12 }}
                                    productionName={'Total number of land owned'}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType={'numeric'}
                                />
                            );
                        }}
                    />
                    {errors?.total_no_of_land?.message ? (
                        <Text style={Styles.error}>
                            {errors?.total_no_of_land?.message}
                        </Text>
                    ) : null}
                    {watch('total_no_of_land') ?
                        <View style={Styles.dividerRowContainer}>
                            <Divider style={Styles.verticalLine} />
                            <View style={{ width: width / 1.16 }}>
                                {/* Lands owned inside the village */}
                                <Controller
                                    name="land_owned_inside_village"
                                    control={control}
                                    render={({ field }) => {
                                        const { onChange, value } = field;
                                        return (
                                            <InputWithoutBorder
                                                productionName={'Land owned inside the village'}
                                                onChangeText={onChange}
                                                value={value}
                                                keyboardType={'numeric'}
                                            />
                                        );
                                    }}
                                />
                                {errors?.land_owned_inside_village?.message ? (
                                    <Text style={Styles.error}>
                                        {errors?.land_owned_inside_village?.message}
                                    </Text>
                                ) : null}
                                {/* Land owned outside the village */}
                                <Controller
                                    name="land_owned_outside_village"
                                    control={control}
                                    render={({ field }) => {
                                        const { onChange, value } = field;
                                        return (
                                            <InputWithoutBorder
                                                productionName={'Land owned outside the village'}
                                                onChangeText={onChange}
                                                value={value}
                                                keyboardType={'numeric'}
                                            />
                                        );
                                    }}
                                />
                                {errors?.land_owned_outside_village?.message ? (
                                    <Text style={Styles.error}>
                                        {errors?.land_owned_outside_village?.message}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        : null
                    }
                    {watch('land_owned_inside_village') + watch('land_owned_outside_village') > watch('total_no_of_land') && <Text style={Styles.error}>Land owned can't be more than total number of land</Text>}
                    {/* geotag */}
                    <Controller
                        name="geotag"
                        control={control}
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <View style={styles.textInputContainer}>
                                    <TouchableOpacity onPress={getLocation} activeOpacity={1}>
                                        <TextInput
                                            onChangeText={onChange}
                                            outlineColor="#c6f1d3"
                                            underlineColorAndroid="transparent"
                                            activeOutlineColor="#c6f1d3"
                                            mode="outlined"
                                            outlineStyle={{
                                                borderRadius: 10,
                                            }}
                                            label={
                                                <Text
                                                    style={{
                                                        fontSize: 16 / fontScale,
                                                        textTransform: 'capitalize',
                                                    }}>
                                                    {'Location'}
                                                </Text>
                                            }
                                            value={value}
                                            style={styles.textInput}
                                            placeholder={'Location'}
                                            placeholderTextColor={'#333'}
                                            keyboardType="default"
                                            editable={false}
                                            right={
                                                <TextInput.Icon
                                                    icon="crosshairs-gps"
                                                    size={24}
                                                    color="#268C43"
                                                    onPress={getLocation}
                                                />
                                                // <Image
                                                //   style={{width: 24, height: 24}}
                                                //   source={require('../../../assets/gps.svg')}
                                                //   // height={100}
                                                // />
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        }}
                    />
                    {errors?.geotag?.message ? (
                        <Text style={Styles.error}>
                            {errors?.geotag?.message}
                        </Text>
                    ) : null}
                    {/* purpose utilised for */}
                    <Controller
                        control={control}
                        name="purpose_utilised_for"
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <MultiselectDropdown
                                    containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                                    data={[{ key: 'Cricket', name: 'Cricket' }, { key: 'Football', name: 'Football' }, { key: 'Story Books', name: 'Story Books' }]}
                                    setSelectedd={onChange}
                                    selectedd={value?.length>=0?value:[]}
                                    infoName={'Purpose utilised for'}
                                />
                            );
                        }}
                    />
                    {errors?.purpose_utilised_for && errors?.purpose_utilised_for[0]?.message || errors?.purpose_utilised_for?.message ? (
                        <Text style={styles.error}>
                            {errors?.purpose_utilised_for[0]?.message || errors?.purpose_utilised_for?.message}
                        </Text>
                    ) : null}
                    {watch('purpose_utilised_for')[0]?.length > 0 ?
                        <View style={[Styles.dividerRowContainer, { width: '88%', alignSelf: 'center' }]}>
                            <Divider style={Styles.verticalLine} />
                            <View style={{ width: width / 1.14, }}>
                                <Controller
                                    name="division_of_area_allocated"
                                    control={control}
                                    render={({ field }) => {
                                        const { onChange, value } = field;
                                        return (
                                            <InputWithoutBorder
                                                productionName={'Division of area alocated under each purpose'}
                                                onChangeText={onChange}
                                                value={value}
                                                keyboardType={'numeric'}
                                            />
                                        );
                                    }}
                                />
                                {errors?.division_of_area_allocated?.message ? (
                                    <Text style={Styles.error}>
                                        {errors?.division_of_area_allocated?.message}
                                    </Text>
                                ) : null}
                                {/* Land owned outside the village */}
                                <Controller
                                    name="year_purchased"
                                    control={control}
                                    render={({ field }) => {
                                        const { onChange, value } = field;
                                        return (
                                            <InputWithoutBorder
                                                productionName={'Year purchased'}
                                                onChangeText={onChange}
                                                value={value}
                                                keyboardType={'numeric'}
                                            />
                                        );
                                    }}
                                />
                                {errors?.year_purchased?.message ? (
                                    <Text style={Styles.error}>
                                        {errors?.year_purchased?.message}
                                    </Text>
                                ) : null}
                            </View>
                        </View>
                        : null
                    }
                    {/* land Requirement */}
                    <View style={{ paddingHorizontal: 6 }}>
                        <Text style={styles.item_header_txt}>Do you have a lamd requirement ?</Text>
                        <View style={styles.item_container}>
                            <Controller
                                name="land_requirement"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <TouchableOpacity onPress={() => onChange(true)}>
                                            {value === true ? (
                                                <Image
                                                    source={require('../../../assets/checked.png')}
                                                    style={{ height: 22, width: 22 }}
                                                />
                                            ) : (
                                                <Image
                                                    source={require('../../../assets/unchecked.png')}
                                                    style={{ height: 22, width: 22 }}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                            <Text style={styles.option_text}>Yes</Text>
                            <Controller
                                name="land_requirement"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <TouchableOpacity onPress={() => onChange(false)} >
                                            {value === false ? (
                                                <Image
                                                    source={require('../../../assets/checked.png')}
                                                    style={{ height: 22, width: 22 }}
                                                />
                                            ) : (
                                                <Image
                                                    source={require('../../../assets/unchecked.png')}
                                                    style={{ height: 22, width: 22 }}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                            <Text style={styles.option_text}>No</Text>
                        </View>
                        {errors?.land_requirement?.message ? (
                            <Text style={styles.error}>
                                {errors?.land_requirement?.message}
                            </Text>
                        ) : null}
                    </View>
                    {/* if land requirement yes */}
                    {watch('land_requirement') ?
                        <View>
                            <Controller
                                name="area"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <InputWithoutBorder
                                            containerStyle={{ width: width / 1.12 }}
                                            productionName={'Area'}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType={'numeric'}
                                        />
                                    );
                                }}
                            />
                            {errors?.area?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.area?.message}
                                </Text>
                            ) : null}
                            {/* purpose */}
                            <Controller
                                control={control}
                                name="purpose"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <CustomDropdown3
                                            containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                                            data={land_pupose}
                                            selectedValue={onChange}
                                            value={value}
                                            defaultVal={{ key: value, value: value }}
                                            infoName={'Purpose'}
                                        />
                                    );
                                }}
                            />
                            {errors?.purpose?.message ? (
                                <Text style={styles.error}>
                                    {errors?.purpose?.message}
                                </Text>
                            ) : null}
                            {watch('purpose') == "Others" ?
                                <View>
                                    <Controller
                                        control={control}
                                        name="purpose_other"
                                        render={({ field }) => {
                                            const { onChange, value } = field;
                                            return (
                                                <InputWithTitle
                                                    productName={'Others'}
                                                    onChangeText={onChange}
                                                    value={value}
                                                    keyboardType={'default'}
                                                />
                                            );
                                        }}
                                    />
                                    {errors?.purpose_other?.message ? (
                                        <Text style={styles.error}>
                                            {errors?.purpose_other?.message}
                                        </Text>
                                    ) : null}
                                </View>
                                : null
                            }
                        </View>
                        : null
                    }
                    <Controller
                        control={control}
                        name="urgency"
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <CustomDropdown3
                                    containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                                    data={urgency}
                                    selectedValue={onChange}
                                    value={value}
                                    defaultVal={{ key: value, value: value }}
                                    infoName={'Urgency'}
                                />
                            );
                        }}
                    />
                    {errors?.urgency?.message ? (
                        <Text style={styles.error}>
                            {errors?.urgency?.message}
                        </Text>
                    ) : null}
                    {/* total area allocated village  */}
                    <Controller
                        name="total_area_allocated_for_village"
                        control={control}
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <InputWithoutBorder
                                    containerStyle={{ width: width / 1.12 }}
                                    productionName={'Total area allocated to the village'}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType={'numeric'}
                                />
                            );
                        }}
                    />
                    {errors?.total_area_allocated_for_village?.message ? (
                        <Text style={Styles.error}>
                            {errors?.total_area_allocated_for_village?.message}
                        </Text>
                    ) : null}
                    {/* total area allocated for community */}
                    <Controller
                        name="total_area_allocated_for_community_infrastaructure_mobility"
                        control={control}
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <InputWithoutBorder
                                    containerStyle={{ width: width / 1.12 }}
                                    productionName={'Total area allocated for community infrastructure including mobility'}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType={'numeric'}
                                />
                            );
                        }}
                    />
                    {errors?.total_area_allocated_for_community_infrastaructure_mobility?.message ? (
                        <Text style={Styles.error}>
                            {errors?.total_area_allocated_for_community_infrastaructure_mobility?.message}
                        </Text>
                    ) : null}
                    {/* Land owned by non resident */}
                    <Controller
                        name="land_owned_by_non_resident"
                        control={control}
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <InputWithoutBorder
                                    containerStyle={{ width: width / 1.12 }}
                                    productionName={'Land owned by non-residents '}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType={'numeric'}
                                />
                            );
                        }}
                    />
                    {errors?.land_owned_by_non_resident?.message ? (
                        <Text style={Styles.error}>
                            {errors?.land_owned_by_non_resident?.message}
                        </Text>
                    ) : null}
                    {/* freehold */}
                    <Controller
                        name="freehold_village_land"
                        control={control}
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <InputWithoutBorder
                                    containerStyle={{ width: width / 1.12 }}
                                    productionName={'Freehold Village Land  '}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType={'numeric'}
                                />
                            );
                        }}
                    />
                    {errors?.freehold_village_land?.message ? (
                        <Text style={Styles.error}>
                            {errors?.freehold_village_land?.message}
                        </Text>
                    ) : null}
                </View>
                <View style={Styles.bottomPopupbutton}>
                    <CustomButton
                        style={Styles.submitButton}
                        btnText={'Submit'}
                        onPress={() => {
                            setSavepopup(true)
                        }}
                    />
                    <CustomButton
                        style={Styles.draftButton}
                        btnText={'Save as draft'}
                        onPress={() => {
                            setDraftpopup(true)
                        }}
                    />
                </View>
            </ScrollView>
            {/* submit popup */}
            <PopupModal
                modalVisible={savePopup}
                setBottomModalVisible={setSavepopup}
                styleInner={[Styles.savePopup, { width: '90%' }]}>
                <View style={Styles.submitPopup}>
                    <View style={Styles.noteImage}>
                        <Image
                            source={require('../../../assets/note.png')}
                            style={Styles.noteImage}
                        />
                    </View>
                    <Text style={Styles.confirmText}>{t('confirm')}</Text>
                    <Text style={Styles.nextText}>
                        {t('lorem ipsum is simply dummy text of the.Lorem Ipsum.')}
                    </Text>
                    <View style={Styles.bottomPopupbutton}>
                        <CustomButton
                            style={Styles.submitButton}
                            btnText={t('submit')}
                            onPress={handleSubmit(onSubmit)}
                        // loading={isAddPoultryPending || isEditPoultryPending}
                        />
                        <CustomButton
                            style={Styles.draftButton}
                            btnText={t('cancel')}
                            onPress={() => {
                                setSavepopup(false);
                            }}
                        />
                    </View>
                </View>
            </PopupModal>
            {/* draft popup */}
            <PopupModal
                modalVisible={draftPopup}
                setBottomModalVisible={setDraftpopup}
                styleInner={[Styles.savePopup, { width: '90%' }]}>
                <View style={Styles.submitPopup}>
                    <View style={Styles.noteImage}>
                        <Image
                            source={require('../../../assets/note.png')}
                            style={Styles.noteImage}
                        />
                    </View>
                    <Text style={Styles.confirmText}>{t('save as draft')}</Text>
                    <Text style={Styles.nextText}>
                        {t('lorem ipsum is simply dummy text of the.Lorem Ipsum.')}
                    </Text>
                    <View style={Styles.bottomPopupbutton}>
                        <CustomButton
                            style={Styles.submitButton}
                            btnText={t('save')}
                            onPress={handleDraft}
                        // loading={isAddPoultryPending || isEditPoultryPending}
                        />
                        <CustomButton
                            style={Styles.draftButton}
                            btnText={t('cancel')}
                            onPress={() => setDraftpopup(false)}
                        />
                    </View>
                </View>
            </PopupModal>
        </View>
    )
}

export default LandholdingUsage
const { width } = Dimensions.get('window')
const makeStyles = fontScale => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 12,
    },
    mainContainer: {
        paddingHorizontal: 10,
        paddingVertical: 12,
    },
    textInputContainer: {
        marginTop: 16,
        width: width / 1.12,
        alignSelf: 'center',
    },
    textInput: {
        backgroundColor: '#fff',
        fontFamily: fontFamilyMedium,
        fontSize: 16 / fontScale,
        textAlign: 'auto',
    },
    item_header_txt: {
        fontSize: 14 / fontScale,
        fontFamily: fontFamilyMedium,
        textAlign: 'left',
        color: '#000',
        marginTop: 10,
        padding: 10,
    },
    item_container: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        marginVertical: 4,
    },
    option_text: {
        alignSelf: 'center',
        paddingHorizontal: 10,
        color: '#000',
        fontSize: 14 / fontScale,
        fontFamily: fontFamilyMedium,
    },
})