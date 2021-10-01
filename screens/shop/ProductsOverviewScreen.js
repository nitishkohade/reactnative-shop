import React, {useCallback, useEffect, useState} from 'react'
import { FlatList, Text, Button, StyleSheet, View, ActivityIndicator } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import ProductItem from '../../components/shop/ProductItem'
import * as cartActions from '../../store/actions/cart'
import Toast from 'react-native-toast-message';
import CustomHeaderButton from '../../components/UI/HeaderButton'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import Colors from '../../constants/Colors'
import { fetchProducts } from '../../store/actions/products'

const ProductsOverviewScreen = props => {

    const products = useSelector(state => state.products.availableProducts)
    const [error, setError] = useState()
    const [isLoading, setIsLoading] = useState(false)
    const [isRefreshing, setIsRefreshing] = useState(false)

    const dispatch = useDispatch()

    const loadProducts = useCallback(async() => {
        setError(null)
        setIsRefreshing(true)
        try{
            await dispatch(fetchProducts())
        } catch(err) {
            setError(err.message)
        }
        setIsRefreshing(false)
    }, [])

    // setError, setIsLoading, dispatch will never change so no need to add this to the 
    // array

    useEffect(() => {
        setIsLoading(true)
        loadProducts().then(() => {
            setIsLoading(false)
        })
    }, [loadProducts])

    useEffect(() => {
        const willFocusSub = props.navigation.addListener('willFocus', () => {
            loadProducts()
        })
        return () => {
            willFocusSub.remove()
        }
    }, [loadProducts])

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

    if(error) {
        return (<View style={styles.centered}>
            <Text>{error}</Text>
            <Button title="Try again" color={Colors.primary} onPress={() => {
                loadProducts()
            }} />  
        </View>)
    }

    if(isLoading) {
        return <View style={styles.centered}>
            <ActivityIndicator size='large' 
                color={Colors.primary}
            />
            </View>
    }

    if(!isLoading && products.length === 0) {
        return (<View style={styles.centered}>
            <Text>No products found. Maybe start adding some!</Text>    
        </View>)
    }

    return (
        <FlatList
            onRefresh={loadProducts}
            refreshing={isRefreshing}
            keyExtractor={item => item.id}
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

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default ProductsOverviewScreen