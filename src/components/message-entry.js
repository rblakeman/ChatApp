import React, { Component } from 'react'

export default class MessageEntry extends Component {
  render() {
    console.log(this.props)
    return (
      <div>
        {this.props.message.userName +
          ' said: ' +
          this.props.message.value +
          ' on ' +
          this.props.message.timestamp}
      </div>
    )
  }
}
