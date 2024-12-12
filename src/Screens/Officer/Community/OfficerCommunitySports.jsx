import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { borderColor, primaryColor } from '../../../styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../Components/CustomHeader/CustomHeader';
import { Styles } from '../../../styles/globalStyles';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import PopupModal from '../../../Components/Popups/PopupModal';
import CustomDropdown from '../../../Components/CustomDropdown/CustomDropdown';
import MultiselectDropdown from '../../../Components/MultiselectDropdown/MultiselectDropdown';
import Input from '../../../Components/Inputs/Input';

const OfficerCommunitySports = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { community, village_id, data } = route.params
  const scheme = yup.object().shape({
    sports: yup.boolean().required(t('Sports is required')),
    kind_of_sports: yup.array().test(
      'sports-required-if-safety-issues',
      t('Kind of sports is required'),
      function (value) {
        const { sports } = this.parent;
        if (sports) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    spiritual_retreats: yup.boolean().required(t('Spiritual retreat is required')),
    how_frequently: yup.string().test(
      'spiritual-retreats-required-if-safety-issues',
      t('How frequently is required'),
      function (value) {
        const { spiritual_retreats } = this.parent;
        if (spiritual_retreats) {
          return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    spiritual_sanctums: yup.boolean().required(t('Spiritual sanctum is required')),
    how_many_sanctums: yup.array().test(
      'sanctums-required-if-safety-issues',
      t('How many is required'),
      function (value) {
        const { spiritual_sanctums } = this.parent;
        if (spiritual_sanctums) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    post_office: yup.boolean().required(t('Post office is required')),
    how_many_post_offices: yup.array().test(
      'how-many-post-office-required-if-safety-issues',
      t('How many is required'),
      function (value) {
        const { post_office } = this.parent;
        if (post_office) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    how_far_from_village_offices: yup.string().test(
      'how-far-from-village-post-office-required-if-safety-issues',
      t('How far from village is required'),
      function (value) {
        const { post_office } = this.parent;
        if (post_office) {
          return value && value.trim() !== ''; // Ensure 'describe' is not empty if safety_issues_on_roads is true
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    sewage_treatment_facility: yup.boolean().required(t('Sewage treatment is required')),
    how_many_sewage_treatment: yup.array().test(
      'how-many-sewage-required-if-safety-issues',
      t('How many is required'),
      function (value) {
        const { sewage_treatment_facility } = this.parent;
        if (sewage_treatment_facility) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    sewage_type: yup.array().test(
      'sewage-type-if-safety-issues',
      t('Sewage type is required'),
      function (value) {
        const { sewage_treatment_facility } = this.parent;
        if (sewage_treatment_facility) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    composing_facility: yup.boolean().required(t('Composing facility is required')),
    how_many_composing_facility: yup.array().test(
      'how-many-composing-facility-required-if-safety-issues',
      t('How many is required'),
      function (value) {
        const { composing_facility } = this.parent;
        if (composing_facility) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    composing_type: yup.array().test(
      'composing-type-if-safety-issues',
      t('Composing type is required'),
      function (value) {
        const { composing_facility } = this.parent;
        if (composing_facility) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    recycling: yup.boolean().required(t('Recycling is required')),
    recycling_type: yup.array().test(
      'recycling-type-required-if-safety-issues',
      t('Recycling type is required'),
      function (value) {
        const { recycling } = this.parent;
        if (recycling) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
    water_segregation: yup.boolean().required(t('Water segregation is required')),
    level_of_segregation: yup.array().test(
      'level-of-segregation-required-if-safety-issues',
      t('Level of segregation is required'),
      function (value) {
        const { water_segregation } = this.parent;
        if (water_segregation) {
          if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
            return value.length > 0;
          }
          return false;
        }
        return true; // Pass validation if safety_issues_on_roads is false
      }
    ),
  });
  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    setFieldTouched,
    setFieldValue,
    touched,
    resetForm,
    setValues
  } = useFormik({
    initialValues: {
      sports: false,
      kind_of_sports: [],
      spiritual_retreats: false,
      how_frequently: '',
      spiritual_sanctums: false,
      how_many_sanctums: [],
      post_office: false,
      how_many_post_offices: [],
      how_far_from_village_offices: '',
      sewage_treatment_facility: false,
      how_many_sewage_treatment: [],
      sewage_type: [],
      composing_facility: false,
      how_many_composing_facility: [],
      composing_type: [],
      recycling: false,
      recycling_type: [],
      water_segregation: false,
      level_of_segregation: [],
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
      navigation.navigate('officerCommunityStreet', { community, sports: values, village_id, data })
    },

  });
  useEffect(()=>{
    resetForm({
      values:{
        sports: data?.sports || false,
        kind_of_sports: data?.kind_of_sports ||[],
        spiritual_retreats: data?.spiritual_retreats || false,
        how_frequently: data?.how_frequently || '',
        spiritual_sanctums: data?.spiritual_sanctums || false,
        how_many_sanctums: data?.how_many_sanctums ||[],
        post_office: data?.post_office || false,
        how_many_post_offices: data?.how_many_post_offices ||[],
        how_far_from_village_offices: data?.how_far_from_village_offices || '',
        sewage_treatment_facility: data?.sewage_treatment_facility || false,
        how_many_sewage_treatment: data?.how_many_sewage_treatment ||[],
        sewage_type: data?.sewage_type ||[],
        composing_facility: data?.composing_facility || false,
        how_many_composing_facility: data?.how_many_composing_facility ||[],
        composing_type: data?.composing_type ||[],
        recycling: data?.recycling || false,
        recycling_type: data?.recycling_type ||[],
        water_segregation: data?.water_segregation || false,
        level_of_segregation: data?.level_of_segregation ||[],
      }
    })
  },[data])
  // if (isTypeLoading || isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
  //       <ActivityIndicator size={'large'} color={primaryColor} />
  //     </View>
  //   );
  // }
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t(`community`)}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.sports}
          label={t('Sports')}
          onChange={value => {
            setValues({
              ...values,
              sports: value?.value,
            });
          }}
        />
        {touched?.sports && errors?.sports && (
          <Text style={Styles.error2}>{String(errors?.sports)}</Text>
        )}
        {values?.sports &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={[
                  {
                    key: '6736117ecb51156c2f52383e',
                    name: 'Tank'
                  },
                  {
                    key: '6736117ecb51156c2f52583e',
                    name: 'Tank1'
                  },
                  {
                    key: '6736117ecb51156c2f52323e',
                    name: 'Tank2'
                  },
                ]}
                setSelectedd={(value) => {
                  setValues({ ...values, kind_of_sports: value });
                }}
                selectedd={values?.kind_of_sports}
                infoName={t('Kind of sports ?')}
              />
              {errors.kind_of_sports &&
                touched.kind_of_sports && (
                  <Text style={Styles.error2}>
                    {
                    errors.kind_of_sports
                    }
                  </Text>
                )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.spiritual_retreats}
          label={t('Spiritual Retreats')}
          onChange={value => {
            setValues({
              ...values,
              spiritual_retreats: value?.value,
            });
          }}
        />
        {touched?.spiritual_retreats && errors?.spiritual_retreats && (
          <Text style={Styles.error2}>{String(errors?.spiritual_retreats)}</Text>
        )}
        {values?.spiritual_retreats &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <CustomDropdown
                data={
                  [{ label: '1 Kilometer', value: '6736117ecb51156c2f52383e' }, { label: '2 Kilometer', value: '6736117ecb51155c2f52383e' }]
                }
                value={values?.how_frequently}
                label={t('How frequently ?')}
                onChange={value => {
                  setValues({
                    ...values,
                    how_frequently: value?.value,
                  });
                }}
              />
              {errors.how_frequently &&
                touched.how_frequently && (
                  <Text style={Styles.error2}>
                    {
                    errors.how_frequently
                    }
                  </Text>
                )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.spiritual_sanctums}
          label={t('Spiritual sanctums')}
          onChange={value => {
            setValues({
              ...values,
              spiritual_sanctums: value?.value,
            });
          }}
        />
        {touched?.spiritual_sanctums && errors?.spiritual_sanctums && (
          <Text style={Styles.error2}>{String(errors?.spiritual_sanctums)}</Text>
        )}
        {values?.spiritual_sanctums &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={[
                  {
                    key: '6736117ecb51156c2f52383e',
                    name: 'Tank'
                  },
                  {
                    key: '6736117ecb51156c2f52583e',
                    name: 'Tank1'
                  },
                  {
                    key: '6736117ecb51156c2f52323e',
                    name: 'Tank2'
                  },
                ]}
                setSelectedd={(value) => {
                  setValues({ ...values, how_many_sanctums: value });
                }}
                selectedd={values?.how_many_sanctums}
                infoName={t('How many?')}
              />
              {errors.how_many_sanctums &&
                touched.how_many_sanctums && (
                  <Text style={Styles.error2}>
                    {
                    errors.how_many_sanctums
                    }
                  </Text>
                )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.post_office}
          label={t('Post office')}
          onChange={value => {
            setValues({
              ...values,
              post_office: value?.value,
            });
          }}
        />
        {touched?.post_office && errors?.post_office && (
          <Text style={Styles.error2}>{String(errors?.post_office)}</Text>
        )}
        {values?.post_office &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={[
                  {
                    key: '6736117ecb51156c2f52383e',
                    name: 'Tank'
                  },
                  {
                    key: '6736117ecb51156c2f52583e',
                    name: 'Tank1'
                  },
                  {
                    key: '6736117ecb51156c2f52323e',
                    name: 'Tank2'
                  },
                ]}
                setSelectedd={(value) => {
                  setValues({ ...values, how_many_post_offices: value });
                }}
                selectedd={values?.how_many_post_offices}
                infoName={t('How many?')}
              />
              {errors.how_many_post_offices &&
                touched.how_many_post_offices && (
                  <Text style={Styles.error2}>
                    {
                    errors.how_many_post_offices
                    }
                  </Text>
                )}
              <CustomDropdown
                data={
                  [{ label: '1 Kilometer', value: '6736117ecb51156c2f52383e' }, { label: '2 Kilometer', value: '6736117ecb51155c2f52383e' }]
                }
                value={values?.how_far_from_village_offices}
                label={t('How far from village')}
                onChange={value => {
                  setValues({
                    ...values,
                    how_far_from_village_offices: value?.value,
                  });
                }}
              />
              {touched?.how_far_from_village_offices && errors?.how_far_from_village_offices && (
                <Text style={Styles.error2}>{String(errors?.how_far_from_village_offices)}</Text>
              )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.sewage_treatment_facility}
          label={t('Sewage treatment facility')}
          onChange={value => {
            setValues({
              ...values,
              sewage_treatment_facility: value?.value,
            });
          }}
        />
        {touched?.sewage_treatment_facility && errors?.sewage_treatment_facility && (
          <Text style={Styles.error2}>{String(errors?.sewage_treatment_facility)}</Text>
        )}
        {values?.sewage_treatment_facility &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={[
                  {
                    key: '6736117ecb51156c2f52383e',
                    name: 'Tank'
                  },
                  {
                    key: '6736117ecb51156c2f52583e',
                    name: 'Tank1'
                  },
                  {
                    key: '6736117ecb51156c2f52323e',
                    name: 'Tank2'
                  },
                ]}
                setSelectedd={(value) => {
                  setValues({ ...values, how_many_sewage_treatment: value });
                }}
                selectedd={values?.how_many_sewage_treatment}
                infoName={t('How many?')}
              />
              {errors.how_many_sewage_treatment &&
                touched.how_many_sewage_treatment && (
                  <Text style={Styles.error2}>
                    {
                    errors.how_many_sewage_treatment
                    }
                  </Text>
                )}
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={[
                  {
                    key: '6736117ecb51156c2f52383e',
                    name: 'Tank'
                  },
                  {
                    key: '6736117ecb51156c2f52583e',
                    name: 'Tank1'
                  },
                  {
                    key: '6736117ecb51156c2f52323e',
                    name: 'Tank2'
                  },
                ]}
                setSelectedd={(value) => {
                  setValues({ ...values, sewage_type: value });
                }}
                selectedd={values?.sewage_type}
                infoName={t('Sewage type')}
              />
              {errors.sewage_type &&
                touched.sewage_type && (
                  <Text style={Styles.error2}>
                    {
                    errors.sewage_type
                    }
                  </Text>
                )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.composing_facility}
          label={t('Composing facility')}
          onChange={value => {
            setValues({
              ...values,
              composing_facility: value?.value,
            });
          }}
        />
        {touched?.composing_facility && errors?.composing_facility && (
          <Text style={Styles.error2}>{String(errors?.composing_facility)}</Text>
        )}
        {values?.composing_facility &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={[
                  {
                    key: '6736117ecb51156c2f52383e',
                    name: 'Tank'
                  },
                  {
                    key: '6736117ecb51156c2f52583e',
                    name: 'Tank1'
                  },
                  {
                    key: '6736117ecb51156c2f52323e',
                    name: 'Tank2'
                  },
                ]}
                setSelectedd={(value) => {
                  setValues({ ...values, how_many_composing_facility: value });
                }}
                selectedd={values?.how_many_composing_facility}
                infoName={t('How many?')}
              />
              {errors.how_many_composing_facility &&
                touched.how_many_composing_facility && (
                  <Text style={Styles.error2}>
                    {
                    errors.how_many_composing_facility
                    }
                  </Text>
                )}
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={[
                  {
                    key: '6736117ecb51156c2f52383e',
                    name: 'Tank'
                  },
                  {
                    key: '6736117ecb51156c2f52583e',
                    name: 'Tank1'
                  },
                  {
                    key: '6736117ecb51156c2f52323e',
                    name: 'Tank2'
                  },
                ]}
                setSelectedd={(value) => {
                  setValues({ ...values, composing_type: value });
                }}
                selectedd={values?.composing_type}
                infoName={t('Composing type')}
              />
              {errors.composing_type &&
                touched.composing_type && (
                  <Text style={Styles.error2}>
                    {
                    errors.composing_type
                    }
                  </Text>
                )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.recycling}
          label={t('Recycling')}
          onChange={value => {
            setValues({
              ...values,
              recycling: value?.value,
            });
          }}
        />
        {touched?.recycling && errors?.recycling && (
          <Text style={Styles.error2}>{String(errors?.recycling)}</Text>
        )}
        {values?.recycling &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={[
                  {
                    key: '6736117ecb51156c2f52383e',
                    name: 'Tank'
                  },
                  {
                    key: '6736117ecb51156c2f52583e',
                    name: 'Tank1'
                  },
                  {
                    key: '6736117ecb51156c2f52323e',
                    name: 'Tank2'
                  },
                ]}
                setSelectedd={(value) => {
                  setValues({ ...values, recycling_type: value });
                }}
                selectedd={values?.recycling_type}
                infoName={t('Recycling type')}
              />
              {errors.recycling_type &&
                touched.recycling_type && (
                  <Text style={Styles.error2}>
                    {
                    errors.recycling_type
                    }
                  </Text>
                )}
            </View>
          </View>
        }
        <CustomDropdown
          data={
            [{ label: 'Yes', value: true }, { label: 'No', value: false }]
          }
          value={values?.water_segregation}
          label={t('Water segregation')}
          onChange={value => {
            setValues({
              ...values,
              water_segregation: value?.value,
            });
          }}
        />
        {touched?.water_segregation && errors?.water_segregation && (
          <Text style={Styles.error2}>{String(errors?.water_segregation)}</Text>
        )}
        {values?.water_segregation &&
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              <MultiselectDropdown
                containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                data={[
                  {
                    key: '6736117ecb51156c2f52383e',
                    name: 'Tank'
                  },
                  {
                    key: '6736117ecb51156c2f52583e',
                    name: 'Tank1'
                  },
                  {
                    key: '6736117ecb51156c2f52323e',
                    name: 'Tank2'
                  },
                ]}
                setSelectedd={(value) => {
                  setValues({ ...values, level_of_segregation: value });
                }}
                selectedd={values?.level_of_segregation}
                infoName={t('Level of segregation')}
              />
              {errors.level_of_segregation &&
                touched.level_of_segregation && (
                  <Text style={Styles.error2}>
                    {
                    errors.level_of_segregation
                    }
                  </Text>
                )}
            </View>
          </View>
        }
      </KeyboardAwareScrollView>
      <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <CustomButton btnText={t('next')} onPress={handleSubmit} style={{ width: '100%' }} />
      </View>
    </View>
  )
}

export default OfficerCommunitySports

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
})