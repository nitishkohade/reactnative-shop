import React, {useEffect, useState, useReducer, useCallback} from 'react'
import { 
    Alert, 
    KeyboardAvoidingView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TextInput, 
    View,
    ActivityIndicator,
    Button
} from 'react-native'
import { HeaderButtons, Item } from 'react-navigation-header-buttons'
import { useSelector, useDispatch } from 'react-redux'
import CustomHeaderButton from '../../components/UI/HeaderButton'
import Input from '../../components/UI/input'
import Colors from '../../constants/Colors'
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

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()

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

    const submitHandler = async () => {
        if(!formState.formIsValid) {
            Alert.alert("Wrong input!", "Please check the errors in the form", [
                {
                    text: 'Okay'
                }
            ])
            return 
        }
        setError(null)
        setIsLoading(true)
        const {title, description, imageUrl, price} = formState.inputValues
        try{
            if(userProduct) {
                await dispatch(updateProduct(productId, title, description, imageUrl))
            } else {
                await dispatch(createProduct(title, description, imageUrl, +price))
            }
            props.navigation.goBack()
        } catch(err) {
            setError(err.message)
        }
        
        setIsLoading(false)
        
    }

    useEffect(() => {
        props.navigation.setParams({
            submitHandler
        })
    }, [formState])

    useEffect(() => {
        if(error) {
            Alert.alert("An error occurred", error)
        }
    }, [error])

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState])

    // if(error) {
    //     return (<View style={styles.centered}>
    //         <Text>{error}</Text>
    //         <Button title="Try again" color={Colors.primary} onPress={() => {
    //             submitHandler()
    //         }} />  
    //     </View>)
    // }

    if(isLoading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        )
    }

    return (
        <KeyboardAvoidingView 
            style={{flex:1}}
            behavior={"height"} 
            keyboardVerticalOffset={30}>
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
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})


export default EditProductsScreen