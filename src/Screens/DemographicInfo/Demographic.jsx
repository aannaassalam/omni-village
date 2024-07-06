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

const data = {
  maritalStatus: 'Single',
  diet: 'Predominantly vegetarian',
  height: '',
  weight: '',
  speaking: '',
  reading: '',
  writing: '',
  occupation: '',
  yearlyIncome: '',
  bankAccount: false,
  savings: false,
  chronicDiseases: '',
  handicap: false,
  mentalEmotional: '',
  habits: [],
  education: '',
  educationSeekingToGain: false,
  skillset: [],
  hobbies: [],
  skillsSeekingToLearn: [],
  hobbiesSeekingToAdopt: [],
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
  const schema = yup.object().shape({
    maritalStatus: yup.string().required('Required'),
    diet: yup.string().required('Required'),
    height: yup.string().required('Required'),
    speaking: yup.string().required('Required'),
    reading: yup.string().required('Required'),
    writing: yup.string().required('Required'),
    occupation: yup.string().required('Required'),
    yearlyIncome: yup.string().required('Required'),
    bankAccount: yup.string().required('Required'),
    savings: yup.string().required('Required'),
    chronicDisease: yup.string().required('Required'),
    handicap: yup.string().required('Required'),
    mentalEmotional: yup.string().required('Required'),
    habits: yup.array()
      .of(yup.string().required('habits is required'))
      .min(1, 'At least one habit is required')
      .max(10, 'No more than 10 habits are allowed'),
    education: yup.string().required('Required'),
    educationSeekingToGain: yup.string().required('Required'),
    skillset: yup.array()
      .of(yup.string().required('skillsets is required'))
      .min(1, 'At least one skillset is required')
      .max(10, 'No more than 10 habits are allowed'),
    hobbies: yup.array()
      .of(yup.string().required('hobbies is required'))
      .min(1, 'At least one hobbie is required')
      .max(10, 'No more than 10 hobbies are allowed'),
    skillsSeekingToLearn: yup.array()
      .of(yup.string().required('skills seeking to learn is required'))
      .min(1, 'At least one skills seeking to learn is required')
      .max(10, 'No more than 10 habits are allowed'),
    hobbiesSeekingToAdopt: yup.array()
      .of(yup.string().required('hobbies seeking to adopt is required'))
      .min(1, 'At least one hobbie seeking to adopt is required')
      .max(10, 'No more than 10 hobbies seeking to adopt are allowed'),
    aspiration: yup.string(),
    unfulfilled: yup.string(),
    wishes: yup.string().required('Required'),

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
      maritalStatus: String(data.maritalStatus || ''),
      diet: String(data.diet || ''),
      height: String(data.height || ''),
      weight: String(data.weight || ''),
      speaking: String(data.speaking || ''),
      reading: String(data.reading || ''),
      writing: String(data.writing || ''),
      occupation: String(data.occupation || ''),
      yearlyIncome: String(data.yearlyIncome || ''),
      bankAccount: Boolean(data.bankAccount || false),
      savings: Boolean(data.savings || false),
      chronicDiseases: String(data.chronicDiseases || ''),
      handicap: Boolean(data.handicap || false),
      mentalEmotional: String(data.mentalEmotional || ''),
      habits: Array(data.habits.length > 0 && data.habits || ''),
      education: String(data.education || ''),
      educationSeekingToGain: Boolean(data.educationSeekingToGain || false),
      skillset: Array(data.skillset.length > 0 && data.skillset || ''),
      hobbies: Array(data.hobbies.length > 0 && data.hobbies || ''),
      skillsSeekingToLearn: Array(data.skillsSeekingToLearn.length > 0 && data.skillsSeekingToLearn || ''),
      hobbiesSeekingToAdopt: Array(data.hobbiesSeekingToAdopt.length > 0 && data.hobbiesSeekingToAdopt.length || ''),
      aspiration: String(data.aspiration || ''),
      unfulfilled: String(data.unfulfilled || ''),
      wishes: String(data.wishes || ''),
    }
  })
  const onSubmit = (data) => {
    setSavepopup(false)
  }
  const handleDraft = (data) => {
    setDraftpopup(false)
  }
  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      setSavepopup(false);
    }
  }, [errors]);
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
              name="maritalStatus"
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
              name="maritalStatus"
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
          {errors?.maritalStatus?.message ? (
            <Text style={styles.error}>
              {errors?.maritalStatus?.message}
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
            name="yearlyIncome"
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
          {errors?.reading?.message ? (
            <Text style={styles.error}>
              {errors?.reading?.message}
            </Text>
          ) : null}
          {/* Bank Account */}
          <Text style={styles.item_header_txt}>Do you have a bank account ?</Text>
          <View style={styles.item_container}>
            <Controller
              name="bankAccount"
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
              name="bankAccount"
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
          {errors?.bankAccount?.message ? (
            <Text style={styles.error}>
              {errors?.bankAccount?.message}
            </Text>
          ) : null}
          {/* Savings/Investments */}
          <Text style={styles.item_header_txt}>Do you have a savings/investment ?</Text>
          <View style={styles.item_container}>
            <Controller
              name="savings"
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
              name="savings"
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
          {errors?.savings?.message ? (
            <Text style={styles.error}>
              {errors?.savings?.message}
            </Text>
          ) : null}
          {/* Chronic disease */}
          <Controller
            control={control}
            name="chronicDisease"
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
          {errors?.chronicDisease?.message ? (
            <Text style={styles.error}>
              {errors?.chronicDisease?.message}
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
              name="mentalEmotional"
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
              name="mentalEmotional"
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
              name="mentalEmotional"
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
          {errors?.mentalEmotional?.message ? (
            <Text style={styles.error}>
              {errors?.mentalEmotional?.message}
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
                  selectedValue={onChange}
                  value={value}
                  defaultVal={{ key: value, value: value }}
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
              name="educationSeekingToGain"
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
              name="educationSeekingToGain"
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
          {errors?.educationSeekingToGain?.message ? (
            <Text style={styles.error}>
              {errors?.educationSeekingToGain?.message}
            </Text>
          ) : null}
          {/* Skillset */}
          <Controller
            control={control}
            name="skillset"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <MultiselectDropdown
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[{ key: 'Cricket', name: 'Cricket' }, { key: 'Football', name: 'Football' }, { key: 'Story Books', name: 'Story Books' }]}
                  selectedValue={onChange}
                  value={value}
                  defaultVal={{ key: value, value: value }}
                  infoName={'Skillset'}
                />
              );
            }}
          />
          {errors?.skillset && errors?.skillset[0]?.message || errors?.skillset?.message ? (
            <Text style={styles.error}>
              {errors?.skillset[0]?.message || errors?.skillset?.message}
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
                  selectedValue={onChange}
                  value={value}
                  defaultVal={{ key: value, value: value }}
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
            name="skillsSeekingToLearn"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <MultiselectDropdown
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[{ key: 'Cricket', name: 'Cricket' }, { key: 'Football', name: 'Football' }, { key: 'Story Books', name: 'Story Books' }]}
                  selectedValue={onChange}
                  value={value}
                  defaultVal={{ key: value, value: value }}
                  infoName={'Skills seeking to learn'}
                />
              );
            }}
          />
          {errors?.skillsSeekingToLearn && errors?.skillsSeekingToLearn[0]?.message || errors?.skillsSeekingToLearn?.message ? (
            <Text style={styles.error}>
              {errors?.skillsSeekingToLearn[0]?.message || errors?.skillsSeekingToLearn?.message}
            </Text>
          ) : null}
          {/* hobbies seeking to adopt */}
          <Controller
            control={control}
            name="hobbiesSeekingToAdopt"
            render={({ field }) => {
              const { onChange, value } = field;
              return (
                <MultiselectDropdown
                  containerStyle={{ width: width / 1.12, marginTop: '5%', paddingTop: 0 }}
                  data={[{ key: 'Cricket', name: 'Cricket' }, { key: 'Football', name: 'Football' }, { key: 'Story Books', name: 'Story Books' }]}
                  selectedValue={onChange}
                  value={value}
                  defaultVal={{ key: value, value: value }}
                  infoName={'Hobbies seeking to adopt'}
                />
              );
            }}
          />
          {errors?.hobbiesSeekingToAdopt && errors?.hobbiesSeekingToAdopt[0]?.message || errors?.hobbiesSeekingToAdopt?.message ? (
            <Text style={styles.error}>
              {errors?.hobbiesSeekingToAdopt[0]?.message || errors?.hobbiesSeekingToAdopt?.message}
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
        styleInner={[styles.savePopup, { width: '90%' }]}>
        <View style={styles.submitPopup}>
          <View style={styles.noteImage}>
            <Image
              source={require('../../../assets/note.png')}
              style={styles.noteImage}
            />
          </View>
          <Text style={styles.confirmText}>{t('confirm')}</Text>
          <Text style={styles.nextText}>
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
        styleInner={[styles.savePopup, { width: '90%' }]}>
        <View style={styles.submitPopup}>
          <View style={styles.noteImage}>
            <Image
              source={require('../../../assets/note.png')}
              style={styles.noteImage}
            />
          </View>
          <Text style={styles.confirmText}>{t('save as draft')}</Text>
          <Text style={styles.nextText}>
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
  savePopup: {
    justifyContent: 'center',
    width: '97%',
    borderRadius: 20,
  },
  popupButton: {
    width: '70%',
    alignSelf: 'center',
  },
  confirmText: {
    alignSelf: 'center',
    fontSize: 18 / fontScale,
    color: '#000',
    fontFamily: fontFamilyMedium,
    fontWeight: '500',
    padding: 10,
    textAlign: 'center',
  },
  nextText: {
    alignSelf: 'center',
    fontSize: 18 / fontScale,
    color: '#000',
    fontFamily: fontFamilyMedium,
    textAlign: 'center',
  },
  submitPopup: {
    alignItems: 'center',
    padding: 10,
  },
  noteImage: {
    padding: 10,
  },
})