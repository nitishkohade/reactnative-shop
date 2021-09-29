import React, {useCallback, useEffect, useState} from 'react'
import { Alert, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import { createProduct, updateProduct } from '../../store/actions/products'


const EditProductsScreen = (props) => {

    const productId = props.navigation.getParam('productId')

    const dispatch = useDispatch()

    const userProduct = useSelector(state => state.products.userProducts.find(
        prod => prod.id === productId
    ))

    const {title, imageUrl, price, description} = userProduct || {}

    const [titleValue, setTitleValue] = useState(title)
    const [imageUrlValue, setImageUrlValue] = useState(imageUrl)
    const [priceValue, setPriceValue] = useState("")
    const [descriptionValue, setDescriptionValue] = useState(description)
    
    const submitHandler = () => {
        if(userProduct) {
            dispatch(updateProduct(productId, titleValue, descriptionValue, imageUrlValue))
        } else {
            dispatch(createProduct(titleValue, descriptionValue, imageUrlValue, +priceValue))
        }
        props.navigation.goBack()
    }

    useEffect(() => {
        props.navigation.setParams({
            submitHandler
        })
    }, [titleValue, descriptionValue, imageUrlValue, priceValue])

    return (
        <ScrollView>
            <View style={styles.form}>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Title</Text>
                    <TextInput style={styles.input} 
                        value={titleValue}
                        onChangeText={text => setTitleValue(text)}
                     />
                </View>
                <View style={styles.formControl}>
                    <Text style={styles.label}>Image URL</Text>
                    <TextInput style={styles.input} 
                        value={imageUrlValue} 
                        onChangeText={text => setImageUrlValue(text)}
                    />
                </View>
                { !price &&  
                <View style={styles.formControl}>
                    <Text style={styles.label}>Price</Text>
                    <TextInput style={styles.input} 
                        value={priceValue} 
                        onChangeText={text => setPriceValue(text)}
                    />
                </View>
                }
                <View style={styles.formControl}>
                    <Text style={styles.label}>Description</Text>
                    <TextInput style={styles.input} 
                        value={descriptionValue} 
                        onChangeText={text => setDescriptionValue(text)}
                    />
                </View>
            </View>
        </ScrollView>
    )
}

EditProductsScreen.navigationOptions = navData => {

    const headerTitle = navData.navigation.getParam("productId") ? "Edit Product" : "Add Product"

    return {
        headerTitle,
        headerRight: () => {
            return (
                <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                    <Item 
                        title='Save' 
                        iconName={'ios-checkmark'}
                        onPress={() => {
                            const submit = navData.navigation.getParam("submitHandler")
                            submit()
                        }}
                    />
                </HeaderButtons>
            )
        }
    }
    
}

const styles = StyleSheet.create({
    form: {
        margin: 20
    },
    formControl: {
        width: '100%'
    },
    label: {
        fontFamily: "open-sans-bold",
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: '#ccc',
        borderBottomWidth: 1
    }
})


export default EditProductsScreen