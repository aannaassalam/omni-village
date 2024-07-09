import { Dimensions, Image, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Styles } from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import { Divider } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import DocumentPicker, { types } from 'react-native-document-picker';
import UploadImage from '../../Components/UploadImage/UploadImage';

const data = {
    land_utilized_for_main_family_housing: '',
    number_of_units_built: '',
    total_built_up_area: '',
    no_of_floors: '',
    living_area: '',
    year_built: '',
    year_last_renovated: '',
    year_last_expanded: '',
    type: '',
    front_photo: null,
    neighborhood: null,
    back_photo: null,
    inside_living_kitchen: null,
    amenities: [],
    household: '',
    land_utilized_for_farmhouses: '',
    number_of_units_built_farmhouses: '',
    total_built_up_area_farmhouses: '',
    no_of_floors_farmhouses: '',
    year_built_farmhouses: '',
    year_last_renovated_farmhouses: '',
    year_last_expanded_farmhouses: '',
    type_farmhouses: '',
    front_photo_farmhouses: null,
    neighborhood_farmhouses: null,
    back_photo_farmhouses: null,
    inside_living_kitchen_farmhouses: null,
    amenities_farmhouses: [],
}
const Housing = ({ navigation }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    const [savePopup, setSavepopup] = useState(false)
    const [draftPopup, setDraftpopup] = useState(false)
    const [previewImage,setPreviewImage] = useState(false)
    const [selectedFile,setSelecetdFile] = useState(null)
    const { t } = useTranslation()
    const schema = yup.object().shape({
        land_utilized_for_main_family_housing: yup.string().required('Required'),
        number_of_units_built: yup.string().required('Required'),
        total_built_up_area: yup.string().required('Required'),
        no_of_floors: yup.string().required('Required'),
        living_area: yup.string().required('Required'),
        year_built: yup.string().required('Required'),
        year_last_renovated: yup.string().required('Required'),
        year_last_expanded: yup.string().required('Required'),
        type: yup.string().required('Required'),
        front_photo: yup.object().required('Required'),
        neighborhood: yup.object().required('Required'),
        back_photo: yup.object().required('Required'),
        inside_living_kitchen: yup.object().required('Required'),
        amenities: yup.array().min(2, 'You must have at least 2 amenities').required('Required'),
        household: yup.string(),
        land_utilized_for_farmhouses: yup.string().required('Required'),
        number_of_units_built_farmhouses: yup.string().required('Required'),
        total_built_up_area_farmhouses: yup.string().required('Required'),
        no_of_floors_farmhouses: yup.string().required('Required'),
        year_built_farmhouses: yup.string().required('Required'),
        year_last_renovated_farmhouses: yup.string().required('Required'),
        year_last_expanded_farmhouses: yup.string().required('Required'),
        type_farmhouses: yup.string().required('Required'),
        front_photo_farmhouses: yup.object().required('Required'),
        neighborhood_farmhouses: yup.object().required('Required'),
        back_photo_farmhouses: yup.object().required('Required'),
        inside_living_kitchen_farmhouses: yup.object().required('Required'),
        amenities_farmhouses: yup.array().min(2, 'You must have at least 2 amenities').required('Required'),
    })
    const {
        handleSubmit,
        watch,
        control,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            land_utilized_for_main_family_housing: String(data?.land_utilized_for_main_family_housing || ''),
            number_of_units_built: String(data?.number_of_units_built || ''),
            total_built_up_area: String(data?.total_built_up_area || ''),
            no_of_floors: String(data?.no_of_floors || ''),
            living_area: String(data?.living_area || ''),
            year_built: String(data?.year_built || ''),
            year_last_renovated: String(data?.year_last_renovated || ''),
            year_last_expanded: String(data?.year_last_expanded || ''),
            type: String(data?.type || ''),
            front_photo: Object(data?.front_photo || null),
            neighborhood: Object(data?.neighborhood || null),
            back_photo: Object(data?.back_photo || null),
            inside_living_kitchen: Object(data?.inside_living_kitchen || null),
            amenities: data?.amenities || null,
            household: String(data?.household || ''),
            land_utilized_for_farmhouses: String(data?.land_utilized_for_farmhouses || ''),
            number_of_units_built_farmhouses: String(data?.number_of_units_built_farmhouses || ''),
            total_built_up_area_farmhouses: String(data?.total_built_up_area_farmhouses || ''),
            no_of_floors_farmhouses: String(data?.no_of_floors_farmhouses || ''),
            year_built_farmhouses: String(data?.year_built_farmhouses || ''),
            year_last_renovated_farmhouses: String(data?.year_last_renovated_farmhouses || ''),
            year_last_expanded_farmhouses: String(data?.year_last_expanded_farmhouses || ''),
            type_farmhouses: String(data?.type_farmhouses || ''),
            front_photo_farmhouses: Object(data?.front_photo_farmhouses || null),
            neighborhood_farmhouses: Object(data?.neighborhood_farmhouses || null),
            back_photo_farmhouses: Object(data?.back_photo_farmhouses || null),
            inside_living_kitchen_farmhouses: Object(data?.inside_living_kitchen_farmhouses || null),
            amenities_farmhouses: data?.amenities || null,
        }
    })
    const handleDocumentSelection = useCallback(async (title) => {
        try {
            const response = await DocumentPicker.pick({
                presentationStyle: 'fullScreen',
                type: [types.images],
                allowMultiSelection: false,
                copyTo:'documentDirectory'
            });
            console.log("response", response)
            setValue(title, response[0])
        } catch (err) {
            console.warn(err);
        }
    }, []);

    const handleDocumentRemove = useCallback(async (title)=>{
        setValue(title, null)
    },[])
    const handleDraft = () => {

    }
    const onSubmit = () => { }

    const currentYear = new Date().getFullYear();
    const [tempYear, setTempYear] = useState([currentYear])
    const yearOptions = () => {
        const yearArray = [];
        for (let year = 1950; year <= currentYear; year++) {
            yearArray.push(year.toString());
        }
        return setTempYear(yearArray);
    };
    useEffect(() => {
        yearOptions()
    }, [])
    return (
        <View style={styles.container}>
            <CustomHeader
                backIcon={true}
                headerName={'Housing'}
                goBack={() => navigation.goBack()}
            />
            <ScrollView>
                <View style={styles.mainContainer}>
                    <Controller
                        control={control}
                        name="land_utilized_for_main_family_housing"
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <InputWithoutBorder
                                    containerStyle={{ width: width / 1.12 }}
                                    productionName={'Land utilized for Main Family housing'}
                                    value={value}
                                    keyboardType='numeric'
                                    onChangeText={onChange}
                                    notRightText={false}
                                />
                            );
                        }}
                    />
                    {errors?.land_utilized_for_main_family_housing?.message ? (
                        <Text style={Styles.error}>
                            {errors?.land_utilized_for_main_family_housing?.message}
                        </Text>
                    ) : null}
                    {/* {watch('land_utilized_for_main_family_housing') ? */}
                    <View style={Styles.dividerRowContainer}>
                        <Divider style={Styles.verticalLine} />
                        <View style={{ width: width / 1.134 }}>
                            {/* number_of_units_built */}
                            <Controller
                                name="number_of_units_built"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <InputWithoutBorder
                                            productionName={'Number of units built '}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType={'numeric'}
                                        />
                                    );
                                }}
                            />
                            {errors?.number_of_units_built?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.number_of_units_built?.message}
                                </Text>
                            ) : null}
                            {/* total_built_up_area */}
                            <Controller
                                name="total_built_up_area"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <InputWithoutBorder
                                            productionName={'Total Built Up Area '}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType={'numeric'}
                                        />
                                    );
                                }}
                            />
                            {errors?.total_built_up_area?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.total_built_up_area?.message}
                                </Text>
                            ) : null}
                            {/* No of floor */}
                            <Controller
                                name="no_of_floors"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <InputWithoutBorder
                                            productionName={'Number of floors '}
                                            onChangeText={onChange}
                                            value={value}
                                            notRightText={true}
                                            keyboardType={'numeric'}
                                        />
                                    );
                                }}
                            />
                            {errors?.no_of_floors?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.no_of_floors?.message}
                                </Text>
                            ) : null}
                            {/* Living area */}
                            <Controller
                                name="living_area"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <InputWithoutBorder
                                            productionName={'Living area'}
                                            onChangeText={onChange}
                                            value={value}
                                            notRightText={false}
                                            keyboardType={'numeric'}
                                        />
                                    );
                                }}
                            />
                            {errors?.living_area?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.living_area?.message}
                                </Text>
                            ) : null}
                            {/* Year built */}
                            <Controller
                                name="year_built"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <TouchableOpacity style={Styles.yearPickerBtn}>
                                            <Text style={styles.yearBuiltText}>Year Built</Text>
                                            <Picker
                                                selectedValue={value}
                                                onValueChange={onChange}
                                                style={{ color: '#000' }}
                                            >
                                                {tempYear?.map((year) => (
                                                    <Picker.Item key={year} label={year.toString()} value={year} style={{ color: '#fff' }} />
                                                ))}
                                            </Picker>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                            {errors?.year_built?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.year_built?.message}
                                </Text>
                            ) : null}
                            {/* year last renovated */}
                            <Controller
                                name="year_last_renovated"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <TouchableOpacity style={Styles.yearPickerBtn}>
                                            <Text style={styles.yearBuiltText}>Year last renovated</Text>
                                            <Picker
                                                selectedValue={value}
                                                onValueChange={onChange}
                                                style={{ color: '#000' }}
                                            >
                                                {tempYear?.map((year) => (
                                                    <Picker.Item key={year} label={year.toString()} value={year} style={{ color: '#fff' }} />
                                                ))}
                                            </Picker>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                            {errors?.year_last_renovated?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.year_last_renovated?.message}
                                </Text>
                            ) : null}
                            {/* Year last expanded */}
                            <Controller
                                name="year_last_expanded"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <TouchableOpacity style={Styles.yearPickerBtn}>
                                            <Text style={styles.yearBuiltText}>Year last expanded</Text>
                                            <Picker
                                                selectedValue={value}
                                                onValueChange={onChange}
                                                style={{ color: '#000' }}
                                            >
                                                {tempYear?.map((year) => (
                                                    <Picker.Item key={year} label={year.toString()} value={year} style={{ color: '#fff' }} />
                                                ))}
                                            </Picker>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                            {errors?.year_last_expanded?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.year_last_expanded?.message}
                                </Text>
                            ) : null}
                            {/* type */}
                            <Controller
                                control={control}
                                name="type"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <CustomDropdown3
                                            // containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                                            data={[]}
                                            selectedValue={onChange}
                                            value={value}
                                            defaultVal={{ key: value, value: value }}
                                            infoName={'Type'}
                                        />
                                    );
                                }}
                            />
                            {errors?.type?.message ? (
                                <Text style={styles.error}>
                                    {errors?.type?.message}
                                </Text>
                            ) : null}
                            {/* Upload front photo */}
                            <Controller
                                control={control}
                                name="front_photo"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <UploadImage
                                            title={'Upload front photo'}
                                            handleDocumentSelection={() => handleDocumentSelection('front_photo')}
                                            image={value}
                                            handleDocumentRemove={()=>handleDocumentRemove('front_photo')}
                                            previewImage={() => { setPreviewImage(true), setSelecetdFile(value?.fileCopyUri)}}
                                        />
                                    )
                                }}
                            />
                            {errors?.front_photo?.message ?
                                <Text style={Styles.error}>
                                    {errors?.front_photo?.message}
                                </Text>
                                : null}
                                {/* neightborhood */}
                            <Controller
                                control={control}
                                name="neighborhood"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <UploadImage
                                            title={'Upload neighbourhood photo'}
                                            handleDocumentSelection={() => handleDocumentSelection('neighborhood')}
                                            image={value}
                                            handleDocumentRemove={() => handleDocumentRemove('neighborhood')}
                                            previewImage={() => { setPreviewImage(true), setSelecetdFile(value?.fileCopyUri) }}
                                        />
                                    )
                                }}
                            />
                            {errors?.neighborhood?.message ?
                                <Text style={Styles.error}>
                                    {errors?.neighborhood?.message}
                                </Text>
                                : null}
                                {/* back photo */}
                            <Controller
                                control={control}
                                name="back_photo"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <UploadImage
                                            title={'Upload back photo'}
                                            handleDocumentSelection={() => handleDocumentSelection('back_photo')}
                                            image={value}
                                            handleDocumentRemove={() => handleDocumentRemove('back_photo')}
                                            previewImage={() => { setPreviewImage(true), setSelecetdFile(value?.fileCopyUri) }}
                                        />
                                    )
                                }}
                            />
                            {errors?.back_photo?.message ?
                                <Text style={Styles.error}>
                                    {errors?.back_photo?.message}
                                </Text>
                                : null}
                                {/* inside living kitchen */}
                            <Controller
                                control={control}
                                name="inside_living_kitchen"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <UploadImage
                                            title={'Upload inside living kitchen photo'}
                                            handleDocumentSelection={() => handleDocumentSelection('inside_living_kitchen')}
                                            image={value}
                                            handleDocumentRemove={() => handleDocumentRemove('inside_living_kitchen')}
                                            previewImage={() => { setPreviewImage(true), setSelecetdFile(value?.fileCopyUri) }}
                                        />
                                    )
                                }}
                            />
                            {errors?.inside_living_kitchen?.message ?
                                <Text style={Styles.error}>
                                    {errors?.inside_living_kitchen?.message}
                                </Text>
                                : null}
                            {/* Amenities */}
                            <Controller
                                control={control}
                                name="amenities"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <MultiselectDropdown
                                            // containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                                            data={[{ key: 'Cricket', name: 'Cricket' }, { key: 'Football', name: 'Football' }, { key: 'Story Books', name: 'Story Books' }]}
                                            setSelectedd={onChange}
                                            selectedd={value?.length >= 0 ? value : []}
                                            infoName={'Amenities'}
                                        />
                                    );
                                }}
                            />
                            {errors?.amenities && errors?.amenities[0]?.message || errors?.amenities?.message ? (
                                <Text style={styles.error}>
                                    {errors?.amenities[0]?.message || errors?.amenities?.message}
                                </Text>
                            ) : null}
                            {/* Household needs if any */}
                            <Controller
                                control={control}
                                name="household"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <InputWithoutBorder
                                            // containerStyle={{ width: width / 1.12 }}
                                            productionName={'Household needs if any'}
                                            value={value}
                                            keyboardType='default'
                                            onChangeText={onChange}
                                            notRightText={true}
                                        />
                                    );
                                }}
                            />
                            {errors?.household?.message ?
                                <Text style={Styles.error}>
                                    {errors?.household?.message}
                                </Text>
                                : null}
                        </View>
                    </View>
                    {/* : null
                    } */}
                    <Controller
                        control={control}
                        name="land_utilized_for_farmhouses"
                        render={({ field }) => {
                            const { onChange, value } = field;
                            return (
                                <InputWithoutBorder
                                    containerStyle={{ width: width / 1.12 }}
                                    productionName={'Land utilized for farmhouses'}
                                    value={value}
                                    keyboardType='numeric'
                                    onChangeText={onChange}
                                    notRightText={false}
                                />
                            );
                        }}
                    />
                    {errors?.land_utilized_for_farmhouses?.message ? (
                        <Text style={Styles.error}>
                            {errors?.land_utilized_for_farmhouses?.message}
                        </Text>
                    ) : null}
                    <View style={Styles.dividerRowContainer}>
                        <Divider style={Styles.verticalLine} />
                        <View style={{ width: width / 1.134 }}>
                            {/* number_of_units_built */}
                            <Controller
                                name="number_of_units_built_farmhouses"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <InputWithoutBorder
                                            productionName={'Number of units built '}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType={'numeric'}
                                        />
                                    );
                                }}
                            />
                            {errors?.number_of_units_built_farmhouses?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.number_of_units_built_farmhouses?.message}
                                </Text>
                            ) : null}
                            {/* total_built_up_area */}
                            <Controller
                                name="total_built_up_area_farmhouses"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <InputWithoutBorder
                                            productionName={'Total Built Up Area '}
                                            onChangeText={onChange}
                                            value={value}
                                            keyboardType={'numeric'}
                                        />
                                    );
                                }}
                            />
                            {errors?.total_built_up_area_farmhouses?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.total_built_up_area_farmhouses?.message}
                                </Text>
                            ) : null}
                            {/* No of floor */}
                            <Controller
                                name="no_of_floors_farmhouses"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <InputWithoutBorder
                                            productionName={'Number of floors '}
                                            onChangeText={onChange}
                                            value={value}
                                            notRightText={true}
                                            keyboardType={'numeric'}
                                        />
                                    );
                                }}
                            />
                            {errors?.no_of_floors_farmhouses?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.no_of_floors_farmhouses?.message}
                                </Text>
                            ) : null}
                            {/* Year built */}
                            <Controller
                                name="year_built_farmhouses"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <TouchableOpacity style={Styles.yearPickerBtn}>
                                            <Text style={styles.yearBuiltText}>Year Built</Text>
                                            <Picker
                                                selectedValue={value}
                                                onValueChange={onChange}
                                                style={{ color: '#000' }}
                                            >
                                                {tempYear?.map((year) => (
                                                    <Picker.Item key={year} label={year.toString()} value={year} style={{ color: '#fff' }} />
                                                ))}
                                            </Picker>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                            {errors?.year_built_farmhouses?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.year_built_farmhouses?.message}
                                </Text>
                            ) : null}
                            {/* year last renovated */}
                            <Controller
                                name="year_last_renovated_farmhouses"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <TouchableOpacity style={Styles.yearPickerBtn}>
                                            <Text style={styles.yearBuiltText}>Year last renovated</Text>
                                            <Picker
                                                selectedValue={value}
                                                onValueChange={onChange}
                                                style={{ color: '#000' }}
                                            >
                                                {tempYear?.map((year) => (
                                                    <Picker.Item key={year} label={year.toString()} value={year} style={{ color: '#fff' }} />
                                                ))}
                                            </Picker>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                            {errors?.year_last_renovated_farmhouses?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.year_last_renovated_farmhouses?.message}
                                </Text>
                            ) : null}
                            {/* Year last expanded */}
                            <Controller
                                name="year_last_expanded_farmhouses"
                                control={control}
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <TouchableOpacity style={Styles.yearPickerBtn}>
                                            <Text style={styles.yearBuiltText}>Year last expanded</Text>
                                            <Picker
                                                selectedValue={value}
                                                onValueChange={onChange}
                                                style={{ color: '#000' }}
                                            >
                                                {tempYear?.map((year) => (
                                                    <Picker.Item key={year} label={year.toString()} value={year} style={{ color: '#fff' }} />
                                                ))}
                                            </Picker>
                                        </TouchableOpacity>
                                    );
                                }}
                            />
                            {errors?.year_last_expanded_farmhouses?.message ? (
                                <Text style={Styles.error}>
                                    {errors?.year_last_expanded_farmhouses?.message}
                                </Text>
                            ) : null}
                            {/* type */}
                            <Controller
                                control={control}
                                name="type_farmhouses"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <CustomDropdown3
                                            // containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                                            data={[]}
                                            selectedValue={onChange}
                                            value={value}
                                            defaultVal={{ key: value, value: value }}
                                            infoName={'Type'}
                                        />
                                    );
                                }}
                            />
                            {errors?.type_farmhouses?.message ? (
                                <Text style={styles.error}>
                                    {errors?.type_farmhouses?.message}
                                </Text>
                            ) : null}
                            {/* Upload front photo */}
                            <Controller
                                control={control}
                                name="front_photo_farmhouses"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <UploadImage
                                            title={'Upload front photo'}
                                            handleDocumentSelection={() => handleDocumentSelection('front_photo_farmhouses')}
                                            image={value}
                                            handleDocumentRemove={() => handleDocumentRemove('front_photo_farmhouses')}
                                            previewImage={() => { setPreviewImage(true), setSelecetdFile(value?.fileCopyUri) }}
                                        />
                                    )
                                }}
                            />
                            {errors?.front_photo_farmhouses?.message ?
                                <Text style={Styles.error}>
                                    {errors?.front_photo_farmhouses?.message}
                                </Text>
                                : null}
                            {/* neightborhood */}
                            <Controller
                                control={control}
                                name="neighborhood_farmhouses"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <UploadImage
                                            title={'Upload neighbourhood photo'}
                                            handleDocumentSelection={() => handleDocumentSelection('neighborhood_farmhouses')}
                                            image={value}
                                            handleDocumentRemove={() => handleDocumentRemove('neighborhood_farmhouses')}
                                            previewImage={() => { setPreviewImage(true), setSelecetdFile(value?.fileCopyUri) }}
                                        />
                                    )
                                }}
                            />
                            {errors?.neighborhood_farmhouses?.message ?
                                <Text style={Styles.error}>
                                    {errors?.neighborhood_farmhouses?.message}
                                </Text>
                                : null}
                            {/* back photo */}
                            <Controller
                                control={control}
                                name="back_photo_farmhouses"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <UploadImage
                                            title={'Upload back photo'}
                                            handleDocumentSelection={() => handleDocumentSelection('back_photo_farmhouses')}
                                            image={value}
                                            handleDocumentRemove={() => handleDocumentRemove('back_photo_farmhouses')}
                                            previewImage={() => { setPreviewImage(true), setSelecetdFile(value?.fileCopyUri) }}
                                        />
                                    )
                                }}
                            />
                            {errors?.back_photo_farmhouses?.message ?
                                <Text style={Styles.error}>
                                    {errors?.back_photo_farmhouses?.message}
                                </Text>
                                : null}
                            {/* inside living kitchen */}
                            <Controller
                                control={control}
                                name="inside_living_kitchen_farmhouses"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <UploadImage
                                            title={'Upload inside living kitchen photo'}
                                            handleDocumentSelection={() => handleDocumentSelection('inside_living_kitchen_farmhouses')}
                                            image={value}
                                            handleDocumentRemove={() => handleDocumentRemove('inside_living_kitchen_farmhouses')}
                                            previewImage={() => { setPreviewImage(true), setSelecetdFile(value?.fileCopyUri) }}
                                        />
                                    )
                                }}
                            />
                            {errors?.inside_living_kitchen_farmhouses?.message ?
                                <Text style={Styles.error}>
                                    {errors?.inside_living_kitchen_farmhouses?.message}
                                </Text>
                                : null}
                            {/* Amenities */}
                            <Controller
                                control={control}
                                name="amenities_farmhouses"
                                render={({ field }) => {
                                    const { onChange, value } = field;
                                    return (
                                        <MultiselectDropdown
                                            // containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                                            data={[{ key: 'Cricket', name: 'Cricket' }, { key: 'Football', name: 'Football' }, { key: 'Story Books', name: 'Story Books' }]}
                                            setSelectedd={onChange}
                                            selectedd={value?.length >= 0 ? value : []}
                                            infoName={'Amenities'}
                                        />
                                    );
                                }}
                            />
                            {errors?.amenities_farmhouses && errors?.amenities_farmhouses[0]?.message || errors?.amenities_farmhouses?.message ? (
                                <Text style={styles.error}>
                                    {errors?.amenities_farmhouses[0]?.message || errors?.amenities_farmhouses?.message}
                                </Text>
                            ) : null}
                        </View>
                    </View>
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
            {/* Preview image */}
            <PopupModal
                modalVisible={previewImage}
                setBottomModalVisible={setPreviewImage}
                styleInner={[Styles.savePopup, { width: '90%',height: '40%' }]}>
                <View style={[Styles.submitPopup]}>
                    <Image
                    source={{uri: selectedFile}}
                    style={{width: width/1.2, height: height/3.5}}
                    resizeMode='contain'
                    />
                        <CustomButton
                            style={[Styles.submitButton, {marginTop:16, width: 150}]}
                            btnText={'OK'}
                            onPress={() => {
                                setPreviewImage(false);
                            }}
                        />
                </View>
            </PopupModal>
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

export default Housing
const { width, height } = Dimensions.get('window')
const makeStyles = fontScale => StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    mainContainer: {
        paddingHorizontal: 10,
    },
    yearBuiltText: {
        color: 'green',
        fontSize: 12 / fontScale,
        marginTop: 4,
        marginLeft: 12,
        fontFamily: 'ubuntu-medium',
        textTransform: 'capitalize',
    },
})