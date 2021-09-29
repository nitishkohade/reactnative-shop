import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux';
import productsReducer from './store/reducers/products';
import ShopNavigator from './navigation/ShopNavigator'
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font'
// import {composeWithDevTools} from 'redux-devtools-extension'
import cartReducer from './store/reducers/cart'
import Toast from 'react-native-toast-message';
import orderReducer from './store/reducers/order'

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: orderReducer
})

const store = createStore(rootReducer)

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  })
}

export default function App() {

  const [fontLoaded, setFontLoaded] = useState(false)

  if(!fontLoaded) {
    return (
    <AppLoading 
        startAsync={fetchFonts}
        onFinish={() => setFontLoaded(true)}
        onError={() => {}}
      />
    )
  }

  return (
      <Provider store={store}>
        <ShopNavigator />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </Provider>
  );
}

const styles = StyleSheet.create({
  
});
