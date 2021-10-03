import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux';
import productsReducer from './store/reducers/products';
import NavigationContainer from './navigation/NavigationContainer'
import AppLoading from 'expo-app-loading'
import * as Font from 'expo-font'
import ReduxThunk from 'redux-thunk'
// import {composeWithDevTools} from 'redux-devtools-extension'
import cartReducer from './store/reducers/cart'
import Toast from 'react-native-toast-message';
import orderReducer from './store/reducers/order'
import AuthReducer from './store/reducers/auth'

const rootReducer = combineReducers({
  products: productsReducer,
  cart: cartReducer,
  orders: orderReducer,
  auth: AuthReducer
})

const store = createStore(rootReducer, applyMiddleware(ReduxThunk))

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
        <NavigationContainer />
        <Toast ref={(ref) => Toast.setRef(ref)} />
      </Provider>
  );
}
