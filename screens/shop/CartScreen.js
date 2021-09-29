import React from 'react'
import { View, Text, FlatList, Button, StyleSheet } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import CartItem from '../../components/shop/CartItem'
import Card from '../../components/UI/Card'
import Colors from '../../constants/Colors'
import { removeFromCart } from '../../store/actions/cart'
import { addOrder } from '../../store/actions/order'

const CartScreen = () => {

    const cartTotalAmount = useSelector(state => state.cart.totalAmount)
    const cartItems = useSelector(state => {
        const transformedCartItems = [];
        for(const key in state.cart.items) {
            transformedCartItems.push({
                id: key,
                title: state.cart.items[key].productTitle,
                price: state.cart.items[key].productPrice,
                quantity: state.cart.items[key].quantity,
                sum: state.cart.items[key].sum
            })
        }
        return transformedCartItems.sort((a, b) => a.id > b.id ? 1 : -1)
    })

    const dispatch = useDispatch()

    return (
        <View style={styles.screen}>
            <Card style={styles.summary}>
                <Text style={styles.summaryText}>
                    Total: <Text style={styles.amount}>${Math.round(cartTotalAmount.toFixed(2)*100)/100}</Text>
                </Text>
                <Button 
                    color={Colors.accent} 
                    title="Order Now"
                    disabled={cartItems.length === 0}
                    onPress={
                        () => {
                            dispatch(addOrder(cartItems, cartTotalAmount))
                        }
                    }
                />
            </Card>
            <FlatList 
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={(itemData) => {
                    return (
                        <CartItem 
                            {...itemData.item}
                            onRemove={() => {
                                dispatch(removeFromCart(itemData.item.id))
                            }}
                            deletable={true}
                        />
                    )
                }}
            />
        </View>

    )
}

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    summary: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        padding: 10
    },
    summaryText: {
        fontFamily: 'open-sans-bold',
        fontSize: 18
    },
    amount: {
        color: Colors.primary
    }
})

CartScreen.navigationOptions = {
    headerTitle: "Your Cart"
}

export default CartScreen