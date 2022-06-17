import React, { Component } from 'react';
import { initializeApp } from 'firebase/app';
import {
    getDatabase,
    onChildAdded, onChildChanged, onChildRemoved,
    ref, set, push, remove
} from "firebase/database";
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut
} from "firebase/auth";

import MessageEntry from './components/message-entry';
import FormInput from './components/form-input';

const firebaseConfig = {
    apiKey: `${process.env.REACT_APP_FIREBASE_apiKey}`,
    authDomain: `${process.env.REACT_APP_FIREBASE_authDomain}`,
    databaseURL: `${process.env.REACT_APP_FIREBASE_databaseURL}`,
    projectId: `${process.env.REACT_APP_FIREBASE_projectId}`,
    storageBucket: `${process.env.REACT_APP_FIREBASE_storageBucket}`,
    messagingSenderId: `${process.env.REACT_APP_FIREBASE_messagingSenderId}`
};
const firebase = initializeApp(firebaseConfig);
const auth = getAuth(firebase);
const db = getDatabase(firebase);

class App extends Component {
    constructor(props) {
        super(props);
        this.addMessage = this.addMessage.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.state = { email: '', password: '', messages: [], user: null };

        this.messagesRef = ref(db, 'messages');
    }

    componentDidMount() {
        onAuthStateChanged(auth, (user) => {
            if (user && this.state.messages.length === 0) {
                this.listenMessages();
            }

            this.setState({ user });
        });
    }

    onEmailChange = (ev) => {
        this.setState({ email: ev.target.value });
    };

    onPasswordChange = (ev) => {
        this.setState({ password: ev.target.value });
    };

    handleSignUp = (ev) => {
        createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
            .then(() => {
                this.listenMessages();
            })
            .catch((e) => {
                console.log(e);
            });
        ev.preventDefault();
    };

    handleLogIn = (ev) => {
        // const provider = new firebase.auth.GoogleAuthProvider()
        // firebase.auth().signInWithPopup(provider)
        signInWithEmailAndPassword(auth, this.state.email, this.state.password)
            .then(() => {
                console.log('handle log in');
                this.listenMessages();
            });
        ev.preventDefault();
    };

    handleLogOut = (ev) => {
        signOut(auth)
            .then(() => {
                // this.handleAuthChange()
                this.setState({ email: '', password: '', messages: [], user: null });
            });
    };

    addMessage(newMessage) {
        let newPush = push(this.messagesRef);
        newMessage = {
            uid: newPush.key,
            timestamp: newMessage.timestamp,
            email: newMessage.email,
            value: newMessage.value
        };
        set(ref(db, 'messages/' + newMessage.uid), newMessage);
    }

    updateMessage(updatedMessage) {
        set(ref(db, 'messages/' + updatedMessage.uid), updatedMessage);
    }

    deleteMessage(messageId) {
        remove(ref(db, 'messages/' + messageId));
    }

    listenMessages() {
        const messages = []; // bad lifecycle hygiene
        onChildAdded(this.messagesRef, (message) => {
            //limitToLast(10)
            if (message.val()) {
                messages.push(message.val());
                this.setState({
                    messages: [...messages]
                });
            }
        });
        onChildChanged(this.messagesRef, (message) => {
            let idx = this.state.messages.findIndex((msg) => msg.uid === message.val().uid);
            let messageList = this.state.messages;
            messageList.splice(idx, 1, message.val());
            this.setState({
                messages: messageList
            });
        });
        onChildRemoved(this.messagesRef, (message) => {
            let idx = this.state.messages.findIndex((msg) => msg.uid === message.val().uid);
            let messageList = this.state.messages;
            messageList.splice(idx, 1);
            this.setState({
                messages: messageList
            });
        });
    }

    displayUserInfo() {
        if (!this.state.user) {
            return (
                <form>
                    <input
                        type="text"
                        placeholder="email (a@a.com)"
                        onChange={this.onEmailChange}
                        value={this.state.email}
                        required />
                    <input
                        type="password"
                        placeholder="password (6 or more chars)"
                        onChange={this.onPasswordChange}
                        value={this.state.password}
                        required
                        title="atleast 6 chars" />
                    <button className="app__button" onClick={this.handleLogIn}>
                        Log In
                    </button>
                    <button className="app_button" onClick={this.handleSignUp}>
                        Sign Up
                    </button>
                </form>
            );
        } else {
            return (
                <span className='user-info'>
                    {'user: ' + this.state.user.email + ' '}
                    <button className="app__button" onClick={this.handleLogOut}>
                        Logout
                    </button>
                </span>
            );
        }
    }

    displayMessages() {
        if (this.state.user)
            return (
                <div key={'displayMessages'}>
                    {this.state.messages.map((ele, idx) => {
                        return (
                            <MessageEntry
                                onEdit={this.updateMessage}
                                onDelete={this.deleteMessage}
                                message={ele}
                                key={idx}
                                user={this.state.user.email} />
                        );
                    })}
                    <FormInput
                        user={this.state.user}
                        onInputSubmit={this.addMessage} />
                </div>
            );
    }

    render() {
        return (
            <div className="App">
                <span className='user-info'>React Chat App </span>
                <a
                    style={{ color: 'blue' }}
                    href="https://github.com/rblakeman/ChatApp">
                    GitHub Repo
                </a>
                <div className="Authentication">{this.displayUserInfo()}</div>
                <br />
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}>
                    {this.displayMessages()}
                </div>
            </div>
        );
    }
}

export default App;
