import { StyleSheet, Text, TouchableOpacity, useWindowDimensions, View, Image, Dimensions, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { fontFamilyMedium, fontFamilyRegular } from '../../styles/fontStyle'
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import CustomDropdown3 from '../../Components/CustomDropdown/CustomDropdown3';
import InputWithoutBorder from '../../Components/CustomInputField/InputWithoutBorder';
import InputWithTitle from '../../Components/CustomInputField/InputWithTitle';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { Styles } from '../../styles/globalStyles';
import { useUser } from '../../Hooks/useUser';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import { diet } from '../../MockData/Mockdata';
import { useTranslation } from 'react-i18next';
import PopupModal from '../../Components/Popups/PopupModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { addDemographic, getDemographic } from '../../functions/demographic';
import { editDemographic } from './../../functions/demographic';
import Toast from 'react-native-toast-message';
import { ActivityIndicator } from 'react-native-paper';

const data = {
  marital_status: 'Single',
  diet: 'Predominantly vegetarian',
  height: '',
  weight: '',
  speaking: '',
  reading: '',
  writing: '',
  occupation: '',
  yearly_income: '',
  bank_account: false,
  savings_investment: false,
  chronic_diseases: '',
  handicap: false,
  mental_emotional: '',
  habits: [],
  education: '',
  education_seeking_to_gain: false,
  skillsets: [],
  hobbies: [],
  skills_seeking_to_learn: [],
  hobbies_seeking_to_adopt: [],
  aspiration: '',
  unfulfilled: '',
  wishes: ''
}
const Demographic = ({ navigation }) => {
  const { fontScale } = useWindowDimensions()
  const styles = makeStyles(fontScale)
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const { t } = useTranslation()
  const user = useUser()
  const { data: demograData, isFetching, isLoading, refetch } = useQuery({
    queryKey: ['demographicData'],
    queryFn: getDemographic,
  })
  const { mutate: addDemographicData, isLoading: isDemographicAddLoading } = useMutation({
    mutationFn: (data) => addDemographic(data),
    onSuccess: (_data) => {
      console.log("_dataa", _data)
      refetch(),
      navigation.goBack()
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error Occurred',
        text2: 'Something Went wrong, Please try again later!',
      })
    },
    onSettled: () => { setSavepopup(false), setDraftpopup(false) },
  })

  const { mutate: editDemographicData, isLoading: isDemographicEditLoading } = useMutation({
    mutationFn: (data) => editDemographic(data),
    onSuccess: (_data) => {
      console.log("_dataa", _data)
      refetch()
      navigation.goBack()
    },
    onError: () => {
      Toast.show({
        type: 'error',
        text1: 'Error Occurred',
        text2: 'Something Went wrong, Please try again later!',
      })
    },
    onSettled: () => { setSavepopup(false), setDraftpopup(false) },
  })
  const schema = yup.object().shape({
    marital_status: yup.string().required('Required'),
    diet: yup.string().required('Required'),
    height: yup.string().required('Required'),
    speaking: yup.string().required('Required'),
    reading: yup.string().required('Required'),
    writing: yup.string().required('Required'),
    occupation: yup.string().required('Required'),
    yearly_income: yup.string().required('Required'),
    bank_account: yup.string().required('Required'),
    savings_investment: yup.string().required('Required'),
    chronic_diseases: yup.string().required('Required'),
    handicap: yup.string().required('Required'),
    mental_emotional: yup.string().required('Required'),
    habits: yup.array().min(2, 'You must have at least 2 habits').required('Required'),
    education: yup.string().required('Required'),
    education_seeking_to_gain: yup.string().required('Required'),
    skillsets: yup.array().min(2, 'You must have at least 2 skillsets').required('Required'),
    hobbies: yup.array().min(2, 'You must have at least 2 hobbies').required('Required'),
    skills_seeking_to_learn: yup.array().min(2, 'You must have at least 2 skills seeking to learn').required('Required'),
    hobbies_seeking_to_adopt: yup.array().min(2, 'You must have at least 2 hobbies seeking to adopt').required('Required'),
    aspiration: yup.string(),
    unfulfilled: yup.string(),
    wishes: yup.string().required('Required'),
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
      marital_status: String(demograData?.data?.marital_status || ''),
      diet: String(demograData?.data?.diet || ''),
      height: String(demograData?.data?.height || ''),
      weight: String(demograData?.data?.weight || ''),
      speaking: String(demograData?.data?.speaking || ''),
      reading: String(demograData?.data?.reading || ''),
      writing: String(demograData?.data?.writing || ''),
      occupation: String(demograData?.data?.occupation || ''),
      yearly_income: String(demograData?.data?.yearly_income || ''),
      bank_account: Boolean(demograData?.data?.bank_account || false),
      savings_investment: Boolean(demograData?.data?.savings_investment || false),
      chronic_diseases: String(demograData?.data?.chronic_diseases || ''),
      handicap: Boolean(demograData?.data?.handicap || false),
      mental_emotional: String(demograData?.data?.mental_emotional || ''),
      habits: demograData?.data?.habits?.length > 0 && demograData?.data?.habits || null,
      education: String(demograData?.data?.education || ''),
      education_seeking_to_gain: Boolean(demograData?.data?.education_seeking_to_gain || false),
      skillsets: demograData?.data?.skillsets?.length > 0 && demograData?.data?.skillsets || null,
      hobbies: demograData?.data?.hobbies?.length > 0 && demograData?.data?.hobbies || null,
      skills_seeking_to_learn: demograData?.data?.skills_seeking_to_learn?.length > 0 && demograData?.data?.skills_seeking_to_learn || null,
      hobbies_seeking_to_adopt: demograData?.data?.hobbies_seeking_to_adopt?.length > 0 && demograData?.data?.hobbies_seeking_to_adopt || null,
      aspiration: String(demograData?.data?.aspiration || ''),
      unfulfilled: String(demograData?.data?.unfulfilled || ''),
      wishes: String(demograData?.data?.wishes || ''),
    }
  })
  const onSubmit = (data) => {
    if (demograData?.data?._id) {
      editDemographicData({ ...data, status: 1 })
    } else {
      addDemographicData({ ...data, status: 1 })
    }
  }
  const handleDraft = () => {
    if (demograData?.data?._id) {
      editDemographicData({
        marital_status: watch('marital_status'),
        diet: watch('diet'),
        height: watch('height'),
        weight: watch('weight'),
        speaking: watch('speaking'),
        reading: watch('reading'),
        writing: watch('writing'),
        occupation: watch('occupation'),
        yearly_income: watch('yearly_income'),
        bank_account: watch('bank_account'),
        savings_investment: watch('savings_investment'),
        chronic_diseases: watch('chronic_diseases'),
        handicap: watch('handicap'),
        mental_emotional: watch('mental_emotional'),
        habits: watch('habits'),
        education: watch('education'),
        education_seeking_to_gain: watch('education_seeking_to_gain'),
        skillsets: watch('skillsets'),
        hobbies: watch('hobbies'),
        skills_seeking_to_learn: watch('skills_seeking_to_learn'),
        hobbies_seeking_to_adopt: watch('hobbies_seeking_to_adopt'),
        aspiration: watch('aspiration'),
        unfulfilled: watch('unfulfilled'),
        wishes: watch('wishes'),
        status: 0
      })
    } else {
      addDemographicData({
        marital_status: watch('marital_status'),
        diet: watch('diet'),
        height: watch('height'),
        weight: watch('weight'),
        speaking: watch('speaking'),
        reading: watch('reading'),
        writing: watch('writing'),
        occupation: watch('occupation'),
        yearly_income: watch('yearly_income'),
        bank_account: watch('bank_account'),
        savings_investment: watch('savings_investment'),
        chronic_diseases: watch('chronic_diseases'),
        handicap: watch('handicap'),
        mental_emotional: watch('mental_emotional'),
        habits: watch('habits'),
        education: watch('education'),
        education_seeking_to_gain: watch('education_seeking_to_gain'),
        skillsets: watch('skillsets'),
        hobbies: watch('hobbies'),
        skills_seeking_to_learn: watch('skills_seeking_to_learn'),
        hobbies_seeking_to_adopt: watch('hobbies_seeking_to_adopt'),
        aspiration: watch('aspiration'),
        unfulfilled: watch('unfulfilled'),
        wishes: watch('wishes'),
        status: 0
      })
    }
  }
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSavepopup(false);
    }
  }, [errors]);
  useEffect(() => {
    if (demograData?.data) {
      reset({
        marital_status: String(demograData?.data?.marital_status || ''),
        diet: String(demograData?.data?.diet || ''),
        height: String(demograData?.data?.height || ''),
        weight: String(demograData?.data?.weight || ''),
        speaking: String(demograData?.data?.speaking || ''),
        reading: String(demograData?.data?.reading || ''),
        writing: String(demograData?.data?.writing || ''),
        occupation: String(demograData?.data?.occupation || ''),
        yearly_income: String(demograData?.data?.yearly_income || ''),
        bank_account: Boolean(demograData?.data?.bank_account || false),
        savings_investment: Boolean(demograData?.data?.savings_investment || false),
        chronic_diseases: String(demograData?.data?.chronic_diseases || ''),
        handicap: Boolean(demograData?.data?.handicap || false),
        mental_emotional: String(demograData?.data?.mental_emotional || ''),
        habits: demograData?.data?.habits?.length > 0 && demograData?.data?.habits || null,
        education: String(demograData?.data?.education || ''),
        education_seeking_to_gain: Boolean(demograData?.data?.education_seeking_to_gain || false),
        skillsets: demograData?.data?.skillsets?.length > 0 && demograData?.data?.skillsets || null,
        hobbies: demograData?.data?.hobbies?.length > 0 && demograData?.data?.hobbies || null,
        skills_seeking_to_learn: demograData?.data?.skills_seeking_to_learn?.length > 0 && demograData?.data?.skills_seeking_to_learn || null,
        hobbies_seeking_to_adopt: demograData?.data?.hobbies_seeking_to_adopt?.length > 0 && demograData?.data?.hobbies_seeking_to_adopt || null,
        aspiration: String(demograData?.data?.aspiration || ''),
        unfulfilled: String(demograData?.data?.unfulfilled || ''),
        wishes: String(demograData?.data?.wishes || ''),
      })
    }
  }, [demograData, reset])
  if (isLoading) {
    return <View style={{ flex: 1, justifyContent: 'center' }}>
      <ActivityIndicator size={'large'} color='#000' />
    </View>
  }
  // console.log("watchhhhh", watch('habits'))
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={'Demographic Info'}
        goBack={() => navigation.goBack()}
      />
      <ScrollView>
        <View style={styles.mainContainer}>
          {/* Marital status */}
          <Text style={styles.item_header_txt}>Select marital status</Text>
          <View style={styles.item_container}>
            <Controller
              name="marital_status"
              control={control}
              render={({ field }) => {
                const { onChange, value } = field;
                return (
                  <TouchableOpacity onPress={() => onChange('Single')}>
                    {value === 'Single' ? (
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
            <Text style={styles.option_text}>Single</Text>
            <Controller
              name="marital_status"
              control={control}
              render={({ field }) => {
                const { onChange, value } = field;
                return (
                  <TouchableOpacity onPress={() => onChange('Married')} >
                    {value === 'Married' ? (
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
            <Text style={styles.option_text}>Married</Text>
          </View>
          {errors?.marital_status?.message ? (
            <Text style={styles.error}>
              {errors?.marital_status?.message}
            </Text>
          ) : null}
          {/* Diet */}
          <Controller
            control={control}
            name="diet"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <CustomDropdown3
                  containerStyle={{ width: width / 1.12 }}
                  data={diet}
                  selectedValue={onChange}
                  value={value === 1 ? 'others' : value}
                  defaultVal={{ key: value, value: value }}
                  infoName={'Diet'}
                />
              );
            }}
          />
          {errors?.diet?.message ? (
            <Text style={styles.error}>
              {errors?.diet?.message}
            </Text>
          ) : null}
          {/* Height */}
          <Controller
            name="height"
            control={control}
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <InputWithTitle
                  productName={'Height'}
                  onChangeText={onChange}
                  value={value}
                  keyboardType={'numeric'}
                />
              );
            }}
          />
          {errors?.height?.message ? (
            <Text style={styles.error}>
              {errors?.height?.message}
            </Text>
          ) : null}
          {/* Weight */}
          <Controller
            name="weight"
            control={control}
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <InputWithTitle
                  productName={'Weight'}
                  onChangeText={onChange}
                  value={value}
                  keyboardType={'numeric'}
                />
              );
            }}
          />
          {errors?.height?.message ? (
            <Text style={styles.error}>
              {errors?.height?.message}
            </Text>
          ) : null}
          {/* Speaking */}
          <Controller
            control={control}
            name="speaking"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <CustomDropdown3
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[]}
                  selectedValue={onChange}
                  value={value}
                  defaultVal={{ key: value, value: value }}
                  infoName={'Speaking'}
                />
              );
            }}
          />
          {errors?.speaking?.message ? (
            <Text style={styles.error}>
              {errors?.speaking?.message}
            </Text>
          ) : null}
          {/* reading */}
          <Controller
            control={control}
            name="reading"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <CustomDropdown3
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[]}
                  selectedValue={onChange}
                  value={value}
                  defaultVal={{ key: value, value: value }}
                  infoName={'Reading'}
                />
              );
            }}
          />
          {errors?.reading?.message ? (
            <Text style={styles.error}>
              {errors?.reading?.message}
            </Text>
          ) : null}
          {/* writing */}
          <Controller
            control={control}
            name="writing"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <CustomDropdown3
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[]}
                  selectedValue={onChange}
                  value={value}
                  defaultVal={{ key: value, value: value }}
                  infoName={'Writing'}
                />
              );
            }}
          />
          {errors?.writing?.message ? (
            <Text style={styles.error}>
              {errors?.writing?.message}
            </Text>
          ) : null}
          {/* occupation */}
          <Controller
            control={control}
            name="occupation"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <CustomDropdown3
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[]}
                  selectedValue={onChange}
                  value={value}
                  defaultVal={{ key: value, value: value }}
                  infoName={'Occupation'}
                />
              );
            }}
          />
          {errors?.occupation?.message ? (
            <Text style={styles.error}>
              {errors?.occupation?.message}
            </Text>
          ) : null}
          {/* Yearly income */}
          <Controller
            control={control}
            name="yearly_income"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <InputWithoutBorder
                  containerStyle={{ width: width / 1.12 }}
                  measureName={user.data.currency}
                  productionName={'Yearly Income'}
                  value={value}
                  onChangeText={onChange}
                  notRightText={false}
                />
              );
            }}
          />
          {errors?.yearly_income?.message ? (
            <Text style={styles.error}>
              {errors?.yearly_income?.message}
            </Text>
          ) : null}
          {/* Bank Account */}
          <Text style={styles.item_header_txt}>Do you have a bank account ?</Text>
          <View style={styles.item_container}>
            <Controller
              name="bank_account"
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
              name="bank_account"
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
          {errors?.bank_account?.message ? (
            <Text style={styles.error}>
              {errors?.bank_account?.message}
            </Text>
          ) : null}
          {/* Savings/Investments */}
          <Text style={styles.item_header_txt}>Do you have a savings/investment ?</Text>
          <View style={styles.item_container}>
            <Controller
              name="savings_investment"
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
              name="savings_investment"
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
          {errors?.savings_investment?.message ? (
            <Text style={styles.error}>
              {errors?.savings_investment?.message}
            </Text>
          ) : null}
          {/* Chronic disease */}
          <Controller
            control={control}
            name="chronic_diseases"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <CustomDropdown3
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[]}
                  selectedValue={onChange}
                  value={value}
                  defaultVal={{ key: value, value: value }}
                  infoName={'Chronic Disease'}
                />
              );
            }}
          />
          {errors?.chronic_diseases?.message ? (
            <Text style={styles.error}>
              {errors?.chronic_diseases?.message}
            </Text>
          ) : null}
          {/* Handicap */}
          <Text style={styles.item_header_txt}>Are you handicap ?</Text>
          <View style={styles.item_container}>
            <Controller
              name="handicap"
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
              name="handicap"
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
          {errors?.handicap?.message ? (
            <Text style={styles.error}>
              {errors?.handicap?.message}
            </Text>
          ) : null}
          {/* Mental Emotional */}
          <Text style={styles.item_header_txt}>Select mental and emotional stability</Text>
          <View style={styles.item_container}>
            <Controller
              name="mental_emotional"
              control={control}
              render={({ field }) => {
                const { onChange, value } = field;
                return (
                  <TouchableOpacity onPress={() => onChange('Good')}>
                    {value === 'Good' ? (
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
            <Text style={styles.option_text}>Good</Text>
            <Controller
              name="mental_emotional"
              control={control}
              render={({ field }) => {
                const { onChange, value } = field;
                return (
                  <TouchableOpacity onPress={() => onChange('Average')} >
                    {value === 'Average' ? (
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
            <Text style={styles.option_text}>Average</Text>
            <Controller
              name="mental_emotional"
              control={control}
              render={({ field }) => {
                const { onChange, value } = field;
                return (
                  <TouchableOpacity onPress={() => onChange('Poor')} >
                    {value === 'Poor' ? (
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
            <Text style={styles.option_text}>Poor</Text>
          </View>
          {errors?.mental_emotional?.message ? (
            <Text style={styles.error}>
              {errors?.mental_emotional?.message}
            </Text>
          ) : null}
          {/* Habits */}
          <Controller
            control={control}
            name="habits"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <MultiselectDropdown
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[{ key: 'Cricket', name: 'Cricket' }, { key: 'Football', name: 'Football' }, { key: 'Story Books', name: 'Story Books' }]}
                  setSelectedd={onChange}
                  selectedd={value?.length>=0? value: []}
                  infoName={'Habits'}
                />
              );
            }}
          />
          {errors?.habits && errors?.habits[0]?.message || errors?.habits?.message ? (
            <Text style={styles.error}>
              {errors?.habits[0]?.message || errors?.habits?.message}
            </Text>
          ) : null}
          {/* education */}
          <Controller
            control={control}
            name="education"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <CustomDropdown3
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[]}
                  selectedValue={onChange}
                  value={value}
                  defaultVal={{ key: value, value: value }}
                  infoName={'Education'}
                />
              );
            }}
          />
          {errors?.education?.message ? (
            <Text style={styles.error}>
              {errors?.education?.message}
            </Text>
          ) : null}
          {/* education seeking */}
          <Text style={styles.item_header_txt}>Are you willing to seek education further?</Text>
          <View style={styles.item_container}>
            <Controller
              name="education_seeking_to_gain"
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
              name="education_seeking_to_gain"
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
          {errors?.education_seeking_to_gain?.message ? (
            <Text style={styles.error}>
              {errors?.education_seeking_to_gain?.message}
            </Text>
          ) : null}
          {/* Skillset */}
          <Controller
            control={control}
            name="skillsets"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <MultiselectDropdown
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[{ key: 'Cricket', name: 'Cricket' }, { key: 'Football', name: 'Football' }, { key: 'Story Books', name: 'Story Books' }]}
                  setSelectedd={onChange}
                  selectedd={value?.length >= 0 ? value : []}
                  infoName={'Skillset'}
                />
              );
            }}
          />
          {errors?.skillsets && errors?.skillsets[0]?.message || errors?.skillsets?.message ? (
            <Text style={styles.error}>
              {errors?.skillsets[0]?.message || errors?.skillsets?.message}
            </Text>
          ) : null}
          {/* Hobbies */}
          <Controller
            control={control}
            name="hobbies"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <MultiselectDropdown
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[{ key: 'Cricket', name: 'Cricket' }, { key: 'Football', name: 'Football' }, { key: 'Story Books', name: 'Story Books' }]}
                  setSelectedd={onChange}
                  selectedd={value?.length >= 0 ? value : []}
                  infoName={'Hobbies'}
                />
              );
            }}
          />
          {errors?.hobbies && errors?.hobbies[0]?.message || errors?.hobbies?.message ? (
            <Text style={styles.error}>
              {errors?.hobbies[0]?.message || errors?.hobbies?.message}
            </Text>
          ) : null}
          {/* Skills seeking to learn */}
          <Controller
            control={control}
            name="skills_seeking_to_learn"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <MultiselectDropdown
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[{ key: 'Cricket', name: 'Cricket' }, { key: 'Football', name: 'Football' }, { key: 'Story Books', name: 'Story Books' }]}
                  setSelectedd={onChange}
                  selectedd={value?.length >= 0 ? value : []}
                  infoName={'Skills seeking to learn'}
                />
              );
            }}
          />
          {errors?.skills_seeking_to_learn && errors?.skills_seeking_to_learn[0]?.message || errors?.skills_seeking_to_learn?.message ? (
            <Text style={styles.error}>
              {errors?.skills_seeking_to_learn[0]?.message || errors?.skills_seeking_to_learn?.message}
            </Text>
          ) : null}
          {/* hobbies seeking to adopt */}
          <Controller
            control={control}
            name="hobbies_seeking_to_adopt"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <MultiselectDropdown
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[{ key: 'Cricket', name: 'Cricket' }, { key: 'Football', name: 'Football' }, { key: 'Story Books', name: 'Story Books' }]}
                  setSelectedd={onChange}
                  selectedd={value?.length >= 0 ? value : []}
                  infoName={'Hobbies seeking to adopt'}
                />
              );
            }}
          />
          {errors?.hobbies_seeking_to_adopt && errors?.hobbies_seeking_to_adopt[0]?.message || errors?.hobbies_seeking_to_adopt?.message ? (
            <Text style={styles.error}>
              {errors?.hobbies_seeking_to_adopt[0]?.message || errors?.hobbies_seeking_to_adopt?.message}
            </Text>
          ) : null}
          {/* Aspiration */}
          <Controller
            name="aspiration"
            control={control}
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <InputWithTitle
                  productName={'Aspiration'}
                  onChangeText={onChange}
                  value={value}
                  keyboardType={'default'}
                />
              );
            }}
          />
          {errors?.aspiration?.message ? (
            <Text style={styles.error}>
              {errors?.aspiration?.message}
            </Text>
          ) : null}
          {/* unfulfilled needs */}
          <Controller
            name="unfulfilled"
            control={control}
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <InputWithTitle
                  productName={'Unfulfilled needs if any'}
                  onChangeText={onChange}
                  value={value}
                  keyboardType={'default'}
                />
              );
            }}
          />
          {errors?.unfulfilled?.message ? (
            <Text style={styles.error}>
              {errors?.unfulfilled?.message}
            </Text>
          ) : null}
          {/* wishes */}
          <Controller
            name="wishes"
            control={control}
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <InputWithTitle
                  productName={'Wishes'}
                  onChangeText={onChange}
                  value={value}
                  keyboardType={'default'}
                />
              );
            }}
          />
          {errors?.wishes?.message ? (
            <Text style={styles.error}>
              {errors?.wishes?.message}
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

export default Demographic
const { width } = Dimensions.get('window')
const makeStyles = fontScale => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 12,
  },
  mainContainer: {
    // flex: 1,
    paddingHorizontal: 16,
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
  error: {
    fontFamily: fontFamilyRegular,
    fontSize: 14 / fontScale,
    color: '#ff000e',
    marginLeft: 20,
    marginBottom: 5,
    marginTop: 5,
  },
})