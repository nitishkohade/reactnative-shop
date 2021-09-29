import React from 'react'
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const CartItem = props => {

    const {quantity, title, price, onRemove, deletable} = props

    return (
        <View style={styles.cartItem}>
            <Text style={styles.itemData}>
                <Text style={styles.quantity}>{quantity}</Text>{' '}
                <Text style={styles.mainText}>{title}</Text>
            </Text>
            <View style={styles.itemData}>
                <Text style={styles.mainText}>${price}</Text>
                {
                deletable && 
                <TouchableOpacity onPress={onRemove} style={styles.deleteButton}>
                    <Ionicons  
                        name="md-trash"
                        size={23}
                        color="red"
                    />
                </TouchableOpacity>
                }
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    cartItem: {
        padding: 10,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20
    },
    itemData: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    quantity: {
        fontFamily: 'open-sans',
        color: '#888',
        fontSize: 16
    },
    mainText: {
        fontFamily: 'open-sans-bold',
        fontSize: 16
    },
    deleteButton: {
        marginLeft: 20
    }
})


export default CartItem