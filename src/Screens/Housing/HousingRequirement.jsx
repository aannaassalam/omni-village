import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {useTranslation} from 'react-i18next';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Styles, width} from '../../styles/globalStyles';
import {ActivityIndicator, Divider} from 'react-native-paper';
import * as yup from 'yup';
import {useFormik} from 'formik';
import CustomButton from '../../Components/CustomButton/CustomButton';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import {borderColor, primaryColor} from '../../styles/colors';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import Input from '../../Components/Inputs/Input';
import AcresElement from '../../Components/ui/AcresElement';
import {useUser} from '../../Hooks/useUser';
import PopupModal from '../../Components/Popups/PopupModal';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  editHousingRequirement,
  getHousingDropdown,
  getHousingRequirement,
} from '../../functions/housing';
import {USER_PREFERRED_LANGUAGE} from '../../i18next';

const HousingRequirement = ({navigation, route}) => {
  const {t} = useTranslation();
  const {data: user} = useUser();
  const [savePopup, setSavepopup] = useState(false);
  const [draftPopup, setDraftpopup] = useState(false);
  const [houseDetails, setHouseDetails] = useState(true);
  const queryClient = useQueryClient();
  const {data: housing_dropdown, isLoading} = useQuery({
    queryKey: ['housing_dropdown'],
    queryFn: () => getHousingDropdown(),
    refetchOnWindowFocus: true,
  });
  const {data: housing_requirement, isLoading: isHousingLoading} = useQuery({
    queryKey: ['housing_requirement'],
    queryFn: () => getHousingRequirement(),
    refetchOnWindowFocus: true,
  });
  const {mutate: edit_housing_specification} = useMutation({
    mutationKey: ['edit_housing_specification'],
    mutationFn: async data => {
      editHousingRequirement(data);
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
  const scheme = yup.object().shape({
    need_new_unit: yup.boolean(),
    new_unit_purpose: yup
      .string()
      .required(t('Purpose of new unit is required')),
    new_unit_urgency: yup
      .string()
      .required(t('Urgency of new unit is required')),
    land_for_new_unit: yup.boolean(),
    required_area: yup.number().required(t('Required area is required')),
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
      need_new_unit: true,
      new_unit_purpose: '',
      new_unit_urgency: '',
      land_for_new_unit: true,
      required_area: '',
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      setSavepopup(true);
    },
  });
  useEffect(() => {
    resetForm({
      values: {
        need_new_unit: housing_requirement?.need_new_unit,
        new_unit_purpose: housing_requirement?.new_unit_purpose,
        new_unit_urgency: housing_requirement?.new_unit_urgency,
        land_for_new_unit: housing_requirement?.land_for_new_unit,
        required_area: housing_requirement?.required_area,
      },
    });
  }, [housing_requirement]);
  const handleDraft = () => {
    let newData = {
      need_new_unit: values.need_new_unit,
      new_unit_purpose: values.new_unit_purpose,
      new_unit_urgency: values.new_unit_urgency,
      land_for_new_unit: values.land_for_new_unit,
      required_area: parseInt(values.required_area),
    };
    edit_housing_specification({...newData, status: 0});
  };
  const onSubmit = () => {
    let newData = {
      need_new_unit: values.need_new_unit,
      new_unit_purpose: values.new_unit_purpose,
      new_unit_urgency: values.new_unit_urgency,
      land_for_new_unit: values.land_for_new_unit,
      required_area: parseInt(values.required_area),
    };
    edit_housing_specification({...newData, status: 1});
  };
  if (isLoading) {
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
        headerName={`${t('Housing requirements')}`}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 140, paddingHorizontal: 22}}>
        <View style={styles.subArea}>
          <Text
            style={[Styles.fieldLabel, {marginTop: 4, alignSelf: 'center'}]}>
            {t('Housing requirements')}
          </Text>
          <Divider
            bold={true}
            style={[styles.divider, {width: '45%'}]}
            horizontalInset={true}
          />
          <TouchableOpacity onPress={() => setHouseDetails(!houseDetails)}>
            {houseDetails ? (
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
        {houseDetails ? (
          <>
            <CustomDropdown
              data={[
                {label: 'Yes', value: true},
                {label: 'No', value: false},
              ]}
              value={values.need_new_unit}
              label={t('Do you need a new unit ?')}
              onChange={value => {
                setValues({
                  ...values,
                  need_new_unit: value?.value,
                });
              }}
            />
            {touched?.need_new_unit && errors?.need_new_unit && (
              <Text style={Styles.error2}>{String(errors?.need_new_unit)}</Text>
            )}
            {values?.need_new_unit && (
              <View style={styles.innerInputView}>
                <Divider style={styles.divider2} />
                <View style={{width: '100%'}}>
                  <CustomDropdown
                    data={[
                      ...housing_dropdown?.purpose.map(item => {
                        return {
                          label: item?.name?.[USER_PREFERRED_LANGUAGE],
                          value: item?._id,
                        };
                      }),
                      {label: 'test', value: 'test'},
                    ]}
                    value={values.new_unit_purpose}
                    label={t('Purpose')}
                    onChange={value => {
                      setValues({
                        ...values,
                        new_unit_purpose: value?.value,
                      });
                    }}
                  />
                  {touched?.new_unit_purpose && errors?.new_unit_purpose && (
                    <Text style={Styles.error2}>
                      {String(errors?.new_unit_purpose)}
                    </Text>
                  )}
                  <CustomDropdown
                    data={housing_dropdown?.urgency.map(item => {
                      return {
                        label: item?.name?.[USER_PREFERRED_LANGUAGE],
                        value: item?._id,
                      };
                    })}
                    value={values.new_unit_urgency}
                    label={t('Urgency')}
                    onChange={value => {
                      setValues({
                        ...values,
                        new_unit_urgency: value?.value,
                      });
                    }}
                  />
                  {touched?.new_unit_urgency && errors?.new_unit_urgency && (
                    <Text style={Styles.error2}>
                      {String(errors?.new_unit_urgency)}
                    </Text>
                  )}
                </View>
              </View>
            )}
            <CustomDropdown
              data={[
                {label: 'Yes', value: true},
                {label: 'No', value: false},
              ]}
              value={values.land_for_new_unit}
              label={t('Do you need land for a new unit ?')}
              onChange={value => {
                setValues({
                  ...values,
                  land_for_new_unit: value?.value,
                });
              }}
            />
            {touched?.land_for_new_unit && errors?.land_for_new_unit && (
              <Text style={Styles.error2}>
                {String(errors?.land_for_new_unit)}
              </Text>
            )}
            {values?.land_for_new_unit && (
              <View style={styles.innerInputView}>
                <Divider style={styles.divider2} />
                <View style={{width: '100%'}}>
                  <Input
                    label={t('Required Area ?')}
                    value={values.required_area}
                    placeholder={''}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={handleChange('required_area')}
                    isRight={<AcresElement title={'sq ft'} />}
                  />
                  {touched?.required_area && errors?.required_area && (
                    <Text style={Styles.error2}>
                      {String(errors?.required_area)}
                    </Text>
                  )}
                </View>
              </View>
            )}
          </>
        ) : null}
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

export default HousingRequirement;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
    paddingHorizontal: 12,
  },
  divider2: {
    // backgroundColor: 'grey',
    alignSelf: 'flex-start',
    height: '100%',
    marginTop: 9,
    width: '1%',
    borderRadius: 10,
  },
});
