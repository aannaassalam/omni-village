import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {borderColor, dark_grey, light_grey, primary} from '../../styles/colors';
import { fontFamilyMedium, fontFamilyRegular} from '../../styles/fontStyle';
import {Styles} from '../../styles/globalStyles'

const Customdropdown = ({
  data,
  value, // Add type annotation here
  onChange,
  style,
  placeholderStyle,
  selectedTextStyle,
  inputSearchStyle,
  iconStyle,
  renderInputSearch,
  containerStyle,
  renderItem,
  label,
  noLabel,
  placeholder,
  search = true,
}: {
  data: any;
  value: any; // Add type annotation here
  onChange: (item: any) => void;
  style?: any;
  placeholderStyle?: any;
  selectedTextStyle?: any;
  inputSearchStyle?: any;
  iconStyle?: any;
  renderInputSearch?: any;
  containerStyle?: any;
  renderItem?: any;
  label?: any;
  noLabel?: any;
  search?: boolean;
  placeholder?: any
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const customRenderItem = (item: any) => {
    return (
      <View style={[styles.item]}>
        <Text style={[styles.selectedTextStyle]}>{item.label}</Text>
      </View>
    );
  };
  return (
    <View>
      {!noLabel && <Text style={[Styles.fieldLabel]}>{label}</Text>}
      <Dropdown
        style={[styles.dropdown, style]}
        containerStyle={[styles.containerStyle, containerStyle]}
        placeholderStyle={[styles.placeholderStyle, placeholderStyle]}
        selectedTextStyle={[styles.selectedTextStyle, selectedTextStyle]}
        inputSearchStyle={[styles.inputSearchStyle, inputSearchStyle]}
        iconStyle={[styles.iconStyle, iconStyle]}
        fontFamily={fontFamilyMedium}
        itemTextStyle={{color: '#000'}}
        data={data}
        renderInputSearch={renderInputSearch}
        search={search}
        iconColor={primary}
        renderItem={renderItem}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder ? placeholder : 'Choose'}
        searchPlaceholder="Search..."
        value={value}
        onChange={item => onChange(item)}
        keyboardAvoiding
      />
    </View>
  );
};

export default Customdropdown;
const width = Dimensions.get('window').width;
const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    dropdown: {
      height: 50,
      borderColor: primary,
      borderWidth: 1,
      backgroundColor: '#fff',
      paddingHorizontal: 15,
      color: '#000',
      fontSize: 16 / fontScale,
      marginTop: 5,
      fontFamily: fontFamilyRegular,
      borderRadius: 8,
    },
    placeholderStyle: {
      fontSize: 16 / fontScale,
      color: '#c4c4c4',
      fontFamily: fontFamilyRegular,
    },
    selectedTextStyle: {
      fontSize: 16 / fontScale,
      color: '#000',
      fontFamily: fontFamilyRegular,
      textAlign: 'left',
    },
    inputSearchStyle: {
      color: '#000',
      alignItems: 'center',
      alignSelf: 'center',
      justifyContent: 'center',
      alignContent: 'center',
      paddingHorizontal: 5,
      paddingTop: 6,
      height: 50,
    },
    containerStyle: {
      backgroundColor: '#fff',
      borderRadius: 5,
      marginTop: 5,
    },
    iconStyle: {},
    item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 12,
      width: 'auto',
      alignSelf: 'flex-start',
    },
  });
