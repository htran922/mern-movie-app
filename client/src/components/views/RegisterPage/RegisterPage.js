import React from 'react';
import moment from 'moment';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { registerUser } from "../../../_actions/user_actions";
import { useDispatch } from 'react-redux';

import {
    Form, Input, Button 
} from 'antd';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 8 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 }
    }
};

const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0
        },
        sm: {
            span: 16, 
            offset: 8
        }
    }
};

function RegisterPage(props) {
    // Returns a reference to the dispatch function from the Redux store. Use it to dispatch actions
    const dispatch = useDispatch();
    return (
        <Formik
            initialValues={{ 
                name: '',
                lastName: '',
                email: '',
                password: '', 
                confirmPassword: ''
            }}
            validationSchema={Yup.object().shape({
                name: Yup.string()
                    .required('Name is required'),
                lastName: Yup.string()
                    .required('Last name is required'),
                email: Yup.string()
                    .email('Email is invalid')
                    .required('Email is required'),
                password: Yup.string()
                    .min(6, 'Password must be at least 6 characters')
                    .required('Password is required'),
                confirmPassword: Yup.string()
                    .oneOf([Yup.ref('password'), null], 'Passwords do not match')
                    .required('Please re-enter password')
            })}
            onSubmit={(values, { setSubmitting }) => {
                // The setTimeout method invokes a function or runs some code after a period of time
                setTimeout(() => {
                    let dataToSubmit = {
                        name: values.name,
                        lastName: values.lastName,
                        email: values.email,
                        password: values.password,
                        // Set an avatar image for user
                        image: `http://gravatar.com/avatar/${moment().unix()}?d=identicon`
                    };

                    dispatch(registerUser(dataToSubmit))
                        .then( response => {
                            if (response.payload.registerSuccess) {
                                props.history.push("/login");
                            } else {
                                alert(response.payload.err.errmsg)
                            }
                        })
                    
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
                        <h2>Sign up</h2>
                        <Form onSubmit={handleSubmit} style={{ minWidth: '375px' }} {...formItemLayout}>
                            <Form.Item required label="Name">
                                <Input
                                    id="name"
                                    placeholder="Enter your first name"
                                    type="text"
                                    value={values.name} 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.name && touched.name ? 'text-input error' : 'text-input'
                                    }
                                />
                                { errors.name && touched.name && (
                                    <div className="input-feedback">{errors.name}</div>
                                )}
                            </Form.Item>

                            <Form.Item required label="Last Name">
                                <Input
                                    id="lastName"
                                    placeholder="Enter your last name"
                                    type="text"
                                    value={values.lastName} 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.lastName && touched.lastName ? 'text-input error' : 'text-input'
                                    }
                                />
                                { errors.lastName && touched.lastName && (
                                    <div className="input-feedback">{errors.lastName}</div>
                                )}
                            </Form.Item>

                            <Form.Item required label="Email" hasFeedback validateStatus={errors.email && touched.email ? "error" : "success"}>
                                <Input
                                    id="email"
                                    placeholder="Enter email address"
                                    type="email"
                                    value={values.email} 
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.email && touched.email ? 'text-input error' : 'text-input'
                                    }
                                />
                                {errors.email && touched.email && (
                                    <div className="input-feedback">{errors.email}</div>
                                )}
                            </Form.Item>

                            <Form.Item required label="Password" hasFeedback validateStatus={errors.password && touched.password ? "error" : "success"}>
                                <Input 
                                    id="password"
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


                            <Form.Item required label="Confirm" hasFeedback>
                                <Input 
                                    id="confirmPassword"
                                    placeholder="Confirm password"
                                    type="confirmPassword"
                                    value={values.confirmPassword}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={
                                        errors.confirmPassword && touched.confirmPassword ? 'text-input error' : 'text-input'
                                    }
                                />
                                {errors.confirmPassword && touched.confirmPassword && (
                                    <div className="input-feedback">{errors.confirmPassword}</div>
                                )}
                            </Form.Item>

                            <Form.Item {...tailFormItemLayout}>
                                <Button onClick={handleSubmit} type="primary" disabled={isSubmitting}>
                                    Submit
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                );
            }
        }
        </Formik>
    );
}

export default RegisterPage;