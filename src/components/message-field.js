import React, { Component } from 'react'

import MessageEntry from './message-entry'

export default class MessageField extends Component {
  constructor(props) {
    super(props)
  }

  state = {
    messages: []
  }

  render() {
    return (
      <div>
        {this.state.messages.map((e, i) => {
          return <MessageEntry message={e} id={i} />
        })}
      </div>
    )
  }
}
