import React, { Component } from 'react';
import firebase from 'firebase';

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
firebase.initializeApp(firebaseConfig);

class App extends Component {
    constructor(props) {
        super(props);
        this.addMessage = this.addMessage.bind(this);
        this.updateMessage = this.updateMessage.bind(this);
        this.deleteMessage = this.deleteMessage.bind(this);
        this.state = { email: '', password: '', messages: [], user: null };

        this.messageRef = firebase
            .database()
            .ref()
            .child('messages');

        this.listenMessages(); //unnecessary?
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
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
        firebase
            .auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
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
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.listenMessages();
            });
        ev.preventDefault();
    };

    handleLogOut = (ev) => {
        firebase
            .auth()
            .signOut()
            .then(() => {
                // this.handleAuthChange()
                this.setState({ email: '', password: '', messages: [], user: null });
            });
    };

    addMessage(newMessage) {
        let newPush = this.messageRef.push();
        newMessage = {
            uid: newPush.key,
            timestamp: newMessage.timestamp,
            email: newMessage.email,
            value: newMessage.value
        };
        newPush.set(newMessage);
        // this.messageRef.push(newMessage)
    }

    updateMessage(updatedMessage) {
        firebase
            .database()
            .ref('messages/' + updatedMessage.uid)
            .set(updatedMessage);
    }

    deleteMessage(messageId) {
        firebase
            .database()
            .ref('messages/' + messageId)
            .remove();
    }

    listenMessages() {
        this.messageRef.on('child_added', (message) => {
            //limitToLast(10)
            if (message.val()) {
                this.setState({
                    messages: [...this.state.messages, message.val()] //Object.values(message.val())
                });
            }
        });
        this.messageRef.on('child_changed', (message) => {
            let idx = this.state.messages.findIndex((msg) => msg.uid === message.val().uid);
            let messageList = this.state.messages;
            messageList.splice(idx, 1, message.val());
            this.setState({
                messages: messageList
            });
        });
        this.messageRef.on('child_removed', (message) => {
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
