import { Image, StyleSheet, Text, ToastAndroid, View } from 'react-native'
import React, { useState } from 'react'
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
import Input from '../../../Components/Inputs/Input';
import MultiselectDropdown from '../../../Components/MultiselectDropdown/MultiselectDropdown';
import AcresElement from '../../../Components/ui/AcresElement';

const OfficerEnergy = ({ navigation }) => {
  const { t } = useTranslation()
  const [savePopup, setSavepopup] = useState(false)
  const [draftPopup, setDraftpopup] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState([]);
  const scheme = yup.object().shape({
    available_renewable_energy: yup
      .array()
      .of(
        yup.object().shape({
          type: yup.string().required(t('Type is required')),
          percentage: yup
            .string()
            .required(t('Percentage is required')),
        }),
      )
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
      available_renewable_energy: [],
    },
    validationSchema: scheme,
    onSubmit: async (values) => {
      if (selectedStatus.length > 0) {
        setSavepopup(true);
      } else {
        ToastAndroid.show("Please select one value", ToastAndroid.BOTTOM)
      }
    },

  });
  const onSubmit = () => { }
  const handleDraft = () => { }
  const handleFieldChange = (index, field, value) => {
    const newDetailsOfLand = [...values.available_renewable_energy];
    newDetailsOfLand[index][field] = value;
    setValues({ ...values, available_renewable_energy: newDetailsOfLand });
  };
  const handleStatusChange = (selectedItems) => {
    setSelectedStatus(selectedItems);

    // Update `purpose_status_of_land` based on the selected items
    const updatedPurposeStatusOfLand = selectedItems.map((item) => {
      // Check if this `type` already exists in `purpose_status_of_land`
      const existingEntry = values.available_renewable_energy.find(
        entry => entry.type === item
      );

      return existingEntry || {
        type: item,
        percentage: ''
      };
    });
    // Update the form's purpose_status_of_land field
    setFieldValue('available_renewable_energy', updatedPurposeStatusOfLand);
  };
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
        headerName={t(`energy`)}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <MultiselectDropdown
          containerStyle={{ marginTop: '5%', paddingTop: 0 }}
          data={[
            {key:'Something', name:"Something"},
            {key:'Something2', name:"Something2"},
          ]}
          setSelectedd={handleStatusChange}
          selectedd={selectedStatus}
          infoName={t('Available renewable energy sources')}
        />
        {values?.available_renewable_energy?.length > 0 && (
          <View style={styles.innerInputView}>
            <Divider style={styles.divider2} />
            <View style={{ width: '100%' }}>
              {values?.available_renewable_energy.map((item, index) => (
                <>
                  <Input
                    label={t(
                      `${t(
                        'Enter Percentage for',
                      )} `
                      // ${water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id) ? water_dropdown?.type_of_harvesting.find((i) => item?.type == i?._id)?.name[USER_PREFERRED_LANGUAGE] : item?.type} `,
                    )}
                    value={item.percentage}
                    placeholder={'0'}
                    fullLength={true}
                    keyboardType="numeric"
                    onChangeText={text =>
                      handleFieldChange(
                        index,
                        'percentage',
                        parseInt(text),
                      )
                    }
                    isRight={
                      <AcresElement title={'%'} />
                    }
                  />
                  {errors.available_renewable_energy &&
                    errors.available_renewable_energy[index]
                      ?.percentage && (
                      <Text style={Styles.error2}>
                        {
                        errors.available_renewable_energy[index]
                            .percentage
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

export default OfficerEnergy

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