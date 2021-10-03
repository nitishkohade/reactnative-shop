import { AUTHENTICATE, LOGOUT } from "../actions/auth"

const initialState = {
    token: null,
    userId: null
}


export default (state = initialState, action) => {
    switch(action.type) {
        // case LOGIN:
        // case SIGNUP:
        case AUTHENTICATE:
            return {
                token: action.token,
                userId: action.userId
            }
        case LOGOUT:
            return {
                ...state,
                token: null,
                userId: null
            }
        default: 
            return state
    }
}