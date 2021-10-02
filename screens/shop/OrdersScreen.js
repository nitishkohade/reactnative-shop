import React, {useEffect, useState} from 'react'
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'
import OrderItem from '../../components/shop/OrderItem'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import Colors from '../../constants/Colors'
import { fetchOrders } from '../../store/actions/order'

const OrdersScreen = props => {

    const [isLoading, setIsLoading] = useState(false)
    const orders = useSelector(state => state.orders.orders)
    const dispatch = useDispatch()
    
    // if(!isLoading && orders.length === 0) {
    //     return (
    //         <View style={styles.emptyOrder}>
    //             <Text>Your Order is Empty.</Text>
    //         </View>
    //     )
    // }

    const OnFetchOrders = async () => {
        setIsLoading(true)
        await dispatch(fetchOrders())
        setIsLoading(false)
    }

    useEffect(() => {
        OnFetchOrders()
    }, [])

    if(isLoading) {
        return (
        <View style={styles.centered}>
            <ActivityIndicator size='large' color={Colors.primary} />
        </View>
        )
    }

    if(orders.length === 0 ) {
        return (
            <View style={styles.centered}>
                <Text>No orders Found</Text>
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
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default OrdersScreen