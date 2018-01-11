import React, { Component } from 'react'
import { observer } from 'mobx-react';


@observer
class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataLog: {},
            dataReg: {}
        }
    }

    handleChange(val) {
        this.setState({
            dataLog: {
                ...this.state.dataLog, [val.target.name]: val.target.value
            }
        })
    }

    handleChangeReg(val) {
        this.setState({
            dataReg: {
                ...this.state.dataReg, [val.target.name]: val.target.value
            }
        })
    }

    handleMessage(val) {
        let email = this.state.dataLog.email;
        let password = this.state.dataLog.password;
        let name = ''
        if (val === 'register') {
            email = this.state.dataReg.email;
            password = this.state.dataReg.password;
            name = this.state.dataReg.name;
        }

        let lastAtPos = email.lastIndexOf('@');
        let lastDotPos = email.lastIndexOf('.');

        if (val === 'login') {
            if (typeof email !== "undefined" && !(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
                this.props.userStore.Message(val, 'Email is not valid');
                return true;
            } else if (!password || !email) {
                this.props.userStore.Message(val, 'Please enter all value');
                return true;
            } else {
                return false;
            }
        } else if (val === 'register') {
            if (typeof email !== "undefined" && !(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
                this.props.userStore.Message(val, 'Email is not valid');
                return true;
            } else if (typeof password !== "undefined" && password.length <= 5) {
                this.props.userStore.Message(val, 'Password min length 6');
                return true;
            } else if (!password || !email || !name) {
                this.props.userStore.Message(val, 'Please enter all value');
                return true;
            } else {
                return false;
            }
        }

    }

    handleInputForm() {
        if (!this.handleMessage('login')) {
            this.props.userStore.userLogin(this.state.dataLog);
            return this.setState({ dataLog: {} })
        }
    }

    handleRegister() {
        if (!this.handleMessage('register')) {
            this.props.userStore.userRegister(this.state.dataReg);
            return this.setState({ dataReg: {} })
        }
    }

    render() {
        const { userStore } = this.props;
        const { message, messageReg } = (userStore.users && userStore.users[0]) ? userStore.users[0] : '';

        const { dataLog, dataReg } = this.state;

        return (
            <div className="row-100">
                <div className="body-status">
                    <h2><b>LOGIN</b></h2>
                    <div className="container">
                        <label><b>Email</b></label>
                        <br />
                        <input type="text" placeholder="Email" name="email" value={dataLog.email || ''} onChange={this.handleChange.bind(this)} autoFocus={true} required />
                        <br />
                        <br />

                        <label><b>Password</b></label>
                        <br />
                        <input type="password" placeholder="Password" name="password" value={dataLog.password || ''} onChange={this.handleChange.bind(this)} onKeyDown={(e) => {
                            if (e.keyCode !== 13)
                                return;
                            this.handleInputForm()
                        }} required />
                        <br />
                        {message && <div style={{ backgroundColor: '#f0ad4e', padding: '5px', boxShadow: '2px 6px 4px -4px black' }} >{message}</div>}
                        <br />

                        <button type="submit" onClick={this.handleInputForm.bind(this)}>Login</button>
                    </div>
                    <hr />
                    <h2><b>REGISTER</b></h2>
                    <div className="container">
                        <label><b>Email</b></label>
                        <br />
                        <input type="text" placeholder="Email" name="email" value={dataReg.email || ''} onChange={this.handleChangeReg.bind(this)} />
                        <br />
                        <br />
                        <label><b>Name</b></label>
                        <br />
                        <input type="text" placeholder="Name" name="name" value={dataReg.name || ''} onChange={this.handleChangeReg.bind(this)} />
                        <br />
                        <br />

                        <label><b>Password</b></label>
                        <br />
                        <input type="password" placeholder="Password" name="password" value={dataReg.password || ''} onChange={this.handleChangeReg.bind(this)} onKeyDown={(e) => {
                            if (e.keyCode !== 13)
                                return;
                            this.handleRegister()
                        }} />
                        <br />
                        {messageReg && <div style={{ backgroundColor: '#f0ad4e', padding: '5px', boxShadow: '2px 6px 4px -4px black' }} >{messageReg}</div>}
                        <br />

                        <button onClick={this.handleRegister.bind(this)}>Register</button>
                    </div>
                </div>
            </div>
        )
    }
}


export default Login;