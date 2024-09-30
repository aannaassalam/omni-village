import {FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import StackHeader from '../../../../../Components/CustomHeader/StackHeader';
import NoData from '../../../../../Components/Nodata/NoData';
import HarvestedProductList from '../../../../../Components/Card/HarvestedProductList';
import {Styles} from '../../../../../styles/globalStyles';
import AddAndDeleteCropButton from '../../../../../Components/CropButtons/AddAndDeleteCropButton';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';

const Harvestedproducts = ({
  navigation,
  route,
}: {
  navigation: any;
  route: any;
}) => {
  const {crop_name} = route.params;
  const [data, setData] = useState([]);
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
            <HarvestedProductList
              item={item}
              index={index}
              setData={(data: any, indx: any) => {
                  setData(prevData =>
                    prevData.map((item, index) =>
                      index === indx ? data : item,
                    ),
                  );
              }}
              setRemove={(e: any) =>
                setData(data.filter((_: any, i: any) => i !== e))
              }
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
            ) : null
          }
        />
      </View>
      <View style={[Styles.bottomBtn]}>
        <CustomButton
          onPress={() => {}}
          btnText={'Submit'}
        />
      </View>
    </View>
  );
};

export default Harvestedproducts;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
