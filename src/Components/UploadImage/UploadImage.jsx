import { Image, StyleSheet, Text, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import React from 'react'
import AntDesign from 'react-native-vector-icons/AntDesign';
import { primaryColor } from '../../styles/colors';

const UploadImage = ({ handleDocumentSelection, title, image, handleDocumentRemove, previewImage }) => {
    const { fontScale } = useWindowDimensions()
    const styles = makeStyles(fontScale)
    return (
        <View>
            {image?.uri ?
                <TouchableOpacity style={styles.container} onPress={previewImage}>
                    <View style={styles.file_box_lft}>
                        <Image
                            style={styles.tinyLogo}
                            source={require('../../../assets/file_img.png')}
                        />
                        <Text varint="body1" style={styles.upload_txt}>
                            {image?.name}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{ alignSelf: 'center' }}
                        onPress={handleDocumentRemove}>
                        <AntDesign name='closecircle' size={24} color={primaryColor} />
                    </TouchableOpacity>
                </TouchableOpacity>
                :
                <TouchableOpacity style={styles.container} onPress={previewImage}>
                    <View style={styles.file_box_lft}>
                        <Image
                            style={styles.tinyLogo}
                            source={require('../../../assets/file_img.png')}
                        />
                        <Text varint="body1" style={styles.upload_txt}>
                            {title}
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={styles.btn}
                        onPress={handleDocumentSelection}>
                        <Text style={styles.cmn_btn_text}>{'Browse'}</Text>
                    </TouchableOpacity>
                </TouchableOpacity>}
        </View>
    )

}

export default UploadImage

const makeStyles = fontScale => StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        backgroundColor: 'rgba(38, 140, 67, .2)',
        padding: 16,
        borderRadius: 10,
        width: '95%',
        alignSelf: 'center',
        marginTop: 16
    },
    file_box_lft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        gap: 5
    },
    upload_txt: {
        color: '#268C43',
        fontSize: 14 / fontScale,
        marginLeft: 7,
        fontFamily: 'ubuntu-regular',
        marginRight: 'auto',
        flex: 1,
        flexWrap: 'wrap',
    },
    btn: {
        minWidth: 78,
        minHeight: 28,
        borderRadius: 8,
        backgroundColor: '#268C43',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cmn_btn_text: {
        fontSize: 14 / fontScale,
        marginBottom: 4,
        color: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'ubuntu-medium',
    },
})