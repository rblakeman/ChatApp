import React, { Component } from 'react'
import firebase from 'firebase'

import MessageEntry from './components/message-entry'
import FormInput from './components/form-input'

const firebaseConfig = {
  ***REMOVED***
  ***REMOVED***
  ***REMOVED***
  ***REMOVED***
  ***REMOVED***
  ***REMOVED***
}
firebase.initializeApp(firebaseConfig)

class App extends Component {
  constructor(props) {
    super(props)
    this.addMessage = this.addMessage.bind(this)
    this.updateMessage = this.updateMessage.bind(this)
    this.deleteMessage = this.deleteMessage.bind(this)
    this.state = { email: '', password: '', messages: [], user: null }

    this.messageRef = firebase
      .database()
      .ref()
      .child('messages')
    this.listenMessages()
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      this.setState({ user })
    })
  }

  onEmailChange = (ev) => {
    this.setState({ email: ev.target.value })
  }

  onPasswordChange = (ev) => {
    this.setState({ password: ev.target.value })
  }

  handleSignUp = (ev) => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.listenMessages()
      })
      .catch((e) => {
        console.log(e)
      })
    ev.preventDefault()
  }

  handleLogIn = (ev) => {
    // const provider = new firebase.auth.GoogleAuthProvider()
    // firebase.auth().signInWithPopup(provider)
    firebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then(() => {
        this.listenMessages()
      })
    ev.preventDefault()
  }

  handleLogOut = (ev) => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        // this.handleAuthChange()
        this.setState({ email: '', password: '', messages: [], user: null })
      })
  }

  addMessage(newMessage) {
    let newPush = this.messageRef.push()
    newMessage = {
      uid: newPush.key,
      timestamp: newMessage.timestamp,
      email: newMessage.email,
      value: newMessage.value
    }
    newPush.set(newMessage)
    // this.messageRef.push(newMessage)
  }

  updateMessage(updatedMessage) {
    firebase
      .database()
      .ref('messages/' + updatedMessage.uid)
      .set(updatedMessage)
  }

  deleteMessage(messageId) {
    firebase
      .database()
      .ref('messages/' + messageId)
      .remove()
  }

  listenMessages() {
    this.messageRef.on('value', (message) => {
      //limitToLast(10)
      if (message.val()) {
        this.setState({
          messages: Object.values(message.val())
        })
      }
    })
  }

  displayUserInfo() {
    if (!this.state.user) {
      return (
        <form>
          <input
            type="text"
            placeholder="email"
            onChange={this.onEmailChange}
            value={this.state.email}
            required
          />
          <input
            type="password"
            placeholder="password"
            onChange={this.onPasswordChange}
            value={this.state.password}
            required
            title="atleast 6 chars"
          />
          <button className="app__button" onClick={this.handleLogIn}>
            Log In
          </button>
          <button className="app_button" onClick={this.handleSignUp}>
            Sign Up
          </button>
        </form>
      )
    } else {
      return (
        <span>
          {'user: ' + this.state.user.email}
          <button className="app__button" onClick={this.handleLogOut}>
            Logout
          </button>
        </span>
      )
    }
  }

  displayMessages() {
    if (this.state.user)
      return (
        <span>
          {this.state.messages.map((ele, idx) => {
            return (
              <MessageEntry
                onEdit={this.updateMessage}
                onDelete={this.deleteMessage}
                message={ele}
                key={idx}
                user={this.state.user.email}
              />
            )
          })}
          <FormInput user={this.state.user} onInputSubmit={this.addMessage} />
        </span>
      )
  }

  render() {
    return (
      <div className="App">
        React Chat App{' '}
        <a
          style={{ color: 'blue' }}
          href="https://github.com/rblakeman/ChatApp"
        >
          GitHub Repo
        </a>
        <div className="Authentication">{this.displayUserInfo()}</div>
        <br />
        <div>{this.displayMessages()}</div>
      </div>
    )
  }
}

export default App
