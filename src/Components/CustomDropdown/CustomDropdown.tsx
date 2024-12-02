import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import { primaryColor} from '../../styles/colors';
import {fontFamilyMedium, fontFamilyRegular} from '../../styles/fontStyle';
import {useTranslation} from 'react-i18next';
import { Styles } from '../../styles/globalStyles.jsx';

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
  search = false,
  sideDrop = false,
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
  placeholder?: any;
  sideDrop?: boolean;
}) => {
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  const {t} = useTranslation();
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
        renderRightIcon={() =>
          sideDrop ? (
            <Image
              source={require('../../../assets/downArrow.png')}
              style={{height: 12, width: 12, alignSelf:'center'}}
            />
          ) : (
            <Image
              source={require('../../../assets/arrowDown.png')}
              style={{height: 30, width: 30}}
            />
          )
        }
        itemTextStyle={{color: '#000'}}
        data={data}
        renderInputSearch={renderInputSearch}
        search={search}
        iconColor={primaryColor}
        renderItem={renderItem}
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeholder ? placeholder : t('choose')}
        searchPlaceholder="Search..."
        value={value}
        onChange={item => onChange(item)}
        keyboardAvoiding
      />
    </View>
  );
};

export default React.memo(Customdropdown);
const width = Dimensions.get('window').width;
const makeStyles = (fontScale: any) =>
  StyleSheet.create({
    dropdown: {
      height: 50,
      borderColor: primaryColor,
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
