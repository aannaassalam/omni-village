import { Image, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useTranslation } from 'react-i18next';
import { ActivityIndicator, Divider } from 'react-native-paper';
import { borderColor, primaryColor } from '../../../styles/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../../Components/CustomHeader/CustomHeader';
import { height, Styles, width } from '../../../styles/globalStyles';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import PopupModal from '../../../Components/Popups/PopupModal';
import Input from '../../../Components/Inputs/Input';
import CustomDropdown from '../../../Components/CustomDropdown/CustomDropdown';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addModeratorLandholding, editModeratorLandholding, getModeratorLandholding } from '../../../functions/moderator';

const OfficerLandholding = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { village_id } = route.params
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const queryClient = useQueryClient()
  const { data: get_moderator_landholding, isLoading: isTypeLoading } = useQuery({
    queryKey: [`get_moderator_landholding`],
    queryFn: () => getModeratorLandholding(village_id),
    enabled: village_id ? true : false,
    refetchOnWindowFocus: true,
  })

  const { mutate: edit_moderator_landholding } = useMutation({
    mutationKey: ['edit_moderator_landholding'],
    mutationFn: async (data) => {
      editModeratorLandholding(data)
      queryClient.invalidateQueries()
    },
    onSuccess: (data) => { console.log("successsssss edit", data, navigation.replace('officerHome', { village_id: village_id })) },
    onError: (error) => console.log("error save", error),
    onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const { mutate: add_moderator_landholding } = useMutation({
    mutationKey: ['add_moderator_landholding'],
    mutationFn: async (data) => {
      addModeratorLandholding(data)
      queryClient.invalidateQueries()
    },
    onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('officerHome', { village_id: village_id }) },
    onError: (error) => console.log("error save", error),
    onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const scheme = yup.object().shape({
    total_area_allocated_village: yup
      .number()
      .required(t('Total area allocated village is required')),
    area_unit: yup.string(),
    farming_community_infrastructure: yup
      .number()
      .required(t('Farming community infrastructure is required')),
    unutilized_area: yup
      .number()
      .required(t('Unutilized area is required')),
    fallow: yup
      .number()
      .nullable()
      .test('optional-if-zero', t('Fallow is required'), function (value) {
        const { unutilized_area } = this.parent;
        if (unutilized_area > 0) {
          return value !== null && value >= 0;
        }
        return true; // Not required if Unutilized Area is zero
      }),
    under_forest: yup
      .number()
      .nullable()
      .test('optional-if-zero', t('Under Forest is required'), function (value) {
        const { unutilized_area } = this.parent;
        if (unutilized_area > 0) {
          return value !== null && value >= 0;
        }
        return true; // Not required if Unutilized Area is zero
      }),
    under_grassland: yup
      .number()
      .nullable()
      .test('optional-if-zero', t('Under Grassland is required'), function (value) {
        const { unutilized_area } = this.parent;
        if (unutilized_area > 0) {
          return value !== null && value >= 0;
        }
        return true; // Not required if Unutilized Area is zero
      }),
    others: yup
      .number(),
    land_owned_by_non_resident: yup
      .number()
      .required(t('Land owned by non-resident is required')),
    total_area_privately_owned: yup
      .number()
      .required(t('Total area privately owned is required')),
  }).test(
    'validate-fields',
    null,
    function (values) {
      const {
        total_area_allocated_village,
        farming_community_infrastructure,
        land_owned_by_non_resident,
        total_area_privately_owned,
        fallow,
        under_forest,
        under_grassland,
        others,
        unutilized_area,
      } = values;

      // Rule 1: Validate sum of specific fields against total area allocated
      const totalSumAllocated =
        (farming_community_infrastructure || 0) +
        (land_owned_by_non_resident || 0) +
        (total_area_privately_owned || 0);

      if (totalSumAllocated > total_area_allocated_village) {
        return this.createError({
          path: 'farming_community_infrastructure',
          message: t(
            'The sum of Farming & Community Infrastructure, Land Owned by Non-Residents, and Total Area Privately Owned must not exceed the Total Area Allocated to the Village'
          ),
        });
      }

      // Rule 2: Validate sum of unutilized fields against unutilized area
      const totalSumUnutilized =
        (fallow || 0) + (under_forest || 0) + (under_grassland || 0) + (others || 0);

      if (totalSumUnutilized > unutilized_area) {
        return this.createError({
          path: 'unutilized_area',
          message: t(
            'The sum of Fallow, Under Forest, Under Grassland, and Others must not exceed the Unutilized Area'
          ),
        });
      }

      // All validations pass
      return true;
    }
  );

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
      total_area_allocated_village: '',
      area_unit: '',
      farming_community_infrastructure: '',
      unutilized_area: '',
      fallow: '',
      under_forest: '',
      under_grassland: '',
      others: '',
      land_owned_by_non_resident: '',
      total_area_privately_owned: '',
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      if (values?.area_unit == "") {
        ToastAndroid.show(t("Invalid area unit. Please select a valid unit from the options provided next to the total area allocated to the village."), ToastAndroid.LONG);
      } else {
        setSavepopup(true)
      }
    },

  });
  const onSubmit = () => {
let data = {
  total_area_allocated_village: parseFloat(values.total_area_allocated_village),
  area_unit: values.area_unit,
  farming_community_infrastructure: parseFloat(values.farming_community_infrastructure),
  unutilized_area: parseFloat(values.unutilized_area),
  fallow: parseFloat(values.fallow),
  under_forest: parseFloat(values.under_forest),
  under_grassland: parseFloat(values.under_grassland),
  others: parseFloat(values.others),
  land_owned_by_non_resident: parseFloat(values.land_owned_by_non_resident),
  total_area_privately_owned: parseFloat(values.total_area_privately_owned),
}
if(get_moderator_landholding?._id){
  edit_moderator_landholding({ ...data, landholding_id: get_moderator_landholding?._id })
}else{
  add_moderator_landholding({ ...data, village_id : village_id})
}
   }
  const handleDraft = () => { }
  useEffect(() => {
    if (values?.total_area_allocated_village && values?.farming_community_infrastructure) {
      setValues({
        ...values,
        unutilized_area: String(values?.total_area_allocated_village - values?.farming_community_infrastructure)
      })
    }
  }, [values?.total_area_allocated_village, values?.farming_community_infrastructure])
  useEffect(()=>{
    resetForm({
      values: {
        total_area_allocated_village: String(get_moderator_landholding?.total_area_allocated_village || '') || '',
        area_unit: get_moderator_landholding?.area_unit || '',
        farming_community_infrastructure: String(get_moderator_landholding?.farming_community_infrastructure || '') || '',
        unutilized_area: get_moderator_landholding?.unutilized_area || '',
        fallow: String(get_moderator_landholding?.fallow || '') || '',
        under_forest: String(get_moderator_landholding?.under_forest || '') || '',
        under_grassland: String(get_moderator_landholding?.under_grassland || '') || '',
        others: String(get_moderator_landholding?.others || '') || '',
        land_owned_by_non_resident: String(get_moderator_landholding?.land_owned_by_non_resident || '') || '',
        total_area_privately_owned:String(get_moderator_landholding?.total_area_privately_owned || '') || '',
      }
    })
  }, [get_moderator_landholding])
  console.log("get_moderator_landholding", get_moderator_landholding)
  if (isTypeLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignSelf: 'center' }}>
        <ActivityIndicator size={'large'} color={primaryColor} />
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={t(`landholding`)}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <Input
          unit={'70%'}
          label={t(
            `Total area allocated to the village`
          )}
          value={values?.total_area_allocated_village}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('total_area_allocated_village')}
          isRight={
            <CustomDropdown
              data={
                [{ label: 'ha', value: '6736117ecb51156c2f52383e' }, { label: 'km', value: '6736117ecb51156c2f52683e' }]
              }
              value={values?.area_unit}
              label={t('Unit')}
              noLabel={true}
              sideDrop={true}
              onChange={value => {
                setValues({
                  ...values,
                  area_unit: value?.value,
                });
              }}
              style={{ height: 30, borderColor: '#fff', width: 80, marginTop: -1 }}
              placeholder={t('Unit')}
            />
          }
        />
        {errors.total_area_allocated_village &&
          touched.total_area_allocated_village && (
            <Text style={Styles.error2}>
              {
                errors.total_area_allocated_village
              }
            </Text>
          )}
        <Input
          label={t(
            `Total area allocated for community infrastructure including mobility`
          )}
          value={values?.farming_community_infrastructure}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('farming_community_infrastructure')}
        />
        {errors.farming_community_infrastructure &&
          touched.farming_community_infrastructure && (
            <Text style={Styles.error2}>
              {
                errors.farming_community_infrastructure
              }
            </Text>
          )}
        <Input
          label={t(
            `Unutilized area`
          )}
          value={values?.unutilized_area}
          placeholder={'0'}
          fullLength={true}
          editable={false}
          keyboardType="numeric"
          onChangeText={handleChange('unutilized_area')}
        />
        {errors.unutilized_area &&
          touched.unutilized_area && (
            <Text style={Styles.error2}>
              {
                errors.unutilized_area
              }
            </Text>
          )}
          {values?.unutilized_area>0?
        <View style={styles.innerInputView}>
          <Divider style={styles.divider2} />
          <View style={{ width: '100%' }}>
            <Input
              label={t(
                `Fallow`
              )}
              value={values?.fallow}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('fallow')}
            />
            {errors.fallow &&
              touched.fallow && (
                <Text style={Styles.error2}>
                  {
                    errors.fallow
                  }
                </Text>
              )}
            <Input
              label={t(
                `Under forest`
              )}
              value={values?.under_forest}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('under_forest')}
            />
            {errors.under_forest &&
              touched.under_forest && (
                <Text style={Styles.error2}>
                  {
                    errors.under_forest
                  }
                </Text>
              )}
            <Input
              label={t(
                `Under grassland`
              )}
              value={values?.under_grassland}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('under_grassland')}
            />
            {errors.under_grassland &&
              touched.under_grassland && (
                <Text style={Styles.error2}>
                  {
                    errors.under_grassland
                  }
                </Text>
              )}
            <Input
              label={t(
                `Others (if any)`
              )}
              value={values?.others}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('others')}
            />
            {errors.others &&
              touched.others && (
                <Text style={Styles.error2}>
                  {
                    errors.others
                  }
                </Text>
              )}
          </View>
        </View>
          :null
        }
        <Input
          label={t(
            `Land owned by non resident`
          )}
          value={values?.land_owned_by_non_resident}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('land_owned_by_non_resident')}
        />
        {errors.land_owned_by_non_resident &&
          touched.land_owned_by_non_resident && (
            <Text style={Styles.error2}>
              {
                errors.land_owned_by_non_resident
              }
            </Text>
          )}
        <Input
          label={t(
            `Total area privately owned`
          )}
          value={values?.total_area_privately_owned}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('total_area_privately_owned')}
        />
        {errors.total_area_privately_owned &&
          touched.total_area_privately_owned && (
            <Text style={Styles.error2}>
              {
                errors.total_area_privately_owned
              }
            </Text>
          )}
      </KeyboardAwareScrollView>
      <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <CustomButton btnText={t('submit')} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
        {/* <CustomButton btnText={t('save as draft')} style={{ width: '48%', height: 60, backgroundColor: borderColor }} onPress={() => { setDraftpopup(true) }} btnStyle={{ color: 'black' }} /> */}
      </View>
      {/* submit popup */}
      <PopupModal
        modalVisible={savePopup}
        setBottomModalVisible={setSavepopup}
        styleInner={[Styles.savePopup, { width: '90%' }]}>
        <View style={Styles.submitPopup}>
          <View style={Styles.noteImage}>
            <Image
              source={require('../../../../assets/note.png')}
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
              onPress={() => { onSubmit() }}
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
              source={require('../../../../assets/note.png')}
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

export default OfficerLandholding

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
})