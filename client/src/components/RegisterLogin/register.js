import React, { Component } from 'react';
import { connect } from 'react-redux';
import { registerUser }  from '../../actions/user_actions';

class Register extends Component {

    state={
        name: "",
        lastName: "",
        email: "",
        password: "",
        passwordConfirmation: "",
        errors: []
    }

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    displayErrors = errors => {
        return errors.map((err, i) => <p key={i}>{err}</p>)
    }

    isFormValid = () => {
        let errors = [];
        let error;

        if(this.isFormEmpty(this.state)) {
            error = { message: "Fill in all fields" }
            this.setState({ errors: errors.concat(error) });
        }
        else if(!this.isPasswordValid(this.state)) {
            error = { message: "Invalid password"}
            this.setState({ errors: errors.concat(error) });
        } else {
            return true;
        }
    }

    isPasswordValid = ({ password, passwordConfirmation }) => {
        if(password.length <= 6 || passwordConfirmation.length <= 6) {
            return false;
        } else if (password !== passwordConfirmation) {
            return false;
        } else {
            return true;
        }

    }

    // Validation to check if form is empty. Returns false if any fields are not filled in
    isFormEmpty = ({ name, lastName, email, password, passwordConfirmation }) => {
        return (
            !name.length || 
            !lastName.length ||
            !email.length ||
            !password.length ||
            !passwordConfirmation.length
        )
    }

    submitForm = e => {
        e.preventDefault();

        let registerData = {
            name: this.state.name,
            lastName: this.state.lastName,
            email: this.state.email,
            password: this.state.password,
            passwordConfirmation: this.state.passwordConfirmation
        }
        

        if(this.isFormValid()) {
            this.setState({ errors: [] })
            this.props.dispatch(registerUser(registerData))
                .then(response => {
                    
                    if(response.payload.loginSuccess) {
                        console.log(response);
                        this.props.history.push('/login')
                    } else {
                        console.log(response)
                        this.setState({
                            errors: this.state.errors.concat("Attempt to send data to database failed")
                        })
                    }
                })

                .catch(err => {
                    this.setState({
                        errors: this.state.errors.concat(err)
                    });
                })
        } else {
            console.error("Form is invalid")
        }
    }

    render() {
        return (
            <div className="container">
                <h2>Sign Up</h2>
                <div className="row">
                    <form className="col s12" onSubmit={this.submitForm}>
                        <div className="row"> 
                            <div className="input-field col s12"> 
                                <input
                                    name="name"
                                    value={this.state.name}
                                    onChange={this.handleChange}
                                    id="name"
                                    type="text"
                                    className="validate" /* this is from materialize css */
                                />
                                <label className="active" htmlFor="name">First Name</label>
                                <span 
                                    className="helper-text"
                                    data-error="Enter valid email address" /* materialize css */
                                    data-success="Great!"
                                ></span>
                            </div> 
                        </div>
                        <div className="row"> 
                            <div className="input-field col s12"> 
                                <input
                                    name="lastName"
                                    value={this.state.lastName}
                                    onChange={this.handleChange}
                                    id="lastName"
                                    type="text"
                                    className="validate" /* this is from materialize css */
                                />
                                <label className="active" htmlFor="lastName">Last Name</label>
                                <span 
                                    className="helper-text"
                                    data-error="Enter valid email address" /* materialize css */
                                    data-success="Great!"
                                ></span>
                            </div> 
                        </div>
                        <div className="row"> 
                            <div className="input-field col s12"> 
                                <input
                                    name="email"
                                    value={this.state.email}
                                    onChange={this.handleChange}
                                    id="email"
                                    type="email"
                                    className="validate" /* this is from materialize css */
                                />
                                <label className="active" htmlFor="email">Email</label>
                                <span 
                                    className="helper-text"
                                    data-error="Enter valid email address" /* materialize css */
                                    data-success="Great!"
                                ></span>
                            </div> 
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <input
                                    name="password"
                                    value={this.state.password}
                                    onChange={this.handleChange}
                                    id="password"
                                    type="password"
                                    className="validate" /* this is from materialize css */
                                />
                                <label className="active" htmlFor="password">Password</label>
                                
                            </div>
                        </div>

                        <div className="row">
                            <div className="input-field col s12">
                                <input
                                    name="passwordConfirmation"
                                    value={this.state.passwordConfirmation}
                                    onChange={this.handleChange}
                                    id="passwordConfirmation"
                                    type="password"
                                    className="validate" /* this is from materialize css */
                                />
                                <label className="active" htmlFor="passwordConfirmation">Confirm Password</label>
                                
                            </div>
                        </div>

                        {this.state.errors.length > 0 && (
                            <div>
                                { this.displayErrors(this.state.errors) }
                            </div>
                        )}

                        <div className="row">
                            <div className="col s12">
                                <button
                                    className="btn waves-effect red lighten-2" /* materialize css styling */
                                    type="submit"
                                    name="action"
                                    onClick={this.submitForm}
                                >Create an account</button>
                            </div>
                           
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

export default connect()(Register);