import React, { Component } from 'react'

class Delete extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        let thisnya = this;
        setTimeout(function () {
            thisnya.handleView('crud')
        }, 1000);
    }

    handleView(val) {
        this.props.userStore.redirectView(val);
    }

    render() {
        return (
            <div style={{ marginTop: 200 }} >
                <div><h1>Delete Success</h1></div>
            </div>
        )
    }
}

export default Delete
