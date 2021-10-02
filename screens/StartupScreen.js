import React, {useEffect} from 'react'
import {
    View,
    ActivityIndicator,
    StyleSheet
} from 'react-native'

import AsyncStorage from '@react-native-async-storage/async-storage';

import Colors from '../constants/Colors'
import { useDispatch } from 'react-redux';
import { authenticate } from '../store/actions/auth';

const StartupScreen = props => {

    const dispatch = useDispatch()

    useEffect(() => {
        const tryLogin = async () => {
            const userData = await AsyncStorage.getItem("userData")
            if(!userData) {
                props.navigation.navigate('Auth')
                return
            }

            const transformedData = JSON.parse(userData)
            const {token, userId, expirationDate} = transformedData
            console.log(token, userId, expirationDate)

            const date = new Date(expirationDate)

            if(date <= new Date() || !token || !userId) {
                props.navigation.navigate('Auth')
                return
            }

            props.navigation.navigate('Shop')
            dispatch(authenticate(userId, token))
        }
        tryLogin()

    }, [])

    return (
        <View style={styles.screen}>
            <ActivityIndicator 
                size="large"
                color={Colors.primary}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default StartupScreen
