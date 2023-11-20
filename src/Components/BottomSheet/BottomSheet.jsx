import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  ScrollView,
} from 'react-native';

const AddBottomSheet = ({modalVisible, bottomSheetRef, children, setModal}) => {
  // Creates a reference to the DOM element that we can interact with

  // Setting the points to which we want the bottom sheet to be set to
  // Using '-30' here so that it is not seen when it is not presented
  const snapPoints = React.useMemo(() => ['35%', '50%'], []);

  // Callback function that gets called when the bottom sheet changes
  const handleSheetChanges = React.useCallback(index => {
    // console.log("handleSheetChanges", index);
  }, []);
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={modalVisible ? 0 : -1} // Hide the bottom sheet when we first load our component
      snapPoints={snapPoints}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
      enablePanDownToClose
      onClose={() => setModal(false)}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          opacity={0.5}
          pressBehavior={'collapse'}
          enableTouchThrough={false}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          // style={[{ backgroundColor: 'rgba(0, 0, 0, 1)' }, StyleSheet.absoluteFillObject]}
        />
      )}
      style={{
        elevation: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 3},
        shadowOpacity: 0.3,
        shadowRadius: 3,
      }}
      onChange={handleSheetChanges}>
      <View style={{justifyContent: 'center'}}>{children}</View>
    </BottomSheet>
  );
};

export default AddBottomSheet;

const makeStyles = fontScale =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 24,
      backgroundColor: 'grey',
    },
    contentContainer: {
      flex: 1,
      paddingLeft: 50,
    },
    bottomSheetTitle: {
      fontSize: 24,
      fontWeight: '500',
    },
  });
