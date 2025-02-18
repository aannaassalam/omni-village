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
import PopupModal from '../../Components/Popups/PopupModal';
import {editHousing, getHousingDropdown} from '../../functions/housing';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {USER_PREFERRED_LANGUAGE} from '../../i18next';
import Input from '../../Components/Inputs/Input';
import {
  editBusinessRequirement,
  getBusinessDropdown,
  getBusinessRequirement,
} from '../../functions/business';

const NewBusinessDetails = ({navigation, route}) => {
  const {t} = useTranslation();
  const {name} = route.params;
  const [houseDetails, setHouseDetails] = useState(true);
  const [savePopup, setSavepopup] = useState(false);
  const [draftPopup, setDraftpopup] = useState(false);
  const queryClient = useQueryClient();
  const {
    data: business_dropdown,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['business'],
    queryFn: () => getBusinessDropdown(),
    refetchOnWindowFocus: true,
  });
  const {data: business_requirement} = useQuery({
    queryKey: ['business_requirement'],
    queryFn: () => getBusinessRequirement(),
    refetchOnWindowFocus: true,
  });
  const {mutate: edit_business_requirement, isPending} = useMutation({
    mutationFn: editBusinessRequirement,
    onSuccess: data => {
      queryClient.invalidateQueries();
      navigation.replace('businessCount');
      setDraftpopup(false), setSavepopup(false);
    },
    onError: error => console.log('error save', error),
  });
  const scheme = yup.object().shape({
    business_wish_to_start: yup
      .string()
      .required(t('Business wish to start is required')),
    require_land: yup.string().required(t('Require land is required')),
    land_already_owned: yup
      .string()
      .required(t('land already owned is required')),
    purpose_of_business: yup
      .string()
      .required(t('Purpose of business is required')),
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
      business_wish_to_start: '',
      require_land: '',
      land_already_owned: '',
      purpose_of_business: '',
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      setSavepopup(true);
    },
  });
  const handleDraft = () => {
    let newData = {
      business_wish_to_start: values.business_wish_to_start,
      require_land: values.require_land,
      land_already_owned: values.land_already_owned,
      purpose_of_business: values.purpose_of_business,
      status: 0,
    };
    if (business_requirement?._id) {
      edit_business_requirement({
        ...newData,
        business_id: business_requirement?._id,
      });
    } else {
      edit_business_requirement({
        ...newData,
        business_id: business_requirement?._id,
      });
    }
  };

  const onSubmit = () => {
    let newData = {
      business_wish_to_start: values.business_wish_to_start,
      require_land: values.require_land,
      land_already_owned: values.land_already_owned,
      purpose_of_business: values.purpose_of_business,
      status: 0,
    };
    if (business_requirement?._id) {
      edit_business_requirement({
        ...newData,
        business_id: business_requirement?._id,
      });
    } else {
      edit_business_requirement({
        ...newData,
        business_id: business_requirement?._id,
      });
    }
  };
  useEffect(() => {
    resetForm({
      values: {
        business_wish_to_start:
          business_requirement?.business_wish_to_start || '',
        require_land: business_requirement?.require_land || '',
        land_already_owned: business_requirement?.land_already_owned || '',
        purpose_of_business: business_requirement?.purpose_of_business || '',
      },
    });
  }, [business_requirement]);
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
        headerName={`${name}`}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 140, paddingHorizontal: 22}}>
        <CustomDropdown
          data={business_dropdown?.type_of_business.map((item)=>{return {label: item?.name[USER_PREFERRED_LANGUAGE], value: item?._id};})}
          value={values?.business_wish_to_start}
          label={t('Type of the business you wish to start')}
          onChange={value => {
            setValues({
              ...values,
              business_wish_to_start: value?.value,
            });
          }}
        />
        {touched?.business_wish_to_start && errors?.business_wish_to_start && (
          <Text style={Styles.error2}>
            {String(errors?.business_wish_to_start)}
          </Text>
        )}
        <CustomDropdown
          data={[
            {label: 'Yes', value: 'yes'},
            {label: 'No', value: 'no'},
          ]}
          value={values?.require_land}
          label={t('Does it require land?')}
          onChange={value => {
            setValues({
              ...values,
              require_land: value?.value,
            });
          }}
        />
        {touched?.require_land && errors?.require_land && (
          <Text style={Styles.error2}>{String(errors?.require_land)}</Text>
        )}
        {values?.require_land === 'yes' ? (
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{width: '100%'}}>
              <CustomDropdown
                data={[
                  {label: 'Yes', value: 'yes'},
                  {label: 'No', value: 'no'},
                ]}
                value={values?.land_already_owned}
                label={t('If yes, is land already owned')}
                onChange={value => {
                  setValues({
                    ...values,
                    land_already_owned: value?.value,
                  });
                }}
              />
              {touched?.land_already_owned && errors?.land_already_owned && (
                <Text style={Styles.error2}>
                  {String(errors?.land_already_owned)}
                </Text>
              )}
            </View>
          </View>
        ) : null}
        <Input
          label={t(`Purpose of business`)}
          value={values?.purpose_of_business}
          placeholder={''}
          fullLength={true}
          keyboardType="default"
          onChangeText={handleChange('purpose_of_business')}
        />
        {errors.purpose_of_business && errors.purpose_of_business && (
          <Text style={Styles.error2}>{errors.purpose_of_business}</Text>
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
              loading={isPending}
            />
            <CustomButton
              style={Styles.draftButton}
              btnText={t('cancel')}
              onPress={() => {
                setSavepopup(false);
              }}
              disabled={isPending}
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
              loading={isPending}
            />
            <CustomButton
              style={Styles.draftButton}
              btnText={t('cancel')}
              onPress={() => setDraftpopup(false)}
              disabled={isPending}
            />
          </View>
        </View>
      </PopupModal>
    </View>
  );
};

export default NewBusinessDetails;

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
