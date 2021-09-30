import React, {useEffect, useState, useReducer, useCallback} from 'react'
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import Input from '../../components/UI/input'
import { createProduct, updateProduct } from '../../store/actions/products'

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE'

const formReducer = (state, action) => {
    if(action.type === FORM_INPUT_UPDATE) {
        const updatedValues = {
            ...state.inputValues,
            [action.input]: action.value
        }
        const updatedValidities = {
            ...state.inputValidities,
            [action.input]: action.isValid
        }
        let updatedFormIsValid = true
        for(const key in updatedValidities) {
            updatedFormIsValid = updatedFormIsValid && updatedValidities[key]
        }
        return {
            formIsValid: updatedFormIsValid,
            inputValues: updatedValues,
            inputValidities: updatedValidities
        }
    }
    return state
}


const EditProductsScreen = (props) => {

    const productId = props.navigation.getParam('productId')

    const dispatch = useDispatch()

    const userProduct = useSelector(state => state.products.userProducts.find(
        prod => prod.id === productId
    ))

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: userProduct ? userProduct.title : '',
            imageUrl: userProduct ? userProduct.imageUrl : '',
            description: userProduct ? userProduct.description : '',
            price: ''
        }, 
        inputValidities: {
            title: userProduct ? true : false,
            imageUrl: userProduct ? true : false,
            description: userProduct ? true : false,
            price: userProduct ? true : false
        }, 
        formIsValid: userProduct ? true : false
    })

    const submitHandler = () => {
        if(!formState.formIsValid) {
            Alert.alert("Wrong input!", "Please check the errors in the form", [
                {
                    text: 'Okay'
                }
            ])
            return 
        }
        const {title, description, imageUrl, price} = formState.inputValues
        if(userProduct) {
            dispatch(updateProduct(productId, title, description, imageUrl))
        } else {
            dispatch(createProduct(title, description, imageUrl, +price))
        }
        props.navigation.goBack()
    }

    useEffect(() => {
        props.navigation.setParams({
            submitHandler
        })
    }, [formState])

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState])

    return (
        <KeyboardAvoidingView 
            style={{flex:1}}
            behavior={"padding"} 
            keyboardVerticalOffset={70}>
            <ScrollView>
                <View style={styles.form}>
                    <Input 
                        id="title"
                        label="Title"
                        errorText="Please enter a valid title"
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={userProduct ? userProduct.title : ''}
                        initiallyValid={!!userProduct}
                        required
                    />
                    <Input 
                        id="imageUrl"
                        label="Image Url"
                        errorText="Please enter a valid Image Url"
                        keyboardType='default'
                        returnKeyType='next'
                        onInputChange={inputChangeHandler}
                        initialValue={userProduct ? userProduct.imageUrl : ''}
                        initiallyValid={!!userProduct}
                        required
                    />
                    { userProduct ? null :  
                    <Input 
                        id="price"
                        label="Price"
                        errorText="Please enter a valid price"
                        keyboardType='decimal-pad'
                        returnKeyType='next'
                        required
                        min={1}
                        onInputChange={inputChangeHandler}
                    />
                    }
                    <Input 
                        id="description"
                        label="Description"
                        errorText="Please enter a valid description"
                        keyboardType='default'
                        autoCapitalize='sentences'
                        autoCorrect
                        multiline
                        numberOflines={3}
                        onInputChange={inputChangeHandler}
                        initialValue={userProduct ? userProduct.description : ''}
                        initiallyValid={!!userProduct}
                        required
                        minLength={5}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
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
    }
})


export default EditProductsScreen