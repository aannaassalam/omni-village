import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import CustomHeader from '../../Components/CustomHeader/CustomHeader'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup';
import { useFormik } from 'formik';
import { useUser } from '../../Hooks/useUser'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import SwitchButton from '../../Components/SwitchButtons/SwitchButton'
import { Styles, width } from '../../styles/globalStyles'
import AcresElement from '../../Components/ui/AcresElement'
import Input from '../../Components/Inputs/Input'
import { ActivityIndicator, Divider } from 'react-native-paper'
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown'
import CustomButton from '../../Components/CustomButton/CustomButton'
import { borderColor, primaryColor } from '../../styles/colors'
import PopupModal from '../../Components/Popups/PopupModal'
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown'
import { USER_PREFERRED_LANGUAGE } from '../../i18next'
import { addForestryGeneralInformation, editForestryGeneralInformation, getForestry, getForestryDropdown } from '../../functions/forestry'

const ForestryGeneralInformation = ({ navigation, route }) => {
  const { name, type, forestry_id } = route.params
  const { t } = useTranslation()
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState([]);
  const { data: user } = useUser()
  const queryClient = useQueryClient()
  const { data: forestry, isLoading } = useQuery({
    queryKey: ['forestry_dropdown'],
    queryFn: () => getForestryDropdown(),
    refetchOnWindowFocus: true,
  })
  const { data: get_forestry, isLoading: isTypeLoading } = useQuery({
    queryKey: [`get_forestry ${type}`],
      queryFn: () => getForestry(type),
      refetchOnWindowFocus: true,
  })
  const { mutate: edit_forestry_general } = useMutation({
    mutationKey: ['edit_forestry_general'],
      mutationFn: async (data) => {
          editForestryGeneralInformation(data)
          queryClient.invalidateQueries()
      },
      onSuccess: (data) => { console.log("successsssss save", data, navigation.replace('forestryTimber')) },
      onError: (error) => console.log("error save", error),
      onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const { mutate: add_forestry_general } = useMutation({
    mutationKey: ['add_forestry_general'],
      mutationFn: async (data) => {
          addForestryGeneralInformation(data)
          queryClient.invalidateQueries()
      },
    onSuccess: (data) => { console.log("successsssss save", data), navigation.replace('forestryTimber') },
      onError: (error) => console.log("error save", error),
      onSettled: () => { setDraftpopup(false), setSavepopup(false) }
  })
  const scheme = yup.object().shape({
    land_owned_under_forest_cover: yup.string().required(t('Land owned under forest cover is required')),
    timber_logs_harvested: yup.number().required(t('Number logs is required')).test(
      'logs-match-sum',
      t('Timber logs harvested must equal the sum of own forest cover land and community forest'),
      function (value) {
        const { own_forest_cover_land, community_forest } = this.parent;
        const expectedValue = (own_forest_cover_land || 0) + (community_forest || 0);
        return value === expectedValue;
      }
    ),
    own_forest_cover_land: yup.number().required(t('Own forest cover land is required')),
    community_forest: yup.number().required(t('Community forest is required')),
    other_produced_harvested_from_forest: yup.array().of(
      yup.object().shape({
        type: yup.string().required(t('Type is required')),
        quantity: yup.number().required(t('Quantity is required')),
        purpose: yup.array().required(t('Purpose is required')).min(1, t('Atleast one purpose is required')),
      })
    ).min(1, t('Atleast one other produce harvested required'))
  })
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
      land_owned_under_forest_cover: '',
      timber_logs_harvested: '',
      own_forest_cover_land: '',
      community_forest: '',
      other_produced_harvested_from_forest: []
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      console.log(values);
      setSavepopup(true)
    },
  });
  const handleDraft = () => {
    let newData ={
  land_owned_under_forest_cover: values.land_owned_under_forest_cover,
  timber_logs_harvested: values.timber_logs_harvested,
  own_forest_cover_land: values.own_forest_cover_land,
  community_forest: values.community_forest,
  other_produced_harvested_from_forest: values.other_produced_harvested_from_forest,
  status:0
}
    if (get_forestry?._id) {
      edit_forestry_general({ ...newData, forestry_id: get_forestry?._id })
    } else {
      add_forestry_general({ ...newData })
    }
  }
  const onSubmit = () => {
    let newData = {
      land_owned_under_forest_cover: values.land_owned_under_forest_cover,
      timber_logs_harvested: values.timber_logs_harvested,
      own_forest_cover_land: values.own_forest_cover_land,
      community_forest: values.community_forest,
      other_produced_harvested_from_forest: values.other_produced_harvested_from_forest,
      status: 1
    }
    if (get_forestry?._id) {
      edit_forestry_general({ ...newData, forestry_id: get_forestry?._id })
    } else {
      add_forestry_general({ ...newData })
    }
}
  const handleFieldChange = (index, field, value) => {
    const newDetailsOfLand = [...values.other_produced_harvested_from_forest];
    newDetailsOfLand[index][field] = value;
    setValues({ ...values, other_produced_harvested_from_forest: newDetailsOfLand });
  };

  const handleStatusChange = (selectedItems) => {
    setSelectedStatus(selectedItems);

    // Update `purpose_status_of_land` based on the selected items
    const updatedPurposeStatusOfLand = selectedItems.map((item) => {
      // Check if this `type` already exists in `purpose_status_of_land`
      const existingEntry = values.other_produced_harvested_from_forest.find(
        entry => entry.type === item
      );

      return existingEntry || {
        type: item,
        quantity: '',
        purpose: []
      };
    });
    // Update the form's purpose_status_of_land field
    setFieldValue('other_produced_harvested_from_forest', updatedPurposeStatusOfLand);
  };

  useEffect(()=>{
resetForm({
  values:{
    land_owned_under_forest_cover: String(get_forestry?.land_owned_under_forest_cover)||'',
    timber_logs_harvested: String(get_forestry?.timber_logs_harvested)|| '',
    own_forest_cover_land: String(get_forestry?.own_forest_cover_land)|| '',
    community_forest: String(get_forestry?.community_forest)|| '',
    other_produced_harvested_from_forest: get_forestry?.other_produced_harvested_from_forest.map((item)=>{
      return{
        type:item.type,
        quantity:String(item.quantity),
        purpose: item.purpose
      }
    })||[]
  }
})
    setSelectedStatus(get_forestry?.other_produced_harvested_from_forest.map((item)=>{return item?.type}))
  },[get_forestry])
  if (isTypeLoading || isLoading) {
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
        headerName={t(`${name}`)}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <Input
          label={t(
            `How much area of land owned by you is under forest cover?`
          )}
          value={values?.land_owned_under_forest_cover}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('land_owned_under_forest_cover')}
          isRight={
            <AcresElement title={user.land_measurement_symbol} />
          }
        />
        {errors.land_owned_under_forest_cover &&
          errors.land_owned_under_forest_cover && (
            <Text style={Styles.error2}>
              {
                errors.land_owned_under_forest_cover
              }
            </Text>
          )}
        <Input
          label={t(
            `Number of timber logs harvested from the forest in a year`
          )}
          value={values?.timber_logs_harvested}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('timber_logs_harvested')}
        />
        {errors.timber_logs_harvested &&
          errors.timber_logs_harvested && (
            <Text style={Styles.error2}>
              {
                errors.timber_logs_harvested
              }
            </Text>
          )}
        <View style={[styles.subArea, { marginTop: '3%' }]}>
          <Text
            style={[
              Styles.fieldLabel,
              { marginTop: 4, alignSelf: 'center' },
            ]}>
            {t(`Out of that`)}
          </Text>
          <Divider
            bold={true}
            style={[styles.divider, { width: '76%' }]}
            horizontalInset={true}
          />
        </View>
        <View style={styles.innerInputView}>
          <Divider style={styles.divider2} />
          <View style={{ width: '100%' }}>
            <Input
              label={t(
                `How much from your own forest cover land`
              )}
              value={values?.own_forest_cover_land}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('own_forest_cover_land')}
            />
            {errors.own_forest_cover_land &&
              errors.own_forest_cover_land && (
                <Text style={Styles.error2}>
                  {
                    errors.own_forest_cover_land
                  }
                </Text>
              )}
            <Input
              label={t(
                `How much from community forest`
              )}
              value={values?.community_forest}
              placeholder={'0'}
              fullLength={true}
              keyboardType="numeric"
              onChangeText={handleChange('community_forest')}
            />
            {errors.community_forest &&
              errors.community_forest && (
                <Text style={Styles.error2}>
                  {
                    errors.community_forest
                  }
                </Text>
              )}
          </View>
        </View>
        <MultiselectDropdown
          containerStyle={{ marginTop: '5%', paddingTop: 0 }}
          data={forestry?.other_produce_from_forest.map((item) => {
            return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
          })}
          setSelectedd={handleStatusChange}
          selectedd={selectedStatus}
          infoName={t('Type of other produce harvested from forest')}
        />
        {values?.other_produced_harvested_from_forest.length > 0 && (
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              {values.other_produced_harvested_from_forest.map((item, index) => (
                <>
                  <Input
                    label={t(
                      `Quantity`
                    )}
                    value={item?.quantity}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={(text) => handleFieldChange(
                      index,
                      'quantity',
                      parseInt(text),
                    )}
                    isRight={
                      <AcresElement title={'Unit'} />
                    }
                  />
                  {errors.other_produced_harvested_from_forest &&
                    errors.other_produced_harvested_from_forest[index]
                      ?.quantity && (
                      <Text style={Styles.error2}>
                        {
                          errors.other_produced_harvested_from_forest[index]
                            .quantity
                        }
                      </Text>
                    )}
                  <MultiselectDropdown
                    containerStyle={{ marginTop: '5%', paddingTop: 0 }}
                    data={forestry?.general_purpose.map((item) => {
                      return { name: item?.name?.[USER_PREFERRED_LANGUAGE], key: item?._id }
                    })}
                    setSelectedd={(value) => handleFieldChange(
                      index,
                      'purpose',
                      value,
                    )}
                    selectedd={item?.purpose}
                    infoName={t('Purpose')}
                  />
                  {errors.other_produced_harvested_from_forest &&
                    errors.other_produced_harvested_from_forest[index]
                      ?.purpose && (
                      <Text style={Styles.error2}>
                        {
                          errors.other_produced_harvested_from_forest[index]
                            .purpose
                        }
                      </Text>
                    )}
                </>
              ))}
            </View>
          </View>
        )}

      </KeyboardAwareScrollView>
      <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <CustomButton btnText={t('submit')} style={{ width: '48%', height: 60 }} onPress={handleSubmit} />
        <CustomButton btnText={t('save as draft')} style={{ width: '48%', height: 60, backgroundColor: borderColor }} onPress={() => { setDraftpopup(true) }} btnStyle={{ color: 'black' }} />
      </View>
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

export default ForestryGeneralInformation

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
})