import React, { Component } from 'react'
import firebase from 'firebase'

// import MessageField from './components/message-field'
import MessageEntry from './components/message-entry'
import FormInput from './components/form-input'

var firebaseConfig = {
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
    this.updateMessages = this.updateMessages.bind(this)
    this.state = { messages: [], user: null }

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

  handleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider()
    firebase.auth().signInWithPopup(provider)
  }

  handleLogOut() {
    firebase.auth().signOut()
  }

  updateMessages(newMessage) {
    this.messageRef.push(newMessage)
  }

  listenMessages() {
    this.messageRef.limitToLast(10).on('value', (message) => {
      this.setState({ messages: Object.values(message.val()) })
    })
  }

  render() {
    return (
      <div className="App">
        React Chat App
        <div className="Authentication">
          {!this.state.user ? (
            <button
              className="app__button"
              onClick={this.handleSignIn.bind(this)}
            >
              Sign in
            </button>
          ) : (
            <button
              className="app__button"
              onClick={this.handleLogOut.bind(this)}
            >
              Logout
            </button>
          )}
        </div>
        {/* <MessageField /> */}
        <div>
          {this.state.messages.map((ele, idx) => {
            return <MessageEntry message={ele} key={idx} />
          })}
        </div>
        <FormInput user={this.state.user} onInputSubmit={this.updateMessages} />
      </div>
    )
  }
}

export default App
