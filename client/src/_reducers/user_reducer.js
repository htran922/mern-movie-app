import {
    LOGIN_USER, 
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER 
} from '../_actions/types';

export default function ( state={}, action ) {
    switch (action.type) {
    
        case REGISTER_USER:
            return { ...state, registerSuccess: action.payload }
        
        // If the action type is LOGIN_USER
        case LOGIN_USER:
            // Then we return everything we have in state and in loginSuccess which stores true or false in payload
            // The ...state means we will get everything in the state
            return { ...state, loginSuccess: action.payload }

        case AUTH_USER:
            return { ...state, userData: action.payload }

        case LOGOUT_USER:
            return { ...state }
            
        default: 
            return state;
    }
}