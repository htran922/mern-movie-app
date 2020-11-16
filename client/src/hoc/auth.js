// Using higher order components for authenticated routing
// HOC is just a react component that wraps another one
import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import { useSelector, useDispatch } from 'react-redux';

export default function (SpecificComponent, option, adminRoute=null) {
    function AuthenticationCheck(props) {
        let user = useSelector(state => state.user);
        const dispatch = useDispatch();

        useEffect(() => {
            // To know current status, send auth request
            dispatch(auth())
                .then(response => {
                    // Not logged in 
                    if (!response.payload.isAuth) {
                        if (option) {
                            props.history.push('/login')
                        }
                    }
                    // Logged in
                    else {
                        // Is admin page but non-admin wants to enter
                        if (adminRoute && !response.payload.isAdmin) {
                            props.history.push('/')
                        }
                        // User is logged in but tries to go into log in page
                        else {
                            if (option === false) {
                                props.history.push('/')
                            }
                        }
                    }
                })
        }, [])

        return (
            <SpecificComponent {...props} user={user} />
        )
    }
    return AuthenticationCheck
}