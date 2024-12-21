import { PermissionsAndroid, Platform, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'
import * as yup from 'yup';
import { useFormik } from 'formik';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import { useTranslation } from 'react-i18next';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Styles, width } from '../../styles/globalStyles';
import Geolocation from 'react-native-geolocation-service';
import Input from '../../Components/Inputs/Input';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import YearPicker from '../../Components/YearPicker/YearPicker';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { primaryColor } from '../../styles/colors';
import AcresElement from '../../Components/ui/AcresElement';
import { useUser } from '../../Hooks/useUser';
import { useQuery } from '@tanstack/react-query';
import { getBusiness, getBusinessDropdown } from '../../functions/business';
import { ActivityIndicator } from 'react-native-paper';

const BusinessName = ({navigation, route}) => {
    const { name, id } = route.params;
    const {t} = useTranslation()
    const {data: user} = useUser()
    const { data: business_dropdown, isLoading, refetch } = useQuery({
        queryKey: ['business_dropdown'],
        queryFn: () => getBusinessDropdown(),
        refetchOnWindowFocus: true,
    })
    const { data: business, isLoading: isBusinessLoading } = useQuery({
        queryKey: ['business'],
        queryFn: () => getBusiness(id),
        refetchOnWindowFocus: true,
    })
    const scheme = yup.object().shape({
        business_name: yup.string().required(t('Business Name is Required')),
        business_type: yup.string().required(t('Business Type is required')),
        other_type: yup.string(),
        year_started: yup.string().required(t('Year Started is required')),
        brief_description: yup.string().required(t('Brief Description is required')),
        segment_served: yup.string().required(t('Segment Served is required')),
        location: yup.string().required(t('Location is required')),
        land_area_utilised: yup.string().required(t('Land Area Utilised is required')),
        built_up_area: yup.string().required(t('Built Up Area is required')),

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
                        setValues({
                            ...values,
                            location: `${coords.latitude},${coords.longitude}`,
                        }),
                    my_location: {
                        lat: parseFloat(values?.location.split(',')[0]) || null,
                        lng: parseFloat(values?.location.split(',')[1]) || null,
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
                            setValues({
                                ...values,
                                location: `${coords.latitude},${coords.longitude}`,
                            }),
                        my_location: {
                            lat: parseFloat(values?.location.split(',')[0]) || null,
                            lng: parseFloat(values?.location.split(',')[1]) || null,
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
        console.log("heererre",)
        const result = requestLocationPermission();
        result.then(res => {
            if (res) {
                Geolocation.getCurrentPosition(
                    position => {
                        console.log(position);
                        if (!values?.location.length)
                            setValues({
                                ...values,
                                location: `${position.coords.latitude},${position.coords.longitude}`,
                            });
                    },
                    error => {
                        // See error code charts below.
                        console.log(error.code, error.message);
                        setValues({ ...values, location: '' });
                    },
                    { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
                );
            } else {
                console.log('Permission not granted')
            }
        }).catch((error) => {
            console.log(error);
        })
    };
    const {
        handleChange,
        handleSubmit,
        values,
        errors,
        setFieldTouched,
        touched,
        resetForm,
        setValues,
    } = useFormik({
        initialValues: {
          business_name:'',
          business_type:'',
            other_type:'',
          year_started:'',
          brief_description:'',
          segment_served:'',
          location:'',
          land_area_utilised:'',
          built_up_area:''
        },
        validationSchema: scheme,
        onSubmit: async values => {
            console.log(values);
            let new_data = {
                business_name: values.business_name,
                business_type: values.business_type,
                other_type: values.other_type,
                year_started: values.year_started,
                brief_description: values.brief_description,
                segment_served: values.segment_served,
                location: values.location,
                land_area_utilised: parseInt(values.land_area_utilised),
                built_up_area: parseInt(values.built_up_area),
            }
            navigation.navigate('businessEmployee', { businessName: new_data, id: id, name })
        },
    });
    useEffect(() => {
        resetForm({
            values: {
                business_name: business?.business_name||'',
                business_type: business?.business_type||'',
                other_type: business?.other_type||'',
                year_started: business?.year_started||'',
                brief_description: business?.brief_description||'',
                segment_served: business?.segment_served||'',
                location: business?.location||'22.7890,88.3456',
                land_area_utilised: String(business?.land_area_utilised || '')||'',
                built_up_area: String(business?.built_up_area || '')||'',
            }
        })
    }, [business])
    console.log("businessss", business)
    if (isBusinessLoading || isLoading){
       return <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
            <ActivityIndicator size={'large'} color={primaryColor} />
        </View>
    }
  return (
      <View style={styles.container}>
          <CustomHeader
              backIcon={true}
              headerName={name}
              goBack={() => navigation.goBack()}
          />
          <KeyboardAwareScrollView
              style={{ flex: 1 }}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
              <Input
                  label={t(
                      `Business Name`
                  )}
                  value={values?.business_name}
                  placeholder={''}
                  fullLength={true}
                  keyboardType="default"
                  onChangeText={handleChange('business_name')}
              />
              {errors.business_name &&
                  errors.business_name && (
                      <Text style={Styles.error2}>
                          {
                          errors.business_name
                          }
                      </Text>
                  )}
              <CustomDropdown
                  data={
                      business_dropdown?.type_of_business.map((item) => {
                          return {
                              label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id
                          }
                      })
                    //   [{ label: 'Pharmaceutical', value: '6736117ecb51156c2f52383e' }, { label: 'IT/Telecom', value: '6736117ecb51156c2f52683e' }]
                  }
                  value={values?.business_type}
                  label={t('Type')}
                  onChange={value => {
                      setValues({
                          ...values,
                          business_type: value?.value,
                      });
                  }}
              />
              {touched?.business_type && errors?.business_type && (
                  <Text style={Styles.error2}>{String(errors?.business_type)}</Text>
              )}
              {business_dropdown?.type_of_business.find((item) => item?._id === values?.business_type)?.name === "Others(if any)" && (
                  <Input
                      label={t('Others(If any)')}
                      value={values.other_type}
                      placeholder={''}
                      fullLength={true}
                      keyboardType='default'
                      onChangeText={handleChange('other_type')}
                  />
              )}
              <YearPicker
                  onYearChange={(year) => {
                      setValues({ ...values, year_started: parseInt(year) })
                  }}
                  selectedYear={values?.year_started}
                  label={t('Year Started')}
              />
              {errors.year_started && errors.year_started && (
                  <Text style={Styles.error2}>{errors.year_started}</Text>
              )}
              <Input
                  label={t(
                      `Brief Description`
                  )}
                  value={values?.brief_description}
                  placeholder={''}
                  fullLength={true}
                  keyboardType="default"
                  onChangeText={handleChange('brief_description')}
              />
              {errors.brief_description &&
                  errors.brief_description && (
                      <Text style={Styles.error2}>
                          {
                          errors.brief_description
                          }
                      </Text>
                  )}
              <CustomDropdown
                  data={
                      business_dropdown?.segment_served.map((item) => {
                          return {
                              label: item?.name?.[USER_PREFERRED_LANGUAGE], value: item?._id
                          }
                      })
                    //   [{ label: 'Pharmaceutical', value: '6736117ecb51156c2f52383e' }, { label: 'IT/Telecom', value: '6736117ecb51156c2f52683e' }]
                  }
                  value={values?.segment_served}
                  label={t('Segmented Served')}
                  onChange={value => {
                      setValues({
                          ...values,
                          segment_served: value?.value,
                      });
                  }}
              />
              {touched?.segment_served && errors?.segment_served && (
                  <Text style={Styles.error2}>{String(errors?.segment_served)}</Text>
              )}
              <View style={styles.geotag_container}>
                  <Text
                      style={[
                          Styles.fieldLabel,
                          { width: '65%', marginTop: 0, alignSelf: 'center' },
                      ]}>
                      {t('Press Geotag to start locating the land owned per user.')}
                  </Text>
                  <CustomButton btnText={t('Geotag')} onPress={getLocation} />
              </View>
              {errors.geotag && errors.geotag && (
                  <Text style={Styles.error2}>{errors.geotag}</Text>
              )}
              <Input
                  label={t(
                      `Land area utilised`
                  )}
                  value={values?.land_area_utilised}
                  placeholder={''}
                  fullLength={true}
                  keyboardType="numeric"
                  onChangeText={handleChange('land_area_utilised')}
                  isRight={<AcresElement title={user?.land_measurement_symbol} />}
              />
              {errors.land_area_utilised &&
                  errors.land_area_utilised && (
                      <Text style={Styles.error2}>
                          {
                          errors.land_area_utilised
                          }
                      </Text>
                  )}
              <Input
                  label={t(
                      `Built up area`
                  )}
                  value={values?.built_up_area}
                  placeholder={''}
                  fullLength={true}
                  keyboardType="numeric"
                  onChangeText={handleChange('built_up_area')}
                  isRight={<AcresElement title={user?.land_measurement_symbol}/>}
              />
              {errors.built_up_area &&
                  errors.built_up_area && (
                      <Text style={Styles.error2}>
                          {
                              errors.built_up_area
                          }
                      </Text>
                  )}
                </KeyboardAwareScrollView>
                <View style={Styles.bottomBtn}>
<CustomButton btnText={t('next')} onPress={handleSubmit} style={{width: '100%'}}/>
                </View>
    </View>
  )
}

export default BusinessName

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
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
    uparrow: {
        height: 20,
        width: 20,
    },
    innerInputView: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginBottom: '5%',
        gap: 12,
        paddingHorizontal: 12
    },
    divider2: {
        // backgroundColor: 'grey',
        alignSelf: 'flex-start',
        height: '100%',
        marginTop: 9,
        width: '1%',
        borderRadius: 10,
    },
    geotag_container: {
        borderColor: primaryColor,
        borderWidth: 1,
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'space-between',
        marginTop: 12,
    },
})