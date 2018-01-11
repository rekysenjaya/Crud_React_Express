import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';

@observer
export default class TodoEntry extends React.Component {
	render() {
		return (
			<div className="form-post"><input
				ref="newField"
				className="new-todo"
				placeholder="Update status"
				onKeyDown={this.handleNewTodoKeyDown.bind(this)}
				autoFocus={true}
			/>
				<button className="post-button" onClick={this.postStatus.bind(this)}>Update</button>
			</div>);
	}

	handleNewTodoKeyDown = (event) => {
		if (event.keyCode !== 13)
			return;
		this.postStatus(event);
	};

	postStatus(event) {
		event.preventDefault();

		var val = ReactDOM.findDOMNode(this.refs.newField).value.trim();

		if (val) {
			this.props.statusStore.addTodo(val);
			ReactDOM.findDOMNode(this.refs.newField).value = '';
		}
	}
}

TodoEntry.propTypes = {
	statusStore: PropTypes.object.isRequired
};
