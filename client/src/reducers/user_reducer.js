import { LOGIN_USER, REGISTER_USER } from '../actions/types';

export default function ( state={}, action ) {
    switch (action.type) {
        // If the action type is LOGIN_USER
        case LOGIN_USER:
            // Then we return everything we have in state and in loginSuccess which stores true or false in payload
            // The ...state means we will get everything in the state
            return { ...state, loginSuccess: action.payload }

        case REGISTER_USER:
            return { ...state, loginSuccess: action.payload }
            
        default: 
            return state;
    }
}