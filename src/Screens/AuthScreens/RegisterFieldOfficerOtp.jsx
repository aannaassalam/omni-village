import { Box, Flex } from '@react-native-material/core';
import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Pressable,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from 'react-native';
import CustomButton from '../../Components/CustomButton/CustomButton';
import OtpInput from '../../Components/OtpInputs';
import { useUser } from '../../Hooks/useUser';
import LoginWrapper from '../../Layout/LoginWrapper/LoginWrapper';
import { register, sentOtp } from '../../functions/AuthScreens';
import { storage } from '../../Helper/Storage';

export default function RegisterFieldOfficerOtp({ navigation, route }) {
    const { data: user } = useUser();

    const { t } = useTranslation();

    const [timer, setTimer] = useState(30);
    // const [otp, setOtp] = useState('');
    const otp = useRef('');
    const [err, setErr] = useState('');

    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);

    const { mutate, isPending } = useMutation({
        mutationFn: register,
        onSuccess: data => {
            storage.set('token', data.token);
            storage.set('refresh_token', data?.refreshToken);
            storage.set('type', 'officer');
            navigation.replace('registerDetailsFieldOfficer', { edit: false });
        },
        onError: error => {
            if (error.response.status === 401) {
                setErr(error.response.data.message);
            }
            console.log(error.response, 'err');
        },
    });

    const { isPending: isOTPPending, mutate: resendOtp } = useMutation({
        mutationFn: sentOtp,
        onError: error => {
            if (error.response.status === 400) {
                setErr(error.response.data.message);
            }
            console.log(error.response);
        },
    });

    useEffect(() => {
        const interval = setInterval(
            () => setTimer(prev => (prev > 0 ? prev - 1 : 0)),
            1000,
        );

        return () => {
            clearInterval(interval);
        };
    });

    const FormSubmit = () => {
        if (otp.current.length === 4) {
            mutate({ ...route.params, otp: otp.current });
        } else {
            setErr(t('invalid otp'));
        }
    };

    return (
        <LoginWrapper>
            <View style={styles.form_section}>
                <View style={styles.form_head}>
                    <Text style={styles.LoginHead}>{t('register as field officer')}</Text>
                    <Text style={styles.subtitle}>
                        {t('enter otp recieved in')}{' '}
                        {`XXX${route.params?.phone?.slice(-2)}`}
                    </Text>
                </View>
                <View style={styles.login_input}>
                    <OtpInput setParentOtp={ot => (otp.current = ot)} />
                    {err.length > 0 && (
                        <Text
                            style={{
                                marginTop: 5,
                                marginLeft: 10,
                                color: '#ff000e',
                                fontFamily: 'ubuntu-regular',
                            }}>
                            {err}
                        </Text>
                    )}
                </View>
                <View style={styles.login_submit}>
                    <CustomButton
                        btnText={t('confirm')}
                        onPress={FormSubmit}
                        loading={isPending}
                    />
                </View>
                <Box style={styles.resend_sec}>
                    <Flex style={styles.resend_text}>
                        <Text style={styles.normal_text}>{t("haven't recieved any")}</Text>
                        <Pressable
                            onPress={() =>
                                timer === 0
                                    ? resendOtp({
                                        phone: route.params.phone,
                                        country_code: `${route.params?.country_code}`,
                                        type: 'register',
                                    })
                                    : null
                            }>
                            <Text style={[timer === 0 ? styles.green : styles.low_green]}>
                                {t('resend')}
                            </Text>
                        </Pressable>
                    </Flex>
                    <Text style={styles.normal_text}>
                        00:{timer < 10 ? '0' + timer : timer}
                    </Text>
                </Box>
                {/* <Text>{otp.current}</Text> */}
            </View>
        </LoginWrapper>
    );
}

const makeStyles = fontScale =>
    StyleSheet.create({
        form_section: {
            alignItems: 'center',
            marginTop: 20,
        },
        LoginHead: {
            color: '#36393B',
            fontSize: 22 / fontScale,
            marginBottom: 10,
            textAlign: 'center',
            fontFamily: 'ubuntu-medium',
        },
        subtitle: {
            color: '#36393B',
            fontFamily: 'ubuntu-regular',
            fontSize: 14 / fontScale,
        },
        login_input: {
            width: '100%',
        },
        form_head: {
            marginBottom: 35,
        },
        login_submit: {
            marginTop: 20,
            width: '100%',
        },
        socialbuttons: {},
        form_btm: {
            marginTop: 40,
        },
        login_text: {
            textAlign: 'center',
            position: 'relative',
            zIndex: 5,
            height: 30,
        },
        form_btm_text: {
            width: '100%',
            marginBottom: 40,
        },
        social_btn: {
            width: '100%',
            flexDirection: 'row',
            justifyContent: 'center',
        },
        line_border: {
            flexDirection: 'row',
            height: 2,
            backgroundColor: '#EBEBEB',
            marginTop: -20,
        },
        register_text: {
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 150,
        },
        register_text_frst: {},
        register_text_scnd: {
            color: '#268C43',
            fontSize: 14 / fontScale,
            marginLeft: 5,
        },
        login_input_flex: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
        },
        resend_sec: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            marginTop: 15,
        },
        resend_text: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        green: {
            color: `#268C43`,
            fontSize: 14 / fontScale,
            marginLeft: 6,
            fontFamily: 'ubuntu-medium',
            lineHeight: 13,
        },
        low_green: {
            color: `#268c4387`,
            fontSize: 14 / fontScale,
            marginLeft: 6,
            fontFamily: 'ubuntu-medium',
            lineHeight: 13,
        },
        normal_text: {
            color: '#36393B',
            fontSize: 14 / fontScale,
            fontFamily: 'ubuntu-regular',
        },
    });
