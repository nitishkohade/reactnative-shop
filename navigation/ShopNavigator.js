import React from 'react'
import { createStackNavigator } from "react-navigation-stack";
import Colors from '../constants/Colors'
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import ProductsOverviewScreen from "../screens/shop/ProductsOverviewScreen";
import ProductDetailScreen from "../screens/shop/ProductDetailScreen";
import CartScreen from '../screens/shop/CartScreen'
import OrdersScreen from "../screens/shop/OrdersScreen";
import { createDrawerNavigator } from "react-navigation-drawer";
import { Ionicons } from "@expo/vector-icons";
import UserProductsScreen from '../screens/user/UserProductsScreen';
import EditProductsScreen from '../screens/user/EditProductScreen';
import AuthScreen from '../screens/user/AuthScreen';


const defaultNavOptions = {
    headerStyle: {
        backgroundColor: Colors.primary
    },
    headerTitleStyle: {
        fontFamily: 'open-sans-bold'
    },
    headerBackTitleStyle: {
        fontFamily: 'open-sans'
    },
    headerTintColor: 'white'
}

const ProductsNavigator = createStackNavigator({
    ProductsOverview: ProductsOverviewScreen,
    ProductDetail: ProductDetailScreen,
    Cart: CartScreen
}, {
    navigationOptions: {
        drawerIcon: (drawerConfig) => <Ionicons 
                                            name="ios-cart" 
                                            size={23}
                                            color={drawerConfig.tintColor}
                                        />
    },
    defaultNavigationOptions: defaultNavOptions
})

const ordersNavigator = createStackNavigator({
    Orders: OrdersScreen
}, {
    navigationOptions: {
        drawerIcon: (drawerConfig) => <Ionicons 
                                            name="ios-list" 
                                            size={23}
                                            color={drawerConfig.tintColor}
                                        />
    },
    defaultNavigationOptions: defaultNavOptions
})

const adminNavigator = createStackNavigator({
    UserProducts: UserProductsScreen,
    EditProduct: EditProductsScreen
}, {
    navigationOptions: {
        drawerIcon: (drawerConfig) => <Ionicons 
                                            name="ios-create" 
                                            size={23}
                                            color={drawerConfig.tintColor}
                                        />
    },
    defaultNavigationOptions: defaultNavOptions
})

const ShopNavigator = createDrawerNavigator({
    Products: ProductsNavigator,
    Orders: ordersNavigator,
    Admin: adminNavigator
}, {
    contentOptions: {
        activeTintColor: Colors.primary
    }
})

const AuthNavigator = createStackNavigator({
    Auth: AuthScreen
}, {
    defaultNavigationOptions: defaultNavOptions
})

const MainNavigator = createSwitchNavigator({
    Auth: AuthNavigator,
    Shop: ShopNavigator
})

export default createAppContainer(MainNavigator)