import React, {useReducer, useEffect, useCallback, useState} from 'react'
import {
    ScrollView, 
    View, 
    KeyboardAvoidingView, 
    StyleSheet,
    Text,
    Button,
    ActivityIndicator,
    Alert
} from 'react-native'
import Card from '../../components/UI/Card'

import Input from '../../components/UI/input'
import Colors from '../../constants/Colors'
import { LinearGradient } from 'expo-linear-gradient'
import { useDispatch } from 'react-redux'
import { login, signup } from '../../store/actions/auth'

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

const AuthScreen = props => {

    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState()
    const dispatch = useDispatch()
    const [isSignup, setIsSignup] = useState()

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            email: '',
            password: ''
        }, 
        inputValidities: {
            email: false,
            password: false
        }, 
        formIsValid: false
    })

    const authHandler = async () => {
        setError(null)
        try{
            setIsLoading(true)
            if(isSignup) {
                await dispatch(signup(formState.inputValues.email, formState.inputValues.password))
            } else {
                await dispatch(login(formState.inputValues.email, formState.inputValues.password))
            }
            setIsLoading(false)
            props.navigation.navigate('Shop')
           
        } catch(err) {
            setIsLoading(false)
            setError(err.message)
        }
        
    }

    const inputChangeHandler = useCallback((inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
            type: FORM_INPUT_UPDATE, 
            value: inputValue,
            isValid: inputValidity,
            input: inputIdentifier
        })
    }, [dispatchFormState])


    useEffect(() => {
        if(error){
            Alert.alert("An error occurred", error, [
                {
                    text: 'Okay'
                }
            ])
        }
    }, [error])

    return (
            <KeyboardAvoidingView 
                behavior={'height'}
                keyboardVerticalOffset={30}
                style={styles.screen} >
                    <LinearGradient 
                    style={styles.gradient}
                    colors={["white", "orange"]}>
                        <Card style={styles.authContainer}>
                            <ScrollView>
                                <Input
                                    id="email"
                                    label="E-Mail"
                                    keyboardType="email-address"
                                    required
                                    email
                                    autoCapitalize="none"
                                    errorText="Please enter a valid email address"
                                    onInputChange={inputChangeHandler}
                                    initialValue=""
                                />

                                <Input
                                    id="password"
                                    label="Password"
                                    keyboardType="default"
                                    secureTextEntry
                                    required
                                    minLength={5}
                                    autoCapitalize="none"
                                    errorText="Please enter a valid password"
                                    onInputChange={inputChangeHandler}
                                    initialValue=""
                                />
                                <View style={styles.buttonContainer}>
                                    {
                                        isLoading 
                                        ?
                                        (<ActivityIndicator
                                            size="small"
                                            color={Colors.primary}
                                        />)
                                        :
                                        (<Button
                                            title={isSignup ? 'Sign Up' : 'Login'}
                                            color={Colors.primary}
                                            onPress={authHandler}
                                        />)
                                    }
                                </View>

                                <View style={styles.buttonContainer}>
                                    <Button 
                                        title={`Switch to ${isSignup ? 'Login' : 'Sign Up'}`}
                                        color={Colors.accent}
                                        onPress={() => {
                                            setIsSignup(prevState => !prevState)
                                        }}
                                    />
                                </View>
                            </ScrollView>
                        </Card>
                </LinearGradient>
            </KeyboardAvoidingView>
    )
}

AuthScreen.navigationOptions = navData => {
    return {
        headerTitle: "Authenticate"
    }
}

const styles = StyleSheet.create({
    screen: {
        flex: 1
    },
    authContainer: {
        width: '80%',
        maxWidth: 400,
        // height: '50%',
        maxHeight: 400,
        padding: 20
    },
    gradient: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonContainer: {
        marginTop: 10
    }
})

export default AuthScreen