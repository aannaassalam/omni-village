import { Dimensions, StyleSheet, useWindowDimensions } from "react-native";
import { fontFamilyMedium, fontFamilyRegular } from "./fontStyle";
const { width, fontScale } = Dimensions.get('window')
export const Styles = StyleSheet.create({
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
        marginLeft: 20,
        marginBottom: 5,
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
        height: '100%',
        marginTop: 12,
        width: '1%',
        borderRadius: 10,
        backgroundColor: '#ebeced'
    },
    dividerRowContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '92%', gap: 6, alignSelf: 'center' }
})