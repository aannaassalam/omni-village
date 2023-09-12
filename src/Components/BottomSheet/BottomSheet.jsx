import BottomSheet, {BottomSheetBackdrop} from '@gorhom/bottom-sheet';
import * as React from 'react';
import {
  StyleSheet,
  View,
  Text,
  useWindowDimensions,
  ScrollView,
} from 'react-native';

const AddBottomSheet = ({children}) => {
  // Creates a reference to the DOM element that we can interact with
  const bottomSheetRef = React.useRef(null);

  // Setting the points to which we want the bottom sheet to be set to
  // Using '-30' here so that it is not seen when it is not presented
  const snapPoints = React.useMemo(() => ['35%', '90%'], []);

  // Callback function that gets called when the bottom sheet changes
  const handleSheetChanges = React.useCallback(index => {
    // console.log("handleSheetChanges", index);
  }, []);
  const {fontScale} = useWindowDimensions();
  const styles = makeStyles(fontScale);
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0} // Hide the bottom sheet when we first load our component
      snapPoints={snapPoints}
      keyboardBehavior="interactive"
      keyboardBlurBehavior="restore"
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
      style={{elevation: 10, borderRadius: 10}}
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
