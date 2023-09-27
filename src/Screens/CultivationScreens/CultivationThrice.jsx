import {Button, Text, Box, Flex} from '@react-native-material/core';
import React from 'react';
import {SafeAreaView, StyleSheet, TouchableOpacity, View} from 'react-native';
import CustomHeader from '../../Components/CustomHeader/CustomHeader';
import {useDispatch} from 'react-redux';
import {setSeason} from '../../Redux/CultivationSlice';
import { useTranslation } from 'react-i18next';
import '../../i18next';

const styles = StyleSheet.create({
  mainContainer: {
    marginTop: '5%',
    width: '90%',
    alignSelf: 'center',
  },
  cultivate_sec: {
    alignItems: 'center',
    flexDirection: 'row',
    // backgroundColor: '#080808',
    borderWidth: 1,
    borderColor: '#ECECEC',
    borderRadius: 8,
    padding: 16,
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  container: {
    flex: 1,
    // paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  h4: {
    color: '#263238',
    // fontFamily: Ubuntu;
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 500,
  },
});

export default function CultivationThrice({navigation}) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  return (
    <>
      <View style={styles.container}>
        <CustomHeader
          backIcon={true}
          headerName={'Cultivated thrice in a year'}
          goBack={() => navigation.goBack()}
        />
        <View style={styles.mainContainer}>
          <TouchableOpacity
            onPress={() =>
              dispatch(setSeason(1))
                .unwrap()
                .then(() => {
                  navigation.navigate('season1', {seasonName: 'Season 1'});
                })
            }>
            <Flex style={styles.cultivate_sec}>
              <Box style={styles.cul_lft}>
                <Text variant="h4" style={styles.h4}>
                  {t('Season 01')}
                </Text>
              </Box>
            </Flex>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              dispatch(setSeason(2))
                .unwrap()
                .then(() => {
                  navigation.navigate('season1', {seasonName: 'Season 2'});
                })
            }>
            <Flex style={styles.cultivate_sec}>
              <Box style={styles.cul_lft}>
                <Text variant="h4" style={styles.h4}>
                  {t('Season 02')}
                </Text>
              </Box>
            </Flex>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              dispatch(setSeason(3))
                .unwrap()
                .then(() => {
                  navigation.navigate('season1', {seasonName: 'Season 3'});
                })
            }>
            <Flex style={styles.cultivate_sec}>
              <Box style={styles.cul_lft}>
                <Text variant="h4" style={styles.h4}>
                  {t('Season 03')}
                </Text>
              </Box>
            </Flex>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
