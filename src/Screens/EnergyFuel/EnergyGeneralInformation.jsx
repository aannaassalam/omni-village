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
import {
  addGeneralInformation,
  editGeneralInformation,
  getEnergyByType,
  getEnergyDropdown,
} from '../../functions/energyFuel';
import {USER_PREFERRED_LANGUAGE} from '../../i18next';

const EnergyGeneralInformation = ({navigation, route}) => {
  const {name, type} = route.params;
  const {t} = useTranslation();
  const [savePopup, setSavepopup] = useState(false);
  const [draftPopup, setDraftpopup] = useState(false);
  const {data: user} = useUser();
  const queryClient = useQueryClient();
  const {data: energy, isLoading: isDropdownLoading} = useQuery({
    queryKey: [`energy`],
    queryFn: () => getEnergyDropdown(),
    refetchOnWindowFocus: true,
  });
  const {data: get_type, isLoading: isTypeLoading} = useQuery({
    queryKey: [`get_type ${type}`],
    queryFn: () => getEnergyByType(type),
    refetchOnWindowFocus: true,
  });
  const {mutate: edit_general_information, isPending: isEditing} = useMutation({
    mutationFn: editGeneralInformation,
    onSuccess: data => {
      queryClient.invalidateQueries();
      console.log('successsssss save', data), navigation.replace('energyFuel');
      setDraftpopup(false), setSavepopup(false);
    },
    onError: error => console.log('error save', error),
  });
  const {mutate: add_general_information, isPending: isAdding} = useMutation({
    mutationFn: addGeneralInformation,
    onSuccess: data => {
      queryClient.invalidateQueries();
      console.log('successsssss save', data), navigation.replace('energyFuel');
      setDraftpopup(false), setSavepopup(false);
    },
    onError: error => console.log('error save', error),
  });
  const scheme = yup.object().shape({
    energy_sufficient: yup.boolean(),
    extent: yup.string().nullable(),
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
      energy_sufficient: false,
      extent: '',
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      setSavepopup(true);
    },
  });
  const handleDraft = () => {
    let new_data = {
      energy_sufficient: values?.energy_sufficient,
      extent: values?.extent,
      status: 0,
    };
    if (get_type?._id) {
      edit_general_information({...new_data, energy_id: get_type?._id});
    } else {
      add_general_information({...new_data});
    }
  };

  const onSubmit = () => {
    let new_data = {
      energy_sufficient: values?.energy_sufficient,
      extent: values?.extent,
      status: 1,
    };
    if (get_type?._id) {
      edit_general_information({...new_data, energy_id: get_type?._id});
    } else {
      add_general_information({...new_data});
    }
  };
  useEffect(() => {
    resetForm({
      values: {
        energy_sufficient: get_type?.energy_sufficient || false,
        extent: get_type?.extent || '',
      },
    });
  }, [get_type]);
  if (isTypeLoading || isDropdownLoading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignSelf: 'center'}}>
        <ActivityIndicator size={'large'} color={primaryColor} />
      </View>
    );
  }
  console.log('ene', energy);
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
        <SwitchButton
          nolabel={false}
          label={t('Is the available energy sufficient?')}
          selected={values?.energy_sufficient}
          firstBtnPress={() => setValues({...values, energy_sufficient: true})}
          secondBtnPress={() =>
            setValues({...values, energy_sufficient: false, extent: null})
          }
          firstBtnText={t('yes')}
          secondBtntext={t('no')}
        />
        {!values?.energy_sufficient ? (
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{width: '100%'}}>
              <CustomDropdown
                data={
                  energy?.sufficient
                    ? energy?.sufficient.map(item => {
                        return {
                          label: item?.name?.[USER_PREFERRED_LANGUAGE],
                          value: item?._id,
                        };
                      })
                    : [
                        {label: '0 percent', value: '67af131b01f33d7cb6707167'},
                        {label: '1 percent', value: '67af131b01f33d7cb6707267'},
                      ]
                }
                value={values?.extent}
                label={t('To what extent it’s not sufficient?')}
                onChange={value => {
                  setValues({
                    ...values,
                    extent: value?.value,
                  });
                }}
              />
              {touched?.extent && errors?.extent && (
                <Text style={Styles.error2}>{String(errors?.extent)}</Text>
              )}
            </View>
          </View>
        ) : null}
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

export default EnergyGeneralInformation;

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
