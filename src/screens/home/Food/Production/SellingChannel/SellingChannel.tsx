import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Styles } from '../../../../../styles/globalStyles';
import { fontFamilyBold, fontFamilyRegular } from '../../../../../styles/fontStyle';
import { black, borderColor, dark_grey, draft_color, primary } from '../../../../../styles/colors';
import HeaderCard from '../../../../../Components/Card/HeaderCard';
import CustomButton from '../../../../../Components/CustomButton/CustomButton';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { add_selling_channel, edit_selling_channel, get_selling_channel } from '../../../../../apis/food';
import AlertModal from '../../../../../Components/Popups/AlertModal';

const SellingChannel = ({navigation}:{navigation:any}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const queryClient = useQueryClient();
  const [modalVisible,setModalVisible]=useState(false)
  // Initialize state with the data object
  const [data, setData] = useState({
    local_market: false,
    broker: false,
    ecommerce: false,
    export: false,
    none: false,
  });
  const {data: selling_channel, isLoading} = useQuery({
    queryKey: ['get_selling_channel'],
    queryFn: () => get_selling_channel(),
  });
  const {mutate: addSellingChannel} = useMutation({
    mutationFn: (data: any) => add_selling_channel(data),
    onSuccess: data => {
      setModalVisible(true)
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
   const {mutate: editSellingChannel} = useMutation({
     mutationFn: (data: any) => edit_selling_channel(data),
     onSuccess: data => {
      setModalVisible(true)
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
  if(selling_channel){
    setData({
      local_market: selling_channel.local_market,
      broker: selling_channel.broker,
      ecommerce: selling_channel.ecommerce,
      export: selling_channel.export,
      none: selling_channel.none,
    });
  }else{
    setData({
      local_market: false,
      broker: false,
      ecommerce: false,
      export: false,
      none: false,
    });
  }
},[selling_channel])
  // Toggle the value of the selected key
  const toggleValue = (key: any) => {
    setData(prevState => ({
      ...prevState,
      [key]: !prevState[key], // Toggle the value of the selected key
    }));
  };
  console.log(
    'selling_channel?.selling_channel_id',
    selling_channel?._id,
  );
  return (
    <View style={styles.container}>
      <View style={Styles.mainContainer}>
        <HeaderCard disabled={true}>
          <View style={styles.inner_container}>
            <View>
              <Text
                style={[
                  styles.header_text,
                  {marginBottom: 16, marginTop: 6, color: black},
                ]}>
                Selling Channel
              </Text>
            </View>
            <View style={styles.box_inner_container}>
              <Image
                source={require('../../../../../../assets/e2.png')}
                style={styles.image}
              />
            </View>
          </View>
        </HeaderCard>
        <View style={{marginTop: '5%'}}>
          {Object.entries(data).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={styles.row}
              onPress={() => toggleValue(key)}>
              <Text style={styles.text}>
                {key.charAt(0).toUpperCase()}
                {key.replace('_', ' ').slice(1)}
              </Text>
              <TouchableOpacity>
                <Image
                  source={
                    value === true
                      ? require('../../../../../../assets/checked.png')
                      : require('../../../../../../assets/unchecked.png')
                  }
                  style={{height: 22, width: 22, alignSelf: 'center'}}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={Styles.bottomBtn}>
        <CustomButton
          btnText={'Submit'}
          onPress={() => {
            if (selling_channel?._id) {
              console.log('hereee');
              editSellingChannel({
                selling_channel_id: selling_channel?._id,
                local_market: data?.local_market,
                broker: data?.broker,
                ecommerce: data?.ecommerce,
                export: data?.export,
                none: data?.none,
              });
            } else {
              console.log('heereree2');
              addSellingChannel({
                local_market: data?.local_market,
                broker: data?.broker,
                ecommerce: data?.ecommerce,
                export: data?.export,
                none: data?.none,
              });
            }
          }}
        />
      </View>
      <AlertModal
        visible={modalVisible}
        successModal={true}
        onSubmit={() => {setModalVisible(false),navigation.goBack()}}
        confirmText="Okay"
        title="Successfully Submit"
        comments="Form submitted successfully!"
      />
    </View>
  );
}

export default SellingChannel

const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    inner_container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems:'center'
    },
    box_inner_container: {
      backgroundColor: primary,
      padding: 22,
      borderRadius: 8,
    },
    image: {
      height: 50,
      width: 50,
      resizeMode: 'contain',
    },
    header_text: {
      fontSize: 24 / fontScale,
      fontFamily: fontFamilyBold,
      color: primary,
    },
    sub_text: {
      fontSize: 14 / fontScale,
      fontFamily: fontFamilyRegular,
      color: dark_grey,
    },
    topContainer: {
      backgroundColor: '#d8f2df',
      borderRadius: 20,
      padding: 10,
      alignSelf: 'center',
      width: 100,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 18,
      borderColor: borderColor,
      borderWidth: 1,
      marginVertical: 8,
      borderRadius: 8,
      alignItems:'center'
    },
    text: {
      fontSize: 16 / fontScale,
      fontFamily: fontFamilyRegular,
      color: '#000',
    },
  });