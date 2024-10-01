import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import StackHeader from '../../../../../Components/CustomHeader/StackHeader';
import NoData from '../../../../../Components/Nodata/NoData';
import {Styles, width} from '../../../../../styles/globalStyles';
import AddAndDeleteCropButton from '../../../../../Components/CropButtons/AddAndDeleteCropButton';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';
import {dark_grey} from '../../../../../styles/colors';
import PoultryHarvestedProductList from '../../../../../Components/Card/PoultryHarvestedProductList';

const PoultryHarvestedProduct = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {crop_name, impVal, proVal} = route.params;
  const [data, setData] = useState([]);
  const [objError, setObjError] = useState('');
  useEffect(() => {
    navigation.setOptions({
      header: (props: any) => (
        <StackHeader
          title={crop_name.charAt(0).toUpperCase() + crop_name.slice(1)}
        />
      ),
    });
  }, [crop_name]);
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
            data.length > 0 ? (
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

      {data.length > 0 && (
        <View style={[Styles.bottomBtn]}>
          <View style={{flexDirection: 'row', gap: 16}}>
            <CustomButton
              onPress={() => {
                const allValid = data.every(
                  (product: any) =>
                    product.output > 0 && product.product_name.trim() !== '',
                );
                setObjError(
                  !allValid
                    ? 'Output must be greater than 0 for each product and product name is required'
                    : '',
                );
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
                console.log('alll', allValid);
                setObjError(
                  !allValid
                    ? 'Output must be greater than 0 for each product and product name is required'
                    : '',
                );
              }}
              btnText={'Save as draft'}
              btnStyle={{color: dark_grey}}
              style={{width: width / 2.5, backgroundColor: '#ebeced'}}
            />
          </View>
        </View>
      )}
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
