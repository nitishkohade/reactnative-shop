import React from 'react'
import { StyleSheet, Text, View, FlatList, Button, Alert } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'
import ProductItem from '../../components/shop/ProductItem'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import Colors from '../../constants/Colors'
import { deleteProduct } from '../../store/actions/products'


const UserProductsScreen = (props) => {

    const userProducts = useSelector(state => state.products.userProducts)
    const dispatch = useDispatch()

    const {navigation} = props

    const editProductHandler = (id) => {
        props.navigation.navigate('EditProduct', {
            productId: id
        })
    }

    const deleteHandler = (id) => {
        Alert.alert('Are you sure?', "Do you really want to delete this item?", [
            {
                text: 'No', style: 'default'
            },
            {
                text: 'Yes', style: 'destructive', onPress: () => {
                    dispatch(
                        deleteProduct(id)
                    )
                }
            }
        ])
    }

    return (
        <FlatList 
            data={userProducts}
            keyExtractor={item => item.id}
            renderItem={(itemData) => {
                return (
                    <ProductItem 
                        {...itemData.item}
                        onSelect={() => editProductHandler(itemData.item.id)}
                    >
                            <Button color={Colors.primary} 
                                title="Edit"
                                onPress={() => editProductHandler(itemData.item.id)}
                            />
                            <Button color={Colors.primary} 
                                title="Delete" 
                                onPress={() => deleteHandler(itemData.item.id)}
                            />
                        </ProductItem>
                )
            }}
        />
    )
}

UserProductsScreen.navigationOptions = navData => ({
    headerTitle: "My Products",
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
    },
    headerRight: () => {
        return (
            <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                <Item 
                    title='Add' 
                    iconName={'ios-create'}
                    onPress={() => {
                        navData.navigation.navigate('EditProduct')
                    }}
                />
            </HeaderButtons>
        )
    }
})

const styles = StyleSheet.create({

})


export default UserProductsScreen