import React, { Component } from 'react'
import { observer } from 'mobx-react';

import Login from '../page/Login'
import Profile from '../page/Profile'
import Success from '../page/Success'
import Delete from '../page/Delete'

@observer
class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { userStore } = this.props;
        const view = (userStore.users[0] && userStore.users[0].page) ? userStore.users[0].page : '';
        let views = <div />
        if (view == 'login')
            views = (<Login userStore={userStore} />)
        else if (view == 'success')
            views = (<Success userStore={userStore} />)
        else if (view == 'delete')
            views = (<Delete userStore={userStore} />)
        else
            views = (<Profile userStore={userStore} />)
        return (
            <div>
                <div className="navbar">
                    <div><h1>Test Quantus  {userStore.users[0].name ? `User: ${userStore.users[0].name}` : ''}</h1></div>
                </div>
                {views}
            </div>
        )
    }
}

export default App
