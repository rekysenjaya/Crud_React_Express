import React, { Component } from 'react';
import notFile from '../components/imageDefault';


class Profile extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userData: {},
            editData: {},
            token: '',
            message: '',
            page: '',
            search: '',
            form: 'none'
        }
    }

    componentWillMount() {
        const { userStore } = this.props;
        userStore.cekSession('users');

        const data = (userStore.users && userStore.users[0]) ? userStore.users[0] : {};
        const { token, message, page } = userStore.users[0];
        this.setState({ userData: data, token: token, message: message, page: page })
    }

    componentDidMount() {
        this.props.userStore.userAllGet()
    }

    handleUpdate() {
        const { editData, token, message, page } = this.state;
        const email = editData.email;
        let lastAtPos = email.lastIndexOf('@');
        let lastDotPos = email.lastIndexOf('.');

        if (typeof email !== "undefined" && !(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') == -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
            this.props.userStore.Message('profile', 'Email is not valid');
            return;
        }
        this.setState({
            form: 'none',
            editData: {}
        })
        this.props.userStore.userUpdate(editData, token);
    }

    handleChange(val) {
        this.setState({
            editData: {
                ...this.state.editData, [val.target.name]: val.target.value
            }
        })
    }

    handleSearch(val) {
        this.setState({
            search: val.target.value
        })
    }

    handleView(val) {
        this.props.userStore.redirectView(val);
    }

    render() {
        const { statusStore, userStore } = this.props;
        const { userData, editData } = this.state;


        const { messageProfile } = (userStore.users && userStore.users[0]) ? userStore.users[0] : '';

        let list = null;
        if (userStore.usersAll.length) {
            list = userStore.usersAll.map((val, i) => {
                let row = (<tr key={i} >
                    <th scope="row">{val.id}</th>
                    <td>{val.name}</td>
                    <td>{val.email}</td>
                    <td>
                        {userData.email == val.email &&
                            <button style={{ backgroundColor: '#EC9718' }} onClick={() => {
                                Object.keys(val).forEach(function (k, i) {
                                    if (k === 'password') {
                                        delete val[k];
                                    }
                                });
                                this.setState({ editData: val, form: 'block' }
                                )
                            }
                            }>Update</button>
                        }
                        {userData.email != val.email &&
                            <button style={{ backgroundColor: '#d9534f' }} onClick={() => {
                                let r = confirm(`You sure delete ${val.name}?`);
                                if (r == true) {
                                    this.props.userStore.userDelete(val, this.state.token)
                                }
                            }
                            }>Delete</button>
                        }
                    </td>
                </tr>)
                if (this.state.search != '') {
                    let filter = null
                    if (val.name.toUpperCase().indexOf(this.state.search.toUpperCase()) != -1 || val.email.toUpperCase().indexOf(this.state.search.toUpperCase()) != -1) {
                        filter = row
                    }
                    return filter
                }
                return row
            })
        }
        return (
            <div>
                <div className="row-100">
                    <div className="body-profile">
                        <div className="row-100">
                            <input type="text" style={{ width: '100%' }} placeholder="Search" onChange={this.handleSearch.bind(this)} />
                            <br />
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list}
                                </tbody>
                            </table>
                        </div>
                        <br />
                        <br />
                        <br />
                        <div style={{ display: this.state.form }}>
                            <div style={{ position: 'relative', minHeight: 1, padding: 10, float: 'left', width: '15%' }} ></div>
                            <div className="row-70">
                                <label><b>Email</b></label>
                                <br />
                                <input type="text" placeholder="Enter Email" name="email" value={editData.email || ''} onChange={this.handleChange.bind(this)} />
                                <br />
                                <br />
                                <label><b>Name</b></label>
                                <br />
                                <input type="text" placeholder="Enter Name" name="name" value={editData.name || ''} onChange={this.handleChange.bind(this)} />
                                <br />
                                <br />

                                <label><b>Password</b></label>
                                <br />
                                <input type="password" placeholder="Enter Password" value={editData.password || ''} name="password" onChange={this.handleChange.bind(this)} />
                                <br />
                                <small>Masukan Password yang mudah di ingat</small>
                                <br />
                                <br />

                                {messageProfile && <div style={{ backgroundColor: '#f0ad4e', padding: '5px', boxShadow: '2px 6px 4px -4px black' }} >{messageProfile}</div>}
                                <button onClick={this.handleUpdate.bind(this)}>Save</button>
                            </div>
                        </div>

                        <br />
                        <br />
                        <br />
                        <button onClick={() => this.handleView('login')}>Logout</button>
                        <br />
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile