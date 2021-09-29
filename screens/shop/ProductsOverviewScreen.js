import React, {useEffect} from 'react'
import { FlatList, Text, Button, StyleSheet, View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ProductItem from '../../components/shop/ProductItem'
import * as cartActions from '../../store/actions/cart'
import Toast from 'react-native-toast-message';
import CustomHeaderButton from '../../components/UI/HeaderButton'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import Colors from '../../constants/Colors'


const ProductsOverviewScreen = props => {

    const products = useSelector(state => state.products.availableProducts)

    const dispatch = useDispatch()

    const selectItemHandler = (id, title) => {
        props
        .navigation
        .navigate('ProductDetail', {
            productId: id,
            productTitle: title
        })
    }

    const onAddToCart = (item) => {
        dispatch(
            cartActions.addToCart(item)
        )
        Toast.show({
            type: 'success',
            text2: 'Added',
            visibilityTime: 1000
          });
    }

    return (
        <FlatList
            data={products}
            renderItem={
                itemData => {
                    return (
                        <ProductItem  
                            {...itemData.item}
                            onSelect={() => selectItemHandler(itemData.item.id, itemData.item.title)}
                        >
                                <Button
                                    color={Colors.primary} 
                                    title="View Details" 
                                    onPress={() => selectItemHandler(itemData.item.id, itemData.item.title)}
                                />
                                <Button color={Colors.primary} 
                                    title="To Cart" 
                                    onPress={() => onAddToCart(itemData.item)} 
                                />
                        </ProductItem>
                    )
                }
            }
        />
    )
}

ProductsOverviewScreen.navigationOptions = navData => {

    const {navigation} = navData

    return {
        headerTitle: 'Products',
        headerRight: () => {
            return (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item 
                        title='Cart' 
                        iconName={'ios-cart'}
                        onPress={() => {
                            navigation.navigate('Cart')
                        }}
                    />
                </HeaderButtons>
            )
        },
        headerLeft: () => {
            return (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item 
                        title='Menu' 
                        iconName={'ios-menu'}
                        onPress={() => {
                            navigation.toggleDrawer()
                        }}
                    />
                </HeaderButtons>
            )
        }
    }
}

export default ProductsOverviewScreen