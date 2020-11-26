// Using higher order components for authenticated routing
// HOC is just a react component that wraps another one
import React, { useEffect } from 'react';
import { auth } from '../_actions/user_actions';
import { useSelector, useDispatch } from 'react-redux';

export default function (ComposedClass, reload, adminRoute=null) {
    function AuthenticationCheck(props) {
        let user = useSelector(state => state.user);
        const dispatch = useDispatch();
    
        // The Effect Hook lets you perform side effects in function components
        // Think of the useEffect Hook as componentDidMount, componentDidUpdate
        // and componentWillUnmount combined
        useEffect(() => {
            // To know current status, send auth request
            dispatch(auth()).then (response => {
                // Not logged in
                if (!response.payload.isAuth) {
                    if (reload) {
                        props.history.push('/login')
                    }
                } 
                // Logged in
                else {
                    if (adminRoute && !response.payload.isAdmin) {
                        props.history.push('/')
                    }
                    // User is logged in but tries to go into log in page
                    else {
                        if (reload === false) {
                            props.history.push('/')
                        }
                    }
                }
            })
        }, [dispatch, props.history, user.googleAuth])

        return (
            <ComposedClass {...props} user={user} />
        )
    }
    return AuthenticationCheck
}