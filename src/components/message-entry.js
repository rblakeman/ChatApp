import React, { Component } from 'react'

export default class MessageEntry extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editing: false,
      message: this.props.message.value
    }
  }

  handleEditButton = (ev) => {
    this.setState({ editing: true })
  }

  handleConfirmButton = (ev) => {
    this.setState({ editing: false })
    let updatedMessage = {
      uid: this.props.message.uid,
      timestamp: this.props.message.timestamp,
      email: this.props.message.email,
      value: this.state.message
    }
    if (this.state.message) this.props.onEdit(updatedMessage) //<-- no id
  }

  handleDeleteButton = (ev) => {
    this.props.onDelete(this.props.message.uid)
  }

  handleTextEdit = (ev) => {
    this.setState({ message: ev.target.value })
  }

  editTextField = () => {
    if (!this.state.editing) {
      return <span>{this.props.message.value}</span>
    } else {
      return (
        <span>
          <input
            type="text"
            onChange={this.handleTextEdit}
            value={this.state.message}
          />
        </span>
      )
    }
  }

  buttons() {
    if (!this.state.editing) {
      return (
        <span>
          <button onClick={this.handleEditButton}>edit</button>
          <button onClick={this.handleDeleteButton}>delete</button>
        </span>
      )
    } else {
      return (
        <span>
          <button onClick={this.handleConfirmButton}>confirm</button>
        </span>
      )
    }
  }

  render() {
    // console.log(this.props.message)
    return (
      <div>
        {this.props.message.email + ' said: '}
        {this.editTextField()}
        {' on ' + this.props.message.timestamp}
        {this.buttons()}
      </div>
    )
  }
}
