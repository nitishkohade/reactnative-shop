import AsyncStorage from '@react-native-async-storage/async-storage';
export const SIGNUP = 'SIGNUP'
export const LOGIN = 'LOGIN'
export const AUTHENTICATE = 'AUTHENTICATE'


const APIKEY = "AIzaSyDyAhb1OrVN7QAgFPk2bFCk059sZtXdN5g"

export const authenticate = (userId, token) => {
    return {
        type: AUTHENTICATE, 
        token,
        userId
    }
}

export const signup = (email, password) => {
    return async dispatch => {
        let api_key = "AIzaSyDyAhb1OrVN7QAgFPk2bFCk059sZtXdN5g"

        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKEY}`

        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true
                })
            })

            
            if(!response.ok) {
                const errorResData = await response.json()
                const errorId = errorResData.error.message;
                console.log(errorId)
                let message = 'Something went wrong!'
                if(errorId === 'EMAIL_EXISTS') {
                    message = 'This email exists already!'
                }
                throw new Error(message)
             }

             const {idToken, displayName, expiresIn, refreshToken, localId} = await response.json();

            dispatch(authenticate(localId, idToken))
            const expirationDate = new Date(new Date().getTime() + +expiresIn*1000)
            saveDataToStorage(idToken, localId, expirationDate.toISOString())
        } catch(err) {
            throw err
        }
    }
}


export const login = (email, password) => {
    return async dispatch => {

        let url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKEY}`

        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email,
                    password,
                    returnSecureToken: true
                })
            })

            if(!response.ok) {
               const errorResData = await response.json()
               const errorId = errorResData.error.message;
               console.log(errorId)
               let message = 'Something went wrong!'
               if(errorId === 'EMAIL_NOT_FOUND') {
                   message = 'This email could not be found!'
               } else if (errorId === 'INVALID_PASSWORD') {
                    message = 'This password is not valid'
               }
               throw new Error(message)
            }

            const {idToken, displayName, expiresIn, refreshToken, localId} = await response.json();

            dispatch(authenticate(localId, idToken))
            const expirationDate = new Date(new Date().getTime() + +expiresIn*1000)
            saveDataToStorage(idToken, localId, expirationDate.toISOString())
        } catch(err) {
            throw err
        }
    }
}

const saveDataToStorage = (token, userId, expirationDate) => {
    AsyncStorage.setItem('userData', 
    JSON.stringify({
        token, userId, expirationDate
    }))
}