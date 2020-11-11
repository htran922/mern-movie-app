/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import { Menu } from 'antd';
import axios from 'axios';
import { USER_SERVER } from '../../../Config';
// Get access to this.props.history
// https://stackoverflow.com/questions/53539314/what-is-withrouter-for-in-react-router-dom
import { withRouter } from 'react-router-dom';
// Part of React Hooks API is alternative to using connect(), allows you to subscribe to
// Redux store and dispatch actions without having to wrap components in connect()
// useSelector() is approx. equivalent to the mapStateToProps argument to connect() conceptually
import { useSelector } from 'react-redux';

function RightMenu(props) {
    const user = useSelector(state => state.user) 

    // Routes user back to login page when they click logout
    const logoutHandler = () => {
        axios.get(`${USER_SERVER}/logout`)
            .then(response => {
                if (response.status === 200) {
                    props.history.push("/login");
                } else {
                    alert("Failed to logout")
                }
            });
    };

    // If userData is valid and user is authorized
    if (user.userData && !user.userData.isAuth) {
        return (
            <Menu mode={props.mode}>
                <Menu.Item key="mail">
                    <a href="/login">Login</a>
                </Menu.Item>
                <Menu.Item key="app">
                    <a href="/register">Sign Up</a>
                </Menu.Item>
            </Menu>
        )
    } else {
        return (
            <Menu mode={props.mode}>
                <Menu.Item key="logout">
                    <a onClick={logoutHandler}>Logout</a>
                </Menu.Item>
            </Menu>
        )
    }
}

export default withRouter(RightMenu);