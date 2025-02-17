import {
  Image,
  StyleSheet,
  Text,
  ToastAndroid,
  useWindowDimensions,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {useTranslation} from 'react-i18next';
import {ActivityIndicator, Divider} from 'react-native-paper';
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
  addWaterHarvesting,
  editWaterHarvesting,
  getWaterDropdown,
  getWaterHarvesting,
} from '../../functions/water';
import {USER_PREFERRED_LANGUAGE} from '../../i18next';

const WaterHarvesting = ({navigation, route}) => {
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
    queryKey: ['get_harvesting'],
    enabled: water_id ? true : false,
    queryFn: () => getWaterHarvesting(water_id),
    refetchOnWindowFocus: true,
  });
  const {mutate: edit_usage, isPending: isEditing} = useMutation({
    mutationFn: editWaterHarvesting,
    onSuccess: data => {
      queryClient.invalidateQueries();
      console.log('successsssss save', data), navigation.replace('water');
      setDraftpopup(false), setSavepopup(false);
    },
    onError: error => console.log('error save', error),
  });
  const {mutate: add_usage, isPending: isAdding} = useMutation({
    mutationFn: addWaterHarvesting,
    onSuccess: data => {
      queryClient.invalidateQueries();
      console.log('successsssss save', data), navigation.replace('water');
      setDraftpopup(false), setSavepopup(false);
    },
    onError: error => console.log('error save', error),
  });
  const [selectedStatus, setSelectedStatus] = useState([]);
  const scheme = yup.object().shape({
    type_of_harvesting: yup.array().of(
      yup.object().shape({
        type: yup.string().required(t('Type is required')),
        capacity: yup.string().required(t('Capacity is required')),
      }),
    ),
    other_harvesting: yup.string(),
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
    setFieldValue,
  } = useFormik({
    initialValues: {
      type_of_harvesting: [],
      other_harvesting: '',
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      if (selectedStatus.length > 0) {
        setSavepopup(true);
      } else {
        ToastAndroid.show('Please select one value', ToastAndroid.BOTTOM);
      }
    },
  });
  useEffect(() => {
    resetForm({
      values: {
        type_of_harvesting:
          get_usage?.type_of_harvesting.map(item => {
            return {
              type: item.type,
              capacity: String(item.capacity),
            };
          }) || [],
        other_harvesting: get_usage?.other_harvesting || '',
      },
    });
    setSelectedStatus(
      get_usage?.type_of_harvesting.map(item => item.type) || [],
    );
  }, [get_usage]);
  const handleFieldChange = (index, field, value) => {
    const newDetailsOfLand = [...values.type_of_harvesting];
    newDetailsOfLand[index][field] = value;
    setValues({...values, type_of_harvesting: newDetailsOfLand});
  };

  const handleStatusChange = selectedItems => {
    setSelectedStatus(selectedItems);

    // Update `purpose_status_of_land` based on the selected items
    const updatedPurposeStatusOfLand = selectedItems.map(item => {
      // Check if this `type` already exists in `purpose_status_of_land`
      const existingEntry = values.type_of_harvesting.find(
        entry => entry.type === item,
      );

      return (
        existingEntry || {
          type: item,
          capacity: '',
        }
      );
    });
    // Update the form's purpose_status_of_land field
    setFieldValue('type_of_harvesting', updatedPurposeStatusOfLand);
  };
  const handleDraft = () => {
    let newData = {
      type_of_harvesting: values?.type_of_harvesting,
      other_harvesting: values?.other_harvesting,
      type: type,
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
      type_of_harvesting: values?.type_of_harvesting,
      other_harvesting: values?.other_harvesting,
      type: type,
      status: 1,
    };
    if (water_id) {
      edit_usage({...newData, water_id});
    } else {
      add_usage({...newData});
    }
  };
  console.log(
    'heelelleeoeoe',
    water_dropdown?.type_of_harvesting.find(item =>
      selectedStatus.includes(item?._id),
    ),
  );
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
        <MultiselectDropdown
          containerStyle={{marginTop: '5%', paddingTop: 0}}
          data={water_dropdown?.type_of_harvesting.map(item => {
            return {
              name: item?.name?.[USER_PREFERRED_LANGUAGE],
              key: item?._id,
            };
          })}
          setSelectedd={handleStatusChange}
          selectedd={selectedStatus}
          infoName={t('Type of Harvesting')}
        />
        {water_dropdown?.type_of_harvesting.find(
          item =>
            selectedStatus.includes(item?._id) &&
            item?.name?.en === 'others [specify]',
        ) && (
          <Input
            label={t('Others(If any)')}
            value={values.other_harvesting}
            placeholder={''}
            fullLength={true}
            keyboardType="default"
            onChangeText={handleChange('other_harvesting')}
          />
        )}
        {values?.type_of_harvesting?.length > 0 && (
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{width: '100%'}}>
              {values?.type_of_harvesting.map((item, index) => (
                <>
                  <Input
                    label={t(
                      `${t('Enter capacity for')} ${
                        water_dropdown?.type_of_harvesting.find(
                          i => item?.type == i?._id,
                        )
                          ? water_dropdown?.type_of_harvesting.find(
                              i => item?.type == i?._id,
                            )?.name[USER_PREFERRED_LANGUAGE]
                          : item?.type
                      } `,
                    )}
                    value={item.capacity}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={text =>
                      handleFieldChange(index, 'capacity', parseInt(text))
                    }
                    isRight={<AcresElement title={'Litres'} />}
                  />
                  {errors.type_of_harvesting &&
                    errors.type_of_harvesting[index]?.capacity && (
                      <Text style={Styles.error2}>
                        {errors.type_of_harvesting[index].capacity}
                      </Text>
                    )}
                </>
              ))}
            </View>
          </View>
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

export default WaterHarvesting;

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
