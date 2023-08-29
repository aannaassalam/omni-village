import {
    StyleSheet,
    Text,
    View,
    TextInput,
    useWindowDimensions,
    TouchableOpacity
} from 'react-native';
import React from 'react';
import { Divider } from 'react-native-paper';
// import {TextInput} from 'react-native-paper';

const InputWithStorage = ({
    label,
    value,
    onChangeText,
    placeholder,
    productionName,
    measureName,
    onFocus,
    storagePress,
    notRightText,
    multiline,
    storageMethod,
    editable,
    keyboardType,
}) => {
    const { fontScale } = useWindowDimensions();
    const styles = makeStyles(fontScale);
    return (
        <View>
            <View style={[styles.textInputContainer]}>
                <View style={styles.textInputInner}>
                    <View
                        style={[
                            styles.textInputAcres,
                            {
                                justifyContent:'space-evenly',
                                marginLeft:'5%',
                            },
                        ]}>
                        <View style={[styles.textInput]}>
                            <Text style={styles.cultivationText}>{productionName}</Text>
                            <TextInput
                                style={styles.inputText}
                                onChangeText={onChangeText}
                                value={value}
                                placeholder={placeholder}
                                placeholderTextColor={'#000'}
                                onFocus={onFocus}
                                // editable={!editable}
                                // keyboardType={keyboardType}
                                multiline={multiline}
                            // numberOfLines={multiline == true ? 2 : 0}
                            />
                        </View>
                                <Divider horizontalInset={false} style={styles.divider} />
                                <Text style={styles.acresText}>
                                    {!measureName ? 'acres' : measureName}
                                </Text>
                                <TouchableOpacity style={styles.storageContainer} onPress={storagePress}>
                                    <Text style={[styles.cultivationText,{marginTop:0,marginBottom:0}]}>Storage method</Text>
                                    <Text style={styles.methodText}>{storageMethod}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default InputWithStorage;

const makeStyles = fontScale =>
    StyleSheet.create({
        container: {
            backgroundColor: '#fff',
            width: '95%',
        },
        textInputContainer: {
            paddingTop: 5,
            marginTop: 10,
            width: '95%',
            alignSelf: 'center',
        },
        inputText: {
            color: '#000',
            fontSize: 16 / fontScale,
            fontWeight: '500',
            // backgroundColor: 'red',
        },
        textInputInner: {
            backgroundColor: '#fff',
            borderColor: '#268C43',
            borderWidth: 0.5,
            borderRadius: 10,
        },
        textInput: {
            width: '55%',
            margin: -7,
            padding: 5,
        },
        textInputAcres: {
            flexDirection: 'row',
            justifyContent: 'space-evenly',
        },
        cultivationText: {
            color: 'green',
            fontSize: 14 / fontScale,
            marginBottom: -10,
            marginTop: 10,
            fontFamily: 'ubuntu_medium',
        },
        divider: {
            height: '80%',
            width: '1%',
            alignSelf: 'center',
        },
        acresText: {
            alignSelf: 'center',
            fontSize: 14 / fontScale,
            color: '#000',
            paddingHorizontal:15
        },
        storageContainer:{
            alignSelf:'center',
            paddingHorizontal:8,
            paddingVertical:5,
            backgroundColor:'#BBD9C4',
            margin:10,
            marginRight:15,
            borderRadius:7
        },
        methodText:{
            fontSize: 14 / fontScale,
            color: '#000',
            fontFamily: 'ubuntu',
        }
    });
