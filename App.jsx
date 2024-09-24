import {SafeAreaView, useColorScheme, useWindowDimensions } from 'react-native';
import React from 'react';
import Config from './src/Config';
import { Provider } from 'react-redux';
import store from './src/redux/store';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const { width, height } = useWindowDimensions();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    width: width,
    height: height,
  };
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnMount: true,
      },
    },
  });
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={backgroundStyle}>
        <Provider store={store}>
          <Config />
        </Provider>
      </SafeAreaView>
    </QueryClientProvider>
  );
};

export default App;
