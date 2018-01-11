import { observable, reaction } from 'mobx';


export default class UserStore {
    @observable users = [];
    @observable usersAll = [];

    subscribeServerToStore() {
        reaction(
            () => this.toJS(),
            users => window.fetch && fetch('/api/users', {
                method: 'post',
                body: JSON.stringify({ users }),
                headers: new Headers({ 'Content-Type': 'application/json' })
            })
        );
    }


    userAllGet() {
        let thisnya = this;
        fetch(`http://localhost:3001/users/`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Token": (thisnya.users[0] && thisnya.users[0].token) ? thisnya.users[0].token : null
            }
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            thisnya.usersAll = Object.assign([], data);
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }


    userGet(id) {
        let thisnya = this;
        fetch(`http://localhost:3001/users/${id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Token": (thisnya.users[0] && thisnya.users[0].token) ? thisnya.users[0].token : null
            }
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            if (thisnya.users.length === 1) {
                thisnya.users[0] = data[0];
            } else {
                thisnya.users.push(data[0])
            }
            thisnya.users[0] = Object.assign({}, thisnya.users[0], { 'page': 'dashboard' });
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    isEmpty(val) {
        return !val;
    }

    userUpdate(val, token) {
        let thisnya = this;

        let newObj = {};
        Object.keys(val).forEach(function (k, i) {
            if (k == 'name' && !thisnya.isEmpty(val[k]) || k == 'email' && !thisnya.isEmpty(val[k]) || k == 'image' && !thisnya.isEmpty(val[k]) || k == 'password' && !thisnya.isEmpty(val[k])) {
                newObj[k] = val[k];
            }
        });

        fetch(`http://localhost:3001/users/${val.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                "Token": token
            },
            body: JSON.stringify(newObj)
        }).then(function (response) {
            if (response.status >= 400) {
                console.log('Bad response from server')
            }
            return response.json();
        }).then(function (data) {
            thisnya.redirectView('success')
            thisnya.userAllGet()
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    userDelete(val, token) {
        let thisnya = this;
        fetch(`http://localhost:3001/users/${val.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                "Token": token
            }
        }).then(function (response) {
            if (response.status >= 400) {
                console.log('Bad response from server')
            }
            return response.json();
        }).then(function (data) {
            thisnya.redirectView('delete')
            thisnya.userAllGet()
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    userLogin(val) {

        let thisnya = this;

        fetch(`http://localhost:3001/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Token": "register"
            },
            body: JSON.stringify(val)
        }).then(function (response) {
            if (response.status >= 400) {
                console.log('Bad response from server')
            }
            return response.json();
        }).then(function (data) {
            if (thisnya.users.length === 1) {
                thisnya.users[0] = data;
            } else {
                thisnya.users.push(data)
            }

            thisnya.users[0] = Object.assign({}, thisnya.users[0], { 'page': 'login' });
            setTimeout(function () {
                if (data.token)
                    return thisnya.users[0] = Object.assign({}, thisnya.users[0], { 'message': '', 'page': 'dashboard' });
                thisnya.users[0] = Object.assign({}, thisnya.users[0], { 'message': '', 'messageProfile': '' });
            }.bind(this), 1500);
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }

    userRegister(val) {

        let thisnya = this;

        fetch(`http://localhost:3001/users`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Token": "register"
            },
            body: JSON.stringify(val)
        }).then(function (response) {
            if (response.status >= 400) {
                console.log('Bad response from server')
            }
            return response.json();
        }).then(function (data) {

            thisnya.users[0] = Object.assign({}, thisnya.users[0], { 'page': 'login' }, data);
            setTimeout(function () {
                thisnya.users[0] = Object.assign({}, thisnya.users[0], { 'messageReg': '' });
            }.bind(this), 1500);
        }).catch(function (error) {
            thisnya.Message('register', 'There has been a problem with your fetch operation: ' + error.message);
        });
    }

    Message(form, message) {
        let objMessage = '';
        if (form === 'register')
            objMessage = 'messageReg'
        else if (form === 'login')
            objMessage = 'message'
        else if (form === 'profile')
            objMessage = 'messageProfile'
        let thisnya = this;
        setTimeout(function () {
            thisnya.users[0] = Object.assign({}, thisnya.users[0], { [objMessage]: '' });
        }, 2000);
        this.users[0] = Object.assign({}, this.users[0], { [objMessage]: message });
    }

    userDestroy() {
        this.users[0] = Object.assign({}, { 'page': 'login' });
    }

    redirectView(val) {
        if (val !== 'login') {
            return this.users[0] = Object.assign({}, this.users[0], { 'page': val });
        }
        this.userDestroy();
    }

    cekSession(val) {
        let thisnya = this;
        fetch(`http://localhost:3001/${val}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*",
                "Token": this.users[0].token
            }
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            if (data.session == 'destroy') {
                thisnya.userDestroy();
            }
        }).catch(function (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
        });
    }


    toJS() {
        return this.users.map(user => user);
    }

    static fromJS(array) {
        const userStore = new UserStore();
        userStore.users = array.map(item => item);
        return userStore;
    }
}
