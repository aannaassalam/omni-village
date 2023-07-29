import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {Divider} from 'react-native-paper';
// import {TextInput} from 'react-native-paper';

const InputWithoutBorder = ({
  label,
  value,
  onChangeText,
  placeholder,
  productionName,
}) => {
  return (
    <View>
      <View style={styles.textInputContainer}>
        <View style={styles.textInputInner}>
          <View style={styles.textInputAcres}>
            <View style={styles.textInput}>
              <Text style={styles.cultivationText}>{productionName}</Text>
              <TextInput
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
              />
            </View>
            <Divider horizontalInset={false} style={styles.divider} />
            <Text style={styles.acresText}>acres</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default InputWithoutBorder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width: '95%',
  },
  textInputContainer: {
    paddingTop: 5,
    marginTop: 10,
  },
  textInputInner: {
    backgroundColor: '#fff',
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
  },
  textInput: {
    width: '70%',
    margin: -10,
    padding: 5,
  },
  textInputAcres: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  cultivationText: {
    color: 'green',
    fontSize: 14,
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
    fontSize: 14,
    color: '#000',
  },
});
