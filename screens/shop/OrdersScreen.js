import React from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector } from 'react-redux'
import OrderItem from '../../components/shop/OrderItem'
import CustomHeaderButton from '../../components/UI/HeaderButton'

const OrdersScreen = props => {
    const orders = useSelector(state => state.orders.orders)
    
    if(orders.length === 0) {
        return (
            <View style={styles.emptyOrder}>
                <Text>Your Order is Empty.</Text>
            </View>
        )
    }

    return (
        <FlatList
            data={orders}
            keyExtractor={(item) => item.id}
            renderItem={itemData => {
                return (
                    <OrderItem
                        {...itemData.item}
                        readableDate={itemData.item.readableDate}
                    />
                )
            }}

        />
    )
}

OrdersScreen.navigationOptions = (navData) => ({
    headerTitle: "Your Orders",
    headerLeft: () => {
        return (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item 
                    title='Menu' 
                    iconName={'ios-menu'}
                    onPress={() => {
                        navData.navigation.toggleDrawer()
                    }}
                />
            </HeaderButtons>
        )
    }
})

const styles = StyleSheet.create({
    emptyOrder: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default OrdersScreen