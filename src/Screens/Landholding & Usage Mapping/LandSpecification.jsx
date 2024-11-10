import {
  ActivityIndicator,
  Dimensions,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {Styles, width} from '../../styles/globalStyles';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {useTranslation} from 'react-i18next';
import Geolocation from 'react-native-geolocation-service';
import {Divider, TextInput} from 'react-native-paper';
import {fontFamilyMedium} from '../../styles/fontStyle';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';
import {useFormik} from 'formik';
import Input from '../../Components/Inputs/Input';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';
import AcresElement from '../../Components/ui/AcresElement';
import {useUser} from '../../Hooks/useUser';
import YearPicker from '../../Components/YearPicker/YearPicker';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import {borderColor, primaryColor} from '../../styles/colors';
import PopupModal from '../../Components/Popups/PopupModal';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';

const LandSpecification = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {t} = useTranslation();
  const {landholding, land, data} = route.params;
  const [savePopup, setSavepopup] = useState(false);
  const [draftPopup, setDraftpopup] = useState(false);
  const {data: user} = useUser();
  const queryClient = useQueryClient();
  const {data: dropdownData, isLoading: dropdown_loading} = useQuery({
    queryKey: ['dropdown_data'],
    queryFn: () => {},
    refetchOnWindowFocus: true,
  });
  const {mutate: add_landholding} = useMutation({
    mutationKey: ['add_landholding'],
    mutationFn: async data => {
      // addDemographic(data)
      queryClient.invalidateQueries();
    },
    onSuccess: data => {
      console.log('successsssss save', data), navigation.replace('home');
    },
    onError: error => console.log('error save', error),
    onSettled: () => {
      setDraftpopup(false), setSavepopup(false);
    },
  });
  const {mutate: edit_landholding} = useMutation({
    mutationKey: ['edit_landholding'],
    mutationFn: async data => {
      // editDemographic(data)
      queryClient.invalidateQueries();
    },
    onSuccess: data => {
      console.log('successsssss edit', data), navigation.replace('home');
    },
    onError: error => console.log('error edit', error),
    onSettled: () => {
      setDraftpopup(false), setSavepopup(false);
    },
  });
  const scheme = yup.object().shape({
    land_under_use: yup.boolean().required(t('Land used is required')),
    status_of_land: yup
      .array()
      .test(
        'status-of-land-is-required',
        t('status of land is required'),
        function (value) {
          const {land_under_use} = this.parent; // Accessing other field values
          if (!land_under_use && (!value || value.length === 0)) {
            return this.createError({
              path: 'status_of_land',
              message: t('At least one status of land is required'),
            });
          }
          return true; // Otherwise, no validation
        },
      ),
    purpose_status_of_land: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string().required('Type is required'),
          type_category: yup
            .array()
            .required(t('Category is required'))
            .max(20, 'Category cannot be greater than 20!')
            .min(1, t('At least one Category is required')),
          total_land_area_utilised: yup
            .number()
            .required(t('Total land area utilised is required')),
        }),
      )
      .test(
        'status-of-land-is-required',
        t('purpose status of land for is required'),
        function (value) {
          const {land_under_use} = this.parent; // Accessing other field values
          if (!land_under_use && (!value || value.length === 0)) {
            return this.createError({
              path: 'purpose_status_of_land',
              message: t('At least one status of land is required'),
            });
          }
          return true; // Otherwise, no validation
        },
      ),
    total_purpose: yup
      .array()
      .test(
        'land-under-used-is-required',
        t('Purpose is required'),
        function (value) {
          const {land_under_use} = this.parent; // Accessing other field values
          if (land_under_use && (!value || value.length === 0)) {
            return this.createError({
              path: 'total_purpose',
              message: t('At least one Purpose utilised for is required'),
            });
          }
          return true; // Otherwise, no validation
        },
      ),
    purpose_land_utilised_for: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string().required('Type is required'),
          type_category: yup
            .array()
            .required(t('Category is required'))
            .max(20, 'Category cannot be greater than 20!')
            .min(1, t('At least one Category is required')),
          total_land_area_utilised: yup
            .number()
            .required(t('Total land area utilised is required')),
        }),
      )
      .test(
        'land-under-used-is-required',
        t('Purpose utilised for is required'),
        function (value) {
          const {land_under_use} = this.parent; // Accessing other field values
          if (land_under_use && (!value || value.length === 0)) {
            return this.createError({
              path: 'purpose_land_utilised_for',
              message: t('At least one Purpose utilised for is required'),
            });
          }
          return true; // Otherwise, no validation
        },
      ),
  });

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
      land_under_use: false,
      total_purpose: [],
      purpose_land_utilised_for: [],
      status_of_land: [],
      purpose_status_of_land: [],
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      // navigation.navigate('landholdingLandRequirement', { landholding, land, specification: values })
      setSavepopup(true);
    },
  });

  useEffect(() => {
    const land_use = values?.land_under_use;
    const totalPurpose = land_use
      ? parseInt(values.total_purpose.length || 0)
      : [];
    const totalStatus = !land_use
      ? parseInt(values?.status_of_land.length || 0)
      : [];
    const newDetailsOfLand = land_use
      ? Array(totalPurpose)
          .fill()
          .map((item, index) => ({
            type: values?.total_purpose[index] || '',
            total_land_area_utilised: '',
            type_category: [],
          }))
      : Array(totalStatus)
          .fill()
          .map((item, index) => ({
            type: values?.status_of_land[index] || '',
            total_land_area_utilised: '',
            type_category: [],
          }));

    setValues(prevValues => ({
      ...prevValues,
      purpose_land_utilised_for: land_use ? newDetailsOfLand : [],
      purpose_status_of_land: !land_use ? newDetailsOfLand : [],
    }));
  }, [
    values.purpose_land_utilised_for.length,
    values?.land_under_use,
    values.total_purpose,
    values?.status_of_land,
    values?.purpose_status_of_land?.length,
  ]);
  const handleFieldChange = (index, field, value) => {
    const newDetailsOfLand = [...values.purpose_land_utilised_for];
    newDetailsOfLand[index][field] = value;
    setValues({...values, purpose_land_utilised_for: newDetailsOfLand});
  };
  const handleFieldChangeSecond = (index, field, value) => {
    const newDetailsOfLand = [...values.purpose_status_of_land];
    newDetailsOfLand[index][field] = value;
    setValues({...values, purpose_status_of_land: newDetailsOfLand});
  };
  useEffect(() => {
    const land_use = values?.land_under_use;
    if (land_use) {
      setValues(prevValues => ({
        ...prevValues,
        purpose_status_of_land: [],
        status_of_land: [],
      }));
    } else {
      setValues(prevValues => ({
        ...prevValues,
        purpose_land_utilised_for: [],
        total_purpose: [],
      }));
    }
  }, [values?.land_under_use]);
  useEffect(() => {
    resetForm({
      values: {
        purpose_land_utilised_for: [],
        purpose_status_of_land: [],
        land_under_use: false,
        total_purpose: [],
        status_of_land: [],
      },
    });
  }, [data]);
  const handleDraft = () => {};
  const onSubmit = () => {
    if (values?.land_under_use) {
      console.log('here');
      let data = {
        land_under_use: values.land_under_use,
        total_purpose: values.total_purpose,
        purpose_land_utilised_for: values.purpose_land_utilised_for,
      };
    } else {
      console.log('herew');
      let data = {
        land_under_use: values.land_under_use,
        status_of_land: values.status_of_land,
        purpose_status_of_land: values.purpose_status_of_land,
      };
    }
  };
  if (dropdown_loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
        <ActivityIndicator size={'large'} color={primaryColor} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={`${t('landholding')}(${land})`}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 140, paddingHorizontal: 22}}>
        <View style={[styles.subArea, {marginTop: '3%'}]}>
          <Text
            style={[
              Styles.fieldLabel,
              {marginTop: 4, alignSelf: 'center', color: '#000'},
            ]}>
            {t('landholding specification')}
          </Text>
          <Divider
            bold={true}
            style={[styles.divider, {width: '54%'}]}
            horizontalInset={true}
          />
        </View>
        <CustomDropdown
          data={[
            {id: 1, label: 'Yes', value: true},
            {id: 2, label: 'No', value: false},
          ]}
          value={values.land_under_use}
          label={t('Is the Land under use?')}
          onChange={value => {
            setValues({
              ...values,
              land_under_use: value?.value,
            });
          }}
        />
        {touched?.land_under_use && errors?.land_under_use && (
          <Text style={Styles.error2}>{String(errors?.land_under_use)}</Text>
        )}
        {values?.land_under_use ? (
          <>
            <MultiselectDropdown
              containerStyle={{marginTop: '5%', paddingTop: 0}}
              data={[
                {key: 'Cricket', name: 'Cricket'},
                {key: 'Football', name: 'Football'},
                {key: 'Basketball', name: 'Basketball'},
                {key: 'Hockey', name: 'Hockey'},
              ]}
              setSelectedd={item => {
                setValues({
                  ...values,
                  total_purpose: item,
                });
              }}
              selectedd={values.total_purpose}
              infoName={t('What are the purposes land utilised for?')}
            />
            {touched?.total_purpose && errors?.total_purpose && (
              <Text style={Styles.error2}>{String(errors?.total_purpose)}</Text>
            )}
            {values?.purpose_land_utilised_for.length > 0 && (
              <View style={styles.innerInputView}>
                <Divider style={styles.divider2} />
                <View style={{width: '100%'}}>
                  {values.purpose_land_utilised_for.map((item, index) => (
                    <>
                      <MultiselectDropdown
                        containerStyle={{marginTop: '5%', paddingTop: 0}}
                        data={[
                          {key: 'Bat', name: 'Bat'},
                          {key: 'Ball', name: 'Ball'},
                          {key: 'Scale', name: 'Scale'},
                          {key: 'Pencil', name: 'Pencil'},
                        ]}
                        setSelectedd={item => {
                          handleFieldChange(index, 'type_category', item);
                        }}
                        selectedd={item.type_category}
                        infoName={t(`${t('What type of')} ${item?.type}?`)}
                      />
                      {errors.purpose_land_utilised_for &&
                        errors.purpose_land_utilised_for[index]
                          ?.type_category && (
                          <Text style={Styles.error2}>
                            {
                              errors.purpose_land_utilised_for[index]
                                .type_category
                            }
                          </Text>
                        )}
                    </>
                  ))}
                </View>
              </View>
            )}
            {values?.total_purpose.length > 0 ? (
              <View style={[styles.subArea, {marginTop: '3%'}]}>
                <Text
                  style={[
                    Styles.fieldLabel,
                    {marginTop: 4, alignSelf: 'center', color: '#000'},
                  ]}>
                  {t('land area specification')}
                </Text>
                <Divider
                  bold={true}
                  style={[styles.divider, {width: '54%'}]}
                  horizontalInset={true}
                />
              </View>
            ) : null}
            {values?.purpose_land_utilised_for.length > 0 && (
              <View>
                {values.purpose_land_utilised_for.map((item, index) => (
                  <>
                    <Input
                      label={t(
                        `${t(
                          'Kindly mention the total land area utilised by',
                        )} ${item?.type} `,
                      )}
                      value={item.total_land_area_utilised}
                      placeholder={'0'}
                      fullLength={true}
                      keyboardType="numeric"
                      onChangeText={text =>
                        handleFieldChange(
                          index,
                          'total_land_area_utilised',
                          parseInt(text),
                        )
                      }
                      isRight={
                        <AcresElement title={user?.land_measurement_symbol} />
                      }
                    />
                    {errors.purpose_land_utilised_for &&
                      errors.purpose_land_utilised_for[index]
                        ?.total_land_area_utilised && (
                        <Text style={Styles.error2}>
                          {
                            errors.purpose_land_utilised_for[index]
                              .total_land_area_utilised
                          }
                        </Text>
                      )}
                  </>
                ))}
              </View>
            )}
          </>
        ) : (
          <>
            <MultiselectDropdown
              containerStyle={{marginTop: '5%', paddingTop: 0}}
              data={[
                {key: 'Cricket', name: 'Cricket'},
                {key: 'Football', name: 'Football'},
                {key: 'Basketball', name: 'Basketball'},
                {key: 'Hockey', name: 'Hockey'},
              ]}
              setSelectedd={item => {
                setValues({
                  ...values,
                  status_of_land: item,
                });
              }}
              selectedd={values.status_of_land}
              infoName={t('What is the status of the land?')}
            />
            {touched?.status_of_land && errors?.status_of_land && (
              <Text style={Styles.error2}>
                {String(errors?.status_of_land)}
              </Text>
            )}
            {values?.purpose_status_of_land.length > 0 && (
              <View style={styles.innerInputView}>
                <Divider style={styles.divider2} />
                <View style={{width: '100%'}}>
                  {values.purpose_status_of_land.map((item, index) => (
                    <>
                      <MultiselectDropdown
                        containerStyle={{marginTop: '5%', paddingTop: 0}}
                        data={[
                          {key: 'Bat', name: 'Bat'},
                          {key: 'Ball', name: 'Ball'},
                          {key: 'Scale', name: 'Scale'},
                          {key: 'Pencil', name: 'Pencil'},
                        ]}
                        setSelectedd={item => {
                          handleFieldChangeSecond(index, 'type_category', item);
                        }}
                        selectedd={item.type_category}
                        infoName={t(`If ${item?.type} ${t('then why')} ?`)}
                      />
                      {errors.purpose_status_of_land &&
                        errors.purpose_status_of_land[index]?.type_category && (
                          <Text style={Styles.error2}>
                            {errors.purpose_status_of_land[index].type_category}
                          </Text>
                        )}
                    </>
                  ))}
                </View>
              </View>
            )}
            {values?.status_of_land.length > 0 ? (
              <View style={[styles.subArea, {marginTop: '3%'}]}>
                <Text
                  style={[
                    Styles.fieldLabel,
                    {marginTop: 4, alignSelf: 'center', color: '#000'},
                  ]}>
                  {t('land area specification')}
                </Text>
                <Divider
                  bold={true}
                  style={[styles.divider, {width: '54%'}]}
                  horizontalInset={true}
                />
              </View>
            ) : null}
            {values?.purpose_status_of_land.length > 0 && (
              <View>
                {values.purpose_status_of_land.map((item, index) => (
                  <>
                    <Input
                      label={t(
                        `${t(
                          'Kindly mention the total land area not utilised by',
                        )} ${item?.type} `,
                      )}
                      value={item.total_land_area_utilised}
                      placeholder={'0'}
                      fullLength={true}
                      keyboardType="numeric"
                      onChangeText={text =>
                        handleFieldChangeSecond(
                          index,
                          'total_land_area_utilised',
                          parseInt(text),
                        )
                      }
                      isRight={
                        <AcresElement title={user?.land_measurement_symbol} />
                      }
                    />
                    {errors.purpose_status_of_land &&
                      errors.purpose_status_of_land[index]
                        ?.total_land_area_utilised && (
                        <Text style={Styles.error2}>
                          {
                            errors.purpose_status_of_land[index]
                              .total_land_area_utilised
                          }
                        </Text>
                      )}
                  </>
                ))}
              </View>
            )}
          </>
        )}
      </KeyboardAwareScrollView>
      <View
        style={[
          Styles.bottomBtn,
          {flexDirection: 'row', justifyContent: 'space-between'},
        ]}>
        <CustomButton
          btnText={t('submit')}
          style={{width: '48%', height: 60}}
          onPress={handleSubmit}
        />
        <CustomButton
          btnText={t('save as draft')}
          style={{width: '48%', height: 60, backgroundColor: borderColor}}
          onPress={() => {
            setDraftpopup(true);
          }}
          btnStyle={{color: 'black'}}
        />
      </View>
      {/* submit popup */}
      <PopupModal
        modalVisible={savePopup}
        setBottomModalVisible={setSavepopup}
        styleInner={[Styles.savePopup, {width: '90%'}]}>
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
              onPress={() => {
                onSubmit();
              }}
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
        styleInner={[Styles.savePopup, {width: '90%'}]}>
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
  );
};

export default LandSpecification;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      paddingTop: 12,
    },
    mainContainer: {
      paddingHorizontal: 10,
      paddingVertical: 12,
    },
    subArea: {
      alignSelf: 'center',
      flexDirection: 'row',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
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
    innerInputView: {
      flexDirection: 'row',
      alignSelf: 'center',
      justifyContent: 'space-between',
      marginBottom: '5%',
      gap: 12,
      paddingHorizontal: 12,
    },
    divider2: {
      alignSelf: 'flex-start',
      height: '100%',
      marginTop: 9,
      width: '1%',
      borderRadius: 10,
    },
  });
