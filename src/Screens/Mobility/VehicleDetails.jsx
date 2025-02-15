import {Image, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useTranslation} from 'react-i18next';
import * as yup from 'yup';
import {useFormik} from 'formik';
import {useUser} from '../../Hooks/useUser';
import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query';
import SwitchButton from '../../Components/SwitchButtons/SwitchButton';
import {Styles} from '../../styles/globalStyles';
import AcresElement from '../../Components/ui/AcresElement';
import Input from '../../Components/Inputs/Input';
import {ActivityIndicator, Divider} from 'react-native-paper';
import CustomDropdown from '../../Components/CustomDropdown/CustomDropdown';
import CustomButton from '../../Components/CustomButton/CustomButton';
import {borderColor, primaryColor} from '../../styles/colors';
import PopupModal from '../../Components/Popups/PopupModal';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import {USER_PREFERRED_LANGUAGE} from '../../i18next';
import {
  addMobility,
  editMobility,
  getMobility,
  getMobilityById,
  getMobilityDropdown,
} from '../../functions/mobility';

const VehicleDetails = ({navigation, route}) => {
  const {name, mobility_id} = route.params;
  const {t} = useTranslation();
  const [savePopup, setSavepopup] = useState(false);
  const [draftPopup, setDraftpopup] = useState(false);
  const queryClient = useQueryClient();
  const {data: mobility, isLoading: isTypeLoading} = useQuery({
    queryKey: [`mobility`],
    queryFn: () => getMobilityDropdown(),
    refetchOnWindowFocus: true,
  });
  const {data: get_mobility, isLoading: isLoading} = useQuery({
    queryKey: [`get_mobility_${mobility_id}`],
    enabled: Boolean(mobility_id),
    queryFn: () => getMobilityById(mobility_id),
    refetchOnWindowFocus: true,
  });
  const {mutate: add_mobility} = useMutation({
    mutationKey: ['add_mobility'],
    mutationFn: async data => {
      addMobility(data);
      queryClient.invalidateQueries();
    },
    onSuccess: data => {
      console.log('successsssss save', data),
        navigation.replace('vehicleCount');
    },
    onError: error => console.log('error save', error),
  });
  const {mutate: edit_mobility} = useMutation({
    mutationKey: ['edit_mobility'],
    mutationFn: async data => {
      editMobility(data);
      queryClient.invalidateQueries();
    },
    onSuccess: data => {
      console.log('successsssss save', data),
        navigation.replace('vehicleCount');
    },
    onError: error => console.log('error save', error),
  });
  const scheme = yup.object().shape({
    type: yup.string().required(t('Type is required')),
    distance_travelled_within_village: yup
      .number()
      .required(t('Distance travelled inside village is required')),
    distance_travelled_outside: yup
      .number()
      .required(t('Distance travelled outside is required')),
    purpose_use_of_vehicle: yup
      .array()
      .required(t('required'))
      .min(1, t('Atleast one purpose is required')),
    frequency_of_usage: yup
      .string()
      .required(t('Frequency of usage is required')),
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
    setValues,
  } = useFormik({
    initialValues: {
      type: '',
      distance_travelled_within_village: '',
      distance_travelled_outside: '',
      purpose_use_of_vehicle: [],
      frequency_of_usage: '',
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      setSavepopup(true);
    },
  });
  const handleDraft = () => {
    let new_data = {
      type: values?.type,
      distance_travelled_within_village:
        values?.distance_travelled_within_village,
      distance_travelled_outside: parseInt(values?.distance_travelled_outside),
      purpose_use_of_vehicle: values?.purpose_use_of_vehicle,
      frequency_of_usage: values?.frequency_of_usage,
      status: 0,
    };
    if (mobility_id) {
      edit_mobility({...new_data, mobility_id});
    } else {
      add_mobility(new_data);
    }
  };

  const onSubmit = () => {
    let new_data = {
      type: values?.type,
      distance_travelled_within_village:
        values?.distance_travelled_within_village,
      distance_travelled_outside: parseInt(values?.distance_travelled_outside),
      purpose_use_of_vehicle: values?.purpose_use_of_vehicle,
      frequency_of_usage: values?.frequency_of_usage,
      status: 1,
    };
    if (mobility_id) {
      edit_mobility({...new_data, mobility_id});
    } else {
      add_mobility(new_data);
    }
  };
  useEffect(() => {
    resetForm({
      values: {
        type: get_mobility?.type,
        distance_travelled_within_village:
          String(get_mobility?.distance_travelled_within_village || '') || '',
        distance_travelled_outside:
          String(get_mobility?.distance_travelled_outside || '') || '',
        purpose_use_of_vehicle: get_mobility?.purpose_use_of_vehicle,
        frequency_of_usage: get_mobility?.frequency_of_usage,
      },
    });
  }, [get_mobility]);
  if (isTypeLoading || isLoading) {
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
          data={mobility?.type_of_vehicles.map(item => {
            return {
              label: item?.name?.[USER_PREFERRED_LANGUAGE],
              value: item?._id,
            };
          })}
          value={values?.type}
          label={t('Type')}
          onChange={value => {
            setValues({
              ...values,
              type: value?.value,
            });
          }}
        />
        {touched?.type && errors?.type && (
          <Text style={Styles.error2}>{String(errors?.type)}</Text>
        )}
        <Input
          label={t(`Total distance travelled within a village in a year`)}
          value={values?.distance_travelled_within_village}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('distance_travelled_within_village')}
          isRight={<AcresElement title={'Kms'} />}
        />
        {errors.distance_travelled_within_village &&
          errors.distance_travelled_within_village && (
            <Text style={Styles.error2}>
              {errors.distance_travelled_within_village}
            </Text>
          )}
        <Input
          label={t(`Total distance travelled outside`)}
          value={values?.distance_travelled_outside}
          placeholder={'0'}
          fullLength={true}
          keyboardType="numeric"
          onChangeText={handleChange('distance_travelled_outside')}
          isRight={<AcresElement title={'Kms'} />}
        />
        {errors.distance_travelled_outside &&
          errors.distance_travelled_outside && (
            <Text style={Styles.error2}>
              {errors.distance_travelled_outside}
            </Text>
          )}
        <MultiselectDropdown
          containerStyle={{marginTop: '5%', paddingTop: 0}}
          data={mobility.methods_of_mobility.map(item => {
            return {key: item._id, name: item.name[USER_PREFERRED_LANGUAGE]};
          })}
          setSelectedd={value =>
            setValues({...values, purpose_use_of_vehicle: value})
          }
          selectedd={values?.purpose_use_of_vehicle}
          infoName={t('Select the purposes you use this vehicle for')}
        />
        <CustomDropdown
          data={[
            {label: 'Daily', value: 'Daily'},
            {label: 'Several Times a Week', value: 'Several Times a Week'},
            {label: 'Weekly', value: 'Weekly'},
            {label: 'Monthly', value: 'Monthly'},
            {label: 'Occasionally / Rarely', value: 'Occasionally / Rarely'},
            {label: 'Never', value: 'Never'},
          ]}
          value={values?.frequency_of_usage}
          label={t('Frequency of usage')}
          onChange={value => {
            setValues({
              ...values,
              frequency_of_usage: value?.value,
            });
          }}
        />
        {touched?.frequency_of_usage && errors?.frequency_of_usage && (
          <Text style={Styles.error2}>
            {String(errors?.frequency_of_usage)}
          </Text>
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
  );
};

export default VehicleDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
});
