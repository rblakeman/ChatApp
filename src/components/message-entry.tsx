import React, { useState } from 'react';

import { Message } from '../typings';

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

type MessageEntryProps = {
    message: Message;
    userEmail: string | undefined;
    onDelete: (arg: string | null) => void;
    onEdit: (arg: Message) => void;
};
export default function MessageEntry({
    message,
    userEmail = undefined,
    onDelete,
    onEdit
}: MessageEntryProps) {
    const [editing, setEditing] = useState(false);
    const [currentMessage, setCurrentMessage] = useState(message.value);

    const handleEditButton = () => {
        setEditing(true);
    };

    const handleDeleteButton = () => {
        onDelete(message.uid);
    };

    const handleConfirmButton = () => {
        setEditing(false);
        let updatedMessage = {
            uid: message.uid,
            timestamp: message.timestamp,
            email: message.email,
            value: currentMessage
        };
        if (currentMessage) onEdit(updatedMessage);
    };

    const handleCancelButton = () => {
        setEditing(false);
        setCurrentMessage(message.value);
    };

    const handleTextEdit = (ev: React.ChangeEvent<HTMLInputElement>) => {
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
        if (userEmail && userEmail === message.email)
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
            // @ts-expect-error FIXME
            style={
                userEmail && message.email === userEmail
                    ? { ...styles.blue, ...styles.container }
                    : { ...styles.green, ...styles.container }
            }>
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
