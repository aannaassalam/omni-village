import {Button, Text, Box,Flex} from '@react-native-material/core';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
    cultivate_sec: {
      alignItems: 'center',
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
        color: '#263238',
      // fontFamily: Ubuntu;
      fontSize: 13,
      fontStyle: 'normal',
      fontWeight: 500,
    },

  });

export default function CultivationTwice() {
  return (
    <>
      <View style={styles.container}>
        <Flex  style={styles.cultivate_sec}>
          <Box style={styles.cul_lft}>
            <Text variant="h4" style={styles.h4}>
            Season 01
            </Text>
          
          </Box>
 
        </Flex>
        <Flex  style={styles.cultivate_sec}>
          <Box style={styles.cul_lft}>
            <Text variant="h4" style={styles.h4}>
            Season 02
            </Text>
          
          </Box>
 
        </Flex>
 
      </View>
    </>
  )
}
