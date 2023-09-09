import React, { useState } from 'react';
import { View, Button, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import CountryPicker, {
    Country,
    CountryCode,
} from 'react-native-country-picker-modal';

const CustomCountryPicker = () => {
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [countryModal, setCountryModal] = useState(false);

    const onSelectCountry = (country) => {
        setSelectedCountry(country);
    };

    return (
        <View>
            <CountryPicker
                withCurrency
                onClose={()=>{
                    setCountryModal(false)
                }}
                modalProps={{
                    visible: countryModal
                }}
                flatListProps={{
                    renderItem: ({ item }) => {
                        return (
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                padding:10
                            }} 
                            onPress={()=>{
                                onSelectCountry(item)
                                setCountryModal(false)
                            }}
                            >
                                <Image
                                    source={{ uri: item?.flag }}
                                    resizeMode='contain'
                                    style={{
                                        width: 30,
                                        height: 35,
                                        marginRight:10
                                    }}
                                />
                                <Text style={style.text}>{' '}+{item?.callingCode}</Text>
                                <Text style={style.text}>{' '}{item?.name}</Text>
                                <Text style={style.text}>{' '}({item.currency[0]})</Text>
                            </TouchableOpacity>
                        )
                    }
                }}
                countryCodes={['IN', 'BT', 'MY']}
                onSelect={onSelectCountry}
                withCallingCode
                withEmoji={false}
                withFilter
            />
            <Button
                title="Selected Country"
                onPress={() =>setCountryModal(true)}
            />
        </View>
    );
};

const style = StyleSheet.create({
    text: {
        color: '#000',
        marginHorizontal:2,
        fontSize:16
    }
})
export default CustomCountryPicker;
