// App.js
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppNavigation from './src/navigation/Navigation';
//import Home from 'src/screens/Home/Home'
function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppNavigation />
    </GestureHandlerRootView>
      

  );
}

export default App;
