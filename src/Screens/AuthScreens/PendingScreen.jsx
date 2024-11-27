import { Box, Flex, Text } from '@react-native-material/core';
import React, { useEffect } from 'react';
import {
    Image,
    ScrollView,
    StyleSheet,
    View,
    useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useModerator, useUser } from '../../Hooks/useUser';
import { storage } from '../../Helper/Storage';

export default function PendingScreen({ navigation }) {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);

    const { t } = useTranslation();

    const { data: user, isLoading } = useModerator();

    useEffect(() => {
        let timeout;
        if (!isLoading) {
            timeout = setTimeout(() => {
                storage.set('user', JSON.stringify(user));
                // navigation.replace('home');
            }, 3000);
        }
        return () => clearTimeout(timeout);
    }, [isLoading, navigation, user]);

    return (
        <SafeAreaView
            style={{ flex: 1, backgroundColor: '#fff' }}
            edges={['top', 'left', 'right']}>
            <ScrollView contentContainerStyle={{ flex: 1 }}>
                <View style={styles.inner}>
                    <Image
                        style={styles.tickLogo}
                        source={require('../../../assets/tick_icon.png')}
                    />
                    <Text
                        variant="h3"
                        style={{
                            fontSize: 22 / fontScale,
                            color: '#263238',
                            marginBottom: 15,
                            fontFamily: 'ubuntu-medium',
                        }}>
                        {t('Under Verification!')}
                    </Text>
                    <Text variant="body1" style={styles.normalText}>
                        {t('Please wait while we are verifying your account.')}
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const makeStyles = fontScale =>
    StyleSheet.create({
        tickLogo: {
            width: 97,
            height: 97,
            // flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 20,
        },
        inner: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 15,
        },
        normalText: {
            color: '#263238',
            fontSize: 14 / fontScale,
            textAlign: 'center',
            maxWidth: 269,
            marginHorizontal: 'auto',
            fontFamily: 'ubuntu-regular',
            lineHeight: 15,
        },
    });
