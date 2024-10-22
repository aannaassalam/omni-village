import {
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Styles, width} from '../../../styles/globalStyles';
import AlertModal from '../../../Components/Popups/AlertModal';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import Customdropdown from '../../../Components/CustomDropdown/Customdropdown';
import Input from '../../../Components/Inputs/Input';
import AcresElement from '../../../Components/ui/AcresElement';
import {TouchableOpacity} from 'react-native';
import {fontFamilyRegular} from '../../../styles/fontStyle';
import {dark_grey} from '../../../styles/colors';
import MultiselectDropdown from '../../../Components/CustomDropdown/MultiselectDropdown';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {
  add_demographic,
  edit_demographic,
  get_demographic,
} from '../../../apis/demographicInfo';
import {useTranslation} from 'react-i18next'
import {
  diet,
  language,
  occupation,
  chronic,
  motor,
  emotional,
  habits,
  education,
  education_seeking,
  skillset,
  skillset_seeking,
  hobbies,
  hobbies_seeking,
  aspiration,
  unfullfilled,
  wishes,
} from '../../../../assets/mockdata/Data.ts';
const DemographicInfo = ({navigation}:{navigation:any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makStyles(fontScale);
  const [modalViisble, setModalVisible] = useState(false);
  const [successModal, setSuccessModal] = useState(false);
  const [message, setMessage] = useState('');
  const queryClient = useQueryClient();
  const {t} = useTranslation()
  const {data: demographicInfo, isLoading} = useQuery({
    queryKey: ['get_demographic'],
    queryFn: () => get_demographic(),
  });
  const {mutate: addDemographic} = useMutation({
    mutationFn: (data: any) => add_demographic(data),
    onSuccess: data => {
      console.log('successss', data);
      setModalVisible(false);
      setSuccessModal(true);
      queryClient.invalidateQueries();
    },
    onError: error => {
      console.log(
        'error?.response?.data?.message edit',
        error,
        error?.response?.data?.error?.message,
      );
    },
    onSettled: () => {
      setModalVisible(false)
    },
  });
  const {mutate: editDemographic} = useMutation({
    mutationFn: (data: any) => edit_demographic(data),
    onSuccess: data => {
      console.log("datatat", data)
      setSuccessModal(true);
      queryClient.invalidateQueries();
    },
    onError: error => {
      console.log(
        'error?.response?.data?.message edit',
        error,
        error?.response?.error?.errors?.message,
      );
    },
    onSettled: () => {
      setModalVisible(false)
    },
  });
  let demographic = Yup.object().shape({
    marital_status: Yup.string().required(t('marital status required')),
    diet: Yup.string().required(t('diet required')),
    height: Yup.number()
      .min(1, 'Height must be greater than equal to 1')
      .required(t('height required')),
    weight: Yup.number()
      .min(1, 'Weight must be greater than equal to 1')
      .required(t('weight required')),
    speaking: Yup.string().required(t('speaking required')),
    reading: Yup.string().required(t('reading required')),
    writing: Yup.string().required(t('writing required')),
    occupation: Yup.string().required(t('occupation required')),
    yearly_income: Yup.string().required(t('yearly_income required')),
    bank_account: Yup.boolean().required(t('have bank account required')),
    savings_investment: Yup.boolean().required(
      t('have savings investment required'),
    ),
    savings_investment_amount: Yup.number().test(
      'savings_investment-amount-required',
      t('saving amount required'),
      function (value) {
        const {savings_investment} = this.parent; // Accessing other field values
        if (savings_investment) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    chronic_diseases: Yup.string().required(t('chronic disease required')),
    motor_disability: Yup.string().required(t('motor disablities required')),
    mental_emotional: Yup.string().required(t('mental emotional required')),
    habits: Yup.array()
      .required(t('habits required'))
      .min(1, 'At least one habit is required'),
    education: Yup.string().required(t('education required')),
    education_seeking_to_gain: Yup.string().required(
      t('education seeking to gain required'),
    ),
    skillsets: Yup.array()
      .required(t('skillsets required'))
      .min(1, 'At least one skillsets is required'),
    skills_seeking_to_learn: Yup.array()
      .required(t('skillsets seeking to learn required'))
      .min(1, 'At least one skills seeking to learn is required'),
    hobbies: Yup.array()
      .required(t('hobbies required'))
      .min(1, 'At least one hobbies is required'),
    hobbies_seeking_to_adopt: Yup.array()
      .required(t('hobbies seeking to adopt required'))
      .min(1, 'At least one hobbies seeking to adopt is required'),
    aspiration: Yup.array()
      .required(t('aspiration required'))
      .min(1, 'At least one aspiration is required'),
    unfulfilled_needs: Yup.array(),
    wishes: Yup.array()
      .required(t('wishes required'))
      .min(1, 'At least one wish is required'),
    others_wishes: Yup.string().test(
      'wishes-required',
      t('other wishes required'),
      function (value) {
        const {wishes} = this.parent; // Accessing other field values
        if (wishes.includes('Others')) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
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
    setValues,
    resetForm,
  } = useFormik({
    initialValues: {
      marital_status: '',
      diet: '',
      height: '',
      weight: '',
      speaking: '',
      reading: '',
      writing: '',
      occupation: '',
      yearly_income: '',
      bank_account: false,
      savings_investment: false,
      savings_investment_amount: '',
      chronic_diseases: '',
      motor_disability: '',
      mental_emotional: '',
      habits: [],
      education: '',
      education_seeking_to_gain: '',
      skillsets: [],
      skills_seeking_to_learn: [],
      hobbies: [],
      hobbies_seeking_to_adopt: [],
      aspiration: [],
      unfulfilled_needs: [],
      wishes: [],
      others_wishes: '',
    },
    validationSchema: demographic,
    onSubmit: async (values: any) => {
      console.log('Form submitted with values: ', values);
      setModalVisible(true);
    },
  });

  useEffect(() => {
    resetForm({
      values: {
        marital_status: demographicInfo?.data?.marital_status || '',
        diet: demographicInfo?.data?.diet || '',
        height: demographicInfo?.data?.height || '',
        weight: demographicInfo?.data?.weight || '',
        speaking: demographicInfo?.data?.speaking || '',
        reading: demographicInfo?.data?.reading || '',
        writing: demographicInfo?.data?.writing || '',
        occupation: demographicInfo?.data?.occupation || '',
        yearly_income: demographicInfo?.data?.yearly_income || '',
        bank_account: demographicInfo?.data?.bank_account || false,
        savings_investment: demographicInfo?.data?.savings_investment || false,
        savings_investment_amount:
          demographicInfo?.data?.savings_investment_amount || '',
        chronic_diseases: demographicInfo?.data?.chronic_diseases || '',
        motor_disability: demographicInfo?.data?.motor_disability || '',
        mental_emotional: demographicInfo?.data?.mental_emotional || '',
        habits: demographicInfo?.data?.habits || [],
        education: demographicInfo?.data?.education || '',
        education_seeking_to_gain:
          demographicInfo?.data?.education_seeking_to_gain || '',
        skillsets: demographicInfo?.data?.skillsets || [],
        skills_seeking_to_learn:
          demographicInfo?.data?.skills_seeking_to_learn || [],
        hobbies: demographicInfo?.data?.hobbies || [],
        hobbies_seeking_to_adopt:
          demographicInfo?.data?.hobbies_seeking_to_adopt || [],
        aspiration: demographicInfo?.data?.aspiration || [],
        unfulfilled_needs: demographicInfo?.data?.unfulfilled_needs || [],
        wishes: demographicInfo?.data?.wishes || [],
        others_wishes: demographicInfo?.data?.others_wishes || '',
      },
    });
  }, [demographicInfo]);
  const onSubmitted = () => {
    console.log('heerrere');
    let new_data = {
      marital_status: values?.marital_status || '',
      diet: values?.diet || '',
      height: values?.height || '',
      weight: values?.weight || '',
      speaking: values?.speaking || '',
      reading: values?.reading || '',
      writing: values?.writing || '',
      occupation: values?.occupation || '',
      yearly_income: values?.yearly_income || '',
      bank_account: values?.bank_account || false,
      savings_investment: values?.savings_investment || false,
      savings_investment_amount: parseInt(values?.savings_investment_amount) || 0,
      chronic_diseases: values?.chronic_diseases || '',
      motor_disability: values?.motor_disability || '',
      mental_emotional: values?.mental_emotional || '',
      habits: values?.habits || [],
      education: values?.education || '',
      education_seeking_to_gain: values?.education_seeking_to_gain || '',
      skillsets: values?.skillsets || [],
      skills_seeking_to_learn: values?.skills_seeking_to_learn || [],
      hobbies: values?.hobbies || [],
      hobbies_seeking_to_adopt: values?.hobbies_seeking_to_adopt || [],
      aspiration: values?.aspiration || [],
      unfulfilled_needs: values?.unfulfilled_needs || [],
      wishes: values?.wishes || [],
      others_wishes: values?.others_wishes || '',
      status: 1,
    };
    if (demographicInfo?.data?._id) {
      setMessage(t('updated'))
      editDemographic({...new_data});
    } else {
      setMessage(t('submitted'));
      addDemographic({...new_data});
    }
  };
  const onDrafted = () => {
    let new_data = {
      marital_status: values?.marital_status || '',
      diet: values?.diet || '',
      height: values?.height || '',
      weight: values?.weight || '',
      speaking: values?.speaking || '',
      reading: values?.reading || '',
      writing: values?.writing || '',
      occupation: values?.occupation || '',
      yearly_income: values?.yearly_income || '',
      bank_account: values?.bank_account || false,
      savings_investment: values?.savings_investment || false,
      savings_investment_amount: parseInt(values?.savings_investment_amount) || 0,
      chronic_diseases: values?.chronic_diseases || '',
      motor_disability: values?.data,
      mental_emotional: values?.mental_emotional || '',
      habits: values?.habits || [],
      education: values?.education || '',
      education_seeking_to_gain: values?.education_seeking_to_gain || '',
      skillsets: values?.skillsets || [],
      skills_seeking_to_learn: values?.skills_seeking_to_learn || [],
      hobbies: values?.hobbies || [],
      hobbies_seeking_to_adopt: values?.hobbies_seeking_to_adopt || [],
      aspiration: values?.aspiration || [],
      unfulfilled_needs: values?.unfulfilled_needs || [],
      wishes: values?.wishes || [],
      others_wishes: values?.others_wishes || '',
      status: 0,
    };
    if (demographicInfo?.data?._id) {
      setMessage(t('updated'));
      editDemographic({...new_data});
    } else {
      setMessage(t('updated'));
      addDemographic({...new_data});
    }
  };
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Customdropdown
              data={[
                {id: 1, label: 'Married', value: 'Married'},
                {id: 2, label: 'Single', value: 'Single'},
                {id: 3, label: 'Divorced', value: 'Divorced'},
                {id: 4, label: 'Separated', value: 'Separated'},
              ]}
              value={values.marital_status}
              label={t('marital_status')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  marital_status: value?.value,
                });
              }}
            />
            {touched?.marital_status && errors?.marital_status && (
              <Text style={Styles.error}>{String(errors?.marital_status)}</Text>
            )}
            <Customdropdown
              data={diet}
              value={values.diet}
              label={t('diet')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  diet: value?.value,
                });
              }}
            />
            {touched?.diet && errors?.diet && (
              <Text style={Styles.error}>{String(errors?.diet)}</Text>
            )}
            <Input
              onChangeText={handleChange('height')}
              value={String(values?.height)}
              fullLength={true}
              label={t('height')}
              keyboardType="numeric"
              isRight={<AcresElement title={'Unit'} />}
            />
            {touched?.height && errors?.height && (
              <Text style={Styles.error}>{String(errors?.height)}</Text>
            )}
            <Input
              onChangeText={handleChange('weight')}
              value={String(values?.weight)}
              fullLength={true}
              label={t('weight')}
              keyboardType="numeric"
              isRight={<AcresElement title={'Unit'} />}
            />
            {touched?.weight && errors?.weight && (
              <Text style={Styles.error}>{String(errors?.weight)}</Text>
            )}
            <Customdropdown
              data={language}
              value={values.speaking}
              label={t('speaking')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  speaking: value?.value,
                });
              }}
            />
            {touched?.speaking && errors?.speaking && (
              <Text style={Styles.error}>{String(errors?.speaking)}</Text>
            )}
            <Customdropdown
              data={language}
              value={values.reading}
              label={t('reading')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  reading: value?.value,
                });
              }}
            />
            {touched?.reading && errors?.reading && (
              <Text style={Styles.error}>{String(errors?.reading)}</Text>
            )}
            <Customdropdown
              data={language}
              value={values.writing}
              label={t('writing')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  writing: value?.value,
                });
              }}
            />
            {touched?.writing && errors?.writing && (
              <Text style={Styles.error}>{String(errors?.writing)}</Text>
            )}
            <Customdropdown
              data={occupation}
              value={values.occupation}
              label={t('occupation')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  occupation: value?.value,
                });
              }}
            />
            {touched?.occupation && errors?.occupation && (
              <Text style={Styles.error}>{String(errors?.occupation)}</Text>
            )}
            <Customdropdown
              data={[
                {id: 1, label: '10000-20000', value: '10000-20000'},
                {id: 2, label: '20000-30000', value: '20000-30000'},
              ]}
              value={values.yearly_income}
              label={t('yearly_income')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  yearly_income: value?.value,
                });
              }}
            />
            {touched?.yearly_income && errors?.yearly_income && (
              <Text style={Styles.error}>{String(errors?.yearly_income)}</Text>
            )}
            <Text style={[Styles.fieldLabel]}>{t('have bank account')}</Text>
            <View style={{flexDirection: 'row', gap: 8, marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  setValues({
                    ...values,
                    bank_account: !values?.bank_account,
                  })
                }>
                <Image
                  source={
                    values?.bank_account === true
                      ? require('../../../../assets/checked.png')
                      : require('../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>
                {t('yes')}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setValues({
                    ...values,
                    bank_account: !values?.bank_account,
                  })
                }>
                <Image
                  source={
                    values?.bank_account === false
                      ? require('../../../../assets/checked.png')
                      : require('../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>
                {t('no')}
              </Text>
            </View>
            <Text style={[Styles.fieldLabel]}>
              {t('have savings investment')}
            </Text>
            <View style={{flexDirection: 'row', gap: 8, marginTop: 10}}>
              <TouchableOpacity
                onPress={() =>
                  setValues({
                    ...values,
                    savings_investment: !values?.savings_investment,
                  })
                }>
                <Image
                  source={
                    values?.savings_investment === true
                      ? require('../../../../assets/checked.png')
                      : require('../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>
                {t('yes')}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  setValues({
                    ...values,
                    savings_investment: !values?.savings_investment,
                  })
                }>
                <Image
                  source={
                    values?.savings_investment === false
                      ? require('../../../../assets/checked.png')
                      : require('../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22}}
                />
              </TouchableOpacity>
              <Text style={[styles?.subheading, {marginTop: 0}]}>
                {t('no')}
              </Text>
            </View>
            {values?.savings_investment ? (
              <>
                <Input
                  onChangeText={handleChange('savings_investment_amount')}
                  value={String(values?.savings_investment_amount)}
                  fullLength={true}
                  keyboardType="numeric"
                  label={t('saving amount')}
                />
                {touched?.savings_investment_amount &&
                  errors?.savings_investment_amount && (
                    <Text style={Styles.error}>
                      {String(errors?.savings_investment_amount)}
                    </Text>
                  )}
              </>
            ) : null}
            <Customdropdown
              data={chronic}
              value={values.chronic_diseases}
              label={t('chronic disease')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  chronic_diseases: value?.value,
                });
              }}
            />
            {touched?.chronic_diseases && errors?.chronic_diseases && (
              <Text style={Styles.error}>
                {String(errors?.chronic_diseases)}
              </Text>
            )}
            <Customdropdown
              data={motor}
              value={values.motor_disability}
              label={t('motor disablities')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  motor_disability: value?.value,
                });
              }}
            />
            {touched?.motor_disability && errors?.motor_disability && (
              <Text style={Styles.error}>
                {String(errors?.motor_disability)}
              </Text>
            )}
            <Customdropdown
              data={emotional}
              value={values.mental_emotional}
              label={t('mental emotional')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  mental_emotional: value?.value,
                });
              }}
            />
            {touched?.mental_emotional && errors?.mental_emotional && (
              <Text style={Styles.error}>
                {String(errors?.mental_emotional)}
              </Text>
            )}
            <MultiselectDropdown
              containerStyle={{
                width: width / 1.12,
                marginTop: '5%',
                paddingTop: 0,
              }}
              data={habits}
              setSelectedd={(item: any) => setValues({...values, habits: item})}
              selectedd={values?.habits}
              infoName={t('habits')}
            />
            {touched?.habits && errors?.habits && (
              <Text style={Styles.error}>{String(errors?.habits)}</Text>
            )}
            <Customdropdown
              data={education}
              value={values.education}
              label={t('education')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  education: value?.value,
                });
              }}
            />
            {touched?.education && errors?.education && (
              <Text style={Styles.error}>{String(errors?.education)}</Text>
            )}
            {/* <MultiselectDropdown
              containerStyle={{
                width: width / 1.12,
                marginTop: '5%',
                paddingTop: 0,
              }}
              data={[
                {key: 'Cricket', name: 'Cricket'},
                {key: 'Football', name: 'Football'},
                {key: 'Story Books', name: 'Story Books'},
              ]}
              setSelectedd={(item: any) =>
                setValues({...values, education_seeking_to_gain: item})
              }
              selectedd={values?.education_seeking_to_gain}
              infoName={'Education seeking to gain'}
            /> */}
            <Customdropdown
              data={education_seeking}
              value={values.education_seeking_to_gain}
              label={t('education seeking to gain')}
              onChange={(value: any) => {
                console.log('valueee', value);
                setValues({
                  ...values,
                  education_seeking_to_gain: value?.value,
                });
              }}
            />
            {touched?.education_seeking_to_gain &&
              errors?.education_seeking_to_gain && (
                <Text style={Styles.error}>
                  {String(errors?.education_seeking_to_gain)}
                </Text>
              )}
            <MultiselectDropdown
              containerStyle={{
                width: width / 1.12,
                marginTop: '5%',
                paddingTop: 0,
              }}
              data={skillset}
              setSelectedd={(item: any) =>
                setValues({...values, skillsets: item})
              }
              selectedd={values?.skillsets}
              infoName={t('skillsets')}
            />
            {touched?.skillsets && errors?.skillsets && (
              <Text style={Styles.error}>{String(errors?.skillsets)}</Text>
            )}
            <MultiselectDropdown
              containerStyle={{
                width: width / 1.12,
                marginTop: '5%',
                paddingTop: 0,
              }}
              data={skillset_seeking}
              setSelectedd={(item: any) =>
                setValues({...values, skills_seeking_to_learn: item})
              }
              selectedd={values?.skills_seeking_to_learn}
              infoName={t('skillsets seeking to learn')}
            />
            {touched?.skills_seeking_to_learn &&
              errors?.skills_seeking_to_learn && (
                <Text style={Styles.error}>
                  {String(errors?.skills_seeking_to_learn)}
                </Text>
              )}
            <MultiselectDropdown
              containerStyle={{
                width: width / 1.12,
                marginTop: '5%',
                paddingTop: 0,
              }}
              data={hobbies}
              setSelectedd={(item: any) =>
                setValues({...values, hobbies: item})
              }
              selectedd={values?.hobbies}
              infoName={t('hobbies')}
            />
            {touched?.hobbies && errors?.hobbies && (
              <Text style={Styles.error}>{String(errors?.hobbies)}</Text>
            )}
            <MultiselectDropdown
              containerStyle={{
                width: width / 1.12,
                marginTop: '5%',
                paddingTop: 0,
              }}
              data={hobbies_seeking}
              setSelectedd={(item: any) =>
                setValues({...values, hobbies_seeking_to_adopt: item})
              }
              selectedd={values?.hobbies_seeking_to_adopt}
              infoName={t('hobbies seeking to adopt')}
            />
            {touched?.hobbies_seeking_to_adopt &&
              errors?.hobbies_seeking_to_adopt && (
                <Text style={Styles.error}>
                  {String(errors?.hobbies_seeking_to_adopt)}
                </Text>
              )}
            <MultiselectDropdown
              containerStyle={{
                width: width / 1.12,
                marginTop: '5%',
                paddingTop: 0,
              }}
              data={aspiration}
              setSelectedd={(item: any) =>
                setValues({...values, aspiration: item})
              }
              selectedd={values?.aspiration}
              infoName={t('aspiration')}
            />
            {touched?.aspiration && errors?.aspiration && (
              <Text style={Styles.error}>{String(errors?.aspiration)}</Text>
            )}
            <MultiselectDropdown
              containerStyle={{
                width: width / 1.12,
                marginTop: '5%',
                paddingTop: 0,
              }}
              data={unfullfilled}
              setSelectedd={(item: any) =>
                setValues({...values, unfulfilled_needs: item})
              }
              selectedd={values?.unfulfilled_needs}
              infoName={t('unfulfilled')}
            />
            <MultiselectDropdown
              containerStyle={{
                width: width / 1.12,
                marginTop: '5%',
                paddingTop: 0,
              }}
              data={wishes}
              setSelectedd={(item: any) => setValues({...values, wishes: item})}
              selectedd={values?.wishes}
              infoName={t('wishes')}
            />
            {touched?.wishes && errors?.wishes && (
              <Text style={Styles.error}>{String(errors?.wishes)}</Text>
            )}
            {values?.wishes.includes('Others') ? (
              <>
                <Input
                  onChangeText={handleChange('others_wishes')}
                  value={String(values?.others_wishes)}
                  fullLength={true}
                  label={t('other wishes')}
                  keyboardType={'default'}
                />
                {touched?.others_wishes && errors?.others_wishes && (
                  <Text style={Styles.error}>
                    {String(errors?.others_wishes)}
                  </Text>
                )}
              </>
            ) : null}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <View style={[Styles.bottomBtn]}>
        <View style={{flexDirection: 'row', gap: 16}}>
          <CustomButton
            onPress={handleSubmit}
            btnText={t('submit')}
            style={{width: width / 2.5}}
          />
          <CustomButton
            onPress={() => {
              onDrafted();
            }}
            btnText={t('save as draft')}
            btnStyle={{color: dark_grey}}
            style={{width: width / 2.5, backgroundColor: '#ebeced'}}
          />
        </View>
      </View>
      <AlertModal
        visible={modalViisble}
        cancel={true}
        hideText={t('cancel')}
        onSubmit={() => onSubmitted()}
        confirmText={t('submit')}
        onHide={() => setModalVisible(false)}
        title={t('confirm')}
        comments={t('Are you sure you want to submit this form?')}
      />
      <AlertModal
        visible={successModal}
        successModal={true}
        onSubmit={() => {
          setSuccessModal(false), navigation.goBack();
        }}
        confirmText={t('okay')}
        title={t('Successful')}
        comments={`${t('Form')} ${message} ${t('Successful')}`}
      />
    </View>
  );
};

export default DemographicInfo;

const makStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    subheading: {
      fontSize: 16 / fontScale,
      color: dark_grey,
      fontFamily: fontFamilyRegular,
      alignSelf: 'flex-start',
      textAlign: 'left',
      marginTop: '2%',
    },
  });
