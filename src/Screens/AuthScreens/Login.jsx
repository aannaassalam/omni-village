import React from 'react'
import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper'

const styles = StyleSheet.create({
    form_section:{
        alignItems:'center'
    },
    LoginHead:{
        color: '#36393B',
        fontSize:22,
        marginBottom: 20
    }
  })

export default function Login() {
  return (
    <SafeAreaView>
        <LoginWrapper>
            <View style={styles.form_section}>
                <Text style={styles.LoginHead}>Login</Text>
                <Text>Login with sent OTP</Text>
            </View>
        </LoginWrapper>
    </SafeAreaView>
  )
}
