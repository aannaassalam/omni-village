import {Image, StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator} from 'react-native-paper';
import {borderColor, primaryColor} from '../../styles/colors';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import {useUser} from '../../Hooks/useUser';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Styles} from '../../styles/globalStyles';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import Input from '../../Components/Inputs/Input';
import AcresElement from '../../Components/ui/AcresElement';
import CustomButton from '../../Components/CustomButton/CustomButton';
import PopupModal from '../../Components/Popups/PopupModal';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import {
  addWaterUsage,
  editWaterUsage,
  getWaterDropdown,
  getWaterUsage,
} from '../../functions/water';
import {USER_PREFERRED_LANGUAGE} from '../../i18next';

const Cleaning = ({navigation, route}) => {
  const {name, water_id, type} = route.params;
  const [savePopup, setSavepopup] = useState(false);
  const [draftPopup, setDraftpopup] = useState(false);
  const {t} = useTranslation();
  const {data: user} = useUser();
  const queryClient = useQueryClient();
  const {data: water_dropdown, isLoading} = useQuery({
    queryKey: ['water_dropdown'],
    queryFn: () => getWaterDropdown(),
    refetchOnWindowFocus: true,
  });
  const {data: get_usage, isLoading: isUsageLoading} = useQuery({
    queryKey: [`get_usage ${water_id}`],
    enabled: water_id ? true : false,
    queryFn: () => getWaterUsage(water_id),
    refetchOnWindowFocus: true,
  });
  const {mutate: edit_usage, isPending: isEditing} = useMutation({
    mutationFn: editWaterUsage,
    onSuccess: data => {
      queryClient.invalidateQueries();
      console.log('successsssss save', data), navigation.replace('water');
      setDraftpopup(false), setSavepopup(false);
    },
    onError: error => console.log('error save', error),
  });
  const {mutate: add_usage, isPending: isAdding} = useMutation({
    mutationFn: addWaterUsage,
    onSuccess: data => {
      queryClient.invalidateQueries();
      console.log('successsssss save', data), navigation.replace('water');
      setDraftpopup(false), setSavepopup(false);
    },
    onError: error => console.log('error save', error),
  });
  const scheme = yup.object().shape({
    yearly_consumption: yup
      .string()
      .required(t('Yearly consumption is required')),
    water_sourced_from: yup
      .array()
      .required(t('Water sourced from is required'))
      .min(1, t('Atleast one water source is required')),
    water_quality: yup.string().required(t('Water quality is required')),
    expenses: yup.number().required(t('Expenses is required')),
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
      yearly_consumption: '',
      water_sourced_from: [],
      water_quality: '',
      expenses: '',
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
        yearly_consumption: get_usage?.yearly_consumption || '',
        water_sourced_from: get_usage?.water_sourced_from || [],
        water_quality: get_usage?.water_quality || '',
        expenses: String(get_usage?.expense || '') || '',
      },
    });
  }, [get_usage]);
  const handleDraft = () => {
    let newData = {
      type: type,
      yearly_consumption: values.yearly_consumption,
      water_sourced_from: values.water_sourced_from,
      water_quality: values.water_quality,
      expense: parseInt(values.expenses),
      status: 0,
    };
    if (water_id) {
      edit_usage({...newData, water_id});
    } else {
      add_usage({...newData});
    }
  };
  const onSubmit = () => {
    let newData = {
      type: type,
      yearly_consumption: values.yearly_consumption,
      water_sourced_from: values.water_sourced_from,
      water_quality: values.water_quality,
      expense: parseInt(values.expenses),
      status: 1,
    };
    if (water_id) {
      edit_usage({...newData, water_id});
    } else {
      add_usage({...newData});
    }
  };
  if (isLoading || isUsageLoading) {
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
        headerName={t(`${name}`)}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{flex: 1}}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{paddingBottom: 140, paddingHorizontal: 22}}>
        <CustomDropdown
          data={water_dropdown?.yearly_consumption.map(item => {
            return {
              label: item?.name?.[USER_PREFERRED_LANGUAGE],
              value: item?._id,
            };
          })}
          value={values?.yearly_consumption}
          label={t('Daily water consumption')}
          onChange={value => {
            setValues({
              ...values,
              yearly_consumption: value?.value,
            });
          }}
        />
        {touched?.yearly_consumption && errors?.yearly_consumption && (
          <Text style={Styles.error2}>
            {String(errors?.yearly_consumption)}
          </Text>
        )}
        <MultiselectDropdown
          containerStyle={{marginTop: '5%', paddingTop: 0}}
          data={water_dropdown?.sourced_from.map(item => {
            return {
              name: item?.name?.[USER_PREFERRED_LANGUAGE],
              key: item?._id,
            };
          })}
          setSelectedd={value => {
            setValues({...values, water_sourced_from: value});
          }}
          selectedd={values?.water_sourced_from}
          infoName={t('Where is water sourced from ?')}
        />
        {touched?.water_sourced_from && errors?.water_sourced_from && (
          <Text style={Styles.error2}>
            {String(errors?.water_sourced_from)}
          </Text>
        )}
        <CustomDropdown
          data={water_dropdown?.water_quality.map(item => {
            return {
              label: item?.name?.[USER_PREFERRED_LANGUAGE],
              value: item?._id,
            };
          })}
          value={values?.water_quality}
          label={t('Water quality')}
          onChange={value => {
            setValues({
              ...values,
              water_quality: value?.value,
            });
          }}
        />
        {touched?.water_quality && errors?.water_quality && (
          <Text style={Styles.error2}>{String(errors?.water_quality)}</Text>
        )}
        <Input
          label={t(`Expenses if any`)}
          value={values?.expenses}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('expenses')}
          isRight={<AcresElement title={user?.currency} />}
        />
        {errors.expenses && errors.expenses && (
          <Text style={Styles.error2}>{errors.expenses}</Text>
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

export default Cleaning;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
