import React, { PureComponent } from 'react';

const styles = {
    container: {
        borderRadius: '20%',
        padding: '10px',
        margin: '5px',
        display: 'flex',
        flexDirection: 'column',
        minWidth: '300px'
    },
    blue: {
        backgroundColor: 'blue',
        color: 'white',
        textAlign: 'right'
    },
    green: {
        backgroundColor: 'green',
        color: 'white',
        textAlign: 'left'
    }
};

export default class MessageEntry extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
            message: this.props.message.value
        };
    }

    handleEditButton = (ev) => {
        this.setState({ editing: true });
    }

    handleDeleteButton = (ev) => {
        this.props.onDelete(this.props.message.uid);
    }

    handleConfirmButton = (ev) => {
        this.setState({ editing: false });
        let updatedMessage = {
            uid: this.props.message.uid,
            timestamp: this.props.message.timestamp,
            email: this.props.message.email,
            value: this.state.message
        };
        if (this.state.message) this.props.onEdit(updatedMessage); //<-- no id
    }

    handleCancelButton = (ev) => {
        this.setState({ editing: false, message: this.props.message.value });
    }

    handleTextEdit = (ev) => {
        this.setState({ message: ev.target.value });
    }

    editTextField = () => {
        if (!this.state.editing) {
            return <span>{this.props.message.value}</span>;
        } else {
            return (
                <span>
                    <input
                        type="text"
                        onChange={this.handleTextEdit}
                        value={this.state.message} />
                </span>
            );
        }
    }

    buttons() {
        if (this.props.user === this.props.message.email)
            if (!this.state.editing) {
                return (
                    <span>
                        <button onClick={this.handleEditButton}>edit</button>
                        <button onClick={this.handleDeleteButton}>delete</button>
                    </span>
                );
            } else {
                return (
                    <span>
                        <button onClick={this.handleConfirmButton}>confirm</button>
                        <button onClick={this.handleCancelButton}>cancel</button>
                    </span>
                );
            }
    }

    render() {
        // console.log(this.props.message)
        return (
            <div
                style={
                    this.props.message.email === this.props.user
                        ? { ...styles.blue, ...styles.container }
                        : { ...styles.green, ...styles.container }
                }
                key={this.props.uid}>
                <div>
                    {this.props.message.email + ' said: '}
                    {this.editTextField()}
                </div>
                <div>
                    {this.buttons()}
                    {this.props.message.timestamp}
                </div>
            </div>
        );
    }
}
