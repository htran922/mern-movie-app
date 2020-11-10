import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { loginUser } from '../../actions/user_actions';

class RegisterLogin extends Component {
    state = {
        email: "",
        password: "",
        errors: []
    }

  

    handleChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    
    // const { email } = this.state is the same as const email = this.state.email
    // isFormValid is a function which takes the state as a parameter 
    isFormValid = ({ email, password }) => email && password;

    displayErrors = errors => {
        return errors.map((err, i) => <p key={i}>{err}</p>)
    }

    submitForm = e => {
        e.preventDefault();

        const loginInfo = {
            email: this.state.email,
            password: this.state.password
        }

        if(this.isFormValid(this.state)) {
            // Empty out errors if form is valid
            this.setState({ errors: [] })
            // Sends request to backend using dispatch
            this.props.dispatch(loginUser(loginInfo))
                .then( res => {
                    if(res.payload.loginSuccess) {
                        // Load to home page 
                        this.props.history.push('/')
                        console.log("Login success")
                    } 
                    // TODO: DOESNT WORK
                    // Login fail
                    else {
                        this.setState({ 
                            errors: this.state.errors.concat(
                                "Login error. Email and password do not match."
                            )
                        })
                        
                    }
               
                })
        } else {
            this.setState({
                errors: this.state.errors.concat("Form is invalid")
            })
        }
    }

    render() {
        return (
            <div className="container">
                <h2>Login</h2>
                <div className="row">
                    <form className="col s12" onSubmit={this.submitForm}>
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
                                <span 
                                    className="helper-text"
                                    data-error="Incorrect password" /* materialize css */
                                    data-success="Great!"
                                ></span>
                            </div>
                        </div>

                        {this.state.errors.length > 0 && (
                            <div>
                                { this.displayErrors(this.state.errors) }
                            </div>
                        )}

                        <div className="row">
                            <div className="col 6">
                                <button
                                    className="btn waves-effect red lighten-2" /* materialize css styling */
                                    type="submit"
                                    // name="action"
                                    onClick={this.submitForm}
                                >Login</button>
                            </div>
                            <div className="col 6">
                                <Link to="/register">
                                    <button
                                        className="btn waves-effect red lighten-2" /* materialize css styling */
                                        type="submit"
                                        // name="action"
                                    >Sign Up</button>
                                </Link>
                                
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

function mapStateToProps( state ) {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(RegisterLogin);