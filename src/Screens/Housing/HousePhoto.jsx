import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup';
import { useFormik } from 'formik';
import DocumentPicker, { types } from 'react-native-document-picker';
import { fontScale, Styles, width } from '../../styles/globalStyles';
import { Divider } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import { borderColor, primaryColor } from '../../styles/colors';
import { fontFamilyMedium } from './../../styles/fontStyle';
import Entypo from 'react-native-vector-icons/Entypo'
import ImageView from "react-native-image-viewing";
import Input from '../../Components/Inputs/Input';
import MultiselectDropdown from '../../Components/MultiselectDropdown/MultiselectDropdown';
import CustomButton from '../../Components/CustomButton/CustomButton';

const HousePhoto = ({ navigation, route }) => {
  const { t } = useTranslation()
  const { housingData, house } = route.params
  const [uploadPhoto, setUploadPhoto] = useState(true)
  const [visible, setIsVisible] = useState(false);
  const [photo, setPhoto] = useState('')
  const scheme = yup.object().shape({
    front_photo: yup
      .object().shape({
        uri: yup.string(),
        type: yup.string(),
        name: yup.string(),
      })
      .required(t('Front photo of houses is required')),
    back_photo: yup
      .object().shape({
        uri: yup.string(),
        type: yup.string(),
        name: yup.string(),
      })
      .required(t('Back photo of house is required')),
    neighbourhood_photo: yup.object().shape({
      uri: yup.string(),
      type: yup.string(),
      name: yup.string(),
    })
      .required(t('Neighbourhood photo of house is required')),
    inside_living_photo: yup.object().shape({
      uri: yup.string(),
      type: yup.string(),
      name: yup.string(),
    }).required(t('Inside living photo of house is required')),
    kitchen_photo: yup.object().shape({
      uri: yup.string(),
      type: yup.string(),
      name: yup.string(),
    }).required(t('Kitchen photo of house is required')),
    amenities: yup.array().required(t('Amenities is required')),
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
      front_photo: {},
      back_photo: {},
      neighbourhood_photo: {},
      inside_living_photo: {},
      kitchen_photo: {},
      amenities:[],
    },
    validationSchema: scheme,
    onSubmit: async values => {
      console.log(values);
      navigation.navigate('householdRequirement', {
        housingData,
        house,
        housingPhoto: values
      })
    },
  });
  const handleDocumentSelection = useCallback(async (type) => {
    try {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [types.images],
        allowMultiSelection: false,
      });
      setValues(prev => ({
        ...prev,
        [type]: {
          name: response[0]?.name,
          type: response[0]?.type,
          uri: response[0]?.uri,
        },
      }));
    } catch (err) {
      console.warn(err);
    }
  }, []);
  return (
    <View style={styles.container}>
      <CustomHeader
        backIcon={true}
        headerName={`${t('housing')} (${house})`}
        goBack={() => navigation.goBack()}
      />
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 22 }}>
        <View style={styles.subArea}>
          <Text style={[Styles.fieldLabel, { marginTop: 4, alignSelf: 'center' }]}>{t('Upload Photos of House')}</Text>
          <Divider
            bold={true}
            style={[styles.divider, { width: '45%' }]}
            horizontalInset={true}
          />
          <TouchableOpacity onPress={() => setUploadPhoto(!uploadPhoto)}>
            {uploadPhoto ? (
              <Image
                source={require('../../../assets/arrowUp.png')}
                style={styles.uparrow}
              />
            ) : (
              <Image
                source={require('../../../assets/arrowDown.png')}
                style={styles.uparrow}
              />
            )}
          </TouchableOpacity>
        </View>
        {uploadPhoto ?
          <>
            <View style={styles.innerInputView}>
              <Divider style={styles.divider2} />
              <View style={{ width: '100%' }}>
                {/* Front */}
                <TouchableOpacity
                  style={[styles.add_button, {
                    justifyContent: values?.front_photo?.uri ? 'space-between' : 'flex-start'
                  }]}
                  onPress={() => {
                    if (values?.front_photo?.name) {
                      setIsVisible(true)
                      setPhoto([{uri:values?.front_photo?.uri}])
                    }
                    else {
                      handleDocumentSelection("front_photo")
                    }
                  }}>
                  {values?.front_photo?.uri ?
                    <>
                      <Text style={styles.add_button_text}>{values?.front_photo?.name}</Text>
                      <Entypo name="circle-with-cross" size={26} color={'red'} onPress={() => setValues({ ...values, front_photo: {} })} />
                    </>
                    :
                    <>
                      <Entypo name="upload-to-cloud" size={26} color={'black'} />
                      <Text style={styles.add_button_text}>{t('Add Front photo')}</Text>
                    </>
                  }
                </TouchableOpacity>
                {/* Back */}
                <TouchableOpacity
                  style={[styles.add_button, {
                    justifyContent: values?.back_photo?.uri ? 'space-between' : 'flex-start'
                  }]}
                  onPress={() => {
                    if (values?.back_photo?.name) {
                      setIsVisible(true)
                      setPhoto([{ uri: values?.back_photo?.uri }])
                    }
                    else {
                      handleDocumentSelection("back_photo")
                    }
                  }}>
                  {values?.back_photo?.uri ?
                    <>
                      <Text style={styles.add_button_text}>{values?.back_photo?.name}</Text>
                      <Entypo name="circle-with-cross" size={26} color={'red'} onPress={() => setValues({ ...values, back_photo: {} })} />
                    </>
                    :
                    <>
                      <Entypo name="upload-to-cloud" size={26} color={'black'} />
                      <Text style={styles.add_button_text}>{t('Add Back photo')}</Text>
                    </>
                  }
                </TouchableOpacity>
                {/* NeighbourHood */}
                <TouchableOpacity
                  style={[styles.add_button, {
                    justifyContent: values?.neighbourhood_photo?.uri ? 'space-between' : 'flex-start'
                  }]}
                  onPress={() => {
                    if (values?.neighbourhood_photo?.name) {
                      setIsVisible(true)
                      setPhoto([{ uri: values?.neighbourhood_photo?.uri }])
                    }
                    else {
                      handleDocumentSelection("neighbourhood_photo")
                    }
                  }}>
                  {values?.neighbourhood_photo?.uri ?
                    <>
                      <Text style={styles.add_button_text}>{values?.neighbourhood_photo?.name}</Text>
                      <Entypo name="circle-with-cross" size={26} color={'red'} onPress={() => setValues({ ...values, neighbourhood_photo: {} })} />
                    </>
                    :
                    <>
                      <Entypo name="upload-to-cloud" size={26} color={'black'} />
                      <Text style={styles.add_button_text}>{t('Add Neighbourhood photo')}</Text>
                    </>
                  }
                </TouchableOpacity>
                {/* Inside living */}
                <TouchableOpacity
                  style={[styles.add_button, {
                    justifyContent: values?.inside_living_photo?.uri ? 'space-between' : 'flex-start'
                  }]}
                  onPress={() => {
                    if (values?.inside_living_photo?.name) {
                      setIsVisible(true)
                      setPhoto([{ uri: values?.inside_living_photo?.uri }])
                    }
                    else {
                      handleDocumentSelection("inside_living_photo")
                    }
                  }}>
                  {values?.inside_living_photo?.uri ?
                    <>
                      <Text style={styles.add_button_text}>{values?.inside_living_photo?.name}</Text>
                      <Entypo name="circle-with-cross" size={26} color={'red'} onPress={() => setValues({ ...values, inside_living_photo: {} })} />
                    </>
                    :
                    <>
                      <Entypo name="upload-to-cloud" size={26} color={'black'} />
                      <Text style={styles.add_button_text}>{t('Add Inside living photo')}</Text>
                    </>
                  }
                </TouchableOpacity>
                {/* Kitchen */}
                <TouchableOpacity
                  style={[styles.add_button, {
                    justifyContent: values?.kitchen_photo?.uri ? 'space-between' : 'flex-start',
                  }]}
                  onPress={() => {
                    if (values?.kitchen_photo?.name) {
                      setIsVisible(true)
                      setPhoto([{ uri: values?.kitchen_photo?.uri }])
                    }
                    else {
                      handleDocumentSelection("kitchen_photo")
                    }
                  }}>
                  {values?.kitchen_photo?.uri ?
                    <>
                      <Text style={styles.add_button_text}>{values?.kitchen_photo?.name}</Text>
                      <Entypo name="circle-with-cross" size={26} color={'red'} onPress={() => setValues({ ...values, kitchen_photo: {} })} />
                    </>
                    :
                    <>
                      <Entypo name="upload-to-cloud" size={26} color={'black'} />
                      <Text style={styles.add_button_text}>{t('Add Kitchen photo')}</Text>
                    </>
                  }
                </TouchableOpacity>
              </View>
            </View>
          </>
          : null
        }
        <MultiselectDropdown
          containerStyle={{ marginTop: '5%', paddingTop: 0 }}
          data={[
            { key: 'Cricket', name: 'Cricket' },
            { key: 'Football', name: 'Football' },
            { key: 'Basketball', name: 'Basketball' },
            { key: 'Hockey', name: 'Hockey' },
          ]}
          setSelectedd={item => {
            setValues({
              ...values,
              amenities: item,
            });
          }}
          selectedd={values.amenities}
          infoName={t('Amenities')}
        />
        {touched?.amenities && errors?.amenities && (
          <Text style={Styles.error2}>{String(errors?.amenities)}</Text>
        )}
      </KeyboardAwareScrollView>
      <View style={[Styles.bottomBtn, { flexDirection: 'row', justifyContent: 'space-between' }]}>
        <CustomButton btnText={t('next')} style={{ width: '100%', height: 60 }} onPress={handleSubmit} />
        {/* <CustomButton btnText={t('save as draft')} style={{ width: '48%', height: 60, backgroundColor: borderColor }} onPress={() => { }} btnStyle={{ color: 'black' }} /> */}
      </View>
      <ImageView
        images={photo}
        imageIndex={0}
        visible={visible}
        onRequestClose={() => setIsVisible(false)}
      />
    </View>
  )
}

export default HousePhoto

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
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
  upload_image: {
    height: 46,
    width: 46,
    resizeMode: 'contain',
    marginHorizontal: 12,
    backgroundColor: 'red'
  },
  add_button: {
    borderColor: primaryColor,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    justifyContent: 'flex-start',
    flexDirection: 'row',
    gap: 48,
    marginTop: 16,
    width:'100%',
    paddingHorizontal:22
  },
  add_button_text: {
    color: '#000',
    fontSize: 16 / fontScale,
    fontFamily: fontFamilyMedium,
    alignSelf: 'center'
  }
})