import { StyleSheet, Text, View, useWindowDimensions,Pressable } from 'react-native';
import React from 'react';
import { TextInput } from 'react-native-paper';
// import {TextInput} from 'react-native-paper';

const LoginInput = ({
    label,
    value,
    onChangeText,
    placeholder,
    onFocus,
    countryModal,
    countryCode,
    keyboardType = 'default',
}) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    return (
        <View style={styles.textInputContainer}>
            <View>
                <TextInput
                    // onChangeText={onChangeText}
                    outlineColor="green"
                    underlineColorAndroid="transparent"
                    activeOutlineColor="green"
                    outlineStyle={{
                        borderRadius: 10,
                    }}
                    style={{backgroundColor:'#fff',padding:5, paddingLeft:2,paddingRight:2}}
                    render={(inputProps) => (
                        <View style={{flexDirection:'row'}}>
                        <Pressable style={{padding:5,alignSelf:'center', borderRightWidth:3, borderRightColor: '#ccc'}} onPress={countryModal}>
                            <Text style={{color:'#000', marginTop:0, paddingHorizontal:15}}>{countryCode}</Text>
                        </Pressable>
                        <TextInput 
                                outlineColor="white"
                                underlineColorAndroid="transparent"
                                activeOutlineColor="#fff"
                                outlineStyle={{
                                    borderRadius: 10,
                                }}
                                // label={<Text style={{ fontSize: 16 / fontScale }}>{label}</Text>}
                                value={value}
                                mode="outlined"
                                style={[styles.textInput,{ width:300, height:37}]}
                                placeholder={placeholder}
                                placeholderTextColor={'#333'}
                                onFocus={onFocus}
                                keyboardType={keyboardType}
                                onChangeText={onChangeText}
                        />
                        </View>
                    )}
                    mode="outlined"
                    label={<Text style={{ fontSize: 16 / fontScale }}>{label}</Text>}
                    // value={value}
                    // placeholder={placeholder}
                    // placeholderTextColor={'#333'}
                    // onFocus={onFocus}
                    // keyboardType={keyboardType}
                />
            </View>
        </View>
    );
};

export default LoginInput;

const makeStyles = fontScale =>
    StyleSheet.create({
        textInputContainer: {
            paddingTop: 10,
            width: '100%',
            alignSelf: 'center',
        },
        textInput: {
            backgroundColor: '#fff',
            fontFamily: 'ubuntu_medium',
            fontSize: 16 / fontScale,
        },
    });
