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
import { TouchableOpacity } from 'react-native';
import { fontFamilyRegular } from '../../../styles/fontStyle';
import { dark_grey } from '../../../styles/colors';
import MultiselectDropdown from '../../../Components/CustomDropdown/MultiselectDropdown';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { add_demographic, edit_demographic, get_demographic } from '../../../apis/demographicInfo';
const DemographicInfo = () => {
  const {fontScale} = useWindowDimensions();
  const styles = makStyles(fontScale);
  const [modalViisble, setModalVisible] = useState(false);
  const queryClient = useQueryClient()
  const {data: demographicInfo, isLoading} = useQuery({
    queryKey: ['get_demographic'],
    queryFn: () => get_demographic(),
  });
  const {mutate: addDemographic} = useMutation({
    mutationFn: (data: any) => add_demographic(data),
    onSuccess: data => {
      setModalVisible(true);
      queryClient.invalidateQueries();
    },
    onError: error => {
      console.log(
        'error?.response?.data?.message edit',
        error,
        error?.response?.data?.message,
      );
    },
  });
  const {mutate: editDemographic} = useMutation({
    mutationFn: (data: any) => edit_demographic(data),
    onSuccess: data => {
      setModalVisible(true);
      queryClient.invalidateQueries();
    },
    onError: error => {
      console.log(
        'error?.response?.data?.message edit',
        error,
        error?.response?.data?.message,
      );
    },
  });
  console.log("demographicccccc", demographicInfo)
  let demographic = Yup.object().shape({
    marital_status: Yup.string().required('Marital status is required'),
    diet: Yup.string().required('Diet is required'),
    height: Yup.number()
      .min(1, 'Height must be greater than equal to 1')
      .required('Height is required'),
    weight: Yup.number()
      .min(1, 'Weight must be greater than equal to 1')
      .required('Weight is required'),
    speaking: Yup.string().required('Speaking is required'),
    reading: Yup.string().required('Reading is required'),
    writing: Yup.string().required('Writing is required'),
    occupation: Yup.string().required('Occupation is required'),
    yearly_income: Yup.string().required('Yearly income is required'),
    bank_account: Yup.boolean().required('Bank account is required'),
    savings_investment: Yup.boolean().required(
      'Savings investment is required',
    ),
    savings_investment_amount: Yup.number().test(
      'savings_investment-amount-required',
      'Savings investment amount is required',
      function (value) {
        const {savings_investment} = this.parent; // Accessing other field values
        if (savings_investment) {
          return value ? true : false; // If soil_health is decreasing, decreasing_yield must have a value
        }
        return true; // Otherwise, no validation on decreasing_yield
      },
    ),
    chronic_diseases: Yup.string().required('Chronic diseases is required'),
    motor_disability: Yup.string().required('Motor disability is required'),
    mental_emotional: Yup.string().required('Mental and emotional is required'),
    habits: Yup.array()
      .required('Habit is required')
      .min(1, 'At least one habit is required'),
    education: Yup.string().required('Education is required'),
    education_seeking_to_gain: Yup.array()
      .required('Education seeking to gain is required')
      .min(1, 'At least one education seeking to gain is required'),
    skillset: Yup.array()
      .required('Skillset is required')
      .min(1, 'At least one skillset is required'),
    skills_seeking_to_learn: Yup.array()
      .required('Skills seeking to learn is required')
      .min(1, 'At least one skills seeking to learn is required'),
    hobbies: Yup.array()
      .required('Hobbies is required')
      .min(1, 'At least one hobbies is required'),
    hobbies_seeking_to_adopt: Yup.array()
      .required('Hobbies seeking to adopt is required')
      .min(1, 'At least one hobbies seeking to adopt is required'),
    aspiration: Yup.array()
      .required('Aspiration is required')
      .min(1, 'At least one aspiration is required'),
    unfulfilled_needs: Yup.array(),
    wishes: Yup.array()
      .required('Wishes is required')
      .min(1, 'At least one wish is required'),
    others_wishes: Yup.string().test(
      'wishes-required',
      'Wishes is required',
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
      savings_investment_amount: 0,
      chronic_diseases: '',
      motor_disability: '',
      mental_emotional: '',
      habits: [],
      education: '',
      education_seeking_to_gain: [],
      skillset: [],
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
          demographicInfo?.data?.savings_investment_amount || 0,
        chronic_diseases: demographicInfo?.data?.chronic_diseases || '',
        motor_disability: demographicInfo?.data?.motor_disability || '',
        mental_emotional: demographicInfo?.mental_emotional || '',
        habits: demographicInfo?.data?.habits || [],
        education: demographicInfo?.data?.education || '',
        education_seeking_to_gain:
          demographicInfo?.data?.education_seeking_to_gain || [],
        skillset: demographicInfo?.data?.skillset || [],
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
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView keyboardVerticalOffset={100} behavior="padding">
        <ScrollView contentContainerStyle={{paddingBottom: 105}}>
          <View style={Styles.mainContainer}>
            <Customdropdown
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.marital_status}
              label={'Marital Status'}
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
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.diet}
              label={'Diet'}
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
              label={'Height'}
              isRight={<AcresElement title={'Unit'} />}
            />
            {touched?.height && errors?.height && (
              <Text style={Styles.error}>{String(errors?.height)}</Text>
            )}
            <Input
              onChangeText={handleChange('weight')}
              value={String(values?.weight)}
              fullLength={true}
              label={'Weight'}
              isRight={<AcresElement title={'Unit'} />}
            />
            {touched?.weight && errors?.weight && (
              <Text style={Styles.error}>{String(errors?.weight)}</Text>
            )}
            <Customdropdown
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.speaking}
              label={'Speaking'}
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
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.reading}
              label={'Reading'}
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
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.writing}
              label={'Writing'}
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
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.occupation}
              label={'Occupation'}
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
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.yearly_income}
              label={'Yearly Income'}
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
            <Text style={[Styles.fieldLabel]}>
              Do you have a bank account ?
            </Text>
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
              <Text style={[styles?.subheading, {marginTop: 0}]}>Yes</Text>
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
              <Text style={[styles?.subheading, {marginTop: 0}]}>No</Text>
            </View>
            <Text style={[Styles.fieldLabel]}>
              Do you have a savings/investment ?
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
              <Text style={[styles?.subheading, {marginTop: 0}]}>Yes</Text>
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
              <Text style={[styles?.subheading, {marginTop: 0}]}>No</Text>
            </View>
            {values?.savings_investment ? (
              <>
                <Input
                  onChangeText={handleChange('savings_investment_amount')}
                  value={String(values?.savings_investment_amount)}
                  fullLength={true}
                  label={'Savings/Investments Amount'}
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
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.chronic_diseases}
              label={'Chronic disease'}
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
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.motor_disability}
              label={'Motor disbalities'}
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
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.mental_emotional}
              label={'Mental & emotional well-being'}
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
              data={[
                {key: 'Cricket', name: 'Cricket'},
                {key: 'Football', name: 'Football'},
                {key: 'Story Books', name: 'Story Books'},
              ]}
              setSelectedd={(item: any) => setValues({...values, habits: item})}
              selectedd={values?.habits}
              infoName={'Habits'}
            />
            {touched?.habits && errors?.habits && (
              <Text style={Styles.error}>{String(errors?.habits)}</Text>
            )}
            <Customdropdown
              data={[
                {id: 1, label: 'Stable', value: 'Stable'},
                {id: 2, label: 'Decreasing Yield', value: 'Decreasing Yield'},
              ]}
              value={values.education}
              label={'Education'}
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
            <MultiselectDropdown
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
              data={[
                {key: 'Cricket', name: 'Cricket'},
                {key: 'Football', name: 'Football'},
                {key: 'Story Books', name: 'Story Books'},
              ]}
              setSelectedd={(item: any) =>
                setValues({...values, skillset: item})
              }
              selectedd={values?.skillset}
              infoName={'Skillset'}
            />
            {touched?.skillset && errors?.skillset && (
              <Text style={Styles.error}>{String(errors?.skillset)}</Text>
            )}
            <MultiselectDropdown
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
                setValues({...values, skills_seeking_to_learn: item})
              }
              selectedd={values?.skills_seeking_to_learn}
              infoName={'Skillset seeking to learn'}
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
              data={[
                {key: 'Cricket', name: 'Cricket'},
                {key: 'Football', name: 'Football'},
                {key: 'Story Books', name: 'Story Books'},
              ]}
              setSelectedd={(item: any) =>
                setValues({...values, hobbies: item})
              }
              selectedd={values?.hobbies}
              infoName={'Hobbies'}
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
              data={[
                {key: 'Cricket', name: 'Cricket'},
                {key: 'Football', name: 'Football'},
                {key: 'Story Books', name: 'Story Books'},
              ]}
              setSelectedd={(item: any) =>
                setValues({...values, hobbies_seeking_to_adopt: item})
              }
              selectedd={values?.hobbies_seeking_to_adopt}
              infoName={'Hobbies seeking to adopt'}
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
              data={[
                {key: 'Cricket', name: 'Cricket'},
                {key: 'Football', name: 'Football'},
                {key: 'Story Books', name: 'Story Books'},
              ]}
              setSelectedd={(item: any) =>
                setValues({...values, aspiration: item})
              }
              selectedd={values?.aspiration}
              infoName={'Aspiration'}
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
              data={[
                {key: 'Cricket', name: 'Cricket'},
                {key: 'Football', name: 'Football'},
                {key: 'Story Books', name: 'Story Books'},
              ]}
              setSelectedd={(item: any) =>
                setValues({...values, unfulfilled_needs: item})
              }
              selectedd={values?.unfulfilled_needs}
              infoName={'Unfulfilled needs (if any)'}
            />
            <MultiselectDropdown
              containerStyle={{
                width: width / 1.12,
                marginTop: '5%',
                paddingTop: 0,
              }}
              data={[
                {key: 'Cricket', name: 'Cricket'},
                {key: 'Football', name: 'Football'},
                {key: 'Story Books', name: 'Story Books'},
                {key: 'Others', name: 'Others'},
              ]}
              setSelectedd={(item: any) => setValues({...values, wishes: item})}
              selectedd={values?.wishes}
              infoName={'Wishes'}
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
                  label={'Other Wishes'}
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
            btnText={'Submit'}
            style={{width: width / 2.5}}
          />
          <CustomButton
            onPress={() => {}}
            btnText={'Save as draft'}
            btnStyle={{color: dark_grey}}
            style={{width: width / 2.5, backgroundColor: '#ebeced'}}
          />
        </View>
      </View>
      <AlertModal
        visible={modalViisble}
        cancel={true}
        hideText={'Cancel'}
        onSubmit={() => setModalVisible(false)}
        confirmText="Submit"
        onHide={() => setModalVisible(false)}
        title="Confirm Submit"
        comments="Are you sure you want to submit this form?"
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
