// useState is a Hook, it returns a pair: the current state value and function
// that lets you update it
import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { loginUser } from "../../../_actions/user_actions";
import { Formik } from 'formik';
import * as Yup from 'yup'; // Object Schema validation
import { Form, Input, Button, Checkbox, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
// useDispatch() is a hook that returns a reference to the dispatch function 
// from the Redux store
import { useDispatch } from 'react-redux'; 

const { Title } = Typography;

function LoginPage(props) {
    const dispatch = useDispatch();
    const rememberMeChecked = window.localStorage.getItem("rememberMe") ? true : false;

    const [formErrorMessage, setFormErrorMessage] = useState('');
    const [rememberMe, setRememberMe] = useState(rememberMeChecked);

    const handleRememberMe = () => {
        setRememberMe(!rememberMe)
    }

    const initialEmail = localStorage.getItem("rememberMe") ? localStorage.getItem("rememberMe") : '';

    return (
        // Formik helps getting values in and out of form state, handling validation and error messages,
        // and handling form submission
        <Formik     
            initialValues={{
                email: initialEmail,
                password: '',
            }}
            validationSchema={Yup.object().shape({
                email: Yup.string()
                    .email('Email is invalid')
                    .required('Email is required'),
                password: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .required('Password is required'),
            })}
            onSubmit={(values, { setSubmitting }) => {
                setTimeout(() => {
                    let dataToSubmit = {
                        email: values.email,
                        password: values.password
                };
    
                dispatch(loginUser(dataToSubmit))
                    .then(response => {
                        if (response.payload.loginSuccess) {
                            localStorage.setItem('userId', response.payload.userId);
                            if (rememberMe) {
                                localStorage.setItem('rememberMe', values.email);
                            } else {
                                localStorage.removeItem('rememberMe');
                            }
                            props.history.push("/");
                        } else {
                            setFormErrorMessage('Check out your Account or Password again')
                        }
                    })
                    .catch(err => {
                        setFormErrorMessage('Check out your Account or Password again')
                        setTimeout(() => {
                            setFormErrorMessage("")
                        }, 3000);
                    });
                setSubmitting(false);
            }, 500);
            }}
        >

        {
            props => {
                const {
                    values,
                    touched, 
                    errors,
                    dirty,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    handleReset,
                } = props;

                return (
                    <div className="app">
                        <Title level={2}>Log In</Title>
                        <form onSubmit={handleSubmit} style={{ width: '350px' }}>
                            <Form.Item required>
                                <Input
                                    id="email"
                                    prefix={<UserOutlined style={{ color: 'rgba(0,0,0,.25)'}} />}
                                    placeholder="Enter email address"
                                    type="email"
                                    value={values.email} 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.email && touched.email ? 'text-input error' : 'text-input'
                                    }
                                />
                            </Form.Item>

                            <Form.Item required>
                                <Input 
                                    id="password"
                                    prefix={<LockOutlined  style={{ color: 'rgba(0,0,0,.25' }}/>}
                                    placeholder="Enter password"
                                    type="password"
                                    value={values.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.password && touched.password ? 'text-input error' : 'text-input'
                                    }
                                />
                                {errors.password && touched.password && (
                                    <div className="input-feedback">{errors.password}</div>
                                )}
                            </Form.Item>
                            {formErrorMessage && (
                                <label>
                                    <p style={{ 
                                        color: '#ff0000bf', 
                                        fontSize: '0.7rem', 
                                        border: '1px solid', 
                                        padding: '1rem', 
                                        borderRadius: '10px' 
                                    }}>
                                        {formErrorMessage}
                                    </p>
                                </label>
                            )}
                            
                            <Form.Item>
                                <Checkbox id="rememberMe" onChange={handleRememberMe} checked={rememberMe}>Remember me</Checkbox>
                                <a className="login-form-forgot" href="/reset_user" style={{ float: 'right' }}>Forgot password</a>
                                <div>
                                    <Button 
                                        type="primary"
                                        htmlType="submit"
                                        className="login-form-button"
                                        style={{ minWidth: '100%' }}
                                        disabled={isSubmitting}
                                        onSubmit={handleSubmit}
                                    >Log in</Button>
                                </div>
                                Or <a href="/register">register now!</a>
                            </Form.Item>
                        </form>
                    </div>
                )

            }
   
        }



        </Formik>
    );
}

export default withRouter(LoginPage);