import {FlatList, StyleSheet, Text, ToastAndroid, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import StackHeader from '../../../../../Components/CustomHeader/StackHeader';
import NoData from '../../../../../Components/Nodata/NoData';
import {Styles, width} from '../../../../../styles/globalStyles';
import AddAndDeleteCropButton from '../../../../../Components/CropButtons/AddAndDeleteCropButton';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';
import {dark_grey} from '../../../../../styles/colors';
import PoultryHarvestedProductList from '../../../../../Components/Card/PoultryHarvestedProductList';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { add_poultry, edit_poultry } from '../../../../../apis/food';
import AlertModal from '../../../../../Components/Popups/AlertModal';

const PoultryHarvestedProduct = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {crop_name, impVal, proVal, crop_id, get_data} = route.params;
    const [data, setData] = useState(get_data);
    const [objError, setObjError] = useState('');
    const queryClient = useQueryClient();
    const [modalViisble, setModalVisible] = useState(false);
    const [successModal, setSuccessModal] = useState(false);
    const [message, setMessage] = useState('');
    useEffect(() => {
      navigation.setOptions({
        header: (props: any) => (
          <StackHeader
            title={crop_name.charAt(0).toUpperCase() + crop_name.slice(1)}
          />
        ),
      });
    }, [crop_name]);
    const {mutate: addPoultry} = useMutation({
      mutationFn: (data: any) => add_poultry(data),
      onSuccess: data => {
        setModalVisible(false);
        setSuccessModal(true);
        queryClient.invalidateQueries();
      },
      onError: error => {
        setModalVisible(false);
        ToastAndroid.show(
          error?.response?.data?.message
            ? error?.response?.data?.message
            : 'Error Detected',
          ToastAndroid.SHORT,
        );
        console.log(
          'error?.response?.data?.message',
          error,
          error?.response?.data?.message,
        );
      },
    });
    const {mutate: updatePoultry} = useMutation({
      mutationFn: (data: any) => edit_poultry(data),
      onSuccess: data => {
        setSuccessModal(true);
        queryClient.invalidateQueries();
      },
      onError: error => {
        console.log(
          'error?.response?.data?.message edit',
          error,
          error?.response?.data?.message,
        );
      },
    });
    useEffect(()=>{
      setData(get_data?.products?.length>0?get_data?.products:[])
      // setData(get_data?.products.map((item)=>{
      //   return {
      //     product_name: item?.product_name,
      //     output: item?.output,
      //     self_consumed: item?.self_consumed,
      //     sold_to_neighbours: item?.sold_to_neighbours,
      //     sold_for_industrial_use: item?.sold_for_industrial_use,
      //     wastage: item?.wastage,
      //     others: item?.others,
      //     others_value: item?.others_value,
      //     month_harvested: new Date(item?.month_harvested),
      //     required_processing: item?.required_processing,
      //   };
      // }));
    },[get_data])
    console.log("get dataa", get_data)
  return (
    <View style={styles.container}>
      <View style={[Styles.mainContainer, {paddingBottom: 120}]}>
        <FlatList
          data={data}
          keyboardShouldPersistTaps="handled"
          renderItem={({item, index}: {item: any; index: any}) => (
            <PoultryHarvestedProductList
              item={item}
              index={index}
              weight={impVal?.weight_measurement}
              setData={(data: any, indx: any) => {
                setData((prevData: any) =>
                  prevData.map((item: any, index: any) =>
                    index === indx ? data : item,
                  ),
                );
              }}
              setRemove={(e: any) => {
                setData(data.filter((_: any, i: any) => i !== e)),
                  setObjError('');
              }}
            />
          )}
          keyExtractor={(item: any, index: any) => index.toString()}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <NoData
              title={'Add Harvested Products'}
              onPress={() => {
                setData([
                  ...data,
                  {
                    product_name: '',
                    output: 0,
                    self_consumed: 0,
                    fed_to_livestock: 0,
                    sold_to_neighbours: 0,
                    sold_for_industrial_use: 0,
                    wastage: 0,
                    others: '',
                    others_value: 0,
                    month_harvested: new Date().toISOString(),
                    required_processing: false,
                  },
                ]);
              }}
            />
          }
          ListFooterComponent={
            data?.length > 0 ? (
              <>
                <TouchableOpacity
                  style={Styles.addAndDeleteButtonSection}
                  onPress={() => {
                    setData([
                      ...data,
                      {
                        product_name: '',
                        output: 0,
                        self_consumed: 0,
                        fed_to_livestock: 0,
                        sold_to_neighbours: 0,
                        sold_for_industrial_use: 0,
                        wastage: 0,
                        others: '',
                        others_value: 0,
                        month_harvested: new Date().toISOString(),
                        required_processing: false,
                      },
                    ]);
                  }}>
                  <AddAndDeleteCropButton
                    add={true}
                    cropName={'Add Product'}
                    onPress={() => {
                      setData([
                        ...data,
                        {
                          product_name: '',
                          output: 0,
                          self_consumed: 0,
                          fed_to_livestock: 0,
                          sold_to_neighbours: 0,
                          sold_for_industrial_use: 0,
                          wastage: 0,
                          others: 'Retain',
                          others_value: 0,
                          month_harvested: new Date().toISOString(),
                          required_processing: false,
                        },
                      ]);
                    }}
                  />
                </TouchableOpacity>
                {objError && <Text style={Styles.error}>{objError}</Text>}
              </>
            ) : null
          }
        />
      </View>

      {data?.length > 0 && (
        <View style={[Styles.bottomBtn]}>
          <View style={{flexDirection: 'row', gap: 16}}>
            <CustomButton
              onPress={() => {
                const allValid = data.every(
                  (product: any) =>
                    product.output > 0 && product.product_name.trim() !== '',
                );
                if (allValid) {
                  setModalVisible(true);
                   setObjError('');
                } else {
                  setObjError(
                    !allValid
                      ? 'Output must be greater than 0 for each product and product name is required'
                      : '',
                  );
                }
              }}
              btnText={'Submit'}
              style={{width: width / 2.5}}
            />
            <CustomButton
              onPress={() => {
                const allValid = data.every(
                  (product: any) =>
                    product.output > 0 && product.product_name.trim() !== '',
                );
                if (allValid) {
                  if (get_data?._id) {
                    console.log("heree")
                    setMessage('drafted');
                    updatePoultry({
                      ...impVal,
                      ...proVal,
                      harvested_product: data,
                      poultry_id: get_data?._id,
                      status: 0,
                    });
                  } else {
                    console.log("hereee2")
                    setMessage('drafted');
                    addPoultry({
                      ...impVal,
                      ...proVal,
                      harvested_product: data,
                      crop_id: crop_id,
                      status: 0,
                    });
                  }
                } else {
                  setObjError(
                    !allValid
                      ? 'Output must be greater than 0 for each product and product name is required'
                      : '',
                  );
                }
              }}
              btnText={'Save as draft'}
              btnStyle={{color: dark_grey}}
              style={{width: width / 2.5, backgroundColor: '#ebeced'}}
            />
          </View>
        </View>
      )}
      <AlertModal
        visible={modalViisble}
        cancel={true}
        hideText={'Cancel'}
        onSubmit={() => {
          if (get_data?._id) {
            setMessage('updated');
            updatePoultry({
              ...impVal,
              ...proVal,
              harvested_product: data,
              poultry_id: get_data?._id,
              status: 1,
            });
          } else {
            setMessage('submitted');
            addPoultry({
              ...impVal,
              ...proVal,
              harvested_product: data,
              crop_id: crop_id,
              status: 1,
            });
          }
        }}
        confirmText="Submit"
        onHide={() => setModalVisible(false)}
        title="Confirm Submit"
        comments="Are you sure you want to submit this form?"
      />
      <AlertModal
        visible={successModal}
        successModal={true}
        onSubmit={() => {
          setSuccessModal(false), navigation.goBack(), navigation.goBack(), navigation.goBack()
        }}
        confirmText="Okay"
        title="Successful"
        comments={`Form ${message} successfully`}
      />
    </View>
  );
};

export default PoultryHarvestedProduct;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
