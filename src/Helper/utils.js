import {useWindowDimensions} from 'react-native';

export const Scale = fontSize => {
  const {fontScale} = useWindowDimensions();
  return fontSize / fontScale;
};
