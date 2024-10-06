import { Dimensions, StyleSheet, useWindowDimensions } from "react-native";
import { fontFamilyMedium, fontFamilyRegular } from "./fontStyle";
import { borderColor, light_grey, primary, white } from "./colors";
export const { width, fontScale,height } = Dimensions.get('window')
export const Styles = StyleSheet.create({
    mainContainer:{
        flex: 1,
        paddingHorizontal: 22,
        paddingBottom: 22,
        paddingTop: 12,
        backgroundColor:white
    },
    fieldLabel: {
        fontFamily: fontFamilyMedium,
        fontSize: 13 / fontScale,
        color: primary,
        marginBottom: 8,
        marginTop: 16,
    },
    twoFieldsContainer: {
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        marginTop: 16,
    },
    divider:{
        marginVertical: 16
    },
    bottomBtn:{
        position:'absolute',
        bottom:0,
        width:'100%',
        backgroundColor:'white',
        elevation: 5,
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems:'center',
        alignSelf:'center'
    },
    bottomPopupbutton: {
        flexDirection: 'row',
        alignSelf: 'center',
        justifyContent: 'space-between',
        marginTop: '5%',
        paddingHorizontal: 14
    },
    submitButton: {
        width: '45%',
        margin: 10,
    },
    draftButton: {
        width: '45%',
        margin: 10,
        backgroundColor: 'grey',
    },
    error: {
        fontFamily: fontFamilyRegular,
        fontSize: 14 / fontScale,
        color: '#ff000e',
        marginTop: 5,
    },
    savePopup: {
        justifyContent: 'center',
        width: '97%',
        borderRadius: 20,
    },
    popupButton: {
        width: '70%',
        alignSelf: 'center',
    },
    confirmText: {
        alignSelf: 'center',
        fontSize: 18 / fontScale,
        color: '#000',
        fontFamily: fontFamilyMedium,
        fontWeight: '500',
        padding: 10,
        textAlign: 'center',
    },
    nextText: {
        alignSelf: 'center',
        fontSize: 18 / fontScale,
        color: '#000',
        fontFamily: fontFamilyMedium,
        textAlign: 'center',
    },
    submitPopup: {
        alignItems: 'center',
        padding: 10,
    },
    noteImage: {
        padding: 10,
    },
    verticalLine: {
        alignSelf: 'center',
        height:35,
        width: '4%',
        borderRadius: 10,
        backgroundColor: borderColor
    },
    horizontalLine: {
        alignSelf: 'center',
        height: '3%',
        width: '100%',
        borderRadius: 10,
        backgroundColor: borderColor
    },
    dividerRowContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '92%', gap: 6, alignSelf: 'center' },
    yearPickerBtn: {
        paddingTop: 5,
        marginTop: 10,
        width: '95%',
        alignSelf: 'center',
        backgroundColor: 'red',
        backgroundColor: '#fff',
        borderColor: '#c6f1d3',
        borderWidth: 1,
        borderRadius: 10,
    },
    addAndDeleteButtonSection: {
        marginTop: '5%',
    },
})