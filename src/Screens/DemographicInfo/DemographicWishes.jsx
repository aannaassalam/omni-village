import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import * as yup from 'yup';
import {useFormik} from 'formik';
import Customdropdown from '../../Components/CustomDropdown/CustomDropdown';
import {useTranslation} from 'react-i18next';
import {Styles, width} from '../../styles/globalStyles';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import {ActivityIndicator, Divider} from 'react-native-paper';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Input from '../../Components/Inputs/Input';
import {borderColor, primaryColor} from '../../styles/colors';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {get_dropdown_data} from '../../functions/AuthScreens';
import PopupModal from '../../Components/Popups/PopupModal';
import {addDemographic, editDemographic} from '../../functions/demographic';

const DemographicWishes = ({navigation, route}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {t} = useTranslation();
  const [wishes, setWishes] = useState(true);
  const {
    demographic,
    aspiration,
    disease,
    habits,
    occupation,
    unfulfilled,
    data,
    member_id,
    demographic_id,
  } = route.params;
  const [savepopup, setSavepopup] = useState(false);
  const [message, setMessage] = useState('');
  const [draftpopup, setDraftpopup] = useState(false);
  const queryClient = useQueryClient();
  const {data: dropdownData, isLoading: dropdown_loading} = useQuery({
    queryKey: ['dropdown_data'],
    queryFn: get_dropdown_data,
    refetchOnWindowFocus: true,
  });
  const {mutate: add_demographic, isPending: isAdding} = useMutation({
    mutationFn: addDemographic,
    onSuccess: data => {
      queryClient.invalidateQueries();
      console.log('successsssss save', data), navigation.replace('home');
      setDraftpopup(false), setSavepopup(false);
    },
    onError: error => console.log('error save', error),
  });
  const {mutate: edit_demographic, isPending: isEditing} = useMutation({
    mutationKey: ['edit_demographic'],
    mutationFn: editDemographic,
    onSuccess: data => {
      queryClient.invalidateQueries();
      console.log('successsssss edit', data), navigation.replace('home');
      setDraftpopup(false), setSavepopup(false);
    },
    onError: error => console.log('error edit', error),
  });
  const scheme = yup.object().shape({
    for_community: yup
      .array()
      .required('for community is required')
      .min(1, t('Atleast one for community is required')),
    for_economy: yup
      .array()
      .required('for economy is required')
      .min(1, t('Atleast one for economy is required')),
    for_personal_growth: yup
      .array()
      .required('for personal growth is required')
      .min(1, t('Atleast one for personal growth is required')),
    for_environment: yup
      .array()
      .required('for environment is required')
      .min(1, t('Atleast one for environment is required')),
    for_family_future_generation: yup
      .array()
      .required('for family future generation is required')
      .min(1, t('Atleast one for family future generation is required')),
    others_wishes: yup.string(),
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
      for_community: [],
      for_economy: [],
      for_personal_growth: [],
      for_environment: [],
      for_family_future_generation: [],
      others_wishes: '',
    },
    validationSchema: scheme,
    onSubmit: async values => {
      setSavepopup(true);
    },
  });
  useEffect(() => {
    resetForm({
      values: {
        for_community:
          data?.wishes?.for_community.map(i => {
            return i?._id;
          }) || [],
        for_economy:
          data?.wishes?.for_economy.map(i => {
            return i?._id;
          }) || [],
        for_personal_growth:
          data?.wishes?.for_personal_growth.map(i => {
            return i?._id;
          }) || [],
        for_environment:
          data?.wishes?.for_environment.map(i => {
            return i?._id;
          }) || [],
        for_family_future_generation:
          data?.wishes?.for_family_future_generation.map(i => {
            return i?._id;
          }) || [],
        others_wishes: data?.wishes?.others_wishes || '',
      },
    });
  }, [data]);
  const handleDraft = () => {
    let new_data = {
      ...demographic,
      ...aspiration,
      ...disease,
      ...habits,
      ...occupation,
      ...unfulfilled,
      ...values,
    };
    if (demographic_id) {
      edit_demographic({
        ...new_data,
        status: 0,
        demographic_id: demographic_id,
      });
    } else {
      add_demographic({...new_data, status: 0, member_id: member_id});
    }
  };
  const onSubmit = () => {
    let new_data = {
      ...demographic,
      ...aspiration,
      ...disease,
      ...habits,
      ...occupation,
      ...unfulfilled,
      ...values,
    };
    if (demographic_id) {
      edit_demographic({
        ...new_data,
        status: 1,
        demographic_id: demographic_id,
      });
    } else {
      add_demographic({...new_data, status: 1, member_id: member_id});
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
        headerName={t('demographic')}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 140, paddingHorizontal: 22}}>
        <View style={styles.subArea}>
          <Text
            style={[Styles.fieldLabel, {marginTop: 4, alignSelf: 'center'}]}>
            Wishes
          </Text>
          <Divider
            bold={true}
            style={[styles.divider, {width: '70%'}]}
            horizontalInset={true}
          />
          <TouchableOpacity onPress={() => setWishes(!wishes)}>
            {wishes ? (
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
        {wishes ? (
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{width: '100%'}}>
              <MultiselectDropdown
                containerStyle={{
                  marginTop: '5%',
                  paddingTop: 0,
                }}
                data={dropdownData?.['for_the_community'].map(item => {
                  return {name: item?.name, key: item?._id};
                })}
                setSelectedd={item =>
                  setValues({...values, for_community: item})
                }
                selectedd={values?.for_community}
                infoName={t('For community')}
              />
              {touched?.for_community && errors?.for_community && (
                <Text style={Styles.error2}>
                  {String(errors?.for_community)}
                </Text>
              )}
              <MultiselectDropdown
                containerStyle={{
                  marginTop: '5%',
                  paddingTop: 0,
                }}
                data={dropdownData?.['for_the_economy'].map(item => {
                  return {name: item?.name, key: item?._id};
                })}
                setSelectedd={item => setValues({...values, for_economy: item})}
                selectedd={values?.for_economy}
                infoName={t('For economy')}
              />
              {touched?.for_economy && errors?.for_economy && (
                <Text style={Styles.error2}>{String(errors?.for_economy)}</Text>
              )}
              <MultiselectDropdown
                containerStyle={{
                  marginTop: '5%',
                  paddingTop: 0,
                }}
                data={dropdownData?.['for_personal_growth'].map(item => {
                  return {name: item?.name, key: item?._id};
                })}
                setSelectedd={item =>
                  setValues({...values, for_personal_growth: item})
                }
                selectedd={values?.for_personal_growth}
                infoName={t('For personal growth')}
              />
              {touched?.for_personal_growth && errors?.for_personal_growth && (
                <Text style={Styles.error2}>
                  {String(errors?.for_personal_growth)}
                </Text>
              )}
              <MultiselectDropdown
                containerStyle={{
                  marginTop: '5%',
                  paddingTop: 0,
                }}
                data={dropdownData?.['for_the_environment'].map(item => {
                  return {name: item?.name, key: item?._id};
                })}
                setSelectedd={item =>
                  setValues({...values, for_environment: item})
                }
                selectedd={values?.for_environment}
                infoName={t('For environment')}
              />
              {touched?.for_environment && errors?.for_environment && (
                <Text style={Styles.error2}>
                  {String(errors?.for_environment)}
                </Text>
              )}
              <MultiselectDropdown
                containerStyle={{
                  marginTop: '5%',
                  paddingTop: 0,
                }}
                data={dropdownData?.['for_family_and_future_generations'].map(
                  item => {
                    return {name: item?.name, key: item?._id};
                  },
                )}
                setSelectedd={item =>
                  setValues({...values, for_family_future_generation: item})
                }
                selectedd={values?.for_family_future_generation}
                infoName={t('For family and future generation')}
              />
              {touched?.for_family_future_generation &&
                errors?.for_family_future_generation && (
                  <Text style={Styles.error2}>
                    {String(errors?.for_family_future_generation)}
                  </Text>
                )}
              <Input
                label={t('Other wishes(Specify if any)')}
                value={values.others_wishes}
                placeholder={''}
                fullLength={true}
                onChangeText={handleChange('others_wishes')}
              />
            </View>
          </View>
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
        modalVisible={savepopup}
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
          <Text style={Styles.nextText}>{t('')}</Text>
          <View style={Styles.bottomPopupbutton}>
            <CustomButton
              style={Styles.submitButton}
              btnText={t('submit')}
              onPress={() => onSubmit()}
              loading={isAdding || isEditing}
            />
            <CustomButton
              style={Styles.draftButton}
              btnText={t('cancel')}
              onPress={() => {
                setSavepopup(false);
              }}
              disabled={isAdding || isEditing}
            />
          </View>
        </View>
      </PopupModal>
      {/* draft popup */}
      <PopupModal
        modalVisible={draftpopup}
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
          <Text style={Styles.nextText}>{t('')}</Text>
          <View style={Styles.bottomPopupbutton}>
            <CustomButton
              style={Styles.submitButton}
              btnText={t('save')}
              onPress={() => handleDraft()}
              loading={isAdding || isEditing}
            />
            <CustomButton
              style={Styles.draftButton}
              btnText={t('cancel')}
              onPress={() => setDraftpopup(false)}
              disabled={isAdding || isEditing}
            />
          </View>
        </View>
      </PopupModal>
    </View>
  );
};

export default DemographicWishes;

const makeStyles = fontScale =>
  StyleSheet.create({
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
