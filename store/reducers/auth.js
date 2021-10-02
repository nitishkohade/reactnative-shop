import { AUTHENTICATE } from "../actions/auth"

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
        default: 
            return state
    }
}