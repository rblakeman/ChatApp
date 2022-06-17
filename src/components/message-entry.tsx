import React, { useState } from 'react';

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

export default function MessageEntry(props) {
    const {
        message,
        uid,
        user,
        onDelete,
        onEdit
    } = props;

    const [editing, setEditing] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(message.value);

    const handleEditButton = (ev) => {
        setEditing(true);
    };

    const handleDeleteButton = (ev) => {
        onDelete(message.uid);
    };

    const handleConfirmButton = (ev) => {
        setEditing(false);
        let updatedMessage = {
            uid: message.uid,
            timestamp: message.timestamp,
            email: message.email,
            value: currentMessage
        };
        if (currentMessage) onEdit(updatedMessage);
    };

    const handleCancelButton = (ev) => {
        setEditing(false);
        setCurrentMessage(message.value);
    };

    const handleTextEdit = (ev) => {
        setCurrentMessage(ev.target.value);
    };

    const editTextField = () => {
        if (!editing) {
            return <span>{message.value}</span>;
        } else {
            return (
                <span>
                    <input
                        type="text"
                        onChange={handleTextEdit}
                        value={currentMessage} />
                </span>
            );
        }
    };

    const buttons = () => {
        if (user === message.email)
            if (!editing) {
                return (
                    <span>
                        <button onClick={handleEditButton}>edit</button>
                        <button onClick={handleDeleteButton}>delete</button>
                    </span>
                );
            } else {
                return (
                    <span>
                        <button onClick={handleConfirmButton}>confirm</button>
                        <button onClick={handleCancelButton}>cancel</button>
                    </span>
                );
            }
    };

    return (
        <div
            style={
                message.email === user
                    ? { ...styles.blue, ...styles.container }
                    : { ...styles.green, ...styles.container }
            }
            key={uid}>
            <div>
                {message.email + ' said: '}
                {editTextField()}
            </div>
            <div>
                {buttons()}
                {message.timestamp}
            </div>
        </div>
    );
}
