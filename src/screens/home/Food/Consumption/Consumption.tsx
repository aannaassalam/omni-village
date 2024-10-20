import {
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import React from 'react';
import {unSelected} from '../../../../styles/colors';
import {fontFamilyMedium} from '../../../../styles/fontStyle';
import {FlatList} from 'react-native';
import {Styles} from '../../../../styles/globalStyles';
import { useQuery } from '@tanstack/react-query';
import { get_consumption_type } from '../../../../apis/crops';
import { USER_PREFERRED_LANGUAGE } from '../../../../i18next';

const Consumption = ({navigation}:{navigation:any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {data: consumptionType, isLoading} = useQuery({
    queryKey: ['get_type'],
    queryFn: () => get_consumption_type({lang: USER_PREFERRED_LANGUAGE}),
  });
  return (
    <View style={styles.container}>
      <View
        style={[
          Styles.mainContainer,
          {paddingTop: 0, paddingHorizontal: 16, paddingBottom: 0},
        ]}>
        <FlatList
          data={consumptionType}
          contentContainerStyle={{marginVertical: 10, paddingBottom: 10}}
          renderItem={({item}) => (
            <TouchableOpacity key={item.name} style={styles.box_container} onPress={()=>navigation.navigate('consumptionItem',{id:item?._id})}>
              <Text style={styles.text}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </View>
  );
};

export default Consumption;

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    box_container: {
      padding: 22,
      borderColor: unSelected,
      borderWidth: 1,
      margin: 8,
      borderRadius: 8,
    },
    text: {
      fontSize: 18 / fontScale,
      color: '#333',
      fontFamily: fontFamilyMedium,
    },
  });
