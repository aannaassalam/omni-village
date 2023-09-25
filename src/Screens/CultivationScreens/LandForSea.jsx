
import {Button, Text, Box,Flex} from '@react-native-material/core';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import { useTranslation } from 'react-i18next';
import '../../i18next';

const styles = StyleSheet.create({
  cultivate_sec: {
    alignItems: 'center',
    display: 'flex',
    flexDirection:"row",
    // backgroundColor: '#080808',
    borderWidth:1,
    borderColor:"#ECECEC",
    borderRadius:8,
    padding:16,
    justifyContent:"space-between",
    marginBottom: 16,
    
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
   
  },
  h4: {
    color: 'rgba(38, 140, 67, 1)',
    // fontFamily: Ubuntu;
    fontSize: 10,
    fontStyle: 'normal',
    fontWeight: 400,
  },
  num: {
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 400,
  },
  acr: {
    fontSize: 13,
    fontStyle: 'normal',
    fontWeight: 400,
    paddingLeft:15,
  },
  cul_rgt:{
    alignItems: 'center',
    display: 'flex',
    flexDirection:"row",
  }
});

export default function LandForSea() {
  const { t } = useTranslation();
  return (
    <>
      <View style={styles.container}>
        <Flex  style={styles.cultivate_sec}>
          <Box style={styles.cul_lft}>
            <Text variant="h4" style={styles.h4}>
            Corp Type 01
            </Text>
            <Text style={styles.num}>10</Text>
          </Box>
          <Box style={styles.cul_rgt}>
          <Box h={30} w={4} style={{ backgroundColor: 'rgba(38, 50, 56, 0.09)' }}/>
            <Text variant="body1" style={styles.acr}>
              acres
            </Text>
          </Box>
        </Flex>
        <Flex  style={styles.cultivate_sec}>
          <Box style={styles.cul_lft}>
            <Text variant="h4" style={styles.h4}>
            Corp Type 02
            </Text>
            <Text style={styles.num}>2</Text>
          </Box>
          <Box style={styles.cul_rgt}>
          <Box h={30} w={4} style={{ backgroundColor: 'rgba(38, 50, 56, 0.09)' }}/>
            <Text variant="body1" style={styles.acr}>
              acres
            </Text>
          </Box>
        </Flex>
        <Flex  style={styles.cultivate_sec}>
          <Box style={styles.cul_lft}>
            <Text variant="h4" style={styles.h4}>
            Corp Type 03
            </Text>
            <Text style={styles.num}>2</Text>
          </Box>
          <Box style={styles.cul_rgt}>
          <Box h={30} w={4} style={{ backgroundColor: 'rgba(38, 50, 56, 0.09)' }}/>
            <Text variant="body1" style={styles.acr}>
              acres
            </Text>
          </Box>
        </Flex>
      </View>
    </>
  );
}
